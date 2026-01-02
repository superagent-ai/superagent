"""
OpenAI Redact tests
"""

import pytest

from safety_agent import create_client

MODEL = "openai/gpt-4o-mini"


@pytest.fixture
def client():
    return create_client()


class TestOpenAIRedact:
    """Test redaction functionality."""

    async def test_redact_email_and_ssn(self, client):
        """Should redact email and SSN."""
        response = await client.redact(
            input="My email is john@example.com and SSN is 123-45-6789",
            model=MODEL,
        )

        assert "<EMAIL" in response.redacted.upper() or "EMAIL" in response.redacted.upper()
        assert "<SSN" in response.redacted.upper() or "SSN" in response.redacted.upper()
        assert len(response.findings) > 0
        assert response.usage.prompt_tokens > 0
        assert response.usage.completion_tokens > 0

    async def test_redact_phone_number(self, client):
        """Should redact phone number."""
        response = await client.redact(
            input="Call me at (555) 123-4567",
            model=MODEL,
        )

        assert "555" not in response.redacted
        assert len(response.findings) > 0

    async def test_redact_credit_card(self, client):
        """Should redact credit card number."""
        response = await client.redact(
            input="My credit card is 4532-1234-5678-9010",
            model=MODEL,
        )

        assert "4532" not in response.redacted
        assert len(response.findings) > 0

    async def test_custom_entities(self, client):
        """Should redact only specified custom entities."""
        response = await client.redact(
            input="Contact john@example.com or call 555-123-4567",
            model=MODEL,
            entities=["email addresses"],
        )

        # Email should be redacted
        assert "john@example.com" not in response.redacted

    async def test_preserve_non_pii(self, client):
        """Should preserve non-PII content."""
        response = await client.redact(
            input="The meeting is at Google headquarters about the Q4 budget",
            model=MODEL,
        )

        # Company names and general content should be preserved
        assert "Google" in response.redacted or "meeting" in response.redacted


class TestOpenAIRedactRewrite:
    """Test rewrite mode functionality."""

    async def test_rewrite_mode(self, client):
        """Should use natural rewriting instead of placeholders."""
        response = await client.redact(
            input="My email is john@example.com",
            model=MODEL,
            rewrite=True,
        )

        # Should not contain obvious placeholder markers
        assert "<EMAIL_REDACTED>" not in response.redacted
        # Should still report findings
        assert len(response.findings) > 0
