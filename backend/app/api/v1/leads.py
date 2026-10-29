"""Public lead capture: POST /api/v1/leads (no auth).

Used by the marketing site's "Book Executive Demo" (source=demo) and "Start €149 pilot"
(source=pilot) dialogs. Stores the lead, then notifies LEADS_NOTIFY_EMAIL and/or
LEADS_WEBHOOK_URL when those are set. The public response is only the id.

Abuse controls:
- Honeypot field `website`: if filled, respond 201 with a throwaway id and store nothing.
- Rate limit per client IP (request.client.host), kept in THIS PROCESS's memory only:
  every worker/replica has its own counters and they reset on restart. Behind a proxy,
  configure uvicorn --proxy-headers / --forwarded-allow-ips so client.host is the real IP.
"""

from __future__ import annotations

import logging
import time
import uuid
from collections import defaultdict, deque
from threading import Lock

from fastapi import APIRouter, HTTPException, Request, status

from app.api.deps import DbSession
from app.core.config import get_settings
from app.models import Lead, utcnow
from app.schemas import LeadCreate, LeadOut
from app.services.lead_notify import NotifyResult, notify_lead

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/leads", tags=["leads"])


class _InProcessRateLimiter:
    def __init__(self) -> None:
        self._hits: dict[str, deque[float]] = defaultdict(deque)
        self._lock = Lock()

    def allow(self, key: str, max_hits: int, window: float) -> bool:
        now = time.monotonic()
        with self._lock:
            q = self._hits[key]
            while q and now - q[0] >= window:
                q.popleft()
            if len(q) >= max_hits:
                return False
            q.append(now)
            return True

    def reset(self) -> None:
        with self._lock:
            self._hits.clear()


rate_limiter = _InProcessRateLimiter()


@router.post("", response_model=LeadOut, status_code=status.HTTP_201_CREATED)
async def create_lead(body: LeadCreate, request: Request, db: DbSession) -> LeadOut:
    settings = get_settings()
    ip = request.client.host if request.client else "unknown"
    if not rate_limiter.allow(
        ip, settings.LEADS_RATE_LIMIT_MAX, settings.LEADS_RATE_LIMIT_WINDOW_SECONDS
    ):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests; try again later",
        )
    if body.website:  # honeypot tripped: look successful, store nothing
        return LeadOut(id=uuid.uuid4())
    ua = request.headers.get("user-agent")
    lead = Lead(
        name=body.name.strip(),
        email=str(body.email).lower().strip(),
        company=body.company.strip(),
        message=(body.message or "").strip() or None,
        source=body.source,
        user_agent=ua[:512] if ua else None,
    )
    db.add(lead)
    await db.flush()
    try:
        result = await notify_lead(lead, settings)
    except Exception:
        # The row must survive a notifier bug. get_db commits after this returns.
        logger.exception("lead notification crashed")
        result = NotifyResult("failed", "notification error")
    lead.notify_status = result.status
    lead.notify_error = result.error
    lead.notified_at = utcnow() if result.status == "sent" else None
    if result.status == "failed":
        logger.error("lead %s notification failed: %s", lead.id, result.error)
    await db.flush()
    return LeadOut(id=lead.id)
