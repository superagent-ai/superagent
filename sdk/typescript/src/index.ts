/**
 * safety-agent
 * A lightweight TypeScript guardrail SDK for content safety
 */

// Main client exports
export { createClient, SafetyClient } from "./client.js";

// Type exports
export type {
  ClientConfig,
  GuardInput,
  GuardOptions,
  GuardHooks,
  GuardStartEvent,
  GuardSegmentEvent,
  GuardResultEvent,
  GuardErrorEvent,
  GuardSegmentKind,
  GuardInputUnits,
  RedactOptions,
  ScanOptions,
  GuardClassificationResult,
  RedactResult,
  GuardResponse,
  RedactResponse,
  ScanResponse,
  ScanUsage,
  ChatMessage,
  MultimodalContentPart,
  ProcessedInput,
  AnalysisResponse,
  TokenUsage,
  ParsedModel,
  SupportedModel,
} from "./types.js";

// Utility exports
export { processInput, isVisionModel } from "./utils/input-processor.js";

// Provider exports (for advanced usage)
export { providers, parseModel, getProvider } from "./providers/index.js";
export type {
  ProviderConfig,
  ResponseFormat,
  JsonSchema,
} from "./providers/types.js";

// Schema exports (for customization)
export { GUARD_RESPONSE_FORMAT, REDACT_RESPONSE_FORMAT } from "./schemas.js";

// Prompt exports (for customization)
export {
  GUARD_SYSTEM_PROMPT,
  buildGuardUserMessage,
  buildGuardSystemPrompt,
} from "./prompts/guard.js";
export {
  REDACT_SYSTEM_PROMPT,
  buildRedactUserMessage,
  buildRedactSystemPrompt,
} from "./prompts/redact.js";

// Observability helpers
export { createOtelGuardHooks } from "./observability/otel.js";
export type { OtelGuardHookOptions, OtelTracerLike, OtelSpanLike } from "./observability/otel.js";