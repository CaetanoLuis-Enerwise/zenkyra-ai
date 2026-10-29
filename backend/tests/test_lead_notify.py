"""Lead notification: email and/or webhook when a demo/pilot request is stored.

The public response stays {id}. Operators read the queue with the service token.
"""

import hashlib
import hmac
import json
import logging
import uuid
from datetime import timedelta

import httpx
import pytest
import smtplib

from app.core.config import get_settings
from app.models import Lead, utcnow
from app.services.lead_notify import warn_if_leads_unnotified
from sqlalchemy import select

URL = "/api/v1/leads"
ADMIN = "/api/v1/admin/leads"
BODY = {
    "name": "Ana Silva",
    "email": "Ana@Example.com",
    "company": "Silva Lda",
    "message": "Interested in the 14-day pilot.",
    "source": "pilot",
}

WEBHOOK = "https://hooks.example/lead"
SECRET = "webhook-secret-not-for-logs"
SMTP_PASSWORD = "smtp-password-not-for-logs"


def _clear():
    get_settings.cache_clear()


class CaptureClient:
    calls: list[dict] = []

    def __init__(self, *args, **kwargs):
        self.kwargs = kwargs

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        return False

    async def post(self, url, content=None, headers=None):
        CaptureClient.calls.append(
            {"url": url, "content": content, "headers": dict(headers or {}), "kwargs": self.kwargs}
        )
        return httpx.Response(204)


class BoomClient(CaptureClient):
    async def post(self, url, content=None, headers=None):
        raise httpx.ConnectError(
            f"connection failed calling {WEBHOOK}?token={SECRET}",
            request=httpx.Request("POST", url),
        )


class StatusClient(CaptureClient):
    async def post(self, url, content=None, headers=None):
        CaptureClient.calls.append({"url": url, "content": content, "headers": dict(headers or {})})
        return httpx.Response(500)


class FakeSMTP:
    instances: list["FakeSMTP"] = []

    def __init__(self, host, port, timeout=None):
        self.host = host
        self.port = port
        self.timeout = timeout
        self.started_tls = False
        self.logged_in = None
        self.sent = None
        FakeSMTP.instances.append(self)

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False

    def ehlo(self):
        return (250, b"ok")

    def starttls(self, context=None):
        self.started_tls = True

    def login(self, user, password):
        self.logged_in = (user, password)

    def send_message(self, msg):
        self.sent = msg


class AuthFailSMTP(FakeSMTP):
    def login(self, user, password):
        self.logged_in = (user, password)
        raise smtplib.SMTPAuthenticationError(535, b"bad credentials " + password.encode())


@pytest.fixture(autouse=True)
def _reset_captures():
    CaptureClient.calls = []
    FakeSMTP.instances = []
    yield
    _clear()


def _enable(monkeypatch, **env):
    for key, value in env.items():
        if value is None:
            monkeypatch.delenv(key, raising=False)
        else:
            monkeypatch.setenv(key, value)
    _clear()


async def _lead(session_factory, lead_id):
    async with session_factory() as s:
        return (
            await s.execute(select(Lead).where(Lead.id == uuid.UUID(str(lead_id))))
        ).scalar_one()


def _sig(secret: str, body: bytes) -> str:
    return "sha256=" + hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()


async def test_no_destination_skips_and_does_not_call_out(client, session_factory, monkeypatch):
    monkeypatch.setattr("app.services.lead_notify.httpx.AsyncClient", CaptureClient)
    monkeypatch.setattr("app.services.lead_notify.smtplib.SMTP", FakeSMTP)
    r = await client.post(URL, json=BODY)
    assert r.status_code == 201
    lead = await _lead(session_factory, r.json()["id"])
    assert lead.notify_status == "skipped"
    assert CaptureClient.calls == []
    assert FakeSMTP.instances == []


async def test_webhook_posts_signed_json_and_marks_sent(client, session_factory, monkeypatch):
    _enable(monkeypatch, LEADS_WEBHOOK_URL=WEBHOOK, LEADS_WEBHOOK_SECRET=SECRET)
    monkeypatch.setattr("app.services.lead_notify.httpx.AsyncClient", CaptureClient)
    r = await client.post(URL, json=BODY, headers={"User-Agent": "pytest"})
    assert r.status_code == 201 and set(r.json()) == {"id"}
    assert len(CaptureClient.calls) == 1
    call = CaptureClient.calls[0]
    assert call["url"] == WEBHOOK
    assert call["kwargs"]["follow_redirects"] is False
    payload = json.loads(call["content"])
    assert payload["event"] == "lead.created"
    assert payload["email"] == "ana@example.com"
    assert payload["source"] == "pilot"
    assert payload["company"] == "Silva Lda"
    assert "user_agent" not in payload
    assert call["headers"]["X-Zenkyra-Signature"] == _sig(SECRET, call["content"])
    assert SECRET not in call["content"].decode()
    lead = await _lead(session_factory, r.json()["id"])
    assert lead.notify_status == "sent" and lead.notified_at is not None
    assert lead.notify_error is None


async def test_slack_format_is_text_only(client, monkeypatch):
    _enable(
        monkeypatch,
        LEADS_WEBHOOK_URL=WEBHOOK,
        LEADS_WEBHOOK_FORMAT="slack",
        LEADS_WEBHOOK_SECRET=SECRET,
    )
    monkeypatch.setattr("app.services.lead_notify.httpx.AsyncClient", CaptureClient)
    r = await client.post(URL, json=BODY)
    assert r.status_code == 201
    body = json.loads(CaptureClient.calls[0]["content"])
    assert set(body) == {"text"}
    assert "Silva Lda" in body["text"]
    assert "ana@example.com" in body["text"]
    assert "Nothing has been charged" in body["text"]
    assert CaptureClient.calls[0]["headers"]["X-Zenkyra-Signature"] == _sig(
        SECRET, CaptureClient.calls[0]["content"]
    )


async def test_webhook_failure_keeps_the_lead_and_hides_secrets(client, session_factory, monkeypatch, caplog):
    _enable(monkeypatch, LEADS_WEBHOOK_URL=f"{WEBHOOK}?token={SECRET}", LEADS_WEBHOOK_SECRET=SECRET)
    monkeypatch.setattr("app.services.lead_notify.httpx.AsyncClient", BoomClient)
    with caplog.at_level(logging.DEBUG):
        r = await client.post(URL, json=BODY)
    assert r.status_code == 201
    lead = await _lead(session_factory, r.json()["id"])
    assert lead.notify_status == "failed"
    assert lead.notified_at is None
    assert lead.notify_error is not None
    assert "ConnectError" in lead.notify_error
    assert SECRET not in lead.notify_error
    assert SECRET not in caplog.text
    assert WEBHOOK not in lead.notify_error


async def test_http_webhook_and_credentialed_url_do_not_send(client, session_factory, monkeypatch):
    monkeypatch.setattr("app.services.lead_notify.httpx.AsyncClient", CaptureClient)
    _enable(monkeypatch, LEADS_WEBHOOK_URL="http://hooks.example/lead")
    r = await client.post(URL, json=BODY)
    assert r.status_code == 201
    lead = await _lead(session_factory, r.json()["id"])
    assert lead.notify_status == "failed"
    assert "https" in (lead.notify_error or "")
    assert CaptureClient.calls == []

    _enable(monkeypatch, LEADS_WEBHOOK_URL="https://user:secret-pass@hooks.example/lead")
    r = await client.post(URL, json=BODY | {"email": "second@example.com"})
    lead = await _lead(session_factory, r.json()["id"])
    assert lead.notify_status == "failed"
    assert "credentials" in (lead.notify_error or "")
    assert "secret-pass" not in (lead.notify_error or "")
    assert CaptureClient.calls == []


async def test_email_sets_reply_to_and_strips_header_injection(client, session_factory, monkeypatch):
    _enable(
        monkeypatch,
        LEADS_NOTIFY_EMAIL="founder@example.com, ops@example.com",
        SMTP_HOST="smtp.example",
        SMTP_PORT="587",
        SMTP_USER="apikey",
        SMTP_PASSWORD=SMTP_PASSWORD,
        SMTP_FROM="Zenkyra <notify@example.com>",
        SMTP_STARTTLS="true",
    )
    monkeypatch.setattr("app.services.lead_notify.smtplib.SMTP", FakeSMTP)
    evil = "Silva Lda\r\nBcc: evil@example.com"
    r = await client.post(URL, json=BODY | {"company": evil})
    assert r.status_code == 201
    assert len(FakeSMTP.instances) == 1
    smtp = FakeSMTP.instances[0]
    assert smtp.started_tls is True
    assert smtp.logged_in == ("apikey", SMTP_PASSWORD)
    msg = smtp.sent
    assert msg["Reply-To"] == "ana@example.com"
    assert msg["To"] == "founder@example.com, ops@example.com"
    assert msg["From"] == "Zenkyra <notify@example.com>"
    assert "\n" not in msg["Subject"] and "\r" not in msg["Subject"]
    assert "Bcc" not in msg
    assert all("\n" not in str(msg[key]) and "\r" not in str(msg[key]) for key in msg.keys())
    assert "Silva Lda Bcc:" in msg["Subject"]
    assert SMTP_PASSWORD not in msg.as_string()
    raw = msg.as_string()
    assert "Nothing has been charged" in raw
    assert "ana@example.com" in raw
    lead = await _lead(session_factory, r.json()["id"])
    assert lead.notify_status == "sent"
    assert SMTP_PASSWORD not in (lead.notify_error or "")


async def test_smtp_auth_failure_stores_type_only(client, session_factory, monkeypatch, caplog):
    _enable(
        monkeypatch,
        LEADS_NOTIFY_EMAIL="founder@example.com",
        SMTP_HOST="smtp.example",
        SMTP_FROM="notify@example.com",
        SMTP_USER="apikey",
        SMTP_PASSWORD=SMTP_PASSWORD,
    )
    monkeypatch.setattr("app.services.lead_notify.smtplib.SMTP", AuthFailSMTP)
    with caplog.at_level(logging.DEBUG):
        r = await client.post(URL, json=BODY)
    assert r.status_code == 201
    lead = await _lead(session_factory, r.json()["id"])
    assert lead.notify_status == "failed"
    assert lead.notify_error == "email: SMTPAuthenticationError"
    assert SMTP_PASSWORD not in lead.notify_error
    assert SMTP_PASSWORD not in caplog.text


async def test_email_without_smtp_host_fails_closed(client, session_factory, monkeypatch):
    _enable(monkeypatch, LEADS_NOTIFY_EMAIL="founder@example.com")
    monkeypatch.setattr("app.services.lead_notify.smtplib.SMTP", FakeSMTP)
    r = await client.post(URL, json=BODY)
    lead = await _lead(session_factory, r.json()["id"])
    assert lead.notify_status == "failed"
    assert "SMTP_HOST" in (lead.notify_error or "")
    assert FakeSMTP.instances == []


async def test_partial_channel_failure_is_failed(client, session_factory, monkeypatch):
    _enable(
        monkeypatch,
        LEADS_WEBHOOK_URL=WEBHOOK,
        LEADS_NOTIFY_EMAIL="founder@example.com",
        SMTP_HOST="smtp.example",
        SMTP_FROM="notify@example.com",
        SMTP_STARTTLS="false",
    )
    monkeypatch.setattr("app.services.lead_notify.httpx.AsyncClient", StatusClient)
    monkeypatch.setattr("app.services.lead_notify.smtplib.SMTP", FakeSMTP)
    r = await client.post(URL, json=BODY)
    lead = await _lead(session_factory, r.json()["id"])
    assert lead.notify_status == "failed"
    assert "webhook: HTTP 500" in (lead.notify_error or "")
    assert "email:" not in (lead.notify_error or "")
    assert FakeSMTP.instances[0].started_tls is False
    assert FakeSMTP.instances[0].sent is not None


async def test_honeypot_does_not_notify(client, session_factory, monkeypatch):
    _enable(monkeypatch, LEADS_WEBHOOK_URL=WEBHOOK, LEADS_NOTIFY_EMAIL="founder@example.com", SMTP_HOST="smtp.example", SMTP_FROM="notify@example.com")
    monkeypatch.setattr("app.services.lead_notify.httpx.AsyncClient", CaptureClient)
    monkeypatch.setattr("app.services.lead_notify.smtplib.SMTP", FakeSMTP)
    r = await client.post(URL, json=BODY | {"website": "http://spam.example"})
    assert r.status_code == 201
    async with session_factory() as s:
        assert (await s.execute(select(Lead))).scalar_one_or_none() is None
    assert CaptureClient.calls == []
    assert FakeSMTP.instances == []


async def test_localhost_http_webhook_is_allowed(client, monkeypatch):
    _enable(monkeypatch, LEADS_WEBHOOK_URL="http://127.0.0.1:9/hook")
    monkeypatch.setattr("app.services.lead_notify.httpx.AsyncClient", CaptureClient)
    r = await client.post(URL, json=BODY)
    assert r.status_code == 201
    assert CaptureClient.calls[0]["url"] == "http://127.0.0.1:9/hook"


async def test_admin_leads_503_when_service_token_unset(client):
    assert (await client.get(ADMIN)).status_code == 503


async def test_admin_lists_newest_first_and_requires_service_token(client, service_token, session_factory):
    assert (await client.get(ADMIN)).status_code == 401
    assert (await client.get(ADMIN, headers={"X-Service-Token": "nope"})).status_code == 401
    first = await client.post(URL, json=BODY)
    second = await client.post(URL, json=BODY | {"email": "bia@example.com", "source": "demo"})
    assert first.status_code == second.status_code == 201
    async with session_factory() as s:
        older = (await s.execute(select(Lead).where(Lead.email == "ana@example.com"))).scalar_one()
        newer = (await s.execute(select(Lead).where(Lead.email == "bia@example.com"))).scalar_one()
        older.created_at = utcnow() - timedelta(days=1)
        newer.created_at = utcnow()
        await s.commit()

    headers = {"X-Service-Token": service_token}
    page = (await client.get(ADMIN, headers=headers, params={"limit": 1})).json()
    assert len(page) == 1 and page[0]["email"] == "bia@example.com"
    assert page[0]["source"] == "demo"
    assert page[0]["notify_status"] == "skipped"
    assert "user_agent" not in page[0]
    rest = (await client.get(ADMIN, headers=headers, params={"limit": 1, "offset": 1})).json()
    assert rest[0]["email"] == "ana@example.com"
    assert (await client.get(ADMIN, headers=headers, params={"limit": 0})).status_code == 422
    assert (await client.get(ADMIN, headers=headers, params={"offset": 1001})).status_code == 422


def test_production_without_notifier_warns(monkeypatch, caplog):
    monkeypatch.setenv("APP_ENV", "production")
    monkeypatch.delenv("LEADS_NOTIFY_EMAIL", raising=False)
    monkeypatch.delenv("LEADS_WEBHOOK_URL", raising=False)
    _clear()
    with caplog.at_level(logging.WARNING):
        warn_if_leads_unnotified()
    assert "nobody is notified" in caplog.text


def test_development_without_notifier_is_quiet(monkeypatch, caplog):
    monkeypatch.setenv("APP_ENV", "development")
    monkeypatch.delenv("LEADS_NOTIFY_EMAIL", raising=False)
    monkeypatch.delenv("LEADS_WEBHOOK_URL", raising=False)
    _clear()
    with caplog.at_level(logging.WARNING):
        warn_if_leads_unnotified()
    assert "nobody is notified" not in caplog.text
