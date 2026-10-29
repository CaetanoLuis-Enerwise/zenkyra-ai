"""Password-set link is emailed when SMTP is configured, otherwise returned."""

import logging
from urllib.parse import parse_qs, urlparse

import smtplib

from app.core.config import get_settings

URL = "/api/v1/admin/tenants"
BODY = {
    "email": "Owner@Example.com",
    "company_name": "Silva Lda",
    "full_name": "Ana Silva",
    "plan_slug": "pilot",
    "external_order_id": "order-mail-1",
}
SMTP_PASSWORD = "smtp-password-not-for-logs"


def _clear():
    get_settings.cache_clear()


class FakeSMTP:
    instances: list["FakeSMTP"] = []

    def __init__(self, host, port, timeout=None):
        self.host = host
        self.port = port
        self.started_tls = False
        self.sent = None
        FakeSMTP.instances.append(self)

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False

    def ehlo(self):
        return (250, b"ok")

    def starttls(self, context=None):
        self.started_tls = True

    def login(self, user, password):
        self.logged_in = (user, password)

    def send_message(self, msg):
        self.sent = msg


class AuthFailSMTP(FakeSMTP):
    def login(self, user, password):
        self.logged_in = (user, password)
        raise smtplib.SMTPAuthenticationError(535, b"bad " + password.encode())


def _enable(monkeypatch, **env):
    for key, value in env.items():
        monkeypatch.setenv(key, value)
    _clear()


def _token_from_message(msg) -> str:
    body = msg.get_content()
    line = next(ln for ln in body.splitlines() if "token=" in ln)
    return parse_qs(urlparse(line).query)["token"][0]


async def test_without_smtp_returns_the_link_and_sends_nothing(client, service_token, monkeypatch):
    monkeypatch.setattr("app.services.lead_notify.smtplib.SMTP", FakeSMTP)
    FakeSMTP.instances = []
    r = await client.post(URL, json=BODY, headers={"X-Service-Token": service_token})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["password_set_url"].startswith("http://app.test/set-password?token=")
    assert data["password_set_email_sent"] is False
    assert FakeSMTP.instances == []


async def test_with_smtp_emails_the_owner_and_hides_the_link(client, service_token, monkeypatch):
    _enable(
        monkeypatch,
        SMTP_HOST="smtp.example",
        SMTP_PORT="587",
        SMTP_FROM="Zenkyra <notify@example.com>",
        SMTP_USER="apikey",
        SMTP_PASSWORD=SMTP_PASSWORD,
        PASSWORD_SET_URL_BASE="http://app.test/set-password",
    )
    monkeypatch.setattr("app.services.lead_notify.smtplib.SMTP", FakeSMTP)
    FakeSMTP.instances = []
    r = await client.post(URL, json=BODY, headers={"X-Service-Token": service_token})
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["password_set_url"] is None
    assert data["password_set_email_sent"] is True
    assert data["password_set_expires_at"]
    assert len(FakeSMTP.instances) == 1
    msg = FakeSMTP.instances[0].sent
    assert msg["To"] == "owner@example.com"
    assert msg["Subject"] == "[Zenkyra] Defina a sua palavra-passe"
    raw = msg.get_content()
    assert "uso único" in raw
    assert "não é uma fatura" in raw
    assert SMTP_PASSWORD not in raw
    token = _token_from_message(msg)
    assert token not in r.text
    set_pw = await client.post(
        "/api/v1/auth/set-password",
        json={"token": token, "password": "correct-horse-1"},
    )
    assert set_pw.status_code == 200 and set_pw.json()["access_token"]


async def test_smtp_failure_returns_the_link(client, service_token, monkeypatch, caplog):
    _enable(
        monkeypatch,
        SMTP_HOST="smtp.example",
        SMTP_FROM="notify@example.com",
        SMTP_USER="apikey",
        SMTP_PASSWORD=SMTP_PASSWORD,
        PASSWORD_SET_URL_BASE="http://app.test/set-password",
    )
    monkeypatch.setattr("app.services.lead_notify.smtplib.SMTP", AuthFailSMTP)
    AuthFailSMTP.instances = []
    with caplog.at_level(logging.DEBUG):
        r = await client.post(URL, json=BODY, headers={"X-Service-Token": service_token})
    data = r.json()
    assert data["password_set_email_sent"] is False
    assert data["password_set_url"].startswith("http://app.test/set-password?token=")
    assert SMTP_PASSWORD not in r.text
    assert SMTP_PASSWORD not in caplog.text
    token = parse_qs(urlparse(data["password_set_url"]).query)["token"][0]
    assert token not in caplog.text


async def test_repeat_emails_a_fresh_link(client, service_token, monkeypatch):
    _enable(
        monkeypatch,
        SMTP_HOST="smtp.example",
        SMTP_FROM="notify@example.com",
        SMTP_STARTTLS="false",
        PASSWORD_SET_URL_BASE="http://app.test/set-password",
    )
    monkeypatch.setattr("app.services.lead_notify.smtplib.SMTP", FakeSMTP)
    FakeSMTP.instances = []
    headers = {"X-Service-Token": service_token}
    first = await client.post(URL, json=BODY, headers=headers)
    second = await client.post(URL, json=BODY, headers=headers)
    assert first.json()["password_set_email_sent"] is True
    assert second.json()["created"] is False
    assert second.json()["password_set_url"] is None
    assert len(FakeSMTP.instances) == 2
    old = _token_from_message(FakeSMTP.instances[0].sent)
    new = _token_from_message(FakeSMTP.instances[1].sent)
    assert old != new
    assert (
        await client.post("/api/v1/auth/set-password", json={"token": old, "password": "new-password-1"})
    ).status_code == 400
    assert (
        await client.post("/api/v1/auth/set-password", json={"token": new, "password": "new-password-1"})
    ).status_code == 200
