# Zenkyra Backend V1 (FastAPI)

Multi-tenant API for **1–3 paying companies**: JWT auth, Postgres, Redis, Qdrant RAG, **Google Gemini** LLM.

## Stack

| Layer | Tech |
|-------|------|
| API | FastAPI (async), OpenAPI `/docs` |
| DB | PostgreSQL + SQLAlchemy 2 async |
| Cache | Redis |
| Vectors | Qdrant |
| LLM | Gemini (`GEMINI_API_KEY`) |

## Quick start (Docker)

```bash
cd backend
cp .env.example .env
# Set GEMINI_API_KEY and SECRET_KEY (≥32 chars)

docker compose up --build
```

- API: http://localhost:8000  
- Docs: http://localhost:8000/docs  
- Health: http://localhost:8000/health  

Tenants are created by paid checkout via `POST /api/v1/admin/tenants` (`X-Service-Token`), and the owner
sets a password with `POST /api/v1/auth/set-password`. Public `POST /api/v1/auth/signup` is **disabled by
default** (403); set `PUBLIC_SIGNUP_ENABLED=true` in `.env` for local development only. Then use
`Authorization: Bearer <token>`.

## Local development (no Docker)

```bash
python -m venv .venv
. .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Start Postgres, Redis, Qdrant locally or via compose without api service:
docker compose up -d postgres redis qdrant

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Run from the `backend` directory so `app` imports resolve (`PYTHONPATH` defaults to cwd).

## Modules

| Prefix | Purpose |
|--------|---------|
| `/api/v1/auth` | signup (only if `PUBLIC_SIGNUP_ENABLED=true`), login, me, set-password (single-use token) |
| `/api/v1/tenants` | current tenant |
| `/api/v1/documents` | upload / list / delete + async indexing |
| `/api/v1/chat` | RAG + conversation history |
| `/api/v1/agents` | sales / support / ops runners |
| `/api/v1/analytics` | tasks, hours saved, LLM calls |
| `/api/v1/billing` | plan catalog (pilot €149/14 days, starter, growth, enterprise) + current plan (`pilot_ends_at`) |
| `/api/v1/admin` | service-to-service tenant provisioning (`X-Service-Token`; 503 if `ZENKYRA_SERVICE_TOKEN` unset) |

## LLM service

- Provider registry: `app/services/llm/registry.py` — register fallbacks beside Gemini.
- Gemini: `app/services/llm/providers/gemini.py`
- Facade: `generate_response`, `summarize_document`, `classify_lead`, `embed_text`
- Retries via `tenacity` on chat; token usage persisted in `llm_usage_logs`.

## Tests

```bash
pip install -r requirements.txt -r requirements-test.txt
pytest -q   # SQLite via aiosqlite; no Postgres/Redis/Qdrant needed
# same suite against a real (throwaway!) Postgres database; tables are dropped/created per test:
TEST_DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/zenkyra_test pytest -q
```

## Production notes

- Set `DATABASE_BOOTSTRAP=false` and run **Alembic** migrations (add your revision). New tables: `tenant_provisioning`, `password_set_tokens`
  (a fresh DB gets them from `create_all`). New nullable column `tenant_billing.pilot_ends_at`. `create_all`
  does **not** add columns to an existing table, so an existing database needs
  `ALTER TABLE tenant_billing ADD COLUMN pilot_ends_at TIMESTAMPTZ NULL;`.
- Restrict CORS origins in `app/main.py`.
- Use managed Postgres / Redis / Qdrant and rotate `SECRET_KEY` / `GEMINI_API_KEY`.
- Store uploads on S3-compatible storage instead of `./storage` when scaling.
