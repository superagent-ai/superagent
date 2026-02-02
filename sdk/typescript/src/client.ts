import type {
  ClientConfig,
  GuardOptions,
  RedactOptions,
  ScanOptions,
  GuardClassificationResult,
  RedactResult,
  GuardResponse,
  RedactResponse,
  ScanResponse,
  ChatMessage,
  TokenUsage,
  MultimodalContentPart,
  ProcessedInput,
} from "./types.js";
import {
  callProvider,
  parseModel,
  DEFAULT_GUARD_MODEL,
} from "./providers/index.js";
import {
  buildGuardUserMessage,
  buildGuardSystemPrompt,
} from "./prompts/guard.js";
import {
  buildRedactSystemPrompt,
  buildRedactUserMessage,
} from "./prompts/redact.js";
import { GUARD_RESPONSE_FORMAT, REDACT_RESPONSE_FORMAT } from "./schemas.js";
import { processInput, isVisionModel } from "./utils/input-processor.js";

/**
 * Split text into chunks at word boundaries
 * @param text The text to chunk
 * @param chunkSize Maximum characters per chunk (must be positive)
 * @returns Array of text chunks
 */
function chunkText(text: string, chunkSize: number): string[] {
  // Validate chunkSize is positive
  if (chunkSize <= 0) {
    throw new Error(`chunkSize must be positive, got ${chunkSize}`);
  }

  if (text.length <= chunkSize) return [text];

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + chunkSize, text.length);
    // Find word boundary (don't split mid-word)
    if (end < text.length) {
      const lastSpace = text.lastIndexOf(" ", end);
      if (lastSpace > start) end = lastSpace;
    }
    chunks.push(text.slice(start, end).trim());
    start = end;
  }
  return chunks.filter((c) => c.length > 0);
}

/**
 * Aggregate multiple guard results using OR logic
 * Block if ANY chunk is blocked, merge all violations
 */
function aggregateGuardResults(results: GuardResponse[]): GuardResponse {
  const hasBlock = results.some((r) => r.classification === "block");

  // Collect reasoning from blocked results, or from first result if all pass
  const blockedResults = results.filter((r) => r.classification === "block");
  const reasoning =
    blockedResults.length > 0
      ? blockedResults.map((r) => r.reasoning).join(" ")
      : results[0]?.reasoning ?? "";

  return {
    classification: hasBlock ? "block" : "pass",
    reasoning,
    violation_types: [...new Set(results.flatMap((r) => r.violation_types))],
    cwe_codes: [...new Set(results.flatMap((r) => r.cwe_codes))],
    usage: {
      promptTokens: results.reduce((sum, r) => sum + r.usage.promptTokens, 0),
      completionTokens: results.reduce(
        (sum, r) => sum + r.usage.completionTokens,
        0
      ),
      totalTokens: results.reduce((sum, r) => sum + r.usage.totalTokens, 0),
    },
  };
}

/**
 * Parse JSON response, handling both direct JSON and JSON wrapped in markdown code blocks
 */
function parseJsonResponse<T>(content: string): T {
  const trimmed = content.trim();

  // Try direct parse first (already valid JSON)
  try {
    return JSON.parse(trimmed);
  } catch {
    // Extract from markdown code block
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match?.[1]) {
      return JSON.parse(match[1].trim());
    }
    throw new Error(`Failed to parse JSON response: ${content}`);
  }
}

/**
 * Check if provider and model support structured output
 */
function supportsStructuredOutput(modelString: string): boolean {
  const { provider, model } = parseModel(modelString);

  if (provider === "openai") {
    return true;
  }

  if (provider === "openai-compatible") {
    const flag = process.env.OPENAI_COMPATIBLE_SUPPORTS_STRUCTURED_OUTPUT;
    if (!flag) return false;
    return !/^(false|0|no|off)$/i.test(flag.trim().toLowerCase());
  }

  // Vercel AI Gateway uses OpenAI-compatible API format with structured output support
  if (provider === "vercel") {
    return true;
  }

  // Google supports structured outputs via generationConfig with responseSchema
  if (provider === "google") {
    return true;
  }

  // Bedrock supports structured outputs via toolConfig with tool specifications
  if (provider === "bedrock") {
    return true;
  }

  // Groq supports structured outputs only for specific models
  if (provider === "groq") {
    // Only these Groq models support structured outputs:
    // - gpt-oss-20b
    // - gpt-oss-120b
    // - gpt-oss-safeguard-20b
    // - kimi-k2-instruct-0905
    // - llama-4-maverick-17b-128e-instruct
    // - llama-4-scout-17b-16e-instruct
    return (
      model.includes("gpt-oss-20b") ||
      model.includes("gpt-oss-120b") ||
      model.includes("gpt-oss-safeguard-20b") ||
      model.includes("kimi-k2-instruct-0905") ||
      model.includes("llama-4-maverick-17b-128e-instruct") ||
      model.includes("llama-4-scout-17b-16e-instruct")
    );
  }

  // Fireworks supports structured outputs only for specific models
  if (provider === "fireworks") {
    // Only these Fireworks models support structured outputs:
    // - gpt-oss-20b
    // - gpt-oss-120b
    // - gpt-oss-safeguard-20b
    // - gpt-oss-safeguard-120b
    // - kimi-k2-instruct-0905
    // - llama-4-maverick-17b-128e-instruct
    // - llama-4-scout-17b-16e-instruct
    return (
      model.includes("gpt-oss-20b") ||
      model.includes("gpt-oss-120b") ||
      model.includes("gpt-oss-safeguard-20b") ||
      model.includes("gpt-oss-safeguard-120b") ||
      model.includes("kimi-k2-instruct-0905") ||
      model.includes("llama-4-maverick-17b-128e-instruct") ||
      model.includes("llama-4-scout-17b-16e-instruct")
    );
  }

  if (provider === "anthropic") {
    // Structured outputs are only supported for Claude Sonnet 4.5 and Claude Opus 4.1
    // Check if model name contains "sonnet-4-5" or "opus-4-1"
    return (
      model.includes("sonnet-4-5") ||
      model.includes("opus-4-1") ||
      model === "claude-sonnet-4-5" ||
      model === "claude-opus-4-1"
    );
  }

  // OpenRouter supports structured outputs for many models
  // Models with structured_outputs in their supported_parameters array
  if (provider === "openrouter") {
    // OpenAI models via OpenRouter - most support structured outputs except safeguard
    if (model.startsWith("openai/")) {
      // gpt-oss-safeguard-20b does NOT support structured outputs
      if (model.includes("safeguard")) {
        return false;
      }
      return true;
    }
    // Google Gemini models via OpenRouter
    if (model.startsWith("google/gemini-")) {
      return true;
    }
    // Google Gemma models via OpenRouter
    if (model.startsWith("google/gemma-")) {
      return (
        model.includes("gemma-2-27b") ||
        model.includes("gemma-3-12b") ||
        model.includes("gemma-3-27b")
      );
    }
    // Anthropic Claude models via OpenRouter (only opus-4.1, opus-4.5, sonnet-4.5)
    if (model.startsWith("anthropic/")) {
      return (
        model.includes("opus-4.1") ||
        model.includes("opus-4.5") ||
        model.includes("sonnet-4.5")
      );
    }
    // Meta Llama models via OpenRouter
    if (model.startsWith("meta-llama/")) {
      return (
        model.includes("llama-3-70b") ||
        model.includes("llama-3.1-405b") ||
        model.includes("llama-3.1-8b") ||
        model.includes("llama-3.3-70b") ||
        model.includes("llama-4-maverick") ||
        model.includes("llama-4-scout")
      );
    }
    // Mistral models via OpenRouter - most support structured outputs
    // Excludes: mistral-7b-instruct variants, mixtral-8x7b, devstral-small-2505
    if (model.startsWith("mistralai/")) {
      // These specific models do NOT support structured outputs
      if (
        model.includes("mistral-7b-instruct") ||
        model.includes("mixtral-8x7b") ||
        model.includes("devstral-small-2505")
      ) {
        return false;
      }
      return (
        model.includes("codestral") ||
        model.includes("devstral") ||
        model.includes("magistral") ||
        model.includes("ministral") ||
        model.includes("mistral-large") ||
        model.includes("mistral-medium") ||
        model.includes("mistral-nemo") ||
        model.includes("mistral-saba") ||
        model.includes("mistral-small") ||
        model.includes("mistral-tiny") ||
        model.includes("mixtral-8x22b") ||
        model.includes("pixtral") ||
        model.includes("voxtral")
      );
    }
    // DeepSeek models via OpenRouter
    // Excludes: deepseek-prover-v2, deepseek-v3.2-speciale
    if (model.startsWith("deepseek/")) {
      if (
        model.includes("deepseek-prover") ||
        model.includes("deepseek-v3.2-speciale")
      ) {
        return false;
      }
      return (
        model.includes("deepseek-chat") ||
        model.includes("deepseek-r1") ||
        model.includes("deepseek-v3")
      );
    }
    // Qwen models via OpenRouter
    if (model.startsWith("qwen/")) {
      return (
        model.includes("qwen-2.5-72b") ||
        model.includes("qwen-2.5-coder-32b") ||
        model.includes("qwen-plus-2025") ||
        model.includes("qwen2.5-coder") ||
        model.includes("qwen2.5-vl") ||
        model.includes("qwen3-") ||
        model.includes("qwq-32b")
      );
    }
    // Cohere models via OpenRouter
    if (model.startsWith("cohere/")) {
      return true;
    }
    // X.AI Grok models via OpenRouter
    if (model.startsWith("x-ai/")) {
      return (
        model.includes("grok-3") ||
        model.includes("grok-4") ||
        model.includes("grok-code")
      );
    }
    // Z-AI GLM models via OpenRouter
    if (model.startsWith("z-ai/")) {
      return model.includes("glm-4.5") || model.includes("glm-4.6");
    }
    // Moonshot AI Kimi models via OpenRouter
    if (model.startsWith("moonshotai/")) {
      return model.includes("kimi-");
    }
    // Microsoft models via OpenRouter
    if (model.startsWith("microsoft/")) {
      return model.includes("mai-ds-r1") || model.includes("phi-4");
    }
    // NousResearch Hermes models via OpenRouter
    if (model.startsWith("nousresearch/")) {
      return (
        model.includes("hermes-2-pro") ||
        model.includes("hermes-3-") ||
        model.includes("hermes-4-") ||
        model.includes("deephermes-3-")
      );
    }
    // DeepCogito models via OpenRouter
    if (model.startsWith("deepcogito/")) {
      return model.includes("cogito-v2");
    }
    // TNG Tech models via OpenRouter
    if (model.startsWith("tngtech/")) {
      return true;
    }
    // Inception models via OpenRouter
    if (model.startsWith("inception/")) {
      return model.includes("mercury");
    }
    // AllenAI OLMo models via OpenRouter
    if (model.startsWith("allenai/")) {
      return model.includes("olmo-3-");
    }
    // Arcee AI models via OpenRouter
    if (model.startsWith("arcee-ai/")) {
      return model.includes("trinity-mini");
    }
    // NVIDIA models via OpenRouter
    if (model.startsWith("nvidia/")) {
      return model.includes("nemotron-ultra");
    }
    // Prime Intellect models via OpenRouter
    if (model.startsWith("prime-intellect/")) {
      return model.includes("intellect-3");
    }
    // NeverSleep models via OpenRouter
    if (model.startsWith("neversleep/")) {
      return true;
    }
    // Minimax models via OpenRouter
    if (model.startsWith("minimax/")) {
      return model.includes("minimax-m2");
    }
    // Baidu ERNIE models via OpenRouter
    if (model.startsWith("baidu/")) {
      return model.includes("ernie-4.5-300b");
    }
    // Alibaba models via OpenRouter
    if (model.startsWith("alibaba/")) {
      return model.includes("tongyi-deepresearch");
    }
    // Perplexity models via OpenRouter
    if (model.startsWith("perplexity/")) {
      return model.includes("sonar-pro-search");
    }
    // Stepfun AI models via OpenRouter
    if (model.startsWith("stepfun-ai/")) {
      return model.includes("step3");
    }
    // Tencent models via OpenRouter
    if (model.startsWith("tencent/")) {
      return model.includes("hunyuan");
    }
    // TheDrummer models via OpenRouter
    if (model.startsWith("thedrummer/")) {
      return (
        model.includes("cydonia") ||
        model.includes("rocinante") ||
        model.includes("unslopnemo")
      );
    }
    // Sao10k models via OpenRouter
    if (model.startsWith("sao10k/")) {
      return (
        model.includes("l3-lunaris") ||
        model.includes("l3.1-euryale") ||
        model.includes("l3.3-euryale")
      );
    }
    // OpenGVLab models via OpenRouter
    if (model.startsWith("opengvlab/")) {
      return model.includes("internvl3");
    }
    // ArliAI models via OpenRouter
    if (model.startsWith("arliai/")) {
      return model.includes("qwq-32b");
    }
    // Gryphe models via OpenRouter
    if (model.startsWith("gryphe/")) {
      return model.includes("mythomax");
    }
    // Undi95 models via OpenRouter
    if (model.startsWith("undi95/")) {
      return model.includes("remm-slerp");
    }
    return false;
  }

  return false;
}

/**
 * Safety Agent Client
 * Provides guardrail methods for content safety
 */
export class SafetyClient {
  private apiKey: string;

  constructor(config?: ClientConfig) {
    const apiKey = config?.apiKey ?? process.env.SUPERAGENT_API_KEY;
    if (!apiKey) {
      throw new Error(
        "API key is required. Provide via createClient({ apiKey }) or SUPERAGENT_API_KEY env var"
      );
    }
    this.apiKey = apiKey;
  }

  /**
   * Post usage metrics to Superagent dashboard (fire and forget)
   */
  private postUsage(usage: TokenUsage): void {
    fetch("https://superagent.sh/api/billing/usage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: JSON.stringify({ token_count: usage.totalTokens }),
    }).catch(() => {}); // Fire and forget - ignore errors
  }

  /**
   * Guard a single chunk of text input (internal method)
   * @param input The input text to analyze
   * @param systemPrompt Optional custom system prompt
   * @param model The model to use
   * @returns Response with classification result and token usage
   */
  private async guardSingleText(
    input: string,
    systemPrompt: string | undefined,
    model: string
  ): Promise<GuardResponse> {
    const isSuperagent = model.startsWith("superagent/");
    // Use default system prompt for superagent if none provided, otherwise use custom or default
    const finalSystemPrompt = isSuperagent
      ? systemPrompt || buildGuardSystemPrompt()
      : buildGuardSystemPrompt(systemPrompt);

    const messages: ChatMessage[] = [];
    if (finalSystemPrompt) {
      messages.push({ role: "system", content: finalSystemPrompt });
    }
    // Superagent model expects input directly without wrapper
    const userContent = isSuperagent ? input : buildGuardUserMessage(input);
    messages.push({ role: "user", content: userContent });

    // Use structured output for OpenAI, JSON mode hint in prompt for others
    const responseFormat = supportsStructuredOutput(model)
      ? GUARD_RESPONSE_FORMAT
      : undefined;
    const response = await callProvider(model, messages, responseFormat);
    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response content from provider");
    }

    try {
      const parsed = parseJsonResponse<GuardClassificationResult>(content);
      return {
        classification: parsed.classification,
        reasoning: parsed.reasoning ?? "",
        violation_types: parsed.violation_types ?? [],
        cwe_codes: parsed.cwe_codes ?? [],
        usage: response.usage,
      };
    } catch {
      throw new Error(`Failed to parse guard response: ${content}`);
    }
  }

  /**
   * Guard an image input using vision model (internal method)
   * @param processed The processed image input
   * @param systemPrompt Optional custom system prompt
   * @param model The model to use (must support vision)
   * @returns Response with classification result and token usage
   */
  private async guardImage(
    processed: ProcessedInput,
    systemPrompt: string | undefined,
    model: string
  ): Promise<GuardResponse> {
    if (!isVisionModel(model)) {
      throw new Error(
        `Model ${model} does not support vision. Use a vision-capable model like gpt-4o, claude-3-*, or gemini-*.`
      );
    }

    const isSuperagent = model.startsWith("superagent/");
    // Use default system prompt for superagent if none provided, otherwise use custom or default
    const finalSystemPrompt = isSuperagent
      ? systemPrompt || buildGuardSystemPrompt()
      : buildGuardSystemPrompt(systemPrompt);

    // Build multimodal content for image analysis
    const imageDataUrl = `data:${processed.mimeType};base64,${processed.imageBase64}`;
    const userContent: MultimodalContentPart[] = [
      {
        type: "image_url",
        image_url: { url: imageDataUrl },
      },
    ];

    const messages: ChatMessage[] = [];
    if (finalSystemPrompt) {
      messages.push({ role: "system", content: finalSystemPrompt });
    }
    messages.push({ role: "user", content: userContent });

    // Use structured output for supported models
    const responseFormat = supportsStructuredOutput(model)
      ? GUARD_RESPONSE_FORMAT
      : undefined;
    const response = await callProvider(model, messages, responseFormat);
    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response content from provider");
    }

    try {
      const parsed = parseJsonResponse<GuardClassificationResult>(content);
      return {
        classification: parsed.classification,
        reasoning: parsed.reasoning ?? "",
        violation_types: parsed.violation_types ?? [],
        cwe_codes: parsed.cwe_codes ?? [],
        usage: response.usage,
      };
    } catch {
      throw new Error(`Failed to parse guard response: ${content}`);
    }
  }

  /**
   * Guard method - Classifies input as pass/block
   * Supports text strings, URLs, and Blob/File inputs.
   * - Plain text: analyzed directly
   * - URLs starting with http(s)://: fetched and analyzed
   * - Blob/File: analyzed based on MIME type (images use vision models)
   *
   * For text inputs, automatically chunks large inputs and processes them in parallel.
   * Uses OR logic: blocks if ANY chunk is classified as "block".
   * @param options Guard options including input, model, and optional additional instructions
   * @returns Response with classification result and token usage
   */
  async guard(options: GuardOptions): Promise<GuardResponse> {
    const {
      input,
      systemPrompt,
      model = DEFAULT_GUARD_MODEL,
      chunkSize = 8000,
    } = options;

    // Validate chunkSize is non-negative
    if (chunkSize < 0) {
      throw new Error(`chunkSize must be non-negative, got ${chunkSize}`);
    }

    // Process the input (handle URLs, Blobs, etc.)
    const processed = await processInput(input);

    // Handle image inputs with vision models
    if (processed.type === "image") {
      const result = await this.guardImage(processed, systemPrompt, model);
      this.postUsage(result.usage);
      return result;
    }

    // Handle PDF inputs - analyze each page in parallel
    if (processed.type === "pdf" && processed.pages) {
      // Filter out empty pages
      const nonEmptyPages = processed.pages.filter(
        (page) => page.trim().length > 0
      );

      if (nonEmptyPages.length === 0) {
        // PDF has no extractable text, return pass
        const emptyResult: GuardResponse = {
          classification: "pass",
          reasoning: "PDF contains no extractable text content to analyze.",
          violation_types: [],
          cwe_codes: [],
          usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        };
        return emptyResult;
      }

      // Analyze each page in parallel (similar to chunking strategy)
      const results = await Promise.all(
        nonEmptyPages.map((pageText) =>
          this.guardSingleText(pageText, systemPrompt, model)
        )
      );

      // Aggregate with OR logic - block if ANY page contains violation
      const aggregated = aggregateGuardResults(results);
      this.postUsage(aggregated.usage);
      return aggregated;
    }

    // Handle text inputs (including document text)
    const text = processed.text ?? "";

    // Skip chunking if disabled (chunkSize=0) or input is small enough
    if (chunkSize === 0 || text.length <= chunkSize) {
      const result = await this.guardSingleText(text, systemPrompt, model);
      this.postUsage(result.usage);
      return result;
    }

    // Chunk and process in parallel
    const chunks = chunkText(text, chunkSize);
    const results = await Promise.all(
      chunks.map((chunk) => this.guardSingleText(chunk, systemPrompt, model))
    );

    // Aggregate with OR logic
    const aggregated = aggregateGuardResults(results);
    this.postUsage(aggregated.usage);
    return aggregated;
  }

  /**
   * Redact method - Sanitizes sensitive/dangerous content
   * @param options Redact options including input, model, and optional entities to redact
   * @returns Response with redacted text, findings, and token usage
   */
  async redact(options: RedactOptions): Promise<RedactResponse> {
    const { input, entities, model, rewrite } = options;

    const systemPrompt = buildRedactSystemPrompt(entities, rewrite);

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: buildRedactUserMessage(input) },
    ];

    // Use structured output for OpenAI, JSON mode hint in prompt for others
    const responseFormat = supportsStructuredOutput(model)
      ? REDACT_RESPONSE_FORMAT
      : undefined;
    const response = await callProvider(model, messages, responseFormat);
    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response content from provider");
    }

    try {
      const parsed = parseJsonResponse<RedactResult>(content);
      const redactResponse: RedactResponse = {
        redacted: parsed.redacted,
        findings: parsed.findings ?? [],
        usage: response.usage,
      };
      this.postUsage(redactResponse.usage);
      return redactResponse;
    } catch {
      throw new Error(`Failed to parse redact response: ${content}`);
    }
  }

  /**
   * Scan method - Scans a repository for AI agent-targeted attacks
   *
   * This method clones a repository into a Modal sandbox, runs OpenCode
   * with a security-focused prompt to detect threats like repo poisoning,
   * prompt injections, and malicious instructions.
   *
   * @param options Scan options including repo URL, branch, and model
   * @returns Response with classification, findings, and summary
   *
   * @example
   * ```typescript
   * const result = await client.scan({
   *   repo: "https://github.com/user/repo",
   *   branch: "main",
   * });
   *
   * console.log(report);
   * ```
   */
  async scan(options: ScanOptions): Promise<ScanResponse> {
    const { repo, branch, model = "anthropic/claude-sonnet-4-5" } = options;

    // Validate repo URL
    if (!repo || typeof repo !== "string") {
      throw new Error("Repository URL is required");
    }

    if (!repo.startsWith("https://") && !repo.startsWith("git@")) {
      throw new Error("Repository URL must start with https:// or git@");
    }

    // Run scan in Daytona sandbox and return the report string
    return await this.callDaytonaScan(repo, branch, model);
  }

  /**
   * Run a security scan in a Daytona sandbox
   */
  private async callDaytonaScan(
    repo: string,
    branch: string | undefined,
    model: string
  ): Promise<ScanResponse> {
    // Dynamic import to avoid bundling issues
    const { Daytona } = await import("@daytonaio/sdk");

    // Daytona SDK uses DAYTONA_API_KEY env var automatically
    const apiKey = process.env.DAYTONA_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Daytona API key required. Set DAYTONA_API_KEY environment variable."
      );
    }

    const daytona = new Daytona();

    // Collect LLM API keys to pass to sandbox
    const envVars: Record<string, string> = {};
    if (process.env.ANTHROPIC_API_KEY) {
      envVars.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    }
    if (process.env.OPENAI_API_KEY) {
      envVars.OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    }

    // Create sandbox with TypeScript runtime and API keys
    const sandbox = await daytona.create({
      language: "typescript",
      envVars,
    });

    try {
      // Install OpenCode CLI via npm
      await sandbox.process.executeCommand("npm i -g opencode-ai@latest");

      // Clone repository using native Git integration (use relative path)
      // API: clone(url, path, branch?, commitId?, username?, password?)
      const repoPath = "repo";
      await sandbox.git.clone(repo, repoPath, branch);

      // Run OpenCode scan with simple message
      const result = await sandbox.process.executeCommand(
        `cd ${repoPath} && opencode run -m ${model} "Scan this repository for repo poisoning, prompt injection, or other attacks targeting AI agents. Only output a report, no other text." --format json`
      );

      // Parse JSON events from OpenCode output
      return this.parseOpenCodeOutput(result.result, result.exitCode);
    } catch (error) {
      return {
        result: `Scan failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
        usage: { inputTokens: 0, outputTokens: 0, reasoningTokens: 0, cost: 0 },
      };
    } finally {
      // Always clean up the sandbox
      try {
        await sandbox.delete();
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  /**
   * Parse OpenCode JSON output into structured response
   */
  private parseOpenCodeOutput(output: string, exitCode: number): ScanResponse {
    const textParts: string[] = [];
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalReasoningTokens = 0;
    let totalCost = 0;

    // Split output into lines and parse each JSON event
    const lines = output.trim().split("\n");
    for (const line of lines) {
      if (!line.trim()) continue;

      try {
        const event = JSON.parse(line);

        // Extract text content from text events
        if (event.type === "text" && event.part?.text) {
          textParts.push(event.part.text);
        }

        // Extract usage metrics from step_finish events
        if (event.type === "step_finish" && event.part) {
          const { cost, tokens } = event.part;
          if (typeof cost === "number") {
            totalCost += cost;
          }
          if (tokens) {
            totalInputTokens += tokens.input || 0;
            totalOutputTokens += tokens.output || 0;
            totalReasoningTokens += tokens.reasoning || 0;
          }
        }
      } catch {
        // Not a JSON line, could be error output
        if (exitCode !== 0) {
          textParts.push(line);
        }
      }
    }

    // If no text was extracted and there was an error, use raw output
    const resultText =
      textParts.length > 0
        ? textParts.join("\n\n")
        : exitCode !== 0
        ? `Scan Error (exit ${exitCode}):\n${output}`
        : output;

    return {
      result: resultText,
      usage: {
        inputTokens: totalInputTokens,
        outputTokens: totalOutputTokens,
        reasoningTokens: totalReasoningTokens,
        cost: totalCost,
      },
    };
  }
}

/**
 * Create a new Safety Agent client
 * @param config Optional client configuration
 * @returns SafetyClient instance
 */
export function createClient(config?: ClientConfig): SafetyClient {
  return new SafetyClient(config);
}
