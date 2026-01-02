import { describe, it, expect, beforeAll } from "vitest";
import { createClient, SafetyClient } from "../../src/index.js";

const MODEL = "bedrock/us.anthropic.claude-haiku-4-5-20251001-v1:0";

describe("Bedrock Redact", () => {
  let client: SafetyClient;

  beforeAll(() => {
    client = createClient();
  });

  describe("custom entities parameter", () => {
    it("should redact only specified entities", async () => {
      const response = await client.redact({
        input:
          "My email is john@example.com, phone is 555-123-4567, and SSN is 123-45-6789.",
        entities: ["email addresses", "phone numbers"],
        model: MODEL,
      });

      // Should redact email and phone
      expect(response.redacted).not.toContain("john@example.com");
      expect(response.redacted).not.toContain("555-123-4567");
      expect(response.findings.length).toBeGreaterThan(0);
      expect(response.usage.promptTokens).toBeGreaterThan(0);
      expect(response.usage.completionTokens).toBeGreaterThan(0);
      expect(response.usage.totalTokens).toBeGreaterThan(0);

      // Should NOT redact SSN since it's not in the entities list
      expect(response.redacted).toContain("123-45-6789");
    });

    it("should redact credit card numbers when specified", async () => {
      const response = await client.redact({
        input:
          "My credit card is 4111-1111-1111-1111 and my email is test@example.com.",
        entities: ["credit card numbers"],
        model: MODEL,
      });

      // Should redact credit card
      expect(response.redacted).not.toContain("4111-1111-1111-1111");
      expect(response.findings.length).toBeGreaterThan(0);

      // Should NOT redact email since it's not in the entities list
      expect(response.redacted).toContain("test@example.com");
    });

    it("should redact multiple specified entities", async () => {
      const response = await client.redact({
        input:
          "Email: john@example.com, Phone: 555-123-4567, Name: John Doe, Address: 123 Main St.",
        entities: ["email addresses", "phone numbers"],
        model: MODEL,
      });

      // Should redact email and phone
      expect(response.redacted).not.toContain("john@example.com");
      expect(response.redacted).not.toContain("555-123-4567");
      expect(response.findings.length).toBeGreaterThanOrEqual(2);

      // Should NOT redact name or address since they're not in the entities list
      expect(response.redacted).toContain("John Doe");
      expect(response.redacted).toContain("123 Main St");
    });

    it("should use default entities when entities parameter is not provided", async () => {
      const response = await client.redact({
        input:
          "My email is john@example.com, phone is 555-123-4567, and SSN is 123-45-6789.",
        model: MODEL,
      });

      // Should redact all default entities (email, phone, SSN)
      expect(response.redacted).not.toContain("john@example.com");
      expect(response.redacted).not.toContain("555-123-4567");
      expect(response.redacted).not.toContain("123-45-6789");
      expect(response.findings.length).toBeGreaterThanOrEqual(3);
    });
  });
});












