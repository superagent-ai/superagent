import type { ChatMessage, AnalysisResponse } from "../types.js";
import type {
  ProviderConfig,
  OpenAIRequestBody,
  OpenAIResponse,
  ResponseFormat,
} from "./types.js";

/**
 * OrcaRouter provider configuration
 *
 * OrcaRouter is an OpenAI-compatible AI gateway: one endpoint and one API key
 * (`sk-orca-…`) in front of many model providers. Model IDs keep their
 * `vendor/model` namespace, which fits the SDK's nested `provider/model`
 * format: `orcarouter/openai/gpt-5.5`.
 *
 * Inference and authentication live on different origins. Only inference is
 * used here; that is `https://api.orcarouter.ai/v1`, never
 * `https://api.orcarouter.ai/v1/auth/keys` (that path is a 404).
 *
 * https://www.orcarouter.ai
 */
export const ORCAROUTER_DEFAULT_API_BASE_URL = "https://api.orcarouter.ai/v1";

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

/**
 * Resolve the OrcaRouter inference base URL.
 *
 * Defaults to the public endpoint. Self-hosted deployments can override it
 * with `ORCA_API_BASE_URL`; `ORCA_BASE_URL` is honoured as a shared fallback.
 * Remote origins must be HTTPS — plain HTTP is only allowed on loopback.
 */
export function getOrcaRouterBaseUrl(): string {
  const configured =
    process.env.ORCA_API_BASE_URL?.trim() ||
    process.env.ORCA_BASE_URL?.trim() ||
    "";

  if (!configured) return ORCAROUTER_DEFAULT_API_BASE_URL;

  const url = configured.replace(/\/+$/, "");
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(
      `Invalid OrcaRouter base URL: "${configured}". Expected an absolute http(s) URL.`,
    );
  }

  const isLoopback = LOOPBACK_HOSTS.has(parsed.hostname);
  if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && isLoopback)) {
    throw new Error(
      `Insecure OrcaRouter base URL: "${configured}". HTTPS is required for non-loopback origins.`,
    );
  }

  return url;
}

/**
 * Build the chat completions URL: `<base>/chat/completions`.
 */
export function buildOrcaRouterUrl(baseUrl: string): string {
  const base = (baseUrl || getOrcaRouterBaseUrl()).replace(/\/+$/, "");
  return `${base}/chat/completions`;
}

export const orcarouterProvider: ProviderConfig = {
  baseUrl: ORCAROUTER_DEFAULT_API_BASE_URL,
  envVar: "ORCAROUTER_API_KEY",

  buildUrl: (_baseUrl: string, _model: string) =>
    buildOrcaRouterUrl(getOrcaRouterBaseUrl()),

  authHeader: (apiKey: string) => ({
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  }),

  transformRequest: (
    model: string,
    messages: ChatMessage[],
    responseFormat?: ResponseFormat
  ): OpenAIRequestBody => ({
    model,
    messages,
    temperature: 0,
    response_format: responseFormat,
  }),

  transformResponse: (response: unknown): AnalysisResponse => {
    const res = response as OpenAIResponse;
    return {
      id: res.id,
      usage: {
        promptTokens: res.usage?.prompt_tokens ?? 0,
        completionTokens: res.usage?.completion_tokens ?? 0,
        totalTokens: res.usage?.total_tokens ?? 0,
      },
      choices: (res.choices ?? []).map((choice) => ({
        index: choice.index,
        message: {
          role: choice.message.role,
          content: choice.message.content,
        },
        finish_reason: choice.finish_reason,
      })),
    };
  },
};
