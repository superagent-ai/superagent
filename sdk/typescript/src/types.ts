/**
 * Configuration for creating a safety agent client
 */
export interface ClientConfig {
  /** API key for Superagent usage tracking. Defaults to SUPERAGENT_API_KEY env var */
  apiKey?: string;
}

/**
 * OpenAI model identifiers
 */
type OpenAIModel =
  | "openai/codex-mini-latest"
  | "openai/gpt-3.5-turbo"
  | "openai/gpt-4"
  | "openai/gpt-4-turbo"
  | "openai/gpt-4.1"
  | "openai/gpt-4.1-mini"
  | "openai/gpt-4.1-nano"
  | "openai/gpt-4o"
  | "openai/gpt-4o-2024-05-13"
  | "openai/gpt-4o-2024-08-06"
  | "openai/gpt-4o-2024-11-20"
  | "openai/gpt-4o-mini"
  | "openai/gpt-5"
  | "openai/gpt-5-chat-latest"
  | "openai/gpt-5-mini"
  | "openai/gpt-5-nano"
  | "openai/gpt-5-pro"
  | "openai/gpt-5-codex"
  | "openai/gpt-5.1"
  | "openai/gpt-5.1-chat-latest"
  | "openai/gpt-5.1-codex"
  | "openai/gpt-5.1-codex-mini"
  | "openai/o1"
  | "openai/o1-mini"
  | "openai/o1-preview"
  | "openai/o1-pro"
  | "openai/o3"
  | "openai/o3-deep-research"
  | "openai/o3-mini"
  | "openai/o3-pro"
  | "openai/o4-mini"
  | "openai/o4-mini-deep-research";

/**
 * Anthropic model identifiers
 */
type AnthropicModel =
  | "anthropic/claude-3-haiku-20240307"
  | "anthropic/claude-3-5-haiku-20241022"
  | "anthropic/claude-3-5-haiku-latest"
  | "anthropic/claude-haiku-4-5-20251001"
  | "anthropic/claude-haiku-4-5"
  | "anthropic/claude-3-opus-20240229"
  | "anthropic/claude-opus-4-20250514"
  | "anthropic/claude-opus-4-0"
  | "anthropic/claude-opus-4-1-20250805"
  | "anthropic/claude-opus-4-1"
  | "anthropic/claude-opus-4-5-20251101"
  | "anthropic/claude-opus-4-5"
  | "anthropic/claude-3-sonnet-20240229"
  | "anthropic/claude-3-5-sonnet-20240620"
  | "anthropic/claude-3-5-sonnet-20241022"
  | "anthropic/claude-3-7-sonnet-20250219"
  | "anthropic/claude-3-7-sonnet-latest"
  | "anthropic/claude-sonnet-4-20250514"
  | "anthropic/claude-sonnet-4-0"
  | "anthropic/claude-sonnet-4-5-20250929"
  | "anthropic/claude-sonnet-4-5";

/**
 * Google model identifiers
 * Only includes models that support the generateContent API endpoint
 * Excludes: embedding models, TTS models, live/streaming models, and image-specific models
 */
type GoogleModel =
  | "google/gemini-1.5-flash"
  | "google/gemini-1.5-flash-8b"
  | "google/gemini-1.5-pro"
  | "google/gemini-2.0-flash"
  | "google/gemini-2.0-flash-lite"
  | "google/gemini-2.5-flash"
  | "google/gemini-2.5-flash-lite"
  | "google/gemini-2.5-flash-lite-preview-06-17"
  | "google/gemini-2.5-flash-lite-preview-09-2025"
  | "google/gemini-2.5-flash-preview-04-17"
  | "google/gemini-2.5-flash-preview-05-20"
  | "google/gemini-2.5-flash-preview-09-2025"
  | "google/gemini-2.5-pro"
  | "google/gemini-2.5-pro-preview-05-06"
  | "google/gemini-2.5-pro-preview-06-05"
  | "google/gemini-3-pro-preview"
  | "google/gemini-flash-latest"
  | "google/gemini-flash-lite-latest";

/**
 * AWS Bedrock model identifiers
 * Uses inference profile IDs with geographic prefix (us./eu.) for cross-region inference
 * Models available through Amazon Bedrock's Converse API
 */
type BedrockModel =
  // Anthropic Claude models (cross-region inference)
  | "bedrock/us.anthropic.claude-opus-4-5-20251101-v1:0"
  | "bedrock/us.anthropic.claude-sonnet-4-20250514-v1:0"
  | "bedrock/us.anthropic.claude-haiku-4-5-20251001-v1:0"
  | "bedrock/us.anthropic.claude-3-7-sonnet-20250219-v1:0"
  | "bedrock/us.anthropic.claude-3-5-sonnet-20241022-v2:0"
  | "bedrock/us.anthropic.claude-3-5-haiku-20241022-v1:0"
  | "bedrock/us.anthropic.claude-3-sonnet-20240229-v1:0"
  | "bedrock/us.anthropic.claude-3-haiku-20240307-v1:0"
  | "bedrock/us.anthropic.claude-3-opus-20240229-v1:0"
  // Anthropic Claude models (standard)
  | "bedrock/anthropic.claude-sonnet-4-20250514-v1:0"
  | "bedrock/anthropic.claude-3-7-sonnet-20250219-v1:0"
  | "bedrock/anthropic.claude-3-5-sonnet-20241022-v2:0"
  | "bedrock/anthropic.claude-3-5-haiku-20241022-v1:0"
  | "bedrock/anthropic.claude-3-sonnet-20240229-v1:0"
  | "bedrock/anthropic.claude-3-haiku-20240307-v1:0"
  | "bedrock/anthropic.claude-3-opus-20240229-v1:0"
  | "bedrock/anthropic.claude-v2:1"
  | "bedrock/anthropic.claude-v2"
  | "bedrock/anthropic.claude-instant-v1"
  // Meta Llama models (cross-region inference)
  | "bedrock/us.meta.llama3-3-70b-instruct-v1:0"
  | "bedrock/us.meta.llama3-2-90b-instruct-v1:0"
  | "bedrock/us.meta.llama3-2-11b-instruct-v1:0"
  | "bedrock/us.meta.llama3-2-3b-instruct-v1:0"
  | "bedrock/us.meta.llama3-2-1b-instruct-v1:0"
  | "bedrock/us.meta.llama3-1-405b-instruct-v1:0"
  | "bedrock/us.meta.llama3-1-70b-instruct-v1:0"
  | "bedrock/us.meta.llama3-1-8b-instruct-v1:0"
  // Meta Llama models (standard)
  | "bedrock/meta.llama3-3-70b-instruct-v1:0"
  | "bedrock/meta.llama3-2-90b-instruct-v1:0"
  | "bedrock/meta.llama3-2-11b-instruct-v1:0"
  | "bedrock/meta.llama3-2-3b-instruct-v1:0"
  | "bedrock/meta.llama3-2-1b-instruct-v1:0"
  | "bedrock/meta.llama3-1-405b-instruct-v1:0"
  | "bedrock/meta.llama3-1-70b-instruct-v1:0"
  | "bedrock/meta.llama3-1-8b-instruct-v1:0"
  | "bedrock/meta.llama3-70b-instruct-v1:0"
  | "bedrock/meta.llama3-8b-instruct-v1:0"
  | "bedrock/meta.llama2-70b-chat-v1"
  | "bedrock/meta.llama2-13b-chat-v1"
  // Amazon Nova models (cross-region inference)
  | "bedrock/us.amazon.nova-pro-v1:0"
  | "bedrock/us.amazon.nova-lite-v1:0"
  | "bedrock/us.amazon.nova-micro-v1:0"
  // Amazon Nova models (standard)
  | "bedrock/us.amazon.nova-2-lite-v1:0"
  | "bedrock/amazon.nova-pro-v1:0"
  | "bedrock/amazon.nova-lite-v1:0"
  | "bedrock/amazon.nova-micro-v1:0"
  // Amazon Titan Text models
  | "bedrock/amazon.titan-text-premier-v1:0"
  | "bedrock/amazon.titan-text-express-v1"
  | "bedrock/amazon.titan-text-lite-v1"
  // Mistral AI models
  | "bedrock/us.mistral.mistral-large-3-675b-instruct"
  | "bedrock/mistral.mistral-large-2407-v1:0"
  | "bedrock/mistral.mistral-large-2402-v1:0"
  | "bedrock/mistral.mistral-small-2402-v1:0"
  | "bedrock/mistral.mixtral-8x7b-instruct-v0:1"
  | "bedrock/mistral.mistral-7b-instruct-v0:2"
  // Cohere Command models
  | "bedrock/cohere.command-r-plus-v1:0"
  | "bedrock/cohere.command-r-v1:0"
  | "bedrock/cohere.command-text-v14"
  | "bedrock/cohere.command-light-text-v14"
  // AI21 Labs models
  | "bedrock/ai21.jamba-1-5-large-v1:0"
  | "bedrock/ai21.jamba-1-5-mini-v1:0"
  | "bedrock/ai21.jamba-instruct-v1:0"
  | "bedrock/ai21.j2-ultra-v1"
  | "bedrock/ai21.j2-mid-v1";

/**
 * Vercel AI Gateway model identifiers
 * Routes requests through Vercel's unified AI gateway
 * Format: vercel/{provider}/{model}
 * https://vercel.com/docs/ai-gateway
 * Complete list from models.dev
 */
type VercelModel =
  // Alibaba Qwen models via Vercel
  | "vercel/alibaba/qwen3-coder-plus"
  | "vercel/alibaba/qwen3-max"
  | "vercel/alibaba/qwen3-next-80b-a3b-instruct"
  | "vercel/alibaba/qwen3-next-80b-a3b-thinking"
  | "vercel/alibaba/qwen3-vl-instruct"
  | "vercel/alibaba/qwen3-vl-thinking"
  // Amazon Nova models via Vercel
  | "vercel/amazon/nova-pro"
  | "vercel/amazon/nova-lite"
  | "vercel/amazon/nova-micro"
  // Anthropic Claude models via Vercel
  | "vercel/anthropic/claude-3-haiku"
  | "vercel/anthropic/claude-3-opus"
  | "vercel/anthropic/claude-3.5-haiku"
  | "vercel/anthropic/claude-3.5-sonnet"
  | "vercel/anthropic/claude-3.7-sonnet"
  | "vercel/anthropic/claude-4-1-opus"
  | "vercel/anthropic/claude-4-opus"
  | "vercel/anthropic/claude-4-sonnet"
  | "vercel/anthropic/claude-4.5-sonnet"
  | "vercel/anthropic/claude-haiku-4.5"
  | "vercel/anthropic/claude-opus-4.5"
  // DeepSeek models via Vercel
  | "vercel/deepseek/deepseek-r1"
  | "vercel/deepseek/deepseek-r1-distill-llama-70b"
  | "vercel/deepseek/deepseek-v3.1-terminus"
  | "vercel/deepseek/deepseek-v3.2-exp"
  | "vercel/deepseek/deepseek-v3.2-exp-thinking"
  // Google Gemini models via Vercel
  | "vercel/google/gemini-2.0-flash"
  | "vercel/google/gemini-2.0-flash-lite"
  | "vercel/google/gemini-2.5-flash"
  | "vercel/google/gemini-2.5-flash-lite"
  | "vercel/google/gemini-2.5-flash-lite-preview-09-2025"
  | "vercel/google/gemini-2.5-flash-preview-09-2025"
  | "vercel/google/gemini-2.5-pro"
  | "vercel/google/gemini-3-pro-preview"
  // Meta Llama models via Vercel
  | "vercel/meta/llama-3.3-70b"
  | "vercel/meta/llama-4-maverick"
  | "vercel/meta/llama-4-scout"
  // Minimax models via Vercel
  | "vercel/minimax/minimax-m2"
  // Mistral models via Vercel
  | "vercel/mistral/codestral"
  | "vercel/mistral/magistral-medium"
  | "vercel/mistral/magistral-small"
  | "vercel/mistral/ministral-3b"
  | "vercel/mistral/ministral-8b"
  | "vercel/mistral/mistral-large"
  | "vercel/mistral/mistral-small"
  | "vercel/mistral/mixtral-8x22b-instruct"
  | "vercel/mistral/pixtral-12b"
  | "vercel/mistral/pixtral-large"
  // Moonshot AI models via Vercel
  | "vercel/moonshotai/kimi-k2"
  // Morph models via Vercel
  | "vercel/morph/morph-v3-fast"
  | "vercel/morph/morph-v3-large"
  // OpenAI models via Vercel
  | "vercel/openai/gpt-4-turbo"
  | "vercel/openai/gpt-4.1"
  | "vercel/openai/gpt-4.1-mini"
  | "vercel/openai/gpt-4.1-nano"
  | "vercel/openai/gpt-4o"
  | "vercel/openai/gpt-4o-mini"
  | "vercel/openai/gpt-5"
  | "vercel/openai/gpt-5-codex"
  | "vercel/openai/gpt-5-mini"
  | "vercel/openai/gpt-5-nano"
  | "vercel/openai/gpt-oss-120b"
  | "vercel/openai/gpt-oss-20b"
  | "vercel/openai/o1"
  | "vercel/openai/o3"
  | "vercel/openai/o3-mini"
  | "vercel/openai/o4-mini"
  // Perplexity models via Vercel
  | "vercel/perplexity/sonar"
  | "vercel/perplexity/sonar-pro"
  | "vercel/perplexity/sonar-reasoning"
  | "vercel/perplexity/sonar-reasoning-pro"
  // Vercel v0 models
  | "vercel/vercel/v0-1.0-md"
  | "vercel/vercel/v0-1.5-md"
  // xAI Grok models via Vercel
  | "vercel/xai/grok-2"
  | "vercel/xai/grok-2-vision"
  | "vercel/xai/grok-3"
  | "vercel/xai/grok-3-fast"
  | "vercel/xai/grok-3-mini"
  | "vercel/xai/grok-3-mini-fast"
  | "vercel/xai/grok-4"
  | "vercel/xai/grok-4-fast"
  | "vercel/xai/grok-4-fast-non-reasoning"
  | "vercel/xai/grok-code-fast-1"
  // ZAI GLM models via Vercel
  | "vercel/zai/glm-4.5"
  | "vercel/zai/glm-4.5-air"
  | "vercel/zai/glm-4.5v"
  | "vercel/zai/glm-4.6";

/**
 * Groq model identifiers
 * High-performance inference with OpenAI-compatible API
 * https://console.groq.com/docs/models
 */
type GroqModel =
  // Groq compound models
  | "groq/compound"
  | "groq/compound-mini"
  // Meta Llama models
  | "groq/llama-3.1-8b-instant"
  | "groq/llama-3.3-70b-versatile"
  | "groq/allam-2-7b"
  | "groq/meta-llama/llama-4-maverick-17b-128e-instruct"
  | "groq/meta-llama/llama-4-scout-17b-16e-instruct"
  | "groq/meta-llama/llama-guard-4-12b"
  | "groq/meta-llama/llama-prompt-guard-2-22m"
  | "groq/meta-llama/llama-prompt-guard-2-86m"
  // Moonshot AI models
  | "groq/moonshotai/kimi-k2-instruct"
  | "groq/moonshotai/kimi-k2-instruct-0905"
  // OpenAI models
  | "groq/openai/gpt-oss-120b"
  | "groq/openai/gpt-oss-20b"
  | "groq/openai/gpt-oss-safeguard-20b"
  // Qwen models
  | "groq/qwen/qwen3-32b";

/**
 * OpenRouter model identifiers
 * Unified API gateway for 300+ LLMs
 * https://openrouter.ai/docs
 */
type OpenRouterModel =
  // AI21 models
  | "openrouter/ai21/jamba-large-1.7"
  | "openrouter/ai21/jamba-mini-1.7"
  // Aion Labs models
  | "openrouter/aion-labs/aion-1.0"
  | "openrouter/aion-labs/aion-1.0-mini"
  | "openrouter/aion-labs/aion-rp-llama-3.1-8b"
  // Alfredpros models
  | "openrouter/alfredpros/codellama-7b-instruct-solidity"
  // Alibaba models
  | "openrouter/alibaba/tongyi-deepresearch-30b-a3b"
  // AllenAI models
  | "openrouter/allenai/olmo-2-0325-32b-instruct"
  | "openrouter/allenai/olmo-3-7b-instruct"
  | "openrouter/allenai/olmo-3-7b-think"
  // Alpindale models
  | "openrouter/alpindale/goliath-120b"
  // Amazon Nova models
  | "openrouter/amazon/nova-2-lite-v1"
  | "openrouter/amazon/nova-lite-v1"
  | "openrouter/amazon/nova-micro-v1"
  | "openrouter/amazon/nova-premier-v1"
  | "openrouter/amazon/nova-pro-v1"
  // Anthracite models
  | "openrouter/anthracite-org/magnum-v4-72b"
  // Anthropic models
  | "openrouter/anthropic/claude-3-haiku"
  | "openrouter/anthropic/claude-3-opus"
  | "openrouter/anthropic/claude-3.5-haiku"
  | "openrouter/anthropic/claude-3.5-haiku-20241022"
  | "openrouter/anthropic/claude-3.5-sonnet"
  | "openrouter/anthropic/claude-3.7-sonnet"
  | "openrouter/anthropic/claude-3.7-sonnet:thinking"
  | "openrouter/anthropic/claude-haiku-4.5"
  | "openrouter/anthropic/claude-opus-4"
  | "openrouter/anthropic/claude-opus-4.1"
  | "openrouter/anthropic/claude-opus-4.5"
  | "openrouter/anthropic/claude-sonnet-4"
  | "openrouter/anthropic/claude-sonnet-4.5"
  // Arcee AI models
  | "openrouter/arcee-ai/coder-large"
  | "openrouter/arcee-ai/maestro-reasoning"
  | "openrouter/arcee-ai/spotlight"
  | "openrouter/arcee-ai/trinity-mini"
  | "openrouter/arcee-ai/virtuoso-large"
  // ArliAI models
  | "openrouter/arliai/qwq-32b-arliai-rpr-v1"
  // Baidu ERNIE models
  | "openrouter/baidu/ernie-4.5-21b-a3b"
  | "openrouter/baidu/ernie-4.5-21b-a3b-thinking"
  | "openrouter/baidu/ernie-4.5-300b-a47b"
  | "openrouter/baidu/ernie-4.5-vl-28b-a3b"
  | "openrouter/baidu/ernie-4.5-vl-424b-a47b"
  // ByteDance models
  | "openrouter/bytedance/ui-tars-1.5-7b"
  // Cohere models
  | "openrouter/cohere/command-a"
  | "openrouter/cohere/command-r-08-2024"
  | "openrouter/cohere/command-r-plus-08-2024"
  | "openrouter/cohere/command-r7b-12-2024"
  // DeepCogito models
  | "openrouter/deepcogito/cogito-v2-preview-deepseek-671b"
  | "openrouter/deepcogito/cogito-v2-preview-llama-109b-moe"
  | "openrouter/deepcogito/cogito-v2-preview-llama-405b"
  | "openrouter/deepcogito/cogito-v2-preview-llama-70b"
  | "openrouter/deepcogito/cogito-v2.1-671b"
  // DeepSeek models
  | "openrouter/deepseek/deepseek-chat"
  | "openrouter/deepseek/deepseek-chat-v3-0324"
  | "openrouter/deepseek/deepseek-chat-v3.1"
  | "openrouter/deepseek/deepseek-prover-v2"
  | "openrouter/deepseek/deepseek-r1"
  | "openrouter/deepseek/deepseek-r1-0528"
  | "openrouter/deepseek/deepseek-r1-0528-qwen3-8b"
  | "openrouter/deepseek/deepseek-r1-distill-llama-70b"
  | "openrouter/deepseek/deepseek-r1-distill-qwen-14b"
  | "openrouter/deepseek/deepseek-r1-distill-qwen-32b"
  | "openrouter/deepseek/deepseek-v3.1-terminus"
  | "openrouter/deepseek/deepseek-v3.1-terminus:exacto"
  | "openrouter/deepseek/deepseek-v3.2"
  | "openrouter/deepseek/deepseek-v3.2-exp"
  | "openrouter/deepseek/deepseek-v3.2-speciale"
  // EleutherAI models
  | "openrouter/eleutherai/llemma_7b"
  // Google models
  | "openrouter/google/gemini-2.0-flash-001"
  | "openrouter/google/gemini-2.0-flash-lite-001"
  | "openrouter/google/gemini-2.5-flash"
  | "openrouter/google/gemini-2.5-flash-image"
  | "openrouter/google/gemini-2.5-flash-image-preview"
  | "openrouter/google/gemini-2.5-flash-lite"
  | "openrouter/google/gemini-2.5-flash-lite-preview-09-2025"
  | "openrouter/google/gemini-2.5-flash-preview-09-2025"
  | "openrouter/google/gemini-2.5-pro"
  | "openrouter/google/gemini-2.5-pro-preview"
  | "openrouter/google/gemini-2.5-pro-preview-05-06"
  | "openrouter/google/gemini-3-pro-image-preview"
  | "openrouter/google/gemini-3-pro-preview"
  | "openrouter/google/gemma-2-27b-it"
  | "openrouter/google/gemma-2-9b-it"
  | "openrouter/google/gemma-3-12b-it"
  | "openrouter/google/gemma-3-27b-it"
  | "openrouter/google/gemma-3-4b-it"
  | "openrouter/google/gemma-3n-e4b-it"
  // Gryphe models
  | "openrouter/gryphe/mythomax-l2-13b"
  // IBM Granite models
  | "openrouter/ibm-granite/granite-4.0-h-micro"
  // Inception models
  | "openrouter/inception/mercury"
  | "openrouter/inception/mercury-coder"
  // Inflection models
  | "openrouter/inflection/inflection-3-pi"
  | "openrouter/inflection/inflection-3-productivity"
  // Liquid models
  | "openrouter/liquid/lfm-2.2-6b"
  | "openrouter/liquid/lfm2-8b-a1b"
  // Mancer models
  | "openrouter/mancer/weaver"
  // Meituan models
  | "openrouter/meituan/longcat-flash-chat"
  // Meta Llama models
  | "openrouter/meta-llama/llama-3-70b-instruct"
  | "openrouter/meta-llama/llama-3-8b-instruct"
  | "openrouter/meta-llama/llama-3.1-405b"
  | "openrouter/meta-llama/llama-3.1-405b-instruct"
  | "openrouter/meta-llama/llama-3.1-70b-instruct"
  | "openrouter/meta-llama/llama-3.1-8b-instruct"
  | "openrouter/meta-llama/llama-3.2-11b-vision-instruct"
  | "openrouter/meta-llama/llama-3.2-1b-instruct"
  | "openrouter/meta-llama/llama-3.2-3b-instruct"
  | "openrouter/meta-llama/llama-3.2-90b-vision-instruct"
  | "openrouter/meta-llama/llama-3.3-70b-instruct"
  | "openrouter/meta-llama/llama-4-maverick"
  | "openrouter/meta-llama/llama-4-scout"
  | "openrouter/meta-llama/llama-guard-2-8b"
  | "openrouter/meta-llama/llama-guard-3-8b"
  | "openrouter/meta-llama/llama-guard-4-12b"
  // Microsoft models
  | "openrouter/microsoft/mai-ds-r1"
  | "openrouter/microsoft/phi-3-medium-128k-instruct"
  | "openrouter/microsoft/phi-3-mini-128k-instruct"
  | "openrouter/microsoft/phi-3.5-mini-128k-instruct"
  | "openrouter/microsoft/phi-4"
  | "openrouter/microsoft/phi-4-multimodal-instruct"
  | "openrouter/microsoft/phi-4-reasoning-plus"
  | "openrouter/microsoft/wizardlm-2-8x22b"
  // Minimax models
  | "openrouter/minimax/minimax-01"
  | "openrouter/minimax/minimax-m1"
  | "openrouter/minimax/minimax-m2"
  // Mistral AI models
  | "openrouter/mistralai/codestral-2508"
  | "openrouter/mistralai/devstral-medium"
  | "openrouter/mistralai/devstral-small"
  | "openrouter/mistralai/devstral-small-2505"
  | "openrouter/mistralai/magistral-medium-2506:thinking"
  | "openrouter/mistralai/ministral-14b-2512"
  | "openrouter/mistralai/ministral-3b"
  | "openrouter/mistralai/ministral-3b-2512"
  | "openrouter/mistralai/ministral-8b"
  | "openrouter/mistralai/ministral-8b-2512"
  | "openrouter/mistralai/mistral-7b-instruct"
  | "openrouter/mistralai/mistral-7b-instruct-v0.1"
  | "openrouter/mistralai/mistral-7b-instruct-v0.2"
  | "openrouter/mistralai/mistral-7b-instruct-v0.3"
  | "openrouter/mistralai/mistral-large"
  | "openrouter/mistralai/mistral-large-2407"
  | "openrouter/mistralai/mistral-large-2411"
  | "openrouter/mistralai/mistral-large-2512"
  | "openrouter/mistralai/mistral-medium-3"
  | "openrouter/mistralai/mistral-medium-3.1"
  | "openrouter/mistralai/mistral-nemo"
  | "openrouter/mistralai/mistral-saba"
  | "openrouter/mistralai/mistral-small-24b-instruct-2501"
  | "openrouter/mistralai/mistral-small-3.1-24b-instruct"
  | "openrouter/mistralai/mistral-small-3.2-24b-instruct"
  | "openrouter/mistralai/mistral-tiny"
  | "openrouter/mistralai/mixtral-8x22b-instruct"
  | "openrouter/mistralai/mixtral-8x7b-instruct"
  | "openrouter/mistralai/pixtral-12b"
  | "openrouter/mistralai/pixtral-large-2411"
  | "openrouter/mistralai/voxtral-small-24b-2507"
  // Moonshot AI models
  | "openrouter/moonshotai/kimi-dev-72b"
  | "openrouter/moonshotai/kimi-k2"
  | "openrouter/moonshotai/kimi-k2-0905"
  | "openrouter/moonshotai/kimi-k2-0905:exacto"
  | "openrouter/moonshotai/kimi-k2-thinking"
  | "openrouter/moonshotai/kimi-linear-48b-a3b-instruct"
  // Morph models
  | "openrouter/morph/morph-v3-fast"
  | "openrouter/morph/morph-v3-large"
  // NeverSleep models
  | "openrouter/neversleep/llama-3.1-lumimaid-8b"
  | "openrouter/neversleep/noromaid-20b"
  // NousResearch models
  | "openrouter/nousresearch/deephermes-3-mistral-24b-preview"
  | "openrouter/nousresearch/hermes-2-pro-llama-3-8b"
  | "openrouter/nousresearch/hermes-3-llama-3.1-405b"
  | "openrouter/nousresearch/hermes-3-llama-3.1-70b"
  | "openrouter/nousresearch/hermes-4-405b"
  | "openrouter/nousresearch/hermes-4-70b"
  // NVIDIA models
  | "openrouter/nvidia/llama-3.1-nemotron-70b-instruct"
  | "openrouter/nvidia/llama-3.1-nemotron-ultra-253b-v1"
  | "openrouter/nvidia/llama-3.3-nemotron-super-49b-v1.5"
  | "openrouter/nvidia/nemotron-nano-12b-v2-vl"
  | "openrouter/nvidia/nemotron-nano-9b-v2"
  // OpenAI models
  | "openrouter/openai/chatgpt-4o-latest"
  | "openrouter/openai/codex-mini"
  | "openrouter/openai/gpt-3.5-turbo"
  | "openrouter/openai/gpt-3.5-turbo-0613"
  | "openrouter/openai/gpt-3.5-turbo-16k"
  | "openrouter/openai/gpt-3.5-turbo-instruct"
  | "openrouter/openai/gpt-4"
  | "openrouter/openai/gpt-4-0314"
  | "openrouter/openai/gpt-4-1106-preview"
  | "openrouter/openai/gpt-4-turbo"
  | "openrouter/openai/gpt-4-turbo-preview"
  | "openrouter/openai/gpt-4.1"
  | "openrouter/openai/gpt-4.1-mini"
  | "openrouter/openai/gpt-4.1-nano"
  | "openrouter/openai/gpt-4o"
  | "openrouter/openai/gpt-4o-2024-05-13"
  | "openrouter/openai/gpt-4o-2024-08-06"
  | "openrouter/openai/gpt-4o-2024-11-20"
  | "openrouter/openai/gpt-4o-audio-preview"
  | "openrouter/openai/gpt-4o-mini"
  | "openrouter/openai/gpt-4o-mini-2024-07-18"
  | "openrouter/openai/gpt-4o-mini-search-preview"
  | "openrouter/openai/gpt-4o-search-preview"
  | "openrouter/openai/gpt-4o:extended"
  | "openrouter/openai/gpt-5"
  | "openrouter/openai/gpt-5-chat"
  | "openrouter/openai/gpt-5-codex"
  | "openrouter/openai/gpt-5-image"
  | "openrouter/openai/gpt-5-image-mini"
  | "openrouter/openai/gpt-5-mini"
  | "openrouter/openai/gpt-5-nano"
  | "openrouter/openai/gpt-5-pro"
  | "openrouter/openai/gpt-5.1"
  | "openrouter/openai/gpt-5.1-chat"
  | "openrouter/openai/gpt-5.1-codex"
  | "openrouter/openai/gpt-5.1-codex-mini"
  | "openrouter/openai/gpt-oss-120b"
  | "openrouter/openai/gpt-oss-120b:exacto"
  | "openrouter/openai/gpt-oss-20b"
  | "openrouter/openai/gpt-oss-safeguard-20b"
  | "openrouter/openai/o1"
  | "openrouter/openai/o1-pro"
  | "openrouter/openai/o3"
  | "openrouter/openai/o3-deep-research"
  | "openrouter/openai/o3-mini"
  | "openrouter/openai/o3-mini-high"
  | "openrouter/openai/o3-pro"
  | "openrouter/openai/o4-mini"
  | "openrouter/openai/o4-mini-deep-research"
  | "openrouter/openai/o4-mini-high"
  // OpenGVLab models
  | "openrouter/opengvlab/internvl3-78b"
  // OpenRouter meta models
  | "openrouter/openrouter/auto"
  | "openrouter/openrouter/bodybuilder"
  // Perplexity models
  | "openrouter/perplexity/sonar"
  | "openrouter/perplexity/sonar-deep-research"
  | "openrouter/perplexity/sonar-pro"
  | "openrouter/perplexity/sonar-pro-search"
  | "openrouter/perplexity/sonar-reasoning"
  | "openrouter/perplexity/sonar-reasoning-pro"
  // Prime Intellect models
  | "openrouter/prime-intellect/intellect-3"
  // Qwen models
  | "openrouter/qwen/qwen-2.5-72b-instruct"
  | "openrouter/qwen/qwen-2.5-7b-instruct"
  | "openrouter/qwen/qwen-2.5-coder-32b-instruct"
  | "openrouter/qwen/qwen-2.5-vl-7b-instruct"
  | "openrouter/qwen/qwen-max"
  | "openrouter/qwen/qwen-plus"
  | "openrouter/qwen/qwen-plus-2025-07-28"
  | "openrouter/qwen/qwen-plus-2025-07-28:thinking"
  | "openrouter/qwen/qwen-turbo"
  | "openrouter/qwen/qwen-vl-max"
  | "openrouter/qwen/qwen-vl-plus"
  | "openrouter/qwen/qwen2.5-coder-7b-instruct"
  | "openrouter/qwen/qwen2.5-vl-32b-instruct"
  | "openrouter/qwen/qwen2.5-vl-72b-instruct"
  | "openrouter/qwen/qwen3-14b"
  | "openrouter/qwen/qwen3-235b-a22b"
  | "openrouter/qwen/qwen3-235b-a22b-2507"
  | "openrouter/qwen/qwen3-235b-a22b-thinking-2507"
  | "openrouter/qwen/qwen3-30b-a3b"
  | "openrouter/qwen/qwen3-30b-a3b-instruct-2507"
  | "openrouter/qwen/qwen3-30b-a3b-thinking-2507"
  | "openrouter/qwen/qwen3-32b"
  | "openrouter/qwen/qwen3-8b"
  | "openrouter/qwen/qwen3-coder"
  | "openrouter/qwen/qwen3-coder-30b-a3b-instruct"
  | "openrouter/qwen/qwen3-coder-flash"
  | "openrouter/qwen/qwen3-coder-plus"
  | "openrouter/qwen/qwen3-coder:exacto"
  | "openrouter/qwen/qwen3-max"
  | "openrouter/qwen/qwen3-next-80b-a3b-instruct"
  | "openrouter/qwen/qwen3-next-80b-a3b-thinking"
  | "openrouter/qwen/qwen3-vl-235b-a22b-instruct"
  | "openrouter/qwen/qwen3-vl-235b-a22b-thinking"
  | "openrouter/qwen/qwen3-vl-30b-a3b-instruct"
  | "openrouter/qwen/qwen3-vl-30b-a3b-thinking"
  | "openrouter/qwen/qwen3-vl-8b-instruct"
  | "openrouter/qwen/qwen3-vl-8b-thinking"
  | "openrouter/qwen/qwq-32b"
  // Raifle models
  | "openrouter/raifle/sorcererlm-8x22b"
  // Relace models
  | "openrouter/relace/relace-apply-3"
  // Sao10k models
  | "openrouter/sao10k/l3-euryale-70b"
  | "openrouter/sao10k/l3-lunaris-8b"
  | "openrouter/sao10k/l3.1-70b-hanami-x1"
  | "openrouter/sao10k/l3.1-euryale-70b"
  | "openrouter/sao10k/l3.3-euryale-70b"
  // Stepfun AI models
  | "openrouter/stepfun-ai/step3"
  // Switchpoint models
  | "openrouter/switchpoint/router"
  // Tencent models
  | "openrouter/tencent/hunyuan-a13b-instruct"
  // TheDrummer models
  | "openrouter/thedrummer/anubis-70b-v1.1"
  | "openrouter/thedrummer/cydonia-24b-v4.1"
  | "openrouter/thedrummer/rocinante-12b"
  | "openrouter/thedrummer/skyfall-36b-v2"
  | "openrouter/thedrummer/unslopnemo-12b"
  // THUDM models
  | "openrouter/thudm/glm-4.1v-9b-thinking"
  // TNG Tech models
  | "openrouter/tngtech/deepseek-r1t-chimera"
  | "openrouter/tngtech/deepseek-r1t2-chimera"
  | "openrouter/tngtech/tng-r1t-chimera"
  // Undi95 models
  | "openrouter/undi95/remm-slerp-l2-13b"
  // X.AI Grok models
  | "openrouter/x-ai/grok-3"
  | "openrouter/x-ai/grok-3-beta"
  | "openrouter/x-ai/grok-3-mini"
  | "openrouter/x-ai/grok-3-mini-beta"
  | "openrouter/x-ai/grok-4"
  | "openrouter/x-ai/grok-4-fast"
  | "openrouter/x-ai/grok-4.1-fast"
  | "openrouter/x-ai/grok-code-fast-1"
  // Z-AI GLM models
  | "openrouter/z-ai/glm-4-32b"
  | "openrouter/z-ai/glm-4.5"
  | "openrouter/z-ai/glm-4.5-air"
  | "openrouter/z-ai/glm-4.5v"
  | "openrouter/z-ai/glm-4.6"
  | "openrouter/z-ai/glm-4.6:exacto";

/**
 * Fireworks AI model identifiers
 * High-performance inference with OpenAI-compatible API
 * https://fireworks.ai/models
 */
type FireworksModel =
  // OpenAI gpt-oss models
  | "fireworks/accounts/fireworks/models/gpt-oss-20b"
  | "fireworks/accounts/fireworks/models/gpt-oss-120b"
  | "fireworks/accounts/fireworks/models/gpt-oss-safeguard-20b"
  | "fireworks/accounts/fireworks/models/gpt-oss-safeguard-120b"
  // Meta Llama models
  | "fireworks/accounts/fireworks/models/llama-v3p3-70b-instruct"
  | "fireworks/accounts/fireworks/models/llama-v3p1-405b-instruct"
  | "fireworks/accounts/fireworks/models/llama-v3p1-70b-instruct"
  | "fireworks/accounts/fireworks/models/llama-v3p1-8b-instruct"
  | "fireworks/accounts/fireworks/models/llama-v3p2-3b-instruct"
  | "fireworks/accounts/fireworks/models/llama-v3p2-1b-instruct"
  | "fireworks/accounts/fireworks/models/llama-v3-70b-instruct"
  | "fireworks/accounts/fireworks/models/llama-v3-8b-instruct"
  | "fireworks/accounts/fireworks/models/llama-guard-3-8b"
  | "fireworks/accounts/fireworks/models/llama-guard-3-1b"
  // DeepSeek models
  | "fireworks/accounts/fireworks/models/deepseek-v3"
  | "fireworks/accounts/fireworks/models/deepseek-v3-0324"
  | "fireworks/accounts/fireworks/models/deepseek-v3p1"
  | "fireworks/accounts/fireworks/models/deepseek-v3p1-terminus"
  | "fireworks/accounts/fireworks/models/deepseek-v3p2"
  | "fireworks/accounts/fireworks/models/deepseek-r1"
  | "fireworks/accounts/fireworks/models/deepseek-r1-0528"
  | "fireworks/accounts/fireworks/models/deepseek-r1-basic"
  | "fireworks/accounts/fireworks/models/deepseek-r1-distill-llama-70b"
  | "fireworks/accounts/fireworks/models/deepseek-r1-distill-llama-8b"
  | "fireworks/accounts/fireworks/models/deepseek-r1-distill-qwen-32b"
  | "fireworks/accounts/fireworks/models/deepseek-r1-distill-qwen-14b"
  | "fireworks/accounts/fireworks/models/deepseek-r1-distill-qwen-7b"
  | "fireworks/accounts/fireworks/models/deepseek-r1-distill-qwen-1p5b"
  | "fireworks/accounts/fireworks/models/deepseek-coder-v2-instruct"
  | "fireworks/accounts/fireworks/models/deepseek-coder-v2-lite-instruct"
  | "fireworks/accounts/fireworks/models/deepseek-prover-v2"
  // Qwen models
  | "fireworks/accounts/fireworks/models/qwen2p5-72b-instruct"
  | "fireworks/accounts/fireworks/models/qwen2p5-32b-instruct"
  | "fireworks/accounts/fireworks/models/qwen2p5-14b-instruct"
  | "fireworks/accounts/fireworks/models/qwen2p5-7b-instruct"
  | "fireworks/accounts/fireworks/models/qwen2p5-coder-32b-instruct"
  | "fireworks/accounts/fireworks/models/qwen2p5-coder-32b-instruct-128k"
  | "fireworks/accounts/fireworks/models/qwen2-72b-instruct"
  | "fireworks/accounts/fireworks/models/qwen3-235b-a22b"
  | "fireworks/accounts/fireworks/models/qwen3-235b-a22b-instruct-2507"
  | "fireworks/accounts/fireworks/models/qwen3-30b-a3b"
  | "fireworks/accounts/fireworks/models/qwen3-32b"
  | "fireworks/accounts/fireworks/models/qwen3-8b"
  | "fireworks/accounts/fireworks/models/qwen3-4b"
  | "fireworks/accounts/fireworks/models/qwen3-coder-480b-a35b-instruct"
  | "fireworks/accounts/fireworks/models/qwen3-coder-30b-a3b-instruct"
  | "fireworks/accounts/fireworks/models/qwq-32b"
  // Mixtral models
  | "fireworks/accounts/fireworks/models/mixtral-8x22b-instruct"
  | "fireworks/accounts/fireworks/models/mixtral-8x7b-instruct"
  // Mistral models
  | "fireworks/accounts/fireworks/models/mistral-7b-instruct-v0p2"
  | "fireworks/accounts/fireworks/models/mistral-7b-instruct-v3"
  | "fireworks/accounts/fireworks/models/mistral-nemo-instruct-2407"
  | "fireworks/accounts/fireworks/models/mistral-small-24b-instruct-2501"
  | "fireworks/accounts/fireworks/models/devstral-small-2505"
  // Google Gemma models
  | "fireworks/accounts/fireworks/models/gemma2-9b-it"
  | "fireworks/accounts/fireworks/models/gemma-3-27b-it"
  // Kimi/Moonshot models
  | "fireworks/accounts/fireworks/models/kimi-k2-instruct"
  | "fireworks/accounts/fireworks/models/kimi-k2-instruct-0905"
  | "fireworks/accounts/fireworks/models/kimi-k2-thinking"
  // GLM models
  | "fireworks/accounts/fireworks/models/glm-4p5"
  | "fireworks/accounts/fireworks/models/glm-4p5-air"
  | "fireworks/accounts/fireworks/models/glm-4p6"
  // Other models
  | "fireworks/accounts/fireworks/models/firefunction-v2"
  | "fireworks/accounts/fireworks/models/llama-3p1-nemotron-70b"
  | "fireworks/accounts/fireworks/models/cogito-v1-preview-llama-70b"
  | "fireworks/accounts/fireworks/models/phi-3-mini-128k-instruct"
  | "fireworks/accounts/fireworks/models/yi-large";

/**
 * Superagent model identifiers
 */
type SuperagentModel =
  | "superagent/guard-0.6b"
  | "superagent/guard-1.7b"
  | "superagent/guard-4b";

/**
 * Supported model identifiers for all providers
 */
export type SupportedModel =
  | OpenAIModel
  | AnthropicModel
  | GoogleModel
  | BedrockModel
  | VercelModel
  | GroqModel
  | FireworksModel
  | OpenRouterModel
  | SuperagentModel;

/**
 * Guard input type - supports text, URLs, and binary data
 * Auto-detection:
 * - string starting with http:// or https:// → treated as URL
 * - string not starting with http(s):// → plain text
 * - Blob/File → binary data (MIME type from blob.type)
 * - URL object → URL to fetch
 */
export type GuardInput = string | Blob | URL;

/**
 * Multimodal content part for vision models
 */
export type MultimodalContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

/**
 * Chat message format for LLM requests
 * Content can be a string or multimodal content array for vision
 */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string | MultimodalContentPart[];
}

/**
 * Processed input result from input processor
 */
export interface ProcessedInput {
  /** The type of input that was detected */
  type: "text" | "image" | "document" | "pdf";
  /** Text content (for text and document types) */
  text?: string;
  /** Base64 encoded image data (for image type) */
  imageBase64?: string;
  /** MIME type of the content */
  mimeType?: string;
  /** Array of text per page (for PDF type) */
  pages?: string[];
}

/**
 * Options for the guard method
 */
export interface GuardOptions {
  /** The input to analyze - text, URL, or Blob */
  input: GuardInput;
  /** Optional custom system prompt that replaces the default guard prompt */
  systemPrompt?: string;
  /** Model in "provider/model" format, e.g. "openai/gpt-4o". Defaults to superagent/guard-1.7b if not specified. */
  model?: SupportedModel;
  /** Characters per chunk. Default: 8000. Set to 0 to disable chunking. */
  chunkSize?: number;
}

/**
 * Options for the redact method
 */
export interface RedactOptions {
  /** The input text to redact */
  input: string;
  /** Optional list of entity types to redact (overrides default entities) */
  entities?: string[];
  /** Model in "provider/model" format, e.g. "openai/gpt-4o" */
  model: SupportedModel;
  /** When true, rewrites text contextually instead of using placeholders (default: false) */
  rewrite?: boolean;
}

/**
 * Result from guard classification
 */
export interface GuardClassificationResult {
  /** Whether the content passed or should be blocked */
  classification: "pass" | "block";
  /** Types of violations detected */
  violation_types: string[];
  /** CWE codes associated with violations */
  cwe_codes: string[];
}

/**
 * Result from redact operation
 */
export interface RedactResult {
  /** The redacted/sanitized text */
  redacted: string;
  /** List of findings that were redacted */
  findings: string[];
}

/**
 * Response from guard method including token usage
 */
export interface GuardResponse extends GuardClassificationResult {
  /** Token usage information */
  usage: TokenUsage;
}

/**
 * Response from redact method including token usage
 */
export interface RedactResponse extends RedactResult {
  /** Token usage information */
  usage: TokenUsage;
}

/**
 * Token usage information
 */
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/**
 * Unified response format from LLM providers
 */
export interface AnalysisResponse {
  usage: TokenUsage;
  id: string;
  choices: Array<{
    index?: number;
    message: {
      role: string;
      content: string;
      reasoning_content?: string;
      reasoning?: string;
    };
    finish_reason?: string;
  }>;
}

/**
 * Parsed model identifier
 */
export interface ParsedModel {
  provider: string;
  model: string;
}
