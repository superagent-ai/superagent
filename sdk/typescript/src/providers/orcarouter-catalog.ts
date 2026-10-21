/**
 * OrcaRouter model catalog and capability filtering.
 *
 * The authoritative source is `GET {base}/models` on the configured
 * OrcaRouter origin (default `https://api.orcarouter.ai/v1`), fetched with the
 * user's own API key so the result reflects the models their workspace can
 * actually call. Model IDs are kept verbatim, including their `vendor/model`
 * namespace.
 *
 * Capabilities are derived strictly from catalog metadata:
 * - text chat requires at least one text endpoint type
 *   (`openai`, `openai-response`, `anthropic`, `gemini`) and excludes
 *   endpoint types that only serve non-text models;
 * - multimodal listing additionally requires `architecture.input_modalities`
 *   to explicitly declare the modality the caller sends. Undeclared models
 *   fail closed.
 *
 * Nothing is inferred from a model's name.
 */

import { getOrcaRouterBaseUrl } from "./orcarouter.js";

export type OrcaRouterCapability = "chat" | "embedding" | "image";

export type OrcaRouterCatalogSource = "live" | "seed" | "last-known-good";

export interface OrcaRouterModel {
  /** Catalog model ID, verbatim (e.g. `deepseek/deepseek-v4-pro`). */
  id: string;
  /** Endpoint families the model is served through, when declared. */
  supportedEndpointTypes: string[];
  /** Input modalities declared by the catalog. Empty when undeclared. */
  inputModalities: string[];
  /** Maximum context length, when declared. */
  contextLength?: number;
  /** Reasoning effort levels, only when the catalog declares them. */
  reasoningEfforts?: string[];
  /** Where this record came from. */
  source: OrcaRouterCatalogSource;
}

export interface OrcaRouterCatalog {
  /** Models matching the requested capability filters. */
  models: OrcaRouterModel[];
  capability: OrcaRouterCapability;
  source: OrcaRouterCatalogSource;
  /** True when the live catalog could not be used. */
  degraded: boolean;
  fetchedAt?: string;
  /** Machine-readable reason when `degraded` is true. Never contains credentials. */
  error?: string;
}

export type OrcaRouterCatalogErrorCode =
  | "missing_api_key"
  | "auth"
  | "http"
  | "network"
  | "invalid_response";

export class OrcaRouterCatalogError extends Error {
  readonly code: OrcaRouterCatalogErrorCode;

  constructor(code: OrcaRouterCatalogErrorCode, message: string) {
    super(message);
    this.name = "OrcaRouterCatalogError";
    this.code = code;
  }
}

/** Endpoint families that can serve text chat. */
export const TEXT_ENDPOINT_TYPES = [
  "openai",
  "openai-response",
  "anthropic",
  "gemini",
] as const;

/** Endpoint families reserved for non-text models. */
export const NON_TEXT_ENDPOINT_TYPES = [
  "image-generation",
  "openai-video",
  "jina-rerank",
  "embeddings",
] as const;

const TEXT_ENDPOINT_SET = new Set<string>(TEXT_ENDPOINT_TYPES);
const NON_TEXT_ENDPOINT_SET = new Set<string>(NON_TEXT_ENDPOINT_TYPES);
const MAX_MODELS = 2000;
const MAX_ID_LENGTH = 256;
const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Small, verified cold-start seed used only while the live catalog is
 * unavailable. IDs were verified against `GET /v1/models` on 2026-10-21;
 * this seed is never merged into a successful live result.
 */
export const ORCAROUTER_SEED_MODELS: ReadonlyArray<Omit<OrcaRouterModel, "source">> = [
  {
    id: "orcarouter/fusion",
    supportedEndpointTypes: [...TEXT_ENDPOINT_TYPES],
    inputModalities: [],
    contextLength: 1_000_000,
  },
  {
    id: "orcarouter/auto",
    supportedEndpointTypes: [...TEXT_ENDPOINT_TYPES],
    inputModalities: [],
  },
  {
    id: "deepseek/deepseek-v4-pro",
    supportedEndpointTypes: ["openai", "openai-response"],
    inputModalities: ["text"],
    contextLength: 1_048_576,
  },
  {
    id: "deepseek/deepseek-v4.1-flash",
    supportedEndpointTypes: ["openai", "openai-response", "anthropic"],
    inputModalities: ["text", "image"],
    contextLength: 1_048_576,
  },
];

export interface OrcaRouterModelFilter {
  capability?: OrcaRouterCapability;
  /**
   * Modalities the entry point actually sends (e.g. `["text", "image"]`).
   * When set, every model must explicitly declare each modality; models with
   * missing `input_modalities` are excluded.
   */
  inputModalities?: string[];
}

interface RawModelRecord {
  id?: unknown;
  context_length?: unknown;
  supported_endpoint_types?: unknown;
  architecture?: { input_modalities?: unknown } | null;
  reasoning?: { efforts?: unknown } | null;
  reasoning_efforts?: unknown;
}

function asStringArray(value: unknown, limit = 32): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const entry of value) {
    if (typeof entry !== "string") continue;
    const trimmed = entry.trim();
    if (!trimmed || trimmed.length > 64) continue;
    out.push(trimmed);
    if (out.length >= limit) break;
  }
  return out;
}

function isValidModelId(id: string): boolean {
  return (
    id.length > 0 &&
    id.length <= MAX_ID_LENGTH &&
    /^[A-Za-z0-9][A-Za-z0-9._:/+-]*$/.test(id) &&
    !id.includes("..")
  );
}

/**
 * Parse a `GET /models` payload into normalized model records.
 * Malformed records are dropped instead of guessed at.
 */
export function parseOrcaRouterCatalog(
  payload: unknown,
  source: OrcaRouterCatalogSource = "live"
): OrcaRouterModel[] {
  const data = payload as { data?: unknown; models?: unknown } | unknown[] | null;
  const list = Array.isArray(data)
    ? data
    : Array.isArray((data as { data?: unknown })?.data)
      ? ((data as { data: unknown }).data as unknown[])
      : Array.isArray((data as { models?: unknown })?.models)
        ? ((data as { models: unknown }).models as unknown[])
        : [];

  const models: OrcaRouterModel[] = [];
  const seen = new Set<string>();

  for (const entry of list.slice(0, MAX_MODELS)) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as RawModelRecord;
    if (typeof record.id !== "string") continue;
    const id = record.id.trim();
    if (!isValidModelId(id) || seen.has(id)) continue;
    seen.add(id);

    const contextLength =
      typeof record.context_length === "number" &&
      Number.isFinite(record.context_length) &&
      record.context_length > 0
        ? Math.floor(record.context_length)
        : undefined;

    const efforts =
      asStringArray(record.reasoning?.efforts).length > 0
        ? asStringArray(record.reasoning?.efforts)
        : asStringArray(record.reasoning_efforts);

    models.push({
      id,
      supportedEndpointTypes: asStringArray(record.supported_endpoint_types),
      inputModalities: asStringArray(record.architecture?.input_modalities),
      ...(contextLength !== undefined ? { contextLength } : {}),
      ...(efforts.length > 0 ? { reasoningEfforts: efforts } : {}),
      source,
    });
  }

  return models;
}

function matchesCapability(
  model: OrcaRouterModel,
  capability: OrcaRouterCapability
): boolean {
  const endpoints = model.supportedEndpointTypes.map((entry) => entry.toLowerCase());

  if (capability === "chat") {
    const hasTextEndpoint = endpoints.some((entry) => TEXT_ENDPOINT_SET.has(entry));
    if (!hasTextEndpoint) return false;
    // A record that only advertises non-text endpoint families is not a chat model.
    return !endpoints.every((entry) => NON_TEXT_ENDPOINT_SET.has(entry));
  }

  if (capability === "embedding") {
    return endpoints.includes("embeddings");
  }

  return endpoints.includes("image-generation");
}

function matchesModalities(
  model: OrcaRouterModel,
  required: string[] | undefined
): boolean {
  if (!required || required.length === 0) return true;
  const declared = new Set(model.inputModalities.map((entry) => entry.toLowerCase()));
  // Fail closed: a model that does not declare a modality cannot be offered for it.
  return required.every((entry) => declared.has(entry.toLowerCase()));
}

/**
 * Filter catalog records down to the models an entry point can actually use.
 */
export function filterOrcaRouterModels(
  models: ReadonlyArray<OrcaRouterModel>,
  filter: OrcaRouterModelFilter = {}
): OrcaRouterModel[] {
  const capability = filter.capability ?? "chat";
  return models.filter(
    (model) =>
      matchesCapability(model, capability) &&
      matchesModalities(model, filter.inputModalities)
  );
}

export interface FetchOrcaRouterCatalogOptions extends OrcaRouterModelFilter {
  /** Defaults to `ORCAROUTER_API_KEY`. */
  apiKey?: string;
  /** Defaults to `ORCA_API_BASE_URL`, then `ORCA_BASE_URL`, then the public origin. */
  baseUrl?: string;
  timeoutMs?: number;
  /** Injectable fetch implementation for tests. */
  fetchImpl?: typeof fetch;
  /** Return a degraded seed/last-known-good catalog instead of throwing. Default: true. */
  allowSeedFallback?: boolean;
  /** Skip the in-memory last-known-good cache. Default: false. */
  bypassCache?: boolean;
  /** Injectable clock for deterministic timestamps in tests. */
  now?: () => Date;
}

interface CachedCatalog {
  baseUrl: string;
  capability: OrcaRouterCapability;
  models: OrcaRouterModel[];
  fetchedAt: string;
}

let cachedCatalog: CachedCatalog | null = null;

/** Clear the in-memory last-known-good catalog (used by tests). */
export function resetOrcaRouterCatalogCache(): void {
  cachedCatalog = null;
}

function seedCatalog(
  capability: OrcaRouterCapability,
  filter: OrcaRouterModelFilter,
  error: string
): OrcaRouterCatalog {
  const models = filterOrcaRouterModels(
    ORCAROUTER_SEED_MODELS.map((model) => ({ ...model, source: "seed" as const })),
    { ...filter, capability }
  );
  return {
    models,
    capability,
    source: "seed",
    degraded: true,
    error,
  };
}

function lastKnownGoodCatalog(
  baseUrl: string,
  capability: OrcaRouterCapability,
  filter: OrcaRouterModelFilter,
  error: string
): OrcaRouterCatalog | null {
  if (!cachedCatalog) return null;
  if (cachedCatalog.baseUrl !== baseUrl || cachedCatalog.capability !== capability) {
    return null;
  }
  return {
    models: filterOrcaRouterModels(cachedCatalog.models, { ...filter, capability }),
    capability,
    source: "last-known-good",
    degraded: true,
    fetchedAt: cachedCatalog.fetchedAt,
    error,
  };
}

function isAuthStatus(status: number): boolean {
  return status === 401 || status === 403;
}

/**
 * Fetch the model catalog for a capability. On failure this returns a
 * `degraded` catalog from the last successful fetch, else the verified seed.
 * Set `allowSeedFallback: false` to surface an `OrcaRouterCatalogError`.
 */
export async function fetchOrcaRouterCatalog(
  options: FetchOrcaRouterCatalogOptions = {}
): Promise<OrcaRouterCatalog> {
  const capability = options.capability ?? "chat";
  const apiKey = options.apiKey ?? process.env.ORCAROUTER_API_KEY ?? "";
  const baseUrl = (options.baseUrl ?? getOrcaRouterBaseUrl()).replace(/\/+$/, "");
  const allowSeedFallback = options.allowSeedFallback ?? true;
  const now = options.now ?? (() => new Date());

  const fallback = (errorCode: OrcaRouterCatalogErrorCode): OrcaRouterCatalog => {
    if (!allowSeedFallback) {
      throw new OrcaRouterCatalogError(
        errorCode,
        `OrcaRouter model catalog unavailable (${errorCode})`
      );
    }
    if (!options.bypassCache) {
      const cached = lastKnownGoodCatalog(baseUrl, capability, options, errorCode);
      if (cached) return cached;
    }
    return seedCatalog(capability, options, errorCode);
  };

  if (!apiKey) {
    return fallback("missing_api_key");
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  let response: Response;
  try {
    const url = new URL(`${baseUrl}/models`);
    if (capability) url.searchParams.set("capability", capability);
    response = await fetchImpl(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      signal: controller.signal,
    });
  } catch {
    return fallback("network");
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    return fallback(isAuthStatus(response.status) ? "auth" : "http");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return fallback("invalid_response");
  }

  const parsed = parseOrcaRouterCatalog(payload, "live");
  const models = filterOrcaRouterModels(parsed, {
    capability,
    inputModalities: options.inputModalities,
  });

  const fetchedAt = now().toISOString();
  if (!options.bypassCache) {
    // Cache the full unfiltered list so a later multimodal query can reuse it.
    cachedCatalog = {
      baseUrl,
      capability,
      models: filterOrcaRouterModels(parsed, { capability }),
      fetchedAt,
    };
  }

  return {
    models,
    capability,
    source: "live",
    degraded: false,
    fetchedAt,
  };
}

/**
 * Convenience helper returning just the model records for a capability.
 */
export async function listOrcaRouterModels(
  options: FetchOrcaRouterCatalogOptions = {}
): Promise<OrcaRouterModel[]> {
  const catalog = await fetchOrcaRouterCatalog(options);
  return catalog.models;
}

/**
 * Metadata-driven multimodal gate for an `orcarouter/...` model string.
 *
 * Returns false when the model is not in the chat catalog for the requested
 * modalities — including when the catalog is degraded and the model is only
 * present in a stale/seed list. Non-OrcaRouter model strings always return
 * false; their providers keep their own gating.
 */
export async function isOrcaRouterModelCompatible(
  modelString: string,
  inputModalities: string[],
  options: Omit<FetchOrcaRouterCatalogOptions, "inputModalities" | "capability"> = {}
): Promise<boolean> {
  const prefix = "orcarouter/";
  if (!modelString.startsWith(prefix)) return false;
  const modelId = modelString.slice(prefix.length);
  if (!modelId || !isValidModelId(modelId)) return false;

  const catalog = await fetchOrcaRouterCatalog({
    ...options,
    capability: "chat",
    inputModalities,
  });
  return catalog.models.some((model) => model.id === modelId);
}
