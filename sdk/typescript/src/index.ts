const GUARD_ENDPOINT = process.env.SUPERAGENT_LM_API_BASE_URL
  ? `${process.env.SUPERAGENT_LM_API_BASE_URL}/guard`
  : "https://app.superagent.sh/api/guard";
const REDACT_ENDPOINT = process.env.SUPERAGENT_LM_API_BASE_URL
  ? `${process.env.SUPERAGENT_LM_API_BASE_URL}/redact`
  : "https://app.superagent.sh/api/redact";

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
  /**
   * Optional whitelist of URLs that should not be redacted.
   * URLs not in this list will be replaced with <REDACTED_URL>.
   * Only applies when mode is 'redact' or 'full'.
   */
  urlWhitelist?: string[];
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

export interface RedactionResponse {
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

function ensureFetch(fetchImpl: typeof fetch | undefined): typeof fetch {
  const resolved = fetchImpl ?? globalThis.fetch;
  if (!resolved) {
    throw new GuardError(
      "A fetch implementation is required. Provide one via options or run on a platform that supplies global fetch."
    );
  }
  return resolved.bind(globalThis);
}

function parseDecision(content: string | undefined): GuardDecision | undefined {
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
  const {
    apiBaseUrl,
    apiKey,
    fetch: fetchImpl,
    timeoutMs,
    mode = "analyze",
    urlWhitelist,
  } = options;

  if (apiBaseUrl && typeof apiBaseUrl !== "string") {
    throw new GuardError("apiBaseUrl must be a non-empty string.");
  }

  if (!apiKey || typeof apiKey !== "string") {
    throw new GuardError("apiKey must be a non-empty string.");
  }

  const fetcher = ensureFetch(fetchImpl);

  return async function guard(
    command: string,
    callbacks: GuardCallbacks = {}
  ): Promise<GuardResult> {
    if (!command || typeof command !== "string") {
      throw new GuardError("command must be a non-empty string.");
    }

    // Redact-only mode: make API call to /api/redact
    if (mode === "redact") {
      const controller =
        typeof AbortController !== "undefined" ? new AbortController() : null;
      const timeoutHandle =
        controller && timeoutMs
          ? setTimeout(() => controller.abort(), timeoutMs)
          : undefined;

      let response: Response;
      try {
        response = await fetcher(REDACT_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "x-superagent-api-key": apiKey,
          },
          body: JSON.stringify({
            prompt: command,
            ...(urlWhitelist && { urlWhitelist }),
          }),
          signal: controller?.signal,
        } satisfies RequestInit);
      } catch (error) {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
        const message =
          error instanceof Error ? error.message : "Unknown fetch error";
        throw new GuardError(`Failed to reach redact endpoint: ${message}`);
      }

      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      if (!response.ok) {
        throw new GuardError(
          `Redact request failed with status ${response.status}: ${response.statusText}`
        );
      }

      const result = (await response.json()) as RedactionResponse;
      const content = result.choices[0].message.content;

      return {
        rejected: false,
        reasoning: result.choices[0].message.reasoning_content || "",
        raw: result,
        usage: result.usage,
        redacted: content as string,
      };
    }

    const controller =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutHandle =
      controller && timeoutMs
        ? setTimeout(() => controller.abort(), timeoutMs)
        : undefined;

    // Start redaction in parallel if mode is 'full' (non-blocking)
    const redactedPromise =
      mode === "full"
        ? (async () => {
            try {
              const redactResponse = await fetcher(REDACT_ENDPOINT, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${apiKey}`,
                  "x-superagent-api-key": apiKey,
                },
                body: JSON.stringify({
                  prompt: command,
                  ...(urlWhitelist && { urlWhitelist }),
                }),
              } satisfies RequestInit);

              if (!redactResponse.ok) {
                throw new GuardError(
                  `Redact request failed with status ${redactResponse.status}: ${redactResponse.statusText}`
                );
              }

              const result = (await redactResponse.json()) as RedactionResponse;
              const content = result.choices[0].message.content;
              return content as string;
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : "Unknown redaction error";
              throw new GuardError(`Failed to redact via API: ${message}`);
            }
          })()
        : Promise.resolve(undefined);

    let response: Response;
    try {
      response = await fetcher(GUARD_ENDPOINT, {
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
    const decision = parseDecision(analysis?.choices?.[0]?.message?.content);
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
