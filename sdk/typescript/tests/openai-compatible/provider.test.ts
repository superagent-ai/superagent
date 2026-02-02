import { describe, it, expect, afterEach } from "vitest";
import { openaiCompatibleProvider } from "../../src/providers/openai-compatible.js";

describe("OpenAI Compatible Provider", () => {
  const envSnapshot = { ...process.env };

  afterEach(() => {
    process.env = { ...envSnapshot };
  });

  it("should require OPENAI_COMPATIBLE_BASE_URL when unset", () => {
    delete process.env.OPENAI_COMPATIBLE_BASE_URL;

    expect(() => openaiCompatibleProvider.buildUrl?.("", "gpt-4o-mini")).toThrow(
      "Missing OPENAI_COMPATIBLE_BASE_URL environment variable for openai-compatible provider"
    );
  });

  it("should build URL when OPENAI_COMPATIBLE_BASE_URL is set", () => {
    process.env.OPENAI_COMPATIBLE_BASE_URL = "https://example.com/v1";

    expect(
      openaiCompatibleProvider.buildUrl?.(
        process.env.OPENAI_COMPATIBLE_BASE_URL,
        "gpt-4o-mini"
      )
    ).toBe("https://example.com/v1/chat/completions");
  });
});
