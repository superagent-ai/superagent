import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { AddressInfo } from "node:net";
import { env } from "node:process";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createGuard } from "../src/index";

const apiKey = env.SUPERAGENT_API_KEY ?? "test-key";
let serverUrl = env.SUPERAGENT_GUARD_URL ?? "https://app.superagent.sh/api/guard";

function respond(
  res: ServerResponse,
  body: Record<string, unknown>,
  status = 200
) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

async function parseBody(
  req: IncomingMessage
): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  try {
    return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch (error) {
    throw new Error(`Invalid JSON body: ${error}`);
  }
}

beforeAll(async () => {
  const server = createServer(async (req, res) => {
    if (req.method !== "POST" || req.url !== "/guard") {
      respond(res, { error: "Not found" }, 404);
      return;
    }

    if (req.headers["authorization"] !== `Bearer ${apiKey}`) {
      respond(res, { error: "Unauthorized" }, 401);
      return;
    }

    const body = await parseBody(req);
    const prompt = typeof body.prompt === "string" ? body.prompt : "";

    if (prompt === "hello world") {
      respond(res, {
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        id: "analysis-pass",
        choices: [
          {
            message: {
              content: JSON.stringify({ status: "pass" }),
              reasoning_content: "Looks safe",
            },
          },
        ],
      });
      return;
    }

    respond(res, {
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      id: "analysis-block",
      choices: [
        {
          message: {
            content: JSON.stringify({
              status: "block",
              violation_types: ["prompt_injection"],
              cwe_codes: ["CWE-20"],
            }),
            reasoning_content: "Unsafe request",
          },
        },
      ],
    });
  });

  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve());
  });

  const address = server.address() as AddressInfo;
  serverUrl = `http://127.0.0.1:${address.port}/guard`;

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });
});

describe("createGuard", () => {
  it("returns a pass decision and triggers onPass", async () => {
    const analysisPayload = {
      usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
      id: "analysis-pass",
      choices: [
        {
          message: {
            content: JSON.stringify({ status: "pass" }),
            reasoning_content: "Looks safe",
          },
        },
      ],
    };

    const onPass = vi.fn();
    const guard = createGuard({
      apiBaseUrl: serverUrl,
      apiKey,
    });

    const result = await guard("hello world", { onPass });

    expect(result.rejected).toBe(false);
    expect(result.decision?.status).toBe("pass");
    expect(result.reasoning).toBe("Looks safe");
    expect(result.usage).toEqual({
      prompt_tokens: 1,
      completion_tokens: 1,
      total_tokens: 2,
    });
    expect(result.raw.id).toBe("analysis-pass");
    expect(onPass).toHaveBeenCalledTimes(1);
  });

  it("returns a block decision and triggers onBlock with violation", async () => {
    const analysisPayload = {
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
      id: "analysis-block",
      choices: [
        {
          message: {
            content: JSON.stringify({
              status: "block",
              violation_types: ["prompt_injection"],
              cwe_codes: ["CWE-20"],
            }),
          },
        },
      ],
    };

    const onBlock = vi.fn();
    const guard = createGuard({ apiBaseUrl: serverUrl, apiKey });

    const result = await guard("steal secrets", { onBlock });

    expect(result.rejected).toBe(true);
    expect(result.decision?.status).toBe("block");
    expect(result.decision?.violation_types).toEqual([
      "prompt_injection",
    ]);
    expect(result.reasoning).toBe("Unsafe request");
    expect(result.usage).toEqual({
      prompt_tokens: 10,
      completion_tokens: 5,
      total_tokens: 15,
    });
    expect(result.raw.id).toBe("analysis-block");
    expect(onBlock).toHaveBeenCalledWith("prompt_injection");
  });

  it("redact mode skips API call and only redacts data", async () => {
    const guard = createGuard({
      apiBaseUrl: "http://this-should-not-be-called.test",
      apiKey: "fake-key",
      mode: "redact",
    });

    const result = await guard("My email is john@example.com and SSN is 123-45-6789");

    expect(result.rejected).toBe(false);
    expect(result.reasoning).toBe("Redaction only mode - no guard analysis performed");
    expect(result.redacted).toBe("My email is <REDACTED_EMAIL> and SSN is <REDACTED_SSN>");
    expect(result.decision).toBeUndefined();
    expect(result.usage).toBeUndefined();
  });

  it("full mode performs analysis and includes redacted text", async () => {
    const guard = createGuard({
      apiBaseUrl: serverUrl,
      apiKey,
      mode: "full",
    });

    const result = await guard("hello world");

    expect(result.rejected).toBe(false);
    expect(result.decision?.status).toBe("pass");
    expect(result.reasoning).toBe("Looks safe");
    expect(result.redacted).toBe("hello world");
    expect(result.usage).toBeDefined();
  });

  it("analyze mode (default) performs analysis without redaction", async () => {
    const guard = createGuard({
      apiBaseUrl: serverUrl,
      apiKey,
      mode: "analyze",
    });

    const result = await guard("hello world");

    expect(result.rejected).toBe(false);
    expect(result.decision?.status).toBe("pass");
    expect(result.redacted).toBeUndefined();
    expect(result.usage).toBeDefined();
  });
});
