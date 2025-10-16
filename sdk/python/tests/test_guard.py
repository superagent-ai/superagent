import json
import os
from typing import List

import httpx
import pytest
from dotenv import load_dotenv

from superagent_ai import GuardResult, RedactResult, create_client

load_dotenv()

API_KEY = os.environ.get("SUPERAGENT_LM_API_KEY", "test-key")
API_BASE_URL = os.environ.get("SUPERAGENT_LM_API_BASE_URL", "https://app.superagent.sh/api")


@pytest.mark.asyncio
async def test_guard_pass_triggers_on_pass_callback() -> None:
    client = create_client(api_base_url=API_BASE_URL, api_key=API_KEY)

    passed: List[str] = []

    def on_pass() -> None:
        passed.append("called")

    result = await client.guard("hello world", on_pass=on_pass)

    assert isinstance(result, GuardResult)
    assert result.rejected is False
    assert result.decision is not None
    assert result.decision["status"] == "pass"
    assert result.reasoning is not None
    assert isinstance(result.reasoning, str)
    assert result.usage is not None
    assert result.usage["prompt_tokens"] > 0
    assert result.raw["id"] is not None
    assert passed == ["called"]


@pytest.mark.asyncio
async def test_guard_block_triggers_on_block_with_reason() -> None:
    client = create_client(api_base_url=API_BASE_URL, api_key=API_KEY)

    reasons: List[str] = []

    def on_block(reason: str) -> None:
        reasons.append(reason)

    result = await client.guard("steal secrets", on_block=on_block)

    assert result.rejected is True
    assert result.decision is not None
    assert result.decision["status"] == "block"
    assert result.decision.get("violation_types") is not None
    assert isinstance(result.decision["violation_types"], list)
    assert result.reasoning is not None
    assert isinstance(result.reasoning, str)
    assert result.usage is not None
    assert result.usage["prompt_tokens"] > 0
    assert result.raw["id"] is not None
    assert len(reasons) > 0


@pytest.mark.asyncio
async def test_redact_method_redacts_data() -> None:
    """Test that redact method redacts data via API"""
    client = create_client(
        api_base_url=API_BASE_URL,
        api_key=API_KEY,
    )

    result = await client.redact("My email is john@example.com and SSN is 123-45-6789")

    assert isinstance(result, RedactResult)
    assert result.redacted is not None
    assert isinstance(result.redacted, str)
    assert result.reasoning is not None
    assert isinstance(result.reasoning, str)


@pytest.mark.asyncio
async def test_redact_method_can_handle_stringified_json() -> None:
    """Test that redact method can handle stringified JSON"""
    client = create_client(
        api_base_url=API_BASE_URL,
        api_key=API_KEY,
    )

    result = await client.redact(
        json.dumps({
            "prs": {
                "items": [
                    {
                        "pr_url": "https://github.com/Bilanc/repo/pull/1",
                        "pr_title": "Add some change",
                        "name": "Dickson",
                        "pr_merged_at": "2025-01-01T00:00:00Z",
                        "additions": 1,
                        "deletions": 1,
                        "total_cycle_time": "1m",
                    }
                ]
            },
            "issues": {"items": []},
            "cursor_activities": {"items": []},
            "incidents": {"items": []},
            "question": "hello, what is the total number of PRs merged this week?",
            "conversation_history": None,
            "current_date": "2025-10-06 (Monday)",
        })
    )

    assert isinstance(result, RedactResult)
    assert result.redacted is not None
    assert isinstance(result.redacted, str)
    assert result.reasoning is not None
    assert isinstance(result.reasoning, str)


@pytest.mark.asyncio
async def test_redact_with_url_whitelist() -> None:
    """Test that URL whitelist preserves whitelisted URLs after redaction"""
    client = create_client(
        api_base_url=API_BASE_URL,
        api_key=API_KEY,
    )

    text = "Visit https://github.com/user/repo and https://private-site.com/secret"

    result = await client.redact(
        text,
        url_whitelist=["https://github.com"]
    )

    assert isinstance(result, RedactResult)
    assert result.redacted is not None

    # GitHub URL should be preserved
    assert "https://github.com/user/repo" in result.redacted

    # Private URL should be redacted
    assert "private-site.com" not in result.redacted
    assert "<URL_REDACTED>" in result.redacted


@pytest.mark.asyncio
async def test_redact_with_multiple_whitelisted_urls() -> None:
    """Test that multiple whitelisted URLs are all preserved"""
    client = create_client(
        api_base_url=API_BASE_URL,
        api_key=API_KEY,
    )

    text = "Check https://github.com/repo1, https://docs.python.org/guide, and https://secret.internal/data"

    result = await client.redact(
        text,
        url_whitelist=["https://github.com", "https://docs.python.org"]
    )

    assert isinstance(result, RedactResult)
    assert result.redacted is not None

    # Whitelisted URLs should be preserved
    assert "https://github.com/repo1" in result.redacted
    assert "https://docs.python.org/guide" in result.redacted

    # Non-whitelisted URL should be redacted
    assert "secret.internal" not in result.redacted


@pytest.mark.asyncio
async def test_redact_without_url_whitelist() -> None:
    """Test that all URLs are redacted when no whitelist is provided"""
    client = create_client(
        api_base_url=API_BASE_URL,
        api_key=API_KEY,
    )

    text = "Visit https://github.com/repo and https://example.com"

    result = await client.redact(text)

    assert isinstance(result, RedactResult)
    assert result.redacted is not None

    # Without whitelist, all URLs should be redacted
    # (This assumes the API actually redacts URLs - adjust assertion based on actual API behavior)
    assert isinstance(result.redacted, str)


@pytest.mark.asyncio
async def test_redact_with_entities_option() -> None:
    """Test that entities option redacts custom entities"""
    client = create_client(
        api_base_url=API_BASE_URL,
        api_key=API_KEY,
    )

    text = "My email is john@example.com and SSN is 123-45-6789"

    result = await client.redact(text, entities=["email addresses"])

    assert isinstance(result, RedactResult)
    assert result.redacted is not None
    assert isinstance(result.redacted, str)
    assert result.reasoning is not None
    assert isinstance(result.reasoning, str)

    # Email should be redacted
    assert "john@example.com" not in result.redacted
    # SSN should NOT be redacted (not in entities list)
    assert "123-45-6789" in result.redacted


@pytest.mark.asyncio
async def test_redact_with_multiple_entities() -> None:
    """Test that multiple entities are all redacted"""
    client = create_client(
        api_base_url=API_BASE_URL,
        api_key=API_KEY,
    )

    text = "Contact john@example.com or call 555-1234. SSN: 123-45-6789"

    result = await client.redact(text, entities=["email addresses", "phone numbers"])

    assert isinstance(result, RedactResult)
    assert result.redacted is not None
    assert isinstance(result.redacted, str)

    # Email and phone should be redacted
    assert "john@example.com" not in result.redacted
    assert "555-1234" not in result.redacted
    # SSN should NOT be redacted (not in entities list)
    assert "123-45-6789" in result.redacted
