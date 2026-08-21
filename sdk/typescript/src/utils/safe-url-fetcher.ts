import { lookup } from "node:dns/promises";
import ipaddr from "ipaddr.js";
import { Agent, fetch as undiciFetch } from "undici";

const MAX_URL_LENGTH = 2048;
const MAX_REDIRECTS = 5;
const MAX_RESPONSE_BYTES = 25 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 30_000;

interface ResolvedAddress {
  address: string;
  family: 4 | 6;
}

interface ValidatedUrl {
  parsed: URL;
  addresses: ResolvedAddress[];
}

export interface PublicUrlResponse {
  finalUrl: string;
  contentType: string;
  data: Uint8Array;
}

function isPublicIpAddress(ip: string): boolean {
  try {
    const address = ipaddr.process(ip);
    if (address.kind() === "ipv6") {
      const ipv6 = address as ipaddr.IPv6;
      if (ipv6.isIPv4MappedAddress()) {
        return ipv6.toIPv4Address().range() === "unicast";
      }
    }
    return address.range() === "unicast";
  } catch {
    return false;
  }
}

async function resolvePublicAddresses(
  hostname: string
): Promise<ResolvedAddress[]> {
  const cleanHostname = hostname.replace(/^\[|\]$/g, "");
  let addresses: ResolvedAddress[];

  try {
    if (ipaddr.isValid(cleanHostname)) {
      const address = ipaddr.process(cleanHostname);
      addresses = [
        {
          address: address.toString(),
          family: address.kind() === "ipv4" ? 4 : 6,
        },
      ];
    } else {
      const results = await lookup(cleanHostname, {
        all: true,
        verbatim: true,
      });
      addresses = results.map(({ address, family }) => ({
        address,
        family: family as 4 | 6,
      }));
    }
  } catch {
    throw new Error("Invalid URL: hostname could not be resolved safely");
  }

  if (
    addresses.length === 0 ||
    addresses.some(({ address }) => !isPublicIpAddress(address))
  ) {
    throw new Error(
      "Invalid URL: private/internal IP addresses are not allowed"
    );
  }

  return addresses;
}

async function validateUrl(url: string): Promise<ValidatedUrl> {
  if (url.length > MAX_URL_LENGTH) {
    throw new Error(
      `Invalid URL: URL exceeds maximum length of ${MAX_URL_LENGTH} characters`
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch (error) {
    throw new Error(`Invalid URL: malformed URL format - ${String(error)}`);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    if (parsed.protocol === "file:") {
      throw new Error("Invalid URL: file:// protocol is not allowed");
    }
    throw new Error(
      `Invalid URL: protocol must be http or https, got ${parsed.protocol}`
    );
  }

  if (!parsed.hostname) {
    throw new Error("Invalid URL: hostname is required");
  }
  if (parsed.username || parsed.password) {
    throw new Error("Invalid URL: embedded credentials are not allowed");
  }

  const hostname = parsed.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname === "localhost.localdomain" ||
    hostname === "local" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname.startsWith("127.")
  ) {
    throw new Error("Invalid URL: localhost access is not allowed");
  }

  return {
    parsed,
    addresses: await resolvePublicAddresses(parsed.hostname),
  };
}

function createPinnedAgent(addresses: ResolvedAddress[]): Agent {
  let nextAddress = 0;
  return new Agent({
    connect: {
      lookup: (_hostname, options, callback) => {
        if (options.all) {
          callback(null, addresses);
          return;
        }

        const selected = addresses[nextAddress % addresses.length];
        nextAddress += 1;
        callback(null, selected.address, selected.family);
      },
      timeout: REQUEST_TIMEOUT_MS,
    },
    headersTimeout: REQUEST_TIMEOUT_MS,
    bodyTimeout: REQUEST_TIMEOUT_MS,
    maxResponseSize: MAX_RESPONSE_BYTES,
  });
}

async function readResponseBody(
  response: Awaited<ReturnType<typeof undiciFetch>>
): Promise<Uint8Array> {
  const declaredLength = Number(response.headers.get("content-length"));
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > MAX_RESPONSE_BYTES
  ) {
    throw new Error(
      `Failed to fetch URL: response exceeds ${MAX_RESPONSE_BYTES} bytes`
    );
  }

  if (!response.body) {
    return new Uint8Array();
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalLength += value.byteLength;
    if (totalLength > MAX_RESPONSE_BYTES) {
      await reader.cancel();
      throw new Error(
        `Failed to fetch URL: response exceeds ${MAX_RESPONSE_BYTES} bytes`
      );
    }
    chunks.push(value);
  }

  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return result;
}

export async function fetchPublicUrl(url: string): Promise<PublicUrlResponse> {
  let currentUrl = url;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    const validated = await validateUrl(currentUrl);
    const agent = createPinnedAgent(validated.addresses);

    try {
      const response = await undiciFetch(validated.parsed, {
        dispatcher: agent,
        redirect: "manual",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        await response.body?.cancel();
        if (!location) {
          throw new Error("Failed to fetch URL: redirect is missing Location");
        }
        if (redirectCount === MAX_REDIRECTS) {
          throw new Error(
            `Failed to fetch URL: exceeded ${MAX_REDIRECTS} redirects`
          );
        }
        currentUrl = new URL(location, validated.parsed).toString();
        continue;
      }

      if (!response.ok) {
        await response.body?.cancel();
        throw new Error(
          `Failed to fetch URL: ${response.status} ${response.statusText}`
        );
      }

      return {
        finalUrl: currentUrl,
        contentType:
          response.headers.get("content-type")?.split(";")[0].trim() || "",
        data: await readResponseBody(response),
      };
    } finally {
      await agent.close();
    }
  }

  throw new Error(`Failed to fetch URL: exceeded ${MAX_REDIRECTS} redirects`);
}
