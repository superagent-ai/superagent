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
import {
  superagentProvider,
  getFallbackUrl,
  DEFAULT_FALLBACK_TIMEOUT_MS,
  DEFAULT_FALLBACK_URL,
} from "./superagent.js";
import { openaiCompatibleProvider } from "./openai-compatible.js";

/**
 * Options for fallback behavior on cold starts
 */
export interface FallbackOptions {
  /** Enable fallback to always-on endpoint on timeout. Default: true for superagent provider */
  enableFallback?: boolean;
  /** Timeout in milliseconds before falling back. Default: 5000 */
  fallbackTimeoutMs?: number;
  /** Custom fallback URL. If not provided, uses env var or default */
  fallbackUrl?: string;
}

/**
 * Default model for guard() when no model is specified
 */
export const DEFAULT_GUARD_MODEL = "superagent/guard-1.7b";

/**
 * Registry of supported providers
 */
export const providers: Record<string, ProviderConfig> = {
  openai: openaiProvider,
  "openai-compatible": openaiCompatibleProvider,
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
      `Invalid model format: "${modelString}". Expected "provider/model" format (e.g., "openai/gpt-4o").`,
    );
  }

  const provider = modelString.slice(0, slashIndex);
  const model = modelString.slice(slashIndex + 1);

  if (!provider || !model) {
    throw new Error(
      `Invalid model format: "${modelString}". Both provider and model are required.`,
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
      `Unsupported provider: "${providerName}". Supported providers: ${supportedProviders}`,
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
  responseFormat?: ResponseFormat,
  fallbackOptions?: FallbackOptions,
): Promise<AnalysisResponse> {
  const { provider: providerName, model } = parseModel(modelString);
  const provider = getProvider(providerName);

  // Allow empty API key for providers that don't require authentication (e.g., superagent)
  const apiKey = provider.envVar ? process.env[provider.envVar] : "";
  if (provider.envVar && !apiKey) {
    throw new Error(
      `Missing API key: ${provider.envVar} environment variable is required for ${providerName} provider`,
    );
  }

  const requestBody = provider.transformRequest(
    model,
    messages,
    responseFormat,
  );
  const headers = provider.authHeader(apiKey || "");

  const url = provider.buildUrl
    ? provider.buildUrl(provider.baseUrl, model)
    : provider.baseUrl;

  // Determine if fallback is enabled (default: true for superagent provider)
  const isSuperagent = providerName === "superagent";
  const enableFallback = fallbackOptions?.enableFallback ?? isSuperagent;
  const fallbackTimeoutMs =
    fallbackOptions?.fallbackTimeoutMs ?? DEFAULT_FALLBACK_TIMEOUT_MS;
  const fallbackUrl = getFallbackUrl(fallbackOptions?.fallbackUrl);

  // Check if fallback is enabled and URL is available
  const fallbackAvailable =
    enableFallback &&
    fallbackUrl &&
    fallbackUrl !== "FALLBACK_ENDPOINT_PLACEHOLDER";

  if (fallbackAvailable) {
    // Use AbortController for timeout-based fallback
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), fallbackTimeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Provider API error (${response.status}): ${errorText}`,
        );
      }

      const responseData = await response.json();
      return provider.transformResponse(responseData);
    } catch (error) {
      clearTimeout(timeoutId);

      // Check if this was a timeout (AbortError)
      if (
        error instanceof Error &&
        (error.name === "AbortError" ||
          error.message.includes("abort") ||
          error.message.includes("timeout"))
      ) {
        // Retry on fallback endpoint
        console.log(
          `Primary endpoint timed out after ${fallbackTimeoutMs}ms, falling back to always-on endpoint`,
        );

        // Create fresh headers and body to avoid Content-Length mismatch
        const fallbackHeaders = provider.authHeader(apiKey || "");
        const fallbackBody = JSON.stringify(requestBody);

        const fallbackResponse = await fetch(fallbackUrl, {
          method: "POST",
          headers: fallbackHeaders,
          body: fallbackBody,
        });

        if (!fallbackResponse.ok) {
          const errorText = await fallbackResponse.text();
          throw new Error(
            `Fallback provider API error (${fallbackResponse.status}): ${errorText}`,
          );
        }

        const fallbackData = await fallbackResponse.json();
        return provider.transformResponse(fallbackData);
      }

      // Re-throw non-timeout errors
      throw error;
    }
  }

  // No fallback - standard request
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
