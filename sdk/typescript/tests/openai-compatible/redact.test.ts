import { describe, it, expect, beforeAll } from "vitest";
import { createClient, SafetyClient } from "../../src/index.js";

const MODEL = "openai-compatible/gpt-4o-mini";

describe("OpenAI Compatible Redact", () => {
  let client: SafetyClient;

  beforeAll(() => {
    client = createClient();
  });

  it("should redact email addresses", async () => {
    const response = await client.redact({
      input: "Contact me at john.doe@example.com for more information.",
      model: MODEL,
    });

    expect(response.redacted).not.toContain("john.doe@example.com");
    expect(response.redacted).toMatch(/<[A-Z_]+_REDACTED>/i);
    expect(response.findings.length).toBeGreaterThan(0);
    expect(response.usage.promptTokens).toBeGreaterThan(0);
    expect(response.usage.completionTokens).toBeGreaterThan(0);
    expect(response.usage.totalTokens).toBeGreaterThan(0);
  });

  it("should preserve safe content without redactions", async () => {
    const response = await client.redact({
      input: "The weather today is sunny with a high of 75 degrees.",
      model: MODEL,
    });

    expect(response.redacted).toBe(
      "The weather today is sunny with a high of 75 degrees."
    );
    expect(response.findings).toEqual([]);
  });
});
