"""Zenkyra FastAPI application entry."""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.database import init_db
from app.core.qdrant_client import qdrant_health
from app.core.redis_client import redis_ping
from app.services.llm.registry import register_defaults


@asynccontextmanager
async def lifespan(app: FastAPI):
    register_defaults()
    settings = get_settings()
    if settings.DATABASE_BOOTSTRAP:
        await init_db()
    yield


def create_application() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.APP_NAME,
        description="Zenkyra AI — Digital Workforce API (multi-tenant)",
        version="1.0.0",
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(api_router, prefix=settings.API_V1_PREFIX)

    @app.get("/health")
    async def health():
        return {"status": "ok", "env": settings.APP_ENV}

    @app.get("/health/deep")
    async def health_deep():
        return {
            "postgres": True,
            "redis": await redis_ping(),
            "qdrant": await qdrant_health(),
        }

    return app


app = create_application()
