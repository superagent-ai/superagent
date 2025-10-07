"""Compatibility layer for legacy superagent_guard imports."""

from superagent_ai import (
    AnalysisResponse,
    Client,
    GuardDecision,
    GuardError,
    GuardResult,
    RedactResult,
    create_client,
)

__all__ = [
    "AnalysisResponse",
    "Client",
    "GuardDecision",
    "GuardError",
    "GuardResult",
    "RedactResult",
    "create_client",
]
