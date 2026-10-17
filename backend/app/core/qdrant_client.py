"""Qdrant vector store helpers — collection per tenant."""

from typing import Optional

from qdrant_client import AsyncQdrantClient
from qdrant_client.http import models as qmodels

from app.core.config import get_settings

_client: Optional[AsyncQdrantClient] = None


def get_qdrant() -> AsyncQdrantClient:
    global _client
    if _client is None:
        settings = get_settings()
        kwargs = {"url": settings.QDRANT_URL}
        if settings.QDRANT_API_KEY:
            kwargs["api_key"] = settings.QDRANT_API_KEY
        _client = AsyncQdrantClient(**kwargs)
    return _client


def tenant_collection_name(tenant_id: str) -> str:
    settings = get_settings()
    safe = tenant_id.replace("-", "")[:32]
    return f"{settings.QDRANT_COLLECTION_PREFIX}{safe}"


async def ensure_tenant_collection(tenant_id: str, vector_size: int = 768) -> str:
    """Create collection if missing (Gemini text-embedding-004 → 768 dims)."""
    client = get_qdrant()
    name = tenant_collection_name(tenant_id)
    cols = await client.get_collections()
    existing = {c.name for c in cols.collections}
    if name not in existing:
        await client.create_collection(
            collection_name=name,
            vectors_config=qmodels.VectorParams(
                size=vector_size,
                distance=qmodels.Distance.COSINE,
            ),
        )
    return name


async def delete_document_points(tenant_id: str, document_id: str) -> None:
    """Remove every vector point of one document from the tenant's collection.

    Points are upserted with payload ``document_id`` (see document_processor). A missing
    collection means nothing was ever indexed for this tenant, so there is nothing to
    delete. Any other Qdrant error propagates: the caller must not report the document
    as deleted while its vectors may still be retrievable.
    """
    client = get_qdrant()
    name = tenant_collection_name(tenant_id)
    if not await client.collection_exists(collection_name=name):
        return
    await client.delete(
        collection_name=name,
        points_selector=qmodels.FilterSelector(
            filter=qmodels.Filter(
                must=[
                    qmodels.FieldCondition(
                        key="document_id",
                        match=qmodels.MatchValue(value=str(document_id)),
                    )
                ]
            )
        ),
        wait=True,
    )


async def qdrant_health() -> bool:
    try:
        client = get_qdrant()
        await client.get_collections()
        return True
    except Exception:
        return False
