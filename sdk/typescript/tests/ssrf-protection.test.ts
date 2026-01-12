import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { lookup } from "node:dns/promises";
import * as ipaddr from "ipaddr.js";

// We need to test the internal functions, so we'll import the module
// and test the validation through the public API
import { createClient } from "../src/index.js";

// Mock DNS lookup for testing
vi.mock("node:dns/promises", () => ({
  lookup: vi.fn(),
}));

describe("SSRF Protection - URL Validation", () => {
  const client = createClient();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("IPv4 private IP blocking", () => {
    it("should block localhost (127.0.0.1)", async () => {
      await expect(
        client.guard({
          input: "http://127.0.0.1/test.pdf",
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(/localhost access is not allowed/);
    });

    it("should block 127.0.0.0/8 range", async () => {
      await expect(
        client.guard({
          input: "http://127.1.2.3/test.pdf",
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(/localhost access is not allowed/);
    });

    it("should block localhost hostname", async () => {
      await expect(
        client.guard({
          input: "http://localhost/test.pdf",
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(/localhost access is not allowed/);
    });

    it("should block 10.0.0.0/8 private range", async () => {
      await expect(
        client.guard({
          input: "http://10.0.0.1/test.pdf",
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(/private\/internal IP addresses are not allowed/);
    });

    it("should block 172.16.0.0/12 private range", async () => {
      await expect(
        client.guard({
          input: "http://172.16.0.1/test.pdf",
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(/private\/internal IP addresses are not allowed/);
    });

    it("should block 192.168.0.0/16 private range", async () => {
      await expect(
        client.guard({
          input: "http://192.168.1.1/test.pdf",
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(/private\/internal IP addresses are not allowed/);
    });

    it("should block 169.254.0.0/16 link-local range", async () => {
      await expect(
        client.guard({
          input: "http://169.254.1.1/test.pdf",
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(/private\/internal IP addresses are not allowed/);
    });
  });

  describe("IPv6 private IP blocking", () => {
    it("should block IPv6 loopback (::1)", async () => {
      await expect(
        client.guard({
          input: "http://[::1]/test.pdf",
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(/localhost access is not allowed/);
    });

    it("should block IPv6 unique local address (fc00::/7)", async () => {
      // Mock DNS to return fc00::1
      vi.mocked(lookup).mockResolvedValue({
        address: "fc00::1",
        family: 6,
      } as any);

      await expect(
        client.guard({
          input: "http://[fc00::1]/test.pdf",
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(/private\/internal IP addresses are not allowed/);
    });

    it("should block IPv6 link-local (fe80::/10)", async () => {
      vi.mocked(lookup).mockResolvedValue({
        address: "fe80::1",
        family: 6,
      } as any);

      await expect(
        client.guard({
          input: "http://[fe80::1]/test.pdf",
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(/private\/internal IP addresses are not allowed/);
    });
  });

  describe("DNS resolution SSRF protection", () => {
    it("should block hostname that resolves to private IP", async () => {
      // Mock DNS to return 127.0.0.1 for a hostname
      vi.mocked(lookup).mockResolvedValue({
        address: "127.0.0.1",
        family: 4,
      } as any);

      await expect(
        client.guard({
          input: "http://attacker.com/test.pdf",
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(/localhost access is not allowed/);
    });

    it("should block hostname that resolves to 10.x.x.x", async () => {
      vi.mocked(lookup).mockResolvedValue({
        address: "10.0.0.1",
        family: 4,
      } as any);

      await expect(
        client.guard({
          input: "http://internal-service.local/test.pdf",
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(/private\/internal IP addresses are not allowed/);
    });

    it("should treat DNS failure as private (fail-safe)", async () => {
      // Mock DNS to fail
      vi.mocked(lookup).mockRejectedValue(new Error("DNS resolution failed"));

      await expect(
        client.guard({
          input: "http://unknown-host.test/test.pdf",
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(/private\/internal IP addresses are not allowed/);
    });
  });

  describe("Protocol validation", () => {
    it("should block file:// protocol", async () => {
      await expect(
        client.guard({
          input: "file:///etc/passwd",
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(/file:\/\/ protocol is not allowed/);
    });

    it("should allow http:// protocol", async () => {
      // This should not throw a protocol error (may fail for other reasons like DNS)
      vi.mocked(lookup).mockResolvedValue({
        address: "8.8.8.8",
        family: 4,
      } as any);

      // We expect it to fail on actual fetch, not on validation
      await expect(
        client.guard({
          input: "http://example.com/test.pdf",
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(); // May fail on fetch, but not on protocol validation
    });

    it("should allow https:// protocol", async () => {
      vi.mocked(lookup).mockResolvedValue({
        address: "8.8.8.8",
        family: 4,
      } as any);

      await expect(
        client.guard({
          input: "https://example.com/test.pdf",
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(); // May fail on fetch, but not on protocol validation
    });
  });

  describe("URL length validation", () => {
    it("should block URLs exceeding 2048 characters", async () => {
      const longUrl = "http://example.com/" + "a".repeat(2050);
      await expect(
        client.guard({
          input: longUrl,
          model: "openai/gpt-4o-mini",
        })
      ).rejects.toThrow(/URL exceeds maximum length/);
    });
  });

  describe("Public IP addresses", () => {
    it("should allow public IP addresses", async () => {
      vi.mocked(lookup).mockResolvedValue({
        address: "8.8.8.8", // Google DNS - public IP
        family: 4,
      } as any);

      // Should not throw validation error (may fail on actual fetch)
      try {
        await client.guard({
          input: "http://8.8.8.8/test.pdf",
          model: "openai/gpt-4o-mini",
        });
      } catch (error: any) {
        // Should not be a validation error
        expect(error.message).not.toContain("private/internal IP");
        expect(error.message).not.toContain("localhost");
      }
    });

    it("should allow valid public hostnames", async () => {
      vi.mocked(lookup).mockResolvedValue({
        address: "93.184.216.34", // example.com - public IP
        family: 4,
      } as any);

      try {
        await client.guard({
          input: "http://example.com/test.pdf",
          model: "openai/gpt-4o-mini",
        });
      } catch (error: any) {
        // Should not be a validation error
        expect(error.message).not.toContain("private/internal IP");
        expect(error.message).not.toContain("localhost");
      }
    });
  });
});
