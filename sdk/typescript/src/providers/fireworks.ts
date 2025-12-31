import type { ChatMessage, AnalysisResponse } from "../types.js";
import type {
  ProviderConfig,
  OpenAIRequestBody,
  OpenAIResponse,
  ResponseFormat,
} from "./types.js";

/**
 * Fireworks AI provider configuration
 * Uses OpenAI-compatible API format
 */
export const fireworksProvider: ProviderConfig = {
  baseUrl: "https://api.fireworks.ai/inference/v1/chat/completions",
  envVar: "FIREWORKS_API_KEY",

  authHeader: (apiKey: string) => ({
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  }),

  transformRequest: (
    model: string,
    messages: ChatMessage[],
    responseFormat?: ResponseFormat
  ): OpenAIRequestBody => ({
    model,
    messages,
    temperature: 0,
    response_format: responseFormat,
  }),

  transformResponse: (response: unknown): AnalysisResponse => {
    const res = response as OpenAIResponse;
    return {
      id: res.id,
      usage: {
        promptTokens: res.usage.prompt_tokens,
        completionTokens: res.usage.completion_tokens,
        totalTokens: res.usage.total_tokens,
      },
      choices: res.choices.map((choice) => ({
        index: choice.index,
        message: {
          role: choice.message.role,
          content: choice.message.content,
        },
        finish_reason: choice.finish_reason,
      })),
    };
  },
};
