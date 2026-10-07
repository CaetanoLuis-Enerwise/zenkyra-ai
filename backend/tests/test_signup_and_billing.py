"""PUBLIC_SIGNUP_ENABLED gate, pilot plan catalog, /billing/current for a pilot tenant."""

from datetime import timedelta
from urllib.parse import parse_qs, urlparse

from app.models import utcnow

SIGNUP = {"email": "self@example.com", "password": "self-serve-1",
          "company_name": "Self Serve Lda", "full_name": "Rui"}
ADMIN_BODY = {"email": "pilot@example.com", "company_name": "Pilot Lda",
              "plan_slug": "pilot", "external_order_id": "order-pilot-1"}


def _aware(s: str):
    from datetime import datetime, timezone

    d = datetime.fromisoformat(s.replace("Z", "+00:00"))
    return d if d.tzinfo else d.replace(tzinfo=timezone.utc)


async def _pilot_jwt(client, service_token) -> str:
    data = (await client.post("/api/v1/admin/tenants", json=ADMIN_BODY,
                              headers={"X-Service-Token": service_token})).json()
    token = parse_qs(urlparse(data["password_set_url"]).query)["token"][0]
    r = await client.post("/api/v1/auth/set-password",
                          json={"token": token, "password": "pilot-pass-1"})
    return r.json()["access_token"]


async def test_public_signup_disabled_by_default_returns_403(client):
    r = await client.post("/api/v1/auth/signup", json=SIGNUP)
    assert r.status_code == 403
    r = await client.post("/api/v1/auth/login",
                          json={"email": SIGNUP["email"], "password": SIGNUP["password"]})
    assert r.status_code == 401  # nothing was created


async def test_public_signup_enabled_works_as_before(client, public_signup):
    r = await client.post("/api/v1/auth/signup", json=SIGNUP)
    assert r.status_code == 200 and r.json()["access_token"]
    jwt = r.json()["access_token"]
    me = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {jwt}"})
    assert me.status_code == 200 and me.json()["role"] == "owner"
    cur = await client.get("/api/v1/billing/current", headers={"Authorization": f"Bearer {jwt}"})
    assert cur.json()["plan_slug"] == "starter" and cur.json()["pilot_ends_at"] is None
    assert (await client.post("/api/v1/auth/signup", json=SIGNUP)).status_code == 409


async def test_plan_catalog_lists_pilot(client):
    plans = (await client.get("/api/v1/billing/plans")).json()
    pilot = next(p for p in plans if p["slug"] == "pilot")
    assert pilot["price_display"] == "€149 / 14 days"
    assert [p["slug"] for p in plans][:2] == ["pilot", "starter"]


async def test_billing_current_for_pilot_tenant(client, service_token):
    jwt = await _pilot_jwt(client, service_token)
    r = await client.get("/api/v1/billing/current", headers={"Authorization": f"Bearer {jwt}"})
    assert r.status_code == 200
    body = r.json()
    assert body["plan_slug"] == "pilot"
    left = _aware(body["pilot_ends_at"]) - utcnow()
    assert timedelta(days=13, hours=23) < left <= timedelta(days=14)


async def test_starter_via_admin_has_no_pilot_end(client, service_token):
    data = (await client.post("/api/v1/admin/tenants",
                              json={**ADMIN_BODY, "plan_slug": "starter",
                                    "external_order_id": "order-starter-1"},
                              headers={"X-Service-Token": service_token})).json()
    token = parse_qs(urlparse(data["password_set_url"]).query)["token"][0]
    jwt = (await client.post("/api/v1/auth/set-password",
                             json={"token": token, "password": "starter-pass-1"})).json()["access_token"]
    body = (await client.get("/api/v1/billing/current",
                             headers={"Authorization": f"Bearer {jwt}"})).json()
    assert body["plan_slug"] == "starter" and body["pilot_ends_at"] is None


async def test_admin_set_password_me_flow(client, service_token):
    jwt = await _pilot_jwt(client, service_token)
    me = await client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {jwt}"})
    assert me.status_code == 200
    assert me.json()["email"] == "pilot@example.com" and me.json()["role"] == "owner"
