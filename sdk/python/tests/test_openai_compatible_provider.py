"""
OpenAI-compatible provider unit tests
"""

import os
import pytest

from safety_agent.providers.openai_compatible import OpenAICompatibleProvider


def test_openai_compatible_requires_base_url():
    provider = OpenAICompatibleProvider()

    with pytest.raises(ValueError, match="OPENAI_COMPATIBLE_BASE_URL"):
        provider.build_url("", "gpt-4o-mini")


def test_openai_compatible_build_url_with_env_var(monkeypatch):
    provider = OpenAICompatibleProvider()
    monkeypatch.setenv("OPENAI_COMPATIBLE_BASE_URL", "https://example.com/v1")

    assert (
        provider.build_url(os.environ["OPENAI_COMPATIBLE_BASE_URL"], "gpt-4o-mini")
        == "https://example.com/v1/chat/completions"
    )
