import { describe, it, expect, vi, beforeEach } from "vitest";
import { createClient } from "../src/index.js";
import { callProvider } from "../src/providers/index.js";

vi.mock("../src/providers/index.js", async () => {
  const actual = await vi.importActual<
    typeof import("../src/providers/index.js")
  >("../src/providers/index.js");
  return {
    ...actual,
    callProvider: vi.fn(),
  };
});

const mockedCallProvider = vi.mocked(callProvider);

const mockResponse = {
  id: "test",
  usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 },
  choices: [
    {
      message: {
        role: "assistant",
        content: JSON.stringify({
          classification: "pass",
          violation_types: [],
          cwe_codes: [],
        }),
      },
    },
  ],
};

describe("Guard observability hooks", () => {
  beforeEach(() => {
    mockedCallProvider.mockReset();
  });

  it("emits start, segment, and result hooks for chunked input", async () => {
    const client = createClient({ apiKey: "test-key" });

    const startEvents: unknown[] = [];
    const segmentEvents: unknown[] = [];
    const resultEvents: unknown[] = [];

    mockedCallProvider.mockResolvedValue(mockResponse);

    const input =
      "one two three four five six seven eight nine ten eleven twelve";

    await client.guard({
      input,
      model: "openai/gpt-4o-mini",
      chunkSize: 10,
      hooks: {
        onStart: (event) => startEvents.push(event),
        onSegment: (event) => segmentEvents.push(event),
        onResult: (event) => resultEvents.push(event),
      },
    });

    expect(startEvents.length).toBe(1);
    const startEvent = startEvents[0] as { segmentCount: number };
    expect(segmentEvents.length).toBe(startEvent.segmentCount);
    expect(segmentEvents.length).toBeGreaterThan(1);
    expect(resultEvents.length).toBe(1);
  });

  it("emits error hook on provider failures", async () => {
    const client = createClient({ apiKey: "test-key" });

    const errorEvents: unknown[] = [];

    mockedCallProvider.mockRejectedValue(new Error("provider failure"));

    await expect(
      client.guard({
        input: "short input",
        model: "openai/gpt-4o-mini",
        chunkSize: 0,
        hooks: {
          onError: (event) => errorEvents.push(event),
        },
      })
    ).rejects.toThrow(/provider failure/);

    expect(errorEvents.length).toBe(1);
  });
});
