import type {
  ChatMessage,
  AnalysisResponse,
  MultimodalContentPart,
} from "../types.js";
import type {
  ProviderConfig,
  AnthropicRequestBody,
  AnthropicResponse,
  AnthropicContentPart,
  ResponseFormat,
} from "./types.js";

/**
 * Convert multimodal content parts to Anthropic format
 */
function toAnthropicContent(
  content: string | MultimodalContentPart[]
): string | AnthropicContentPart[] {
  if (typeof content === "string") {
    return content;
  }

  return content.map((part) => {
    if (part.type === "text") {
      return { type: "text" as const, text: part.text };
    }
    // Extract base64 data and media type from data URL
    const url = part.image_url.url;
    const match = url.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      return {
        type: "image" as const,
        source: {
          type: "base64" as const,
          media_type: match[1],
          data: match[2],
        },
      };
    }
    // If it's a regular URL, we can't use it directly with Anthropic
    // They require base64 encoded images
    throw new Error("Anthropic requires base64 encoded images, not URLs");
  });
}

/**
 * Anthropic provider configuration
 * Supports structured outputs via output_format parameter
 */
export const anthropicProvider: ProviderConfig = {
  baseUrl: "https://api.anthropic.com/v1/messages",
  envVar: "ANTHROPIC_API_KEY",

  authHeader: (apiKey: string) => ({
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
    "anthropic-beta": "structured-outputs-2025-11-13",
    "Content-Type": "application/json",
  }),

  transformRequest: (
    model: string,
    messages: ChatMessage[],
    responseFormat?: ResponseFormat
  ): AnthropicRequestBody => {
    // Extract system message if present
    const systemMessage = messages.find((m) => m.role === "system");
    const nonSystemMessages = messages.filter((m) => m.role !== "system");

    // System message content must be a string
    const systemContent =
      typeof systemMessage?.content === "string"
        ? systemMessage.content
        : undefined;

    const requestBody: AnthropicRequestBody = {
      model,
      max_tokens: 4096,
      system: systemContent,
      messages: nonSystemMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: toAnthropicContent(m.content),
      })),
    };

    // Transform response format to Anthropic's output_format format
    if (responseFormat?.type === "json_schema") {
      requestBody.output_format = {
        type: "json_schema",
        schema: responseFormat.json_schema.schema,
      };
    }

    return requestBody;
  },

  transformResponse: (response: unknown): AnalysisResponse => {
    const res = response as AnthropicResponse;
    const textContent = res.content.find((c) => c.type === "text");

    return {
      id: res.id,
      usage: {
        promptTokens: res.usage.input_tokens,
        completionTokens: res.usage.output_tokens,
        totalTokens: res.usage.input_tokens + res.usage.output_tokens,
      },
      choices: [
        {
          index: 0,
          message: {
            role: res.role,
            content: textContent?.text ?? "",
          },
          finish_reason: res.stop_reason,
        },
      ],
    };
  },
};
