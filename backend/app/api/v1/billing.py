"""Billing placeholders — Stripe hooks land here later."""

from __future__ import annotations

from fastapi import APIRouter
from sqlalchemy import select

from app.api.deps import CurrentTenant, DbSession
from app.models import TenantBilling
from app.schemas import BillingPlan, TenantBillingOut

router = APIRouter(prefix="/billing", tags=["billing"])

_PLANS: list[BillingPlan] = [
    BillingPlan(
        slug="starter",
        name="Starter",
        price_display="€299 / mo",
        highlights=[
            "1 agent · pre-built role",
            "Up to 25 seats",
            "Email support",
        ],
    ),
    BillingPlan(
        slug="growth",
        name="Growth",
        price_display="€799 / mo",
        highlights=[
            "Up to 5 agents",
            "Live ROI dashboard",
            "Priority support",
        ],
    ),
    BillingPlan(
        slug="enterprise",
        name="Enterprise",
        price_display="Custom",
        highlights=[
            "Unlimited agents",
            "VPC · BYO LLM",
            "Dedicated CSM",
        ],
    ),
]


@router.get("/plans", response_model=list[BillingPlan])
async def list_plans() -> list[BillingPlan]:
    return _PLANS


@router.get("/current", response_model=TenantBillingOut)
async def current_plan(
    tenant: CurrentTenant,
    db: DbSession,
) -> TenantBillingOut:
    r = await db.execute(select(TenantBilling).where(TenantBilling.tenant_id == tenant.id))
    row = r.scalar_one_or_none()
    if not row:
        row = TenantBilling(tenant_id=tenant.id, plan_slug="starter")
        db.add(row)
        await db.flush()
    return TenantBillingOut(
        plan_slug=row.plan_slug,
        stripe_customer_id=row.stripe_customer_id,
    )
