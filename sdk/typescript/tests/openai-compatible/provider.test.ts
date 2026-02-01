import { describe, it, expect } from "vitest";
import { openaiCompatibleProvider } from "../../src/providers/openai-compatible.js";

describe("OpenAI Compatible Provider", () => {
  it("should require OPENAI_COMPATIBLE_BASE_URL", () => {
    expect(() => openaiCompatibleProvider.buildUrl?.("", "gpt-4o-mini")).toThrow(
      "Missing OPENAI_COMPATIBLE_BASE_URL environment variable for openai-compatible provider"
    );
  });
});
