"""
safety-agent
A lightweight Python guardrail SDK for content safety
"""

from .client import SafetyClient, create_client
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
]
