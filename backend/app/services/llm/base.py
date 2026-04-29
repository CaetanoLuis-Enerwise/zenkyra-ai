"""Abstract LLM provider contract — swap Gemini → Vertex → Anthropic later."""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any


@dataclass
class TokenUsage:
    prompt_tokens: int | None = None
    completion_tokens: int | None = None
    total_tokens: int | None = None


class LLMProvider(ABC):
    name: str = "abstract"

    @property
    def chat_model_name(self) -> str:
        return "unknown"

    @abstractmethod
    async def generate_response(
        self, prompt: str, context: str | None = None
    ) -> tuple[str, TokenUsage]:
        """Answer user prompt with optional retrieved context."""

    @abstractmethod
    async def summarize_document(self, text: str) -> tuple[str, TokenUsage]:
        """Produce executive summary of raw document text."""

    @abstractmethod
    async def classify_lead(self, data: dict[str, Any]) -> tuple[dict[str, Any], TokenUsage]:
        """Structured sales lead scoring / routing."""

    @abstractmethod
    async def embed_text(self, text: str) -> tuple[list[float], TokenUsage]:
        """Embedding vector for RAG."""
