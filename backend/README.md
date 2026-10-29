# Zenkyra Backend V1 (FastAPI)

Multi-tenant API for **1–3 paying companies**: JWT auth, Postgres, Redis, Qdrant RAG, **Google Gemini** LLM.

## Stack

| Layer | Tech |
|-------|------|
| API | FastAPI (async), OpenAPI `/docs` |
| DB | PostgreSQL + SQLAlchemy 2 async |
| Cache | Redis |
| Vectors | Qdrant |
| LLM | Gemini (`GEMINI_API_KEY`; models via `GEMINI_CHAT_MODEL` / `GEMINI_EMBEDDING_MODEL`) |

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
| `/api/v1/documents` | upload (max 25MB; PDF via pypdf, other files read as UTF-8 text) / list / delete (also erases the document's Qdrant points; 503 and row kept if Qdrant fails) + async indexing |
| `/api/v1/chat` | RAG + conversation history |
| `/api/v1/agents` | sales / support / ops runners |
| `/api/v1/analytics` | tasks, hours saved, LLM calls |
| `/api/v1/billing` | plan catalog (pilot €149/14 days, starter, growth, enterprise) + current plan (`pilot_ends_at`) |
| `/api/v1/leads` | public `POST` lead capture from the marketing site (`source`: `demo`/`pilot`); honeypot `website`; per-IP rate limit (in-process); emails `LEADS_NOTIFY_EMAIL` and/or POSTs `LEADS_WEBHOOK_URL` when set |
| `/api/v1/admin` | service-to-service tenant provisioning and `GET /leads` (`X-Service-Token`; 503 if `ZENKYRA_SERVICE_TOKEN` unset) |

## LLM service

- Provider registry: `app/services/llm/registry.py` — register fallbacks beside Gemini.
- Gemini: `app/services/llm/providers/gemini.py`
- Facade: `generate_response`, `summarize_document`, `classify_lead`, `embed_text`
- Retries via `tenacity` on chat; token usage persisted in `llm_usage_logs`.
- Models are env-configurable. Defaults (checked 2026-10-17 against
  https://ai.google.dev/gemini-api/docs/models and https://ai.google.dev/gemini-api/docs/deprecations):
  `GEMINI_CHAT_MODEL=gemini-3.5-flash-lite`, `GEMINI_EMBEDDING_MODEL=models/gemini-embedding-2`.
- `GEMINI_EMBEDDING_DIM` (default 768) is sent as `output_dimensionality` **and** is the Qdrant collection
  vector size; embeddings of any other length are rejected. Changing the model or the dimension needs a
  re-index: embedding spaces are not compatible across models, and existing collections keep their old size.

## Tests

```bash
pip install -r requirements.txt -r requirements-test.txt
pytest -q   # SQLite via aiosqlite; no Postgres/Redis/Qdrant needed
# same suite against a real (throwaway!) Postgres database; tables are dropped/created per test:
TEST_DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/zenkyra_test pytest -q
```

## Production notes

- Set `DATABASE_BOOTSTRAP=false` and run **Alembic** migrations (add your revision). New tables: `tenant_provisioning`, `password_set_tokens`, `leads`
  (a fresh DB gets them from `create_all`). New nullable column `tenant_billing.pilot_ends_at`. `create_all`
  does **not** add columns to an existing table, so an existing database needs
  `ALTER TABLE tenant_billing ADD COLUMN pilot_ends_at TIMESTAMPTZ NULL;`.
- `POST /api/v1/leads` is public. Its rate limit (`LEADS_RATE_LIMIT_MAX` per
  `LEADS_RATE_LIMIT_WINDOW_SECONDS`, keyed on `request.client.host`) lives in **process memory**: each
  worker/replica counts separately and counters reset on restart. Behind a proxy run uvicorn with
  `--proxy-headers --forwarded-allow-ips=<proxy>` or every lead shares the proxy IP. Add an edge/WAF limit
  for real abuse protection. After the row is stored, the API notifies every configured channel:
  SMTP email to `LEADS_NOTIFY_EMAIL` (needs `SMTP_HOST` and `SMTP_FROM`; `Reply-To` is the prospect)
  and/or an HTTP POST to `LEADS_WEBHOOK_URL` (`LEADS_WEBHOOK_FORMAT=json` or `slack`). Optional
  `LEADS_WEBHOOK_SECRET` sends `X-Zenkyra-Signature: sha256=<hmac-sha256 of the raw body>`. The webhook
  URL must be https (http is allowed only for localhost) and must not contain credentials. If a channel
  fails, the lead is still kept and `notify_status=failed` (the public response is only `{id}`). With
  neither destination set, `notify_status=skipped` and nobody is told — set one before the form is public.
  In `APP_ENV=production` the process logs a warning at startup when both are unset. Read the queue with
  `GET /api/v1/admin/leads` (`X-Service-Token`). Leads older than `LEADS_RETENTION_DAYS` (default 365,
  the period stated on the public privacy page) are deleted when the process starts, when a new lead
  is stored, or when that list is read. Leads are personal data: the marketing site links the form to
  `/privacidade`. The controller name, NIF and contact on that page are placeholders until
  `NEXT_PUBLIC_PRIVACY_CONTROLLER_NAME`, `NEXT_PUBLIC_PRIVACY_CONTROLLER_NIF` and
  `NEXT_PUBLIC_PRIVACY_CONTROLLER_CONTACT` are set. Do not invent them. An existing database needs:
  `ALTER TABLE leads ADD COLUMN notify_status VARCHAR(16) NOT NULL DEFAULT 'skipped';`
  `ALTER TABLE leads ADD COLUMN notify_error VARCHAR(300) NULL;`
  `ALTER TABLE leads ADD COLUMN notified_at TIMESTAMPTZ NULL;`
- Set `CORS_ALLOW_ORIGINS` to the frontend origin(s), comma-separated (default `http://localhost:3000`).
  Credentials are disabled: the frontend sends the JWT as `Authorization: Bearer`, not as a cookie.
- Set `PASSWORD_SET_URL_BASE` to `https://<frontend>/set-password` (the Next.js page that consumes `?token=`).
  When `SMTP_HOST` and `SMTP_FROM` are set, `POST /api/v1/admin/tenants` emails that link to the owner
  and omits it from the response (`password_set_email_sent: true`). When SMTP is not set, or the send
  fails, the response still includes `password_set_url` and `password_set_email_sent` is false.
- Use managed Postgres / Redis / Qdrant and rotate `SECRET_KEY` / `GEMINI_API_KEY`.
- Store uploads on S3-compatible storage instead of `./storage` when scaling.
