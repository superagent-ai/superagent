"""
OpenAI-compatible Redact tests
"""

import pytest

from safety_agent import create_client

MODEL = "openai-compatible/gpt-4o-mini"


@pytest.fixture
def client():
    return create_client()


class TestOpenAICompatibleRedact:
    """Functional tests for OpenAI-compatible redact."""

    async def test_redact_email(self, client):
        response = await client.redact(
            input="Contact me at john.doe@example.com for more information.",
            model=MODEL,
        )

        assert "john.doe@example.com" not in response.redacted
        assert len(response.findings) > 0
        assert response.usage.prompt_tokens > 0
        assert response.usage.completion_tokens > 0

    async def test_preserve_non_pii(self, client):
        response = await client.redact(
            input="The weather today is sunny with a high of 75 degrees.",
            model=MODEL,
        )

        assert response.redacted == "The weather today is sunny with a high of 75 degrees."
        assert response.findings == []
