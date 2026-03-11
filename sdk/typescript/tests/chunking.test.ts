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

function guardResponse(
  classification: "pass" | "block",
  opts?: {
    promptTokens?: number;
    completionTokens?: number;
    reasoning?: string;
    violation_types?: string[];
    cwe_codes?: string[];
  },
): AnalysisResponse {
  const pt = opts?.promptTokens ?? 100;
  const ct = opts?.completionTokens ?? 50;
  return {
    id: "mock-id",
    usage: { promptTokens: pt, completionTokens: ct, totalTokens: pt + ct },
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: JSON.stringify({
            classification,
            reasoning:
              opts?.reasoning ??
              (classification === "pass"
                ? "Content is safe"
                : "Detected violation"),
            violation_types:
              opts?.violation_types ??
              (classification === "block" ? ["prompt_injection"] : []),
            cwe_codes:
              opts?.cwe_codes ??
              (classification === "block" ? ["CWE-77"] : []),
          }),
        },
        finish_reason: "stop",
      },
    ],
  };
}

describe("Guard Chunking", () => {
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

  describe("chunking behavior", () => {
    it("should process small inputs without chunking", async () => {
      mockCallProvider.mockResolvedValueOnce(guardResponse("pass"));
      const client = createClient({ apiKey: "test-key" });

      const response = await client.guard({
        input: "What's the weather like today?",
        model: "openai/gpt-4o-mini",
      });

      expect(response.classification).toBe("pass");
      expect(mockCallProvider).toHaveBeenCalledOnce();
    });

    it("should auto-chunk large inputs and aggregate results", async () => {
      const largeInput =
        "This is a safe paragraph about weather and nature. ".repeat(200);
      mockCallProvider.mockResolvedValue(
        guardResponse("pass", { promptTokens: 80, completionTokens: 30 }),
      );

      const client = createClient({ apiKey: "test-key" });
      const response = await client.guard({
        input: largeInput,
        model: "openai/gpt-4o-mini",
      });

      expect(response.classification).toBe("pass");
      const callCount = mockCallProvider.mock.calls.length;
      expect(callCount).toBeGreaterThan(1);
      expect(response.usage.promptTokens).toBe(80 * callCount);
      expect(response.usage.completionTokens).toBe(30 * callCount);
      expect(response.usage.totalTokens).toBe(110 * callCount);
    });

    it("should block if any chunk contains malicious content (OR logic)", async () => {
      const largeInput = "A ".repeat(5000);
      mockCallProvider
        .mockResolvedValueOnce(guardResponse("pass"))
        .mockResolvedValueOnce(
          guardResponse("block", {
            reasoning: "Detected prompt injection in chunk",
            violation_types: ["prompt_injection"],
            cwe_codes: ["CWE-77"],
          }),
        );

      const client = createClient({ apiKey: "test-key" });
      const response = await client.guard({
        input: largeInput,
        model: "openai/gpt-4o-mini",
      });

      expect(response.classification).toBe("block");
      expect(response.violation_types).toContain("prompt_injection");
      expect(response.reasoning).toContain("Detected prompt injection");
    });

    it("should allow disabling chunking with chunkSize=0", async () => {
      const largeInput = "Content. ".repeat(1000);
      mockCallProvider.mockResolvedValueOnce(guardResponse("pass"));

      const client = createClient({ apiKey: "test-key" });
      const response = await client.guard({
        input: largeInput,
        model: "openai/gpt-4o-mini",
        chunkSize: 0,
      });

      expect(response.classification).toBe("pass");
      expect(mockCallProvider).toHaveBeenCalledOnce();
    });

    it("should throw error for negative chunkSize", async () => {
      const client = createClient({ apiKey: "test-key" });

      await expect(
        client.guard({
          input: "What's the weather like today?",
          model: "openai/gpt-4o-mini",
          chunkSize: -1,
        }),
      ).rejects.toThrow("chunkSize must be non-negative");
    });

    it("should respect custom chunk size", async () => {
      mockCallProvider.mockResolvedValue(guardResponse("pass"));
      const client = createClient({ apiKey: "test-key" });

      await client.guard({
        input:
          "This is a test input that will be chunked. What is the weather today?",
        model: "openai/gpt-4o-mini",
        chunkSize: 30,
      });

      expect(mockCallProvider.mock.calls.length).toBeGreaterThan(1);
    });

    it("should aggregate token usage from all chunks", async () => {
      const input = "Hello world, this is a test. ".repeat(100);
      mockCallProvider.mockResolvedValue(
        guardResponse("pass", { promptTokens: 40, completionTokens: 15 }),
      );

      const client = createClient({ apiKey: "test-key" });
      const response = await client.guard({
        input,
        model: "openai/gpt-4o-mini",
        chunkSize: 500,
      });

      const callCount = mockCallProvider.mock.calls.length;
      expect(callCount).toBeGreaterThan(1);
      expect(response.usage.promptTokens).toBe(40 * callCount);
      expect(response.usage.completionTokens).toBe(15 * callCount);
      expect(response.usage.totalTokens).toBe(
        response.usage.promptTokens + response.usage.completionTokens,
      );
    });

    it("should merge violation types from multiple blocked chunks", async () => {
      const largeInput = "A ".repeat(5000);
      mockCallProvider
        .mockResolvedValueOnce(
          guardResponse("block", {
            violation_types: ["sql_injection"],
            cwe_codes: ["CWE-89"],
          }),
        )
        .mockResolvedValueOnce(
          guardResponse("block", {
            violation_types: ["xss"],
            cwe_codes: ["CWE-79"],
          }),
        );

      const client = createClient({ apiKey: "test-key" });
      const response = await client.guard({
        input: largeInput,
        model: "openai/gpt-4o-mini",
      });

      expect(response.classification).toBe("block");
      expect(response.violation_types).toContain("sql_injection");
      expect(response.violation_types).toContain("xss");
      expect(response.cwe_codes).toContain("CWE-89");
      expect(response.cwe_codes).toContain("CWE-79");
    });
  });
});
