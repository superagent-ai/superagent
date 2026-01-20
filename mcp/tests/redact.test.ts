import { describe, it, expect } from "vitest";
import { createClient } from "safety-agent";

const client = createClient();

describe("redact", () => {
  it("redacts email addresses", async () => {
    const result = await client.redact({
      input: "My email is john.doe@example.com",
      model: "openai/gpt-4o-mini",
    });

    expect(result.redacted).toBeDefined();
    expect(result.redacted).not.toContain("john.doe@example.com");
    expect(result.findings).toBeDefined();
    expect(result.usage).toBeDefined();
  });

  it("redacts multiple PII types", async () => {
    const result = await client.redact({
      input:
        "Contact John Smith at john@example.com or call 555-123-4567. SSN: 123-45-6789",
      model: "openai/gpt-4o-mini",
    });

    expect(result.redacted).toBeDefined();
    expect(result.redacted).not.toContain("john@example.com");
    expect(result.redacted).not.toContain("555-123-4567");
    expect(result.redacted).not.toContain("123-45-6789");
    expect(result.findings.length).toBeGreaterThan(0);
  });

  it("returns proper response structure", async () => {
    const result = await client.redact({
      input: "Test input with email test@test.com",
      model: "openai/gpt-4o-mini",
    });

    expect(result).toHaveProperty("redacted");
    expect(result).toHaveProperty("findings");
    expect(result).toHaveProperty("usage");
    expect(result.usage).toHaveProperty("promptTokens");
    expect(result.usage).toHaveProperty("completionTokens");
    expect(result.usage).toHaveProperty("totalTokens");
  });

  it("supports rewrite mode", async () => {
    const result = await client.redact({
      input: "Please contact me at sarah@company.org",
      model: "openai/gpt-4o-mini",
      rewrite: true,
    });

    expect(result.redacted).toBeDefined();
    expect(result.redacted).not.toContain("sarah@company.org");
    // In rewrite mode, should naturally rewrite instead of using placeholders
    expect(result.usage).toBeDefined();
  });
});
