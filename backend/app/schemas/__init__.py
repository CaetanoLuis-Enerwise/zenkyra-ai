"""Pydantic schemas for v1 APIs."""

from __future__ import annotations

import uuid
from datetime import datetime

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
