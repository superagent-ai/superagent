import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { AnalysisResponse } from "../src/types.js";

vi.mock("../src/providers/index.js", async (importOriginal) => {
  const mod = await importOriginal<
    typeof import("../src/providers/index.js")
  >();
  return { ...mod, callProvider: vi.fn() };
});

import { createClient } from "../src/index.js";
import { callProvider } from "../src/providers/index.js";

const mockCallProvider = vi.mocked(callProvider);

function guardResponse(classification: "pass" | "block"): AnalysisResponse {
  return {
    id: "mock-id",
    usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: JSON.stringify({
            classification,
            reasoning: "Test reasoning",
            violation_types: [],
            cwe_codes: [],
          }),
        },
        finish_reason: "stop",
      },
    ],
  };
}

/**
 * Helper: run a guard call and return whether responseFormat was passed to callProvider.
 * responseFormat is the 3rd argument (index 2) to callProvider.
 */
async function callsWithResponseFormat(model: string): Promise<boolean> {
  mockCallProvider.mockResolvedValueOnce(guardResponse("pass"));
  const client = createClient({ apiKey: "test-key" });
  await client.guard({ input: "Test input", model });
  return mockCallProvider.mock.calls[0][2] !== undefined;
}

describe("Structured Output Support", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockCallProvider.mockReset();
    fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("{}", { status: 200 }));
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  describe("OpenAI provider", () => {
    it("should use structured output for openai/gpt-4o", async () => {
      expect(await callsWithResponseFormat("openai/gpt-4o")).toBe(true);
    });

    it("should use structured output for openai/gpt-4o-mini", async () => {
      expect(await callsWithResponseFormat("openai/gpt-4o-mini")).toBe(true);
    });
  });

  describe("Anthropic provider", () => {
    it("should use structured output for claude-sonnet-4-5", async () => {
      expect(
        await callsWithResponseFormat("anthropic/claude-sonnet-4-5"),
      ).toBe(true);
    });

    it("should use structured output for claude-opus-4-1", async () => {
      expect(await callsWithResponseFormat("anthropic/claude-opus-4-1")).toBe(
        true,
      );
    });

    it("should NOT use structured output for claude-haiku-4-5", async () => {
      expect(
        await callsWithResponseFormat("anthropic/claude-haiku-4-5"),
      ).toBe(false);
    });

    it("should NOT use structured output for claude-3-haiku", async () => {
      expect(
        await callsWithResponseFormat("anthropic/claude-3-haiku-20240307"),
      ).toBe(false);
    });
  });

  describe("Google provider", () => {
    it("should use structured output for gemini-2.0-flash", async () => {
      expect(
        await callsWithResponseFormat("google/gemini-2.0-flash"),
      ).toBe(true);
    });

    it("should use structured output for gemini-1.5-pro", async () => {
      expect(
        await callsWithResponseFormat("google/gemini-1.5-pro"),
      ).toBe(true);
    });
  });

  describe("Bedrock provider", () => {
    it("should use structured output for bedrock models", async () => {
      expect(
        await callsWithResponseFormat(
          "bedrock/us.anthropic.claude-haiku-4-5-20251001-v1:0",
        ),
      ).toBe(true);
    });
  });

  describe("Vercel provider", () => {
    it("should use structured output for vercel models", async () => {
      expect(
        await callsWithResponseFormat("vercel/openai/gpt-4o-mini"),
      ).toBe(true);
    });
  });

  describe("Groq provider", () => {
    it("should use structured output for groq/gpt-oss-20b", async () => {
      expect(await callsWithResponseFormat("groq/gpt-oss-20b")).toBe(true);
    });

    it("should use structured output for groq/llama-4-maverick-17b-128e-instruct", async () => {
      expect(
        await callsWithResponseFormat(
          "groq/llama-4-maverick-17b-128e-instruct",
        ),
      ).toBe(true);
    });

    it("should NOT use structured output for groq/llama-3.3-70b-versatile", async () => {
      expect(
        await callsWithResponseFormat("groq/llama-3.3-70b-versatile"),
      ).toBe(false);
    });

    it("should NOT use structured output for groq/mixtral-8x7b", async () => {
      expect(
        await callsWithResponseFormat("groq/mixtral-8x7b-32768"),
      ).toBe(false);
    });
  });

  describe("Fireworks provider", () => {
    it("should use structured output for fireworks gpt-oss-120b", async () => {
      expect(
        await callsWithResponseFormat(
          "fireworks/accounts/fireworks/models/gpt-oss-120b",
        ),
      ).toBe(true);
    });

    it("should use structured output for fireworks llama-4-scout", async () => {
      expect(
        await callsWithResponseFormat(
          "fireworks/accounts/fireworks/models/llama-4-scout-17b-16e-instruct",
        ),
      ).toBe(true);
    });

    it("should NOT use structured output for fireworks llama-v3p1-8b", async () => {
      expect(
        await callsWithResponseFormat(
          "fireworks/accounts/fireworks/models/llama-v3p1-8b-instruct",
        ),
      ).toBe(false);
    });
  });

  describe("OpenRouter provider", () => {
    it("should use structured output for openrouter openai models", async () => {
      expect(
        await callsWithResponseFormat("openrouter/openai/gpt-4o-mini"),
      ).toBe(true);
    });

    it("should NOT use structured output for openrouter openai safeguard models", async () => {
      expect(
        await callsWithResponseFormat(
          "openrouter/openai/gpt-oss-safeguard-20b",
        ),
      ).toBe(false);
    });

    it("should use structured output for openrouter google gemini", async () => {
      expect(
        await callsWithResponseFormat("openrouter/google/gemini-2.0-flash"),
      ).toBe(true);
    });

    it("should use structured output for openrouter anthropic opus-4.1", async () => {
      expect(
        await callsWithResponseFormat("openrouter/anthropic/claude-opus-4.1"),
      ).toBe(true);
    });

    it("should NOT use structured output for openrouter anthropic haiku", async () => {
      expect(
        await callsWithResponseFormat(
          "openrouter/anthropic/claude-3-haiku-20240307",
        ),
      ).toBe(false);
    });

    it("should use structured output for openrouter meta-llama llama-4-maverick", async () => {
      expect(
        await callsWithResponseFormat(
          "openrouter/meta-llama/llama-4-maverick-17b-128e-instruct",
        ),
      ).toBe(true);
    });

    it("should NOT use structured output for unknown openrouter models", async () => {
      expect(
        await callsWithResponseFormat("openrouter/unknown/some-model"),
      ).toBe(false);
    });

    it("should use structured output for openrouter mistral-large", async () => {
      expect(
        await callsWithResponseFormat(
          "openrouter/mistralai/mistral-large-latest",
        ),
      ).toBe(true);
    });

    it("should NOT use structured output for openrouter mistral-7b-instruct", async () => {
      expect(
        await callsWithResponseFormat(
          "openrouter/mistralai/mistral-7b-instruct-v0.3",
        ),
      ).toBe(false);
    });

    it("should use structured output for openrouter deepseek-r1", async () => {
      expect(
        await callsWithResponseFormat("openrouter/deepseek/deepseek-r1"),
      ).toBe(true);
    });

    it("should NOT use structured output for openrouter deepseek-prover", async () => {
      expect(
        await callsWithResponseFormat(
          "openrouter/deepseek/deepseek-prover-v2",
        ),
      ).toBe(false);
    });

    it("should use structured output for openrouter qwen3", async () => {
      expect(
        await callsWithResponseFormat("openrouter/qwen/qwen3-235b-a22b"),
      ).toBe(true);
    });

    it("should use structured output for openrouter cohere", async () => {
      expect(
        await callsWithResponseFormat("openrouter/cohere/command-r-plus"),
      ).toBe(true);
    });

    it("should use structured output for openrouter x-ai grok-3", async () => {
      expect(
        await callsWithResponseFormat("openrouter/x-ai/grok-3-mini"),
      ).toBe(true);
    });

    it("should use structured output for openrouter google gemma-3-27b", async () => {
      expect(
        await callsWithResponseFormat(
          "openrouter/google/gemma-3-27b-it",
        ),
      ).toBe(true);
    });

    it("should NOT use structured output for openrouter google gemma-2-9b", async () => {
      expect(
        await callsWithResponseFormat(
          "openrouter/google/gemma-2-9b-it",
        ),
      ).toBe(false);
    });
  });

  describe("OpenAI-compatible provider", () => {
    it("should NOT use structured output by default", async () => {
      delete process.env.OPENAI_COMPATIBLE_SUPPORTS_STRUCTURED_OUTPUT;
      expect(
        await callsWithResponseFormat("openai-compatible/my-model"),
      ).toBe(false);
    });

    it("should use structured output when env var is true", async () => {
      process.env.OPENAI_COMPATIBLE_SUPPORTS_STRUCTURED_OUTPUT = "true";
      expect(
        await callsWithResponseFormat("openai-compatible/my-model"),
      ).toBe(true);
      delete process.env.OPENAI_COMPATIBLE_SUPPORTS_STRUCTURED_OUTPUT;
    });

    it("should NOT use structured output when env var is false", async () => {
      process.env.OPENAI_COMPATIBLE_SUPPORTS_STRUCTURED_OUTPUT = "false";
      expect(
        await callsWithResponseFormat("openai-compatible/my-model"),
      ).toBe(false);
      delete process.env.OPENAI_COMPATIBLE_SUPPORTS_STRUCTURED_OUTPUT;
    });
  });

  describe("unsupported providers", () => {
    it("should NOT use structured output for unknown providers", async () => {
      expect(
        await callsWithResponseFormat("unknown-provider/some-model"),
      ).toBe(false);
    });
  });
});
