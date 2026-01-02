"""
OpenAI provider configuration using the Responses API
"""

from typing import Any

from ..types import ChatMessage, AnalysisResponse, TokenUsage, AnalysisResponseChoice
from ..schemas import ResponseFormat


def _to_openai_content(
    content: str | list[dict[str, Any]],
) -> str | list[dict[str, Any]]:
    """Convert multimodal content parts to OpenAI format."""
    if isinstance(content, str):
        return content

    result = []
    for part in content:
        if part.get("type") == "text":
            result.append({"type": "input_text", "text": part["text"]})
        elif part.get("type") == "image_url":
            result.append({
                "type": "input_image",
                "image_url": part["image_url"]["url"],
            })
    return result


class OpenAIProvider:
    """OpenAI provider configuration using the Responses API."""

    base_url = "https://api.openai.com/v1/responses"
    env_var = "OPENAI_API_KEY"

    def auth_header(self, api_key: str) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {api_key}",
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
        request: dict[str, Any] = {
            "model": model,
            "input": [
                {
                    "role": msg.role,
                    "content": _to_openai_content(msg.content),
                }
                for msg in messages
            ],
        }

        # Add structured output format if provided
        if response_format and response_format.get("type") == "json_schema":
            json_schema = response_format.get("json_schema", {})
            request["text"] = {
                "format": {
                    "type": "json_schema",
                    "name": json_schema.get("name"),
                    "strict": json_schema.get("strict"),
                    "schema": json_schema.get("schema"),
                }
            }

        return request

    def transform_response(self, response: dict[str, Any]) -> AnalysisResponse:
        # Extract text content from the Responses API output
        content = ""
        for output in response.get("output", []):
            if output.get("type") == "message" and output.get("content"):
                for item in output["content"]:
                    if item.get("type") == "output_text" and item.get("text"):
                        content += item["text"]

        usage = response.get("usage", {})
        return AnalysisResponse(
            id=response.get("id", ""),
            usage=TokenUsage(
                prompt_tokens=usage.get("input_tokens", 0),
                completion_tokens=usage.get("output_tokens", 0),
                total_tokens=usage.get("total_tokens", 0),
            ),
            choices=[
                AnalysisResponseChoice(
                    index=0,
                    message=ChatMessage(role="assistant", content=content),
                    finish_reason="stop",
                )
            ],
        )


openai_provider = OpenAIProvider()
