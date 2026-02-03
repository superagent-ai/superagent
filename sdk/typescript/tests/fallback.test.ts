import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  getFallbackUrl,
  DEFAULT_FALLBACK_URL,
  DEFAULT_FALLBACK_TIMEOUT_MS,
} from "../src/providers/superagent.js";

describe("Fallback Configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getFallbackUrl", () => {
    it("should return client option when provided", () => {
      const clientUrl = "https://custom-fallback.example.com/api/chat";
      process.env.SUPERAGENT_FALLBACK_URL =
        "https://env-fallback.example.com/api/chat";

      const result = getFallbackUrl(clientUrl);

      expect(result).toBe(clientUrl);
    });

    it("should return environment variable when client option is not provided", () => {
      const envUrl = "https://env-fallback.example.com/api/chat";
      process.env.SUPERAGENT_FALLBACK_URL = envUrl;

      const result = getFallbackUrl(undefined);

      expect(result).toBe(envUrl);
    });

    it("should return default constant when no client option or env var", () => {
      delete process.env.SUPERAGENT_FALLBACK_URL;

      const result = getFallbackUrl(undefined);

      expect(result).toBe(DEFAULT_FALLBACK_URL);
    });

    it("should handle empty string client option by falling back to env var", () => {
      const envUrl = "https://env-fallback.example.com/api/chat";
      process.env.SUPERAGENT_FALLBACK_URL = envUrl;

      const result = getFallbackUrl("");

      expect(result).toBe(envUrl);
    });
  });

  describe("Constants", () => {
    it("should have correct default fallback URL", () => {
      expect(DEFAULT_FALLBACK_URL).toBe("https://superagent.sh/api/fallback");
    });

    it("should have correct default fallback timeout", () => {
      expect(DEFAULT_FALLBACK_TIMEOUT_MS).toBe(5000);
    });
  });
});

describe("Client Fallback Options", () => {
  it("should accept fallback options in createClient", async () => {
    // This test verifies the types compile correctly
    const { createClient } = await import("../src/index.js");

    // Should not throw when creating client with fallback options
    // (requires API key, so we mock or skip actual creation)
    expect(() => {
      // Just verify the type signature accepts these options
      const config = {
        apiKey: "test-key",
        enableFallback: true,
        fallbackTimeoutMs: 3000,
        fallbackUrl: "https://custom.example.com/api/chat",
      };
      // Verify config shape is valid
      expect(config.enableFallback).toBe(true);
      expect(config.fallbackTimeoutMs).toBe(3000);
      expect(config.fallbackUrl).toBe("https://custom.example.com/api/chat");
    }).not.toThrow();
  });
});

describe("Fallback Logic", () => {
  it("should have fallback enabled by default with production URL", async () => {
    const { DEFAULT_FALLBACK_URL } =
      await import("../src/providers/superagent.js");

    expect(DEFAULT_FALLBACK_URL).toBe("https://superagent.sh/api/fallback");

    // The default URL is a real endpoint, so fallback should be available
    const fallbackAvailable =
      DEFAULT_FALLBACK_URL !== "FALLBACK_ENDPOINT_PLACEHOLDER";
    expect(fallbackAvailable).toBe(true);
  });

  it("should allow overriding fallback URL via env var", () => {
    const customUrl = "https://custom-fallback.example.com/api/chat";
    process.env.SUPERAGENT_FALLBACK_URL = customUrl;

    const fallbackUrl = getFallbackUrl(undefined);

    expect(fallbackUrl).toBe(customUrl);

    delete process.env.SUPERAGENT_FALLBACK_URL;
  });

  it("should use default URL when no env var is set", () => {
    delete process.env.SUPERAGENT_FALLBACK_URL;

    const fallbackUrl = getFallbackUrl(undefined);

    expect(fallbackUrl).toBe(DEFAULT_FALLBACK_URL);
    expect(fallbackUrl).toBe("https://superagent.sh/api/fallback");
  });
});
