import type { ChatMessage, AnalysisResponse, ParsedModel } from "../types.js";
import type { ProviderConfig, ResponseFormat } from "./types.js";
import { openaiProvider } from "./openai.js";
import { anthropicProvider } from "./anthropic.js";
import { googleProvider } from "./google.js";
import { bedrockProvider } from "./bedrock.js";
import { vercelProvider } from "./vercel.js";
import { groqProvider } from "./groq.js";
import { fireworksProvider } from "./fireworks.js";
import { openrouterProvider } from "./openrouter.js";
import { superagentProvider } from "./superagent.js";

/**
 * Default model for guard() when no model is specified
 */
export const DEFAULT_GUARD_MODEL = "superagent/guard-1.7b";

/**
 * Registry of supported providers
 */
export const providers: Record<string, ProviderConfig> = {
  openai: openaiProvider,
  anthropic: anthropicProvider,
  google: googleProvider,
  bedrock: bedrockProvider,
  vercel: vercelProvider,
  groq: groqProvider,
  fireworks: fireworksProvider,
  openrouter: openrouterProvider,
  superagent: superagentProvider,
};

/**
 * Parse a model string in "provider/model" format
 * @example "openai/gpt-4o" -> { provider: "openai", model: "gpt-4o" }
 */
export function parseModel(modelString: string): ParsedModel {
  const slashIndex = modelString.indexOf("/");

  if (slashIndex === -1) {
    throw new Error(
      `Invalid model format: "${modelString}". Expected "provider/model" format (e.g., "openai/gpt-4o").`
    );
  }

  const provider = modelString.slice(0, slashIndex);
  const model = modelString.slice(slashIndex + 1);

  if (!provider || !model) {
    throw new Error(
      `Invalid model format: "${modelString}". Both provider and model are required.`
    );
  }

  return { provider, model };
}

/**
 * Get the provider configuration for a given provider name
 */
export function getProvider(providerName: string): ProviderConfig {
  const provider = providers[providerName];

  if (!provider) {
    const supportedProviders = Object.keys(providers).join(", ");
    throw new Error(
      `Unsupported provider: "${providerName}". Supported providers: ${supportedProviders}`
    );
  }

  return provider;
}

/**
 * Call an LLM provider with the given messages
 */
export async function callProvider(
  modelString: string,
  messages: ChatMessage[],
  responseFormat?: ResponseFormat
): Promise<AnalysisResponse> {
  const { provider: providerName, model } = parseModel(modelString);
  const provider = getProvider(providerName);

  // Allow empty API key for providers that don't require authentication (e.g., superagent)
  const apiKey = provider.envVar ? process.env[provider.envVar] : "";
  if (provider.envVar && !apiKey) {
    throw new Error(
      `Missing API key: ${provider.envVar} environment variable is required for ${providerName} provider`
    );
  }

  const requestBody = provider.transformRequest(
    model,
    messages,
    responseFormat
  );
  const headers = provider.authHeader(apiKey || "");

  const url = provider.buildUrl
    ? provider.buildUrl(provider.baseUrl, model)
    : provider.baseUrl;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Provider API error (${response.status}): ${errorText}`);
  }

  const responseData = await response.json();
  return provider.transformResponse(responseData);
}

export type { ProviderConfig, ResponseFormat, JsonSchema } from "./types.js";
