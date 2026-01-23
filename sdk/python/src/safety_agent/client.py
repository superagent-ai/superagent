"""
Safety Agent Client
"""

import asyncio
import inspect
import json
import os
import re
import time
from typing import Any

import httpx

from .types import (
    ClientConfig,
    GuardInput,
    GuardOptions,
    GuardHooks,
    GuardStartEvent,
    GuardSegmentEvent,
    GuardResultEvent,
    GuardErrorEvent,
    GuardSegmentKind,
    GuardInputUnits,
    RedactOptions,
    GuardClassificationResult,
    RedactResult,
    GuardResponse,
    RedactResponse,
    ChatMessage,
    TokenUsage,
    ProcessedInput,
    MultimodalContentPart,
)
from .providers import call_provider, parse_model, DEFAULT_GUARD_MODEL
from .prompts.guard import build_guard_user_message, build_guard_system_prompt
from .prompts.redact import build_redact_system_prompt, build_redact_user_message
from .schemas import GUARD_RESPONSE_FORMAT, REDACT_RESPONSE_FORMAT
from .utils.input_processor import process_input, is_vision_model


def _chunk_text(text: str, chunk_size: int) -> list[str]:
    """
    Split text into chunks at word boundaries.

    Args:
        text: The text to chunk
        chunk_size: Maximum characters per chunk (must be positive)

    Returns:
        Array of text chunks
    """
    if chunk_size <= 0:
        raise ValueError(f"chunk_size must be positive, got {chunk_size}")

    if len(text) <= chunk_size:
        return [text]

    chunks: list[str] = []
    start = 0

    while start < len(text):
        end = min(start + chunk_size, len(text))
        # Find word boundary (don't split mid-word)
        if end < len(text):
            last_space = text.rfind(" ", start, end)
            if last_space > start:
                end = last_space
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start = end

    return chunks


def _aggregate_guard_results(results: list[GuardResponse]) -> GuardResponse:
    """
    Aggregate multiple guard results using OR logic.
    Block if ANY chunk is blocked, merge all violations.
    """
    has_block = any(r.classification == "block" for r in results)

    # Merge and deduplicate violation types and CWE codes
    all_violations: set[str] = set()
    all_cwe_codes: set[str] = set()

    for r in results:
        all_violations.update(r.violation_types)
        all_cwe_codes.update(r.cwe_codes)

    return GuardResponse(
        classification="block" if has_block else "pass",
        violation_types=list(all_violations),
        cwe_codes=list(all_cwe_codes),
        usage=TokenUsage(
            prompt_tokens=sum(r.usage.prompt_tokens for r in results),
            completion_tokens=sum(r.usage.completion_tokens for r in results),
            total_tokens=sum(r.usage.total_tokens for r in results),
        ),
    )


def _get_guard_input_sizing(
    processed: ProcessedInput,
) -> tuple[int, GuardInputUnits, int | None]:
    if processed.type == "image":
        return len(processed.image_base64 or ""), "base64", None

    if processed.type == "pdf":
        pages = processed.pages or []
        size = sum(len(page) for page in pages)
        return size, "chars", len(pages)

    return len(processed.text or ""), "chars", None


def _build_guard_start_event(
    processed: ProcessedInput,
    model: str,
    chunk_size: int,
    segment_count: int,
) -> GuardStartEvent:
    input_size, input_units, page_count = _get_guard_input_sizing(processed)
    return GuardStartEvent(
        model=model,
        chunk_size=chunk_size,
        input_type=processed.type,
        input_size=input_size,
        input_units=input_units,
        segment_count=segment_count,
        page_count=page_count,
        timestamp=time.time() * 1000,
    )


def _build_guard_segment_event(
    *,
    kind: GuardSegmentKind,
    index: int,
    count: int,
    input_type: ProcessedInput,
    segment_size: int,
    segment_units: GuardInputUnits,
    result: GuardResponse,
    duration_ms: float,
) -> GuardSegmentEvent:
    return GuardSegmentEvent(
        kind=kind,
        index=index,
        count=count,
        input_type=input_type.type,
        segment_size=segment_size,
        segment_units=segment_units,
        result=result,
        duration_ms=duration_ms,
        timestamp=time.time() * 1000,
    )


def _build_guard_result_event(
    result: GuardResponse,
    input_type: ProcessedInput,
    segment_count: int,
    duration_ms: float,
) -> GuardResultEvent:
    return GuardResultEvent(
        result=result,
        input_type=input_type.type,
        segment_count=segment_count,
        duration_ms=duration_ms,
        timestamp=time.time() * 1000,
    )


def _build_guard_error_event(
    error: Exception,
    duration_ms: float,
    *,
    input_type: ProcessedInput | None = None,
    segment_index: int | None = None,
    segment_kind: GuardSegmentKind | None = None,
) -> GuardErrorEvent:
    return GuardErrorEvent(
        error=error,
        input_type=input_type.type if input_type else None,
        segment_index=segment_index,
        segment_kind=segment_kind,
        duration_ms=duration_ms,
        timestamp=time.time() * 1000,
    )


def _mark_guard_hooked(error: Exception) -> None:
    try:
        setattr(error, "_guard_hooked", True)
    except Exception:
        pass


def _is_guard_hooked(error: Exception) -> bool:
    return bool(getattr(error, "_guard_hooked", False))


def _parse_json_response(content: str) -> dict[str, Any]:
    """
    Parse JSON response, handling both direct JSON and JSON wrapped in markdown code blocks.
    """
    trimmed = content.strip()

    # Try direct parse first (already valid JSON)
    try:
        return json.loads(trimmed)
    except json.JSONDecodeError:
        pass

    # Extract from markdown code block
    match = re.search(r"```(?:json)?\s*([\s\S]*?)```", trimmed)
    if match:
        try:
            return json.loads(match.group(1).strip())
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Failed to parse JSON response: {content}")


def _supports_structured_output(model_string: str) -> bool:
    """Check if provider and model support structured output."""
    parsed = parse_model(model_string)
    provider = parsed.provider
    model = parsed.model

    if provider == "openai":
        return True

    if provider == "vercel":
        return True

    if provider == "google":
        return True

    if provider == "bedrock":
        return True

    if provider == "groq":
        return any(x in model for x in [
            "gpt-oss-20b",
            "gpt-oss-120b",
            "gpt-oss-safeguard-20b",
            "kimi-k2-instruct-0905",
            "llama-4-maverick-17b-128e-instruct",
            "llama-4-scout-17b-16e-instruct",
        ])

    if provider == "fireworks":
        return any(x in model for x in [
            "gpt-oss-20b",
            "gpt-oss-120b",
            "gpt-oss-safeguard-20b",
            "gpt-oss-safeguard-120b",
            "kimi-k2-instruct-0905",
            "llama-4-maverick-17b-128e-instruct",
            "llama-4-scout-17b-16e-instruct",
        ])

    if provider == "anthropic":
        return any(x in model for x in ["sonnet-4-5", "opus-4-1"])

    if provider == "openrouter":
        # OpenAI models via OpenRouter
        if model.startswith("openai/"):
            return "safeguard" not in model
        # Google Gemini models
        if model.startswith("google/gemini-"):
            return True
        return False

    return False


class SafetyClient:
    """
    Safety Agent Client.
    Provides guardrail methods for content safety.
    """

    def __init__(self, config: ClientConfig | None = None):
        """
        Initialize the Safety Agent client.

        Args:
            config: Optional client configuration with API key
        """
        api_key = None
        if config:
            api_key = config.api_key

        if not api_key:
            api_key = os.environ.get("SUPERAGENT_API_KEY")

        if not api_key:
            raise ValueError(
                "API key is required. Provide via create_client(api_key=...) "
                "or SUPERAGENT_API_KEY env var"
            )

        self._api_key = api_key

    def _post_usage(self, usage: TokenUsage) -> None:
        """Post usage metrics to Superagent dashboard (fire and forget)."""
        try:
            httpx.post(
                "https://superagent.sh/api/billing/usage",
                headers={
                    "Content-Type": "application/json",
                    "x-api-key": self._api_key,
                },
                json={"token_count": usage.total_tokens},
                timeout=5.0,
            )
        except Exception:
            pass  # Fire and forget - ignore errors

    def _emit_hook(self, hook: Any, event: Any) -> None:
        if hook is None:
            return
        try:
            result = hook(event)
            if inspect.isawaitable(result):
                asyncio.create_task(result)
        except Exception:
            # Swallow hook errors to avoid impacting guard execution
            pass

    async def _guard_single_text(
        self,
        input_text: str,
        system_prompt: str | None,
        model: str,
    ) -> GuardResponse:
        """Guard a single chunk of text input (internal method)."""
        is_superagent = model.startswith("superagent/")

        # Use default system prompt for superagent if none provided
        final_system_prompt = (
            (system_prompt or build_guard_system_prompt())
            if is_superagent
            else build_guard_system_prompt(system_prompt)
        )

        messages: list[ChatMessage] = []
        if final_system_prompt:
            messages.append(ChatMessage(role="system", content=final_system_prompt))

        # Superagent model expects input directly without wrapper
        user_content = input_text if is_superagent else build_guard_user_message(input_text)
        messages.append(ChatMessage(role="user", content=user_content))

        # Use structured output for supported models
        response_format = (
            GUARD_RESPONSE_FORMAT if _supports_structured_output(model) else None
        )
        response = await call_provider(model, messages, response_format)
        content = response.choices[0].message.content

        if not content:
            raise RuntimeError("No response content from provider")

        if not isinstance(content, str):
            raise RuntimeError("Expected string content from provider")

        try:
            parsed = _parse_json_response(content)
            return GuardResponse(
                classification=parsed.get("classification", "pass"),
                violation_types=parsed.get("violation_types", []),
                cwe_codes=parsed.get("cwe_codes", []),
                usage=response.usage,
            )
        except Exception as e:
            raise RuntimeError(f"Failed to parse guard response: {content}") from e

    async def _guard_image(
        self,
        processed: ProcessedInput,
        system_prompt: str | None,
        model: str,
    ) -> GuardResponse:
        """Guard an image input using vision model (internal method)."""
        if not is_vision_model(model):
            raise ValueError(
                f"Model {model} does not support vision. "
                "Use a vision-capable model like gpt-4o, claude-3-*, or gemini-*."
            )

        is_superagent = model.startswith("superagent/")
        final_system_prompt = (
            (system_prompt or build_guard_system_prompt())
            if is_superagent
            else build_guard_system_prompt(system_prompt)
        )

        # Build multimodal content for image analysis
        image_data_url = f"data:{processed.mime_type};base64,{processed.image_base64}"
        user_content: list[MultimodalContentPart] = [
            {"type": "image_url", "image_url": {"url": image_data_url}},
        ]

        messages: list[ChatMessage] = []
        if final_system_prompt:
            messages.append(ChatMessage(role="system", content=final_system_prompt))
        messages.append(ChatMessage(role="user", content=user_content))

        # Use structured output for supported models
        response_format = (
            GUARD_RESPONSE_FORMAT if _supports_structured_output(model) else None
        )
        response = await call_provider(model, messages, response_format)
        content = response.choices[0].message.content

        if not content:
            raise RuntimeError("No response content from provider")

        if not isinstance(content, str):
            raise RuntimeError("Expected string content from provider")

        try:
            parsed = _parse_json_response(content)
            return GuardResponse(
                classification=parsed.get("classification", "pass"),
                violation_types=parsed.get("violation_types", []),
                cwe_codes=parsed.get("cwe_codes", []),
                usage=response.usage,
            )
        except Exception as e:
            raise RuntimeError(f"Failed to parse guard response: {content}") from e

    async def guard(
        self,
        input: GuardInput | None = None,
        *,
        model: str | None = None,
        system_prompt: str | None = None,
        chunk_size: int = 8000,
        hooks: GuardHooks | None = None,
        # Also accept GuardOptions-style kwargs
        **kwargs: Any,
    ) -> GuardResponse:
        """
        Guard method - Classifies input as pass/block.

        Supports text strings, URLs, and bytes inputs.
        - Plain text: analyzed directly
        - URLs starting with http(s)://: fetched and analyzed
        - Bytes: analyzed based on content type

        For text inputs, automatically chunks large inputs and processes them in parallel.
        Uses OR logic: blocks if ANY chunk is classified as "block".

        Args:
            input: The input to analyze - text, URL, or bytes
            model: Model in "provider/model" format. Defaults to superagent/guard-1.7b
            system_prompt: Optional custom system prompt
            chunk_size: Characters per chunk. Default: 8000. Set to 0 to disable chunking.
            hooks: Optional observability hooks for guard execution

        Returns:
            Response with classification result and token usage
        """
        # Handle GuardOptions passed as first argument
        if isinstance(input, GuardOptions):
            options = input
            input = options.input
            model = model or options.model
            system_prompt = system_prompt or options.system_prompt
            chunk_size = options.chunk_size
            hooks = hooks or options.hooks

        # Handle input passed via kwargs
        if input is None:
            input = kwargs.get("input")

        if input is None:
            raise ValueError("input is required")

        model = model or DEFAULT_GUARD_MODEL
        started_at = time.perf_counter()
        processed: ProcessedInput | None = None

        try:
            # Validate chunk_size is non-negative
            if chunk_size < 0:
                raise ValueError(f"chunk_size must be non-negative, got {chunk_size}")

            # Process the input (handle URLs, bytes, etc.)
            processed = await process_input(input)

            # Handle image inputs with vision models
            if processed.type == "image":
                self._emit_hook(
                    hooks.on_start if hooks else None,
                    _build_guard_start_event(processed, model, chunk_size, 1),
                )
                segment_start = time.perf_counter()
                try:
                    result = await self._guard_image(processed, system_prompt, model)
                except Exception as error:
                    _mark_guard_hooked(error)
                    self._emit_hook(
                        hooks.on_error if hooks else None,
                        _build_guard_error_event(
                            error,
                            (time.perf_counter() - started_at) * 1000,
                            input_type=processed,
                            segment_index=0,
                            segment_kind="image",
                        ),
                    )
                    raise

                self._emit_hook(
                    hooks.on_segment if hooks else None,
                    _build_guard_segment_event(
                        kind="image",
                        index=0,
                        count=1,
                        input_type=processed,
                        segment_size=len(processed.image_base64 or ""),
                        segment_units="base64",
                        result=result,
                        duration_ms=(time.perf_counter() - segment_start) * 1000,
                    ),
                )
                self._emit_hook(
                    hooks.on_result if hooks else None,
                    _build_guard_result_event(
                        result,
                        processed,
                        1,
                        (time.perf_counter() - started_at) * 1000,
                    ),
                )
                self._post_usage(result.usage)
                return result

            # Handle PDF inputs - analyze each page in parallel
            if processed.type == "pdf" and processed.pages:
                non_empty_pages = [p for p in processed.pages if p.strip()]
                segment_count = len(non_empty_pages)

                self._emit_hook(
                    hooks.on_start if hooks else None,
                    _build_guard_start_event(
                        processed, model, chunk_size, segment_count
                    ),
                )

                if segment_count == 0:
                    # PDF has no extractable text, return pass
                    empty_result = GuardResponse(
                        classification="pass",
                        violation_types=[],
                        cwe_codes=[],
                        usage=TokenUsage(
                            prompt_tokens=0, completion_tokens=0, total_tokens=0
                        ),
                    )
                    self._emit_hook(
                        hooks.on_result if hooks else None,
                        _build_guard_result_event(
                            empty_result,
                            processed,
                            0,
                            (time.perf_counter() - started_at) * 1000,
                        ),
                    )
                    return empty_result

                async def _run_page(page_text: str, index: int) -> GuardResponse:
                    segment_start = time.perf_counter()
                    try:
                        result = await self._guard_single_text(
                            page_text, system_prompt, model
                        )
                    except Exception as error:
                        _mark_guard_hooked(error)
                        self._emit_hook(
                            hooks.on_error if hooks else None,
                            _build_guard_error_event(
                                error,
                                (time.perf_counter() - started_at) * 1000,
                                input_type=processed,
                                segment_index=index,
                                segment_kind="page",
                            ),
                        )
                        raise

                    self._emit_hook(
                        hooks.on_segment if hooks else None,
                        _build_guard_segment_event(
                            kind="page",
                            index=index,
                            count=segment_count,
                            input_type=processed,
                            segment_size=len(page_text),
                            segment_units="chars",
                            result=result,
                            duration_ms=(time.perf_counter() - segment_start) * 1000,
                        ),
                    )
                    return result

                # Analyze each page in parallel
                results = await asyncio.gather(
                    *[
                        _run_page(page_text, index)
                        for index, page_text in enumerate(non_empty_pages)
                    ]
                )

                # Aggregate with OR logic
                aggregated = _aggregate_guard_results(list(results))
                self._emit_hook(
                    hooks.on_result if hooks else None,
                    _build_guard_result_event(
                        aggregated,
                        processed,
                        segment_count,
                        (time.perf_counter() - started_at) * 1000,
                    ),
                )
                self._post_usage(aggregated.usage)
                return aggregated

            # Handle text inputs (including document text)
            text = processed.text or ""

            # Skip chunking if disabled (chunk_size=0) or input is small enough
            if chunk_size == 0 or len(text) <= chunk_size:
                self._emit_hook(
                    hooks.on_start if hooks else None,
                    _build_guard_start_event(processed, model, chunk_size, 1),
                )
                segment_start = time.perf_counter()
                try:
                    result = await self._guard_single_text(text, system_prompt, model)
                except Exception as error:
                    _mark_guard_hooked(error)
                    self._emit_hook(
                        hooks.on_error if hooks else None,
                        _build_guard_error_event(
                            error,
                            (time.perf_counter() - started_at) * 1000,
                            input_type=processed,
                            segment_index=0,
                            segment_kind="input",
                        ),
                    )
                    raise

                self._emit_hook(
                    hooks.on_segment if hooks else None,
                    _build_guard_segment_event(
                        kind="input",
                        index=0,
                        count=1,
                        input_type=processed,
                        segment_size=len(text),
                        segment_units="chars",
                        result=result,
                        duration_ms=(time.perf_counter() - segment_start) * 1000,
                    ),
                )
                self._emit_hook(
                    hooks.on_result if hooks else None,
                    _build_guard_result_event(
                        result,
                        processed,
                        1,
                        (time.perf_counter() - started_at) * 1000,
                    ),
                )
                self._post_usage(result.usage)
                return result

            # Chunk and process in parallel
            chunks = _chunk_text(text, chunk_size)
            segment_count = len(chunks)
            self._emit_hook(
                hooks.on_start if hooks else None,
                _build_guard_start_event(processed, model, chunk_size, segment_count),
            )

            async def _run_chunk(chunk: str, index: int) -> GuardResponse:
                segment_start = time.perf_counter()
                try:
                    result = await self._guard_single_text(chunk, system_prompt, model)
                except Exception as error:
                    _mark_guard_hooked(error)
                    self._emit_hook(
                        hooks.on_error if hooks else None,
                        _build_guard_error_event(
                            error,
                            (time.perf_counter() - started_at) * 1000,
                            input_type=processed,
                            segment_index=index,
                            segment_kind="chunk",
                        ),
                    )
                    raise

                self._emit_hook(
                    hooks.on_segment if hooks else None,
                    _build_guard_segment_event(
                        kind="chunk",
                        index=index,
                        count=segment_count,
                        input_type=processed,
                        segment_size=len(chunk),
                        segment_units="chars",
                        result=result,
                        duration_ms=(time.perf_counter() - segment_start) * 1000,
                    ),
                )
                return result

            results = await asyncio.gather(
                *[_run_chunk(chunk, index) for index, chunk in enumerate(chunks)]
            )

            # Aggregate with OR logic
            aggregated = _aggregate_guard_results(list(results))
            self._emit_hook(
                hooks.on_result if hooks else None,
                _build_guard_result_event(
                    aggregated,
                    processed,
                    segment_count,
                    (time.perf_counter() - started_at) * 1000,
                ),
            )
            self._post_usage(aggregated.usage)
            return aggregated
        except Exception as error:
            if not _is_guard_hooked(error):
                self._emit_hook(
                    hooks.on_error if hooks else None,
                    _build_guard_error_event(
                        error,
                        (time.perf_counter() - started_at) * 1000,
                        input_type=processed,
                    ),
                )
            raise

    async def redact(
        self,
        input: str | None = None,
        *,
        model: str | None = None,
        entities: list[str] | None = None,
        rewrite: bool = False,
        # Also accept RedactOptions-style kwargs
        **kwargs: Any,
    ) -> RedactResponse:
        """
        Redact method - Sanitizes sensitive/dangerous content.

        Args:
            input: The input text to redact
            model: Model in "provider/model" format, e.g. "openai/gpt-4o"
            entities: Optional list of entity types to redact (overrides default entities)
            rewrite: When true, rewrites text contextually instead of using placeholders

        Returns:
            Response with redacted text, findings, and token usage
        """
        # Handle RedactOptions passed as first argument
        if isinstance(input, RedactOptions):
            options = input
            input = options.input
            model = model or options.model
            entities = entities or options.entities
            rewrite = options.rewrite

        # Handle input passed via kwargs
        if input is None:
            input = kwargs.get("input")

        if input is None:
            raise ValueError("input is required")

        if model is None:
            raise ValueError("model is required for redact")

        system_prompt = build_redact_system_prompt(entities, rewrite)

        messages: list[ChatMessage] = [
            ChatMessage(role="system", content=system_prompt),
            ChatMessage(role="user", content=build_redact_user_message(input)),
        ]

        # Use structured output for supported models
        response_format = (
            REDACT_RESPONSE_FORMAT if _supports_structured_output(model) else None
        )
        response = await call_provider(model, messages, response_format)
        content = response.choices[0].message.content

        if not content:
            raise RuntimeError("No response content from provider")

        if not isinstance(content, str):
            raise RuntimeError("Expected string content from provider")

        try:
            parsed = _parse_json_response(content)
            redact_response = RedactResponse(
                redacted=parsed.get("redacted", ""),
                findings=parsed.get("findings", []),
                usage=response.usage,
            )
            self._post_usage(redact_response.usage)
            return redact_response
        except Exception as e:
            raise RuntimeError(f"Failed to parse redact response: {content}") from e


def create_client(
    api_key: str | None = None,
    *,
    config: ClientConfig | None = None,
) -> SafetyClient:
    """
    Create a new Safety Agent client.

    Args:
        api_key: API key for Superagent usage tracking
        config: Optional client configuration

    Returns:
        SafetyClient instance
    """
    if api_key:
        config = ClientConfig(api_key=api_key)
    return SafetyClient(config)
