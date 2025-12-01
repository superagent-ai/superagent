const GUARD_ENDPOINT = process.env.SUPERAGENT_LM_API_BASE_URL
  ? `${process.env.SUPERAGENT_LM_API_BASE_URL}/guard`
  : "https://app.superagent.sh/api/guard";
const REDACT_ENDPOINT = process.env.SUPERAGENT_LM_API_BASE_URL
  ? `${process.env.SUPERAGENT_LM_API_BASE_URL}/redact`
  : "https://app.superagent.sh/api/redact";
const VERIFY_ENDPOINT = process.env.SUPERAGENT_LM_API_BASE_URL
  ? `${process.env.SUPERAGENT_LM_API_BASE_URL}/verify`
  : "https://app.superagent.sh/api/verify";

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

export interface GuardOptions extends GuardCallbacks {
  /**
   * Optional system prompt that allows you to steer the guard REST API behavior
   * and customize the classification logic.
   */
  systemPrompt?: string;
}

export interface GuardUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface GuardMessageContent {
  classification: "pass" | "block";
  violation_types?: string[];
  cwe_codes?: string[];
  [key: string]: unknown;
}

export interface GuardMessage {
  role: string;
  content?: GuardMessageContent | string; // Support both object (new API) and string (backward compat)
  reasoning_content?: string; // Deprecated, use reasoning instead
  reasoning?: string;
}

export interface GuardChoice {
  message: GuardMessage;
  finish_reason?: string;
}

export interface AnalysisResponse {
  usage: GuardUsage;
  id: string;
  model?: string;
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
  pdf?: Blob; // PDF blob when format is "pdf"
  redacted_pdf?: string; // Base64 PDF data URL when file is provided with JSON response
}

export interface RedactOptions {
  /**
   * Array of URL prefixes that should not be redacted (only applies to text input).
   */
  urlWhitelist?: string[];
  /**
   * Array of natural language descriptions of PII entities to redact.
   * Examples: ["credit card numbers", "email addresses", "phone numbers"]
   */
  entities?: string[];
  /**
   * Output format: "json" returns JSON with redacted text (default), "pdf" returns a PDF file blob.
   * Only applies to file input.
   */
  format?: "json" | "pdf";
}

export interface Source {
  /**
   * The content of the source material
   */
  content: string;
  /**
   * The name or identifier of the source
   */
  name: string;
  /**
   * Optional URL of the source
   */
  url?: string;
}

export interface SourceReference {
  name: string;
  url: string;
}

export interface ClaimVerification {
  /**
   * The specific claim being verified from the input text
   */
  claim: string;
  /**
   * True if the claim is supported by the sources, false if contradicted or unverifiable
   */
  verdict: boolean;
  /**
   * List of sources used for this verification
   */
  sources: SourceReference[];
  /**
   * Relevant quotes or excerpts from the sources
   */
  evidence: string;
  /**
   * Brief reasoning for the verdict
   */
  reasoning: string;
}

export interface VerificationResult {
  claims: ClaimVerification[];
}

export interface VerifyResult {
  claims: ClaimVerification[];
  usage?: GuardUsage;
  raw: AnalysisResponse;
}

export interface Client {
  guard(
    input: string | File | Blob,
    options?: GuardOptions
  ): Promise<GuardResult>;
  redact(
    input: string | File | Blob,
    options?: RedactOptions
  ): Promise<RedactResult>;
  verify(text: string, sources: Source[]): Promise<VerifyResult>;
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

function parseDecision(
  content: GuardMessageContent | string | undefined
): GuardDecision | undefined {
  if (!content) {
    return undefined;
  }

  // Handle new API format where content is already an object
  let payload: Record<string, unknown>;
  if (typeof content === "object") {
    payload = content as Record<string, unknown>;
  } else {
    // Handle legacy format where content is a JSON string
    try {
      payload = JSON.parse(content) as Record<string, unknown>;
    } catch (error) {
      // The guard may occasionally return non-JSON text; treat that as undefined.
      return undefined;
    }
  }

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
  const verifyEndpoint = `${apiBaseUrl}/verify`;

  return {
    async guard(
      input: string | File | Blob,
      options: GuardOptions = {}
    ): Promise<GuardResult> {
      const { onBlock, onPass, systemPrompt } = options;

      // Determine if input is a file or text/URL
      // Check for File/Blob in a way that works in both browser and Node.js
      const isFile =
        typeof input !== "string" &&
        ((typeof File !== "undefined" && input instanceof File) ||
          (typeof Blob !== "undefined" && input instanceof Blob) ||
          // Node.js file-like objects
          (input && typeof input === "object" && "stream" in input));

      // Check if input string is a URL
      const isUrl =
        typeof input === "string" &&
        (input.startsWith("http://") || input.startsWith("https://"));

      if (!isFile && (!input || typeof input !== "string")) {
        throw new GuardError("input must be a non-empty string, file, or URL.");
      }

      const controller =
        typeof AbortController !== "undefined" ? new AbortController() : null;
      const timeoutHandle =
        controller && timeoutMs
          ? setTimeout(() => controller.abort(), timeoutMs)
          : undefined;

      let response: Response;
      try {
        if (isFile) {
          // Use multipart/form-data for file input
          const formData = new FormData();
          formData.append("text", ""); // Empty text when file is provided
          formData.append("file", input);

          if (systemPrompt) {
            formData.append("system_prompt", systemPrompt);
          }

          const headers: Record<string, string> = {
            Authorization: `Bearer ${apiKey}`,
            "x-superagent-api-key": apiKey,
            // Don't set Content-Type - browser/fetch will set it with boundary
          };

          response = await fetcher(guardEndpoint, {
            method: "POST",
            headers,
            body: formData,
            signal: controller?.signal,
          } satisfies RequestInit);
        } else if (isUrl) {
          // Use JSON for URL input
          const requestBody: Record<string, string> = { url: input };
          if (systemPrompt) {
            requestBody.system_prompt = systemPrompt;
          }

          response = await fetcher(guardEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
              "x-superagent-api-key": apiKey,
            },
            body: JSON.stringify(requestBody),
            signal: controller?.signal,
          } satisfies RequestInit);
        } else {
          // Use JSON for text input
          const requestBody: Record<string, string> = { text: input };
          if (systemPrompt) {
            requestBody.system_prompt = systemPrompt;
          }

          response = await fetcher(guardEndpoint, {
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

      // Handle JSON response (guard always returns JSON, even for PDF files)
      const analysis = (await response.json()) as AnalysisResponse;
      const message = analysis?.choices?.[0]?.message;
      const content = message?.content;
      const decision = parseDecision(content);
      // Support both new 'reasoning' field and legacy 'reasoning_content' field
      const rawReasoning = message?.reasoning ?? message?.reasoning_content;
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
        await onBlock?.(normalizedReason);
      } else {
        await onPass?.();
      }

      return result;
    },

    async redact(
      input: string | File | Blob,
      options?: RedactOptions
    ): Promise<RedactResult> {
      // Determine if input is a file or text
      // Check for File/Blob in a way that works in both browser and Node.js
      const isFile =
        typeof input !== "string" &&
        ((typeof File !== "undefined" && input instanceof File) ||
          (typeof Blob !== "undefined" && input instanceof Blob) ||
          // Node.js file-like objects
          (input && typeof input === "object" && "stream" in input));

      if (!isFile && (!input || typeof input !== "string")) {
        throw new GuardError("input must be a non-empty string or file.");
      }

      const controller =
        typeof AbortController !== "undefined" ? new AbortController() : null;
      const timeoutHandle =
        controller && timeoutMs
          ? setTimeout(() => controller.abort(), timeoutMs)
          : undefined;

      let response: Response;
      try {
        if (isFile) {
          // Use multipart/form-data for file input
          const formData = new FormData();
          formData.append("text", ""); // Empty text when file is provided
          formData.append("file", input);

          if (options?.format) {
            formData.append("format", options.format);
          }

          if (options?.entities && options.entities.length > 0) {
            formData.append("entities", JSON.stringify(options.entities));
          }

          const headers: Record<string, string> = {
            Authorization: `Bearer ${apiKey}`,
            "x-superagent-api-key": apiKey,
            // Don't set Content-Type - browser/fetch will set it with boundary
          };

          // Add Accept header if format is pdf to signal we want PDF response
          if (options?.format === "pdf") {
            headers.Accept = "application/pdf";
          }

          response = await fetcher(redactEndpoint, {
            method: "POST",
            headers,
            body: formData,
            signal: controller?.signal,
          } satisfies RequestInit);
        } else {
          // Use JSON for text input
          const requestBody: { text: string; entities?: string[] } = {
            text: input,
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
      const result = (await response.json()) as RedactionResponse & {
        redacted_pdf?: string;
      };
      let content = result.choices[0].message.content as string;

      // Apply URL whitelist locally if provided (only for text input)
      if (!isFile && options?.urlWhitelist) {
        content = applyUrlWhitelist(input, content, options.urlWhitelist);
      }

      return {
        redacted: content,
        reasoning:
          result.choices[0].message.reasoning ||
          result.choices[0].message.reasoning_content ||
          "",
        usage: result.usage,
        raw: result,
        redacted_pdf: result.redacted_pdf,
      };
    },

    async verify(text: string, sources: Source[]): Promise<VerifyResult> {
      if (!text || typeof text !== "string") {
        throw new GuardError("text must be a non-empty string.");
      }

      if (!sources || !Array.isArray(sources) || sources.length === 0) {
        throw new GuardError("sources must be a non-empty array.");
      }

      // Validate each source
      for (const source of sources) {
        if (!source.content || typeof source.content !== "string") {
          throw new GuardError(
            "Each source must have a 'content' field (string)"
          );
        }
        if (!source.name || typeof source.name !== "string") {
          throw new GuardError("Each source must have a 'name' field (string)");
        }
        if (source.url !== undefined && typeof source.url !== "string") {
          throw new GuardError("If provided, 'url' must be a string");
        }
      }

      const controller =
        typeof AbortController !== "undefined" ? new AbortController() : null;
      const timeoutHandle =
        controller && timeoutMs
          ? setTimeout(() => controller.abort(), timeoutMs)
          : undefined;

      let response: Response;
      try {
        response = await fetcher(verifyEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "x-superagent-api-key": apiKey,
          },
          body: JSON.stringify({ text, sources }),
          signal: controller?.signal,
        } satisfies RequestInit);
      } catch (error) {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
        const message =
          error instanceof Error ? error.message : "Unknown fetch error";
        throw new GuardError(`Failed to reach verify endpoint: ${message}`);
      }

      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      if (!response.ok) {
        throw new GuardError(
          `Verify request failed with status ${response.status}: ${response.statusText}`
        );
      }

      // Handle JSON response
      const result = (await response.json()) as AnalysisResponse & {
        choices: Array<{
          message: {
            role: string;
            content: VerificationResult;
          };
        }>;
      };
      const content = result.choices[0].message.content;
      const claims = content.claims;

      return {
        claims,
        usage: result.usage,
        raw: result,
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
    return isWhitelisted ? url : "<URL_REDACTED>";
  });
}
