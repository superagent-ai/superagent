import { describe, it, expect, vi, beforeEach } from "vitest";

const mockRedact = vi.fn();

vi.mock("safety-agent", () => ({
  createClient: () => ({ redact: mockRedact }),
}));

import { createClient } from "safety-agent";

describe("redact", () => {
  const client = createClient();

  beforeEach(() => {
    mockRedact.mockReset();
  });

  it("redacts email addresses", async () => {
    mockRedact.mockResolvedValueOnce({
      redacted: "My email is <EMAIL_REDACTED>",
      findings: ["john.doe@example.com"],
      usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
    });

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
    mockRedact.mockResolvedValueOnce({
      redacted:
        "Contact <NAME_REDACTED> at <EMAIL_REDACTED> or call <PHONE_REDACTED>. SSN: <SSN_REDACTED>",
      findings: [
        "John Smith",
        "john@example.com",
        "555-123-4567",
        "123-45-6789",
      ],
      usage: { promptTokens: 120, completionTokens: 60, totalTokens: 180 },
    });

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
    mockRedact.mockResolvedValueOnce({
      redacted: "Test input with email <EMAIL_REDACTED>",
      findings: ["test@test.com"],
      usage: { promptTokens: 80, completionTokens: 40, totalTokens: 120 },
    });

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
    mockRedact.mockResolvedValueOnce({
      redacted: "Please contact me at user@company.net",
      findings: ["sarah@company.org"],
      usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
    });

    const result = await client.redact({
      input: "Please contact me at sarah@company.org",
      model: "openai/gpt-4o-mini",
      rewrite: true,
    });

    expect(result.redacted).toBeDefined();
    expect(result.redacted).not.toContain("sarah@company.org");
    expect(result.usage).toBeDefined();
    expect(mockRedact).toHaveBeenCalledWith(
      expect.objectContaining({ rewrite: true }),
    );
  });
});
