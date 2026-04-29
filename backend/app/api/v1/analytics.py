"""Operational KPI aggregates."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter
from sqlalchemy import func, select

from app.api.deps import CurrentUser, DbSession
from app.models import AgentRun, LLMUsageLog
from app.schemas import AnalyticsSummary

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
async def analytics_summary(user: CurrentUser, db: DbSession) -> AnalyticsSummary:
    cutoff = datetime.now(timezone.utc) - timedelta(days=30)

    tasks = await db.scalar(
        select(func.coalesce(func.sum(AgentRun.tasks_completed_delta), 0)).where(
            AgentRun.tenant_id == user.tenant_id,
            AgentRun.created_at >= cutoff,
        )
    )
    hours = await db.scalar(
        select(func.coalesce(func.sum(AgentRun.hours_saved_estimate), 0.0)).where(
            AgentRun.tenant_id == user.tenant_id,
            AgentRun.created_at >= cutoff,
        )
    )
    llm_calls = await db.scalar(
        select(func.count(LLMUsageLog.id)).where(
            LLMUsageLog.tenant_id == user.tenant_id,
            LLMUsageLog.created_at >= cutoff,
        )
    )

    return AnalyticsSummary(
        tasks_completed=int(tasks or 0),
        hours_saved_estimate=float(hours or 0),
        llm_calls_trailing_30d=int(llm_calls or 0),
    )
