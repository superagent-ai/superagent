import { describe, it, expect, beforeAll } from "vitest";
import { createClient, SafetyClient } from "../../src/index.js";

const MODEL = "openrouter/openai/gpt-4o-mini";

describe("OpenRouter Redact", () => {
  let client: SafetyClient;

  beforeAll(() => {
    client = createClient();
  });

  describe("PII redaction", () => {
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

    it("should redact phone numbers", async () => {
      const response = await client.redact({
        input: "Call me at 555-123-4567 or (555) 987-6543.",
        model: MODEL,
      });

      expect(response.redacted).not.toContain("555-123-4567");
      expect(response.redacted).not.toContain("555) 987-6543");
      expect(response.findings.length).toBeGreaterThan(0);
    });

    it("should redact SSN", async () => {
      const response = await client.redact({
        input: "My social security number is 123-45-6789.",
        model: MODEL,
      });

      expect(response.redacted).not.toContain("123-45-6789");
      expect(response.findings.length).toBeGreaterThan(0);
    });

    it("should redact multiple PII types in one input", async () => {
      const response = await client.redact({
        input:
          "My name is John Smith, email: john@test.com, phone: 555-111-2222, SSN: 111-22-3333.",
        model: MODEL,
      });

      expect(response.redacted).not.toContain("john@test.com");
      expect(response.redacted).not.toContain("555-111-2222");
      expect(response.redacted).not.toContain("111-22-3333");
      expect(response.findings.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("credential redaction", () => {
    it("should redact API keys", async () => {
      const response = await client.redact({
        input:
          "Use this API key: sk-1234567890abcdefghijklmnop to authenticate.",
        model: MODEL,
      });

      expect(response.redacted).not.toContain("sk-1234567890abcdefghijklmnop");
      expect(response.findings.length).toBeGreaterThan(0);
    });

    it("should redact passwords", async () => {
      const response = await client.redact({
        input: "Login with username: admin and password: SuperSecret123!",
        model: MODEL,
      });

      expect(response.redacted).not.toContain("SuperSecret123!");
      expect(response.findings.length).toBeGreaterThan(0);
    });

    it("should redact AWS credentials", async () => {
      const response = await client.redact({
        input:
          "AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE and AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
        model: MODEL,
      });

      expect(response.redacted).not.toContain("AKIAIOSFODNN7EXAMPLE");
      expect(response.redacted).not.toContain(
        "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
      );
      expect(response.findings.length).toBeGreaterThan(0);
    });
  });

  describe("safe content", () => {
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

    it("should preserve technical content without PII", async () => {
      const response = await client.redact({
        input:
          "Use npm install to install dependencies and npm start to run the server.",
        model: MODEL,
      });

      expect(response.redacted).toContain("npm install");
      expect(response.findings).toEqual([]);
    });
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
