"""Google Gemini implementation — chat, embeddings, structured JSON."""

from __future__ import annotations

import asyncio
import json
import logging
from typing import Any

import google.generativeai as genai
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_exponential

from app.core.config import get_settings
from app.services.llm.base import LLMProvider, TokenUsage

logger = logging.getLogger(__name__)


def _usage_from_response(response: Any) -> TokenUsage:
    meta = getattr(response, "usage_metadata", None)
    if meta is None:
        return TokenUsage()
    pt = getattr(meta, "prompt_token_count", None)
    ct = getattr(meta, "candidates_token_count", None)
    tt = getattr(meta, "total_token_count", None)
    if tt is None and (pt is not None or ct is not None):
        tt = (pt or 0) + (ct or 0)
    return TokenUsage(
        prompt_tokens=pt,
        completion_tokens=ct,
        total_tokens=tt,
    )


class GeminiProvider(LLMProvider):
    name = "gemini"

    def __init__(self) -> None:
        settings = get_settings()
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self._chat_model = settings.GEMINI_CHAT_MODEL
        self._embed_model = settings.GEMINI_EMBEDDING_MODEL
        self._max_retries = settings.LLM_MAX_RETRIES
        self._gen_model = genai.GenerativeModel(self._chat_model)

    @property
    def chat_model_name(self) -> str:
        return self._chat_model

    @retry(
        reraise=True,
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=30),
        retry=retry_if_exception_type(Exception),
    )
    def _generate_with_retry(self, parts: list[Any], **kwargs: Any) -> Any:
        return self._gen_model.generate_content(parts, **kwargs)

    async def generate_response(
        self, prompt: str, context: str | None = None
    ) -> tuple[str, TokenUsage]:
        if context:
            full = (
                "You are Zenkyra enterprise AI. Use CONTEXT to ground answers; "
                "if context is insufficient, say so.\n\n"
                f"CONTEXT:\n{context}\n\nUSER:\n{prompt}"
            )
        else:
            full = prompt

        def _run() -> tuple[str, TokenUsage]:
            resp = self._generate_with_retry([full])
            text = getattr(resp, "text", None) or ""
            return text.strip(), _usage_from_response(resp)

        return await asyncio.to_thread(_run)

    async def summarize_document(self, text: str) -> tuple[str, TokenUsage]:
        instr = (
            "Summarize the following document for an executive reader. "
            "Output 3–6 bullet points plus a one-line takeaway. "
            "Be factual; do not invent details.\n\nDOCUMENT:\n"
        )

        def _run() -> tuple[str, TokenUsage]:
            resp = self._generate_with_retry([instr + text[:120_000]])
            out = getattr(resp, "text", None) or ""
            return out.strip(), _usage_from_response(resp)

        return await asyncio.to_thread(_run)

    async def classify_lead(self, data: dict[str, Any]) -> tuple[dict[str, Any], TokenUsage]:
        schema_hint = json.dumps(
            {
                "score": "number 0-100",
                "tier": "hot|warm|cold",
                "recommended_owner": "string",
                "next_best_action": "string",
                "reasoning": "string",
            }
        )
        prompt = (
            "Classify this B2B inbound lead for prioritisation.\n"
            f"Respond ONLY with valid JSON matching roughly: {schema_hint}\n"
            f"LEAD DATA:\n{json.dumps(data, ensure_ascii=False)}"
        )

        def _run() -> tuple[dict[str, Any], TokenUsage]:
            resp = self._generate_with_retry(
                [prompt],
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                    temperature=0.2,
                ),
            )
            raw = getattr(resp, "text", None) or "{}"
            try:
                parsed = json.loads(raw)
            except json.JSONDecodeError:
                parsed = {"raw": raw, "parse_error": True}
            return parsed, _usage_from_response(resp)

        return await asyncio.to_thread(_run)

    async def embed_text(self, text: str) -> tuple[list[float], TokenUsage]:
        settings = get_settings()

        def _run() -> tuple[list[float], TokenUsage]:
            result = genai.embed_content(
                model=settings.GEMINI_EMBEDDING_MODEL,
                content=text[:8_000],
            )
            emb: list[float]
            if isinstance(result, dict):
                emb = list(result.get("embedding") or [])
            else:
                emb = list(getattr(result, "embedding", []) or [])
            if not emb:
                raise RuntimeError("Empty embedding from Gemini")
            usage = TokenUsage(total_tokens=len(text) // 4)
            return emb, usage

        return await asyncio.to_thread(_run)
