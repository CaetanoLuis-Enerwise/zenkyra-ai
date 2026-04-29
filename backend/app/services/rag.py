"""Retrieve top chunks from tenant vector collection for RAG."""

from __future__ import annotations

from app.core.qdrant_client import get_qdrant, tenant_collection_name
from app.services.llm import LLMService


async def retrieve_context(tenant_id: str, query: str, limit: int = 6) -> str:
    llm = LLMService()
    vector, _ = await llm.embed_text(query)
    client = get_qdrant()
    name = tenant_collection_name(tenant_id)
    try:
        hits = await client.search(
            collection_name=name,
            query_vector=vector,
            limit=limit,
            with_payload=True,
        )
    except Exception:
        return ""

    parts = []
    for h in hits:
        text = (h.payload or {}).get("text") or ""
        if text:
            parts.append(text)
    return "\n\n---\n\n".join(parts)
