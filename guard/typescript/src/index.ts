export interface CreateGuardOptions {
  /**
   * Full URL to the guard endpoint (e.g. https://example.com/api/guard).
   */
  apiBaseUrl: string;
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

export interface GuardClassification {
  classification: "pass" | "block";
  violation_types?: string[];
  cwe_codes?: string[];
  [key: string]: unknown;
}

export interface GuardData {
  analysis: AnalysisResponse;
  classification?: GuardClassification;
}

export interface GuardResult {
  data: GuardData;
  rejected: boolean;
  reasoning?: string;
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

function parseClassification(
  content: string | undefined
): GuardClassification | undefined {
  if (!content) {
    return undefined;
  }

  try {
    const payload = JSON.parse(content) as GuardClassification;
    if (payload && payload.classification) {
      return payload;
    }
    return undefined;
  } catch (error) {
    // The guard may occasionally return non-JSON text; treat that as undefined.
    return undefined;
  }
}

function normalizeReason(
  classification: GuardClassification | undefined,
  reasoning: string | undefined
): string {
  if (classification?.violation_types?.length) {
    return classification.violation_types.join(", ");
  }

  if (reasoning) {
    return reasoning;
  }

  if (classification?.classification === "block") {
    return "Guard classified the command as malicious.";
  }

  return "Command approved by guard.";
}

export function createGuard(options: CreateGuardOptions): GuardFunction {
  const { apiBaseUrl, apiKey, fetch: fetchImpl, timeoutMs } = options;

  if (!apiBaseUrl || typeof apiBaseUrl !== "string") {
    throw new GuardError("apiBaseUrl must be a non-empty string.");
  }

  if (!apiKey || typeof apiKey !== "string") {
    throw new GuardError("apiKey must be a non-empty string.");
  }

  const fetcher = ensureFetch(fetchImpl);
  const endpoint = sanitizeUrl(apiBaseUrl);

  return async function guard(
    command: string,
    callbacks: GuardCallbacks = {}
  ): Promise<GuardResult> {
    if (!command || typeof command !== "string") {
      throw new GuardError("command must be a non-empty string.");
    }

    const controller =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutHandle =
      controller && timeoutMs
        ? setTimeout(() => controller.abort(), timeoutMs)
        : undefined;

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
    const classification = parseClassification(
      analysis?.choices?.[0]?.message?.content
    );
    const reasoning = analysis?.choices?.[0]?.message?.reasoning_content;
    const rejected = classification?.classification === "block";

    const result: GuardResult = {
      data: {
        analysis,
        classification,
      },
      rejected,
      reasoning,
    };

    const reason = normalizeReason(classification, reasoning);

    if (rejected) {
      await callbacks.onBlock?.(reason);
    } else {
      await callbacks.onPass?.();
    }

    return result;
  };
}
