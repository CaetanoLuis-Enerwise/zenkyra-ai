"""Tell a human that a demo or pilot request was stored.

Two optional channels, both off until configured:

- Email via SMTP to LEADS_NOTIFY_EMAIL (Reply-To is the prospect, so a person can answer).
- HTTP POST to LEADS_WEBHOOK_URL. Format `json` (default) or `slack` (`{"text": ...}`).

The lead row is the source of truth. A channel failure is recorded on the row and does
not delete it. Secrets (SMTP password, webhook URL, webhook secret) are never put in
the stored error string.
"""

from __future__ import annotations

import asyncio
import hashlib
import hmac
import json
import logging
import smtplib
import ssl
from dataclasses import dataclass
from email.message import EmailMessage
from typing import Literal
from urllib.parse import urlparse

import httpx

from app.core.config import Settings, get_settings
from app.models import Lead

logger = logging.getLogger(__name__)

NotifyStatus = Literal["skipped", "sent", "failed"]


@dataclass(frozen=True)
class NotifyResult:
    status: NotifyStatus
    error: str | None = None


def notifier_configured(settings: Settings | None = None) -> bool:
    settings = settings or get_settings()
    return bool(_email_target(settings) or _webhook_target(settings))


def warn_if_leads_unnotified(settings: Settings | None = None) -> None:
    """Production with no destination means a request can sit unseen in Postgres."""
    settings = settings or get_settings()
    if settings.APP_ENV == "production" and not notifier_configured(settings):
        logger.warning(
            "Lead intake stores requests but nobody is notified. "
            "Set LEADS_NOTIFY_EMAIL (and SMTP_*) or LEADS_WEBHOOK_URL before the form is public."
        )


def _email_target(settings: Settings) -> str:
    return (settings.LEADS_NOTIFY_EMAIL or "").strip()


def _webhook_target(settings: Settings) -> str:
    return (settings.LEADS_WEBHOOK_URL or "").strip()


def _clip(text: str, limit: int = 300) -> str:
    text = " ".join(text.split())
    return text if len(text) <= limit else text[: limit - 1] + "…"


def _header_safe(value: str) -> str:
    """One line, no CR/LF, so a lead field cannot inject a second mail header."""
    cleaned = "".join(" " if (ch < " " or ch == "\x7f") else ch for ch in value)
    return " ".join(cleaned.split())


def _redact(text: str, settings: Settings) -> str:
    redacted = text
    for secret in (
        settings.SMTP_PASSWORD,
        settings.LEADS_WEBHOOK_SECRET,
        settings.LEADS_WEBHOOK_URL,
        settings.SMTP_USER,
    ):
        if secret:
            redacted = redacted.replace(secret, "[redacted]")
    return _clip(redacted)


def lead_payload(lead: Lead) -> dict:
    created = lead.created_at.isoformat() if lead.created_at else None
    return {
        "event": "lead.created",
        "id": str(lead.id),
        "created_at": created,
        "source": lead.source,
        "name": lead.name,
        "email": lead.email,
        "company": lead.company,
        "message": lead.message,
    }


def _slack_text(payload: dict) -> str:
    lines = [
        f"New {payload.get('source') or 'lead'} request",
        f"Name: {payload.get('name') or ''}",
        f"Email: {payload.get('email') or ''}",
        f"Company: {payload.get('company') or ''}",
        f"Lead id: {payload.get('id') or ''}",
    ]
    message = payload.get("message")
    if message:
        lines.extend(["", str(message)])
    lines.append("")
    lines.append("Nothing has been charged. Reply to the person if you want this pilot.")
    return "\n".join(lines)


def webhook_body(payload: dict, fmt: str) -> bytes:
    if fmt == "slack":
        encoded = json.dumps({"text": _slack_text(payload)}, ensure_ascii=False)
    else:
        encoded = json.dumps(payload, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
    return encoded.encode("utf-8")


def webhook_signature(secret: str, body: bytes) -> str:
    digest = hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest()
    return f"sha256={digest}"


def _webhook_url_problem(url: str) -> str | None:
    parsed = urlparse(url)
    host = (parsed.hostname or "").lower()
    if parsed.scheme not in {"http", "https"} or not host:
        return "webhook URL is invalid"
    if parsed.username or parsed.password:
        return "webhook URL must not include credentials"
    local = host in {"localhost", "127.0.0.1", "::1"}
    if parsed.scheme != "https" and not local:
        return "webhook URL must be https"
    return None


def _looks_like_email(value: str) -> bool:
    if any(ch in value for ch in "\r\n\t "):
        return False
    if value.count("@") != 1:
        return False
    local, _, domain = value.partition("@")
    return bool(local) and "." in domain and not domain.startswith(".") and not domain.endswith(".")


def _recipients(raw: str) -> tuple[list[str], str | None]:
    parts = [_header_safe(part) for part in raw.split(",") if part.strip()]
    if not parts:
        return [], "LEADS_NOTIFY_EMAIL is empty"
    if any(not _looks_like_email(part) for part in parts):
        return [], "LEADS_NOTIFY_EMAIL has an invalid address"
    return parts, None


def build_email(lead: Lead, settings: Settings, recipients: list[str]) -> EmailMessage:
    kind = "Pilot request" if lead.source == "pilot" else "Demo request"
    company = _header_safe(lead.company)[:80] or "unknown company"
    msg = EmailMessage()
    msg["From"] = _header_safe(settings.SMTP_FROM or "")
    msg["To"] = ", ".join(recipients)
    reply_to = _header_safe(lead.email)
    if reply_to:
        msg["Reply-To"] = reply_to
    msg["Subject"] = f"[Zenkyra] {kind} — {company}"
    message = (lead.message or "").strip() or "(no message)"
    body = (
        "A new request was stored. Nothing has been charged.\n"
        "\n"
        f"Source: {lead.source}\n"
        f"Name: {_header_safe(lead.name)}\n"
        f"Email: {lead.email}\n"
        f"Company: {_header_safe(lead.company)}\n"
        f"Lead id: {lead.id}\n"
        "\n"
        "Message:\n"
        f"{message}\n"
        "\n"
        "Reply to this email to answer them. "
        "If they asked for the €149 pilot, invoice it manually.\n"
    )
    msg.set_content(body)
    return msg


def send_email_sync(message: EmailMessage, settings: Settings) -> str | None:
    """Return an error string, or None. Does not raise. Does not include secrets."""
    host = (settings.SMTP_HOST or "").strip()
    sender = (settings.SMTP_FROM or "").strip()
    if not host or not sender:
        return "email notifier is missing SMTP_HOST or SMTP_FROM"
    try:
        with smtplib.SMTP(host, settings.SMTP_PORT, timeout=settings.LEADS_NOTIFY_TIMEOUT_SECONDS) as smtp:
            smtp.ehlo()
            if settings.SMTP_STARTTLS:
                smtp.starttls(context=ssl.create_default_context())
                smtp.ehlo()
            if (settings.SMTP_USER or "").strip():
                smtp.login(settings.SMTP_USER or "", settings.SMTP_PASSWORD or "")
            smtp.send_message(message)
    except Exception as exc:
        logger.warning("lead email notification failed: %s", type(exc).__name__)
        return type(exc).__name__
    return None


async def post_webhook(lead: Lead, settings: Settings) -> str | None:
    url = _webhook_target(settings)
    problem = _webhook_url_problem(url)
    if problem:
        return problem
    body = webhook_body(lead_payload(lead), settings.LEADS_WEBHOOK_FORMAT)
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Zenkyra-Leads/1",
    }
    secret = (settings.LEADS_WEBHOOK_SECRET or "").strip()
    if secret:
        headers["X-Zenkyra-Signature"] = webhook_signature(secret, body)
    try:
        async with httpx.AsyncClient(
            timeout=settings.LEADS_NOTIFY_TIMEOUT_SECONDS,
            follow_redirects=False,
        ) as client:
            response = await client.post(url, content=body, headers=headers)
    except Exception as exc:
        logger.warning("lead webhook notification failed: %s", type(exc).__name__)
        return type(exc).__name__
    if response.status_code >= 400 or response.is_redirect:
        return f"HTTP {response.status_code}"
    return None


async def _send_email(lead: Lead, settings: Settings) -> str | None:
    recipients, problem = _recipients(_email_target(settings))
    if problem:
        return problem
    message = build_email(lead, settings, recipients)
    return await asyncio.to_thread(send_email_sync, message, settings)


async def notify_lead(lead: Lead, settings: Settings | None = None) -> NotifyResult:
    """Deliver every configured channel. Never raises."""
    settings = settings or get_settings()
    names: list[str] = []
    coros = []
    if _webhook_target(settings):
        names.append("webhook")
        coros.append(post_webhook(lead, settings))
    if _email_target(settings):
        names.append("email")
        coros.append(_send_email(lead, settings))
    if not coros:
        return NotifyResult("skipped")

    outcomes = await asyncio.gather(*coros, return_exceptions=True)
    errors: list[str] = []
    for name, outcome in zip(names, outcomes, strict=True):
        if isinstance(outcome, BaseException):
            logger.error(
                "lead %s %s notification crashed: %s",
                lead.id,
                name,
                type(outcome).__name__,
            )
            errors.append(f"{name}: {type(outcome).__name__}")
        elif outcome:
            errors.append(f"{name}: {outcome}")
    if errors:
        return NotifyResult("failed", _redact("; ".join(errors), settings))
    return NotifyResult("sent")
