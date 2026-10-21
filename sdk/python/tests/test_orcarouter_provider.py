"""
OrcaRouter provider unit tests
"""

import os
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from safety_agent.providers import call_provider, get_provider, parse_model, providers
from safety_agent.providers.orcarouter import (
    ORCAROUTER_DEFAULT_API_BASE_URL,
    build_orcarouter_url,
    get_orcarouter_base_url,
    orcarouter_provider,
)
from safety_agent.types import ChatMessage

GUARD_CONTENT = (
    '{"classification":"pass","reasoning":"ok","violation_types":[],"cwe_codes":[]}'
)


@pytest.fixture(autouse=True)
def _clean_orcarouter_env(monkeypatch):
    """Keep ambient ORCA_* configuration from leaking into assertions."""
    snapshot = {
        key: os.environ.get(key)
        for key in ("ORCA_API_BASE_URL", "ORCA_BASE_URL", "ORCAROUTER_API_KEY")
    }
    for key in snapshot:
        monkeypatch.delenv(key, raising=False)
    yield
    for key, value in snapshot.items():
        if value is None:
            os.environ.pop(key, None)
        else:
            os.environ[key] = value


def test_is_registered_as_a_named_provider():
    assert providers["orcarouter"] is orcarouter_provider
    assert get_provider("orcarouter") is orcarouter_provider
    assert orcarouter_provider.env_var == "ORCAROUTER_API_KEY"
    assert orcarouter_provider.base_url == ORCAROUTER_DEFAULT_API_BASE_URL


def test_parses_nested_vendor_namespaces():
    parsed = parse_model("orcarouter/openai/gpt-5.5")
    assert parsed.provider == "orcarouter"
    assert parsed.model == "openai/gpt-5.5"

    parsed = parse_model("orcarouter/deepseek/deepseek-v4.1-flash")
    assert parsed.provider == "orcarouter"
    assert parsed.model == "deepseek/deepseek-v4.1-flash"


def test_targets_the_inference_origin_never_the_auth_origin():
    url = orcarouter_provider.build_url(orcarouter_provider.base_url, "openai/gpt-5.5")

    assert url == "https://api.orcarouter.ai/v1/chat/completions"
    assert "/auth" not in url
    assert "www.orcarouter.ai" not in url


def test_prefers_orca_api_base_url_over_orca_base_url(monkeypatch):
    monkeypatch.setenv("ORCA_BASE_URL", "https://shared.example.com/v1")
    monkeypatch.setenv("ORCA_API_BASE_URL", "https://api.example.com/v1")

    assert get_orcarouter_base_url() == "https://api.example.com/v1"
    assert build_orcarouter_url() == "https://api.example.com/v1/chat/completions"


def test_falls_back_to_orca_base_url(monkeypatch):
    monkeypatch.setenv("ORCA_BASE_URL", "https://shared.example.com/v1/")

    assert build_orcarouter_url() == "https://shared.example.com/v1/chat/completions"


def test_allows_plain_http_only_on_loopback(monkeypatch):
    monkeypatch.setenv("ORCA_API_BASE_URL", "http://localhost:8080/v1")
    assert get_orcarouter_base_url() == "http://localhost:8080/v1"

    monkeypatch.setenv("ORCA_API_BASE_URL", "http://api.example.com/v1")
    with pytest.raises(ValueError, match="HTTPS is required"):
        get_orcarouter_base_url()


def test_rejects_a_malformed_base_url(monkeypatch):
    monkeypatch.setenv("ORCA_API_BASE_URL", "not a url")

    with pytest.raises(ValueError, match="Invalid OrcaRouter base URL"):
        get_orcarouter_base_url()


def test_sends_the_api_key_as_a_bearer_token():
    assert orcarouter_provider.auth_header("sk-orca-test") == {
        "Authorization": "Bearer sk-orca-test",
        "Content-Type": "application/json",
    }


def test_builds_an_openai_compatible_request_body():
    body = orcarouter_provider.transform_request(
        "openai/gpt-5.5",
        [ChatMessage(role="user", content="hello")],
        {"type": "json_object"},
    )

    assert body == {
        "model": "openai/gpt-5.5",
        "messages": [{"role": "user", "content": "hello"}],
        "temperature": 0,
        "response_format": {"type": "json_object"},
    }


def test_normalizes_the_response_and_tolerates_missing_usage():
    parsed = orcarouter_provider.transform_response(
        {
            "id": "chatcmpl-1",
            "choices": [
                {
                    "index": 0,
                    "message": {"role": "assistant", "content": GUARD_CONTENT},
                    "finish_reason": "stop",
                }
            ],
            "usage": {
                "prompt_tokens": 12,
                "completion_tokens": 4,
                "total_tokens": 16,
            },
        }
    )

    assert parsed.id == "chatcmpl-1"
    assert parsed.usage.prompt_tokens == 12
    assert parsed.usage.completion_tokens == 4
    assert parsed.usage.total_tokens == 16
    assert parsed.choices[0].message.content == GUARD_CONTENT

    without_usage = orcarouter_provider.transform_response(
        {"id": "chatcmpl-2", "choices": []}
    )
    assert without_usage.usage.total_tokens == 0
    assert without_usage.choices[0].message.content == ""


@pytest.mark.asyncio
async def test_call_provider_uses_the_orcarouter_endpoint(monkeypatch):
    monkeypatch.setenv("ORCAROUTER_API_KEY", "sk-orca-test")

    response = MagicMock()
    response.status_code = 200
    response.json.return_value = {
        "id": "chatcmpl-1",
        "choices": [
            {
                "index": 0,
                "message": {"role": "assistant", "content": GUARD_CONTENT},
                "finish_reason": "stop",
            }
        ],
        "usage": {"prompt_tokens": 10, "completion_tokens": 5, "total_tokens": 15},
    }
    mock_post = AsyncMock(return_value=response)

    with patch("safety_agent.providers.httpx.AsyncClient") as MockClient:
        MockClient.return_value.__aenter__ = AsyncMock(
            return_value=MagicMock(post=mock_post)
        )
        MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

        result = await call_provider(
            "orcarouter/openai/gpt-5.5",
            [ChatMessage(role="user", content="test")],
        )

    assert result.choices[0].message.content == GUARD_CONTENT

    url = mock_post.await_args.args[0]
    assert url == "https://api.orcarouter.ai/v1/chat/completions"
    headers = mock_post.await_args.kwargs["headers"]
    assert headers["Authorization"] == "Bearer sk-orca-test"
    body = mock_post.await_args.kwargs["json"]
    assert body["model"] == "openai/gpt-5.5"
    assert body["temperature"] == 0
