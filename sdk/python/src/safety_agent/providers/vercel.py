"""
Vercel AI Gateway provider configuration (OpenAI-compatible API)
"""

from typing import Any

from ..types import ChatMessage, AnalysisResponse, TokenUsage, AnalysisResponseChoice
from ..schemas import ResponseFormat


class VercelProvider:
    """Vercel AI Gateway provider configuration using OpenAI-compatible API."""

    base_url = "https://gateway.ai.cloudflare.com/v1"
    env_var = "AI_GATEWAY_API_KEY"

    def auth_header(self, api_key: str) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

    def build_url(self, base_url: str, model: str) -> str:
        # Vercel AI Gateway uses format: vercel/{provider}/{model}
        # We need to route to the appropriate provider endpoint
        parts = model.split("/", 1)
        if len(parts) > 1:
            provider = parts[0]
            return f"https://api.vercel.ai/v1/chat/completions"
        return "https://api.vercel.ai/v1/chat/completions"

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

        # Add structured output format if provided
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
                    finish_reason=choices[0].get("finish_reason", "stop") if choices else "stop",
                )
            ],
        )


vercel_provider = VercelProvider()
