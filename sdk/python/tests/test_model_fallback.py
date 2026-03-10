"""
Tests for model fallback functionality.

When a primary model returns a retryable error (429/500/502/503), the SDK
should automatically re-issue the request to the fallback model.
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock

from safety_agent.providers import call_provider, RETRYABLE_STATUS_CODES
from safety_agent.types import ChatMessage


GUARD_CONTENT = '{"classification":"pass","reasoning":"ok","violation_types":[],"cwe_codes":[]}'


def _google_success():
    return {
        "candidates": [
            {"content": {"parts": [{"text": GUARD_CONTENT}], "role": "model"}, "finishReason": "STOP"}
        ],
        "usageMetadata": {"promptTokenCount": 10, "candidatesTokenCount": 5, "totalTokenCount": 15},
        "modelVersion": "gemini-2.5-pro",
    }


def _make_mock_response(status_code: int, json_data: dict | None = None, text: str = "error"):
    resp = MagicMock()
    resp.status_code = status_code
    resp.text = text
    if json_data is not None:
        resp.json.return_value = json_data
    return resp


@pytest.fixture
def google_env(monkeypatch):
    monkeypatch.setenv("GOOGLE_API_KEY", "test-google-key")


@pytest.mark.asyncio
class TestModelFallback:

    async def test_falls_back_on_503(self, google_env):
        mock_post = AsyncMock(
            side_effect=[
                _make_mock_response(503, text="High demand"),
                _make_mock_response(200, json_data=_google_success()),
            ]
        )
        with patch("safety_agent.providers.httpx.AsyncClient") as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(return_value=MagicMock(post=mock_post))
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            result = await call_provider(
                "google/gemini-2.5-flash-lite",
                [ChatMessage(role="user", content="test")],
                fallback_model="google/gemini-2.5-pro",
            )

        assert result.choices[0].message.content == GUARD_CONTENT
        assert mock_post.call_count == 2

    async def test_falls_back_on_429(self, google_env):
        mock_post = AsyncMock(
            side_effect=[
                _make_mock_response(429, text="Rate limited"),
                _make_mock_response(200, json_data=_google_success()),
            ]
        )
        with patch("safety_agent.providers.httpx.AsyncClient") as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(return_value=MagicMock(post=mock_post))
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            result = await call_provider(
                "google/gemini-2.5-flash-lite",
                [ChatMessage(role="user", content="test")],
                fallback_model="google/gemini-2.5-pro",
            )

        assert result.choices[0].message.content == GUARD_CONTENT
        assert mock_post.call_count == 2

    async def test_falls_back_on_500(self, google_env):
        mock_post = AsyncMock(
            side_effect=[
                _make_mock_response(500, text="Internal error"),
                _make_mock_response(200, json_data=_google_success()),
            ]
        )
        with patch("safety_agent.providers.httpx.AsyncClient") as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(return_value=MagicMock(post=mock_post))
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            result = await call_provider(
                "google/gemini-2.5-flash-lite",
                [ChatMessage(role="user", content="test")],
                fallback_model="google/gemini-2.5-pro",
            )

        assert result.choices[0].message.content == GUARD_CONTENT
        assert mock_post.call_count == 2

    async def test_falls_back_on_502(self, google_env):
        mock_post = AsyncMock(
            side_effect=[
                _make_mock_response(502, text="Bad gateway"),
                _make_mock_response(200, json_data=_google_success()),
            ]
        )
        with patch("safety_agent.providers.httpx.AsyncClient") as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(return_value=MagicMock(post=mock_post))
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            result = await call_provider(
                "google/gemini-2.5-flash-lite",
                [ChatMessage(role="user", content="test")],
                fallback_model="google/gemini-2.5-pro",
            )

        assert result.choices[0].message.content == GUARD_CONTENT
        assert mock_post.call_count == 2

    async def test_no_fallback_on_400(self, google_env):
        mock_post = AsyncMock(
            return_value=_make_mock_response(400, text="Bad request"),
        )
        with patch("safety_agent.providers.httpx.AsyncClient") as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(return_value=MagicMock(post=mock_post))
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            with pytest.raises(RuntimeError, match="Provider API error \\(400\\)"):
                await call_provider(
                    "google/gemini-2.5-flash-lite",
                    [ChatMessage(role="user", content="test")],
                    fallback_model="google/gemini-2.5-pro",
                )

        assert mock_post.call_count == 1

    async def test_no_fallback_on_401(self, google_env):
        mock_post = AsyncMock(
            return_value=_make_mock_response(401, text="Unauthorized"),
        )
        with patch("safety_agent.providers.httpx.AsyncClient") as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(return_value=MagicMock(post=mock_post))
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            with pytest.raises(RuntimeError, match="Provider API error \\(401\\)"):
                await call_provider(
                    "google/gemini-2.5-flash-lite",
                    [ChatMessage(role="user", content="test")],
                    fallback_model="google/gemini-2.5-pro",
                )

        assert mock_post.call_count == 1

    async def test_throws_without_fallback_model_on_503(self, google_env):
        mock_post = AsyncMock(
            return_value=_make_mock_response(503, text="High demand"),
        )
        with patch("safety_agent.providers.httpx.AsyncClient") as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(return_value=MagicMock(post=mock_post))
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            with pytest.raises(RuntimeError, match="Provider API error \\(503\\)"):
                await call_provider(
                    "google/gemini-2.5-flash-lite",
                    [ChatMessage(role="user", content="test")],
                )

    async def test_no_infinite_loop(self, google_env):
        """Fallback model only gets one attempt -- no recursive fallback."""
        mock_post = AsyncMock(
            side_effect=[
                _make_mock_response(503, text="Primary failed"),
                _make_mock_response(503, text="Fallback also failed"),
            ]
        )
        with patch("safety_agent.providers.httpx.AsyncClient") as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(return_value=MagicMock(post=mock_post))
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            with pytest.raises(RuntimeError, match="Provider API error \\(503\\)"):
                await call_provider(
                    "google/gemini-2.5-flash-lite",
                    [ChatMessage(role="user", content="test")],
                    fallback_model="google/gemini-2.5-pro",
                )

        assert mock_post.call_count == 2

    async def test_primary_succeeds_no_fallback_attempted(self, google_env):
        mock_post = AsyncMock(
            return_value=_make_mock_response(200, json_data=_google_success()),
        )
        with patch("safety_agent.providers.httpx.AsyncClient") as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(return_value=MagicMock(post=mock_post))
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            result = await call_provider(
                "google/gemini-2.5-flash-lite",
                [ChatMessage(role="user", content="test")],
                fallback_model="google/gemini-2.5-pro",
            )

        assert result.choices[0].message.content == GUARD_CONTENT
        assert mock_post.call_count == 1


class TestRetryableStatusCodes:
    def test_retryable_codes_defined(self):
        assert 429 in RETRYABLE_STATUS_CODES
        assert 500 in RETRYABLE_STATUS_CODES
        assert 502 in RETRYABLE_STATUS_CODES
        assert 503 in RETRYABLE_STATUS_CODES

    def test_non_retryable_codes(self):
        assert 400 not in RETRYABLE_STATUS_CODES
        assert 401 not in RETRYABLE_STATUS_CODES
        assert 403 not in RETRYABLE_STATUS_CODES
        assert 404 not in RETRYABLE_STATUS_CODES
