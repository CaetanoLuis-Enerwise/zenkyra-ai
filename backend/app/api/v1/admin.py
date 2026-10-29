"""Service-to-service admin API: paid checkout (Aegis) -> tenant provisioning.

Auth: X-Service-Token header == ZENKYRA_SERVICE_TOKEN (constant-time compare).
Not configured -> 503; missing/wrong token -> 401.
"""

from __future__ import annotations

import logging
from datetime import timedelta
from typing import Annotated
from urllib.parse import urlencode

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import DbSession, require_service_token
from app.core.config import get_settings
from app.core.security import new_password_set_token, unusable_password_hash
from app.models import (
    Lead,
    PasswordSetToken,
    Tenant,
    TenantBilling,
    TenantProvisioning,
    User,
    UserRole,
    utcnow,
)
from app.schemas import AdminTenantCreate, AdminTenantOut, LeadAdminOut
from app.services.lead_notify import email_password_set_link, smtp_configured
from app.services.lead_retention import purge_expired_leads
from app.utils.slug import slugify_company

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(require_service_token)],
)


async def _get_provisioning(db: AsyncSession, order_id: str) -> TenantProvisioning | None:
    r = await db.execute(
        select(TenantProvisioning).where(TenantProvisioning.external_order_id == order_id)
    )
    return r.scalar_one_or_none()


def _email_conflict() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Email already registered under a different account or order",
    )


@router.post("/tenants", response_model=AdminTenantOut)
async def provision_tenant(body: AdminTenantCreate, db: DbSession) -> AdminTenantOut:
    """Create Tenant + owner User (no usable password) + TenantBilling, idempotent on
    external_order_id. Returns a single-use password-set link (72h by default)."""
    email = body.email.lower().strip()
    prov = await _get_provisioning(db, body.external_order_id)
    created = False

    if prov is None:
        r = await db.execute(select(User).where(User.email == email))
        if r.scalar_one_or_none():
            raise _email_conflict()
        try:
            tenant = Tenant(
                name=body.company_name.strip(), slug=slugify_company(body.company_name)
            )
            db.add(tenant)
            await db.flush()
            user = User(
                tenant_id=tenant.id,
                email=email,
                hashed_password=unusable_password_hash(),
                full_name=body.full_name,
                role=UserRole.owner,
            )
            db.add(user)
            await db.flush()
            pilot_ends_at = None
            if body.plan_slug == "pilot":
                days = get_settings().PILOT_DURATION_DAYS
                pilot_ends_at = utcnow() + timedelta(days=days)
            db.add(
                TenantBilling(
                    tenant_id=tenant.id, plan_slug=body.plan_slug, pilot_ends_at=pilot_ends_at
                )
            )
            prov = TenantProvisioning(
                external_order_id=body.external_order_id,
                tenant_id=tenant.id,
                user_id=user.id,
                email=email,
                plan_slug=body.plan_slug,
            )
            db.add(prov)
            await db.flush()
            created = True
        except IntegrityError:
            # A concurrent request for the same order (or email) won the race.
            await db.rollback()
            prov = await _get_provisioning(db, body.external_order_id)
            if prov is None:
                raise _email_conflict()

    if prov.email != email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="external_order_id already used for a different email",
        )

    # One live link per user: drop unused tokens, then issue a fresh one unless the
    # owner has already set a password (a used token exists).
    r = await db.execute(
        select(PasswordSetToken.id).where(
            PasswordSetToken.user_id == prov.user_id,
            PasswordSetToken.used_at.is_not(None),
        )
    )
    password_already_set = r.first() is not None
    url = expires_at = None
    if not password_already_set:
        await db.execute(
            delete(PasswordSetToken).where(
                PasswordSetToken.user_id == prov.user_id,
                PasswordSetToken.used_at.is_(None),
            )
        )
        settings = get_settings()
        raw, token_hash = new_password_set_token()
        expires_at = utcnow() + timedelta(hours=settings.PASSWORD_SET_TOKEN_TTL_HOURS)
        db.add(
            PasswordSetToken(user_id=prov.user_id, token_hash=token_hash, expires_at=expires_at)
        )
        await db.flush()
        url = f"{settings.PASSWORD_SET_URL_BASE}?{urlencode({'token': raw})}"

    # SMTP configured: email the owner and omit the secret from this response.
    # SMTP missing or the send failed: return the link so the caller can deliver it.
    email_sent = False
    returned_url = url
    if url is not None and smtp_configured():
        err = await email_password_set_link(to=prov.email, url=url)
        if err is None:
            email_sent = True
            returned_url = None
        else:
            logger.error("password-set email failed: %s", err)

    return AdminTenantOut(
        tenant_id=prov.tenant_id,
        user_id=prov.user_id,
        plan_slug=prov.plan_slug,
        external_order_id=prov.external_order_id,
        created=created,
        password_set_url=returned_url,
        password_set_expires_at=expires_at,
        password_set_email_sent=email_sent,
    )


@router.get("/leads", response_model=list[LeadAdminOut])
async def list_leads(
    db: DbSession,
    limit: Annotated[int, Query(ge=1, le=100)] = 50,
    offset: Annotated[int, Query(ge=0, le=1000)] = 0,
) -> list[LeadAdminOut]:
    """Newest stored demo/pilot requests, including whether notification succeeded.

    Same X-Service-Token as tenant provisioning. The public lead endpoint does not
    expose this list. Use it when email or the webhook did not fire.
    Requests older than LEADS_RETENTION_DAYS are deleted in this same transaction.
    """
    await purge_expired_leads(db)
    rows = (
        (
            await db.execute(
                select(Lead)
                .order_by(Lead.created_at.desc(), Lead.id.desc())
                .limit(limit)
                .offset(offset)
            )
        )
        .scalars()
        .all()
    )
    return [LeadAdminOut.model_validate(row) for row in rows]
