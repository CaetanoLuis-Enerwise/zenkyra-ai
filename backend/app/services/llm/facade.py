"""High-level LLM facade — routing, logging, registry."""

from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import LLMUsageLog
from app.services.llm.base import TokenUsage
from app.services.llm.registry import get_llm_provider


def log_token_usage(
    db: AsyncSession | None,
    *,
    tenant_id: str | None,
    user_id: str | None,
    provider: str,
    model: str,
    operation: str,
    usage: TokenUsage,
    meta: dict[str, Any] | None = None,
) -> None:
    if db is None:
        return

    def _parse(uid: str | None):
        if not uid:
            return None
        try:
            return uuid.UUID(uid)
        except ValueError:
            return None

    row = LLMUsageLog(
        id=uuid.uuid4(),
        tenant_id=_parse(tenant_id),
        user_id=_parse(user_id),
        provider=provider,
        model=model,
        operation=operation,
        prompt_tokens=usage.prompt_tokens,
        completion_tokens=usage.completion_tokens,
        total_tokens=usage.total_tokens,
        meta=meta or {},
    )
    db.add(row)


class LLMService:
    """Application-level LLM operations with optional persistence."""

    def __init__(self, provider_name: str | None = None) -> None:
        self.provider = get_llm_provider(provider_name)

    async def generate_response(
        self,
        prompt: str,
        context: str | None = None,
        *,
        db: AsyncSession | None = None,
        tenant_id: str | None = None,
        user_id: str | None = None,
    ) -> str:
        text, usage = await self.provider.generate_response(prompt, context)
        log_token_usage(
            db,
            tenant_id=tenant_id,
            user_id=user_id,
            provider=self.provider.name,
            model=self.provider.chat_model_name,
            operation="generate_response",
            usage=usage,
        )
        return text

    async def summarize_document(
        self,
        text: str,
        *,
        db: AsyncSession | None = None,
        tenant_id: str | None = None,
        user_id: str | None = None,
    ) -> str:
        summary, usage = await self.provider.summarize_document(text)
        log_token_usage(
            db,
            tenant_id=tenant_id,
            user_id=user_id,
            provider=self.provider.name,
            model=self.provider.chat_model_name,
            operation="summarize_document",
            usage=usage,
        )
        return summary

    async def classify_lead(
        self,
        data: dict[str, Any],
        *,
        db: AsyncSession | None = None,
        tenant_id: str | None = None,
        user_id: str | None = None,
    ) -> dict[str, Any]:
        result, usage = await self.provider.classify_lead(data)
        log_token_usage(
            db,
            tenant_id=tenant_id,
            user_id=user_id,
            provider=self.provider.name,
            model=self.provider.chat_model_name,
            operation="classify_lead",
            usage=usage,
        )
        return result

    async def embed_text(self, text: str) -> tuple[list[float], TokenUsage]:
        return await self.provider.embed_text(text)
