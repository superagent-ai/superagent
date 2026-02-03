import { describe, it, expect } from "vitest";
import { createClient } from "../src/index.js";

const DAYTONA_API_KEY = process.env.DAYTONA_API_KEY;
const SUPERAGENT_API_KEY = process.env.SUPERAGENT_API_KEY;

const skipIfNoCredentials = !DAYTONA_API_KEY || !SUPERAGENT_API_KEY;

describe.skipIf(skipIfNoCredentials)("Scan Method", () => {
  const client = createClient();

  it(
    "should scan superagent-starter repository and return structured response",
    { timeout: 300000 },
    async () => {
      const response = await client.scan({
        repo: "https://github.com/superagent-ai/superagent-starter",
        branch: "main",
      });

      // Check result field
      expect(response.result).toBeDefined();
      expect(typeof response.result).toBe("string");
      expect(response.result.length).toBeGreaterThan(0);

      // Check usage field
      expect(response.usage).toBeDefined();
      expect(typeof response.usage.inputTokens).toBe("number");
      expect(typeof response.usage.outputTokens).toBe("number");
      expect(typeof response.usage.reasoningTokens).toBe("number");
      expect(typeof response.usage.cost).toBe("number");
    },
  );
});
