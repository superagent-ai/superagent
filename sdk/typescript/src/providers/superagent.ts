import type { ChatMessage, AnalysisResponse } from "../types.js";
import type {
  ProviderConfig,
  ResponseFormat,
  SuperagentRequestBody,
} from "./types.js";

/**
 * Ollama-style response from Superagent API
 */
interface SuperagentResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  done_reason?: string;
  prompt_eval_count?: number;
  eval_count?: number;
}

/**
 * Superagent provider configuration
 */
export const superagentProvider: ProviderConfig = {
  baseUrl: "https://api.superagent.sh/api/chat", // Default, but buildUrl overrides this
  envVar: "", // No API key required

  authHeader: () => ({
    "Content-Type": "application/json",
  }),

  buildUrl: (baseUrl: string, model: string): string => {
    // Map each model to its specific endpoint
    const modelEndpoints: Record<string, string> = {
      "guard-0.6b":
        "https://superagent-guard-tiny-408394858807.us-central1.run.app/api/chat",
      "guard-1.7b":
        "https://superagent-guard-small-408394858807.us-central1.run.app/api/chat",
      "guard-4b":
        "https://superagent-guard-medium-408394858807.us-central1.run.app/api/chat",
    };

    return modelEndpoints[model] || baseUrl;
  },

  transformRequest: (
    model: string,
    messages: ChatMessage[],
    responseFormat?: ResponseFormat
  ): SuperagentRequestBody => {
    // Convert model format: "guard-0.6b" -> "superagent-guard-0.6b-Q8_0"
    const modelName = `superagent-${model}-Q8_0`;

    const request: SuperagentRequestBody = {
      model: modelName,
      messages: messages.map((msg) => ({
        role: msg.role,
        content:
          typeof msg.content === "string"
            ? msg.content
            : JSON.stringify(msg.content),
      })),
      stream: false,
      temperature: 0.6,
      top_p: 0.95,
      top_k: 20,
    };

    return request;
  },

  transformResponse: (response: unknown): AnalysisResponse => {
    const res = response as SuperagentResponse;

    let content = res.message?.content || "";

    // Strip <think>...</think> tags if present (model outputs reasoning before answer)
    content = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

    // Extract JSON from the content
    let parsedContent: {
      classification?: "pass" | "block";
      violation_types?: string[];
      cwe_codes?: string[];
      redacted?: string;
      findings?: unknown[];
    };

    try {
      // Try to parse as JSON directly
      parsedContent = JSON.parse(content.trim());
    } catch {
      // If parsing fails, try to extract JSON object from the content
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0].trim());
      } else {
        // Try to extract from markdown code blocks
        const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch?.[1]) {
          parsedContent = JSON.parse(codeBlockMatch[1].trim());
        } else {
          throw new Error(`Failed to parse response: ${content}`);
        }
      }
    }

    // Check if this looks like a redact response (superagent model doesn't support redaction)
    if (
      parsedContent.redacted !== undefined ||
      parsedContent.findings !== undefined
    ) {
      throw new Error(
        `Superagent model does not support redaction. The model is trained for guard/classification only. Response: ${content}`
      );
    }

    // Ensure classification is valid
    if (
      parsedContent.classification !== "pass" &&
      parsedContent.classification !== "block"
    ) {
      throw new Error(
        `Invalid classification: ${parsedContent.classification}. Response: ${content}`
      );
    }

    // Map Ollama token counts to standard format
    const promptTokens = res.prompt_eval_count ?? 0;
    const completionTokens = res.eval_count ?? 0;

    return {
      id: res.created_at || "",
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
      },
      choices: [
        {
          index: 0,
          message: {
            role: res.message?.role ?? "assistant",
            content: JSON.stringify(parsedContent),
          },
          finish_reason: res.done_reason ?? "stop",
        },
      ],
    };
  },
};
