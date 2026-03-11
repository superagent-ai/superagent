"""
Redact unit tests – mocks call_provider to avoid hitting real APIs.
"""

import json
from unittest.mock import AsyncMock, patch

import pytest

from safety_agent import create_client
from safety_agent.types import (
    AnalysisResponse,
    AnalysisResponseChoice,
    ChatMessage,
    TokenUsage,
)


def _redact_response(
    redacted: str,
    findings: list[str],
    prompt_tokens: int = 100,
    completion_tokens: int = 50,
) -> AnalysisResponse:
    content = json.dumps({"redacted": redacted, "findings": findings})
    return AnalysisResponse(
        id="mock-id",
        usage=TokenUsage(
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=prompt_tokens + completion_tokens,
        ),
        choices=[
            AnalysisResponseChoice(
                index=0,
                message=ChatMessage(role="assistant", content=content),
                finish_reason="stop",
            )
        ],
    )


PROVIDER_MODELS = [
    "openai/gpt-4o-mini",
    "anthropic/claude-haiku-4-5",
    "google/gemini-2.0-flash",
    "groq/llama-3.3-70b-versatile",
    "fireworks/accounts/fireworks/models/llama-v3p1-8b-instruct",
    "openrouter/openai/gpt-4o-mini",
    "vercel/openai/gpt-4o-mini",
    "openai-compatible/gpt-4o-mini",
]


@pytest.fixture
def mock_call_provider():
    with patch(
        "safety_agent.client.call_provider", new_callable=AsyncMock
    ) as m:
        yield m


class TestRedactProviders:
    """Verify redact works with every supported provider."""

    @pytest.mark.parametrize("model", PROVIDER_MODELS)
    async def test_redact_pii(self, mock_call_provider, model):
        mock_call_provider.return_value = _redact_response(
            "Contact me at <EMAIL_REDACTED> for more info.",
            ["john.doe@example.com"],
        )
        client = create_client(api_key="test-key")

        response = await client.redact(
            input="Contact me at john.doe@example.com for more info.",
            model=model,
        )

        assert "<EMAIL_REDACTED>" in response.redacted
        assert "john.doe@example.com" not in response.redacted
        assert response.findings == ["john.doe@example.com"]
        assert response.usage.prompt_tokens == 100
        assert response.usage.completion_tokens == 50
        assert response.usage.total_tokens == 150
        mock_call_provider.assert_called_once()
        assert mock_call_provider.call_args[0][0] == model

    @pytest.mark.parametrize("model", PROVIDER_MODELS)
    async def test_preserve_safe_content(self, mock_call_provider, model):
        safe = "The weather today is sunny with a high of 75 degrees."
        mock_call_provider.return_value = _redact_response(safe, [])
        client = create_client(api_key="test-key")

        response = await client.redact(input=safe, model=model)

        assert response.redacted == safe
        assert response.findings == []


class TestRedactCustomEntities:
    """Verify custom entities parameter."""

    async def test_entities_in_system_prompt(self, mock_call_provider):
        mock_call_provider.return_value = _redact_response(
            "<EMAIL_REDACTED>, phone is 555-123-4567.",
            ["john@example.com"],
        )
        client = create_client(api_key="test-key")

        await client.redact(
            input="john@example.com, phone is 555-123-4567.",
            entities=["email addresses"],
            model="openai/gpt-4o-mini",
        )

        messages = mock_call_provider.call_args[0][1]
        system_msg = next(m for m in messages if m.role == "system")
        assert "email addresses" in system_msg.content


class TestRedactRewrite:
    """Verify rewrite mode."""

    async def test_rewrite_mode(self, mock_call_provider):
        mock_call_provider.return_value = _redact_response(
            "My email is user@company.net and my phone is 555-000-0000.",
            ["john@example.com", "555-123-4567"],
        )
        client = create_client(api_key="test-key")

        response = await client.redact(
            input="My email is john@example.com and my phone is 555-123-4567.",
            rewrite=True,
            model="anthropic/claude-haiku-4-5",
        )

        assert len(response.findings) > 0
        messages = mock_call_provider.call_args[0][1]
        system_msg = next(m for m in messages if m.role == "system")
        assert "rewrite" in system_msg.content.lower()

    async def test_placeholder_mode(self, mock_call_provider):
        mock_call_provider.return_value = _redact_response(
            "My email is <EMAIL_REDACTED>.", ["john@example.com"]
        )
        client = create_client(api_key="test-key")

        response = await client.redact(
            input="My email is john@example.com.",
            rewrite=False,
            model="anthropic/claude-haiku-4-5",
        )

        assert "REDACTED" in response.redacted


class TestRedactMultiplePII:
    """Verify multiple PII types are handled."""

    async def test_multiple_pii_types(self, mock_call_provider):
        mock_call_provider.return_value = _redact_response(
            "<NAME_REDACTED>, email: <EMAIL_REDACTED>, phone: <PHONE_REDACTED>, SSN: <SSN_REDACTED>.",
            ["John Smith", "john@test.com", "555-111-2222", "111-22-3333"],
        )
        client = create_client(api_key="test-key")

        response = await client.redact(
            input="My name is John Smith, email: john@test.com, phone: 555-111-2222, SSN: 111-22-3333.",
            model="openai/gpt-4o-mini",
        )

        assert "john@test.com" not in response.redacted
        assert "555-111-2222" not in response.redacted
        assert len(response.findings) == 4


class TestRedactErrors:
    """Verify error handling."""

    async def test_no_content_raises(self, mock_call_provider):
        mock_call_provider.return_value = AnalysisResponse(
            id="mock-id",
            usage=TokenUsage(prompt_tokens=0, completion_tokens=0, total_tokens=0),
            choices=[
                AnalysisResponseChoice(
                    index=0,
                    message=ChatMessage(role="assistant", content=""),
                    finish_reason="stop",
                )
            ],
        )
        client = create_client(api_key="test-key")

        with pytest.raises(RuntimeError, match="No response content"):
            await client.redact(input="Test", model="openai/gpt-4o-mini")

    async def test_markdown_wrapped_json(self, mock_call_provider):
        wrapped = '```json\n{"redacted":"Safe text.","findings":[]}\n```'
        mock_call_provider.return_value = AnalysisResponse(
            id="mock-id",
            usage=TokenUsage(prompt_tokens=10, completion_tokens=5, total_tokens=15),
            choices=[
                AnalysisResponseChoice(
                    index=0,
                    message=ChatMessage(role="assistant", content=wrapped),
                    finish_reason="stop",
                )
            ],
        )
        client = create_client(api_key="test-key")

        response = await client.redact(
            input="Safe text.", model="anthropic/claude-haiku-4-5"
        )

        assert response.redacted == "Safe text."
        assert response.findings == []
