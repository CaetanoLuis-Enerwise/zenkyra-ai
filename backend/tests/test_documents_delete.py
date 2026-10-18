"""DELETE /api/v1/documents/{id} must also erase the document's Qdrant points (GDPR)."""

import uuid
from urllib.parse import parse_qs, urlparse

import pytest
from qdrant_client.http import models as qmodels
from sqlalchemy import delete, select

from app.api.v1 import documents as documents_api
from app.core import qdrant_client as qc
from app.models import Document, DocumentStatus
from app.services import document_processor


class FakeQdrant:
    def __init__(self, existing=(), fail_delete=False):
        self.existing = set(existing)
        self.fail_delete = fail_delete
        self.deletes = []
        self.upserts = []

    async def collection_exists(self, collection_name):
        return collection_name in self.existing

    async def delete(self, collection_name, points_selector, wait=True):
        if self.fail_delete:
            raise RuntimeError("qdrant down")
        self.deletes.append((collection_name, points_selector, wait))

    async def get_collections(self):
        return qmodels.CollectionsResponse(
            collections=[qmodels.CollectionDescription(name=n) for n in self.existing]
        )

    async def create_collection(self, collection_name, vectors_config):
        self.existing.add(collection_name)

    async def upsert(self, collection_name, points):
        self.upserts.append((collection_name, points))


@pytest.fixture
def storage(tmp_path, monkeypatch):
    from app.core.config import get_settings

    monkeypatch.setenv("STORAGE_PATH", str(tmp_path / "storage"))
    get_settings.cache_clear()
    # Do not run the real embed/index pipeline on upload.
    async def _noop(doc_id):
        return None

    monkeypatch.setattr(documents_api, "process_document_background", _noop)
    yield tmp_path / "storage"


def use_qdrant(monkeypatch, fake):
    monkeypatch.setattr(qc, "get_qdrant", lambda: fake)
    monkeypatch.setattr(document_processor, "get_qdrant", lambda: fake)
    return fake


async def _login(client, service_token, email, order):
    r = await client.post(
        "/api/v1/admin/tenants",
        json={"email": email, "company_name": "Silva Lda", "plan_slug": "pilot",
              "external_order_id": order},
        headers={"X-Service-Token": service_token},
    )
    assert r.status_code == 200, r.text
    tok = parse_qs(urlparse(r.json()["password_set_url"]).query)["token"][0]
    r = await client.post("/api/v1/auth/set-password",
                          json={"token": tok, "password": "correct-horse-1"})
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}, r


async def _upload(client, headers):
    r = await client.post("/api/v1/documents", headers=headers,
                          files={"file": ("notes.txt", b"hello world", "text/plain")})
    assert r.status_code == 201, r.text
    return r.json()


async def _tenant_id(client, headers):
    r = await client.get("/api/v1/auth/me", headers=headers)
    return r.json()["tenant_id"]


async def test_delete_removes_qdrant_points_by_document_id(client, service_token, storage,
                                                           monkeypatch, session_factory):
    h, _ = await _login(client, service_token, "a@example.com", "o-1")
    doc = await _upload(client, h)
    coll = qc.tenant_collection_name(await _tenant_id(client, h))
    fake = use_qdrant(monkeypatch, FakeQdrant(existing={coll}))

    r = await client.delete(f"/api/v1/documents/{doc['id']}", headers=h)
    assert r.status_code == 204

    assert len(fake.deletes) == 1
    name, selector, wait = fake.deletes[0]
    assert name == coll and wait is True
    assert isinstance(selector, qmodels.FilterSelector)
    (cond,) = selector.filter.must
    assert cond.key == "document_id" and cond.match.value == doc["id"]

    async with session_factory() as s:
        assert (await s.execute(select(Document))).scalars().all() == []
    assert list(storage.rglob("*notes.txt")) == []


async def test_delete_without_collection_skips_qdrant(client, service_token, storage, monkeypatch):
    h, _ = await _login(client, service_token, "b@example.com", "o-2")
    doc = await _upload(client, h)
    fake = use_qdrant(monkeypatch, FakeQdrant(existing=set()))
    r = await client.delete(f"/api/v1/documents/{doc['id']}", headers=h)
    assert r.status_code == 204
    assert fake.deletes == []


async def test_qdrant_failure_keeps_document_and_returns_503(client, service_token, storage,
                                                            monkeypatch, session_factory):
    h, _ = await _login(client, service_token, "c@example.com", "o-3")
    doc = await _upload(client, h)
    coll = qc.tenant_collection_name(await _tenant_id(client, h))
    use_qdrant(monkeypatch, FakeQdrant(existing={coll}, fail_delete=True))
    r = await client.delete(f"/api/v1/documents/{doc['id']}", headers=h)
    assert r.status_code == 503
    async with session_factory() as s:
        assert len((await s.execute(select(Document))).scalars().all()) == 1
    assert len(list(storage.rglob("*notes.txt"))) == 1


async def test_other_tenant_cannot_delete(client, service_token, storage, monkeypatch):
    h1, _ = await _login(client, service_token, "d@example.com", "o-4")
    h2, _ = await _login(client, service_token, "e@example.com", "o-5")
    doc = await _upload(client, h1)
    fake = use_qdrant(monkeypatch, FakeQdrant(existing={"anything"}))
    r = await client.delete(f"/api/v1/documents/{doc['id']}", headers=h2)
    assert r.status_code == 404
    assert fake.deletes == []


async def test_upload_over_25mb_is_413(client, service_token, storage):
    h, _ = await _login(client, service_token, "f@example.com", "o-6")
    big = b"x" * (25 * 1024 * 1024 + 1)
    r = await client.post("/api/v1/documents", headers=h,
                          files={"file": ("big.txt", big, "text/plain")})
    assert r.status_code == 413


async def test_processor_does_not_index_document_deleted_mid_embedding(
        session_factory, tmp_path, monkeypatch):
    from app.models import Tenant

    src = tmp_path / "doc.txt"
    src.write_text("some text to index " * 10)
    async with session_factory() as s:
        t = Tenant(name="T", slug="t-" + uuid.uuid4().hex[:6])
        s.add(t)
        await s.flush()
        d = Document(tenant_id=t.id, filename="doc.txt", storage_path=str(src),
                     mime_type="text/plain", size_bytes=10, status=DocumentStatus.pending)
        s.add(d)
        await s.commit()
        doc_id = d.id

    fake = use_qdrant(monkeypatch, FakeQdrant())
    monkeypatch.setattr(document_processor, "ensure_tenant_collection",
                        lambda *a, **k: _coro("coll"))

    async with session_factory() as s:
        class FakeLLM:
            async def embed_text(self, text):
                # Simulate a concurrent DELETE committing while we embed.
                await s.execute(delete(Document).where(Document.id == doc_id))
                return [0.1] * qc.embedding_vector_size(), None

        monkeypatch.setattr(document_processor, "LLMService", FakeLLM)
        await document_processor.process_document_async(s, doc_id)
    assert fake.upserts == []


async def _coro(v):
    return v
