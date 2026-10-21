import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  ORCAROUTER_SEED_MODELS,
  OrcaRouterCatalogError,
  fetchOrcaRouterCatalog,
  filterOrcaRouterModels,
  parseOrcaRouterCatalog,
  resetOrcaRouterCatalogCache,
} from "../../src/providers/orcarouter-catalog.js";

const ENV_KEYS = ["ORCAROUTER_API_KEY", "ORCA_API_BASE_URL", "ORCA_BASE_URL"] as const;

function snapshotEnv(): Record<string, string | undefined> {
  return Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
}

function restoreEnv(snapshot: Record<string, string | undefined>): void {
  for (const key of ENV_KEYS) {
    if (snapshot[key] === undefined) delete process.env[key];
    else process.env[key] = snapshot[key];
  }
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Fixture covering the shape of `GET /v1/models`: text-only chat, image-input
 * chat, embedding, image generation, video and rerank records, plus records
 * with missing metadata.
 */
const CATALOG_FIXTURE = {
  object: "list",
  data: [
    {
      id: "orcarouter/fusion",
      supported_endpoint_types: ["openai", "openai-response", "anthropic", "gemini"],
      context_length: 1000000,
    },
    {
      id: "deepseek/deepseek-v4-pro",
      supported_endpoint_types: ["openai", "openai-response"],
      architecture: { input_modalities: ["text"] },
      context_length: 1048576,
    },
    {
      id: "deepseek/deepseek-v4.1-flash",
      supported_endpoint_types: ["openai", "anthropic"],
      architecture: { input_modalities: ["text", "image"] },
      context_length: 1048576,
    },
    {
      id: "openai/gpt-5.5",
      supported_endpoint_types: ["openai", "openai-response"],
      architecture: { input_modalities: ["text", "image"] },
      reasoning: { efforts: ["low", "medium", "high", "xhigh"] },
    },
    {
      id: "vendor/legacy-chat-no-metadata",
      supported_endpoint_types: ["openai"],
    },
    {
      id: "vendor/embed-1",
      supported_endpoint_types: ["embeddings"],
    },
    {
      id: "vendor/image-gen-1",
      supported_endpoint_types: ["image-generation"],
    },
    {
      id: "vendor/video-1",
      supported_endpoint_types: ["openai-video"],
    },
    {
      id: "vendor/rerank-1",
      supported_endpoint_types: ["jina-rerank"],
    },
    {
      id: "vendor/name-looks-like-vision",
      supported_endpoint_types: ["openai"],
      architecture: { input_modalities: ["text"] },
    },
    { id: "bad id with spaces", supported_endpoint_types: ["openai"] },
    { supported_endpoint_types: ["openai"] },
    "not-an-object",
  ],
};

describe("OrcaRouter model catalog", () => {
  const envSnapshot = snapshotEnv();
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    resetOrcaRouterCatalogCache();
    process.env.ORCAROUTER_API_KEY = "sk-orca-test";
    delete process.env.ORCA_API_BASE_URL;
    delete process.env.ORCA_BASE_URL;
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    restoreEnv(envSnapshot);
    resetOrcaRouterCatalogCache();
    vi.restoreAllMocks();
  });

  describe("parsing", () => {
    it("keeps vendor namespaces and drops malformed records", () => {
      const models = parseOrcaRouterCatalog(CATALOG_FIXTURE);
      const ids = models.map((model) => model.id);

      expect(ids).toContain("deepseek/deepseek-v4.1-flash");
      expect(ids).toContain("openai/gpt-5.5");
      expect(ids).not.toContain("bad id with spaces");
      expect(ids).toHaveLength(10);
    });

    it("preserves declared metadata without inventing any", () => {
      const models = parseOrcaRouterCatalog(CATALOG_FIXTURE);
      const gpt = models.find((model) => model.id === "openai/gpt-5.5");
      const legacy = models.find((model) => model.id === "vendor/legacy-chat-no-metadata");

      expect(gpt?.reasoningEfforts).toEqual(["low", "medium", "high", "xhigh"]);
      expect(gpt?.inputModalities).toEqual(["text", "image"]);
      expect(legacy?.inputModalities).toEqual([]);
      expect(legacy?.contextLength).toBeUndefined();
      expect(legacy?.source).toBe("live");
    });
  });

  describe("capability filtering", () => {
    const models = parseOrcaRouterCatalog(CATALOG_FIXTURE);

    it("lists text chat models and excludes non-text endpoint families", () => {
      const ids = filterOrcaRouterModels(models, { capability: "chat" }).map((m) => m.id);

      expect(ids).toContain("orcarouter/fusion");
      expect(ids).toContain("deepseek/deepseek-v4-pro");
      expect(ids).not.toContain("vendor/embed-1");
      expect(ids).not.toContain("vendor/image-gen-1");
      expect(ids).not.toContain("vendor/video-1");
      expect(ids).not.toContain("vendor/rerank-1");
    });

    it("lists embedding models only for the embedding capability", () => {
      const ids = filterOrcaRouterModels(models, { capability: "embedding" }).map((m) => m.id);
      expect(ids).toEqual(["vendor/embed-1"]);
    });

    it("lists image-generation models only for the image capability", () => {
      const ids = filterOrcaRouterModels(models, { capability: "image" }).map((m) => m.id);
      expect(ids).toEqual(["vendor/image-gen-1"]);
    });

    it("fails closed for multimodal: only models declaring image input survive", () => {
      const ids = filterOrcaRouterModels(models, {
        capability: "chat",
        inputModalities: ["text", "image"],
      }).map((m) => m.id);

      expect(ids).toEqual(["deepseek/deepseek-v4.1-flash", "openai/gpt-5.5"]);
      expect(ids).not.toContain("deepseek/deepseek-v4-pro");
      expect(ids).not.toContain("vendor/legacy-chat-no-metadata");
      expect(ids).not.toContain("vendor/name-looks-like-vision");
    });
  });

  describe("fetching", () => {
    it("requests the live catalog with capability and API key", async () => {
      fetchSpy.mockResolvedValueOnce(jsonResponse(CATALOG_FIXTURE));

      const catalog = await fetchOrcaRouterCatalog({ capability: "chat" });

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
      expect(url).toBe("https://api.orcarouter.ai/v1/models?capability=chat");
      expect((init.headers as Record<string, string>).Authorization).toBe(
        "Bearer sk-orca-test",
      );

      expect(catalog.source).toBe("live");
      expect(catalog.degraded).toBe(false);
      expect(catalog.models.map((m) => m.id)).toContain("deepseek/deepseek-v4-pro");
      expect(catalog.models.every((m) => m.source === "live")).toBe(true);
    });

    it("applies multimodal filtering to the live result", async () => {
      fetchSpy.mockResolvedValueOnce(jsonResponse(CATALOG_FIXTURE));

      const catalog = await fetchOrcaRouterCatalog({
        capability: "chat",
        inputModalities: ["image"],
      });

      expect(catalog.models.map((m) => m.id)).toEqual([
        "deepseek/deepseek-v4.1-flash",
        "openai/gpt-5.5",
      ]);
    });

    it("never merges the seed into a successful live result", async () => {
      fetchSpy.mockResolvedValueOnce(
        jsonResponse({ data: [{ id: "vendor/only-model", supported_endpoint_types: ["openai"] }] }),
      );

      const catalog = await fetchOrcaRouterCatalog();

      expect(catalog.models.map((m) => m.id)).toEqual(["vendor/only-model"]);
      expect(catalog.models.some((m) => m.id === "orcarouter/fusion")).toBe(false);
    });

    it("falls back to the verified seed on network failure", async () => {
      fetchSpy.mockRejectedValueOnce(new Error("ECONNREFUSED"));

      const catalog = await fetchOrcaRouterCatalog();

      expect(catalog.degraded).toBe(true);
      expect(catalog.source).toBe("seed");
      expect(catalog.error).toBe("network");
      expect(catalog.models.map((m) => m.id)).toEqual(
        ORCAROUTER_SEED_MODELS.map((m) => m.id),
      );
    });

    it("flags auth errors distinctly", async () => {
      fetchSpy.mockResolvedValueOnce(jsonResponse({ error: "unauthorized" }, 401));

      const catalog = await fetchOrcaRouterCatalog();

      expect(catalog.degraded).toBe(true);
      expect(catalog.error).toBe("auth");
    });

    it("flags missing API keys without issuing a request", async () => {
      delete process.env.ORCAROUTER_API_KEY;

      const catalog = await fetchOrcaRouterCatalog();

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(catalog.error).toBe("missing_api_key");
      expect(catalog.degraded).toBe(true);
      expect(catalog.models.length).toBeGreaterThan(0);
    });

    it("prefers the last-known-good catalog over the seed", async () => {
      fetchSpy
        .mockResolvedValueOnce(jsonResponse(CATALOG_FIXTURE))
        .mockRejectedValueOnce(new Error("offline"));

      const live = await fetchOrcaRouterCatalog();
      expect(live.source).toBe("live");

      const degraded = await fetchOrcaRouterCatalog();
      expect(degraded.source).toBe("last-known-good");
      expect(degraded.degraded).toBe(true);
      expect(degraded.models.map((m) => m.id)).toEqual(
        live.models.map((m) => m.id),
      );
    });

    it("raises a typed error when seed fallback is disabled", async () => {
      fetchSpy.mockResolvedValueOnce(jsonResponse({ error: "unauthorized" }, 401));

      await expect(
        fetchOrcaRouterCatalog({ allowSeedFallback: false }),
      ).rejects.toBeInstanceOf(OrcaRouterCatalogError);
    });

    it("never echoes the API key in the degraded error text", async () => {
      fetchSpy.mockRejectedValueOnce(new Error("boom"));
      const catalog = await fetchOrcaRouterCatalog();
      expect(JSON.stringify(catalog)).not.toContain("sk-orca-test");
    });
  });
});
