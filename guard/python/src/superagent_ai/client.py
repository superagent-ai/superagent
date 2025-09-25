from __future__ import annotations

import inspect
import json
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


class GuardClient:
    def __init__(
        self,
        api_base_url: str,
        api_key: str,
        *,
        client: Optional[httpx.AsyncClient] = None,
        timeout: Optional[float] = 10.0,
    ) -> None:
        if not api_base_url:
            api_base_url = "https://app.superagent.sh/api/guard"
        if not api_key:
            raise GuardError("api_key must be provided")

        self._api_key = api_key
        self._endpoint = _sanitize_url(api_base_url)
        self._timeout = timeout
        self._client = client or httpx.AsyncClient(timeout=timeout)
        self._owns_client = client is None

    async def __aenter__(self) -> "GuardClient":
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        await self.aclose()

    async def aclose(self) -> None:
        if self._owns_client:
            await self._client.aclose()

    async def __call__(
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
                self._endpoint,
                json={"prompt": command},
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


def create_guard(
    *,
    api_base_url: Optional[str] = None,
    api_key: str,
    client: Optional[httpx.AsyncClient] = None,
    timeout: Optional[float] = 10.0,
) -> GuardClient:
    """Configure and return a Guard client."""

    return GuardClient(
        api_base_url=api_base_url or "https://app.superagent.sh/api/guard",
        api_key=api_key,
        client=client,
        timeout=timeout,
    )
