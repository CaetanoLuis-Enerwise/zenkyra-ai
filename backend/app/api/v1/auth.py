"""Authentication: signup, login, JWT /me."""

from __future__ import annotations

from datetime import timezone

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import delete, select, update

from app.api.deps import CurrentUser, DbSession
from app.core.config import get_settings
from app.core.security import (
    create_access_token,
    hash_password,
    hash_token,
    verify_password,
)
from app.models import PasswordSetToken, Tenant, TenantBilling, User, UserRole, utcnow
from app.schemas import (
    LoginRequest,
    SetPasswordRequest,
    SignupRequest,
    TokenResponse,
    UserOut,
)
from app.utils.slug import slugify_company

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse)
async def signup(body: SignupRequest, db: DbSession) -> TokenResponse:
    if not get_settings().PUBLIC_SIGNUP_ENABLED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Public signup is disabled",
        )
    r = await db.execute(select(User).where(User.email == body.email))
    if r.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )
    slug = slugify_company(body.company_name)
    tenant = Tenant(name=body.company_name.strip(), slug=slug)
    db.add(tenant)
    await db.flush()

    user = User(
        tenant_id=tenant.id,
        email=body.email.lower().strip(),
        hashed_password=hash_password(body.password),
        full_name=body.full_name,
        role=UserRole.owner,
    )
    db.add(user)
    await db.flush()

    db.add(TenantBilling(tenant_id=tenant.id, plan_slug="starter"))

    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: DbSession) -> TokenResponse:
    r = await db.execute(select(User).where(User.email == body.email.lower().strip()))
    user = r.scalar_one_or_none()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    return TokenResponse(access_token=create_access_token(str(user.id)))


@router.get("/me", response_model=UserOut)
async def read_me(user: CurrentUser) -> UserOut:
    return UserOut.model_validate(user)


@router.post("/set-password", response_model=TokenResponse)
async def set_password(body: SetPasswordRequest, db: DbSession) -> TokenResponse:
    """Consume a single-use password-set token (issued by POST /admin/tenants)."""
    invalid = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token"
    )
    r = await db.execute(
        select(PasswordSetToken).where(PasswordSetToken.token_hash == hash_token(body.token))
    )
    row = r.scalar_one_or_none()
    now = utcnow()
    if row is None or row.used_at is not None:
        raise invalid
    expires_at = row.expires_at
    if expires_at.tzinfo is None:  # SQLite returns naive datetimes
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at <= now:
        raise invalid
    user = await db.get(User, row.user_id)
    if user is None or not user.is_active:
        raise invalid

    # Atomic single use: only one request can flip used_at.
    res = await db.execute(
        update(PasswordSetToken)
        .where(PasswordSetToken.id == row.id, PasswordSetToken.used_at.is_(None))
        .values(used_at=now)
    )
    if res.rowcount != 1:
        raise invalid
    user.hashed_password = hash_password(body.password)
    await db.execute(
        delete(PasswordSetToken).where(
            PasswordSetToken.user_id == user.id, PasswordSetToken.used_at.is_(None)
        )
    )
    await db.flush()
    return TokenResponse(access_token=create_access_token(str(user.id)))
