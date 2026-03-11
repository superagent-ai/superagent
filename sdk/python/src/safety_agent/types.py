"""
Type definitions for the Safety Agent SDK
"""

from dataclasses import dataclass, field
from typing import Literal, Union, TypedDict


# =============================================================================
# Client Configuration
# =============================================================================


@dataclass
class ClientConfig:
    """Configuration for creating a safety agent client."""

    api_key: str | None = None
    """API key for Superagent usage tracking. Defaults to SUPERAGENT_API_KEY env var."""

    enable_fallback: bool | None = None
    """Enable fallback to always-on endpoint on cold start timeout. Default: True for superagent provider."""

    fallback_timeout: float | None = None
    """Timeout in seconds before falling back to always-on endpoint. Default: 5.0."""

    fallback_url: str | None = None
    """Custom fallback URL. If not provided, uses SUPERAGENT_FALLBACK_URL env var or built-in default."""


# =============================================================================
# Model Types
# =============================================================================

OpenAIModel = Literal[
    "openai/codex-mini-latest",
    "openai/gpt-3.5-turbo",
    "openai/gpt-4",
    "openai/gpt-4-turbo",
    "openai/gpt-4.1",
    "openai/gpt-4.1-mini",
    "openai/gpt-4.1-nano",
    "openai/gpt-4o",
    "openai/gpt-4o-2024-05-13",
    "openai/gpt-4o-2024-08-06",
    "openai/gpt-4o-2024-11-20",
    "openai/gpt-4o-mini",
    "openai/gpt-5",
    "openai/gpt-5-chat-latest",
    "openai/gpt-5-codex",
    "openai/gpt-5-mini",
    "openai/gpt-5-nano",
    "openai/gpt-5-pro",
    "openai/gpt-5.1",
    "openai/gpt-5.1-chat-latest",
    "openai/gpt-5.1-codex",
    "openai/gpt-5.1-codex-max",
    "openai/gpt-5.1-codex-mini",
    "openai/gpt-5.2",
    "openai/gpt-5.2-chat-latest",
    "openai/gpt-5.2-codex",
    "openai/gpt-5.2-pro",
    "openai/gpt-5.3-codex",
    "openai/gpt-5.3-codex-spark",
    "openai/gpt-5.4",
    "openai/gpt-5.4-pro",
    "openai/o1",
    "openai/o1-mini",
    "openai/o1-preview",
    "openai/o1-pro",
    "openai/o3",
    "openai/o3-deep-research",
    "openai/o3-mini",
    "openai/o3-pro",
    "openai/o4-mini",
    "openai/o4-mini-deep-research",
]

AnthropicModel = Literal[
    "anthropic/claude-3-haiku-20240307",
    "anthropic/claude-3-5-haiku-20241022",
    "anthropic/claude-3-5-haiku-latest",
    "anthropic/claude-haiku-4-5-20251001",
    "anthropic/claude-haiku-4-5",
    "anthropic/claude-3-opus-20240229",
    "anthropic/claude-opus-4-20250514",
    "anthropic/claude-opus-4-0",
    "anthropic/claude-opus-4-1-20250805",
    "anthropic/claude-opus-4-1",
    "anthropic/claude-opus-4-5-20251101",
    "anthropic/claude-opus-4-5",
    "anthropic/claude-opus-4-6",
    "anthropic/claude-3-sonnet-20240229",
    "anthropic/claude-3-5-sonnet-20240620",
    "anthropic/claude-3-5-sonnet-20241022",
    "anthropic/claude-3-7-sonnet-20250219",
    "anthropic/claude-3-7-sonnet-latest",
    "anthropic/claude-sonnet-4-20250514",
    "anthropic/claude-sonnet-4-0",
    "anthropic/claude-sonnet-4-5-20250929",
    "anthropic/claude-sonnet-4-5",
    "anthropic/claude-sonnet-4-6",
]

GoogleModel = Literal[
    "google/gemini-1.5-flash",
    "google/gemini-1.5-flash-8b",
    "google/gemini-1.5-pro",
    "google/gemini-2.0-flash",
    "google/gemini-2.0-flash-lite",
    "google/gemini-2.5-flash",
    "google/gemini-2.5-flash-lite",
    "google/gemini-2.5-flash-lite-preview-06-17",
    "google/gemini-2.5-flash-lite-preview-09-2025",
    "google/gemini-2.5-flash-preview-04-17",
    "google/gemini-2.5-flash-preview-05-20",
    "google/gemini-2.5-flash-preview-09-2025",
    "google/gemini-2.5-pro",
    "google/gemini-2.5-pro-preview-05-06",
    "google/gemini-2.5-pro-preview-06-05",
    "google/gemini-3-flash-preview",
    "google/gemini-3-pro-preview",
    "google/gemini-3.1-flash-lite-preview",
    "google/gemini-3.1-pro-preview",
    "google/gemini-flash-latest",
    "google/gemini-flash-lite-latest",
]

BedrockModel = Literal[
    "bedrock/us.anthropic.claude-opus-4-6-v1",
    "bedrock/us.anthropic.claude-opus-4-5-20251101-v1:0",
    "bedrock/us.anthropic.claude-opus-4-1-20250805-v1:0",
    "bedrock/us.anthropic.claude-opus-4-20250514-v1:0",
    "bedrock/us.anthropic.claude-sonnet-4-6",
    "bedrock/us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    "bedrock/us.anthropic.claude-sonnet-4-20250514-v1:0",
    "bedrock/us.anthropic.claude-haiku-4-5-20251001-v1:0",
    "bedrock/us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    "bedrock/us.anthropic.claude-3-5-sonnet-20241022-v2:0",
    "bedrock/us.anthropic.claude-3-5-haiku-20241022-v1:0",
    "bedrock/us.anthropic.claude-3-sonnet-20240229-v1:0",
    "bedrock/us.anthropic.claude-3-haiku-20240307-v1:0",
    "bedrock/us.anthropic.claude-3-opus-20240229-v1:0",
    "bedrock/eu.anthropic.claude-opus-4-6-v1",
    "bedrock/eu.anthropic.claude-opus-4-5-20251101-v1:0",
    "bedrock/eu.anthropic.claude-sonnet-4-6",
    "bedrock/eu.anthropic.claude-sonnet-4-5-20250929-v1:0",
    "bedrock/eu.anthropic.claude-sonnet-4-20250514-v1:0",
    "bedrock/eu.anthropic.claude-haiku-4-5-20251001-v1:0",
    "bedrock/global.anthropic.claude-opus-4-6-v1",
    "bedrock/global.anthropic.claude-opus-4-5-20251101-v1:0",
    "bedrock/global.anthropic.claude-sonnet-4-6",
    "bedrock/global.anthropic.claude-sonnet-4-5-20250929-v1:0",
    "bedrock/global.anthropic.claude-sonnet-4-20250514-v1:0",
    "bedrock/global.anthropic.claude-haiku-4-5-20251001-v1:0",
    "bedrock/anthropic.claude-opus-4-6-v1",
    "bedrock/anthropic.claude-opus-4-5-20251101-v1:0",
    "bedrock/anthropic.claude-opus-4-1-20250805-v1:0",
    "bedrock/anthropic.claude-opus-4-20250514-v1:0",
    "bedrock/anthropic.claude-sonnet-4-6",
    "bedrock/anthropic.claude-sonnet-4-5-20250929-v1:0",
    "bedrock/anthropic.claude-sonnet-4-20250514-v1:0",
    "bedrock/anthropic.claude-haiku-4-5-20251001-v1:0",
    "bedrock/anthropic.claude-3-7-sonnet-20250219-v1:0",
    "bedrock/anthropic.claude-3-5-sonnet-20241022-v2:0",
    "bedrock/anthropic.claude-3-5-sonnet-20240620-v1:0",
    "bedrock/anthropic.claude-3-5-haiku-20241022-v1:0",
    "bedrock/anthropic.claude-3-sonnet-20240229-v1:0",
    "bedrock/anthropic.claude-3-haiku-20240307-v1:0",
    "bedrock/anthropic.claude-3-opus-20240229-v1:0",
    "bedrock/anthropic.claude-v2:1",
    "bedrock/anthropic.claude-v2",
    "bedrock/anthropic.claude-instant-v1",
    "bedrock/us.meta.llama3-3-70b-instruct-v1:0",
    "bedrock/us.meta.llama3-2-90b-instruct-v1:0",
    "bedrock/us.meta.llama3-2-11b-instruct-v1:0",
    "bedrock/us.meta.llama3-2-3b-instruct-v1:0",
    "bedrock/us.meta.llama3-2-1b-instruct-v1:0",
    "bedrock/us.meta.llama3-1-405b-instruct-v1:0",
    "bedrock/us.meta.llama3-1-70b-instruct-v1:0",
    "bedrock/us.meta.llama3-1-8b-instruct-v1:0",
    "bedrock/meta.llama4-maverick-17b-instruct-v1:0",
    "bedrock/meta.llama4-scout-17b-instruct-v1:0",
    "bedrock/meta.llama3-3-70b-instruct-v1:0",
    "bedrock/meta.llama3-2-90b-instruct-v1:0",
    "bedrock/meta.llama3-2-11b-instruct-v1:0",
    "bedrock/meta.llama3-2-3b-instruct-v1:0",
    "bedrock/meta.llama3-2-1b-instruct-v1:0",
    "bedrock/meta.llama3-1-405b-instruct-v1:0",
    "bedrock/meta.llama3-1-70b-instruct-v1:0",
    "bedrock/meta.llama3-1-8b-instruct-v1:0",
    "bedrock/meta.llama3-70b-instruct-v1:0",
    "bedrock/meta.llama3-8b-instruct-v1:0",
    "bedrock/meta.llama2-70b-chat-v1",
    "bedrock/meta.llama2-13b-chat-v1",
    "bedrock/us.amazon.nova-pro-v1:0",
    "bedrock/us.amazon.nova-lite-v1:0",
    "bedrock/us.amazon.nova-micro-v1:0",
    "bedrock/amazon.nova-premier-v1:0",
    "bedrock/amazon.nova-pro-v1:0",
    "bedrock/amazon.nova-lite-v1:0",
    "bedrock/amazon.nova-micro-v1:0",
    "bedrock/amazon.nova-2-lite-v1:0",
    "bedrock/amazon.titan-text-premier-v1:0",
    "bedrock/amazon.titan-text-express-v1",
    "bedrock/amazon.titan-text-express-v1:0:8k",
    "bedrock/amazon.titan-text-lite-v1",
    "bedrock/deepseek.r1-v1:0",
    "bedrock/deepseek.v3-v1:0",
    "bedrock/deepseek.v3.2-v1:0",
    "bedrock/google.gemma-3-27b-it",
    "bedrock/google.gemma-3-12b-it",
    "bedrock/google.gemma-3-4b-it",
    "bedrock/us.mistral.mistral-large-3-675b-instruct",
    "bedrock/mistral.devstral-2-123b",
    "bedrock/mistral.mistral-large-2407-v1:0",
    "bedrock/mistral.mistral-large-2402-v1:0",
    "bedrock/mistral.mistral-small-2402-v1:0",
    "bedrock/mistral.ministral-3-14b-instruct",
    "bedrock/mistral.ministral-3-8b-instruct",
    "bedrock/mistral.mixtral-8x7b-instruct-v0:1",
    "bedrock/mistral.mistral-7b-instruct-v0:2",
    "bedrock/mistral.voxtral-small-24b-2507",
    "bedrock/mistral.voxtral-mini-3b-2507",
    "bedrock/minimax.minimax-m2",
    "bedrock/minimax.minimax-m2.1",
    "bedrock/moonshot.kimi-k2-thinking",
    "bedrock/moonshotai.kimi-k2.5",
    "bedrock/nvidia.nemotron-nano-12b-v2",
    "bedrock/nvidia.nemotron-nano-9b-v2",
    "bedrock/openai.gpt-oss-120b-1:0",
    "bedrock/openai.gpt-oss-20b-1:0",
    "bedrock/openai.gpt-oss-safeguard-120b",
    "bedrock/openai.gpt-oss-safeguard-20b",
    "bedrock/qwen.qwen3-coder-480b-a35b-v1:0",
    "bedrock/qwen.qwen3-coder-30b-a3b-v1:0",
    "bedrock/qwen.qwen3-235b-a22b-2507-v1:0",
    "bedrock/qwen.qwen3-32b-v1:0",
    "bedrock/qwen.qwen3-next-80b-a3b",
    "bedrock/qwen.qwen3-vl-235b-a22b",
    "bedrock/writer.palmyra-x4-v1:0",
    "bedrock/writer.palmyra-x5-v1:0",
    "bedrock/zai.glm-4.7",
    "bedrock/zai.glm-4.7-flash",
    "bedrock/cohere.command-r-plus-v1:0",
    "bedrock/cohere.command-r-v1:0",
    "bedrock/cohere.command-text-v14",
    "bedrock/cohere.command-light-text-v14",
    "bedrock/ai21.jamba-1-5-large-v1:0",
    "bedrock/ai21.jamba-1-5-mini-v1:0",
    "bedrock/ai21.jamba-instruct-v1:0",
    "bedrock/ai21.j2-ultra-v1",
    "bedrock/ai21.j2-mid-v1",
]

GroqModel = Literal[
    "groq/compound",
    "groq/compound-mini",
    "groq/llama-3.1-8b-instant",
    "groq/llama-3.3-70b-versatile",
    "groq/llama-guard-3-8b",
    "groq/meta-llama/llama-4-maverick-17b-128e-instruct",
    "groq/meta-llama/llama-4-scout-17b-16e-instruct",
    "groq/meta-llama/llama-guard-4-12b",
    "groq/meta-llama/llama-prompt-guard-2-22m",
    "groq/meta-llama/llama-prompt-guard-2-86m",
    "groq/deepseek-r1-distill-llama-70b",
    "groq/gemma2-9b-it",
    "groq/mistral-saba-24b",
    "groq/moonshotai/kimi-k2-instruct",
    "groq/moonshotai/kimi-k2-instruct-0905",
    "groq/openai/gpt-oss-120b",
    "groq/openai/gpt-oss-20b",
    "groq/openai/gpt-oss-safeguard-20b",
    "groq/qwen/qwen3-32b",
    "groq/qwen-qwq-32b",
]

FireworksModel = Literal[
    "fireworks/accounts/fireworks/models/gpt-oss-20b",
    "fireworks/accounts/fireworks/models/gpt-oss-120b",
    "fireworks/accounts/fireworks/models/gpt-oss-safeguard-20b",
    "fireworks/accounts/fireworks/models/gpt-oss-safeguard-120b",
    "fireworks/accounts/fireworks/models/llama-v3p3-70b-instruct",
    "fireworks/accounts/fireworks/models/llama-v3p1-405b-instruct",
    "fireworks/accounts/fireworks/models/llama-v3p1-70b-instruct",
    "fireworks/accounts/fireworks/models/llama-v3p1-8b-instruct",
    "fireworks/accounts/fireworks/models/llama-v3p2-3b-instruct",
    "fireworks/accounts/fireworks/models/llama-v3p2-1b-instruct",
    "fireworks/accounts/fireworks/models/llama-v3-70b-instruct",
    "fireworks/accounts/fireworks/models/llama-v3-8b-instruct",
    "fireworks/accounts/fireworks/models/llama-guard-3-8b",
    "fireworks/accounts/fireworks/models/llama-guard-3-1b",
    "fireworks/accounts/fireworks/models/deepseek-v3",
    "fireworks/accounts/fireworks/models/deepseek-v3-0324",
    "fireworks/accounts/fireworks/models/deepseek-v3p1",
    "fireworks/accounts/fireworks/models/deepseek-v3p1-terminus",
    "fireworks/accounts/fireworks/models/deepseek-v3p2",
    "fireworks/accounts/fireworks/models/deepseek-r1",
    "fireworks/accounts/fireworks/models/deepseek-r1-0528",
    "fireworks/accounts/fireworks/models/deepseek-r1-basic",
    "fireworks/accounts/fireworks/models/deepseek-r1-distill-llama-70b",
    "fireworks/accounts/fireworks/models/deepseek-r1-distill-llama-8b",
    "fireworks/accounts/fireworks/models/deepseek-r1-distill-qwen-32b",
    "fireworks/accounts/fireworks/models/deepseek-r1-distill-qwen-14b",
    "fireworks/accounts/fireworks/models/deepseek-r1-distill-qwen-7b",
    "fireworks/accounts/fireworks/models/deepseek-r1-distill-qwen-1p5b",
    "fireworks/accounts/fireworks/models/deepseek-coder-v2-instruct",
    "fireworks/accounts/fireworks/models/deepseek-coder-v2-lite-instruct",
    "fireworks/accounts/fireworks/models/deepseek-prover-v2",
    "fireworks/accounts/fireworks/models/qwen2p5-72b-instruct",
    "fireworks/accounts/fireworks/models/qwen2p5-32b-instruct",
    "fireworks/accounts/fireworks/models/qwen2p5-14b-instruct",
    "fireworks/accounts/fireworks/models/qwen2p5-7b-instruct",
    "fireworks/accounts/fireworks/models/qwen2p5-coder-32b-instruct",
    "fireworks/accounts/fireworks/models/qwen2p5-coder-32b-instruct-128k",
    "fireworks/accounts/fireworks/models/qwen2-72b-instruct",
    "fireworks/accounts/fireworks/models/qwen3-235b-a22b",
    "fireworks/accounts/fireworks/models/qwen3-235b-a22b-instruct-2507",
    "fireworks/accounts/fireworks/models/qwen3-30b-a3b",
    "fireworks/accounts/fireworks/models/qwen3-32b",
    "fireworks/accounts/fireworks/models/qwen3-8b",
    "fireworks/accounts/fireworks/models/qwen3-4b",
    "fireworks/accounts/fireworks/models/qwen3-coder-480b-a35b-instruct",
    "fireworks/accounts/fireworks/models/qwen3-coder-30b-a3b-instruct",
    "fireworks/accounts/fireworks/models/qwq-32b",
    "fireworks/accounts/fireworks/models/mixtral-8x22b-instruct",
    "fireworks/accounts/fireworks/models/mixtral-8x7b-instruct",
    "fireworks/accounts/fireworks/models/mistral-7b-instruct-v0p2",
    "fireworks/accounts/fireworks/models/mistral-7b-instruct-v3",
    "fireworks/accounts/fireworks/models/mistral-nemo-instruct-2407",
    "fireworks/accounts/fireworks/models/mistral-small-24b-instruct-2501",
    "fireworks/accounts/fireworks/models/devstral-small-2505",
    "fireworks/accounts/fireworks/models/gemma2-9b-it",
    "fireworks/accounts/fireworks/models/gemma-3-27b-it",
    "fireworks/accounts/fireworks/models/kimi-k2-instruct",
    "fireworks/accounts/fireworks/models/kimi-k2-instruct-0905",
    "fireworks/accounts/fireworks/models/kimi-k2-thinking",
    "fireworks/accounts/fireworks/models/kimi-k2p5",
    "fireworks/accounts/fireworks/models/glm-4p5",
    "fireworks/accounts/fireworks/models/glm-4p5-air",
    "fireworks/accounts/fireworks/models/glm-4p6",
    "fireworks/accounts/fireworks/models/glm-4p7",
    "fireworks/accounts/fireworks/models/glm-5",
    "fireworks/accounts/fireworks/models/minimax-m2p1",
    "fireworks/accounts/fireworks/models/minimax-m2p5",
    "fireworks/accounts/fireworks/models/firefunction-v2",
    "fireworks/accounts/fireworks/models/llama-3p1-nemotron-70b",
    "fireworks/accounts/fireworks/models/cogito-v1-preview-llama-70b",
    "fireworks/accounts/fireworks/models/phi-3-mini-128k-instruct",
    "fireworks/accounts/fireworks/models/yi-large",
]

VercelModel = Literal[
    "vercel/alibaba/qwen-3-14b",
    "vercel/alibaba/qwen-3-30b",
    "vercel/alibaba/qwen-3-32b",
    "vercel/alibaba/qwen-3-235b",
    "vercel/alibaba/qwen3-coder",
    "vercel/alibaba/qwen3-coder-30b-a3b",
    "vercel/alibaba/qwen3-coder-next",
    "vercel/alibaba/qwen3-coder-plus",
    "vercel/alibaba/qwen3-max",
    "vercel/alibaba/qwen3-max-preview",
    "vercel/alibaba/qwen3-max-thinking",
    "vercel/alibaba/qwen3-next-80b-a3b-instruct",
    "vercel/alibaba/qwen3-next-80b-a3b-thinking",
    "vercel/alibaba/qwen3-vl-instruct",
    "vercel/alibaba/qwen3-vl-thinking",
    "vercel/alibaba/qwen3.5-flash",
    "vercel/alibaba/qwen3.5-plus",
    "vercel/amazon/nova-2-lite",
    "vercel/amazon/nova-pro",
    "vercel/amazon/nova-lite",
    "vercel/amazon/nova-micro",
    "vercel/anthropic/claude-3-haiku",
    "vercel/anthropic/claude-3-opus",
    "vercel/anthropic/claude-3.5-haiku",
    "vercel/anthropic/claude-3.5-sonnet",
    "vercel/anthropic/claude-3.5-sonnet-20240620",
    "vercel/anthropic/claude-3.7-sonnet",
    "vercel/anthropic/claude-haiku-4.5",
    "vercel/anthropic/claude-opus-4",
    "vercel/anthropic/claude-opus-4.1",
    "vercel/anthropic/claude-opus-4.5",
    "vercel/anthropic/claude-opus-4.6",
    "vercel/anthropic/claude-sonnet-4",
    "vercel/anthropic/claude-sonnet-4.5",
    "vercel/anthropic/claude-sonnet-4.6",
    "vercel/bytedance/seed-1.6",
    "vercel/bytedance/seed-1.8",
    "vercel/cohere/command-a",
    "vercel/deepseek/deepseek-r1",
    "vercel/deepseek/deepseek-v3",
    "vercel/deepseek/deepseek-v3.1",
    "vercel/deepseek/deepseek-v3.1-terminus",
    "vercel/deepseek/deepseek-v3.2",
    "vercel/deepseek/deepseek-v3.2-exp",
    "vercel/deepseek/deepseek-v3.2-thinking",
    "vercel/google/gemini-2.0-flash",
    "vercel/google/gemini-2.0-flash-lite",
    "vercel/google/gemini-2.5-flash",
    "vercel/google/gemini-2.5-flash-lite",
    "vercel/google/gemini-2.5-flash-lite-preview-09-2025",
    "vercel/google/gemini-2.5-flash-preview-09-2025",
    "vercel/google/gemini-2.5-pro",
    "vercel/google/gemini-3-flash",
    "vercel/google/gemini-3-pro-preview",
    "vercel/google/gemini-3.1-flash-lite-preview",
    "vercel/google/gemini-3.1-pro-preview",
    "vercel/meituan/longcat-flash-chat",
    "vercel/meituan/longcat-flash-thinking",
    "vercel/meta/llama-3.1-8b",
    "vercel/meta/llama-3.1-70b",
    "vercel/meta/llama-3.2-1b",
    "vercel/meta/llama-3.2-3b",
    "vercel/meta/llama-3.2-11b",
    "vercel/meta/llama-3.2-90b",
    "vercel/meta/llama-3.3-70b",
    "vercel/meta/llama-4-maverick",
    "vercel/meta/llama-4-scout",
    "vercel/minimax/minimax-m2",
    "vercel/minimax/minimax-m2.1",
    "vercel/minimax/minimax-m2.1-lightning",
    "vercel/minimax/minimax-m2.5",
    "vercel/mistral/codestral",
    "vercel/mistral/devstral-2",
    "vercel/mistral/devstral-small",
    "vercel/mistral/devstral-small-2",
    "vercel/mistral/magistral-medium",
    "vercel/mistral/magistral-small",
    "vercel/mistral/ministral-3b",
    "vercel/mistral/ministral-8b",
    "vercel/mistral/ministral-14b",
    "vercel/mistral/mistral-large-3",
    "vercel/mistral/mistral-medium",
    "vercel/mistral/mistral-nemo",
    "vercel/mistral/mistral-small",
    "vercel/mistral/mixtral-8x22b-instruct",
    "vercel/mistral/pixtral-12b",
    "vercel/mistral/pixtral-large",
    "vercel/moonshotai/kimi-k2",
    "vercel/moonshotai/kimi-k2-0905",
    "vercel/moonshotai/kimi-k2-thinking",
    "vercel/moonshotai/kimi-k2-thinking-turbo",
    "vercel/moonshotai/kimi-k2-turbo",
    "vercel/moonshotai/kimi-k2.5",
    "vercel/morph/morph-v3-fast",
    "vercel/morph/morph-v3-large",
    "vercel/nvidia/nemotron-3-nano-30b-a3b",
    "vercel/nvidia/nemotron-nano-9b-v2",
    "vercel/nvidia/nemotron-nano-12b-v2-vl",
    "vercel/openai/codex-mini",
    "vercel/openai/gpt-3.5-turbo",
    "vercel/openai/gpt-4-turbo",
    "vercel/openai/gpt-4.1",
    "vercel/openai/gpt-4.1-mini",
    "vercel/openai/gpt-4.1-nano",
    "vercel/openai/gpt-4o",
    "vercel/openai/gpt-4o-mini",
    "vercel/openai/gpt-5",
    "vercel/openai/gpt-5-codex",
    "vercel/openai/gpt-5-mini",
    "vercel/openai/gpt-5-nano",
    "vercel/openai/gpt-5-pro",
    "vercel/openai/gpt-5.1",
    "vercel/openai/gpt-5.1-codex",
    "vercel/openai/gpt-5.1-codex-max",
    "vercel/openai/gpt-5.1-codex-mini",
    "vercel/openai/gpt-5.1-instant",
    "vercel/openai/gpt-5.1-thinking",
    "vercel/openai/gpt-5.2",
    "vercel/openai/gpt-5.2-chat",
    "vercel/openai/gpt-5.2-codex",
    "vercel/openai/gpt-5.2-pro",
    "vercel/openai/gpt-5.3-chat",
    "vercel/openai/gpt-5.3-codex",
    "vercel/openai/gpt-5.4",
    "vercel/openai/gpt-5.4-pro",
    "vercel/openai/gpt-5-chat",
    "vercel/openai/gpt-oss-120b",
    "vercel/openai/gpt-oss-20b",
    "vercel/openai/gpt-oss-safeguard-20b",
    "vercel/openai/o1",
    "vercel/openai/o3",
    "vercel/openai/o3-deep-research",
    "vercel/openai/o3-mini",
    "vercel/openai/o3-pro",
    "vercel/openai/o4-mini",
    "vercel/perplexity/sonar",
    "vercel/perplexity/sonar-pro",
    "vercel/perplexity/sonar-reasoning",
    "vercel/perplexity/sonar-reasoning-pro",
    "vercel/vercel/v0-1.0-md",
    "vercel/vercel/v0-1.5-md",
    "vercel/xiaomi/mimo-v2-flash",
    "vercel/xai/grok-2-vision",
    "vercel/xai/grok-3",
    "vercel/xai/grok-3-fast",
    "vercel/xai/grok-3-mini",
    "vercel/xai/grok-3-mini-fast",
    "vercel/xai/grok-4",
    "vercel/xai/grok-4-fast-non-reasoning",
    "vercel/xai/grok-4-fast-reasoning",
    "vercel/xai/grok-4.1-fast-non-reasoning",
    "vercel/xai/grok-4.1-fast-reasoning",
    "vercel/xai/grok-code-fast-1",
    "vercel/zai/glm-4.5",
    "vercel/zai/glm-4.5-air",
    "vercel/zai/glm-4.5v",
    "vercel/zai/glm-4.6",
    "vercel/zai/glm-4.6v",
    "vercel/zai/glm-4.7",
    "vercel/zai/glm-5",
]

OpenRouterModel = Literal[
    "openrouter/ai21/jamba-large-1.7",
    "openrouter/ai21/jamba-mini-1.7",
    "openrouter/aion-labs/aion-1.0",
    "openrouter/aion-labs/aion-1.0-mini",
    "openrouter/aion-labs/aion-rp-llama-3.1-8b",
    "openrouter/alfredpros/codellama-7b-instruct-solidity",
    "openrouter/alibaba/tongyi-deepresearch-30b-a3b",
    "openrouter/allenai/olmo-2-0325-32b-instruct",
    "openrouter/allenai/olmo-3-7b-instruct",
    "openrouter/allenai/olmo-3-7b-think",
    "openrouter/alpindale/goliath-120b",
    "openrouter/amazon/nova-2-lite-v1",
    "openrouter/amazon/nova-lite-v1",
    "openrouter/amazon/nova-micro-v1",
    "openrouter/amazon/nova-premier-v1",
    "openrouter/amazon/nova-pro-v1",
    "openrouter/anthracite-org/magnum-v4-72b",
    "openrouter/anthropic/claude-3-haiku",
    "openrouter/anthropic/claude-3-opus",
    "openrouter/anthropic/claude-3.5-haiku",
    "openrouter/anthropic/claude-3.5-haiku-20241022",
    "openrouter/anthropic/claude-3.5-sonnet",
    "openrouter/anthropic/claude-3.7-sonnet",
    "openrouter/anthropic/claude-3.7-sonnet:thinking",
    "openrouter/anthropic/claude-haiku-4.5",
    "openrouter/anthropic/claude-opus-4",
    "openrouter/anthropic/claude-opus-4.1",
    "openrouter/anthropic/claude-opus-4.5",
    "openrouter/anthropic/claude-opus-4.6",
    "openrouter/anthropic/claude-sonnet-4",
    "openrouter/anthropic/claude-sonnet-4.5",
    "openrouter/anthropic/claude-sonnet-4.6",
    "openrouter/arcee-ai/coder-large",
    "openrouter/arcee-ai/maestro-reasoning",
    "openrouter/arcee-ai/spotlight",
    "openrouter/arcee-ai/trinity-large-preview",
    "openrouter/arcee-ai/trinity-mini",
    "openrouter/arcee-ai/virtuoso-large",
    "openrouter/arliai/qwq-32b-arliai-rpr-v1",
    "openrouter/baidu/ernie-4.5-21b-a3b",
    "openrouter/baidu/ernie-4.5-21b-a3b-thinking",
    "openrouter/baidu/ernie-4.5-300b-a47b",
    "openrouter/baidu/ernie-4.5-vl-28b-a3b",
    "openrouter/baidu/ernie-4.5-vl-424b-a47b",
    "openrouter/bytedance/ui-tars-1.5-7b",
    "openrouter/bytedance-seed/seedream-4.5",
    "openrouter/cognitivecomputations/dolphin3.0-mistral-24b",
    "openrouter/cognitivecomputations/dolphin3.0-r1-mistral-24b",
    "openrouter/cohere/command-a",
    "openrouter/cohere/command-r-08-2024",
    "openrouter/cohere/command-r-plus-08-2024",
    "openrouter/cohere/command-r7b-12-2024",
    "openrouter/deepcogito/cogito-v2-preview-deepseek-671b",
    "openrouter/deepcogito/cogito-v2-preview-llama-109b-moe",
    "openrouter/deepcogito/cogito-v2-preview-llama-405b",
    "openrouter/deepcogito/cogito-v2-preview-llama-70b",
    "openrouter/deepcogito/cogito-v2.1-671b",
    "openrouter/deepseek/deepseek-chat",
    "openrouter/deepseek/deepseek-chat-v3-0324",
    "openrouter/deepseek/deepseek-chat-v3.1",
    "openrouter/deepseek/deepseek-prover-v2",
    "openrouter/deepseek/deepseek-r1",
    "openrouter/deepseek/deepseek-r1-0528",
    "openrouter/deepseek/deepseek-r1-0528-qwen3-8b",
    "openrouter/deepseek/deepseek-r1-distill-llama-70b",
    "openrouter/deepseek/deepseek-r1-distill-qwen-14b",
    "openrouter/deepseek/deepseek-r1-distill-qwen-32b",
    "openrouter/deepseek/deepseek-v3.1-terminus",
    "openrouter/deepseek/deepseek-v3.1-terminus:exacto",
    "openrouter/deepseek/deepseek-v3.2",
    "openrouter/deepseek/deepseek-v3.2-exp",
    "openrouter/deepseek/deepseek-v3.2-speciale",
    "openrouter/eleutherai/llemma_7b",
    "openrouter/featherless/qwerky-72b",
    "openrouter/google/gemini-2.0-flash-001",
    "openrouter/google/gemini-2.0-flash-lite-001",
    "openrouter/google/gemini-2.5-flash",
    "openrouter/google/gemini-2.5-flash-image",
    "openrouter/google/gemini-2.5-flash-image-preview",
    "openrouter/google/gemini-2.5-flash-lite",
    "openrouter/google/gemini-2.5-flash-lite-preview-09-2025",
    "openrouter/google/gemini-2.5-flash-preview-09-2025",
    "openrouter/google/gemini-2.5-pro",
    "openrouter/google/gemini-2.5-pro-preview",
    "openrouter/google/gemini-2.5-pro-preview-05-06",
    "openrouter/google/gemini-2.5-pro-preview-06-05",
    "openrouter/google/gemini-3-flash-preview",
    "openrouter/google/gemini-3-pro-image-preview",
    "openrouter/google/gemini-3-pro-preview",
    "openrouter/google/gemini-3.1-pro-preview",
    "openrouter/google/gemini-3.1-pro-preview-customtools",
    "openrouter/google/gemma-2-27b-it",
    "openrouter/google/gemma-2-9b-it",
    "openrouter/google/gemma-3-12b-it",
    "openrouter/google/gemma-3-27b-it",
    "openrouter/google/gemma-3-4b-it",
    "openrouter/google/gemma-3n-e4b-it",
    "openrouter/gryphe/mythomax-l2-13b",
    "openrouter/ibm-granite/granite-4.0-h-micro",
    "openrouter/inception/mercury",
    "openrouter/inception/mercury-2",
    "openrouter/inception/mercury-coder",
    "openrouter/inflection/inflection-3-pi",
    "openrouter/inflection/inflection-3-productivity",
    "openrouter/kwaipilot/kat-coder-pro",
    "openrouter/liquid/lfm-2.2-6b",
    "openrouter/liquid/lfm2-8b-a1b",
    "openrouter/mancer/weaver",
    "openrouter/meituan/longcat-flash-chat",
    "openrouter/meta-llama/llama-3-70b-instruct",
    "openrouter/meta-llama/llama-3-8b-instruct",
    "openrouter/meta-llama/llama-3.1-405b",
    "openrouter/meta-llama/llama-3.1-405b-instruct",
    "openrouter/meta-llama/llama-3.1-70b-instruct",
    "openrouter/meta-llama/llama-3.1-8b-instruct",
    "openrouter/meta-llama/llama-3.2-11b-vision-instruct",
    "openrouter/meta-llama/llama-3.2-1b-instruct",
    "openrouter/meta-llama/llama-3.2-3b-instruct",
    "openrouter/meta-llama/llama-3.2-90b-vision-instruct",
    "openrouter/meta-llama/llama-3.3-70b-instruct",
    "openrouter/meta-llama/llama-4-maverick",
    "openrouter/meta-llama/llama-4-scout",
    "openrouter/meta-llama/llama-guard-2-8b",
    "openrouter/meta-llama/llama-guard-3-8b",
    "openrouter/meta-llama/llama-guard-4-12b",
    "openrouter/microsoft/mai-ds-r1",
    "openrouter/microsoft/phi-3-medium-128k-instruct",
    "openrouter/microsoft/phi-3-mini-128k-instruct",
    "openrouter/microsoft/phi-3.5-mini-128k-instruct",
    "openrouter/microsoft/phi-4",
    "openrouter/microsoft/phi-4-multimodal-instruct",
    "openrouter/microsoft/phi-4-reasoning-plus",
    "openrouter/microsoft/wizardlm-2-8x22b",
    "openrouter/minimax/minimax-01",
    "openrouter/minimax/minimax-m1",
    "openrouter/minimax/minimax-m2",
    "openrouter/minimax/minimax-m2.1",
    "openrouter/minimax/minimax-m2.5",
    "openrouter/mistralai/codestral-2508",
    "openrouter/mistralai/devstral-2512",
    "openrouter/mistralai/devstral-medium",
    "openrouter/mistralai/devstral-medium-2507",
    "openrouter/mistralai/devstral-small",
    "openrouter/mistralai/devstral-small-2505",
    "openrouter/mistralai/devstral-small-2507",
    "openrouter/mistralai/magistral-medium-2506:thinking",
    "openrouter/mistralai/ministral-14b-2512",
    "openrouter/mistralai/ministral-3b",
    "openrouter/mistralai/ministral-3b-2512",
    "openrouter/mistralai/ministral-8b",
    "openrouter/mistralai/ministral-8b-2512",
    "openrouter/mistralai/mistral-7b-instruct",
    "openrouter/mistralai/mistral-7b-instruct-v0.1",
    "openrouter/mistralai/mistral-7b-instruct-v0.2",
    "openrouter/mistralai/mistral-7b-instruct-v0.3",
    "openrouter/mistralai/mistral-large",
    "openrouter/mistralai/mistral-large-2407",
    "openrouter/mistralai/mistral-large-2411",
    "openrouter/mistralai/mistral-large-2512",
    "openrouter/mistralai/mistral-medium-3",
    "openrouter/mistralai/mistral-medium-3.1",
    "openrouter/mistralai/mistral-nemo",
    "openrouter/mistralai/mistral-saba",
    "openrouter/mistralai/mistral-small-24b-instruct-2501",
    "openrouter/mistralai/mistral-small-3.1-24b-instruct",
    "openrouter/mistralai/mistral-small-3.2-24b-instruct",
    "openrouter/mistralai/mistral-tiny",
    "openrouter/mistralai/mixtral-8x22b-instruct",
    "openrouter/mistralai/mixtral-8x7b-instruct",
    "openrouter/mistralai/pixtral-12b",
    "openrouter/mistralai/pixtral-large-2411",
    "openrouter/mistralai/voxtral-small-24b-2507",
    "openrouter/moonshotai/kimi-dev-72b",
    "openrouter/moonshotai/kimi-k2",
    "openrouter/moonshotai/kimi-k2-0905",
    "openrouter/moonshotai/kimi-k2-0905:exacto",
    "openrouter/moonshotai/kimi-k2-thinking",
    "openrouter/moonshotai/kimi-k2.5",
    "openrouter/moonshotai/kimi-linear-48b-a3b-instruct",
    "openrouter/morph/morph-v3-fast",
    "openrouter/morph/morph-v3-large",
    "openrouter/neversleep/llama-3.1-lumimaid-8b",
    "openrouter/neversleep/noromaid-20b",
    "openrouter/nousresearch/deephermes-3-llama-3-8b-preview",
    "openrouter/nousresearch/deephermes-3-mistral-24b-preview",
    "openrouter/nousresearch/hermes-2-pro-llama-3-8b",
    "openrouter/nousresearch/hermes-3-llama-3.1-405b",
    "openrouter/nousresearch/hermes-3-llama-3.1-70b",
    "openrouter/nousresearch/hermes-4-405b",
    "openrouter/nousresearch/hermes-4-70b",
    "openrouter/nvidia/llama-3.1-nemotron-70b-instruct",
    "openrouter/nvidia/llama-3.1-nemotron-ultra-253b-v1",
    "openrouter/nvidia/llama-3.3-nemotron-super-49b-v1.5",
    "openrouter/nvidia/nemotron-3-nano-30b-a3b",
    "openrouter/nvidia/nemotron-nano-12b-v2-vl",
    "openrouter/nvidia/nemotron-nano-9b-v2",
    "openrouter/openai/chatgpt-4o-latest",
    "openrouter/openai/codex-mini",
    "openrouter/openai/gpt-3.5-turbo",
    "openrouter/openai/gpt-3.5-turbo-0613",
    "openrouter/openai/gpt-3.5-turbo-16k",
    "openrouter/openai/gpt-3.5-turbo-instruct",
    "openrouter/openai/gpt-4",
    "openrouter/openai/gpt-4-0314",
    "openrouter/openai/gpt-4-1106-preview",
    "openrouter/openai/gpt-4-turbo",
    "openrouter/openai/gpt-4-turbo-preview",
    "openrouter/openai/gpt-4.1",
    "openrouter/openai/gpt-4.1-mini",
    "openrouter/openai/gpt-4.1-nano",
    "openrouter/openai/gpt-4o",
    "openrouter/openai/gpt-4o-2024-05-13",
    "openrouter/openai/gpt-4o-2024-08-06",
    "openrouter/openai/gpt-4o-2024-11-20",
    "openrouter/openai/gpt-4o-audio-preview",
    "openrouter/openai/gpt-4o-mini",
    "openrouter/openai/gpt-4o-mini-2024-07-18",
    "openrouter/openai/gpt-4o-mini-search-preview",
    "openrouter/openai/gpt-4o-search-preview",
    "openrouter/openai/gpt-4o:extended",
    "openrouter/openai/gpt-5",
    "openrouter/openai/gpt-5-chat",
    "openrouter/openai/gpt-5-codex",
    "openrouter/openai/gpt-5-image",
    "openrouter/openai/gpt-5-image-mini",
    "openrouter/openai/gpt-5-mini",
    "openrouter/openai/gpt-5-nano",
    "openrouter/openai/gpt-5-pro",
    "openrouter/openai/gpt-5.1",
    "openrouter/openai/gpt-5.1-chat",
    "openrouter/openai/gpt-5.1-codex",
    "openrouter/openai/gpt-5.1-codex-max",
    "openrouter/openai/gpt-5.1-codex-mini",
    "openrouter/openai/gpt-5.2",
    "openrouter/openai/gpt-5.2-chat",
    "openrouter/openai/gpt-5.2-codex",
    "openrouter/openai/gpt-5.2-pro",
    "openrouter/openai/gpt-5.3-codex",
    "openrouter/openai/gpt-5.4",
    "openrouter/openai/gpt-5.4-pro",
    "openrouter/openai/gpt-oss-120b",
    "openrouter/openai/gpt-oss-120b:exacto",
    "openrouter/openai/gpt-oss-20b",
    "openrouter/openai/gpt-oss-safeguard-20b",
    "openrouter/openai/o1",
    "openrouter/openai/o1-pro",
    "openrouter/openai/o3",
    "openrouter/openai/o3-deep-research",
    "openrouter/openai/o3-mini",
    "openrouter/openai/o3-mini-high",
    "openrouter/openai/o3-pro",
    "openrouter/openai/o4-mini",
    "openrouter/openai/o4-mini-deep-research",
    "openrouter/openai/o4-mini-high",
    "openrouter/opengvlab/internvl3-78b",
    "openrouter/openrouter/auto",
    "openrouter/openrouter/aurora-alpha",
    "openrouter/openrouter/bodybuilder",
    "openrouter/openrouter/free",
    "openrouter/openrouter/sherlock-dash-alpha",
    "openrouter/openrouter/sherlock-think-alpha",
    "openrouter/perplexity/sonar",
    "openrouter/perplexity/sonar-deep-research",
    "openrouter/perplexity/sonar-pro",
    "openrouter/perplexity/sonar-pro-search",
    "openrouter/perplexity/sonar-reasoning",
    "openrouter/perplexity/sonar-reasoning-pro",
    "openrouter/prime-intellect/intellect-3",
    "openrouter/qwen/qwen-2.5-72b-instruct",
    "openrouter/qwen/qwen-2.5-7b-instruct",
    "openrouter/qwen/qwen-2.5-coder-32b-instruct",
    "openrouter/qwen/qwen-2.5-vl-7b-instruct",
    "openrouter/qwen/qwen-max",
    "openrouter/qwen/qwen-plus",
    "openrouter/qwen/qwen-plus-2025-07-28",
    "openrouter/qwen/qwen-plus-2025-07-28:thinking",
    "openrouter/qwen/qwen-turbo",
    "openrouter/qwen/qwen-vl-max",
    "openrouter/qwen/qwen-vl-plus",
    "openrouter/qwen/qwen2.5-coder-7b-instruct",
    "openrouter/qwen/qwen2.5-vl-32b-instruct",
    "openrouter/qwen/qwen2.5-vl-72b-instruct",
    "openrouter/qwen/qwen3-14b",
    "openrouter/qwen/qwen3-235b-a22b",
    "openrouter/qwen/qwen3-235b-a22b-2507",
    "openrouter/qwen/qwen3-235b-a22b-07-25",
    "openrouter/qwen/qwen3-235b-a22b-thinking-2507",
    "openrouter/qwen/qwen3-30b-a3b",
    "openrouter/qwen/qwen3-30b-a3b-instruct-2507",
    "openrouter/qwen/qwen3-30b-a3b-thinking-2507",
    "openrouter/qwen/qwen3-32b",
    "openrouter/qwen/qwen3-4b",
    "openrouter/qwen/qwen3-8b",
    "openrouter/qwen/qwen3-coder",
    "openrouter/qwen/qwen3-coder-30b-a3b-instruct",
    "openrouter/qwen/qwen3-coder-flash",
    "openrouter/qwen/qwen3-coder-plus",
    "openrouter/qwen/qwen3-coder:exacto",
    "openrouter/qwen/qwen3-max",
    "openrouter/qwen/qwen3-next-80b-a3b-instruct",
    "openrouter/qwen/qwen3-next-80b-a3b-thinking",
    "openrouter/qwen/qwen3-vl-235b-a22b-instruct",
    "openrouter/qwen/qwen3-vl-235b-a22b-thinking",
    "openrouter/qwen/qwen3-vl-30b-a3b-instruct",
    "openrouter/qwen/qwen3-vl-30b-a3b-thinking",
    "openrouter/qwen/qwen3-vl-8b-instruct",
    "openrouter/qwen/qwen3-vl-8b-thinking",
    "openrouter/qwen/qwen3.5-397b-a17b",
    "openrouter/qwen/qwen3.5-plus-02-15",
    "openrouter/qwen/qwq-32b",
    "openrouter/raifle/sorcererlm-8x22b",
    "openrouter/rekaai/reka-flash-3",
    "openrouter/relace/relace-apply-3",
    "openrouter/sao10k/l3-euryale-70b",
    "openrouter/sao10k/l3-lunaris-8b",
    "openrouter/sao10k/l3.1-70b-hanami-x1",
    "openrouter/sao10k/l3.1-euryale-70b",
    "openrouter/sao10k/l3.3-euryale-70b",
    "openrouter/sourceful/riverflow-v2-fast-preview",
    "openrouter/sourceful/riverflow-v2-max-preview",
    "openrouter/sourceful/riverflow-v2-standard-preview",
    "openrouter/stepfun-ai/step3",
    "openrouter/stepfun/step-3.5-flash",
    "openrouter/switchpoint/router",
    "openrouter/tencent/hunyuan-a13b-instruct",
    "openrouter/thedrummer/anubis-70b-v1.1",
    "openrouter/thedrummer/cydonia-24b-v4.1",
    "openrouter/thedrummer/rocinante-12b",
    "openrouter/thedrummer/skyfall-36b-v2",
    "openrouter/thedrummer/unslopnemo-12b",
    "openrouter/thudm/glm-4.1v-9b-thinking",
    "openrouter/thudm/glm-z1-32b",
    "openrouter/tngtech/deepseek-r1t-chimera",
    "openrouter/tngtech/deepseek-r1t2-chimera",
    "openrouter/tngtech/tng-r1t-chimera",
    "openrouter/undi95/remm-slerp-l2-13b",
    "openrouter/x-ai/grok-3",
    "openrouter/x-ai/grok-3-beta",
    "openrouter/x-ai/grok-3-mini",
    "openrouter/x-ai/grok-3-mini-beta",
    "openrouter/x-ai/grok-4",
    "openrouter/x-ai/grok-4-fast",
    "openrouter/x-ai/grok-4.1-fast",
    "openrouter/x-ai/grok-code-fast-1",
    "openrouter/xiaomi/mimo-v2-flash",
    "openrouter/z-ai/glm-4-32b",
    "openrouter/z-ai/glm-4.5",
    "openrouter/z-ai/glm-4.5-air",
    "openrouter/z-ai/glm-4.5v",
    "openrouter/z-ai/glm-4.6",
    "openrouter/z-ai/glm-4.6:exacto",
    "openrouter/z-ai/glm-4.7",
    "openrouter/z-ai/glm-4.7-flash",
    "openrouter/z-ai/glm-5",
]

SuperagentModel = Literal[
    "superagent/guard-0.6b",
    "superagent/guard-1.7b",
    "superagent/guard-4b",
]

SupportedModel = Union[
    OpenAIModel,
    AnthropicModel,
    GoogleModel,
    BedrockModel,
    VercelModel,
    GroqModel,
    FireworksModel,
    OpenRouterModel,
    SuperagentModel,
    str,
]


# =============================================================================
# Input Types
# =============================================================================

GuardInput = Union[str, bytes]
"""
Guard input type - supports text and binary data.
- str starting with http:// or https:// -> treated as URL
- str not starting with http(s):// -> plain text
- bytes -> binary data (analyzed based on content)
"""


# =============================================================================
# Message Types
# =============================================================================


class ImageUrl(TypedDict):
    """Image URL structure."""

    url: str


class TextContentPart(TypedDict):
    """Text content part for multimodal messages."""

    type: Literal["text"]
    text: str


class ImageContentPart(TypedDict):
    """Image content part for multimodal messages."""

    type: Literal["image_url"]
    image_url: ImageUrl


MultimodalContentPart = Union[TextContentPart, ImageContentPart]


@dataclass
class ChatMessage:
    """Chat message format for LLM requests."""

    role: Literal["system", "user", "assistant"]
    content: Union[str, list[MultimodalContentPart]]


# =============================================================================
# Processed Input
# =============================================================================


@dataclass
class ProcessedInput:
    """Processed input result from input processor."""

    type: Literal["text", "image", "document", "pdf"]
    """The type of input that was detected."""

    text: str | None = None
    """Text content (for text and document types)."""

    image_base64: str | None = None
    """Base64 encoded image data (for image type)."""

    mime_type: str | None = None
    """MIME type of the content."""

    pages: list[str] | None = None
    """Array of text per page (for PDF type)."""


# =============================================================================
# Guard Types
# =============================================================================


@dataclass
class GuardOptions:
    """Options for the guard method."""

    input: GuardInput
    """The input to analyze - text, URL, or bytes."""

    model: SupportedModel | None = None
    """Model in 'provider/model' format. Defaults to superagent/guard-1.7b."""

    fallback_model: SupportedModel | None = None
    """Fallback model to use when the primary model returns a retryable error (429/500/502/503)."""

    system_prompt: str | None = None
    """Optional custom system prompt that replaces the default guard prompt."""

    chunk_size: int = 8000
    """Characters per chunk. Default: 8000. Set to 0 to disable chunking."""


@dataclass
class GuardClassificationResult:
    """Result from guard classification."""

    classification: Literal["pass", "block"]
    """Whether the content passed or should be blocked."""

    reasoning: str = ""
    """Brief explanation of why the content was classified as pass or block."""

    violation_types: list[str] = field(default_factory=list)
    """Types of violations detected."""

    cwe_codes: list[str] = field(default_factory=list)
    """CWE codes associated with violations."""


# =============================================================================
# Redact Types
# =============================================================================


@dataclass
class RedactOptions:
    """Options for the redact method."""

    input: str
    """The input text to redact."""

    model: SupportedModel
    """Model in 'provider/model' format, e.g. 'openai/gpt-4o'."""

    fallback_model: SupportedModel | None = None
    """Fallback model to use when the primary model returns a retryable error (429/500/502/503)."""

    entities: list[str] | None = None
    """Optional list of entity types to redact (overrides default entities)."""

    rewrite: bool = False
    """When true, rewrites text contextually instead of using placeholders."""


@dataclass
class RedactResult:
    """Result from redact operation."""

    redacted: str
    """The redacted/sanitized text."""

    findings: list[str] = field(default_factory=list)
    """List of findings that were redacted."""


# =============================================================================
# Token Usage
# =============================================================================


@dataclass
class TokenUsage:
    """Token usage information."""

    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


# =============================================================================
# Response Types
# =============================================================================


@dataclass
class GuardResponse:
    """Response from guard method including token usage."""

    classification: Literal["pass", "block"]
    """Whether the content passed or should be blocked."""

    reasoning: str
    """Brief explanation of why the content was classified as pass or block."""

    violation_types: list[str]
    """Types of violations detected."""

    cwe_codes: list[str]
    """CWE codes associated with violations."""

    usage: TokenUsage
    """Token usage information."""


@dataclass
class RedactResponse:
    """Response from redact method including token usage."""

    redacted: str
    """The redacted/sanitized text."""

    findings: list[str]
    """List of findings that were redacted."""

    usage: TokenUsage
    """Token usage information."""


# =============================================================================
# Provider Response Types
# =============================================================================


@dataclass
class AnalysisResponseChoice:
    """A single choice in the analysis response."""

    index: int
    message: ChatMessage
    finish_reason: str | None = None


@dataclass
class AnalysisResponse:
    """Unified response format from LLM providers."""

    id: str
    usage: TokenUsage
    choices: list[AnalysisResponseChoice]


# =============================================================================
# Parsed Model
# =============================================================================


@dataclass
class ParsedModel:
    """Parsed model identifier."""

    provider: str
    model: str


# =============================================================================
# Scan Types (AI Agent Security Scanning)
# =============================================================================

@dataclass
class ScanOptions:
    """Options for the scan method."""

    repo: str
    """Git repository URL to scan."""

    branch: str | None = None
    """Optional branch, tag, or commit to checkout."""

    model: str = "anthropic/claude-sonnet-4-5"
    """Model for OpenCode to use (provider/model format)."""

    fallback_model: str | None = None
    """Fallback model to use when the primary model returns a retryable error (429/500/502/503)."""


@dataclass
class ScanUsage:
    """Token usage metrics from OpenCode scan."""

    input_tokens: int
    """Total input tokens used."""

    output_tokens: int
    """Total output tokens used."""

    reasoning_tokens: int
    """Total reasoning tokens used (if applicable)."""

    cost: float
    """Total cost in USD."""


@dataclass
class ScanResponse:
    """Response from scan method."""

    result: str
    """The security report text from OpenCode."""

    usage: ScanUsage
    """Token usage metrics."""
