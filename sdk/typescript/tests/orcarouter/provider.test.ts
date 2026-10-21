import { describe, it, expect, afterEach, vi } from "vitest";
import {
  ORCAROUTER_DEFAULT_API_BASE_URL,
  buildOrcaRouterUrl,
  getOrcaRouterBaseUrl,
  orcarouterProvider,
} from "../../src/providers/orcarouter.js";
import { providers, getProvider, parseModel } from "../../src/providers/index.js";

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

describe("OrcaRouter provider", () => {
  const envSnapshot = snapshotEnv();

  afterEach(() => {
    restoreEnv(envSnapshot);
    vi.restoreAllMocks();
  });

  it("is registered as a named provider", () => {
    expect(providers.orcarouter).toBe(orcarouterProvider);
    expect(getProvider("orcarouter")).toBe(orcarouterProvider);
    expect(orcarouterProvider.envVar).toBe("ORCAROUTER_API_KEY");
    expect(orcarouterProvider.baseUrl).toBe(ORCAROUTER_DEFAULT_API_BASE_URL);
  });

  it("parses nested vendor namespaces without losing them", () => {
    expect(parseModel("orcarouter/openai/gpt-5.5")).toEqual({
      provider: "orcarouter",
      model: "openai/gpt-5.5",
    });
    expect(parseModel("orcarouter/deepseek/deepseek-v4.1-flash")).toEqual({
      provider: "orcarouter",
      model: "deepseek/deepseek-v4.1-flash",
    });
  });

  it("targets the inference origin, never the auth origin", () => {
    delete process.env.ORCA_API_BASE_URL;
    delete process.env.ORCA_BASE_URL;

    const url = orcarouterProvider.buildUrl?.(orcarouterProvider.baseUrl, "openai/gpt-5.5");

    expect(url).toBe("https://api.orcarouter.ai/v1/chat/completions");
    expect(url).not.toContain("/auth");
    expect(url).not.toContain("www.orcarouter.ai");
  });

  it("honours ORCA_API_BASE_URL over ORCA_BASE_URL", () => {
    process.env.ORCA_BASE_URL = "https://shared.example.com/v1";
    process.env.ORCA_API_BASE_URL = "https://api.example.com/v1";

    expect(getOrcaRouterBaseUrl()).toBe("https://api.example.com/v1");
    expect(buildOrcaRouterUrl()).toBe("https://api.example.com/v1/chat/completions");
  });

  it("falls back to ORCA_BASE_URL for self-hosted deployments", () => {
    delete process.env.ORCA_API_BASE_URL;
    process.env.ORCA_BASE_URL = "https://shared.example.com/v1/";

    expect(buildOrcaRouterUrl()).toBe("https://shared.example.com/v1/chat/completions");
  });

  it("allows plain HTTP only on loopback", () => {
    process.env.ORCA_API_BASE_URL = "http://localhost:8080/v1";
    expect(getOrcaRouterBaseUrl()).toBe("http://localhost:8080/v1");

    process.env.ORCA_API_BASE_URL = "http://api.example.com/v1";
    expect(() => getOrcaRouterBaseUrl()).toThrow(/HTTPS is required/);
  });

  it("rejects a malformed base URL", () => {
    process.env.ORCA_API_BASE_URL = "not a url";
    expect(() => getOrcaRouterBaseUrl()).toThrow(/Invalid OrcaRouter base URL/);
  });

  it("sends the API key as a Bearer token", () => {
    expect(orcarouterProvider.authHeader("sk-orca-test")).toEqual({
      Authorization: "Bearer sk-orca-test",
      "Content-Type": "application/json",
    });
  });

  it("builds an OpenAI-compatible request body", () => {
    const body = orcarouterProvider.transformRequest(
      "openai/gpt-5.5",
      [{ role: "user", content: "hello" }],
      { type: "json_object" },
    );

    expect(body).toEqual({
      model: "openai/gpt-5.5",
      messages: [{ role: "user", content: "hello" }],
      temperature: 0,
      response_format: { type: "json_object" },
    });
  });

  it("normalizes the response and tolerates missing usage", () => {
    const parsed = orcarouterProvider.transformResponse({
      id: "chatcmpl-1",
      choices: [
        {
          index: 0,
          message: { role: "assistant", content: '{"classification":"pass"}' },
          finish_reason: "stop",
        },
      ],
      usage: { prompt_tokens: 12, completion_tokens: 4, total_tokens: 16 },
    });

    expect(parsed.id).toBe("chatcmpl-1");
    expect(parsed.usage).toEqual({
      promptTokens: 12,
      completionTokens: 4,
      totalTokens: 16,
    });
    expect(parsed.choices[0].message.content).toBe('{"classification":"pass"}');

    const withoutUsage = orcarouterProvider.transformResponse({
      id: "chatcmpl-2",
      choices: [],
    });
    expect(withoutUsage.usage.totalTokens).toBe(0);
    expect(withoutUsage.choices).toEqual([]);
  });
});
