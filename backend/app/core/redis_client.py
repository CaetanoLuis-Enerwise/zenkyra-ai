"""Async Redis client (caching, rate limits, task locks)."""

from typing import Optional

import redis.asyncio as redis

from app.core.config import get_settings

_client: Optional[redis.Redis] = None


def get_redis() -> redis.Redis:
    global _client
    if _client is None:
        settings = get_settings()
        _client = redis.from_url(
            str(settings.REDIS_URL),
            encoding="utf-8",
            decode_responses=True,
        )
    return _client


async def redis_ping() -> bool:
    try:
        r = get_redis()
        return await r.ping()
    except Exception:
        return False
