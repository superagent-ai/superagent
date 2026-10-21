import { describe, it, expect } from "vitest";
import { createClient } from "../../src/client.js";
import {
  fetchOrcaRouterCatalog,
  isOrcaRouterModelCompatible,
  resetOrcaRouterCatalogCache,
} from "../../src/providers/orcarouter-catalog.js";

/**
 * Opt-in live checks against the OrcaRouter gateway.
 *
 * These run only when `ORCAROUTER_API_KEY` is present, so the default test
 * suite stays offline. Every call goes through the integration under test:
 * the named provider registry entry, the catalog client, and the SDK client.
 */
// Only a real-looking key opts in: placeholder credentials used by the unit
// tests must not turn the offline suite into a network call.
const PLACEHOLDER = /fake|dummy|test|placeholder|example|sample|local|xxx/i;
const apiKey = process.env.ORCAROUTER_API_KEY;
const describeLive =
  apiKey && apiKey.startsWith("sk-orca-") && apiKey.length >= 30 && !PLACEHOLDER.test(apiKey)
    ? describe
    : describe.skip;

const MODEL = "orcarouter/deepseek/deepseek-v4-pro";

describeLive("OrcaRouter live gateway", () => {
  it(
    "fetches the live catalog through the named provider",
    async () => {
      resetOrcaRouterCatalogCache();
      const catalog = await fetchOrcaRouterCatalog({
        capability: "chat",
        allowSeedFallback: false,
      });

      expect(catalog.source).toBe("live");
      expect(catalog.degraded).toBe(false);
      expect(catalog.models.length).toBeGreaterThan(0);
      expect(catalog.models.every((model) => typeof model.id === "string")).toBe(true);
    },
    30_000,
  );

  it(
    "gates image input on catalog-declared modalities",
    async () => {
      resetOrcaRouterCatalogCache();
      expect(await isOrcaRouterModelCompatible(MODEL, ["image"])).toBe(false);
    },
    30_000,
  );

  it(
    "runs guard through the OrcaRouter provider",
    async () => {
      const client = createClient({ apiKey: "live-check" });
      // The live check exercises the provider path, not Superagent's usage
      // reporting; keep the run from posting a billing record.
      (client as unknown as { postUsage: () => void }).postUsage = () => {};
      const result = await client.guard({
        input: "What is the capital of France?",
        model: MODEL,
      });

      expect(["pass", "block"]).toContain(result.classification);
      expect(result.usage.totalTokens).toBeGreaterThan(0);
    },
    60_000,
  );
});
