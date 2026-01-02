"""
Provider registry and utilities
"""

import os
from typing import Any

import httpx

from ..types import ChatMessage, AnalysisResponse, ParsedModel
from ..schemas import ResponseFormat
from .openai import openai_provider
from .anthropic import anthropic_provider
from .google import google_provider
from .bedrock import bedrock_provider
from .groq import groq_provider
from .fireworks import fireworks_provider
from .openrouter import openrouter_provider
from .vercel import vercel_provider
from .superagent import superagent_provider

# Default model for guard() when no model is specified
DEFAULT_GUARD_MODEL = "superagent/guard-1.7b"

# Registry of supported providers
providers: dict[str, Any] = {
    "openai": openai_provider,
    "anthropic": anthropic_provider,
    "google": google_provider,
    "bedrock": bedrock_provider,
    "groq": groq_provider,
    "fireworks": fireworks_provider,
    "openrouter": openrouter_provider,
    "vercel": vercel_provider,
    "superagent": superagent_provider,
}


def parse_model(model_string: str) -> ParsedModel:
    """
    Parse a model string in 'provider/model' format.

    Example: 'openai/gpt-4o' -> ParsedModel(provider='openai', model='gpt-4o')
    """
    slash_index = model_string.find("/")

    if slash_index == -1:
        raise ValueError(
            f'Invalid model format: "{model_string}". '
            'Expected "provider/model" format (e.g., "openai/gpt-4o").'
        )

    provider = model_string[:slash_index]
    model = model_string[slash_index + 1:]

    if not provider or not model:
        raise ValueError(
            f'Invalid model format: "{model_string}". '
            "Both provider and model are required."
        )

    return ParsedModel(provider=provider, model=model)


def get_provider(provider_name: str) -> Any:
    """Get the provider configuration for a given provider name."""
    provider = providers.get(provider_name)

    if not provider:
        supported = ", ".join(providers.keys())
        raise ValueError(
            f'Unsupported provider: "{provider_name}". '
            f"Supported providers: {supported}"
        )

    return provider


async def call_provider(
    model_string: str,
    messages: list[ChatMessage],
    response_format: ResponseFormat | None = None,
) -> AnalysisResponse:
    """Call an LLM provider with the given messages."""
    parsed = parse_model(model_string)
    provider = get_provider(parsed.provider)

    # Get API key from environment
    api_key = ""
    if provider.env_var:
        api_key = os.environ.get(provider.env_var, "")
        if not api_key:
            raise ValueError(
                f"Missing API key: {provider.env_var} environment variable "
                f"is required for {parsed.provider} provider"
            )

    # Build request
    request_body = provider.transform_request(parsed.model, messages, response_format)
    headers = provider.auth_header(api_key)
    url = provider.build_url(provider.base_url, parsed.model)

    # Special handling for Bedrock (AWS Signature V4)
    if parsed.provider == "bedrock":
        import json
        payload = json.dumps(request_body)
        headers = provider.get_signed_headers(url, "POST", payload, api_key)

    # Make request
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url,
            headers=headers,
            json=request_body,
            timeout=60.0,
        )

        if response.status_code != 200:
            raise RuntimeError(
                f"Provider API error ({response.status_code}): {response.text}"
            )

        response_data = response.json()

    return provider.transform_response(response_data)


__all__ = [
    "DEFAULT_GUARD_MODEL",
    "providers",
    "parse_model",
    "get_provider",
    "call_provider",
]
