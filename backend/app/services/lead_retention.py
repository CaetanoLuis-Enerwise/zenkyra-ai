"""Delete demo/pilot requests older than LEADS_RETENTION_DAYS.

The public privacy page states the default (365 days). Deletion runs when the
process starts, when a lead is stored, and when an operator lists the queue.
There is no separate nightly job.
"""

from __future__ import annotations

import logging
from datetime import timedelta

from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings, get_settings
from app.models import Lead, utcnow

logger = logging.getLogger(__name__)


async def purge_expired_leads(db: AsyncSession, settings: Settings | None = None) -> None:
    settings = settings or get_settings()
    cutoff = utcnow() - timedelta(days=settings.LEADS_RETENTION_DAYS)
    await db.execute(delete(Lead).where(Lead.created_at < cutoff))


async def purge_expired_leads_startup() -> None:
    """Best-effort. A database that is not up yet must not stop the API from booting."""
    from app.core.database import async_session_factory

    try:
        async with async_session_factory() as session:
            await purge_expired_leads(session)
            await session.commit()
    except Exception as exc:
        # The database error can include the connection string. Keep the type only.
        logger.warning("could not purge expired leads at startup: %s", type(exc).__name__)
