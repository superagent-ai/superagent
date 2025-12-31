import type {
  ChatMessage,
  AnalysisResponse,
  MultimodalContentPart,
} from "../types.js";
import type {
  ProviderConfig,
  GoogleRequestBody,
  GoogleResponse,
  GoogleContentPart,
  ResponseFormat,
} from "./types.js";

/**
 * Remove additionalProperties from schema (Google API doesn't support it)
 */
function stripAdditionalProperties(
  schema: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(schema)) {
    if (key === "additionalProperties") continue;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result[key] = stripAdditionalProperties(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Convert multimodal content parts to Google format
 */
function toGoogleParts(
  content: string | MultimodalContentPart[]
): GoogleContentPart[] {
  if (typeof content === "string") {
    return [{ text: content }];
  }

  return content.map((part) => {
    if (part.type === "text") {
      return { text: part.text };
    }
    // Extract base64 data and media type from data URL
    const url = part.image_url.url;
    const match = url.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      return {
        inlineData: {
          mimeType: match[1],
          data: match[2],
        },
      };
    }
    // If it's a regular URL, we can't use it directly with Google
    // They require inlineData for images
    throw new Error("Google requires base64 encoded images, not URLs");
  });
}

/**
 * Google Generative AI (Gemini) provider configuration
 * Supports structured outputs via responseSchema in generationConfig
 */
export const googleProvider: ProviderConfig = {
  baseUrl: "https://generativelanguage.googleapis.com/v1beta/models",
  envVar: "GOOGLE_API_KEY",

  authHeader: (apiKey: string) => ({
    "x-goog-api-key": apiKey,
    "Content-Type": "application/json",
  }),

  buildUrl: (baseUrl: string, model: string) =>
    `${baseUrl}/${model}:generateContent`,

  transformRequest: (
    model: string,
    messages: ChatMessage[],
    responseFormat?: ResponseFormat
  ): GoogleRequestBody => {
    // Extract system message if present
    const systemMessage = messages.find((m) => m.role === "system");
    const nonSystemMessages = messages.filter((m) => m.role !== "system");

    const requestBody: GoogleRequestBody = {
      contents: nonSystemMessages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: toGoogleParts(m.content),
      })),
    };

    // Add system instruction if present (must be text only)
    if (systemMessage) {
      const systemContent =
        typeof systemMessage.content === "string"
          ? systemMessage.content
          : systemMessage.content
              .filter((p) => p.type === "text")
              .map((p) => (p as { type: "text"; text: string }).text)
              .join("\n");
      requestBody.systemInstruction = {
        parts: [{ text: systemContent }],
      };
    }

    // Transform response format to Google's generationConfig format
    // Strip additionalProperties as Google API doesn't support it
    if (responseFormat?.type === "json_schema") {
      requestBody.generationConfig = {
        responseMimeType: "application/json",
        responseSchema: stripAdditionalProperties(
          responseFormat.json_schema.schema as Record<string, unknown>
        ),
      };
    } else if (responseFormat?.type === "json_object") {
      requestBody.generationConfig = {
        responseMimeType: "application/json",
      };
    }

    return requestBody;
  },

  transformResponse: (response: unknown): AnalysisResponse => {
    const res = response as GoogleResponse;
    const candidate = res.candidates?.[0];
    const textContent = candidate?.content?.parts?.[0]?.text ?? "";

    return {
      id: res.modelVersion ?? "google-response",
      usage: {
        promptTokens: res.usageMetadata?.promptTokenCount ?? 0,
        completionTokens: res.usageMetadata?.candidatesTokenCount ?? 0,
        totalTokens: res.usageMetadata?.totalTokenCount ?? 0,
      },
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: textContent,
          },
          finish_reason: candidate?.finishReason ?? "stop",
        },
      ],
    };
  },
};
