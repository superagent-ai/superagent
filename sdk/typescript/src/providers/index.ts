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
  /**
   * Upper bound (in seconds) for honoring a provider-declared `Retry-After` on a 429.
   * Waits shorter than this are slept through and the primary model is retried once,
   * instead of instantly burning the fallback on the same rate-limit burst. Longer or
   * missing `Retry-After` values preserve the current fallback behavior. Default: 15.
   */
  retryAfterThresholdSeconds?: number;
}

const DEFAULT_RETRY_AFTER_THRESHOLD_SECONDS = 15;

function parseRetryAfterSeconds(header: string | null): number | null {
  if (!header) {
    return null;
  }
  const seconds = Number.parseInt(header, 10);
  if (Number.isNaN(seconds) || seconds < 0) {
    return null;
  }
  return seconds;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

const RETRYABLE_STATUS_CODES = [429, 500, 502, 503];

/**
 * Call an LLM provider with the given messages.
 * If `fallbackModelString` is set and the primary model returns a retryable
 * status code, the request is re-issued against the fallback model.
 */
export async function callProvider(
  modelString: string,
  messages: ChatMessage[],
  responseFormat?: ResponseFormat,
  fallbackOptions?: FallbackOptions,
  fallbackModelString?: string,
): Promise<AnalysisResponse> {
  return callProviderInternal(
    modelString,
    messages,
    responseFormat,
    fallbackOptions,
    fallbackModelString,
    false,
  );
}

async function callProviderInternal(
  modelString: string,
  messages: ChatMessage[],
  responseFormat?: ResponseFormat,
  fallbackOptions?: FallbackOptions,
  fallbackModelString?: string,
  retriedPrimaryAfterRetryAfter = false,
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

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
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

    // Response handling lives OUTSIDE the timeout catch: once a response has
    // arrived the cold-start timeout concern is over, and a rejection from the
    // Retry-After retry chain (or the fallback-model call) must not be
    // misrouted to the always-on URL by the abort/timeout message heuristic
    // above, which would mask the real provider error.
    if (!response.ok) {
      if (
        fallbackModelString &&
        RETRYABLE_STATUS_CODES.includes(response.status)
      ) {
        const retried = await maybeRetryPrimaryAfterRetryAfter({
          modelString,
          messages,
          responseFormat,
          fallbackOptions,
          fallbackModelString,
          response,
          retriedPrimaryAfterRetryAfter,
        });
        if (retried) {
          return retried;
        }
        console.log(
          `Primary model ${modelString} failed (${response.status}), falling back to ${fallbackModelString}`,
        );
        return callProvider(
          fallbackModelString,
          messages,
          responseFormat,
          fallbackOptions,
        );
      }
      const errorText = await response.text();
      throw new Error(
        `Provider API error (${response.status}): ${errorText}`,
      );
    }

    const responseData = await response.json();
    return provider.transformResponse(responseData);
  }

  // No fallback - standard request
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    if (
      fallbackModelString &&
      RETRYABLE_STATUS_CODES.includes(response.status)
    ) {
      const retried = await maybeRetryPrimaryAfterRetryAfter({
        modelString,
        messages,
        responseFormat,
        fallbackOptions,
        fallbackModelString,
        response,
        retriedPrimaryAfterRetryAfter,
      });
      if (retried) {
        return retried;
      }
      console.log(
        `Primary model ${modelString} failed (${response.status}), falling back to ${fallbackModelString}`,
      );
      return callProvider(
        fallbackModelString,
        messages,
        responseFormat,
        fallbackOptions,
      );
    }
    const errorText = await response.text();
    throw new Error(`Provider API error (${response.status}): ${errorText}`);
  }

  const responseData = await response.json();
  return provider.transformResponse(responseData);
}

/**
 * On a 429 with a short, valid `Retry-After`, wait out the cooldown and retry
 * the primary model once instead of instantly burning the fallback on the same
 * rate-limit burst. Returns the retried response when handled; `null` when the
 * caller should proceed with its normal fallback path (no/missing/long/weird
 * `Retry-After`, or a retry already happened this call chain).
 */
async function maybeRetryPrimaryAfterRetryAfter(params: {
  modelString: string;
  messages: ChatMessage[];
  responseFormat?: ResponseFormat;
  fallbackOptions?: FallbackOptions;
  fallbackModelString?: string;
  response: Response;
  retriedPrimaryAfterRetryAfter: boolean;
}): Promise<AnalysisResponse | null> {
  const {
    modelString,
    messages,
    responseFormat,
    fallbackOptions,
    fallbackModelString,
    response,
    retriedPrimaryAfterRetryAfter,
  } = params;

  if (response.status !== 429 || retriedPrimaryAfterRetryAfter) {
    return null;
  }

  const retryAfterSeconds = parseRetryAfterSeconds(
    response.headers?.get("retry-after") ?? null,
  );
  const thresholdSeconds =
    fallbackOptions?.retryAfterThresholdSeconds ??
    DEFAULT_RETRY_AFTER_THRESHOLD_SECONDS;

  if (retryAfterSeconds === null || retryAfterSeconds > thresholdSeconds) {
    return null;
  }

  console.log(
    `Primary model ${modelString} rate-limited (429), retrying after ${retryAfterSeconds}s (Retry-After)`,
  );
  await sleep(retryAfterSeconds * 1000);

  return callProviderInternal(
    modelString,
    messages,
    responseFormat,
    fallbackOptions,
    fallbackModelString,
    true,
  );
}

export type { ProviderConfig, ResponseFormat, JsonSchema } from "./types.js";
