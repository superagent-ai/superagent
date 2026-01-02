"""
Provider configuration types
"""

from dataclasses import dataclass
from typing import Any, Callable, Protocol

from ..types import ChatMessage, AnalysisResponse
from ..schemas import ResponseFormat


class ProviderConfig(Protocol):
    """Configuration for a provider."""

    base_url: str
    """Base URL for the API endpoint."""

    env_var: str
    """Environment variable name for the API key."""

    def auth_header(self, api_key: str) -> dict[str, str]:
        """Generate auth headers."""
        ...

    def build_url(self, base_url: str, model: str) -> str:
        """Build the full URL (optional, defaults to base_url)."""
        ...

    def transform_request(
        self,
        model: str,
        messages: list[ChatMessage],
        response_format: ResponseFormat | None = None,
    ) -> dict[str, Any]:
        """Transform messages to provider-specific request body."""
        ...

    def transform_response(self, response: dict[str, Any]) -> AnalysisResponse:
        """Transform provider response to unified AnalysisResponse."""
        ...


@dataclass
class BaseProviderConfig:
    """Base configuration for a provider."""

    base_url: str
    env_var: str

    def auth_header(self, api_key: str) -> dict[str, str]:
        """Default Bearer token auth."""
        return {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

    def build_url(self, base_url: str, model: str) -> str:
        """Default URL builder (just returns base_url)."""
        return base_url

    def transform_request(
        self,
        model: str,
        messages: list[ChatMessage],
        response_format: ResponseFormat | None = None,
    ) -> dict[str, Any]:
        """Transform messages to provider-specific request body."""
        raise NotImplementedError

    def transform_response(self, response: dict[str, Any]) -> AnalysisResponse:
        """Transform provider response to unified AnalysisResponse."""
        raise NotImplementedError
