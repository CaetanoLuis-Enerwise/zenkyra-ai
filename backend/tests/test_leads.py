"""POST /api/v1/leads (public lead capture)."""

import uuid
from datetime import timedelta

from sqlalchemy import func, select

from app.core.config import get_settings
from app.models import Lead, utcnow

URL = "/api/v1/leads"
BODY = {
    "name": "Ana Silva",
    "email": "Ana@Example.com",
    "company": "Silva Lda",
    "message": "Interested in the 14-day pilot.",
    "source": "pilot",
}


async def _count(session_factory) -> int:
    async with session_factory() as s:
        return (await s.execute(select(func.count()).select_from(Lead))).scalar_one()


async def test_create_lead_stores_row(client, session_factory):
    r = await client.post(URL, json=BODY, headers={"User-Agent": "pytest-ua"})
    assert r.status_code == 201
    lead_id = uuid.UUID(r.json()["id"])
    async with session_factory() as s:
        lead = (await s.execute(select(Lead).where(Lead.id == lead_id))).scalar_one()
    assert lead.email == "ana@example.com"
    assert lead.source == "pilot"
    assert lead.company == "Silva Lda"
    assert lead.user_agent == "pytest-ua"
    assert lead.created_at is not None
    assert lead.notify_status == "skipped"
    assert lead.notify_error is None
    assert lead.notified_at is None
    assert set(r.json()) == {"id"}


async def test_message_optional_and_demo_source(client, session_factory):
    body = {k: v for k, v in BODY.items() if k != "message"} | {"source": "demo"}
    r = await client.post(URL, json=body)
    assert r.status_code == 201
    assert await _count(session_factory) == 1


async def test_validation_422(client, session_factory):
    bad = [
        BODY | {"email": "not-an-email"},
        BODY | {"source": "newsletter"},
        BODY | {"name": ""},
        BODY | {"company": "x" * 201},
        BODY | {"message": "m" * 2001},
        {k: v for k, v in BODY.items() if k != "company"},
    ]
    for b in bad:
        assert (await client.post(URL, json=b)).status_code == 422, b
    assert await _count(session_factory) == 0


async def test_honeypot_returns_201_but_stores_nothing(client, session_factory):
    r = await client.post(URL, json=BODY | {"website": "http://spam.example"})
    assert r.status_code == 201
    uuid.UUID(r.json()["id"])
    assert await _count(session_factory) == 0


async def test_requests_older_than_retention_are_deleted(client, session_factory, monkeypatch):
    monkeypatch.setenv("LEADS_RETENTION_DAYS", "30")
    get_settings.cache_clear()
    first = await client.post(URL, json=BODY)
    assert first.status_code == 201
    async with session_factory() as s:
        lead = (await s.execute(select(Lead))).scalar_one()
        lead.created_at = utcnow() - timedelta(days=31)
        await s.commit()
    second = await client.post(URL, json=BODY | {"email": "bia@example.com", "source": "demo"})
    assert second.status_code == 201
    async with session_factory() as s:
        emails = set((await s.execute(select(Lead.email))).scalars().all())
    assert emails == {"bia@example.com"}
    get_settings.cache_clear()


async def test_rate_limit_per_ip(client, session_factory, monkeypatch):
    from app.core.config import get_settings

    monkeypatch.setenv("LEADS_RATE_LIMIT_MAX", "3")
    get_settings.cache_clear()
    codes = [(await client.post(URL, json=BODY)).status_code for _ in range(4)]
    assert codes == [201, 201, 201, 429]
    assert await _count(session_factory) == 3
