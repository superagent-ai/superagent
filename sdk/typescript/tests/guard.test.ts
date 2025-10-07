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
});
