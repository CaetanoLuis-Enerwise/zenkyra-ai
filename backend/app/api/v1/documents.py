"""Document upload & async processing pipeline."""

from __future__ import annotations

import uuid
from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, File, HTTPException, Response, UploadFile, status
from sqlalchemy import delete, select

from app.api.deps import CurrentUser, DbSession
from app.core.config import get_settings
from app.models import Document, DocumentStatus
from app.schemas import DocumentOut
from app.services.document_processor import process_document_background

router = APIRouter(prefix="/documents", tags=["documents"])

MAX_UPLOAD_MB = 25


@router.post("", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
async def upload_document(
    user: CurrentUser,
    db: DbSession,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
) -> DocumentOut:
    settings = get_settings()
    raw = await file.read()
    size = len(raw)
    if size > MAX_UPLOAD_MB * 1024 * 1024:
        raise HTTPException(413, f"File exceeds {MAX_UPLOAD_MB}MB")

    doc_id = uuid.uuid4()
    tenant_dir = Path(settings.STORAGE_PATH) / str(user.tenant_id)
    tenant_dir.mkdir(parents=True, exist_ok=True)
    safe_name = (file.filename or "upload").replace("..", "_")
    dest = tenant_dir / f"{doc_id}_{safe_name}"
    dest.write_bytes(raw)

    doc = Document(
        id=doc_id,
        tenant_id=user.tenant_id,
        filename=safe_name,
        storage_path=str(dest),
        mime_type=file.content_type,
        size_bytes=size,
        status=DocumentStatus.pending,
    )
    db.add(doc)
    await db.flush()

    background_tasks.add_task(process_document_background, str(doc.id))
    return DocumentOut.model_validate(doc)


@router.get("", response_model=list[DocumentOut])
async def list_documents(user: CurrentUser, db: DbSession) -> list[DocumentOut]:
    r = await db.execute(
        select(Document)
        .where(Document.tenant_id == user.tenant_id)
        .order_by(Document.created_at.desc())
    )
    rows = r.scalars().all()
    return [DocumentOut.model_validate(d) for d in rows]


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: uuid.UUID,
    user: CurrentUser,
    db: DbSession,
) -> Response:
    r = await db.execute(
        select(Document).where(
            Document.id == document_id,
            Document.tenant_id == user.tenant_id,
        )
    )
    doc = r.scalar_one_or_none()
    if not doc:
        raise HTTPException(404, "Document not found")
    try:
        Path(doc.storage_path).unlink(missing_ok=True)
    except OSError:
        pass
    await db.execute(
        delete(Document).where(
            Document.id == document_id,
            Document.tenant_id == user.tenant_id,
        )
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
