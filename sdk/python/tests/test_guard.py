import json
from typing import List

import httpx
import pytest

from superagent_ai import GuardResult, create_guard

API_BASE_URL = "https://example.com/guard"
API_KEY = "test-key"


@pytest.mark.asyncio
async def test_guard_pass_triggers_on_pass_callback() -> None:
    async def handler(request: httpx.Request) -> httpx.Response:
        assert request.headers["authorization"] == f"Bearer {API_KEY}"
        assert request.headers["x-superagent-api-key"] == API_KEY
        assert request.method == "POST"
        assert request.url == httpx.URL(API_BASE_URL)
        # Compare JSON content, not raw bytes (different Python versions format differently)
        import json
        assert json.loads(request.content) == {"prompt": "hello"}

        analysis = {
            "usage": {"prompt_tokens": 1, "completion_tokens": 1, "total_tokens": 2},
            "id": "analysis-pass",
            "choices": [
                {
                    "message": {
                        "content": json.dumps({"status": "pass"}),
                        "reasoning_content": "Looks safe",
                    }
                }
            ],
        }
        return httpx.Response(200, json=analysis)

    transport = httpx.MockTransport(handler)
    async with httpx.AsyncClient(transport=transport) as client:
        guard = create_guard(api_base_url=API_BASE_URL, api_key=API_KEY, client=client)

        passed: List[str] = []

        def on_pass() -> None:
            passed.append("called")

        result = await guard("hello", on_pass=on_pass)

        assert isinstance(result, GuardResult)
        assert result.rejected is False
        assert result.decision == {"status": "pass"}
        assert result.reasoning == "Looks safe"
        assert result.usage == {
            "prompt_tokens": 1,
            "completion_tokens": 1,
            "total_tokens": 2,
        }
        assert result.raw["id"] == "analysis-pass"
        assert passed == ["called"]


@pytest.mark.asyncio
async def test_guard_block_triggers_on_block_with_reason() -> None:
    async def handler(request: httpx.Request) -> httpx.Response:
        analysis = {
            "usage": {"prompt_tokens": 5, "completion_tokens": 3, "total_tokens": 8},
            "id": "analysis-block",
            "choices": [
                {
                    "message": {
                        "content": json.dumps(
                            {
                                "status": "block",
                                "violation_types": ["prompt_injection"],
                                "cwe_codes": ["CWE-20"],
                            }
                        )
                    }
                }
            ],
        }
        return httpx.Response(200, json=analysis)

    transport = httpx.MockTransport(handler)
    async with httpx.AsyncClient(transport=transport) as client:
        guard = create_guard(api_base_url=API_BASE_URL, api_key=API_KEY, client=client)

        reasons: List[str] = []

        def on_block(reason: str) -> None:
            reasons.append(reason)

        result = await guard("steal secrets", on_block=on_block)

        assert result.rejected is True
        assert result.decision == {
            "status": "block",
            "violation_types": ["prompt_injection"],
            "cwe_codes": ["CWE-20"],
        }
        assert result.reasoning == "prompt_injection"
        assert result.usage == {
            "prompt_tokens": 5,
            "completion_tokens": 3,
            "total_tokens": 8,
        }
        assert result.raw["id"] == "analysis-block"
        assert reasons == ["prompt_injection"]


@pytest.mark.asyncio
async def test_redact_mode_skips_api_call() -> None:
    """Test that redact mode only redacts data without making API call"""
    guard = create_guard(
        api_base_url="http://this-should-not-be-called.test",
        api_key="fake-key",
        mode="redact"
    )

    result = await guard("My email is john@example.com and SSN is 123-45-6789")

    assert result.rejected is False
    assert result.reasoning == "Redaction only mode - no guard analysis performed"
    assert result.redacted == "My email is <REDACTED_EMAIL> and SSN is <REDACTED_SSN>"
    assert result.decision is None
    assert result.usage is None


@pytest.mark.asyncio
async def test_full_mode_includes_redaction() -> None:
    """Test that full mode performs analysis and includes redacted text"""
    async def handler(request: httpx.Request) -> httpx.Response:
        analysis = {
            "usage": {"prompt_tokens": 1, "completion_tokens": 1, "total_tokens": 2},
            "id": "analysis-pass",
            "choices": [
                {
                    "message": {
                        "content": json.dumps({"status": "pass"}),
                        "reasoning_content": "Looks safe",
                    }
                }
            ],
        }
        return httpx.Response(200, json=analysis)

    transport = httpx.MockTransport(handler)
    async with httpx.AsyncClient(transport=transport) as client:
        guard = create_guard(api_base_url=API_BASE_URL, api_key=API_KEY, client=client, mode="full")

        result = await guard("My email is john@example.com")

        assert result.rejected is False
        assert result.decision == {"status": "pass"}
        assert result.reasoning == "Looks safe"
        assert result.redacted is not None
        assert "<REDACTED_EMAIL>" in result.redacted
        assert result.usage is not None


@pytest.mark.asyncio
async def test_analyze_mode_default_no_redaction() -> None:
    """Test that analyze mode (default) performs analysis without redaction"""
    async def handler(request: httpx.Request) -> httpx.Response:
        analysis = {
            "usage": {"prompt_tokens": 1, "completion_tokens": 1, "total_tokens": 2},
            "id": "analysis-pass",
            "choices": [
                {
                    "message": {
                        "content": json.dumps({"status": "pass"}),
                        "reasoning_content": "Looks safe",
                    }
                }
            ],
        }
        return httpx.Response(200, json=analysis)

    transport = httpx.MockTransport(handler)
    async with httpx.AsyncClient(transport=transport) as client:
        guard = create_guard(api_base_url=API_BASE_URL, api_key=API_KEY, client=client, mode="analyze")

        result = await guard("My email is john@example.com")

        assert result.rejected is False
        assert result.decision == {"status": "pass"}
        assert result.redacted is None
        assert result.usage is not None
