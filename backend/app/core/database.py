"""Async SQLAlchemy engine & session."""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import get_settings


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""

    pass


_settings = get_settings()
engine = create_async_engine(
    str(_settings.DATABASE_URL),
    echo=_settings.DEBUG,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db() -> None:
    """Create tables when DATABASE_BOOTSTRAP=true (development only)."""
    import app.models  # noqa: F401 — register metadata

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
