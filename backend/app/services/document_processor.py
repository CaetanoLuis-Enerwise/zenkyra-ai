"""Extract text, chunk, embed, upsert into Qdrant (per-tenant isolation)."""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone
from pathlib import Path

from pypdf import PdfReader
from qdrant_client.http import models as qmodels
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.qdrant_client import ensure_tenant_collection, get_qdrant
from app.models import Document, DocumentStatus
from app.services.llm import LLMService

logger = logging.getLogger(__name__)

CHUNK_SIZE = 900
CHUNK_OVERLAP = 120


def _extract_text(path: Path, mime: str | None) -> str:
    m = (mime or "").lower()
    if "pdf" in m or path.suffix.lower() == ".pdf":
        reader = PdfReader(str(path))
        parts: list[str] = []
        for page in reader.pages:
            parts.append(page.extract_text() or "")
        return "\n".join(parts)
    return path.read_text(encoding="utf-8", errors="replace")


def _chunk(text: str) -> list[str]:
    text = text.strip()
    if not text:
        return []
    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = min(start + CHUNK_SIZE, len(text))
        chunks.append(text[start:end])
        if end >= len(text):
            break
        start = end - CHUNK_OVERLAP
    return chunks


async def process_document_async(db: AsyncSession, document_id: uuid.UUID) -> None:
    result = await db.execute(select(Document).where(Document.id == document_id))
    doc = result.scalar_one_or_none()
    if not doc:
        return

    doc.status = DocumentStatus.processing
    await db.flush()

    path = Path(doc.storage_path)
    try:
        raw = _extract_text(path, doc.mime_type)
    except Exception as e:
        logger.exception("extract failed %s", document_id)
        doc.status = DocumentStatus.failed
        doc.error_message = str(e)
        return

    chunks = _chunk(raw)
    if not chunks:
        doc.status = DocumentStatus.failed
        doc.error_message = "No extractable text"
        return

    tenant_key = str(doc.tenant_id)
    llm = LLMService()

    embeddings: list[list[float]] = []
    for chunk in chunks:
        vec, _ = await llm.embed_text(chunk)
        embeddings.append(vec)

    vec_size = len(embeddings[0])
    collection = await ensure_tenant_collection(tenant_key, vector_size=vec_size)
    client = get_qdrant()
    points: list[qmodels.PointStruct] = []

    for i, chunk in enumerate(chunks):
        vectors = embeddings[i]
        pid = uuid.uuid5(uuid.NAMESPACE_DNS, f"zenkyra-{document_id}-{i}")
        points.append(
            qmodels.PointStruct(
                id=str(pid),
                vector=vectors,
                payload={
                    "tenant_id": tenant_key,
                    "document_id": str(document_id),
                    "chunk_index": i,
                    "text": chunk[:2000],
                },
            )
        )

    await client.upsert(collection_name=collection, points=points)
    doc.status = DocumentStatus.ready
    doc.chunk_count = len(chunks)
    doc.processed_at = datetime.now(timezone.utc)


async def process_document_background(doc_id: str) -> None:
    """Separate DB session for FastAPI BackgroundTasks."""
    from app.core.database import async_session_factory

    async with async_session_factory() as session:
        await process_document_async(session, uuid.UUID(doc_id))
        await session.commit()
