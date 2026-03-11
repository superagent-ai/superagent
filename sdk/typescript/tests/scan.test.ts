import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createClient } from "../src/index.js";

describe("Scan Method", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      SUPERAGENT_API_KEY: "test-key",
    };
    delete process.env.DAYTONA_API_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("input validation", () => {
    it("should reject empty repo URL", async () => {
      const client = createClient({ apiKey: "test-key" });

      await expect(client.scan({ repo: "" })).rejects.toThrow(
        "Repository URL",
      );
    });

    it("should require https:// or git@ URL scheme", async () => {
      const client = createClient({ apiKey: "test-key" });

      await expect(
        client.scan({ repo: "http://github.com/user/repo" }),
      ).rejects.toThrow("Repository URL must start with https:// or git@");

      await expect(
        client.scan({ repo: "ftp://github.com/user/repo" }),
      ).rejects.toThrow("Repository URL must start with https:// or git@");
    });

    it("should require Daytona API key for valid URL", async () => {
      const client = createClient({ apiKey: "test-key" });

      await expect(
        client.scan({ repo: "https://github.com/user/repo" }),
      ).rejects.toThrow("Daytona API key required");
    });

    it("should require Daytona API key for git@ URL", async () => {
      const client = createClient({ apiKey: "test-key" });

      await expect(
        client.scan({ repo: "git@github.com:user/repo.git" }),
      ).rejects.toThrow("Daytona API key required");
    });
  });
});
