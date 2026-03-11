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
): AnalysisResponse {
  return {
    id: "mock-id",
    usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
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

describe("Rewrite Mode", () => {
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

  it("should rewrite sensitive information contextually instead of using placeholders", async () => {
    mockCallProvider.mockResolvedValueOnce(
      redactResponse(
        "My email is user@company.net and my phone is 555-000-0000.",
        ["john@example.com", "555-123-4567"],
      ),
    );
    const client = createClient({ apiKey: "test-key" });

    const response = await client.redact({
      input: "My email is john@example.com and my phone is 555-123-4567.",
      rewrite: true,
      model: "anthropic/claude-haiku-4-5",
    });

    expect(response.redacted).not.toContain("john@example.com");
    expect(response.redacted).not.toContain("555-123-4567");
    expect(response.redacted).not.toContain("<EMAIL_REDACTED>");
    expect(response.redacted).not.toContain("<PHONE_REDACTED>");
    expect(response.findings.length).toBeGreaterThan(0);
    expect(response.usage.promptTokens).toBe(100);
    expect(response.usage.completionTokens).toBe(50);
    expect(response.usage.totalTokens).toBe(150);
  });

  it("should rewrite names and addresses naturally", async () => {
    mockCallProvider.mockResolvedValueOnce(
      redactResponse(
        "Please contact Alex Kim at 456 Oak Avenue, Chicago, IL 60601.",
        ["Jane Doe", "123 Main Street", "10001"],
      ),
    );
    const client = createClient({ apiKey: "test-key" });

    const response = await client.redact({
      input:
        "Please contact Jane Doe at 123 Main Street, New York, NY 10001.",
      entities: ["names", "addresses"],
      rewrite: true,
      model: "anthropic/claude-haiku-4-5",
    });

    expect(response.redacted).not.toContain("Jane Doe");
    expect(response.redacted).not.toContain("123 Main Street");
    expect(response.redacted).not.toContain("10001");
    expect(response.redacted).not.toContain("<NAME_REDACTED>");
    expect(response.findings.length).toBeGreaterThan(0);
  });

  it("should use placeholders when rewrite is false", async () => {
    mockCallProvider.mockResolvedValueOnce(
      redactResponse("My email is <EMAIL_REDACTED>.", ["john@example.com"]),
    );
    const client = createClient({ apiKey: "test-key" });

    const response = await client.redact({
      input: "My email is john@example.com.",
      rewrite: false,
      model: "anthropic/claude-haiku-4-5",
    });

    expect(response.redacted).not.toContain("john@example.com");
    expect(response.redacted).toContain("REDACTED");
  });

  it("should include rewrite instruction in system prompt", async () => {
    mockCallProvider.mockResolvedValueOnce(
      redactResponse("Rewritten text.", ["original@example.com"]),
    );
    const client = createClient({ apiKey: "test-key" });

    await client.redact({
      input: "My email is original@example.com.",
      rewrite: true,
      model: "anthropic/claude-haiku-4-5",
    });

    const messages = mockCallProvider.mock.calls[0][1];
    const systemMsg = messages.find((m) => m.role === "system");
    expect((systemMsg!.content as string).toLowerCase()).toContain("rewrite");
  });
});
