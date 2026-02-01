"""
OpenAI-compatible provider configuration (Chat Completions API)
"""

import os
from typing import Any

from ..types import ChatMessage, AnalysisResponse, TokenUsage, AnalysisResponseChoice
from ..schemas import ResponseFormat


class OpenAICompatibleProvider:
    """OpenAI-compatible provider configuration using Chat Completions API."""

    base_url = os.environ.get("OPENAI_COMPATIBLE_BASE_URL", "")
    env_var = "OPENAI_COMPATIBLE_API_KEY"

    def auth_header(self, api_key: str) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

    def build_url(self, base_url: str, model: str) -> str:
        if not base_url:
            raise ValueError(
                "Missing OPENAI_COMPATIBLE_BASE_URL environment variable for openai-compatible provider"
            )
        trimmed = base_url.rstrip("/")
        if trimmed.endswith("/chat/completions"):
            return trimmed
        return f"{trimmed}/chat/completions"

    def transform_request(
        self,
        model: str,
        messages: list[ChatMessage],
        response_format: ResponseFormat | None = None,
    ) -> dict[str, Any]:
        request: dict[str, Any] = {
            "model": model,
            "messages": [
                {
                    "role": msg.role,
                    "content": msg.content if isinstance(msg.content, str) else msg.content,
                }
                for msg in messages
            ],
        }

        if response_format:
            request["response_format"] = response_format

        return request

    def transform_response(self, response: dict[str, Any]) -> AnalysisResponse:
        choices = response.get("choices", [])
        content = ""
        if choices:
            message = choices[0].get("message", {})
            content = message.get("content", "")

        usage = response.get("usage", {})
        return AnalysisResponse(
            id=response.get("id", ""),
            usage=TokenUsage(
                prompt_tokens=usage.get("prompt_tokens", 0),
                completion_tokens=usage.get("completion_tokens", 0),
                total_tokens=usage.get("total_tokens", 0),
            ),
            choices=[
                AnalysisResponseChoice(
                    index=0,
                    message=ChatMessage(role="assistant", content=content),
                    finish_reason=choices[0].get("finish_reason", "stop")
                    if choices
                    else "stop",
                )
            ],
        )


openai_compatible_provider = OpenAICompatibleProvider()
