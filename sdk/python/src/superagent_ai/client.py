from __future__ import annotations

import inspect
import json
import os
from dataclasses import dataclass
from typing import Any, Awaitable, Callable, Literal, Optional, TypedDict, Union

import httpx


class GuardError(RuntimeError):
    """Raised when the guard request fails or is misconfigured."""


class GuardUsage(TypedDict):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


class GuardMessageContent(TypedDict, total=False):
    classification: Literal["pass", "block"]
    violation_types: list[str]
    cwe_codes: list[str]


class GuardMessage(TypedDict, total=False):
    role: str
    content: Union[GuardMessageContent, str]  # Support both dict (new API) and str (backward compat)
    reasoning_content: str  # Deprecated, use reasoning instead
    reasoning: str


class GuardChoice(TypedDict, total=False):
    message: GuardMessage
    finish_reason: str


class AnalysisResponse(TypedDict, total=False):
    usage: GuardUsage
    id: str
    model: Optional[str]
    choices: list[GuardChoice]


class GuardDecision(TypedDict, total=False):
    status: Literal["pass", "block"]
    violation_types: list[str]
    cwe_codes: list[str]


class Source(TypedDict, total=False):
    """Source material for verification."""
    content: str  # Required
    name: str  # Required
    url: str  # Optional


class SourceReference(TypedDict):
    """Reference to a source used in verification."""
    name: str
    url: str


class ClaimVerification(TypedDict):
    """Individual claim verification result."""
    claim: str
    verdict: bool
    sources: list[SourceReference]
    evidence: str
    reasoning: str


class VerificationResult(TypedDict):
    """Result containing all verified claims."""
    claims: list[ClaimVerification]


@dataclass(slots=True)
class GuardResult:
    rejected: bool
    reasoning: str
    raw: AnalysisResponse
    decision: Optional[GuardDecision] = None
    usage: Optional[GuardUsage] = None


@dataclass(slots=True)
class RedactResult:
    redacted: str
    reasoning: str
    raw: dict
    usage: Optional[GuardUsage] = None
    pdf: Optional[bytes] = None  # PDF bytes when format is "pdf"
    redacted_pdf: Optional[str] = None  # Base64 PDF data URL when file is provided with JSON response


@dataclass(slots=True)
class VerifyResult:
    """Result of verification containing all claims with verdicts and evidence."""
    claims: list[ClaimVerification]
    raw: dict
    usage: Optional[GuardUsage] = None


BlockCallback = Callable[[str], Union[Awaitable[None], None]]
PassCallback = Callable[[], Union[Awaitable[None], None]]


def _sanitize_url(url: str) -> str:
    return url[:-1] if url.endswith("/") else url


def _parse_decision(content: Optional[Union[GuardMessageContent, str]]) -> Optional[GuardDecision]:
    if not content:
        return None

    # Handle new API format where content is already a dict
    if isinstance(content, dict):
        parsed = content
    else:
        # Handle legacy format where content is a JSON string
        try:
            parsed = json.loads(content)
        except ValueError:
            return None

    if not isinstance(parsed, dict):
        return None

    status = parsed.get("status") or parsed.get("classification")
    if not isinstance(status, str) or status not in {"pass", "block"}:
        return None
    decision: GuardDecision = GuardDecision(status=status)

    violation_types = parsed.get("violation_types")
    if isinstance(violation_types, list):
        filtered_violations: list[str] = [
            violation for violation in violation_types if isinstance(violation, str)
        ]
        if filtered_violations:
            decision["violation_types"] = filtered_violations

    cwe_codes = parsed.get("cwe_codes")
    if isinstance(cwe_codes, list):
        filtered_codes: list[str] = [code for code in cwe_codes if isinstance(code, str)]
        if filtered_codes:
            decision["cwe_codes"] = filtered_codes

    return decision


def _reason_from(
    decision: Optional[GuardDecision],
    reasoning: Optional[str],
    rejected: bool,
) -> str:
    if decision:
        violations = decision.get("violation_types")
        if violations:
            return ", ".join(violations)
    if reasoning:
        return reasoning
    if rejected:
        return "Guard classified the command as malicious."
    return "Command approved by guard."


async def _maybe_call(callback: Optional[Callable[..., Union[Awaitable[None], None]]], *args: Any) -> None:
    if callback is None:
        return
    result = callback(*args)
    if inspect.isawaitable(result):
        await result


class Client:
    def __init__(
        self,
        api_base_url: str,
        api_key: str,
        *,
        client: Optional[httpx.AsyncClient] = None,
        timeout: Optional[float] = 10.0,
    ) -> None:
        if not api_base_url:
            api_base_url = "https://app.superagent.sh/api"
        if not api_key:
            raise GuardError("api_key must be provided")

        self._api_key = api_key
        base = _sanitize_url(api_base_url)
        self._guard_endpoint = f"{base}/guard"
        self._redact_endpoint = f"{base}/redact"
        self._verify_endpoint = f"{base}/verify"
        self._timeout = timeout
        self._client = client or httpx.AsyncClient(timeout=timeout)
        self._owns_client = client is None

    async def __aenter__(self) -> "Client":
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        await self.aclose()

    async def aclose(self) -> None:
        if self._owns_client:
            try:
                await self._client.aclose()
            except RuntimeError as e:
                # Suppress RuntimeErrors during cleanup when transport is already closed
                # This is a known issue with httpx/httpcore + uvloop
                if "handler is closed" not in str(e) and "TCPTransport closed" not in str(e):
                    raise
                # Otherwise, silently ignore the cleanup error

    async def guard(
        self,
        input: Union[str, Any],
        *,
        on_block: Optional[BlockCallback] = None,
        on_pass: Optional[PassCallback] = None,
        system_prompt: Optional[str] = None,
    ) -> GuardResult:
        # Determine if input is a file or text/URL
        is_file = hasattr(input, 'read') or not isinstance(input, str)
        
        # Check if input string is a URL
        is_url = isinstance(input, str) and (
            input.startswith("http://") or input.startswith("https://")
        )

        if not is_file and not input:
            raise GuardError("input must be a non-empty string, file, or URL")

        try:
            if is_file:
                # Use multipart/form-data for file input
                files = {"file": input}
                data = {"text": ""}  # Empty text when file is provided
                
                if system_prompt:
                    data["system_prompt"] = system_prompt

                headers = {
                    "Authorization": f"Bearer {self._api_key}",
                    "x-superagent-api-key": self._api_key,
                }

                response = await self._client.post(
                    self._guard_endpoint,
                    files=files,
                    data=data,
                    headers=headers,
                    timeout=self._timeout,
                )
            elif is_url:
                # Use JSON for URL input
                request_body = {"url": input}
                if system_prompt:
                    request_body["system_prompt"] = system_prompt
                    
                response = await self._client.post(
                    self._guard_endpoint,
                    json=request_body,
                    headers={
                        "Authorization": f"Bearer {self._api_key}",
                        "x-superagent-api-key": self._api_key,
                    },
                    timeout=self._timeout,
                )
            else:
                # Use JSON for text input
                request_body = {"text": input}
                if system_prompt:
                    request_body["system_prompt"] = system_prompt
                    
                response = await self._client.post(
                    self._guard_endpoint,
                    json=request_body,
                    headers={
                        "Authorization": f"Bearer {self._api_key}",
                        "x-superagent-api-key": self._api_key,
                    },
                    timeout=self._timeout,
                )
        except httpx.RequestError as error:
            raise GuardError(f"Failed to reach guard endpoint: {error}") from error

        if response.status_code >= httpx.codes.BAD_REQUEST:
            raise GuardError(
                f"Guard request failed with status {response.status_code}: {response.text}"
            )

        # Handle JSON response (guard always returns JSON, even for PDF files)
        analysis: AnalysisResponse = response.json()
        message = (analysis.get("choices") or [{}])[0].get("message", {})
        content = message.get("content")
        # Support both new 'reasoning' field and legacy 'reasoning_content' field
        reasoning = message.get("reasoning") or message.get("reasoning_content")
        decision = _parse_decision(content)
        rejected = bool(decision and decision.get("status") == "block")

        normalized_reason = _reason_from(decision, reasoning, rejected)

        result = GuardResult(
            rejected=rejected,
            reasoning=reasoning or normalized_reason,
            raw=analysis,
            decision=decision,
            usage=analysis.get("usage"),
        )
        if rejected:
            await _maybe_call(on_block, normalized_reason)
        else:
            await _maybe_call(on_pass)

        return result

    async def redact(
        self,
        input: Union[str, Any],
        *,
        url_whitelist: Optional[list[str]] = None,
        entities: Optional[list[str]] = None,
        format: Optional[str] = None,
        rewrite: Optional[bool] = None
    ) -> RedactResult:
        # Determine if input is a file or text
        is_file = hasattr(input, 'read') or not isinstance(input, str)

        if not is_file and not input:
            raise GuardError("input must be a non-empty string or file")

        try:
            if is_file:
                # Use multipart/form-data for file input
                files = {"file": input}
                data = {"text": ""}  # Empty text when file is provided

                if format:
                    data["format"] = format

                if entities:
                    data["entities"] = json.dumps(entities)

                if rewrite:
                    data["rewrite"] = "true"

                headers = {
                    "Authorization": f"Bearer {self._api_key}",
                    "x-superagent-api-key": self._api_key,
                }

                # Add Accept header if format is pdf to signal we want PDF response
                if format == "pdf":
                    headers["Accept"] = "application/pdf"

                response = await self._client.post(
                    self._redact_endpoint,
                    files=files,
                    data=data,
                    headers=headers,
                    timeout=self._timeout,
                )
            else:
                # Use JSON for text input
                request_body: dict[str, Any] = {"text": input}

                # Include entities in request body if provided
                if entities:
                    request_body["entities"] = entities

                # Include rewrite in request body if provided
                if rewrite:
                    request_body["rewrite"] = rewrite

                response = await self._client.post(
                    self._redact_endpoint,
                    json=request_body,
                    headers={
                        "Authorization": f"Bearer {self._api_key}",
                        "x-superagent-api-key": self._api_key,
                    },
                    timeout=self._timeout,
                )
        except httpx.RequestError as error:
            raise GuardError(f"Failed to reach redact endpoint: {error}") from error

        if response.status_code >= httpx.codes.BAD_REQUEST:
            raise GuardError(
                f"Redact request failed with status {response.status_code}: {response.text}"
            )

        # Check if response is PDF
        content_type = response.headers.get("content-type", "")
        if "application/pdf" in content_type:
            # Return PDF bytes
            pdf_bytes = response.content

            # Try to get usage stats from X-Redaction-Stats header
            usage = None
            stats_header = response.headers.get("X-Redaction-Stats")
            if stats_header:
                try:
                    usage = json.loads(stats_header)
                except Exception:
                    pass

            return RedactResult(
                redacted="",  # Empty string for PDF responses
                reasoning="PDF file redacted",
                raw={},
                usage=usage,
                pdf=pdf_bytes,
            )

        # Handle JSON response
        result = response.json()
        message = result.get("choices", [{}])[0].get("message", {})
        content = message.get("content", "")
        # Support both 'reasoning' (new API) and 'reasoning_content' (old API) for backward compatibility
        reasoning_content = message.get("reasoning") or message.get("reasoning_content", "")

        # Apply URL whitelist locally if provided (only for text input)
        if url_whitelist and not is_file:
            content = self._apply_url_whitelist(input, content, url_whitelist)

        return RedactResult(
            redacted=content,
            reasoning=reasoning_content,
            raw=result,
            usage=result.get("usage"),
            redacted_pdf=result.get("redacted_pdf"),
        )

    def _apply_url_whitelist(self, original: str, redacted: str, whitelist: list[str]) -> str:
        """Redact URLs that don't match the whitelist."""
        import re

        # Extract all URLs from the redacted text
        url_pattern = r'https?://[^\s<>"\']+'

        def replace_url(match):
            url = match.group(0)
            # Check if URL matches any whitelist entry (prefix match)
            is_whitelisted = any(url.startswith(whitelisted) for whitelisted in whitelist)
            # Keep whitelisted URLs, redact others
            return url if is_whitelisted else '<URL_REDACTED>'

        return re.sub(url_pattern, replace_url, redacted)

    async def verify(
        self,
        text: str,
        sources: list[Source],
    ) -> VerifyResult:
        """Verify claims in text against provided source materials.

        Args:
            text: The text containing claims to verify
            sources: List of source materials to verify claims against.
                    Each source must have 'content' and 'name' fields, and optionally a 'url' field.

        Returns:
            VerifyResult containing claims with verdicts, sources, evidence, and reasoning

        Raises:
            GuardError: If the request fails or is misconfigured
        """
        if not text or not isinstance(text, str):
            raise GuardError("text must be a non-empty string")

        if not sources or not isinstance(sources, list) or len(sources) == 0:
            raise GuardError("sources must be a non-empty list")

        # Validate each source
        for source in sources:
            if not isinstance(source, dict):
                raise GuardError("Each source must be a dictionary")
            if "content" not in source or not isinstance(source["content"], str):
                raise GuardError("Each source must have a 'content' field (string)")
            if "name" not in source or not isinstance(source["name"], str):
                raise GuardError("Each source must have a 'name' field (string)")
            if "url" in source and not isinstance(source["url"], str):
                raise GuardError("If provided, 'url' must be a string")

        request_body = {
            "text": text,
            "sources": sources,
        }

        try:
            response = await self._client.post(
                self._verify_endpoint,
                json=request_body,
                headers={
                    "Authorization": f"Bearer {self._api_key}",
                    "x-superagent-api-key": self._api_key,
                },
                timeout=self._timeout,
            )
        except httpx.RequestError as error:
            raise GuardError(f"Failed to reach verify endpoint: {error}") from error

        if response.status_code >= httpx.codes.BAD_REQUEST:
            raise GuardError(
                f"Verify request failed with status {response.status_code}: {response.text}"
            )

        # Handle JSON response
        result = response.json()
        message = result.get("choices", [{}])[0].get("message", {})
        content = message.get("content", {})

        # Extract claims from the structured response
        claims = content.get("claims", [])

        return VerifyResult(
            claims=claims,
            raw=result,
            usage=result.get("usage"),
        )


def create_client(
    *,
    api_base_url: Optional[str] = None,
    api_key: str,
    client: Optional[httpx.AsyncClient] = None,
    timeout: Optional[float] = 10.0,
) -> Client:
    """Configure and return a Client.

    Args:
        api_base_url: Base URL for the API (e.g. https://app.superagent.sh/api)
        api_key: API key used to authenticate requests
        client: Optional custom httpx.AsyncClient instance
        timeout: Optional timeout in seconds for requests
    """

    return Client(
        api_base_url=api_base_url or "https://app.superagent.sh/api",
        api_key=api_key,
        client=client,
        timeout=timeout,
    )
