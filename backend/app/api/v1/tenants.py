"""Tenant context (single-tenant per user account in V1)."""

from __future__ import annotations

from fastapi import APIRouter

from app.api.deps import CurrentTenant
from app.schemas import TenantOut

router = APIRouter(prefix="/tenants", tags=["tenants"])


@router.get("/me", response_model=TenantOut)
async def read_my_tenant(tenant: CurrentTenant) -> TenantOut:
    return TenantOut.model_validate(tenant)
