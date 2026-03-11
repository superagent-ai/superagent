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

function redactResponse(
  redacted: string,
  findings: string[],
  opts?: { promptTokens?: number; completionTokens?: number },
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
          content: JSON.stringify({ redacted, findings }),
        },
        finish_reason: "stop",
      },
    ],
  };
}

describe("Redact", () => {
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

  const PROVIDER_MODELS = [
    "openai/gpt-4o-mini",
    "anthropic/claude-haiku-4-5",
    "google/gemini-2.0-flash",
    "bedrock/us.anthropic.claude-haiku-4-5-20251001-v1:0",
    "groq/llama-3.3-70b-versatile",
    "fireworks/accounts/fireworks/models/llama-v3p1-8b-instruct",
    "openrouter/openai/gpt-4o-mini",
    "vercel/openai/gpt-4o-mini",
    "openai-compatible/gpt-4o-mini",
  ];

  describe.each(PROVIDER_MODELS)("with model %s", (model) => {
    it("should redact PII and return correct structure", async () => {
      mockCallProvider.mockResolvedValueOnce(
        redactResponse("Contact me at <EMAIL_REDACTED> for more info.", [
          "john.doe@example.com",
        ]),
      );
      const client = createClient({ apiKey: "test-key" });

      const response = await client.redact({
        input: "Contact me at john.doe@example.com for more info.",
        model,
      });

      expect(response.redacted).toContain("<EMAIL_REDACTED>");
      expect(response.redacted).not.toContain("john.doe@example.com");
      expect(response.findings).toEqual(["john.doe@example.com"]);
      expect(response.usage.promptTokens).toBe(100);
      expect(response.usage.completionTokens).toBe(50);
      expect(response.usage.totalTokens).toBe(150);
      expect(mockCallProvider).toHaveBeenCalledOnce();
      expect(mockCallProvider.mock.calls[0][0]).toBe(model);
    });

    it("should preserve safe content", async () => {
      const safe = "The weather today is sunny with a high of 75 degrees.";
      mockCallProvider.mockResolvedValueOnce(redactResponse(safe, []));
      const client = createClient({ apiKey: "test-key" });

      const response = await client.redact({ input: safe, model });

      expect(response.redacted).toBe(safe);
      expect(response.findings).toEqual([]);
    });
  });

  describe("custom entities", () => {
    it("should include entities in the system prompt", async () => {
      mockCallProvider.mockResolvedValueOnce(
        redactResponse("<EMAIL_REDACTED>, phone is 555-123-4567.", [
          "john@example.com",
        ]),
      );
      const client = createClient({ apiKey: "test-key" });

      await client.redact({
        input: "john@example.com, phone is 555-123-4567.",
        entities: ["email addresses"],
        model: "openai/gpt-4o-mini",
      });

      const messages = mockCallProvider.mock.calls[0][1];
      const systemMsg = messages.find((m) => m.role === "system");
      expect(systemMsg!.content).toContain("email addresses");
    });
  });

  describe("rewrite mode", () => {
    it("should use rewrite instruction in system prompt", async () => {
      mockCallProvider.mockResolvedValueOnce(
        redactResponse("My email is user@company.net and phone is 555-000-0000.", [
          "john@example.com",
          "555-123-4567",
        ]),
      );
      const client = createClient({ apiKey: "test-key" });

      const response = await client.redact({
        input: "My email is john@example.com and my phone is 555-123-4567.",
        rewrite: true,
        model: "anthropic/claude-haiku-4-5",
      });

      expect(response.findings.length).toBeGreaterThan(0);
      const messages = mockCallProvider.mock.calls[0][1];
      const systemMsg = messages.find((m) => m.role === "system");
      expect((systemMsg!.content as string).toLowerCase()).toContain("rewrite");
    });

    it("should use placeholder mode when rewrite is false", async () => {
      mockCallProvider.mockResolvedValueOnce(
        redactResponse("My email is <EMAIL_REDACTED>.", ["john@example.com"]),
      );
      const client = createClient({ apiKey: "test-key" });

      const response = await client.redact({
        input: "My email is john@example.com.",
        rewrite: false,
        model: "anthropic/claude-haiku-4-5",
      });

      expect(response.redacted).toContain("REDACTED");
    });
  });

  describe("multiple PII types", () => {
    it("should redact multiple types of PII", async () => {
      mockCallProvider.mockResolvedValueOnce(
        redactResponse(
          "<NAME_REDACTED>, email: <EMAIL_REDACTED>, phone: <PHONE_REDACTED>, SSN: <SSN_REDACTED>.",
          ["John Smith", "john@test.com", "555-111-2222", "111-22-3333"],
        ),
      );
      const client = createClient({ apiKey: "test-key" });

      const response = await client.redact({
        input:
          "My name is John Smith, email: john@test.com, phone: 555-111-2222, SSN: 111-22-3333.",
        model: "openai/gpt-4o-mini",
      });

      expect(response.redacted).not.toContain("john@test.com");
      expect(response.redacted).not.toContain("555-111-2222");
      expect(response.findings.length).toBe(4);
    });
  });

  describe("credential redaction", () => {
    it("should redact API keys", async () => {
      mockCallProvider.mockResolvedValueOnce(
        redactResponse("Use this API key: <API_KEY_REDACTED> to authenticate.", [
          "sk-1234567890abcdefghijklmnop",
        ]),
      );
      const client = createClient({ apiKey: "test-key" });

      const response = await client.redact({
        input:
          "Use this API key: sk-1234567890abcdefghijklmnop to authenticate.",
        model: "openai/gpt-4o-mini",
      });

      expect(response.redacted).not.toContain("sk-1234567890abcdefghijklmnop");
      expect(response.findings.length).toBeGreaterThan(0);
    });
  });

  describe("error handling", () => {
    it("should throw when provider returns no content", async () => {
      mockCallProvider.mockResolvedValueOnce({
        id: "mock-id",
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        choices: [
          { message: { role: "assistant", content: "" }, finish_reason: "stop" },
        ],
      });
      const client = createClient({ apiKey: "test-key" });

      await expect(
        client.redact({ input: "Test", model: "openai/gpt-4o-mini" }),
      ).rejects.toThrow("No response content from provider");
    });

    it("should handle JSON in markdown code blocks", async () => {
      const wrapped = '```json\n{"redacted":"Safe text.","findings":[]}\n```';
      mockCallProvider.mockResolvedValueOnce({
        id: "mock-id",
        usage: { promptTokens: 10, completionTokens: 5, totalTokens: 15 },
        choices: [
          {
            message: { role: "assistant", content: wrapped },
            finish_reason: "stop",
          },
        ],
      });
      const client = createClient({ apiKey: "test-key" });

      const response = await client.redact({
        input: "Safe text.",
        model: "anthropic/claude-haiku-4-5",
      });

      expect(response.redacted).toBe("Safe text.");
      expect(response.findings).toEqual([]);
    });
  });
});
