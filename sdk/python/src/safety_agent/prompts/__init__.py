"""
Prompt templates for guard and redact methods
"""

from .guard import (
    GUARD_SYSTEM_PROMPT,
    build_guard_user_message,
    build_guard_system_prompt,
)
from .redact import (
    REDACT_SYSTEM_PROMPT,
    build_redact_user_message,
    build_redact_system_prompt,
)

__all__ = [
    "GUARD_SYSTEM_PROMPT",
    "build_guard_user_message",
    "build_guard_system_prompt",
    "REDACT_SYSTEM_PROMPT",
    "build_redact_user_message",
    "build_redact_system_prompt",
]
