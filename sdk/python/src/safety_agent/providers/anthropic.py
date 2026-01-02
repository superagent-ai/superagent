"""
Anthropic provider configuration
"""

from typing import Any

from ..types import ChatMessage, AnalysisResponse, TokenUsage, AnalysisResponseChoice
from ..schemas import ResponseFormat


def _to_anthropic_content(
    content: str | list[dict[str, Any]],
) -> str | list[dict[str, Any]]:
    """Convert multimodal content parts to Anthropic format."""
    if isinstance(content, str):
        return content

    result = []
    for part in content:
        if part.get("type") == "text":
            result.append({"type": "text", "text": part["text"]})
        elif part.get("type") == "image_url":
            # Extract base64 data from data URL
            url = part["image_url"]["url"]
            if url.startswith("data:"):
                # Parse data URL: data:image/png;base64,xxxxx
                parts = url.split(",", 1)
                if len(parts) == 2:
                    media_type = parts[0].split(":")[1].split(";")[0]
                    data = parts[1]
                    result.append({
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": data,
                        },
                    })
    return result


class AnthropicProvider:
    """Anthropic provider configuration."""

    base_url = "https://api.anthropic.com/v1/messages"
    env_var = "ANTHROPIC_API_KEY"

    def auth_header(self, api_key: str) -> dict[str, str]:
        return {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        }

    def build_url(self, base_url: str, model: str) -> str:
        return base_url

    def transform_request(
        self,
        model: str,
        messages: list[ChatMessage],
        response_format: ResponseFormat | None = None,
    ) -> dict[str, Any]:
        # Separate system message from others
        system_content = None
        non_system_messages = []

        for msg in messages:
            if msg.role == "system":
                system_content = msg.content if isinstance(msg.content, str) else ""
            else:
                non_system_messages.append({
                    "role": msg.role,
                    "content": _to_anthropic_content(msg.content),
                })

        request: dict[str, Any] = {
            "model": model,
            "max_tokens": 4096,
            "messages": non_system_messages,
        }

        if system_content:
            request["system"] = system_content

        # Add structured output format if provided (for supported models)
        if response_format and response_format.get("type") == "json_schema":
            json_schema = response_format.get("json_schema", {})
            request["output_format"] = {
                "type": "json_schema",
                "schema": json_schema.get("schema"),
            }

        return request

    def transform_response(self, response: dict[str, Any]) -> AnalysisResponse:
        content = ""
        for block in response.get("content", []):
            if block.get("type") == "text":
                content += block.get("text", "")

        usage = response.get("usage", {})
        return AnalysisResponse(
            id=response.get("id", ""),
            usage=TokenUsage(
                prompt_tokens=usage.get("input_tokens", 0),
                completion_tokens=usage.get("output_tokens", 0),
                total_tokens=usage.get("input_tokens", 0) + usage.get("output_tokens", 0),
            ),
            choices=[
                AnalysisResponseChoice(
                    index=0,
                    message=ChatMessage(role="assistant", content=content),
                    finish_reason=response.get("stop_reason", "stop"),
                )
            ],
        )


anthropic_provider = AnthropicProvider()
