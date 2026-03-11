import { describe, it, expect, vi, beforeEach } from "vitest";

const mockScan = vi.fn();

vi.mock("safety-agent", () => ({
  createClient: () => ({ scan: mockScan }),
}));

import { createClient } from "safety-agent";

describe("scan", () => {
  const client = createClient();

  beforeEach(() => {
    mockScan.mockReset();
  });

  it("returns valid response structure for repository scan", async () => {
    mockScan.mockResolvedValueOnce({
      result: "No security issues found in the repository.",
      usage: {
        inputTokens: 5000,
        outputTokens: 1200,
        reasoningTokens: 300,
        cost: 0.042,
      },
    });

    const result = await client.scan({
      repo: "https://github.com/superagent-ai/superagent-starter",
      branch: "main",
    });

    expect(result).toHaveProperty("result");
    expect(result).toHaveProperty("usage");
    expect(typeof result.result).toBe("string");
    expect(result.result.length).toBeGreaterThan(0);
    expect(typeof result.usage.inputTokens).toBe("number");
    expect(typeof result.usage.outputTokens).toBe("number");
    expect(typeof result.usage.reasoningTokens).toBe("number");
    expect(typeof result.usage.cost).toBe("number");
    expect(mockScan).toHaveBeenCalledWith(
      expect.objectContaining({
        repo: "https://github.com/superagent-ai/superagent-starter",
      }),
    );
  });
});
