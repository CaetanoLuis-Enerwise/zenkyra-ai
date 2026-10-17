"""CORS is restricted to CORS_ALLOW_ORIGINS (the Next.js origin), no wildcard by default."""

from httpx import ASGITransport, AsyncClient

from app.core.config import get_settings


async def _preflight(origin):
    from app.main import create_application

    app = create_application()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        return await c.options(
            "/api/v1/auth/login",
            headers={"Origin": origin, "Access-Control-Request-Method": "POST",
                     "Access-Control-Request-Headers": "authorization,content-type"},
        )


async def test_allowed_origin_gets_cors_headers(monkeypatch):
    monkeypatch.setenv("CORS_ALLOW_ORIGINS", "https://app.example.com, http://localhost:3000")
    get_settings.cache_clear()
    r = await _preflight("https://app.example.com")
    assert r.status_code == 200
    assert r.headers["access-control-allow-origin"] == "https://app.example.com"
    assert "access-control-allow-credentials" not in r.headers
    get_settings.cache_clear()


async def test_unknown_origin_is_rejected(monkeypatch):
    monkeypatch.setenv("CORS_ALLOW_ORIGINS", "https://app.example.com")
    get_settings.cache_clear()
    r = await _preflight("https://evil.example.net")
    assert r.status_code == 400
    assert "access-control-allow-origin" not in r.headers
    get_settings.cache_clear()
