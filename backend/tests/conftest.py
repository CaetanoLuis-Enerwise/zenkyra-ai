"""Test harness: minimal app (auth + admin + billing + leads) on SQLite by default.

The repo has no test suite and its models use Postgres JSONB; JSONB is rendered as
JSON on SQLite for tests only. Set TEST_DATABASE_URL=postgresql+asyncpg://... to run the
same suite on a real, THROWAWAY Postgres database (all tables are dropped per test).
DATABASE_URL must still be a Postgres DSN to satisfy Settings validation; the engine it
builds is never connected (get_db is overridden).
"""

import os

os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://test:test@localhost:5432/test")
os.environ.setdefault("SECRET_KEY", "test-secret-key-test-secret-key-0123456789")
os.environ.setdefault("GEMINI_API_KEY", "test-not-a-real-key")
os.environ.pop("ZENKYRA_SERVICE_TOKEN", None)
os.environ.pop("PUBLIC_SIGNUP_ENABLED", None)

import pytest  # noqa: E402
from fastapi import FastAPI  # noqa: E402
from httpx import ASGITransport, AsyncClient  # noqa: E402
from sqlalchemy.dialects.postgresql import JSONB  # noqa: E402
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine  # noqa: E402
from sqlalchemy.ext.compiler import compiles  # noqa: E402


@compiles(JSONB, "sqlite")
def _jsonb_sqlite(type_, compiler, **kw):  # pragma: no cover - DDL hook
    return "JSON"


from app.api.v1 import admin, auth, billing, leads  # noqa: E402
from app.core.config import get_settings  # noqa: E402
from app.core.database import Base, get_db  # noqa: E402
import app.models  # noqa: E402,F401

SERVICE_TOKEN = "svc_" + "x" * 60


@pytest.fixture
async def session_factory(tmp_path):
    url = os.environ.get("TEST_DATABASE_URL") or f"sqlite+aiosqlite:///{tmp_path / 'test.db'}"
    engine = create_async_engine(url)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False, autoflush=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest.fixture
def service_token(monkeypatch):
    monkeypatch.setenv("ZENKYRA_SERVICE_TOKEN", SERVICE_TOKEN)
    monkeypatch.setenv("PASSWORD_SET_URL_BASE", "http://app.test/set-password")
    get_settings.cache_clear()
    yield SERVICE_TOKEN
    get_settings.cache_clear()


@pytest.fixture
def public_signup(monkeypatch):
    monkeypatch.setenv("PUBLIC_SIGNUP_ENABLED", "true")
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


@pytest.fixture
async def client(session_factory):
    async def _get_db():  # same commit/rollback semantics as app.core.database.get_db
        async with session_factory() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise

    app = FastAPI()
    app.include_router(auth.router, prefix="/api/v1")
    app.include_router(admin.router, prefix="/api/v1")
    app.include_router(billing.router, prefix="/api/v1")
    app.include_router(leads.router, prefix="/api/v1")
    leads.rate_limiter.reset()
    app.dependency_overrides[get_db] = _get_db
    get_settings.cache_clear()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
    get_settings.cache_clear()
