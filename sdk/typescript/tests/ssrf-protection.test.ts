import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { lookup } from "node:dns/promises";
import { fetch as undiciFetch } from "undici";

import { fetchPublicUrl } from "../src/utils/safe-url-fetcher.js";

vi.mock("node:dns/promises", () => ({
  lookup: vi.fn(),
}));

vi.mock("undici", () => ({
  Agent: class {
    async close() {}
  },
  fetch: vi.fn(),
}));

describe("safe URL fetching", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(undiciFetch).mockRejectedValue(new Error("fetch attempted"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    "http://127.0.0.1/admin",
    "http://10.0.0.1/internal",
    "http://172.16.0.1/internal",
    "http://192.168.1.1/internal",
    "http://169.254.169.254/latest/meta-data/",
    "http://[::1]/admin",
    "http://[fc00::1]/internal",
    "http://[fe80::1]/internal",
  ])("blocks non-public destination %s", async (url) => {
    await expect(fetchPublicUrl(url)).rejects.toThrow(
      /localhost access|private\/internal IP addresses/
    );
    expect(undiciFetch).not.toHaveBeenCalled();
  });

  it("blocks hostnames when any DNS result is non-public", async () => {
    vi.mocked(lookup).mockResolvedValue([
      { address: "93.184.216.34", family: 4 },
      { address: "10.0.0.1", family: 4 },
    ] as any);

    await expect(
      fetchPublicUrl("https://mixed.example/document.pdf")
    ).rejects.toThrow(/private\/internal IP addresses/);
    expect(undiciFetch).not.toHaveBeenCalled();
  });

  it("fails closed when DNS resolution fails", async () => {
    vi.mocked(lookup).mockRejectedValue(new Error("DNS failure"));

    await expect(
      fetchPublicUrl("https://unknown.example/document.pdf")
    ).rejects.toThrow(/hostname could not be resolved safely/);
    expect(undiciFetch).not.toHaveBeenCalled();
  });

  it("validates every redirect target", async () => {
    vi.mocked(lookup).mockResolvedValue([
      { address: "93.184.216.34", family: 4 },
    ] as any);
    vi.mocked(undiciFetch).mockResolvedValueOnce(
      new Response(null, {
        status: 302,
        headers: { location: "http://169.254.169.254/latest/meta-data/" },
      }) as any
    );

    await expect(
      fetchPublicUrl("https://attacker.example/redirect")
    ).rejects.toThrow(/private\/internal IP addresses/);
    expect(undiciFetch).toHaveBeenCalledTimes(1);
  });

  it("continues downloading content from public URLs", async () => {
    vi.mocked(lookup).mockResolvedValue([
      { address: "93.184.216.34", family: 4 },
    ] as any);
    vi.mocked(undiciFetch).mockResolvedValueOnce(
      new Response("remote document", {
        status: 200,
        headers: { "content-type": "text/plain" },
      }) as any
    );

    const response = await fetchPublicUrl(
      "https://example.com/document.txt"
    );

    expect(new TextDecoder().decode(response.data)).toBe("remote document");
    expect(response.contentType).toBe("text/plain");
  });

  it("rejects embedded credentials and non-HTTP protocols", async () => {
    await expect(
      fetchPublicUrl("https://user:password@example.com/file")
    ).rejects.toThrow(/embedded credentials/);
    await expect(fetchPublicUrl("file:///etc/passwd")).rejects.toThrow(
      /file:\/\/ protocol/
    );
  });
});
