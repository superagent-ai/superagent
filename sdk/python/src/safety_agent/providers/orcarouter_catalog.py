"""
OrcaRouter model catalog and capability filtering.

The authoritative source is ``GET {base}/models`` on the configured
OrcaRouter origin (default ``https://api.orcarouter.ai/v1``), fetched with the
user's own API key so the result reflects the models their workspace can
actually call. Model IDs are kept verbatim, including their ``vendor/model``
namespace.

Capabilities come strictly from catalog metadata:

* text chat requires at least one text endpoint type (``openai``,
  ``openai-response``, ``anthropic``, ``gemini``) and excludes records that
  only advertise non-text endpoint types;
* multimodal listing additionally requires ``architecture.input_modalities``
  to explicitly declare the modality the caller sends. Undeclared models fail
  closed.

Nothing is inferred from a model's name.
"""

from __future__ import annotations

import os
import re
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Iterable, Literal

import httpx

from .orcarouter import get_orcarouter_base_url

OrcaRouterCapability = Literal["chat", "embedding", "image"]
OrcaRouterCatalogSource = Literal["live", "seed", "last-known-good"]
OrcaRouterCatalogErrorCode = Literal[
    "missing_api_key", "auth", "http", "network", "invalid_response"
]

TEXT_ENDPOINT_TYPES = ("openai", "openai-response", "anthropic", "gemini")
NON_TEXT_ENDPOINT_TYPES = (
    "image-generation",
    "openai-video",
    "jina-rerank",
    "embeddings",
)

MAX_MODELS = 2000
MAX_ID_LENGTH = 256
DEFAULT_TIMEOUT = 15.0
DEFAULT_API_BASE_URL = "https://api.orcarouter.ai/v1"

_MODEL_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._:/+-]*$")


@dataclass
class OrcaRouterModel:
    """A single OrcaRouter model record."""

    id: str
    """Catalog model ID, verbatim (e.g. ``deepseek/deepseek-v4-pro``)."""

    supported_endpoint_types: list[str] = field(default_factory=list)
    """Endpoint families the model is served through, when declared."""

    input_modalities: list[str] = field(default_factory=list)
    """Input modalities declared by the catalog. Empty when undeclared."""

    context_length: int | None = None
    """Maximum context length, when declared."""

    reasoning_efforts: list[str] = field(default_factory=list)
    """Reasoning effort levels, only when the catalog declares them."""

    source: OrcaRouterCatalogSource = "live"
    """Where this record came from."""


@dataclass
class OrcaRouterCatalog:
    """Result of a catalog fetch, filtered for one capability."""

    models: list[OrcaRouterModel]
    capability: OrcaRouterCapability = "chat"
    source: OrcaRouterCatalogSource = "live"
    degraded: bool = False
    fetched_at: str | None = None
    error: str | None = None
    """Machine-readable error code when ``degraded``. Never contains credentials."""


class OrcaRouterCatalogError(Exception):
    """Raised when the catalog cannot be fetched and fallback is disabled."""

    def __init__(self, code: OrcaRouterCatalogErrorCode, message: str) -> None:
        super().__init__(message)
        self.code = code


#: Small, verified cold-start seed used only while the live catalog is
#: unavailable. IDs were verified against ``GET /v1/models`` on 2026-10-21;
#: this seed is never merged into a successful live result.
ORCAROUTER_SEED_MODELS: tuple[OrcaRouterModel, ...] = (
    OrcaRouterModel(
        id="orcarouter/fusion",
        supported_endpoint_types=list(TEXT_ENDPOINT_TYPES),
        context_length=1_000_000,
        source="seed",
    ),
    OrcaRouterModel(
        id="orcarouter/auto",
        supported_endpoint_types=list(TEXT_ENDPOINT_TYPES),
        source="seed",
    ),
    OrcaRouterModel(
        id="deepseek/deepseek-v4-pro",
        supported_endpoint_types=["openai", "openai-response"],
        input_modalities=["text"],
        context_length=1_048_576,
        source="seed",
    ),
    OrcaRouterModel(
        id="deepseek/deepseek-v4.1-flash",
        supported_endpoint_types=["openai", "openai-response", "anthropic"],
        input_modalities=["text", "image"],
        context_length=1_048_576,
        source="seed",
    ),
)

_cached_catalog: dict[str, Any] | None = None


def reset_orcarouter_catalog_cache() -> None:
    """Clear the in-memory last-known-good catalog (used by tests)."""
    global _cached_catalog
    _cached_catalog = None


def _as_string_list(value: Any, limit: int = 32) -> list[str]:
    if not isinstance(value, (list, tuple)):
        return []
    out: list[str] = []
    for entry in value:
        if not isinstance(entry, str):
            continue
        trimmed = entry.strip()
        if not trimmed or len(trimmed) > 64:
            continue
        out.append(trimmed)
        if len(out) >= limit:
            break
    return out


def _is_valid_model_id(model_id: str) -> bool:
    return (
        0 < len(model_id) <= MAX_ID_LENGTH
        and bool(_MODEL_ID_RE.match(model_id))
        and ".." not in model_id
    )


def parse_orcarouter_catalog(
    payload: Any, source: OrcaRouterCatalogSource = "live"
) -> list[OrcaRouterModel]:
    """Normalize a ``GET /models`` payload. Malformed records are dropped."""
    if isinstance(payload, list):
        records: Any = payload
    elif isinstance(payload, dict):
        records = payload.get("data")
        if not isinstance(records, list):
            records = payload.get("models")
    else:
        records = None
    if not isinstance(records, list):
        return []

    models: list[OrcaRouterModel] = []
    seen: set[str] = set()

    for entry in records[:MAX_MODELS]:
        if not isinstance(entry, dict):
            continue
        raw_id = entry.get("id")
        if not isinstance(raw_id, str):
            continue
        model_id = raw_id.strip()
        if not _is_valid_model_id(model_id) or model_id in seen:
            continue
        seen.add(model_id)

        context_length = entry.get("context_length")
        if not (
            isinstance(context_length, int)
            and not isinstance(context_length, bool)
            and context_length > 0
        ):
            context_length = None

        architecture = entry.get("architecture")
        modalities = (
            architecture.get("input_modalities")
            if isinstance(architecture, dict)
            else None
        )

        reasoning = entry.get("reasoning")
        efforts = _as_string_list(
            reasoning.get("efforts") if isinstance(reasoning, dict) else None
        ) or _as_string_list(entry.get("reasoning_efforts"))

        models.append(
            OrcaRouterModel(
                id=model_id,
                supported_endpoint_types=_as_string_list(
                    entry.get("supported_endpoint_types")
                ),
                input_modalities=_as_string_list(modalities),
                context_length=context_length,
                reasoning_efforts=efforts,
                source=source,
            )
        )

    return models


def _matches_capability(model: OrcaRouterModel, capability: str) -> bool:
    endpoints = [entry.lower() for entry in model.supported_endpoint_types]

    if capability == "chat":
        if not any(entry in TEXT_ENDPOINT_TYPES for entry in endpoints):
            return False
        return not all(entry in NON_TEXT_ENDPOINT_TYPES for entry in endpoints)

    if capability == "embedding":
        return "embeddings" in endpoints

    return "image-generation" in endpoints


def _matches_modalities(model: OrcaRouterModel, required: Iterable[str] | None) -> bool:
    required_list = list(required or [])
    if not required_list:
        return True
    declared = {entry.lower() for entry in model.input_modalities}
    # Fail closed: a model that does not declare a modality cannot be offered for it.
    return all(entry.lower() in declared for entry in required_list)


def filter_orcarouter_models(
    models: Iterable[OrcaRouterModel],
    capability: str = "chat",
    input_modalities: Iterable[str] | None = None,
) -> list[OrcaRouterModel]:
    """Filter catalog records down to the models an entry point can use."""
    return [
        model
        for model in models
        if _matches_capability(model, capability)
        and _matches_modalities(model, input_modalities)
    ]


def _seed_catalog(
    capability: str, input_modalities: Iterable[str] | None, error: str
) -> OrcaRouterCatalog:
    return OrcaRouterCatalog(
        models=filter_orcarouter_models(
            ORCAROUTER_SEED_MODELS, capability, input_modalities
        ),
        capability=capability,  # type: ignore[arg-type]
        source="seed",
        degraded=True,
        error=error,
    )


def _last_known_good(
    base_url: str,
    capability: str,
    input_modalities: Iterable[str] | None,
    error: str,
) -> OrcaRouterCatalog | None:
    if not _cached_catalog:
        return None
    if (
        _cached_catalog["base_url"] != base_url
        or _cached_catalog["capability"] != capability
    ):
        return None
    return OrcaRouterCatalog(
        models=filter_orcarouter_models(
            _cached_catalog["models"], capability, input_modalities
        ),
        capability=capability,  # type: ignore[arg-type]
        source="last-known-good",
        degraded=True,
        fetched_at=_cached_catalog["fetched_at"],
        error=error,
    )


async def fetch_orcarouter_catalog(
    *,
    capability: OrcaRouterCapability = "chat",
    input_modalities: Iterable[str] | None = None,
    api_key: str | None = None,
    base_url: str | None = None,
    timeout: float = DEFAULT_TIMEOUT,
    allow_seed_fallback: bool = True,
    bypass_cache: bool = False,
    transport: httpx.AsyncBaseTransport | None = None,
) -> OrcaRouterCatalog:
    """Fetch the model catalog for a capability.

    On failure this returns a ``degraded`` catalog built from the last
    successful fetch, else from the verified seed. Pass
    ``allow_seed_fallback=False`` to raise :class:`OrcaRouterCatalogError`
    instead.
    """
    global _cached_catalog

    resolved_key = api_key if api_key is not None else os.environ.get("ORCAROUTER_API_KEY", "")
    resolved_base = (base_url or get_orcarouter_base_url()).rstrip("/")

    def fallback(code: OrcaRouterCatalogErrorCode) -> OrcaRouterCatalog:
        if not allow_seed_fallback:
            raise OrcaRouterCatalogError(
                code, f"OrcaRouter model catalog unavailable ({code})"
            )
        if not bypass_cache:
            cached = _last_known_good(
                resolved_base, capability, input_modalities, code
            )
            if cached:
                return cached
        return _seed_catalog(capability, input_modalities, code)

    if not resolved_key:
        return fallback("missing_api_key")

    params = {"capability": capability} if capability else None
    try:
        async with httpx.AsyncClient(
            transport=transport, timeout=timeout
        ) as client:
            response = await client.get(
                f"{resolved_base}/models",
                headers={
                    "Authorization": f"Bearer {resolved_key}",
                    "Accept": "application/json",
                },
                params=params,
            )
    except (httpx.HTTPError, OSError):
        return fallback("network")

    if response.status_code in (401, 403):
        return fallback("auth")
    if response.status_code != 200:
        return fallback("http")

    try:
        payload = response.json()
    except ValueError:
        return fallback("invalid_response")

    parsed = parse_orcarouter_catalog(payload, "live")
    models = filter_orcarouter_models(parsed, capability, input_modalities)
    fetched_at = datetime.now(timezone.utc).isoformat()

    if not bypass_cache:
        # Cache the full capability-filtered list so a later multimodal query
        # can reuse it.
        _cached_catalog = {
            "base_url": resolved_base,
            "capability": capability,
            "models": filter_orcarouter_models(parsed, capability),
            "fetched_at": fetched_at,
        }

    return OrcaRouterCatalog(
        models=models,
        capability=capability,
        source="live",
        degraded=False,
        fetched_at=fetched_at,
    )


async def list_orcarouter_models(**kwargs: Any) -> list[OrcaRouterModel]:
    """Convenience helper returning just the model records for a capability."""
    catalog = await fetch_orcarouter_catalog(**kwargs)
    return catalog.models


async def is_orcarouter_model_compatible(
    model_string: str,
    input_modalities: Iterable[str],
    *,
    api_key: str | None = None,
    base_url: str | None = None,
    timeout: float = DEFAULT_TIMEOUT,
    allow_seed_fallback: bool = True,
    bypass_cache: bool = False,
    transport: httpx.AsyncBaseTransport | None = None,
) -> bool:
    """Metadata-driven multimodal gate for an ``orcarouter/...`` model string.

    Returns ``False`` when the model is not in the chat catalog for the
    requested modalities, including when the catalog is degraded and the model
    is only present in a stale or seed list. Non-OrcaRouter model strings always
    return ``False``; their providers keep their own gating.
    """
    prefix = "orcarouter/"
    if not model_string.startswith(prefix):
        return False
    model_id = model_string[len(prefix) :]
    if not model_id or not _is_valid_model_id(model_id):
        return False

    catalog = await fetch_orcarouter_catalog(
        capability="chat",
        input_modalities=input_modalities,
        api_key=api_key,
        base_url=base_url,
        timeout=timeout,
        allow_seed_fallback=allow_seed_fallback,
        bypass_cache=bypass_cache,
        transport=transport,
    )
    return any(model.id == model_id for model in catalog.models)


__all__ = [
    "OrcaRouterModel",
    "OrcaRouterCatalog",
    "OrcaRouterCatalogError",
    "ORCAROUTER_SEED_MODELS",
    "TEXT_ENDPOINT_TYPES",
    "NON_TEXT_ENDPOINT_TYPES",
    "parse_orcarouter_catalog",
    "filter_orcarouter_models",
    "fetch_orcarouter_catalog",
    "list_orcarouter_models",
    "is_orcarouter_model_compatible",
    "reset_orcarouter_catalog_cache",
]
