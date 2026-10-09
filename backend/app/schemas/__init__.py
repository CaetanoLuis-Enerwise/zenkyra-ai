"""Pydantic schemas for v1 APIs."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field

from app.models import AgentType, DocumentStatus, UserRole


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    company_name: str = Field(min_length=2, max_length=255)
    full_name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str | None
    role: UserRole
    tenant_id: uuid.UUID

    model_config = {"from_attributes": True}


class TenantOut(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    created_at: datetime

    model_config = {"from_attributes": True}


class TenantCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)


class DocumentOut(BaseModel):
    id: uuid.UUID
    filename: str
    status: DocumentStatus
    chunk_count: int
    mime_type: str | None
    size_bytes: int | None
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatMessageRequest(BaseModel):
    conversation_id: uuid.UUID | None = None
    message: str = Field(min_length=1, max_length=24_000)


class ChatMessageResponse(BaseModel):
    conversation_id: uuid.UUID
    reply: str


class AgentRunRequest(BaseModel):
    agent_type: AgentType
    payload: dict = Field(default_factory=dict)


class AgentRunResponse(BaseModel):
    run_id: uuid.UUID
    agent_type: AgentType
    output: dict


class AnalyticsSummary(BaseModel):
    tasks_completed: int
    hours_saved_estimate: float
    llm_calls_trailing_30d: int


class BillingPlan(BaseModel):
    slug: str
    name: str
    price_display: str
    highlights: list[str]


class TenantBillingOut(BaseModel):
    plan_slug: str
    stripe_customer_id: str | None = None
    pilot_ends_at: datetime | None = None


class AdminTenantCreate(BaseModel):
    email: EmailStr
    company_name: str = Field(min_length=2, max_length=255)
    full_name: str | None = Field(default=None, max_length=255)
    plan_slug: Literal["pilot", "starter"]
    external_order_id: str = Field(min_length=1, max_length=128)


class AdminTenantOut(BaseModel):
    tenant_id: uuid.UUID
    user_id: uuid.UUID
    plan_slug: str
    external_order_id: str
    created: bool
    # Single-use, 72h. None when the owner has already set a password.
    password_set_url: str | None
    password_set_expires_at: datetime | None


class SetPasswordRequest(BaseModel):
    token: str = Field(min_length=16, max_length=256)
    password: str = Field(min_length=8)


class LeadCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    company: str = Field(min_length=1, max_length=200)
    message: str | None = Field(default=None, max_length=2000)
    source: Literal["demo", "pilot"]
    # Honeypot: hidden in the form; humans leave it empty. Non-empty -> 201, not stored.
    website: str | None = Field(default=None, max_length=500)


class LeadOut(BaseModel):
    id: uuid.UUID
