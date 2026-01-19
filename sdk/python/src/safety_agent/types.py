"""
Type definitions for the Safety Agent SDK
"""

from dataclasses import dataclass, field
from typing import Literal, Union, TypedDict


# =============================================================================
# Client Configuration
# =============================================================================


@dataclass
class ClientConfig:
    """Configuration for creating a safety agent client."""

    api_key: str | None = None
    """API key for Superagent usage tracking. Defaults to SUPERAGENT_API_KEY env var."""


# =============================================================================
# Model Types
# =============================================================================

# Supported model format: "provider/model"
# Examples: "openai/gpt-4o", "anthropic/claude-3-5-sonnet-20241022", "superagent/guard-1.7b"
SupportedModel = str


# =============================================================================
# Input Types
# =============================================================================

GuardInput = Union[str, bytes]
"""
Guard input type - supports text and binary data.
- str starting with http:// or https:// -> treated as URL
- str not starting with http(s):// -> plain text
- bytes -> binary data (analyzed based on content)
"""


# =============================================================================
# Message Types
# =============================================================================


class ImageUrl(TypedDict):
    """Image URL structure."""

    url: str


class TextContentPart(TypedDict):
    """Text content part for multimodal messages."""

    type: Literal["text"]
    text: str


class ImageContentPart(TypedDict):
    """Image content part for multimodal messages."""

    type: Literal["image_url"]
    image_url: ImageUrl


MultimodalContentPart = Union[TextContentPart, ImageContentPart]


@dataclass
class ChatMessage:
    """Chat message format for LLM requests."""

    role: Literal["system", "user", "assistant"]
    content: Union[str, list[MultimodalContentPart]]


# =============================================================================
# Processed Input
# =============================================================================


@dataclass
class ProcessedInput:
    """Processed input result from input processor."""

    type: Literal["text", "image", "document", "pdf"]
    """The type of input that was detected."""

    text: str | None = None
    """Text content (for text and document types)."""

    image_base64: str | None = None
    """Base64 encoded image data (for image type)."""

    mime_type: str | None = None
    """MIME type of the content."""

    pages: list[str] | None = None
    """Array of text per page (for PDF type)."""


# =============================================================================
# Guard Types
# =============================================================================


@dataclass
class GuardOptions:
    """Options for the guard method."""

    input: GuardInput
    """The input to analyze - text, URL, or bytes."""

    model: SupportedModel | None = None
    """Model in 'provider/model' format. Defaults to superagent/guard-1.7b."""

    system_prompt: str | None = None
    """Optional custom system prompt that replaces the default guard prompt."""

    chunk_size: int = 8000
    """Characters per chunk. Default: 8000. Set to 0 to disable chunking."""


@dataclass
class GuardClassificationResult:
    """Result from guard classification."""

    classification: Literal["pass", "block"]
    """Whether the content passed or should be blocked."""

    reasoning: str = ""
    """Brief explanation of why the content was classified as pass or block."""

    violation_types: list[str] = field(default_factory=list)
    """Types of violations detected."""

    cwe_codes: list[str] = field(default_factory=list)
    """CWE codes associated with violations."""


# =============================================================================
# Redact Types
# =============================================================================


@dataclass
class RedactOptions:
    """Options for the redact method."""

    input: str
    """The input text to redact."""

    model: SupportedModel
    """Model in 'provider/model' format, e.g. 'openai/gpt-4o'."""

    entities: list[str] | None = None
    """Optional list of entity types to redact (overrides default entities)."""

    rewrite: bool = False
    """When true, rewrites text contextually instead of using placeholders."""


@dataclass
class RedactResult:
    """Result from redact operation."""

    redacted: str
    """The redacted/sanitized text."""

    findings: list[str] = field(default_factory=list)
    """List of findings that were redacted."""


# =============================================================================
# Token Usage
# =============================================================================


@dataclass
class TokenUsage:
    """Token usage information."""

    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


# =============================================================================
# Response Types
# =============================================================================


@dataclass
class GuardResponse:
    """Response from guard method including token usage."""

    classification: Literal["pass", "block"]
    """Whether the content passed or should be blocked."""

    reasoning: str
    """Brief explanation of why the content was classified as pass or block."""

    violation_types: list[str]
    """Types of violations detected."""

    cwe_codes: list[str]
    """CWE codes associated with violations."""

    usage: TokenUsage
    """Token usage information."""


@dataclass
class RedactResponse:
    """Response from redact method including token usage."""

    redacted: str
    """The redacted/sanitized text."""

    findings: list[str]
    """List of findings that were redacted."""

    usage: TokenUsage
    """Token usage information."""


# =============================================================================
# Provider Response Types
# =============================================================================


@dataclass
class AnalysisResponseChoice:
    """A single choice in the analysis response."""

    index: int
    message: ChatMessage
    finish_reason: str | None = None


@dataclass
class AnalysisResponse:
    """Unified response format from LLM providers."""

    id: str
    usage: TokenUsage
    choices: list[AnalysisResponseChoice]


# =============================================================================
# Parsed Model
# =============================================================================


@dataclass
class ParsedModel:
    """Parsed model identifier."""

    provider: str
    model: str


# =============================================================================
# Scan Types (AI Agent Security Scanning)
# =============================================================================

@dataclass
class ScanOptions:
    """Options for the scan method."""

    repo: str
    """Git repository URL to scan."""

    branch: str | None = None
    """Optional branch, tag, or commit to checkout."""

    model: str = "anthropic/claude-sonnet-4-5"
    """Model for OpenCode to use (provider/model format)."""


@dataclass
class ScanUsage:
    """Token usage metrics from OpenCode scan."""

    input_tokens: int
    """Total input tokens used."""

    output_tokens: int
    """Total output tokens used."""

    reasoning_tokens: int
    """Total reasoning tokens used (if applicable)."""

    cost: float
    """Total cost in USD."""


@dataclass
class ScanResponse:
    """Response from scan method."""

    result: str
    """The security report text from OpenCode."""

    usage: ScanUsage
    """Token usage metrics."""
