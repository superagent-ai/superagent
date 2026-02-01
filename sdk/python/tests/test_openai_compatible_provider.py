"""
OpenAI-compatible provider unit tests
"""

import pytest

from safety_agent.providers.openai_compatible import OpenAICompatibleProvider


def test_openai_compatible_requires_base_url():
    provider = OpenAICompatibleProvider()

    with pytest.raises(ValueError, match="OPENAI_COMPATIBLE_BASE_URL"):
        provider.build_url("", "gpt-4o-mini")
