"""Specialised agents — thin orchestration over LLM tasks."""

from __future__ import annotations

import uuid

from fastapi import APIRouter

from app.api.deps import CurrentUser, DbSession
from app.models import AgentRun, AgentRunStatus, AgentType
from app.schemas import AgentRunRequest, AgentRunResponse
from app.services.llm import LLMService

router = APIRouter(prefix="/agents", tags=["agents"])


@router.post("/run", response_model=AgentRunResponse)
async def run_agent(
    body: AgentRunRequest,
    user: CurrentUser,
    db: DbSession,
) -> AgentRunResponse:
    llm = LLMService()
    run_id = uuid.uuid4()

    if body.agent_type == AgentType.sales:
        output = await llm.classify_lead(
            body.payload,
            db=db,
            tenant_id=str(user.tenant_id),
            user_id=str(user.id),
        )
        tasks_delta = 1
        hours = 0.25
    elif body.agent_type == AgentType.support:
        ticket = body.payload.get("ticket_text") or str(body.payload)
        summary = await llm.summarize_document(
            ticket[:50_000],
            db=db,
            tenant_id=str(user.tenant_id),
            user_id=str(user.id),
        )
        output = {"summary": summary, "routing_hint": "tier_1_resolve"}
        tasks_delta = 1
        hours = 0.15
    else:  # ops
        proc = await llm.generate_response(
            "Draft checklist steps for executing this internal ops request:\n\n"
            + str(body.payload)[:24_000],
            None,
            db=db,
            tenant_id=str(user.tenant_id),
            user_id=str(user.id),
        )
        output = {"plan_markdown": proc}
        tasks_delta = 1
        hours = 0.2

    row = AgentRun(
        id=run_id,
        tenant_id=user.tenant_id,
        agent_type=body.agent_type,
        status=AgentRunStatus.completed,
        input_payload=body.payload,
        output_payload=output,
        tasks_completed_delta=tasks_delta,
        hours_saved_estimate=hours,
    )
    db.add(row)
    await db.flush()

    return AgentRunResponse(run_id=run_id, agent_type=body.agent_type, output=output)
