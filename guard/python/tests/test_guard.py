import json
from typing import List

import httpx
import pytest

from superagent_guard import GuardResult, create_guard

API_BASE_URL = "https://example.com/guard"
API_KEY = "test-key"


@pytest.mark.asyncio
async def test_guard_pass_triggers_on_pass_callback() -> None:
    async def handler(request: httpx.Request) -> httpx.Response:
        assert request.headers["authorization"] == f"Bearer {API_KEY}"
        assert request.headers["x-superagent-api-key"] == API_KEY
        assert request.method == "POST"
        assert request.url == httpx.URL(API_BASE_URL)
        assert request.content == b'{"prompt": "hello"}'

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
