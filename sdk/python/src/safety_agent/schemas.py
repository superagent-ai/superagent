"""
JSON Schema definitions for structured output responses
"""

from typing import Any

# Type alias for response format
ResponseFormat = dict[str, Any]


GUARD_RESPONSE_FORMAT: ResponseFormat = {
    "type": "json_schema",
    "json_schema": {
        "name": "guard_classification",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "classification": {
                    "type": "string",
                    "enum": ["pass", "block"],
                    "description": "Whether the content should pass or be blocked",
                },
                "reasoning": {
                    "type": "string",
                    "description": "Brief explanation of why the content was classified as pass or block",
                },
                "violation_types": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Types of violations detected",
                },
                "cwe_codes": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "CWE codes associated with the violations",
                },
            },
            "required": ["classification", "reasoning", "violation_types", "cwe_codes"],
            "additionalProperties": False,
        },
    },
}


REDACT_RESPONSE_FORMAT: ResponseFormat = {
    "type": "json_schema",
    "json_schema": {
        "name": "redact_result",
        "strict": True,
        "schema": {
            "type": "object",
            "properties": {
                "redacted": {
                    "type": "string",
                    "description": "The sanitized text with redactions applied",
                },
                "findings": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Descriptions of what was redacted",
                },
            },
            "required": ["redacted", "findings"],
            "additionalProperties": False,
        },
    },
}
