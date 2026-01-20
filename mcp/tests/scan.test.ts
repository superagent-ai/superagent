import { describe, it, expect } from "vitest";
import { createClient } from "safety-agent";

const DAYTONA_API_KEY = process.env.DAYTONA_API_KEY;
const SUPERAGENT_API_KEY = process.env.SUPERAGENT_API_KEY;

const skipIfNoCredentials = !DAYTONA_API_KEY || !SUPERAGENT_API_KEY;

describe.skipIf(skipIfNoCredentials)("scan", () => {
  const client = createClient();

  it("returns valid response structure for repository scan", { timeout: 300000 }, async () => {
    const result = await client.scan({
      repo: "https://github.com/superagent-ai/superagent-starter",
      branch: "main",
    });

    // Verify response structure
    expect(result).toHaveProperty("result");
    expect(result).toHaveProperty("usage");
    expect(typeof result.result).toBe("string");
    expect(result.result.length).toBeGreaterThan(0);

    // Verify usage structure
    expect(typeof result.usage.inputTokens).toBe("number");
    expect(typeof result.usage.outputTokens).toBe("number");
    expect(typeof result.usage.reasoningTokens).toBe("number");
    expect(typeof result.usage.cost).toBe("number");
  });
});
