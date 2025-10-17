const GUARD_ENDPOINT = process.env.SUPERAGENT_LM_API_BASE_URL
  ? `${process.env.SUPERAGENT_LM_API_BASE_URL}/guard`
  : "https://app.superagent.sh/api/guard";
const REDACT_ENDPOINT = process.env.SUPERAGENT_LM_API_BASE_URL
  ? `${process.env.SUPERAGENT_LM_API_BASE_URL}/redact`
  : "https://app.superagent.sh/api/redact";

export interface CreateClientOptions {
  /**
   * Base URL for the API (e.g. https://app.superagent.sh/api).
   */
  apiBaseUrl?: string;
  /**
   * API key used to authenticate requests.
   */
  apiKey: string;
  /**
   * Optional custom fetch implementation. Defaults to the global fetch.
   */
  fetch?: typeof fetch;
  /**
   * Optional timeout in milliseconds for requests.
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
  reasoning?: string; // New field from updated API
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
}

export interface RedactResult {
  redacted: string;
  reasoning: string;
  usage?: GuardUsage;
  raw: RedactionResponse | Record<string, never>;
  pdf?: Blob;  // PDF blob when format is "pdf"
  redacted_pdf?: string; // Base64 PDF data URL when file is provided with JSON response
}

export interface RedactOptions {
  /**
   * Array of URL prefixes that should not be redacted.
   */
  urlWhitelist?: string[];
  /**
   * Array of natural language descriptions of PII entities to redact.
   * Examples: ["credit card numbers", "email addresses", "phone numbers"]
   */
  entities?: string[];
  /**
   * File to redact (e.g., PDF document). When provided, multipart/form-data is used.
   */
  file?: File | Blob;
  /**
   * Output format: "json" returns JSON with redacted text (default), "pdf" returns a PDF file blob.
   * When "pdf" is used with a file input, the API returns a redacted PDF file.
   */
  format?: "json" | "pdf";
}

export interface Client {
  guard(command: string, callbacks?: GuardCallbacks): Promise<GuardResult>;
  redact(text: string, options?: RedactOptions): Promise<RedactResult>;
}

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

export function createClient(options: CreateClientOptions): Client {
  const {
    apiBaseUrl = "https://app.superagent.sh/api",
    apiKey,
    fetch: fetchImpl,
    timeoutMs,
  } = options;

  if (!apiKey || typeof apiKey !== "string") {
    throw new GuardError("apiKey must be a non-empty string.");
  }

  const fetcher = ensureFetch(fetchImpl);
  const guardEndpoint = `${apiBaseUrl}/guard`;
  const redactEndpoint = `${apiBaseUrl}/redact`;

  return {
    async guard(
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
      response = await fetcher(guardEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "x-superagent-api-key": apiKey,
        },
        body: JSON.stringify({ text: command }),
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

    const result: GuardResult = {
      rejected,
      decision,
      usage: analysis?.usage,
      reasoning: rawReasoning ?? normalizedReason,
      raw: analysis,
    };

    if (rejected) {
      await callbacks.onBlock?.(normalizedReason);
    } else {
      await callbacks.onPass?.();
    }

    return result;
  },

    async redact(
      text: string,
      options?: RedactOptions
    ): Promise<RedactResult> {
      if (!text || typeof text !== "string") {
        throw new GuardError("text must be a non-empty string.");
      }

      const controller =
        typeof AbortController !== "undefined" ? new AbortController() : null;
      const timeoutHandle =
        controller && timeoutMs
          ? setTimeout(() => controller.abort(), timeoutMs)
          : undefined;

      let response: Response;
      try {
        // Use multipart/form-data when file is provided
        if (options?.file) {
          const formData = new FormData();
          formData.append("text", text);
          formData.append("file", options.file);

          if (options.format) {
            formData.append("format", options.format);
          }

          if (options.entities && options.entities.length > 0) {
            formData.append("entities", JSON.stringify(options.entities));
          }

          const headers: Record<string, string> = {
            Authorization: `Bearer ${apiKey}`,
            "x-superagent-api-key": apiKey,
            // Don't set Content-Type - browser/fetch will set it with boundary
          };

          // Add Accept header if format is pdf to signal we want PDF response
          if (options.format === "pdf") {
            headers.Accept = "application/pdf";
          }

          response = await fetcher(redactEndpoint, {
            method: "POST",
            headers,
            body: formData,
            signal: controller?.signal,
          } satisfies RequestInit);
        } else {
          // Use JSON when no file is provided
          const requestBody: { text: string; entities?: string[] } = {
            text: text,
          };

          // Include entities in request body if provided
          if (options?.entities && options.entities.length > 0) {
            requestBody.entities = options.entities;
          }

          response = await fetcher(redactEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
              "x-superagent-api-key": apiKey,
            },
            body: JSON.stringify(requestBody),
            signal: controller?.signal,
          } satisfies RequestInit);
        }
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

      // Check if response is PDF
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/pdf")) {
        // Return PDF blob
        const pdfBlob = await response.blob();

        // Try to get usage stats from X-Redaction-Stats header
        const statsHeader = response.headers.get("X-Redaction-Stats");
        let usage: GuardUsage | undefined;
        if (statsHeader) {
          try {
            usage = JSON.parse(statsHeader);
          } catch {
            // Ignore parsing errors
          }
        }

        return {
          redacted: "", // Empty string for PDF responses
          reasoning: "PDF file redacted",
          pdf: pdfBlob,
          usage,
          raw: {},
        };
      }

      // Handle JSON response
      const result = (await response.json()) as RedactionResponse & { redacted_pdf?: string };
      let content = result.choices[0].message.content as string;

      // Apply URL whitelist locally if provided
      if (options?.urlWhitelist) {
        content = applyUrlWhitelist(text, content, options.urlWhitelist);
      }

      return {
        redacted: content,
        reasoning: result.choices[0].message.reasoning || result.choices[0].message.reasoning_content || "",
        usage: result.usage,
        raw: result,
        redacted_pdf: result.redacted_pdf,
      };
    },
  };
}

function applyUrlWhitelist(
  original: string,
  redacted: string,
  whitelist: string[]
): string {
  // Extract all URLs from the redacted text
  const urlPattern = /https?:\/\/[^\s<>"']+/g;

  // Replace URLs in the redacted text
  return redacted.replace(urlPattern, (url) => {
    // Check if URL matches any whitelist entry (prefix match)
    const isWhitelisted = whitelist.some((whitelisted) =>
      url.startsWith(whitelisted)
    );

    // Keep whitelisted URLs, redact others
    return isWhitelisted ? url : '<URL_REDACTED>';
  });
}
