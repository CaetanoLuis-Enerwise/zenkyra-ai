"""AI-provider failures surface as clean errors instead of 500s / stuck documents."""

import uuid

from sqlalchemy import select

from app.api.v1 import chat as chat_api
from app.models import Conversation, Document, DocumentStatus, Tenant
from app.services import document_processor

from tests.test_documents_delete import _login


async def test_chat_returns_503_when_provider_fails(client, service_token, monkeypatch, session_factory):
    h, _ = await _login(client, service_token, "chat@example.com", "o-chat")

    async def boom(*a, **k):
        raise RuntimeError("gemini unreachable")

    monkeypatch.setattr(chat_api, "retrieve_context", boom)
    r = await client.post("/api/v1/chat/messages", json={"message": "hi"}, headers=h)
    assert r.status_code == 503
    assert r.json()["detail"] == "AI provider unavailable, try again later"
    async with session_factory() as s:
        assert (await s.execute(select(Conversation))).scalars().all() == []


async def test_background_indexing_failure_marks_document_failed(session_factory, tmp_path, monkeypatch):
    src = tmp_path / "d.txt"
    src.write_text("text " * 50)
    async with session_factory() as s:
        t = Tenant(name="T", slug="t-" + uuid.uuid4().hex[:6])
        s.add(t)
        await s.flush()
        d = Document(tenant_id=t.id, filename="d.txt", storage_path=str(src),
                     mime_type="text/plain", size_bytes=10, status=DocumentStatus.pending)
        s.add(d)
        await s.commit()
        doc_id = d.id

    class FailingLLM:
        async def embed_text(self, text):
            raise RuntimeError("bad api key")

    monkeypatch.setattr(document_processor, "LLMService", FailingLLM)
    import app.core.database as dbm
    monkeypatch.setattr(dbm, "async_session_factory", session_factory)

    await document_processor.process_document_background(str(doc_id))

    async with session_factory() as s:
        doc = await s.get(Document, doc_id)
    assert doc.status == DocumentStatus.failed
    assert doc.error_message == "Indexing failed (RuntimeError)"
