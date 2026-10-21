"""
OrcaRouter model catalog and capability filtering tests
"""

import os
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from safety_agent.providers.orcarouter_catalog import (
    ORCAROUTER_SEED_MODELS,
    OrcaRouterCatalogError,
    fetch_orcarouter_catalog,
    filter_orcarouter_models,
    is_orcarouter_model_compatible,
    parse_orcarouter_catalog,
    reset_orcarouter_catalog_cache,
)


@pytest.fixture(autouse=True)
def _clean_orcarouter_env(monkeypatch):
    snapshot = {
        key: os.environ.get(key)
        for key in ("ORCA_API_BASE_URL", "ORCA_BASE_URL", "ORCAROUTER_API_KEY")
    }
    for key in snapshot:
        monkeypatch.delenv(key, raising=False)
    reset_orcarouter_catalog_cache()
    yield
    reset_orcarouter_catalog_cache()
    for key, value in snapshot.items():
        if value is None:
            os.environ.pop(key, None)
        else:
            os.environ[key] = value


#: Fixture covering the shape of ``GET /v1/models``: text-only chat,
#: image-input chat, embedding, image generation, video and rerank records,
#: plus records with missing metadata.
CATALOG_FIXTURE = {
    "object": "list",
    "data": [
        {
            "id": "orcarouter/fusion",
            "supported_endpoint_types": [
                "openai",
                "openai-response",
                "anthropic",
                "gemini",
            ],
            "context_length": 1000000,
        },
        {
            "id": "deepseek/deepseek-v4-pro",
            "supported_endpoint_types": ["openai", "openai-response"],
            "architecture": {"input_modalities": ["text"]},
            "context_length": 1048576,
        },
        {
            "id": "deepseek/deepseek-v4.1-flash",
            "supported_endpoint_types": ["openai", "anthropic"],
            "architecture": {"input_modalities": ["text", "image"]},
            "context_length": 1048576,
        },
        {
            "id": "openai/gpt-5.5",
            "supported_endpoint_types": ["openai", "openai-response"],
            "architecture": {"input_modalities": ["text", "image"]},
            "reasoning": {"efforts": ["low", "medium", "high", "xhigh"]},
        },
        {
            "id": "vendor/legacy-chat-no-metadata",
            "supported_endpoint_types": ["openai"],
        },
        {"id": "vendor/embed-1", "supported_endpoint_types": ["embeddings"]},
        {"id": "vendor/image-gen-1", "supported_endpoint_types": ["image-generation"]},
        {"id": "vendor/video-1", "supported_endpoint_types": ["openai-video"]},
        {"id": "vendor/rerank-1", "supported_endpoint_types": ["jina-rerank"]},
        {
            "id": "vendor/name-looks-like-vision",
            "supported_endpoint_types": ["openai"],
            "architecture": {"input_modalities": ["text"]},
        },
        {"id": "bad id with spaces", "supported_endpoint_types": ["openai"]},
        {"supported_endpoint_types": ["openai"]},
        "not-an-object",
    ],
}


def _response(status_code=200, json_data=None):
    resp = MagicMock()
    resp.status_code = status_code
    if json_data is not None:
        resp.json.return_value = json_data
    return resp


def _patch_client(mock_get):
    """Patch the catalog module's httpx client to route ``get`` to ``mock_get``."""
    return patch("safety_agent.providers.orcarouter_catalog.httpx.AsyncClient")


class TestParsing:
    def test_keeps_vendor_namespaces_and_drops_malformed_records(self):
        models = parse_orcarouter_catalog(CATALOG_FIXTURE)
        ids = [model.id for model in models]

        assert "deepseek/deepseek-v4.1-flash" in ids
        assert "openai/gpt-5.5" in ids
        assert "bad id with spaces" not in ids
        assert len(ids) == 10

    def test_preserves_declared_metadata_without_inventing_any(self):
        models = parse_orcarouter_catalog(CATALOG_FIXTURE)
        gpt = next(model for model in models if model.id == "openai/gpt-5.5")
        legacy = next(
            model for model in models if model.id == "vendor/legacy-chat-no-metadata"
        )

        assert gpt.reasoning_efforts == ["low", "medium", "high", "xhigh"]
        assert gpt.input_modalities == ["text", "image"]
        assert legacy.input_modalities == []
        assert legacy.context_length is None
        assert legacy.source == "live"

    def test_accepts_a_bare_list_payload(self):
        models = parse_orcarouter_catalog(
            [{"id": "vendor/one", "supported_endpoint_types": ["openai"]}]
        )
        assert [model.id for model in models] == ["vendor/one"]

    def test_ignores_unknown_payload_shapes(self):
        assert parse_orcarouter_catalog({"object": "list"}) == []
        assert parse_orcarouter_catalog(None) == []


class TestCapabilityFiltering:
    models = parse_orcarouter_catalog(CATALOG_FIXTURE)

    def test_lists_text_chat_models_and_excludes_non_text_endpoint_families(self):
        ids = [m.id for m in filter_orcarouter_models(self.models, "chat")]

        assert "orcarouter/fusion" in ids
        assert "deepseek/deepseek-v4-pro" in ids
        assert "vendor/embed-1" not in ids
        assert "vendor/image-gen-1" not in ids
        assert "vendor/video-1" not in ids
        assert "vendor/rerank-1" not in ids

    def test_lists_embedding_models_only_for_the_embedding_capability(self):
        ids = [m.id for m in filter_orcarouter_models(self.models, "embedding")]
        assert ids == ["vendor/embed-1"]

    def test_lists_image_generation_models_only_for_the_image_capability(self):
        ids = [m.id for m in filter_orcarouter_models(self.models, "image")]
        assert ids == ["vendor/image-gen-1"]

    def test_fails_closed_for_multimodal(self):
        ids = [
            m.id
            for m in filter_orcarouter_models(
                self.models, "chat", input_modalities=["text", "image"]
            )
        ]

        assert ids == ["deepseek/deepseek-v4.1-flash", "openai/gpt-5.5"]
        assert "deepseek/deepseek-v4-pro" not in ids
        assert "vendor/legacy-chat-no-metadata" not in ids
        assert "vendor/name-looks-like-vision" not in ids


class TestFetching:
    async def test_requests_the_live_catalog_with_capability_and_api_key(self, monkeypatch):
        monkeypatch.setenv("ORCAROUTER_API_KEY", "sk-orca-test")
        mock_get = AsyncMock(return_value=_response(json_data=CATALOG_FIXTURE))

        with _patch_client(mock_get) as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(
                return_value=MagicMock(get=mock_get)
            )
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            catalog = await fetch_orcarouter_catalog(capability="chat")

        assert mock_get.await_args.args[0] == "https://api.orcarouter.ai/v1/models"
        headers = mock_get.await_args.kwargs["headers"]
        assert headers["Authorization"] == "Bearer sk-orca-test"
        assert mock_get.await_args.kwargs["params"] == {"capability": "chat"}

        assert catalog.source == "live"
        assert catalog.degraded is False
        assert "deepseek/deepseek-v4-pro" in [m.id for m in catalog.models]
        assert all(m.source == "live" for m in catalog.models)

    async def test_applies_multimodal_filtering_to_the_live_result(self, monkeypatch):
        monkeypatch.setenv("ORCAROUTER_API_KEY", "sk-orca-test")
        mock_get = AsyncMock(return_value=_response(json_data=CATALOG_FIXTURE))

        with _patch_client(mock_get) as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(
                return_value=MagicMock(get=mock_get)
            )
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            catalog = await fetch_orcarouter_catalog(
                capability="chat", input_modalities=["image"]
            )

        assert [m.id for m in catalog.models] == [
            "deepseek/deepseek-v4.1-flash",
            "openai/gpt-5.5",
        ]

    async def test_never_merges_the_seed_into_a_successful_live_result(
        self, monkeypatch
    ):
        monkeypatch.setenv("ORCAROUTER_API_KEY", "sk-orca-test")
        mock_get = AsyncMock(
            return_value=_response(
                json_data={
                    "data": [
                        {
                            "id": "vendor/only-model",
                            "supported_endpoint_types": ["openai"],
                        }
                    ]
                }
            )
        )

        with _patch_client(mock_get) as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(
                return_value=MagicMock(get=mock_get)
            )
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            catalog = await fetch_orcarouter_catalog()

        assert [m.id for m in catalog.models] == ["vendor/only-model"]
        assert "orcarouter/fusion" not in [m.id for m in catalog.models]

    async def test_falls_back_to_the_verified_seed_on_network_failure(self, monkeypatch):
        import httpx

        monkeypatch.setenv("ORCAROUTER_API_KEY", "sk-orca-test")
        mock_get = AsyncMock(side_effect=httpx.ConnectError("ECONNREFUSED"))

        with _patch_client(mock_get) as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(
                return_value=MagicMock(get=mock_get)
            )
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            catalog = await fetch_orcarouter_catalog()

        assert catalog.degraded is True
        assert catalog.source == "seed"
        assert catalog.error == "network"
        assert [m.id for m in catalog.models] == [m.id for m in ORCAROUTER_SEED_MODELS]

    async def test_flags_auth_errors_distinctly(self, monkeypatch):
        monkeypatch.setenv("ORCAROUTER_API_KEY", "sk-orca-test")
        mock_get = AsyncMock(
            return_value=_response(status_code=401, json_data={"error": "unauthorized"})
        )

        with _patch_client(mock_get) as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(
                return_value=MagicMock(get=mock_get)
            )
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            catalog = await fetch_orcarouter_catalog()

        assert catalog.degraded is True
        assert catalog.error == "auth"

    async def test_flags_missing_api_keys_without_issuing_a_request(self):
        mock_get = AsyncMock()

        with _patch_client(mock_get) as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(
                return_value=MagicMock(get=mock_get)
            )
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            catalog = await fetch_orcarouter_catalog()

        assert mock_get.await_count == 0
        assert catalog.error == "missing_api_key"
        assert catalog.degraded is True
        assert len(catalog.models) > 0

    async def test_prefers_the_last_known_good_catalog_over_the_seed(self, monkeypatch):
        import httpx

        monkeypatch.setenv("ORCAROUTER_API_KEY", "sk-orca-test")
        mock_get = AsyncMock(
            side_effect=[
                _response(json_data=CATALOG_FIXTURE),
                httpx.ConnectError("offline"),
            ]
        )

        with _patch_client(mock_get) as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(
                return_value=MagicMock(get=mock_get)
            )
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            live = await fetch_orcarouter_catalog()
            assert live.source == "live"

            degraded = await fetch_orcarouter_catalog()

        assert degraded.source == "last-known-good"
        assert degraded.degraded is True
        assert [m.id for m in degraded.models] == [m.id for m in live.models]

    async def test_raises_a_typed_error_when_seed_fallback_is_disabled(self, monkeypatch):
        monkeypatch.setenv("ORCAROUTER_API_KEY", "sk-orca-test")
        mock_get = AsyncMock(
            return_value=_response(status_code=401, json_data={"error": "unauthorized"})
        )

        with _patch_client(mock_get) as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(
                return_value=MagicMock(get=mock_get)
            )
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            with pytest.raises(OrcaRouterCatalogError):
                await fetch_orcarouter_catalog(allow_seed_fallback=False)

    async def test_never_echoes_the_api_key_in_the_degraded_payload(self, monkeypatch):
        import httpx

        monkeypatch.setenv("ORCAROUTER_API_KEY", "sk-orca-test")
        mock_get = AsyncMock(side_effect=httpx.ConnectError("boom"))

        with _patch_client(mock_get) as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(
                return_value=MagicMock(get=mock_get)
            )
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            catalog = await fetch_orcarouter_catalog()

        assert "sk-orca-test" not in repr(catalog)


class TestModelCompatibility:
    async def test_accepts_a_model_declaring_image_input(self, monkeypatch):
        monkeypatch.setenv("ORCAROUTER_API_KEY", "sk-orca-test")
        mock_get = AsyncMock(return_value=_response(json_data=CATALOG_FIXTURE))

        with _patch_client(mock_get) as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(
                return_value=MagicMock(get=mock_get)
            )
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            assert (
                await is_orcarouter_model_compatible(
                    "orcarouter/deepseek/deepseek-v4.1-flash", ["image"]
                )
                is True
            )

    async def test_rejects_a_model_without_declared_image_input(self, monkeypatch):
        monkeypatch.setenv("ORCAROUTER_API_KEY", "sk-orca-test")
        mock_get = AsyncMock(return_value=_response(json_data=CATALOG_FIXTURE))

        with _patch_client(mock_get) as MockClient:
            MockClient.return_value.__aenter__ = AsyncMock(
                return_value=MagicMock(get=mock_get)
            )
            MockClient.return_value.__aexit__ = AsyncMock(return_value=False)

            assert (
                await is_orcarouter_model_compatible(
                    "orcarouter/deepseek/deepseek-v4-pro", ["image"]
                )
                is False
            )

    async def test_rejects_non_orcarouter_model_strings_without_a_request(self):
        assert await is_orcarouter_model_compatible("openai/gpt-4o", ["image"]) is False
        assert await is_orcarouter_model_compatible("orcarouter/", ["image"]) is False
