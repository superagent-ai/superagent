"""Unit tests for _supports_structured_output routing decisions."""

import pytest

from safety_agent.client import _supports_structured_output


@pytest.mark.parametrize(
    "model,expected",
    [
        ("openai/gpt-4o-mini", True),
        ("openrouter/openai/gpt-4o-mini", True),
        ("openrouter/openai/gpt-oss-safeguard-20b", False),
        ("openrouter/google/gemini-2.0-flash", True),
        ("requesty/openai/gpt-4o-mini", True),
        ("requesty/openai/gpt-oss-safeguard-20b", False),
        ("requesty/google/gemini-2.5-flash", True),
        ("requesty/anthropic/claude-sonnet-4-5", True),
        ("requesty/anthropic/claude-haiku-4-5", True),
        ("requesty/anthropic/claude-3-haiku-20240307", False),
        ("requesty/mistral/mistral-large-latest", False),
    ],
)
def test_supports_structured_output(model: str, expected: bool) -> None:
    assert _supports_structured_output(model) is expected
