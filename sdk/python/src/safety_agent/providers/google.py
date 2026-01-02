"""
Google (Gemini) provider configuration
"""

from typing import Any

from ..types import ChatMessage, AnalysisResponse, TokenUsage, AnalysisResponseChoice
from ..schemas import ResponseFormat


def _to_google_content(
    content: str | list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Convert multimodal content parts to Google format."""
    if isinstance(content, str):
        return [{"text": content}]

    result = []
    for part in content:
        if part.get("type") == "text":
            result.append({"text": part["text"]})
        elif part.get("type") == "image_url":
            # Extract base64 data from data URL
            url = part["image_url"]["url"]
            if url.startswith("data:"):
                # Parse data URL: data:image/png;base64,xxxxx
                parts = url.split(",", 1)
                if len(parts) == 2:
                    mime_type = parts[0].split(":")[1].split(";")[0]
                    data = parts[1]
                    result.append({
                        "inlineData": {
                            "mimeType": mime_type,
                            "data": data,
                        }
                    })
    return result


class GoogleProvider:
    """Google (Gemini) provider configuration."""

    base_url = "https://generativelanguage.googleapis.com/v1beta/models"
    env_var = "GOOGLE_API_KEY"

    def auth_header(self, api_key: str) -> dict[str, str]:
        return {
            "Content-Type": "application/json",
        }

    def build_url(self, base_url: str, model: str) -> str:
        import os
        api_key = os.environ.get(self.env_var, "")
        return f"{base_url}/{model}:generateContent?key={api_key}"

    def transform_request(
        self,
        model: str,
        messages: list[ChatMessage],
        response_format: ResponseFormat | None = None,
    ) -> dict[str, Any]:
        # Separate system message from others
        system_parts = []
        contents = []

        for msg in messages:
            if msg.role == "system":
                system_parts.append({"text": msg.content if isinstance(msg.content, str) else ""})
            else:
                role = "model" if msg.role == "assistant" else "user"
                contents.append({
                    "role": role,
                    "parts": _to_google_content(msg.content),
                })

        request: dict[str, Any] = {
            "contents": contents,
        }

        if system_parts:
            request["systemInstruction"] = {"parts": system_parts}

        # Add structured output format if provided
        if response_format and response_format.get("type") == "json_schema":
            json_schema = response_format.get("json_schema", {})
            request["generationConfig"] = {
                "responseMimeType": "application/json",
                "responseSchema": json_schema.get("schema"),
            }

        return request

    def transform_response(self, response: dict[str, Any]) -> AnalysisResponse:
        content = ""
        candidates = response.get("candidates", [])
        if candidates:
            candidate = candidates[0]
            candidate_content = candidate.get("content", {})
            for part in candidate_content.get("parts", []):
                if "text" in part:
                    content += part["text"]

        usage = response.get("usageMetadata", {})
        prompt_tokens = usage.get("promptTokenCount", 0)
        completion_tokens = usage.get("candidatesTokenCount", 0)

        return AnalysisResponse(
            id=response.get("modelVersion", ""),
            usage=TokenUsage(
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=usage.get("totalTokenCount", prompt_tokens + completion_tokens),
            ),
            choices=[
                AnalysisResponseChoice(
                    index=0,
                    message=ChatMessage(role="assistant", content=content),
                    finish_reason=candidates[0].get("finishReason", "stop") if candidates else "stop",
                )
            ],
        )


google_provider = GoogleProvider()
