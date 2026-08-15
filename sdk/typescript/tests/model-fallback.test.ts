import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { callProvider } from "../src/providers/index.js";

const GUARD_CONTENT = '{"classification":"pass","reasoning":"ok","violation_types":[],"cwe_codes":[]}';

function googleSuccessResponse() {
  return {
    candidates: [{ content: { parts: [{ text: GUARD_CONTENT }], role: "model" }, finishReason: "STOP" }],
    usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5, totalTokenCount: 15 },
    modelVersion: "gemini-2.5-pro",
  };
}

function openaiSuccessResponse() {
  return {
    id: "resp_test",
    output: [{ type: "message", content: [{ type: "output_text", text: GUARD_CONTENT }] }],
    usage: { input_tokens: 10, output_tokens: 5, total_tokens: 15 },
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function errorResponse(status: number, message: string) {
  return new Response(
    JSON.stringify({ error: { code: status, message, status: "UNAVAILABLE" } }),
    { status, headers: { "Content-Type": "application/json" } },
  );
}

function retryAfterResponse(status: number, message: string, retryAfterSeconds: number) {
  return new Response(
    JSON.stringify({ error: { code: status, message, status: "RATE_LIMITED" } }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
      },
    },
  );
}

describe("Model Fallback", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      GOOGLE_API_KEY: "test-google-key",
      OPENAI_API_KEY: "test-openai-key",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it("should fall back to secondary model on 503", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(errorResponse(503, "High demand"))
      .mockResolvedValueOnce(jsonResponse(googleSuccessResponse()));

    const result = await callProvider(
      "google/gemini-2.5-flash-lite",
      [{ role: "user", content: "test" }],
      undefined,
      undefined,
      "google/gemini-2.5-pro",
    );

    expect(result.choices[0].message.content).toContain("pass");
    expect(fetchSpy).toHaveBeenCalledTimes(2);

    const firstUrl = fetchSpy.mock.calls[0][0] as string;
    const secondUrl = fetchSpy.mock.calls[1][0] as string;
    expect(firstUrl).toContain("gemini-2.5-flash-lite");
    expect(secondUrl).toContain("gemini-2.5-pro");
  });

  it("should fall back to secondary model on 429", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(errorResponse(429, "Rate limited"))
      .mockResolvedValueOnce(jsonResponse(googleSuccessResponse()));

    const result = await callProvider(
      "google/gemini-2.5-flash-lite",
      [{ role: "user", content: "test" }],
      undefined,
      undefined,
      "google/gemini-2.5-pro",
    );

    expect(result.choices[0].message.content).toContain("pass");
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("should fall back to secondary model on 500", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(errorResponse(500, "Internal error"))
      .mockResolvedValueOnce(jsonResponse(googleSuccessResponse()));

    const result = await callProvider(
      "google/gemini-2.5-flash-lite",
      [{ role: "user", content: "test" }],
      undefined,
      undefined,
      "google/gemini-2.5-pro",
    );

    expect(result.choices[0].message.content).toContain("pass");
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("should fall back to secondary model on 502", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(errorResponse(502, "Bad gateway"))
      .mockResolvedValueOnce(jsonResponse(googleSuccessResponse()));

    const result = await callProvider(
      "google/gemini-2.5-flash-lite",
      [{ role: "user", content: "test" }],
      undefined,
      undefined,
      "google/gemini-2.5-pro",
    );

    expect(result.choices[0].message.content).toContain("pass");
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("should NOT fall back on non-retryable status codes (400)", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(errorResponse(400, "Bad request"));

    await expect(
      callProvider(
        "google/gemini-2.5-flash-lite",
        [{ role: "user", content: "test" }],
        undefined,
        undefined,
        "google/gemini-2.5-pro",
      ),
    ).rejects.toThrow("Provider API error (400)");
  });

  it("should NOT fall back on 401 Unauthorized", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(errorResponse(401, "Unauthorized"));

    await expect(
      callProvider(
        "google/gemini-2.5-flash-lite",
        [{ role: "user", content: "test" }],
        undefined,
        undefined,
        "google/gemini-2.5-pro",
      ),
    ).rejects.toThrow("Provider API error (401)");
  });

  it("should NOT fall back on 403 Forbidden", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(errorResponse(403, "Forbidden"));

    await expect(
      callProvider(
        "google/gemini-2.5-flash-lite",
        [{ role: "user", content: "test" }],
        undefined,
        undefined,
        "google/gemini-2.5-pro",
      ),
    ).rejects.toThrow("Provider API error (403)");
  });

  it("should throw if no fallbackModel is set and provider returns 503", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(errorResponse(503, "High demand"));

    await expect(
      callProvider(
        "google/gemini-2.5-flash-lite",
        [{ role: "user", content: "test" }],
      ),
    ).rejects.toThrow("Provider API error (503)");
  });

  it("should not infinite-loop: fallback model only gets one attempt", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(errorResponse(503, "Primary failed"))
      .mockResolvedValueOnce(errorResponse(503, "Fallback also failed"));

    await expect(
      callProvider(
        "google/gemini-2.5-flash-lite",
        [{ role: "user", content: "test" }],
        undefined,
        undefined,
        "google/gemini-2.5-pro",
      ),
    ).rejects.toThrow("Provider API error (503)");

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("should support cross-provider fallback (Google -> OpenAI)", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(errorResponse(503, "Google unavailable"))
      .mockResolvedValueOnce(jsonResponse(openaiSuccessResponse()));

    const result = await callProvider(
      "google/gemini-2.5-flash-lite",
      [{ role: "user", content: "test" }],
      undefined,
      undefined,
      "openai/gpt-4o-mini",
    );

    expect(result.choices[0].message.content).toContain("pass");
    expect(fetchSpy).toHaveBeenCalledTimes(2);

    const firstUrl = fetchSpy.mock.calls[0][0] as string;
    const secondUrl = fetchSpy.mock.calls[1][0] as string;
    expect(firstUrl).toContain("generativelanguage.googleapis.com");
    expect(secondUrl).toContain("openai.com");
  });

  it("should succeed without fallback when primary model works", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(jsonResponse(googleSuccessResponse()));

    const result = await callProvider(
      "google/gemini-2.5-flash-lite",
      [{ role: "user", content: "test" }],
      undefined,
      undefined,
      "google/gemini-2.5-pro",
    );

    expect(result.choices[0].message.content).toContain("pass");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("should wait Retry-After and retry the primary model on short 429", async () => {
    vi.useFakeTimers();
    const sleepSpy = vi.spyOn(globalThis, "setTimeout");
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(retryAfterResponse(429, "Rate limited", 2))
      .mockResolvedValueOnce(jsonResponse(googleSuccessResponse()));

    const promise = callProvider(
      "google/gemini-2.5-flash-lite",
      [{ role: "user", content: "test" }],
      undefined,
      undefined,
      "google/gemini-2.5-pro",
    );

    // Advance the fake clock past the Retry-After sleep so the retry proceeds.
    await vi.advanceTimersByTimeAsync(2000);
    const result = await promise;

    expect(result.choices[0].message.content).toContain("pass");
    // Primary -> sleep -> primary again; no fallback involved.
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    const firstUrl = fetchSpy.mock.calls[0][0] as string;
    const secondUrl = fetchSpy.mock.calls[1][0] as string;
    expect(firstUrl).toContain("gemini-2.5-flash-lite");
    expect(secondUrl).toContain("gemini-2.5-flash-lite");
    expect(sleepSpy).toHaveBeenCalled();

    vi.useRealTimers();
  });

  it("should fall back when Retry-After exceeds the threshold", async () => {
    vi.useFakeTimers();
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(retryAfterResponse(429, "Rate limited", 60))
      .mockResolvedValueOnce(jsonResponse(googleSuccessResponse()));

    const promise = callProvider(
      "google/gemini-2.5-flash-lite",
      [{ role: "user", content: "test" }],
      undefined,
      undefined,
      "google/gemini-2.5-pro",
    );

    await vi.advanceTimersByTimeAsync(0);
    const result = await promise;

    expect(result.choices[0].message.content).toContain("pass");
    // No sleep: falls straight through to the fallback model.
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    const secondUrl = fetchSpy.mock.calls[1][0] as string;
    expect(secondUrl).toContain("gemini-2.5-pro");

    vi.useRealTimers();
  });

  it("should fall back when Retry-After is missing on a 429", async () => {
    vi.useFakeTimers();
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(errorResponse(429, "Rate limited"))
      .mockResolvedValueOnce(jsonResponse(googleSuccessResponse()));

    const promise = callProvider(
      "google/gemini-2.5-flash-lite",
      [{ role: "user", content: "test" }],
      undefined,
      undefined,
      "google/gemini-2.5-pro",
    );

    await vi.advanceTimersByTimeAsync(0);
    const result = await promise;

    expect(result.choices[0].message.content).toContain("pass");
    // Existing behavior preserved: instant fallback, no wait.
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    const secondUrl = fetchSpy.mock.calls[1][0] as string;
    expect(secondUrl).toContain("gemini-2.5-pro");

    vi.useRealTimers();
  });

  it("should not misroute a retry-chain failure to the always-on URL when its message mentions timeout", async () => {
    // Regression: the Retry-After retry chain used to sit inside the cold-start
    // try/catch, so a failure from the retried primary whose message happened to
    // contain "timeout" was swallowed by the abort/timeout heuristic and the
    // real provider error was masked by an always-on fallback call. Response
    // handling now lives outside the timeout catch.
    vi.useFakeTimers();
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(retryAfterResponse(429, "Rate limited", 2))
      .mockResolvedValueOnce(
        // A NON-retryable failure whose body happens to mention "timeout": in
        // the buggy layout this was swallowed by the outer cold-start timeout
        // heuristic and swapped for an always-on fallback response.
        errorResponse(400, "Bad request mentioning timeout"),
      )
      // Safety net: if the always-on URL is (wrongly) hit, give it a plausible
      // response so the misrouting is visible via the reject/call-count asserts.
      .mockResolvedValue(jsonResponse(googleSuccessResponse()));

    const promise = callProvider(
      "superagent/guard-1.7b",
      [{ role: "user", content: "test" }],
      undefined,
      { enableFallback: true },
      "superagent/guard-1.7b",
    );

    // Attach the rejection handler BEFORE advancing the clock so the retried
    // call's rejection is observed (not reported as an unhandled rejection).
    const assertion = expect(promise).rejects.toThrow(
      /Provider API error \(400\)/,
    );
    // Advance past the Retry-After sleep so the retried primary call runs.
    await vi.advanceTimersByTimeAsync(2000);

    // The real 400 error propagates; it is NOT swapped for a fallback response.
    await assertion;
    // Primary 429 -> retried primary 400. No always-on fallback fetch.
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    const urls = fetchSpy.mock.calls.map((call) => call[0] as string);
    expect(urls.some((u) => u.includes("/fallback"))).toBe(false);

    vi.useRealTimers();
  });
});
