"""Password hashing & JWT helpers."""

import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def unusable_password_hash() -> str:
    """bcrypt hash of a random secret nobody knows: login fails cleanly until set-password."""
    return pwd_context.hash(secrets.token_urlsafe(32))


def hash_token(raw: str) -> str:
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def new_password_set_token() -> tuple[str, str]:
    """Return (raw_token, sha256_hex). Only the hash is stored."""
    raw = secrets.token_urlsafe(32)
    return raw, hash_token(raw)


def create_access_token(subject: str, extra_claims: dict[str, Any] | None = None) -> str:
    settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode: dict[str, Any] = {
        "sub": subject,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    if extra_claims:
        to_encode.update(extra_claims)
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict[str, Any]:
    settings = get_settings()
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])


def decode_access_token_subject(token: str) -> str | None:
    try:
        payload = decode_token(token)
        sub = payload.get("sub")
        return str(sub) if sub else None
    except JWTError:
        return None
