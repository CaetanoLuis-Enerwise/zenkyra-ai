"""Aggregate API v1 routers."""

from fastapi import APIRouter

from app.api.v1 import agents, analytics, auth, billing, chat, documents, tenants

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(tenants.router)
api_router.include_router(documents.router)
api_router.include_router(chat.router)
api_router.include_router(agents.router)
api_router.include_router(analytics.router)
api_router.include_router(billing.router)
