import type {
  ChatMessage,
  AnalysisResponse,
  MultimodalContentPart,
} from "../types.js";
import type {
  ProviderConfig,
  OpenAIResponsesRequestBody,
  OpenAIResponsesResponse,
  OpenAIContentPart,
  ResponseFormat,
} from "./types.js";

/**
 * Convert multimodal content parts to OpenAI format
 */
function toOpenAIContent(
  content: string | MultimodalContentPart[]
): string | OpenAIContentPart[] {
  if (typeof content === "string") {
    return content;
  }

  return content.map((part) => {
    if (part.type === "text") {
      return { type: "input_text" as const, text: part.text };
    }
    // Convert image_url to OpenAI format (data URL)
    return { type: "input_image" as const, image_url: part.image_url.url };
  });
}

/**
 * OpenAI provider configuration using the Responses API
 */
export const openaiProvider: ProviderConfig = {
  baseUrl: "https://api.openai.com/v1/responses",
  envVar: "OPENAI_API_KEY",

  authHeader: (apiKey: string) => ({
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  }),

  transformRequest: (
    model: string,
    messages: ChatMessage[],
    responseFormat?: ResponseFormat
  ): OpenAIResponsesRequestBody => {
    const request: OpenAIResponsesRequestBody = {
      model,
      input: messages.map((msg) => ({
        role: msg.role,
        content: toOpenAIContent(msg.content),
      })),
    };

    // Add structured output format if provided
    if (responseFormat?.type === "json_schema" && responseFormat.json_schema) {
      request.text = {
        format: {
          type: "json_schema",
          name: responseFormat.json_schema.name,
          strict: responseFormat.json_schema.strict,
          schema: responseFormat.json_schema.schema,
        },
      };
    }

    return request;
  },

  transformResponse: (response: unknown): AnalysisResponse => {
    const res = response as OpenAIResponsesResponse;

    // Extract text content from the Responses API output
    let content = "";
    for (const output of res.output) {
      if (output.type === "message" && output.content) {
        for (const item of output.content) {
          if (item.type === "output_text" && item.text) {
            content += item.text;
          }
        }
      }
    }

    return {
      id: res.id,
      usage: {
        promptTokens: res.usage.input_tokens,
        completionTokens: res.usage.output_tokens,
        totalTokens: res.usage.total_tokens,
      },
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content,
          },
          finish_reason: "stop",
        },
      ],
    };
  },
};
