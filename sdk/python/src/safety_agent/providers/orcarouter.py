"""
OrcaRouter provider configuration (OpenAI-compatible API)

OrcaRouter is an OpenAI-compatible AI gateway: one endpoint and one API key
(``sk-orca-…``) in front of many model providers. Model IDs keep their
``vendor/model`` namespace, giving the SDK a nested
``orcarouter/openai/gpt-5.5`` form.

Inference and authentication use different origins. Only inference is used
here: ``https://api.orcarouter.ai/v1`` — never
``https://api.orcarouter.ai/v1/auth/keys`` (that path is a 404).
"""

from __future__ import annotations

import os
from typing import Any
from urllib.parse import urlparse

from ..types import ChatMessage, AnalysisResponse, TokenUsage, AnalysisResponseChoice
from ..schemas import ResponseFormat

ORCAROUTER_DEFAULT_API_BASE_URL = "https://api.orcarouter.ai/v1"

_LOOPBACK_HOSTS = {"localhost", "127.0.0.1", "::1"}


def get_orcarouter_base_url() -> str:
    """Resolve the OrcaRouter inference base URL.

    Defaults to the public endpoint. Self-hosted deployments can override it
    with ``ORCA_API_BASE_URL``; ``ORCA_BASE_URL`` is honoured as a shared
    fallback. Remote origins must be HTTPS — plain HTTP is only allowed on
    loopback.
    """
    configured = (
        os.environ.get("ORCA_API_BASE_URL", "").strip()
        or os.environ.get("ORCA_BASE_URL", "").strip()
    )
    if not configured:
        return ORCAROUTER_DEFAULT_API_BASE_URL

    url = configured.rstrip("/")
    parsed = urlparse(url)
    if not parsed.scheme or not parsed.netloc:
        raise ValueError(
            f'Invalid OrcaRouter base URL: "{configured}". '
            "Expected an absolute http(s) URL."
        )

    hostname = parsed.hostname or ""
    is_loopback = hostname in _LOOPBACK_HOSTS
    if parsed.scheme != "https" and not (parsed.scheme == "http" and is_loopback):
        raise ValueError(
            f'Insecure OrcaRouter base URL: "{configured}". '
            "HTTPS is required for non-loopback origins."
        )

    return url


def build_orcarouter_url(base_url: str = "") -> str:
    """Build the chat completions URL: ``<base>/chat/completions``."""
    base = (base_url or get_orcarouter_base_url()).rstrip("/")
    return f"{base}/chat/completions"


class OrcaRouterProvider:
    """OrcaRouter provider configuration using the OpenAI-compatible API."""

    base_url = ORCAROUTER_DEFAULT_API_BASE_URL
    env_var = "ORCAROUTER_API_KEY"

    def auth_header(self, api_key: str) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

    def build_url(self, base_url: str, model: str) -> str:
        return build_orcarouter_url(get_orcarouter_base_url())

    def transform_request(
        self,
        model: str,
        messages: list[ChatMessage],
        response_format: ResponseFormat | None = None,
    ) -> dict[str, Any]:
        request: dict[str, Any] = {
            "model": model,
            "messages": [
                {
                    "role": msg.role,
                    "content": msg.content
                    if isinstance(msg.content, str)
                    else msg.content,
                }
                for msg in messages
            ],
            "temperature": 0,
        }

        if response_format:
            request["response_format"] = response_format

        return request

    def transform_response(self, response: dict[str, Any]) -> AnalysisResponse:
        choices = response.get("choices") or []
        content = ""
        if choices:
            message = choices[0].get("message") or {}
            content = message.get("content") or ""

        usage = response.get("usage") or {}
        return AnalysisResponse(
            id=response.get("id", ""),
            usage=TokenUsage(
                prompt_tokens=usage.get("prompt_tokens", 0),
                completion_tokens=usage.get("completion_tokens", 0),
                total_tokens=usage.get("total_tokens", 0),
            ),
            choices=[
                AnalysisResponseChoice(
                    index=0,
                    message=ChatMessage(role="assistant", content=content),
                    finish_reason=(
                        choices[0].get("finish_reason", "stop") if choices else "stop"
                    ),
                )
            ],
        )


orcarouter_provider = OrcaRouterProvider()
