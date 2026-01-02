import type { ChatMessage, AnalysisResponse } from "../types.js";

/**
 * JSON Schema for structured output
 */
export interface JsonSchema {
  name: string;
  strict?: boolean;
  schema: Record<string, unknown>;
}

/**
 * Response format options
 */
export type ResponseFormat =
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };

/**
 * Request body for OpenAI-compatible APIs
 */
export interface OpenAIRequestBody {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: ResponseFormat;
}

/**
 * Anthropic multimodal content part
 */
export type AnthropicContentPart =
  | { type: "text"; text: string }
  | {
      type: "image";
      source: {
        type: "base64";
        media_type: string;
        data: string;
      };
    };

/**
 * Request body for Anthropic API
 */
export interface AnthropicRequestBody {
  model: string;
  max_tokens: number;
  system?: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string | AnthropicContentPart[];
  }>;
  output_format?: {
    type: "json_schema";
    schema: Record<string, unknown>;
  };
}

/**
 * Google multimodal content part
 */
export type GoogleContentPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

/**
 * Request body for Google Generative AI (Gemini) API
 */
export interface GoogleRequestBody {
  contents: Array<{
    role: "user" | "model";
    parts: GoogleContentPart[];
  }>;
  systemInstruction?: {
    parts: Array<{ text: string }>;
  };
  generationConfig?: {
    responseMimeType?: string;
    responseSchema?: Record<string, unknown>;
  };
}

/**
 * Configuration for a provider
 */
export interface ProviderConfig {
  /** Base URL for the API endpoint */
  baseUrl: string;
  /** Environment variable name for the API key */
  envVar: string;
  /** Function to generate auth headers */
  authHeader: (apiKey: string) => Record<string, string>;
  /** Optional function to build the full URL (defaults to baseUrl if not provided) */
  buildUrl?: (baseUrl: string, model: string) => string;
  /** Transform messages to provider-specific request body */
  transformRequest: (
    model: string,
    messages: ChatMessage[],
    responseFormat?: ResponseFormat
  ) =>
    | OpenAIRequestBody
    | OpenAIResponsesRequestBody
    | AnthropicRequestBody
    | GoogleRequestBody
    | BedrockRequestBody
    | SuperagentRequestBody;
  /** Transform provider response to unified AnalysisResponse */
  transformResponse: (response: unknown) => AnalysisResponse;
}

/**
 * OpenAI API response format
 */
export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * OpenAI multimodal content part
 */
export type OpenAIContentPart =
  | { type: "input_text"; text: string }
  | { type: "input_image"; image_url: string };

/**
 * OpenAI Responses API message format
 */
export interface OpenAIResponsesMessage {
  role: string;
  content: string | OpenAIContentPart[];
}

/**
 * Request body for OpenAI Responses API (used by Codex and newer models)
 */
export interface OpenAIResponsesRequestBody {
  model: string;
  input: string | OpenAIResponsesMessage[];
  text?: {
    format?: {
      type: "json_schema";
      name: string;
      strict?: boolean;
      schema: Record<string, unknown>;
    };
  };
}

/**
 * OpenAI Responses API response format
 */
export interface OpenAIResponsesResponse {
  id: string;
  output: Array<{
    type: string;
    content: Array<{
      type: string;
      text: string;
    }>;
  }>;
  usage: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
}

/**
 * Anthropic API response format
 */
export interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Google Generative AI (Gemini) API response format
 */
export interface GoogleResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text: string }>;
      role?: string;
    };
    finishReason?: string;
  }>;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
  modelVersion?: string;
}

/**
 * Request body for AWS Bedrock Converse API
 */
export interface BedrockRequestBody {
  messages: Array<{
    role: "user" | "assistant";
    content: Array<{ text: string }>;
  }>;
  system?: Array<{ text: string }>;
  inferenceConfig?: {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
  };
  toolConfig?: {
    tools: Array<{
      toolSpec: {
        name: string;
        description: string;
        inputSchema: {
          json: Record<string, unknown>;
        };
      };
    }>;
    toolChoice: {
      tool: {
        name: string;
      };
    };
  };
}

/**
 * AWS Bedrock Converse API response format
 */
export interface BedrockResponse {
  output: {
    message: {
      role: string;
      content: Array<{
        text?: string;
        toolUse?: {
          toolUseId: string;
          name: string;
          input: Record<string, unknown>;
        };
      }>;
    };
  };
  stopReason: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  metrics?: {
    latencyMs: number;
  };
}

/**
 * Superagent API request body (Ollama-style)
 */
export interface SuperagentRequestBody {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  stream: boolean;
  temperature?: number;
  top_p?: number;
  top_k?: number;
}
