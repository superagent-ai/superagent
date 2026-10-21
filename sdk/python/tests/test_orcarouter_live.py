"""
Opt-in live checks against the OrcaRouter gateway.

These run only when ``ORCAROUTER_API_KEY`` is present, so the default test
suite stays offline. Every call goes through the integration under test: the
named provider registry entry, the catalog client, and the SDK client.
"""

import os
import re

import pytest

from safety_agent import create_client
from safety_agent.providers.orcarouter_catalog import (
    fetch_orcarouter_catalog,
    is_orcarouter_model_compatible,
    reset_orcarouter_catalog_cache,
)

MODEL = "orcarouter/deepseek/deepseek-v4-pro"

# Only a real-looking key opts in: placeholder credentials used by the unit
# tests must not turn the offline suite into a network call.
_PLACEHOLDER = re.compile(r"fake|dummy|test|placeholder|example|sample|local|xxx", re.I)
_key = os.environ.get("ORCAROUTER_API_KEY", "")
_live = (
    _key.startswith("sk-orca-")
    and len(_key) >= 30
    and not _PLACEHOLDER.search(_key)
)

pytestmark = pytest.mark.skipif(
    not _live,
    reason="a real ORCAROUTER_API_KEY is not set",
)


async def test_fetches_the_live_catalog_through_the_named_provider():
    reset_orcarouter_catalog_cache()
    catalog = await fetch_orcarouter_catalog(
        capability="chat", allow_seed_fallback=False
    )

    assert catalog.source == "live"
    assert catalog.degraded is False
    assert len(catalog.models) > 0
    assert all(isinstance(model.id, str) for model in catalog.models)


async def test_gates_image_input_on_catalog_declared_modalities():
    reset_orcarouter_catalog_cache()

    assert await is_orcarouter_model_compatible(MODEL, ["image"]) is False


async def test_runs_guard_through_the_orcarouter_provider():
    client = create_client(api_key="live-check")
    # The live check exercises the provider path, not Superagent's usage
    # reporting; keep the run from posting a billing record.
    client._post_usage = lambda usage: None
    result = await client.guard(
        input="What is the capital of France?",
        model=MODEL,
    )

    assert result.classification in {"pass", "block"}
    assert result.usage.total_tokens > 0
