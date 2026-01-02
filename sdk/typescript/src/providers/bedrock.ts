import type {
  ChatMessage,
  AnalysisResponse,
  MultimodalContentPart,
} from "../types.js";
import type {
  ProviderConfig,
  BedrockRequestBody,
  BedrockResponse,
  ResponseFormat,
} from "./types.js";

/**
 * Get the AWS region for Bedrock from environment variable or use default
 */
function getBedrockRegion(): string {
  return process.env.AWS_BEDROCK_REGION ?? "us-east-1";
}

/**
 * Extract text content from message content (handles both string and multimodal)
 */
function extractTextContent(content: string | MultimodalContentPart[]): string {
  if (typeof content === "string") {
    return content;
  }
  // For multimodal content, extract text parts
  return content
    .filter((p) => p.type === "text")
    .map((p) => (p as { type: "text"; text: string }).text)
    .join("\n");
}

/**
 * AWS Bedrock provider configuration
 * Uses the Converse API with Bearer token authentication
 * Note: Bedrock currently only supports text content in this implementation
 */
export const bedrockProvider: ProviderConfig = {
  baseUrl: "https://bedrock-runtime.{region}.amazonaws.com",
  envVar: "AWS_BEDROCK_API_KEY",

  authHeader: (apiKey: string) => ({
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  }),

  buildUrl: (baseUrl: string, model: string) => {
    const region = getBedrockRegion();
    const regionalBaseUrl = baseUrl.replace("{region}", region);
    return `${regionalBaseUrl}/model/${model}/converse`;
  },

  transformRequest: (
    model: string,
    messages: ChatMessage[],
    responseFormat?: ResponseFormat
  ): BedrockRequestBody => {
    // Extract system message if present
    const systemMessage = messages.find((m) => m.role === "system");
    const nonSystemMessages = messages.filter((m) => m.role !== "system");

    const requestBody: BedrockRequestBody = {
      messages: nonSystemMessages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: [{ text: extractTextContent(m.content) }],
      })),
      inferenceConfig: {
        maxTokens: 4096,
        temperature: 0,
      },
    };

    // Add system instruction if present
    if (systemMessage) {
      requestBody.system = [
        { text: extractTextContent(systemMessage.content) },
      ];
    }

    // Transform response format to Bedrock's toolConfig format for structured output
    if (responseFormat?.type === "json_schema") {
      requestBody.toolConfig = {
        tools: [
          {
            toolSpec: {
              name: responseFormat.json_schema.name,
              description: "Structured output schema",
              inputSchema: {
                json: responseFormat.json_schema.schema,
              },
            },
          },
        ],
        toolChoice: {
          tool: {
            name: responseFormat.json_schema.name,
          },
        },
      };
    }

    return requestBody;
  },

  transformResponse: (response: unknown): AnalysisResponse => {
    const res = response as BedrockResponse;
    const message = res.output?.message;

    // Check for tool use response (structured output)
    const toolUseContent = message?.content?.find((c) => c.toolUse);
    const textContent = message?.content?.find((c) => c.text);

    // If tool use, stringify the input as the content
    const content = toolUseContent?.toolUse
      ? JSON.stringify(toolUseContent.toolUse.input)
      : textContent?.text ?? "";

    return {
      id: `bedrock-${Date.now()}`,
      usage: {
        promptTokens: res.usage?.inputTokens ?? 0,
        completionTokens: res.usage?.outputTokens ?? 0,
        totalTokens:
          (res.usage?.inputTokens ?? 0) + (res.usage?.outputTokens ?? 0),
      },
      choices: [
        {
          index: 0,
          message: {
            role: message?.role ?? "assistant",
            content,
          },
          finish_reason: res.stopReason ?? "stop",
        },
      ],
    };
  },
};
