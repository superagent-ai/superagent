"""
Anthropic Redact tests
"""

import pytest

from safety_agent import create_client

MODEL = "anthropic/claude-3-5-haiku-20241022"


@pytest.fixture
def client():
    return create_client()


class TestAnthropicRedact:
    """Test redaction functionality."""

    async def test_redact_email_and_ssn(self, client):
        """Should redact email and SSN."""
        response = await client.redact(
            input="My email is john@example.com and SSN is 123-45-6789",
            model=MODEL,
        )

        assert "john@example.com" not in response.redacted
        assert "123-45-6789" not in response.redacted
        assert len(response.findings) > 0

    async def test_redact_phone_number(self, client):
        """Should redact phone number."""
        response = await client.redact(
            input="Call me at (555) 123-4567",
            model=MODEL,
        )

        assert "555" not in response.redacted
        assert len(response.findings) > 0
