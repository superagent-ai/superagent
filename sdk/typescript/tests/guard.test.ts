import { env } from "node:process";
import { describe, expect, it, vi } from "vitest";
import { createClient } from "../src/index";

const apiKey = env.SUPERAGENT_LM_API_KEY ?? "test-key";
const apiBaseUrl =
  env.SUPERAGENT_LM_API_BASE_URL ?? "https://app.superagent.sh/api";

describe("createClient", () => {
  it("guard returns a pass decision and triggers onPass", async () => {
    const onPass = vi.fn();
    const client = createClient({
      apiBaseUrl,
      apiKey,
    });

    const result = await client.guard("hello world", { onPass });

    expect(result.rejected).toBe(false);
    expect(result.decision?.status).toBe("pass");
    expect(result.reasoning).toBeDefined();
    expect(typeof result.reasoning).toBe("string");
    expect(result.usage).toBeDefined();
    expect(result.usage?.prompt_tokens).toBeGreaterThan(0);
    expect(result.raw.id).toBeDefined();
    expect(onPass).toHaveBeenCalledTimes(1);
  });

  it("guard returns a block decision and triggers onBlock with violation", async () => {
    const onBlock = vi.fn();
    const client = createClient({ apiBaseUrl, apiKey });

    const result = await client.guard("steal secrets", { onBlock });

    expect(result.rejected).toBe(true);
    expect(result.decision?.status).toBe("block");
    expect(result.decision?.violation_types).toBeDefined();
    expect(Array.isArray(result.decision?.violation_types)).toBe(true);
    expect(result.reasoning).toBeDefined();
    expect(typeof result.reasoning).toBe("string");
    expect(result.usage).toBeDefined();
    expect(result.usage?.prompt_tokens).toBeGreaterThan(0);
    expect(result.raw.id).toBeDefined();
    expect(onBlock).toHaveBeenCalled();
  });

  it("redact method redacts sensitive data", async () => {
    const client = createClient({
      apiBaseUrl,
      apiKey,
    });

    const result = await client.redact(
      "My email is john@example.com and SSN is 123-45-6789"
    );

    expect(result.redacted).toBeDefined();
    expect(typeof result.redacted).toBe("string");
    expect(result.reasoning).toBeDefined();
    expect(typeof result.reasoning).toBe("string");
  });

  it("redact method can handle stringified JSON", async () => {
    const client = createClient({
      apiBaseUrl,
      apiKey,
    });

    const result = await client.redact(
      JSON.stringify({
        prs: {
          items: [
            {
              pr_url: "https://github.com/Bilanc/repo/pull/1",
              pr_title: "Add some change",
              name: "Dickson",
              pr_merged_at: "2025-01-01T00:00:00Z",
              additions: 1,
              deletions: 1,
              total_cycle_time: "1m",
            },
          ],
        },
        issues: { items: [] },
        cursor_activities: { items: [] },
        incidents: { items: [] },
        question: "hello, what is the total number of PRs merged this week?",
        conversation_history: null,
        current_date: "2025-10-06 (Monday)",
      })
    );

    expect(result.redacted).toBeDefined();
    expect(typeof result.redacted).toBe("string");
    expect(result.reasoning).toBeDefined();
    expect(typeof result.reasoning).toBe("string");
  });

  it("redact with URL whitelist preserves whitelisted URLs", async () => {
    const client = createClient({
      apiBaseUrl,
      apiKey,
    });

    const text =
      "My email is john@example.com. Visit https://github.com/user/repo and https://private-site.com/secret for more info.";

    const result = await client.redact(text, {
      urlWhitelist: ["https://github.com"],
    });

    expect(result.redacted).toBeDefined();

    // GitHub URL should be preserved
    expect(result.redacted).toContain("https://github.com/user/repo");

    // Private URL should be redacted
    expect(result.redacted).not.toContain("private-site.com");
    expect(result.redacted).toContain("<URL_REDACTED>");
  });

  it("redact with multiple whitelisted URLs preserves all", async () => {
    const client = createClient({
      apiBaseUrl,
      apiKey,
    });

    const text =
      "Contact us at support@company.com. Check https://github.com/repo1, https://docs.example.com/guide, and https://secret.internal/data for documentation.";

    const result = await client.redact(text, {
      urlWhitelist: ["https://github.com", "https://docs.example.com"],
    });

    expect(result.redacted).toBeDefined();

    // Whitelisted URLs should be preserved
    expect(result.redacted).toContain("https://github.com/repo1");
    expect(result.redacted).toContain("https://docs.example.com/guide");

    // Non-whitelisted URL should be redacted
    expect(result.redacted).not.toContain("secret.internal");
  });

  it("redact without URL whitelist works normally", async () => {
    const client = createClient({
      apiBaseUrl,
      apiKey,
    });

    const text = "Visit https://github.com/repo and https://example.com";

    const result = await client.redact(text);

    expect(result.redacted).toBeDefined();
    expect(typeof result.redacted).toBe("string");

    // Without whitelist, all URLs should be redacted
    // (This assumes the API actually redacts URLs - adjust assertion based on actual API behavior)
  });

  it("redact with entities option redacts custom entities", async () => {
    const client = createClient({
      apiBaseUrl,
      apiKey,
    });

    const text = "My email is john@example.com and SSN is 123-45-6789";

    const result = await client.redact(text, {
      entities: ["email addresses"],
    });

    expect(result.redacted).toBeDefined();
    expect(typeof result.redacted).toBe("string");
    expect(result.reasoning).toBeDefined();
    expect(typeof result.reasoning).toBe("string");

    // Email should be redacted
    expect(result.redacted).not.toContain("john@example.com");
    // SSN should NOT be redacted (not in entities list)
    expect(result.redacted).toContain("123-45-6789");
  });

  it("redact with multiple entities redacts all specified types", async () => {
    const client = createClient({
      apiBaseUrl,
      apiKey,
    });

    const text = "Contact john@example.com or call 555-1234. SSN: 123-45-6789";

    const result = await client.redact(text, {
      entities: ["email addresses", "phone numbers"],
    });

    expect(result.redacted).toBeDefined();
    expect(typeof result.redacted).toBe("string");

    // Email and phone should be redacted
    expect(result.redacted).not.toContain("john@example.com");
    expect(result.redacted).not.toContain("555-1234");
    // SSN should NOT be redacted (not in entities list)
    expect(result.redacted).toContain("123-45-6789");
  });

  it("verify method verifies claims against sources", async () => {
    const client = createClient({
      apiBaseUrl,
      apiKey,
    });

    const text = "The company was founded in 2020 and has 500 employees.";
    const sources = [
      {
        name: "About Us",
        content: "Founded in 2020, our company has grown rapidly to become a leader in the industry.",
        url: "https://example.com/about",
      },
      {
        name: "Team Page",
        content: "We currently have over 450 dedicated team members working across multiple offices.",
        url: "https://example.com/team",
      },
    ];

    const result = await client.verify(text, sources);

    expect(result.claims).toBeDefined();
    expect(Array.isArray(result.claims)).toBe(true);
    expect(result.claims.length).toBeGreaterThan(0);
    expect(result.usage).toBeDefined();
    expect(result.usage?.prompt_tokens).toBeGreaterThan(0);
    expect(result.raw.id).toBeDefined();

    // Check structure of first claim
    const firstClaim = result.claims[0];
    expect(firstClaim.claim).toBeDefined();
    expect(typeof firstClaim.claim).toBe("string");
    expect(typeof firstClaim.verdict).toBe("boolean");
    expect(Array.isArray(firstClaim.sources)).toBe(true);
    expect(typeof firstClaim.evidence).toBe("string");
    expect(typeof firstClaim.reasoning).toBe("string");
  });

  it("verify method returns correct verdicts for true and false claims", async () => {
    const client = createClient({
      apiBaseUrl,
      apiKey,
    });

    const text = "The company was founded in 2020 and has 500 employees.";
    const sources = [
      {
        name: "About Us",
        content: "Founded in 2020, our company has grown rapidly.",
        url: "https://example.com/about",
      },
      {
        name: "Team Page",
        content: "We currently have over 450 team members.",
        url: "https://example.com/team",
      },
    ];

    const result = await client.verify(text, sources);

    expect(result.claims).toBeDefined();
    expect(result.claims.length).toBeGreaterThan(0);

    // Find the claim about founding year
    const foundingClaim = result.claims.find((c) =>
      c.claim.toLowerCase().includes("2020")
    );
    if (foundingClaim) {
      // Should be true - supported by "Founded in 2020"
      expect(foundingClaim.verdict).toBe(true);
      expect(foundingClaim.evidence).toBeDefined();
      expect(foundingClaim.reasoning).toBeDefined();
    }

    // Find the claim about employee count
    const employeeClaim = result.claims.find((c) =>
      c.claim.toLowerCase().includes("500")
    );
    if (employeeClaim) {
      // Should be false - contradicted by "over 450 team members"
      expect(employeeClaim.verdict).toBe(false);
      expect(employeeClaim.evidence).toBeDefined();
      expect(employeeClaim.reasoning).toBeDefined();
    }
  });

  it("verify method validates required text parameter", async () => {
    const client = createClient({
      apiBaseUrl,
      apiKey,
    });

    const sources = [
      {
        name: "Test Source",
        content: "Test content",
      },
    ];

    await expect(client.verify("", sources)).rejects.toThrow(
      "text must be a non-empty string"
    );
  });

  it("verify method validates required sources parameter", async () => {
    const client = createClient({
      apiBaseUrl,
      apiKey,
    });

    await expect(client.verify("Test claim", [])).rejects.toThrow(
      "sources must be a non-empty array"
    );
  });

  it("verify method validates source structure", async () => {
    const client = createClient({
      apiBaseUrl,
      apiKey,
    });

    const invalidSources = [
      {
        name: "Test Source",
        // Missing content field
      },
    ] as any;

    await expect(
      client.verify("Test claim", invalidSources)
    ).rejects.toThrow("Each source must have a 'content' field (string)");
  });

  it("verify method includes source references in results", async () => {
    const client = createClient({
      apiBaseUrl,
      apiKey,
    });

    const text = "The company was founded in 2020.";
    const sources = [
      {
        name: "Company History",
        content: "The company was established in 2020 by our founders.",
        url: "https://example.com/history",
      },
    ];

    const result = await client.verify(text, sources);

    expect(result.claims).toBeDefined();
    expect(result.claims.length).toBeGreaterThan(0);

    const claim = result.claims[0];
    expect(claim.sources).toBeDefined();
    expect(Array.isArray(claim.sources)).toBe(true);
    expect(claim.sources.length).toBeGreaterThan(0);

    const source = claim.sources[0];
    expect(source.name).toBeDefined();
    expect(source.url).toBeDefined();
  });
});
