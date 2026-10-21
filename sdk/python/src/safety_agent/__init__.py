"""
safety-agent
A lightweight Python guardrail SDK for content safety
"""

from .client import SafetyClient, create_client
from .providers.orcarouter import (
    ORCAROUTER_DEFAULT_API_BASE_URL,
    build_orcarouter_url,
    get_orcarouter_base_url,
)
from .providers.orcarouter_catalog import (
    ORCAROUTER_SEED_MODELS,
    OrcaRouterCatalog,
    OrcaRouterCatalogError,
    OrcaRouterModel,
    fetch_orcarouter_catalog,
    filter_orcarouter_models,
    is_orcarouter_model_compatible,
    list_orcarouter_models,
    parse_orcarouter_catalog,
    reset_orcarouter_catalog_cache,
)
from .types import (
    ClientConfig,
    GuardInput,
    GuardOptions,
    RedactOptions,
    ScanOptions,
    GuardClassificationResult,
    RedactResult,
    GuardResponse,
    RedactResponse,
    ScanResponse,
    ScanUsage,
    ChatMessage,
    MultimodalContentPart,
    ProcessedInput,
    AnalysisResponse,
    TokenUsage,
    ParsedModel,
)

__version__ = "0.1.0"

__all__ = [
    # Client
    "SafetyClient",
    "create_client",
    # Types
    "ClientConfig",
    "GuardInput",
    "GuardOptions",
    "RedactOptions",
    "ScanOptions",
    "GuardClassificationResult",
    "RedactResult",
    "GuardResponse",
    "RedactResponse",
    "ScanResponse",
    "ScanUsage",
    "ChatMessage",
    "MultimodalContentPart",
    "ProcessedInput",
    "AnalysisResponse",
    "TokenUsage",
    "ParsedModel",
    # OrcaRouter
    "ORCAROUTER_DEFAULT_API_BASE_URL",
    "ORCAROUTER_SEED_MODELS",
    "build_orcarouter_url",
    "get_orcarouter_base_url",
    "OrcaRouterCatalog",
    "OrcaRouterCatalogError",
    "OrcaRouterModel",
    "fetch_orcarouter_catalog",
    "filter_orcarouter_models",
    "is_orcarouter_model_compatible",
    "list_orcarouter_models",
    "parse_orcarouter_catalog",
    "reset_orcarouter_catalog_cache",
]
