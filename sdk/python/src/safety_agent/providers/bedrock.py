"""
AWS Bedrock provider configuration using the Converse API
"""

import hashlib
import hmac
from datetime import datetime, timezone
from typing import Any
from urllib.parse import urlparse

from ..types import ChatMessage, AnalysisResponse, TokenUsage, AnalysisResponseChoice
from ..schemas import ResponseFormat


def _get_signature_key(key: str, date_stamp: str, region: str, service: str) -> bytes:
    """Generate AWS signature key."""
    k_date = hmac.new(
        f"AWS4{key}".encode("utf-8"), date_stamp.encode("utf-8"), hashlib.sha256
    ).digest()
    k_region = hmac.new(k_date, region.encode("utf-8"), hashlib.sha256).digest()
    k_service = hmac.new(k_region, service.encode("utf-8"), hashlib.sha256).digest()
    k_signing = hmac.new(k_service, b"aws4_request", hashlib.sha256).digest()
    return k_signing


class BedrockProvider:
    """AWS Bedrock provider configuration using the Converse API."""

    base_url = "https://bedrock-runtime.{region}.amazonaws.com/model/{model}/converse"
    env_var = "AWS_BEDROCK_API_KEY"

    def auth_header(self, api_key: str) -> dict[str, str]:
        # AWS auth is handled in the request signing
        return {
            "Content-Type": "application/json",
        }

    def build_url(self, base_url: str, model: str) -> str:
        import os
        region = os.environ.get("AWS_BEDROCK_REGION", "us-east-1")
        return base_url.format(region=region, model=model)

    def get_signed_headers(
        self, url: str, method: str, payload: str, api_key: str
    ) -> dict[str, str]:
        """Generate AWS Signature V4 signed headers."""
        import os

        # Parse API key format: access_key_id:secret_access_key[:session_token]
        parts = api_key.split(":")
        access_key = parts[0] if len(parts) > 0 else ""
        secret_key = parts[1] if len(parts) > 1 else ""
        session_token = parts[2] if len(parts) > 2 else None

        region = os.environ.get("AWS_BEDROCK_REGION", "us-east-1")
        service = "bedrock"

        # Current time
        t = datetime.now(timezone.utc)
        amz_date = t.strftime("%Y%m%dT%H%M%SZ")
        date_stamp = t.strftime("%Y%m%d")

        # Parse URL
        parsed = urlparse(url)
        host = parsed.netloc
        canonical_uri = parsed.path or "/"

        # Create canonical request
        canonical_querystring = ""
        payload_hash = hashlib.sha256(payload.encode("utf-8")).hexdigest()

        headers_to_sign = {
            "host": host,
            "x-amz-date": amz_date,
        }
        if session_token:
            headers_to_sign["x-amz-security-token"] = session_token

        signed_headers = ";".join(sorted(headers_to_sign.keys()))
        canonical_headers = "".join(
            f"{k}:{v}\n" for k, v in sorted(headers_to_sign.items())
        )

        canonical_request = "\n".join([
            method,
            canonical_uri,
            canonical_querystring,
            canonical_headers,
            signed_headers,
            payload_hash,
        ])

        # Create string to sign
        algorithm = "AWS4-HMAC-SHA256"
        credential_scope = f"{date_stamp}/{region}/{service}/aws4_request"
        string_to_sign = "\n".join([
            algorithm,
            amz_date,
            credential_scope,
            hashlib.sha256(canonical_request.encode("utf-8")).hexdigest(),
        ])

        # Create signature
        signing_key = _get_signature_key(secret_key, date_stamp, region, service)
        signature = hmac.new(
            signing_key, string_to_sign.encode("utf-8"), hashlib.sha256
        ).hexdigest()

        # Create authorization header
        authorization = (
            f"{algorithm} Credential={access_key}/{credential_scope}, "
            f"SignedHeaders={signed_headers}, Signature={signature}"
        )

        result_headers = {
            "Authorization": authorization,
            "x-amz-date": amz_date,
            "x-amz-content-sha256": payload_hash,
            "Content-Type": "application/json",
        }
        if session_token:
            result_headers["x-amz-security-token"] = session_token

        return result_headers

    def transform_request(
        self,
        model: str,
        messages: list[ChatMessage],
        response_format: ResponseFormat | None = None,
    ) -> dict[str, Any]:
        # Separate system message from others
        system_content = []
        bedrock_messages = []

        for msg in messages:
            if msg.role == "system":
                content = msg.content if isinstance(msg.content, str) else ""
                system_content.append({"text": content})
            else:
                content = msg.content if isinstance(msg.content, str) else ""
                bedrock_messages.append({
                    "role": msg.role,
                    "content": [{"text": content}],
                })

        request: dict[str, Any] = {
            "messages": bedrock_messages,
            "inferenceConfig": {
                "maxTokens": 4096,
            },
        }

        if system_content:
            request["system"] = system_content

        # Add tool config for structured output if provided
        if response_format and response_format.get("type") == "json_schema":
            json_schema = response_format.get("json_schema", {})
            request["toolConfig"] = {
                "tools": [{
                    "toolSpec": {
                        "name": json_schema.get("name", "output"),
                        "description": "Output format",
                        "inputSchema": {
                            "json": json_schema.get("schema", {}),
                        },
                    }
                }],
                "toolChoice": {
                    "tool": {
                        "name": json_schema.get("name", "output"),
                    }
                },
            }

        return request

    def transform_response(self, response: dict[str, Any]) -> AnalysisResponse:
        content = ""
        output = response.get("output", {})
        message = output.get("message", {})

        for block in message.get("content", []):
            if "text" in block:
                content += block["text"]
            elif "toolUse" in block:
                # For structured output via tool use
                import json
                content = json.dumps(block["toolUse"].get("input", {}))

        usage = response.get("usage", {})
        return AnalysisResponse(
            id="",
            usage=TokenUsage(
                prompt_tokens=usage.get("inputTokens", 0),
                completion_tokens=usage.get("outputTokens", 0),
                total_tokens=usage.get("inputTokens", 0) + usage.get("outputTokens", 0),
            ),
            choices=[
                AnalysisResponseChoice(
                    index=0,
                    message=ChatMessage(role="assistant", content=content),
                    finish_reason=response.get("stopReason", "stop"),
                )
            ],
        )


bedrock_provider = BedrockProvider()
