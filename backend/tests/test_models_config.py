"""Gemini model defaults + one embedding dimension shared by Gemini requests and Qdrant (mocked, no key)."""

import uuid

import pytest
from pydantic import ValidationError

from app.core import qdrant_client as qc
from app.core.config import Settings, get_settings
from app.models import Document, DocumentStatus, Tenant
from app.services import document_processor
from app.services.llm.providers import gemini as gemini_provider
from tests.test_documents_delete import FakeQdrant, use_qdrant


@pytest.fixture
def clean_model_env(monkeypatch):
    for k in ("GEMINI_CHAT_MODEL", "GEMINI_EMBEDDING_MODEL", "GEMINI_EMBEDDING_DIM"):
        monkeypatch.delenv(k, raising=False)
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


def test_defaults_are_current_models(clean_model_env):
    s = Settings(_env_file=None)
    assert s.GEMINI_CHAT_MODEL == "gemini-3.5-flash-lite"
    assert s.GEMINI_EMBEDDING_MODEL == "models/gemini-embedding-2"
    assert s.GEMINI_EMBEDDING_DIM == 768
    assert "1.5" not in s.GEMINI_CHAT_MODEL and "text-embedding-004" not in s.GEMINI_EMBEDDING_MODEL


def test_models_and_dim_overridable_by_env(clean_model_env, monkeypatch):
    monkeypatch.setenv("GEMINI_CHAT_MODEL", "gemini-3.8-flash")
    monkeypatch.setenv("GEMINI_EMBEDDING_MODEL", "models/gemini-embedding-001")
    monkeypatch.setenv("GEMINI_EMBEDDING_DIM", "1536")
    get_settings.cache_clear()
    s = get_settings()
    assert (s.GEMINI_CHAT_MODEL, s.GEMINI_EMBEDDING_MODEL, s.GEMINI_EMBEDDING_DIM) == (
        "gemini-3.8-flash", "models/gemini-embedding-001", 1536)
    assert qc.embedding_vector_size() == 1536


@pytest.mark.parametrize("bad", ["0", "127", "3073"])
def test_dimension_outside_model_range_is_rejected(clean_model_env, monkeypatch, bad):
    monkeypatch.setenv("GEMINI_EMBEDDING_DIM", bad)
    with pytest.raises(ValidationError):
        Settings(_env_file=None)


async def test_collection_created_with_configured_size(clean_model_env, monkeypatch):
    monkeypatch.setenv("GEMINI_EMBEDDING_DIM", "1536")
    get_settings.cache_clear()
    created = {}

    class Q(FakeQdrant):
        async def create_collection(self, collection_name, vectors_config):
            created[collection_name] = vectors_config
            await super().create_collection(collection_name, vectors_config)

    use_qdrant(monkeypatch, Q())
    name = await qc.ensure_tenant_collection(str(uuid.uuid4()))
    assert created[name].size == 1536


def test_gemini_embed_requests_configured_dimension(clean_model_env, monkeypatch):
    monkeypatch.setenv("GEMINI_EMBEDDING_DIM", "768")
    get_settings.cache_clear()
    calls = []

    def fake_embed_content(**kw):
        calls.append(kw)
        return {"embedding": [0.0] * 768}

    monkeypatch.setattr(gemini_provider.genai, "embed_content", fake_embed_content)
    import asyncio

    vec, _ = asyncio.run(gemini_provider.GeminiProvider().embed_text("hello"))
    assert len(vec) == 768
    assert calls[0]["model"] == "models/gemini-embedding-2"
    assert calls[0]["output_dimensionality"] == 768


def test_gemini_embed_rejects_wrong_size(clean_model_env, monkeypatch):
    get_settings.cache_clear()
    monkeypatch.setattr(gemini_provider.genai, "embed_content", lambda **kw: {"embedding": [0.0] * 3072})
    import asyncio

    with pytest.raises(RuntimeError, match="expected GEMINI_EMBEDDING_DIM=768"):
        asyncio.run(gemini_provider.GeminiProvider().embed_text("hello"))


async def test_indexing_collection_and_points_share_one_size(clean_model_env, session_factory, tmp_path, monkeypatch):
    monkeypatch.setenv("GEMINI_EMBEDDING_DIM", "1536")
    get_settings.cache_clear()
    src = tmp_path / "d.txt"
    src.write_text("chunk of text " * 200)
    async with session_factory() as s:
        t = Tenant(name="T", slug="t-" + uuid.uuid4().hex[:6])
        s.add(t)
        await s.flush()
        d = Document(tenant_id=t.id, filename="d.txt", storage_path=str(src),
                     mime_type="text/plain", size_bytes=10, status=DocumentStatus.pending)
        s.add(d)
        await s.commit()
        doc_id = d.id

    created = {}

    class Q(FakeQdrant):
        async def create_collection(self, collection_name, vectors_config):
            created[collection_name] = vectors_config.size
            await super().create_collection(collection_name, vectors_config)

    fake = use_qdrant(monkeypatch, Q())

    class LLM:
        async def embed_text(self, text):
            return [0.01] * 1536, None

    monkeypatch.setattr(document_processor, "LLMService", LLM)
    async with session_factory() as s:
        await document_processor.process_document_async(s, doc_id)
        await s.commit()
    (size,) = created.values()
    assert size == 1536
    (coll, points), = fake.upserts
    assert points and all(len(p.vector) == 1536 for p in points)

    # A model returning another size must not be indexed into the collection.
    class WrongLLM:
        async def embed_text(self, text):
            return [0.01] * 768, None

    monkeypatch.setattr(document_processor, "LLMService", WrongLLM)
    async with session_factory() as s:
        with pytest.raises(RuntimeError, match="embedding size mismatch"):
            await document_processor.process_document_async(s, doc_id)
    assert len(fake.upserts) == 1
