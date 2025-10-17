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


class GuardMessage(TypedDict, total=False):
    role: str
    content: str
    reasoning_content: str
    reasoning: str  # New field from updated API


class GuardChoice(TypedDict):
    message: GuardMessage


class AnalysisResponse(TypedDict, total=False):
    usage: GuardUsage
    id: str
    choices: list[GuardChoice]


class GuardDecision(TypedDict, total=False):
    status: Literal["pass", "block"]
    violation_types: list[str]
    cwe_codes: list[str]

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


BlockCallback = Callable[[str], Union[Awaitable[None], None]]
PassCallback = Callable[[], Union[Awaitable[None], None]]


def _sanitize_url(url: str) -> str:
    return url[:-1] if url.endswith("/") else url


def _parse_decision(content: Optional[str]) -> Optional[GuardDecision]:
    if not content:
        return None
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
        self._timeout = timeout
        self._client = client or httpx.AsyncClient(timeout=timeout)
        self._owns_client = client is None

    async def __aenter__(self) -> "Client":
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        await self.aclose()

    async def aclose(self) -> None:
        if self._owns_client:
            await self._client.aclose()

    async def guard(
        self,
        command: str,
        *,
        on_block: Optional[BlockCallback] = None,
        on_pass: Optional[PassCallback] = None,
    ) -> GuardResult:
        if not command:
            raise GuardError("command must be a non-empty string")

        try:
            response = await self._client.post(
                self._guard_endpoint,
                json={"text": command},
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

        analysis: AnalysisResponse = response.json()
        message = (analysis.get("choices") or [{}])[0].get("message", {})
        content = message.get("content")
        reasoning = message.get("reasoning_content")
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
        text: str,
        *,
        url_whitelist: Optional[list[str]] = None,
        entities: Optional[list[str]] = None,
        file: Optional[Any] = None,
        format: Optional[str] = None
    ) -> RedactResult:
        if not text:
            raise GuardError("text must be a non-empty string")

        try:
            # Use multipart/form-data when file is provided
            if file is not None:
                # Build multipart form data
                files = {"file": file}
                data = {"text": text}

                if format:
                    data["format"] = format

                if entities:
                    import json
                    data["entities"] = json.dumps(entities)

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
                # Use JSON when no file is provided
                request_body: dict[str, Any] = {"text": text}

                # Include entities in request body if provided
                if entities:
                    request_body["entities"] = entities

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

        # Apply URL whitelist locally if provided
        if url_whitelist:
            content = self._apply_url_whitelist(text, content, url_whitelist)

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
