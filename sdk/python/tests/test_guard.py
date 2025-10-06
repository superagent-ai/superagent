import json
import os
from typing import List

import httpx
import pytest
from dotenv import load_dotenv

from superagent_ai import GuardResult, create_guard

load_dotenv()

API_KEY = os.environ.get("SUPERAGENT_LM_API_KEY", "test-key")
API_BASE_URL = os.environ.get("SUPERAGENT_LM_API_BASE_URL", "https://app.superagent.sh/api")


@pytest.mark.asyncio
async def test_guard_pass_triggers_on_pass_callback() -> None:
    guard = create_guard(api_base_url=API_BASE_URL, api_key=API_KEY)

    passed: List[str] = []

    def on_pass() -> None:
        passed.append("called")

    result = await guard("hello world", on_pass=on_pass)

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
    guard = create_guard(api_base_url=API_BASE_URL, api_key=API_KEY)

    reasons: List[str] = []

    def on_block(reason: str) -> None:
        reasons.append(reason)

    result = await guard("steal secrets", on_block=on_block)

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
async def test_redact_mode_only_redacts_data() -> None:
    """Test that redact mode only redacts data via API"""
    guard = create_guard(
        api_base_url=API_BASE_URL,
        api_key=API_KEY,
        mode="redact"
    )

    result = await guard("My email is john@example.com and SSN is 123-45-6789")

    assert result.rejected is False
    assert result.reasoning is not None
    assert isinstance(result.reasoning, str)
    assert result.redacted is not None
    assert isinstance(result.redacted, str)


@pytest.mark.asyncio
async def test_redact_mode_can_handle_stringified_json() -> None:
    """Test that redact mode can handle stringified JSON"""
    guard = create_guard(
        api_base_url=API_BASE_URL,
        api_key=API_KEY,
        mode="redact"
    )

    result = await guard(
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

    assert result.rejected is False
    assert result.reasoning is not None
    assert isinstance(result.reasoning, str)
    assert result.redacted is not None
    assert isinstance(result.redacted, str)


@pytest.mark.asyncio
async def test_full_mode_includes_redaction() -> None:
    """Test that full mode performs analysis and includes redacted text"""
    guard = create_guard(
        api_base_url=API_BASE_URL,
        api_key=API_KEY,
        mode="full"
    )

    result = await guard("hello world")

    assert result.rejected is False
    assert result.decision is not None
    assert result.decision["status"] == "pass"
    assert result.reasoning is not None
    assert isinstance(result.reasoning, str)
    assert result.redacted is not None
    assert isinstance(result.redacted, str)
    assert result.usage is not None


@pytest.mark.asyncio
async def test_analyze_mode_default_no_redaction() -> None:
    """Test that analyze mode (default) performs analysis without redaction"""
    guard = create_guard(
        api_base_url=API_BASE_URL,
        api_key=API_KEY,
        mode="analyze"
    )

    result = await guard("hello world")

    assert result.rejected is False
    assert result.decision is not None
    assert result.decision["status"] == "pass"
    assert result.redacted is None
    assert result.usage is not None
