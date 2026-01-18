import { describe, it, expect, beforeAll } from "vitest";
import { createClient } from "../src/index.js";

/**
 * Integration tests for the scan() method using Daytona sandboxes.
 *
 * These tests require:
 * - DAYTONA_API_KEY environment variable
 * - SUPERAGENT_API_KEY environment variable
 * - Network access to Daytona API
 *
 * Run with: npm test -- tests/scan.test.ts
 */

const DAYTONA_API_KEY = process.env.DAYTONA_API_KEY;
const SUPERAGENT_API_KEY = process.env.SUPERAGENT_API_KEY;

const skipIfNoCredentials = !DAYTONA_API_KEY || !SUPERAGENT_API_KEY;

describe.skipIf(skipIfNoCredentials)("Scan Method - Integration Tests", () => {
  const client = createClient();

  beforeAll(() => {
    if (skipIfNoCredentials) {
      console.log(
        "Skipping scan tests: DAYTONA_API_KEY or SUPERAGENT_API_KEY not set"
      );
    }
  });

  describe("Input validation", () => {
    it("should require repository URL", async () => {
      await expect(client.scan({ repo: "" })).rejects.toThrow(
        "Repository URL is required"
      );
    });

    it("should require https:// or git@ URL scheme", async () => {
      await expect(
        client.scan({ repo: "http://github.com/user/repo" })
      ).rejects.toThrow("Repository URL must start with https:// or git@");

      await expect(
        client.scan({ repo: "ftp://github.com/user/repo" })
      ).rejects.toThrow("Repository URL must start with https:// or git@");
    });
  });

  describe("Daytona credentials", () => {
    it("should require Daytona API key", async () => {
      const originalKey = process.env.DAYTONA_API_KEY;
      delete process.env.DAYTONA_API_KEY;

      try {
        await expect(
          client.scan({ repo: "https://github.com/user/repo" })
        ).rejects.toThrow(/Daytona API key required/);
      } finally {
        process.env.DAYTONA_API_KEY = originalKey;
      }
    });
  });

  describe("Real repository scanning", () => {
    it(
      "should scan superagent-starter repository",
      async () => {
        const result = await client.scan({
          repo: "https://github.com/superagent-ai/superagent-starter",
          branch: "main",
        });

        expect(result).toBeDefined();
        expect(result.classification).toBeDefined();
        expect(["safe", "unsafe", "error"]).toContain(result.classification);
        expect(result.reasoning).toBeDefined();
        expect(Array.isArray(result.findings)).toBe(true);
        expect(result.summary).toBeDefined();

        console.log("Scan result:", {
          classification: result.classification,
          reasoning: result.reasoning,
          findingsCount: result.findings.length,
        });
      },
      { timeout: 300000 } // 5 minute timeout for real scan
    );

    it(
      "should handle non-existent repository gracefully",
      async () => {
        const result = await client.scan({
          repo: "https://github.com/this-repo-definitely-does-not-exist-12345/fake-repo",
        });

        // Should return an error classification, not throw
        expect(result.classification).toBe("error");
        expect(result.error).toBeDefined();
      },
      { timeout: 60000 }
    );

    it(
      "should scan with custom model",
      async () => {
        const result = await client.scan({
          repo: "https://github.com/superagent-ai/superagent-starter",
          branch: "main",
          model: "anthropic/claude-sonnet-4-5",
        });

        expect(result).toBeDefined();
        expect(result.classification).toBeDefined();
      },
      { timeout: 300000 }
    );
  });

  describe("Finding structure", () => {
    it(
      "should return properly structured findings if issues found",
      async () => {
        const result = await client.scan({
          repo: "https://github.com/superagent-ai/superagent-starter",
        });

        if (result.findings.length > 0) {
          const finding = result.findings[0];
          expect(finding.file).toBeDefined();
          expect(finding.line).toBeDefined();
          expect(finding.severity).toBeDefined();
          expect(["critical", "high", "medium", "low"]).toContain(
            finding.severity
          );
          expect(finding.category).toBeDefined();
          expect(finding.description).toBeDefined();
        }

        // Summary should always have counts
        expect(typeof result.summary.critical).toBe("number");
        expect(typeof result.summary.high).toBe("number");
        expect(typeof result.summary.medium).toBe("number");
        expect(typeof result.summary.low).toBe("number");
      },
      { timeout: 300000 }
    );
  });
});

// Unit tests that don't require credentials
describe("Scan Method - Unit Tests", () => {
  const client = createClient();

  it("should validate empty repo URL", async () => {
    await expect(client.scan({ repo: "" })).rejects.toThrow(
      "Repository URL is required"
    );
  });

  it("should validate invalid URL schemes", async () => {
    await expect(
      client.scan({ repo: "ftp://example.com/repo" })
    ).rejects.toThrow("Repository URL must start with https:// or git@");
  });
});
