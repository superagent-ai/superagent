import { describe, it, expect, beforeAll } from "vitest";
import { createClient, SafetyClient } from "../src/index.js";

const MODEL = "anthropic/claude-haiku-4-5";

describe("Anthropic Rewrite", () => {
  let client: SafetyClient;

  beforeAll(() => {
    client = createClient();
  });

  describe("rewrite mode", () => {
    it("should rewrite sensitive information contextually instead of using placeholders", async () => {
      const response = await client.redact({
        input: "My email is john@example.com and my phone is 555-123-4567.",
        rewrite: true,
        model: MODEL,
      });

      // Should NOT contain the original sensitive information
      expect(response.redacted).not.toContain("john@example.com");
      expect(response.redacted).not.toContain("555-123-4567");

      // Should NOT contain placeholder markers (rewrite mode doesn't use them)
      expect(response.redacted).not.toContain("<EMAIL_REDACTED>");
      expect(response.redacted).not.toContain("<PHONE_REDACTED>");

      // Should have findings
      expect(response.findings.length).toBeGreaterThan(0);

      // Should have usage stats
      expect(response.usage.promptTokens).toBeGreaterThan(0);
      expect(response.usage.completionTokens).toBeGreaterThan(0);
      expect(response.usage.totalTokens).toBeGreaterThan(0);
    });

    it("should rewrite names and addresses naturally", async () => {
      const response = await client.redact({
        input:
          "Please contact Jane Doe at 123 Main Street, New York, NY 10001.",
        entities: ["names", "addresses"],
        rewrite: true,
        model: MODEL,
      });

      // Should NOT contain the original sensitive information
      expect(response.redacted).not.toContain("Jane Doe");
      expect(response.redacted).not.toContain("123 Main Street");
      expect(response.redacted).not.toContain("10001");

      // Should NOT contain placeholder markers
      expect(response.redacted).not.toContain("<NAME_REDACTED>");
      expect(response.redacted).not.toContain("<ADDRESS_REDACTED>");

      // Should have findings
      expect(response.findings.length).toBeGreaterThan(0);
    });

    it("should use placeholders when rewrite is false", async () => {
      const response = await client.redact({
        input: "My email is john@example.com.",
        rewrite: false,
        model: MODEL,
      });

      // Should NOT contain the original email
      expect(response.redacted).not.toContain("john@example.com");

      // Should contain placeholder marker
      expect(response.redacted).toContain("REDACTED");
    });
  });
});
