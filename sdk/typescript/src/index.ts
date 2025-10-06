import { redactSensitiveData } from "./redact.js";

export interface CreateGuardOptions {
  /**
   * Full URL to the guard endpoint (e.g. https://example.com/api/guard).
   */
  apiBaseUrl?: string;
  /**
   * API key used to authenticate the guard request.
   */
  apiKey: string;
  /**
   * Optional custom fetch implementation. Defaults to the global fetch.
   */
  fetch?: typeof fetch;
  /**
   * Optional timeout in milliseconds for the guard request.
   */
  timeoutMs?: number;
  /**
   * Operation mode:
   * - 'analyze': Perform guard analysis via API (default)
   * - 'redact': Only redact sensitive data, no API call
   * - 'full': Perform guard analysis and include redacted text
   */
  mode?: "analyze" | "redact" | "full";
}

export interface GuardCallbacks {
  /**
   * Invoked when the guard rejects the command.
   */
  onBlock?: (reason: string) => void | Promise<void>;
  /**
   * Invoked when the guard approves the command.
   */
  onPass?: () => void | Promise<void>;
}

export interface GuardUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface GuardMessage {
  role: string;
  content?: string;
  reasoning_content?: string;
}

export interface GuardChoice {
  message: GuardMessage;
}

export interface AnalysisResponse {
  usage: GuardUsage;
  id: string;
  choices: GuardChoice[];
  [key: string]: unknown;
}

export interface GuardDecision {
  status: "pass" | "block";
  violation_types?: string[];
  cwe_codes?: string[];
  [key: string]: unknown;
}

export interface GuardResult {
  rejected: boolean;
  decision?: GuardDecision;
  usage?: GuardUsage;
  reasoning: string;
  raw: AnalysisResponse;
  redacted?: string;
}

export type GuardFunction = (
  command: string,
  callbacks?: GuardCallbacks
) => Promise<GuardResult>;

export class GuardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GuardError";
  }
}

function sanitizeUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function ensureFetch(fetchImpl: typeof fetch | undefined): typeof fetch {
  const resolved = fetchImpl ?? globalThis.fetch;
  if (!resolved) {
    throw new GuardError(
      "A fetch implementation is required. Provide one via options or run on a platform that supplies global fetch."
    );
  }
  return resolved.bind(globalThis);
}

function parseDecision(
  content: string | undefined
): GuardDecision | undefined {
  if (!content) {
    return undefined;
  }

  try {
    const payload = JSON.parse(content) as Record<string, unknown>;
    if (!payload || typeof payload !== "object") {
      return undefined;
    }

    const statusSource = payload.status ?? payload.classification;
    if (statusSource !== "pass" && statusSource !== "block") {
      return undefined;
    }

    const decision: GuardDecision = { status: statusSource };

    if (Array.isArray(payload.violation_types)) {
      decision.violation_types = payload.violation_types as string[];
    }

    if (Array.isArray(payload.cwe_codes)) {
      decision.cwe_codes = payload.cwe_codes as string[];
    }

    for (const [key, value] of Object.entries(payload)) {
      if (
        key === "status" ||
        key === "classification" ||
        key === "violation_types" ||
        key === "cwe_codes"
      ) {
        continue;
      }

      decision[key] = value;
    }

    return decision;
  } catch (error) {
    // The guard may occasionally return non-JSON text; treat that as undefined.
    return undefined;
  }
}

function normalizeReason(
  decision: GuardDecision | undefined,
  reasoning: string | undefined
): string {
  if (decision?.violation_types?.length) {
    return decision.violation_types.join(", ");
  }

  if (reasoning) {
    return reasoning;
  }

  if (decision?.status === "block") {
    return "Guard classified the command as malicious.";
  }

  return "Command approved by guard.";
}

export function createGuard(options: CreateGuardOptions): GuardFunction {
  const { apiBaseUrl, apiKey, fetch: fetchImpl, timeoutMs, mode = "analyze" } = options;

  const resolvedBaseUrl = apiBaseUrl ?? "https://app.superagent.sh/api/guard";

  if (!resolvedBaseUrl || typeof resolvedBaseUrl !== "string") {
    throw new GuardError("apiBaseUrl must be a non-empty string.");
  }

  if (!apiKey || typeof apiKey !== "string") {
    throw new GuardError("apiKey must be a non-empty string.");
  }

  const fetcher = ensureFetch(fetchImpl);
  const endpoint = sanitizeUrl(resolvedBaseUrl);

  return async function guard(
    command: string,
    callbacks: GuardCallbacks = {}
  ): Promise<GuardResult> {
    if (!command || typeof command !== "string") {
      throw new GuardError("command must be a non-empty string.");
    }

    // Redact-only mode: skip API call
    if (mode === "redact") {
      const redactedText = redactSensitiveData(command);
      return {
        rejected: false,
        reasoning: "Redaction only mode - no guard analysis performed",
        raw: {} as AnalysisResponse,
        redacted: redactedText,
      };
    }

    const controller =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutHandle =
      controller && timeoutMs
        ? setTimeout(() => controller.abort(), timeoutMs)
        : undefined;

    // Start redaction in parallel if mode is 'full' (non-blocking)
    const redactedPromise = mode === "full"
      ? Promise.resolve(redactSensitiveData(command))
      : Promise.resolve(undefined);

    let response: Response;
    try {
      response = await fetcher(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "x-superagent-api-key": apiKey,
        },
        body: JSON.stringify({ prompt: command }),
        signal: controller?.signal,
      } satisfies RequestInit);
    } catch (error) {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      const message =
        error instanceof Error ? error.message : "Unknown fetch error";
      throw new GuardError(`Failed to reach guard endpoint: ${message}`);
    }

    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
    }

    if (!response.ok) {
      throw new GuardError(
        `Guard request failed with status ${response.status}: ${response.statusText}`
      );
    }

    const analysis = (await response.json()) as AnalysisResponse;
    const decision = parseDecision(
      analysis?.choices?.[0]?.message?.content
    );
    const rawReasoning = analysis?.choices?.[0]?.message?.reasoning_content;
    const rejected = decision?.status === "block";

    const normalizedReason = normalizeReason(decision, rawReasoning);

    // Wait for redaction to complete (should already be done)
    const redactedText = await redactedPromise;

    const result: GuardResult = {
      rejected,
      decision,
      usage: analysis?.usage,
      reasoning: rawReasoning ?? normalizedReason,
      raw: analysis,
      ...(redactedText && { redacted: redactedText }),
    };

    if (rejected) {
      await callbacks.onBlock?.(normalizedReason);
    } else {
      await callbacks.onPass?.();
    }

    return result;
  };
}
