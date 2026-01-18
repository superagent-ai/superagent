"""
Safety Agent Client
"""

import asyncio
import json
import os
import re
from typing import Any

import httpx

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
    ScanFinding,
    ScanSummary,
    ChatMessage,
    TokenUsage,
    ProcessedInput,
    MultimodalContentPart,
)
from .providers import call_provider, parse_model, DEFAULT_GUARD_MODEL
from .prompts.guard import build_guard_user_message, build_guard_system_prompt
from .prompts.redact import build_redact_system_prompt, build_redact_user_message
from .prompts.scan import SCAN_SYSTEM_PROMPT
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

    # Collect reasoning from blocked results, or from first result if all pass
    blocked_results = [r for r in results if r.classification == "block"]
    if blocked_results:
        reasoning = " ".join(r.reasoning for r in blocked_results)
    else:
        reasoning = results[0].reasoning if results else ""

    return GuardResponse(
        classification="block" if has_block else "pass",
        reasoning=reasoning,
        violation_types=list(all_violations),
        cwe_codes=list(all_cwe_codes),
        usage=TokenUsage(
            prompt_tokens=sum(r.usage.prompt_tokens for r in results),
            completion_tokens=sum(r.usage.completion_tokens for r in results),
            total_tokens=sum(r.usage.total_tokens for r in results),
        ),
    )


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
                reasoning=parsed.get("reasoning", ""),
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
                reasoning=parsed.get("reasoning", ""),
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

        # Handle input passed via kwargs
        if input is None:
            input = kwargs.get("input")

        if input is None:
            raise ValueError("input is required")

        model = model or DEFAULT_GUARD_MODEL

        # Validate chunk_size is non-negative
        if chunk_size < 0:
            raise ValueError(f"chunk_size must be non-negative, got {chunk_size}")

        # Process the input (handle URLs, bytes, etc.)
        processed = await process_input(input)

        # Handle image inputs with vision models
        if processed.type == "image":
            result = await self._guard_image(processed, system_prompt, model)
            self._post_usage(result.usage)
            return result

        # Handle PDF inputs - analyze each page in parallel
        if processed.type == "pdf" and processed.pages:
            non_empty_pages = [p for p in processed.pages if p.strip()]

            if not non_empty_pages:
                # PDF has no extractable text, return pass
                return GuardResponse(
                    classification="pass",
                    reasoning="PDF contains no extractable text content to analyze.",
                    violation_types=[],
                    cwe_codes=[],
                    usage=TokenUsage(
                        prompt_tokens=0, completion_tokens=0, total_tokens=0
                    ),
                )

            # Analyze each page in parallel
            results = await asyncio.gather(
                *[
                    self._guard_single_text(page_text, system_prompt, model)
                    for page_text in non_empty_pages
                ]
            )

            # Aggregate with OR logic
            aggregated = _aggregate_guard_results(list(results))
            self._post_usage(aggregated.usage)
            return aggregated

        # Handle text inputs (including document text)
        text = processed.text or ""

        # Skip chunking if disabled (chunk_size=0) or input is small enough
        if chunk_size == 0 or len(text) <= chunk_size:
            result = await self._guard_single_text(text, system_prompt, model)
            self._post_usage(result.usage)
            return result

        # Chunk and process in parallel
        chunks = _chunk_text(text, chunk_size)
        results = await asyncio.gather(
            *[
                self._guard_single_text(chunk, system_prompt, model)
                for chunk in chunks
            ]
        )

        # Aggregate with OR logic
        aggregated = _aggregate_guard_results(list(results))
        self._post_usage(aggregated.usage)
        return aggregated

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

    async def scan(
        self,
        repo: str | None = None,
        *,
        branch: str | None = None,
        model: str = "anthropic/claude-sonnet-4-5",
        prompt: str | None = None,
        # Also accept ScanOptions-style kwargs
        **kwargs: Any,
    ) -> ScanResponse:
        """
        Scan method - Scans a repository for AI agent-targeted attacks.

        This method clones a repository into a Modal sandbox, runs OpenCode
        with a security-focused prompt to detect threats like repo poisoning,
        prompt injections, and malicious instructions.

        Args:
            repo: Git repository URL to scan
            branch: Optional branch, tag, or commit to checkout
            model: Model for OpenCode to use (provider/model format).
                   Default: anthropic/claude-sonnet-4-5
            prompt: Custom scanning prompt (overrides default security prompt)

        Returns:
            Response with classification, findings, and summary

        Example:
            ```python
            result = await client.scan(
                repo="https://github.com/user/repo",
                branch="main",
            )

            if result.classification == "unsafe":
                print("Found issues:", result.findings)
            ```
        """
        # Handle ScanOptions passed as first argument
        if isinstance(repo, ScanOptions):
            options = repo
            repo = options.repo
            branch = branch or options.branch
            model = options.model or model
            prompt = prompt or options.prompt

        # Handle repo passed via kwargs
        if repo is None:
            repo = kwargs.get("repo")

        if repo is None:
            raise ValueError("Repository URL is required")

        if not repo.startswith("https://") and not repo.startswith("git@"):
            raise ValueError("Repository URL must start with https:// or git@")

        # Use default prompt if not provided
        if prompt is None:
            prompt = SCAN_SYSTEM_PROMPT

        # Run scan in Daytona sandbox
        scan_result = await self._call_daytona_scan(repo, branch, prompt, model)

        # Parse and normalize the result
        scan_response = self._parse_scan_result(scan_result)

        # Track usage if available
        if scan_response.usage:
            self._post_usage(scan_response.usage)

        return scan_response

    async def _call_daytona_scan(
        self,
        repo: str,
        branch: str | None,
        prompt: str,
        model: str,
    ) -> dict[str, Any]:
        """Run a security scan in a Daytona sandbox."""
        from daytona_sdk import Daytona

        # Daytona SDK uses DAYTONA_API_KEY env var automatically
        api_key = os.environ.get("DAYTONA_API_KEY")
        if not api_key:
            raise ValueError(
                "Daytona API key required. Set DAYTONA_API_KEY environment variable."
            )

        daytona = Daytona()

        # Create sandbox with Python runtime
        sandbox = daytona.create(language="python")

        try:
            # Install OpenCode CLI via npm
            sandbox.process.execute_command("npm i -g opencode-ai@latest")

            # Clone repository using native Git integration (use relative path)
            # API: clone(url, path, branch?, commit_id?, username?, password?)
            repo_path = "repo"
            sandbox.git.clone(repo, repo_path, branch)

            # Escape the prompt for shell command
            escaped_prompt = prompt.replace('"', '\\"').replace("$", "\\$")

            # Run OpenCode scan using the run command with JSON output
            result = sandbox.process.execute_command(
                f'cd {repo_path} && opencode run --model {model} --format json "{escaped_prompt}"'
            )

            # Parse JSON output - OpenCode outputs NDJSON (newline-delimited JSON)
            if result.exit_code != 0:
                return {
                    "error": f"OpenCode scan failed (exit {result.exit_code}): {result.result}",
                    "classification": "error",
                    "findings": [],
                }

            # Try to extract JSON from output (may have multiple lines or extra text)
            output = result.result.strip()
            
            # Try parsing as single JSON first
            try:
                return json.loads(output)
            except json.JSONDecodeError:
                # Try to find JSON objects in NDJSON format
                lines = [line for line in output.split('\n') if line.strip().startswith('{')]
                if lines:
                    # Return the last JSON object (usually the final result)
                    return json.loads(lines[-1])
                
                # Return raw output as reasoning if no JSON found
                return {
                    "classification": "error",
                    "reasoning": f"OpenCode output (no JSON found): {output[:500]}",
                    "findings": [],
                }

        except json.JSONDecodeError as e:
            return {
                "error": f"Failed to parse scan output: {e}",
                "classification": "error",
                "findings": [],
            }
        except Exception as e:
            return {
                "error": f"Scan failed: {e}",
                "classification": "error",
                "findings": [],
            }
        finally:
            # Always clean up the sandbox
            try:
                sandbox.delete()
            except Exception:
                pass  # Ignore cleanup errors

    def _parse_scan_result(self, result: dict[str, Any]) -> ScanResponse:
        """Parse and normalize the scan result from Daytona sandbox."""
        # Handle error case
        if "error" in result:
            return ScanResponse(
                classification="error",
                reasoning=str(result["error"]),
                findings=[],
                summary=ScanSummary(),
                scanned_files=0,
                usage=TokenUsage(
                    prompt_tokens=0, completion_tokens=0, total_tokens=0
                ),
                error=str(result["error"]),
            )

        # Parse findings
        raw_findings = result.get("findings", [])
        findings: list[ScanFinding] = []
        for f in raw_findings:
            if isinstance(f, dict):
                findings.append(
                    ScanFinding(
                        file=f.get("file", ""),
                        line=f.get("line", 0),
                        severity=f.get("severity", "low"),
                        category=f.get("category", "repo_poisoning"),
                        description=f.get("description", ""),
                        snippet=f.get("snippet", ""),
                        remediation=f.get("remediation", ""),
                    )
                )

        # Calculate summary if not provided
        raw_summary = result.get("summary", {})
        if not raw_summary:
            raw_summary = {
                "critical": sum(1 for f in findings if f.severity == "critical"),
                "high": sum(1 for f in findings if f.severity == "high"),
                "medium": sum(1 for f in findings if f.severity == "medium"),
                "low": sum(1 for f in findings if f.severity == "low"),
            }

        summary = ScanSummary(
            critical=raw_summary.get("critical", 0),
            high=raw_summary.get("high", 0),
            medium=raw_summary.get("medium", 0),
            low=raw_summary.get("low", 0),
        )

        # Determine classification
        classification = result.get("classification")
        if classification not in ("safe", "unsafe", "error"):
            classification = "unsafe" if findings else "safe"

        return ScanResponse(
            classification=classification,
            reasoning=str(result.get("reasoning", "")),
            findings=findings,
            summary=summary,
            scanned_files=int(result.get("scannedFiles", 0)),
            usage=TokenUsage(
                prompt_tokens=0, completion_tokens=0, total_tokens=0
            ),
        )


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
