"""
Superagent provider configuration (Ollama-style API)
"""

import json
import os
import re
from typing import Any

from ..types import ChatMessage, AnalysisResponse, TokenUsage, AnalysisResponseChoice
from ..schemas import ResponseFormat

# Model-specific endpoints
MODEL_ENDPOINTS = {
    "guard-0.6b": "https://superagent-guard-tiny-408394858807.us-central1.run.app/api/chat",
    "guard-1.7b": "https://superagent-guard-small-408394858807.us-central1.run.app/api/chat",
    "guard-4b": "https://superagent-guard-medium-408394858807.us-central1.run.app/api/chat",
}

# Default fallback URL for cold start mitigation.
# This always-on endpoint handles requests when the primary endpoint has a cold start.
DEFAULT_FALLBACK_URL = "https://superagent.sh/api/fallback"

# Default timeout in seconds before falling back to the always-on endpoint.
DEFAULT_FALLBACK_TIMEOUT = 5.0


def get_fallback_url(client_option: str | None = None) -> str:
    """
    Get the fallback URL based on priority:
    1. Client option (highest priority)
    2. Environment variable SUPERAGENT_FALLBACK_URL
    3. Default constant (lowest priority)
    """
    return client_option or os.environ.get("SUPERAGENT_FALLBACK_URL") or DEFAULT_FALLBACK_URL


class SuperagentProvider:
    """Superagent provider configuration using Ollama-style API."""

    base_url = "https://api.superagent.sh/api/chat"
    env_var = ""  # No API key required for Superagent guard endpoint

    def auth_header(self, api_key: str) -> dict[str, str]:
        return {
            "Content-Type": "application/json",
        }

    def build_url(self, base_url: str, model: str) -> str:
        """Map each model to its specific endpoint."""
        return MODEL_ENDPOINTS.get(model, base_url)

    def transform_request(
        self,
        model: str,
        messages: list[ChatMessage],
        response_format: ResponseFormat | None = None,
    ) -> dict[str, Any]:
        # Convert model format: "guard-0.6b" -> "superagent-guard-0.6b-Q8_0"
        model_name = f"superagent-{model}-Q8_0"

        return {
            "model": model_name,
            "messages": [
                {
                    "role": msg.role,
                    "content": msg.content if isinstance(msg.content, str) else json.dumps(msg.content),
                }
                for msg in messages
            ],
            "stream": False,
            "temperature": 0.6,
            "top_p": 0.95,
            "top_k": 20,
        }

    def transform_response(self, response: dict[str, Any]) -> AnalysisResponse:
        message = response.get("message", {})
        content = message.get("content", "")

        # Strip <think>...</think> tags if present (model outputs reasoning before answer)
        content = re.sub(r"<think>[\s\S]*?</think>", "", content).strip()

        # Try to parse JSON from the content
        parsed_content: dict[str, Any] = {}
        try:
            parsed_content = json.loads(content.strip())
        except json.JSONDecodeError:
            # Try to extract JSON object from the content
            json_match = re.search(r"\{[\s\S]*\}", content)
            if json_match:
                parsed_content = json.loads(json_match.group(0).strip())
            else:
                # Try to extract from markdown code blocks
                code_block_match = re.search(r"```(?:json)?\s*([\s\S]*?)```", content)
                if code_block_match:
                    parsed_content = json.loads(code_block_match.group(1).strip())
                else:
                    raise ValueError(f"Failed to parse response: {content}")

        # Check if this looks like a redact response (superagent model doesn't support redaction)
        if "redacted" in parsed_content or "findings" in parsed_content:
            raise ValueError(
                f"Superagent model does not support redaction. "
                f"The model is trained for guard/classification only. Response: {content}"
            )

        # Ensure classification is valid
        classification = parsed_content.get("classification")
        if classification not in ("pass", "block"):
            raise ValueError(f"Invalid classification: {classification}. Response: {content}")

        # Map Ollama token counts to standard format
        prompt_tokens = response.get("prompt_eval_count", 0)
        completion_tokens = response.get("eval_count", 0)

        return AnalysisResponse(
            id=response.get("created_at", ""),
            usage=TokenUsage(
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=prompt_tokens + completion_tokens,
            ),
            choices=[
                AnalysisResponseChoice(
                    index=0,
                    message=ChatMessage(
                        role=message.get("role", "assistant"),
                        content=json.dumps(parsed_content),
                    ),
                    finish_reason=response.get("done_reason", "stop"),
                )
            ],
        )


superagent_provider = SuperagentProvider()
