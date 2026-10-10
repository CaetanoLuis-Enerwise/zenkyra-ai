"""POST /api/v1/admin/tenants + POST /api/v1/auth/set-password."""

from datetime import timedelta
from urllib.parse import parse_qs, urlparse

from sqlalchemy import select, update

from app.models import PasswordSetToken, TenantBilling, User, utcnow

URL = "/api/v1/admin/tenants"
BODY = {
    "email": "Owner@Example.com",
    "company_name": "Silva Lda",
    "full_name": "Ana Silva",
    "plan_slug": "pilot",
    "external_order_id": "shopify-820982911946154508",
}


def _token(resp_json) -> str:
    return parse_qs(urlparse(resp_json["password_set_url"]).query)["token"][0]


async def test_no_env_returns_503(client):
    r = await client.post(URL, json=BODY, headers={"X-Service-Token": "anything"})
    assert r.status_code == 503


async def test_short_env_token_returns_503(client, monkeypatch):
    from app.core.config import get_settings

    monkeypatch.setenv("ZENKYRA_SERVICE_TOKEN", "too-short")
    get_settings.cache_clear()
    r = await client.post(URL, json=BODY, headers={"X-Service-Token": "too-short"})
    assert r.status_code == 503


async def test_bad_or_missing_token_returns_401(client, service_token):
    assert (await client.post(URL, json=BODY)).status_code == 401
    r = await client.post(URL, json=BODY, headers={"X-Service-Token": service_token + "x"})
    assert r.status_code == 401


async def test_invalid_plan_is_422(client, service_token):
    r = await client.post(URL, json={**BODY, "plan_slug": "growth"},
                          headers={"X-Service-Token": service_token})
    assert r.status_code == 422


async def test_create_returns_ids_and_link(client, service_token, session_factory):
    r = await client.post(URL, json=BODY, headers={"X-Service-Token": service_token})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["created"] is True and data["plan_slug"] == "pilot"
    assert data["tenant_id"] and data["user_id"]
    assert data["password_set_url"].startswith("http://app.test/set-password?token=")
    raw = _token(data)
    async with session_factory() as s:
        user = (await s.execute(select(User))).scalar_one()
        assert user.email == "owner@example.com" and user.role.value == "owner"
        billing = (await s.execute(select(TenantBilling))).scalar_one()
        assert billing.plan_slug == "pilot" and str(billing.tenant_id) == data["tenant_id"]
        tok = (await s.execute(select(PasswordSetToken))).scalar_one()
        assert tok.token_hash != raw and len(tok.token_hash) == 64  # only the hash is stored
        exp = tok.expires_at.replace(tzinfo=None)
        delta = exp - utcnow().replace(tzinfo=None)
        assert timedelta(hours=71) < delta <= timedelta(hours=72)
    # no usable password before set-password
    r = await client.post("/api/v1/auth/login",
                          json={"email": BODY["email"], "password": "anything-at-all"})
    assert r.status_code == 401


async def test_repeat_same_order_returns_same_tenant(client, service_token):
    h = {"X-Service-Token": service_token}
    first = (await client.post(URL, json=BODY, headers=h)).json()
    r = await client.post(URL, json=BODY, headers=h)
    assert r.status_code == 200
    second = r.json()
    assert second["created"] is False
    assert (second["tenant_id"], second["user_id"]) == (first["tenant_id"], first["user_id"])
    # a retry re-issues the link; the previous unused link is invalidated
    assert _token(second) != _token(first)
    r = await client.post("/api/v1/auth/set-password",
                          json={"token": _token(first), "password": "new-password-1"})
    assert r.status_code == 400
    r = await client.post("/api/v1/auth/set-password",
                          json={"token": _token(second), "password": "new-password-1"})
    assert r.status_code == 200


async def test_same_email_different_order_is_409(client, service_token):
    h = {"X-Service-Token": service_token}
    assert (await client.post(URL, json=BODY, headers=h)).status_code == 200
    r = await client.post(URL, json={**BODY, "external_order_id": "other-order"}, headers=h)
    assert r.status_code == 409


async def test_same_order_different_email_is_409(client, service_token):
    h = {"X-Service-Token": service_token}
    assert (await client.post(URL, json=BODY, headers=h)).status_code == 200
    r = await client.post(URL, json={**BODY, "email": "someone-else@example.com"}, headers=h)
    assert r.status_code == 409


async def test_set_password_works_once(client, service_token):
    data = (await client.post(URL, json=BODY, headers={"X-Service-Token": service_token})).json()
    raw = _token(data)
    r = await client.post("/api/v1/auth/set-password",
                          json={"token": raw, "password": "correct-horse-1"})
    assert r.status_code == 200 and r.json()["access_token"]
    r = await client.post("/api/v1/auth/login",
                          json={"email": BODY["email"], "password": "correct-horse-1"})
    assert r.status_code == 200
    # used token rejected
    r = await client.post("/api/v1/auth/set-password",
                          json={"token": raw, "password": "attacker-pass-1"})
    assert r.status_code == 400
    r = await client.post("/api/v1/auth/login",
                          json={"email": BODY["email"], "password": "attacker-pass-1"})
    assert r.status_code == 401


async def test_expired_token_rejected(client, service_token, session_factory):
    data = (await client.post(URL, json=BODY, headers={"X-Service-Token": service_token})).json()
    async with session_factory() as s:
        await s.execute(update(PasswordSetToken).values(expires_at=utcnow() - timedelta(minutes=1)))
        await s.commit()
    r = await client.post("/api/v1/auth/set-password",
                          json={"token": _token(data), "password": "too-late-pass-1"})
    assert r.status_code == 400


async def test_unknown_token_rejected(client):
    r = await client.post("/api/v1/auth/set-password",
                          json={"token": "x" * 43, "password": "whatever-pass-1"})
    assert r.status_code == 400


async def test_repeat_after_password_set_returns_no_link(client, service_token):
    h = {"X-Service-Token": service_token}
    data = (await client.post(URL, json=BODY, headers=h)).json()
    await client.post("/api/v1/auth/set-password",
                      json={"token": _token(data), "password": "correct-horse-1"})
    again = (await client.post(URL, json=BODY, headers=h)).json()
    assert again["tenant_id"] == data["tenant_id"]
    assert again["password_set_url"] is None and again["password_set_expires_at"] is None
