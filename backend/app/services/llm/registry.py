"""Provider registry — primary Gemini; add fallbacks without touching call sites."""

from typing import TYPE_CHECKING

from app.core.config import get_settings

if TYPE_CHECKING:
    from app.services.llm.base import LLMProvider

_REGISTRY: dict[str, type["LLMProvider"]] = {}


def register_provider(name: str, cls: type["LLMProvider"]) -> None:
    _REGISTRY[name.lower()] = cls


def get_llm_provider(name: str | None = None) -> "LLMProvider":
    settings = get_settings()
    key = (name or settings.LLM_PROVIDER).lower()
    if key not in _REGISTRY:
        raise RuntimeError(
            f"LLM provider '{key}' not registered. Available: {list(_REGISTRY)}"
        )
    return _REGISTRY[key]()


def register_defaults() -> None:
    from app.services.llm.providers.gemini import GeminiProvider

    register_provider("gemini", GeminiProvider)
