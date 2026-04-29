"""RAG chat with persisted conversation history."""

from __future__ import annotations

import uuid

from fastapi import APIRouter
from sqlalchemy import select

from app.api.deps import CurrentUser, DbSession
from app.models import Conversation, Message
from app.schemas import ChatMessageRequest, ChatMessageResponse
from app.services.llm import LLMService
from app.services.rag import retrieve_context

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/messages", response_model=ChatMessageResponse)
async def chat_message(
    body: ChatMessageRequest,
    user: CurrentUser,
    db: DbSession,
) -> ChatMessageResponse:
    if body.conversation_id:
        r = await db.execute(
            select(Conversation).where(
                Conversation.id == body.conversation_id,
                Conversation.tenant_id == user.tenant_id,
                Conversation.user_id == user.id,
            )
        )
        conv = r.scalar_one_or_none()
        if not conv:
            from fastapi import HTTPException

            raise HTTPException(404, "Conversation not found")
    else:
        conv = Conversation(
            tenant_id=user.tenant_id,
            user_id=user.id,
            title=body.message[:120],
        )
        db.add(conv)
        await db.flush()

    db.add(
        Message(
            conversation_id=conv.id,
            role="user",
            content=body.message,
        )
    )
    await db.flush()

    hist = (
        (
            await db.execute(
                select(Message)
                .where(Message.conversation_id == conv.id)
                .order_by(Message.created_at.desc())
                .limit(14)
            )
        )
        .scalars()
        .all()
    )
    hist = list(reversed(hist))
    lines = []
    for m in hist[:-1]:
        lines.append(f"{m.role}: {m.content[:600]}")
    history_snippet = "\n".join(lines[-10:])

    context = await retrieve_context(str(user.tenant_id), body.message)

    llm = LLMService()
    assembled = (
        f"Conversation memory (truncated):\n{history_snippet}\n\n"
        f"Current user message:\n{body.message}"
    )
    reply = await llm.generate_response(
        assembled,
        context if context else None,
        db=db,
        tenant_id=str(user.tenant_id),
        user_id=str(user.id),
    )

    db.add(
        Message(
            conversation_id=conv.id,
            role="assistant",
            content=reply,
            meta={"rag_context_chars": len(context)},
        )
    )
    await db.flush()

    return ChatMessageResponse(conversation_id=conv.id, reply=reply)


@router.get("/conversations/{conversation_id}/messages")
async def list_messages(
    conversation_id: uuid.UUID,
    user: CurrentUser,
    db: DbSession,
) -> list[dict]:
    r = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.tenant_id == user.tenant_id,
            Conversation.user_id == user.id,
        )
    )
    if not r.scalar_one_or_none():
        from fastapi import HTTPException

        raise HTTPException(404, "Conversation not found")

    msgs = (
        (
            await db.execute(
                select(Message)
                .where(Message.conversation_id == conversation_id)
                .order_by(Message.created_at.asc())
            )
        )
        .scalars()
        .all()
    )
    return [
        {"role": m.role, "content": m.content, "created_at": m.created_at.isoformat()}
        for m in msgs
    ]
