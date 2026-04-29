"""Application configuration (12-factor via environment)."""

from functools import lru_cache
from typing import Any, Literal

from pydantic import Field, PostgresDsn, RedisDsn, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_NAME: str = "Zenkyra API"
    APP_ENV: Literal["development", "staging", "production"] = "development"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"

    SECRET_KEY: str = Field(
        ...,
        min_length=32,
        description="JWT signing secret — use a long random string in production",
    )
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    DATABASE_URL: PostgresDsn = Field(
        ...,
        description="postgresql+asyncpg://user:pass@host:5432/dbname",
    )
    DATABASE_URL_SYNC: str | None = Field(
        None,
        description="postgresql://... for Alembic — auto-derived from DATABASE_URL if omitted",
    )

    REDIS_URL: RedisDsn = Field(default="redis://localhost:6379/0")

    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: str | None = None
    QDRANT_COLLECTION_PREFIX: str = "zenkyra_tenant_"

    GEMINI_API_KEY: str = Field(..., description="Google AI Gemini API key")
    GEMINI_CHAT_MODEL: str = "gemini-1.5-flash"
    GEMINI_EMBEDDING_MODEL: str = "models/text-embedding-004"
    LLM_PROVIDER: str = "gemini"
    LLM_MAX_RETRIES: int = 3
    LLM_REQUEST_TIMEOUT_SECONDS: int = 120

    STORAGE_PATH: str = "./storage"

    DATABASE_BOOTSTRAP: bool = False

    @model_validator(mode="after")
    def derive_sync_database_url(self) -> "Settings":
        if self.DATABASE_URL_SYNC is None:
            u = str(self.DATABASE_URL)
            if "+asyncpg" in u:
                object.__setattr__(
                    self,
                    "DATABASE_URL_SYNC",
                    u.replace("+asyncpg", "+psycopg2", 1),
                )
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()


def settings_validate_placeholder(data: dict[str, Any]) -> Settings:
    """Test helper — bypass lru_cache."""
    return Settings(**data)
