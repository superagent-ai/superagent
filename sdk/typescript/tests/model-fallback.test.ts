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
});
