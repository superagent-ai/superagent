"""
Redaction utility for sensitive data patterns (SOC2, HIPAA, GDPR compliance)
Uses comprehensive regex patterns to detect and redact PII/PHI
"""

import re
from typing import List, Tuple


# Pattern definitions: (regex_pattern, replacement_string)
REDACTION_PATTERNS: List[Tuple[re.Pattern, str]] = [
    # Email addresses
    (
        re.compile(r"\b[a-z0-9._%+\-—|]+@[a-z0-9.\-—|]+\.[a-z|]{2,6}\b", re.IGNORECASE),
        "<REDACTED_EMAIL>",
    ),
    # API keys and tokens (common patterns: sk_, pk_, api_, key_, token_)
    # Must come before other patterns to avoid conflicts
    (
        re.compile(r"\b(sk|pk|api|token|key)_[A-Za-z0-9_\-]{20,}\b", re.IGNORECASE),
        "<REDACTED_API_KEY>",
    ),
    # Bearer tokens
    (
        re.compile(r"Bearer\s+[A-Za-z0-9_\-\.]{20,}", re.IGNORECASE),
        "Bearer <REDACTED_TOKEN>",
    ),
    # AWS Access Keys
    (
        re.compile(r"\b(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}\b"),
        "<REDACTED_AWS_KEY>",
    ),
    # Social Security Numbers (comprehensive pattern)
    (
        re.compile(r"\b(?!000|666|9\d{2})([0-8]\d{2}|7([0-6]\d))[-\s]?(?!00)\d\d[-\s]?(?!0000)\d{4}\b"),
        "<REDACTED_SSN>",
    ),
    # Credit Cards - Visa
    (
        re.compile(r"\b[4]\d{3}[\s\-.]?\d{4}[\s\-.]?\d{4}[\s\-.]?\d{4}\b"),
        "<REDACTED_CC>",
    ),
    # Credit Cards - MasterCard
    (
        re.compile(r"\b(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)\d{12}\b"),
        "<REDACTED_CC>",
    ),
    # Credit Cards - American Express
    (
        re.compile(r"\b3[47]\d{13}\b"),
        "<REDACTED_CC>",
    ),
    # Phone numbers - US format (with parentheses, dashes, dots, spaces)
    (
        re.compile(r"\b(\+?1[\-\.\s]?)?\(?\d{3}\)?[\-\.\s]?\d{3}[\-\.\s]?\d{4}\b"),
        "<REDACTED_PHONE>",
    ),
    # IPv4 addresses
    (
        re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b"),
        "<REDACTED_IP>",
    ),
    # IPv6 addresses
    (
        re.compile(r"\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b"),
        "<REDACTED_IP>",
    ),
    # MAC addresses
    (
        re.compile(r"\b(?:[0-9A-Fa-f]{2}[:\-]){5}[0-9A-Fa-f]{2}\b"),
        "<REDACTED_MAC>",
    ),
    # Medical record numbers (MRN)
    (
        re.compile(r"\bMRN[:\s]*\d{6,10}\b", re.IGNORECASE),
        "<REDACTED_MRN>",
    ),
    # Passport numbers (alphanumeric, 6-9 characters)
    (
        re.compile(r"\b[A-Z]{1,2}\d{6,9}\b"),
        "<REDACTED_PASSPORT>",
    ),
    # IBAN (International Bank Account Number)
    (
        re.compile(r"\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b"),
        "<REDACTED_IBAN>",
    ),
    # US ZIP codes
    (
        re.compile(r"\b\d{5}(?:-\d{4})?\b"),
        "<REDACTED_ZIP>",
    ),
]


def redact_sensitive_data(text: str) -> str:
    """
    Redacts sensitive information from a string based on SOC2, HIPAA, and GDPR patterns

    Args:
        text: The text to redact

    Returns:
        The redacted text with sensitive data replaced
    """
    redacted = text

    for pattern, replacement in REDACTION_PATTERNS:
        redacted = pattern.sub(replacement, redacted)

    return redacted
