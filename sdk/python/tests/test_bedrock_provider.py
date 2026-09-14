"""
Bedrock provider unit tests
"""

import hashlib
from unittest.mock import AsyncMock, MagicMock, patch

import httpx
import pytest

from safety_agent.providers import call_provider
from safety_agent.types import ChatMessage


def _bedrock_success() -> dict:
    return {
        "output": {"message": {"role": "assistant", "content": [{"text": "ok"}]}},
        "stopReason": "end_turn",
        "usage": {"inputTokens": 3, "outputTokens": 1},
    }


@pytest.fixture
def bedrock_env(monkeypatch):
    monkeypatch.setenv("AWS_BEDROCK_API_KEY", "AKIATEST:test-secret")
    monkeypatch.setenv("AWS_BEDROCK_REGION", "us-east-1")


@pytest.mark.asyncio
async def test_bedrock_signed_payload_hash_matches_bytes_sent(bedrock_env):
    """The SigV4 payload hash must cover the exact bytes httpx puts on the wire."""
    response = MagicMock()
    response.status_code = 200
    response.text = ""
    response.json.return_value = _bedrock_success()
    mock_post = AsyncMock(return_value=response)

    with patch("safety_agent.providers.httpx.AsyncClient") as MockClient:
        MockClient.return_value.__aenter__ = AsyncMock(
            return_value=MagicMock(post=mock_post)
        )
        MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

        result = await call_provider(
            "bedrock/anthropic.claude-3-haiku-20240307-v1:0",
            [
                ChatMessage(role="system", content="You are a guard."),
                ChatMessage(role="user", content="hello"),
            ],
        )

    assert result.choices[0].message.content == "ok"
    assert mock_post.call_count == 1

    args, kwargs = mock_post.call_args
    # Rebuild the request exactly as httpx would serialize it for these kwargs
    wire = httpx.Request(
        "POST",
        args[0],
        headers=kwargs["headers"],
        json=kwargs.get("json"),
        content=kwargs.get("content"),
    )
    sent_hash = hashlib.sha256(wire.content).hexdigest()

    assert kwargs["headers"]["x-amz-content-sha256"] == sent_hash
