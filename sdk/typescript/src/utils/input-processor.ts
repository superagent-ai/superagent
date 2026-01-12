import { lookup } from "node:dns/promises";
import * as ipaddr from "ipaddr.js";
import { getDocumentProxy } from "unpdf";
import type { GuardInput, ProcessedInput } from "../types.js";

/**
 * Image MIME types supported by vision models
 */
const IMAGE_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
];

/**
 * PDF MIME types
 */
const PDF_MIME_TYPES = ["application/pdf"];

/**
 * Text MIME types that can be processed directly
 */
const TEXT_MIME_TYPES = [
  "text/plain",
  "text/html",
  "text/css",
  "text/javascript",
  "text/csv",
  "text/xml",
  "application/json",
  "application/xml",
];

/**
 * Check if a string looks like a URL
 */
function isUrlString(input: string): boolean {
  return input.startsWith("http://") || input.startsWith("https://");
}

/**
 * Check if an IP address is private/internal using ipaddr.js
 * Supports both IPv4 and IPv6 ranges
 */
function isPrivateIpAddress(ip: string): boolean {
  try {
    const addr = ipaddr.process(ip);
    
    if (addr.kind() === "ipv4") {
      const ipv4 = addr as ipaddr.IPv4;
      
      // Check IPv4 private ranges
      return (
        ipv4.range() === "private" || // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
        ipv4.range() === "loopback" || // 127.0.0.0/8
        ipv4.range() === "linkLocal" || // 169.254.0.0/16
        ipv4.range() === "multicast" // 224.0.0.0/4
      );
    } else if (addr.kind() === "ipv6") {
      const ipv6 = addr as ipaddr.IPv6;
      
      // Check for IPv4-mapped IPv6 addresses (::ffff:127.0.0.1)
      if (ipv6.isIPv4MappedAddress()) {
        const ipv4Mapped = ipv6.toIPv4Address();
        return isPrivateIpAddress(ipv4Mapped.toString());
      }
      
      // Check IPv6 private ranges
      const range = ipv6.range();
      return (
        range === "uniqueLocal" || // fc00::/7 (ULA)
        range === "linkLocal" || // fe80::/10
        range === "loopback" || // ::1
        range === "multicast" // ff00::/8
      );
    }
    
    return false;
  } catch {
    // If IP parsing fails, treat as private (fail-safe)
    return true;
  }
}

/**
 * Check if a hostname resolves to a private/internal IP address.
 * 
 * This function performs DNS resolution to prevent SSRF attacks where
 * a hostname like "attacker.com" resolves to 127.0.0.1.
 * 
 * Blocks:
 * - IPv4: 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16, 224.0.0.0/4
 * - IPv6: ::1, fc00::/7, fe80::/10, ::ffff:127.0.0.0/104, ff00::/8
 * - localhost hostnames
 * 
 * If DNS resolution fails, treats as private (fail-safe security).
 */
async function isPrivateIp(hostname: string): Promise<boolean> {
  const lowerHostname = hostname.toLowerCase();

  // Check for localhost hostname first (common case, no DNS needed)
  if (
    lowerHostname === "localhost" ||
    lowerHostname === "localhost.localdomain" ||
    lowerHostname === "local" ||
    lowerHostname === "127.0.0.1" ||
    lowerHostname === "::1"
  ) {
    return true;
  }

  // Remove brackets from IPv6 addresses if present
  const cleanHostname = hostname.replace(/^\[|\]$/g, "");

  // Check if it's already a direct IP address (IPv4 or IPv6)
  try {
    // Try parsing as IP first (faster path)
    if (ipaddr.isValid(cleanHostname)) {
      return isPrivateIpAddress(cleanHostname);
    }
  } catch {
    // Not a direct IP, continue to DNS resolution
  }

  // Perform DNS resolution to get actual IP address
  // This prevents SSRF where hostname resolves to private IP
  try {
    const result = await lookup(cleanHostname, { all: false });
    const resolvedIp = result.address;
    
    // Check the resolved IP address
    return isPrivateIpAddress(resolvedIp);
  } catch (error) {
    // DNS resolution failed - treat as private (fail-safe)
    // This prevents bypasses where DNS fails but might resolve to private IP
    return true;
  }
}

/**
 * Validate URL for security concerns.
 *
 * Throws Error with descriptive message if URL is invalid or unsafe.
 *
 * Checks:
 * - URL format is valid
 * - Protocol is http or https only
 * - Hostname is not empty
 * - No private/internal IP addresses (with DNS resolution)
 * - No localhost access
 * - No file:// protocol
 * - URL length is reasonable (max 2048 characters)
 */
async function validateUrl(url: string): Promise<void> {
  const MAX_URL_LENGTH = 2048;

  // Check URL length
  if (url.length > MAX_URL_LENGTH) {
    throw new Error(
      `Invalid URL: URL exceeds maximum length of ${MAX_URL_LENGTH} characters`
    );
  }

  // Parse URL
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch (e) {
    throw new Error(`Invalid URL: malformed URL format - ${String(e)}`);
  }

  // Check protocol
  const protocol = parsed.protocol.toLowerCase();
  if (protocol !== "http:" && protocol !== "https:") {
    if (protocol === "file:") {
      throw new Error("Invalid URL: file:// protocol is not allowed");
    }
    throw new Error(
      `Invalid URL: protocol must be http or https, got ${protocol}`
    );
  }

  // Check hostname
  const hostname = parsed.hostname;
  if (!hostname) {
    throw new Error("Invalid URL: hostname is required");
  }

  // Check for private/internal IP addresses (with DNS resolution)
  const isPrivate = await isPrivateIp(hostname);
  if (isPrivate) {
    const lowerHostname = hostname.toLowerCase();
    if (
      lowerHostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname.startsWith("127.")
    ) {
      throw new Error("Invalid URL: localhost access is not allowed");
    }
    throw new Error(
      "Invalid URL: private/internal IP addresses are not allowed"
    );
  }
}

/**
 * Check if MIME type is an image
 */
function isImageMimeType(mimeType: string): boolean {
  return IMAGE_MIME_TYPES.some((type) => mimeType.startsWith(type));
}

/**
 * Check if MIME type is text-based
 */
function isTextMimeType(mimeType: string): boolean {
  return (
    TEXT_MIME_TYPES.some((type) => mimeType.startsWith(type)) ||
    mimeType.startsWith("text/")
  );
}

/**
 * Check if MIME type is PDF
 */
function isPdfMimeType(mimeType: string): boolean {
  return PDF_MIME_TYPES.some((type) => mimeType.startsWith(type));
}

/**
 * Get MIME type from URL based on extension
 */
function getMimeTypeFromUrl(url: string): string | null {
  const pathname = new URL(url).pathname.toLowerCase();
  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg"))
    return "image/jpeg";
  if (pathname.endsWith(".gif")) return "image/gif";
  if (pathname.endsWith(".webp")) return "image/webp";
  if (pathname.endsWith(".pdf")) return "application/pdf";
  if (pathname.endsWith(".txt")) return "text/plain";
  if (pathname.endsWith(".html") || pathname.endsWith(".htm"))
    return "text/html";
  if (pathname.endsWith(".json")) return "application/json";
  if (pathname.endsWith(".xml")) return "application/xml";
  if (pathname.endsWith(".csv")) return "text/csv";
  return null;
}

/**
 * Convert ArrayBuffer to base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Extract text from each page of a PDF
 * Returns an array of strings, one per page
 */
async function extractPdfPages(buffer: ArrayBuffer): Promise<string[]> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => {
        // TextItem has 'str' property, TextMarkedContent does not
        if ("str" in item) {
          return item.str;
        }
        return "";
      })
      .join(" ");
    pages.push(pageText);
  }

  return pages;
}

/**
 * Fetch content from a URL and return as ProcessedInput
 */
async function fetchUrl(url: string): Promise<ProcessedInput> {
  // Validate URL for security before making any network requests
  await validateUrl(url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch URL: ${response.status} ${response.statusText}`
    );
  }

  // Get content type from response or infer from URL
  let contentType =
    response.headers.get("content-type")?.split(";")[0].trim() || "";

  // If no content type, try to infer from URL
  if (!contentType) {
    contentType = getMimeTypeFromUrl(url) || "text/plain";
  }

  if (isPdfMimeType(contentType)) {
    const buffer = await response.arrayBuffer();
    const pages = await extractPdfPages(buffer);
    return {
      type: "pdf",
      pages,
      mimeType: contentType,
    };
  }

  if (isImageMimeType(contentType)) {
    const buffer = await response.arrayBuffer();
    const base64 = arrayBufferToBase64(buffer);
    return {
      type: "image",
      imageBase64: base64,
      mimeType: contentType,
    };
  }

  if (isTextMimeType(contentType)) {
    const text = await response.text();
    return {
      type: "text",
      text,
      mimeType: contentType,
    };
  }

  // For other content types, try to read as text
  // This handles cases where server doesn't send correct content-type
  try {
    const text = await response.text();
    return {
      type: "text",
      text,
      mimeType: contentType,
    };
  } catch {
    throw new Error(`Unsupported content type: ${contentType}`);
  }
}

/**
 * Process a Blob and return as ProcessedInput
 */
async function processBlob(blob: Blob): Promise<ProcessedInput> {
  const mimeType = blob.type || "application/octet-stream";

  if (isPdfMimeType(mimeType)) {
    const buffer = await blob.arrayBuffer();
    const pages = await extractPdfPages(buffer);
    return {
      type: "pdf",
      pages,
      mimeType,
    };
  }

  if (isImageMimeType(mimeType)) {
    const buffer = await blob.arrayBuffer();
    const base64 = arrayBufferToBase64(buffer);
    return {
      type: "image",
      imageBase64: base64,
      mimeType,
    };
  }

  if (isTextMimeType(mimeType)) {
    const text = await blob.text();
    return {
      type: "text",
      text,
      mimeType,
    };
  }

  // Try to read as text for unknown types
  try {
    const text = await blob.text();
    return {
      type: "text",
      text,
      mimeType,
    };
  } catch {
    throw new Error(`Unsupported blob type: ${mimeType}`);
  }
}

/**
 * Process guard input and return normalized ProcessedInput
 *
 * Auto-detection:
 * - string starting with http:// or https:// → fetch URL
 * - string not starting with http(s):// → plain text
 * - Blob/File → process based on MIME type
 * - URL object → fetch URL
 */
export async function processInput(input: GuardInput): Promise<ProcessedInput> {
  // Handle URL object
  if (input instanceof URL) {
    return fetchUrl(input.toString());
  }

  // Handle Blob (includes File)
  if (typeof Blob !== "undefined" && input instanceof Blob) {
    return processBlob(input);
  }

  // Handle string
  if (typeof input === "string") {
    // Check if it's a URL
    if (isUrlString(input)) {
      return fetchUrl(input);
    }

    // Plain text
    return {
      type: "text",
      text: input,
      mimeType: "text/plain",
    };
  }

  throw new Error("Invalid input type");
}

/**
 * Check if a model supports vision (multimodal) input
 */
export function isVisionModel(model: string): boolean {
  // OpenAI vision models (gpt-4o, gpt-4o-mini, gpt-4-turbo, gpt-4.1 all support vision)
  if (
    model.includes("gpt-4o") ||
    model.includes("gpt-4-turbo") ||
    model.includes("gpt-4.1") ||
    model.includes("gpt-5")
  ) {
    return true;
  }
  // Anthropic Claude 3+ models support vision
  if (
    model.includes("claude-3") ||
    model.includes("claude-sonnet-4") ||
    model.includes("claude-opus-4") ||
    model.includes("claude-haiku-4")
  ) {
    return true;
  }
  // Google Gemini models support vision
  if (model.includes("gemini")) {
    return true;
  }
  // Vercel models with vision
  if (model.includes("grok-2-vision") || model.includes("pixtral")) {
    return true;
  }
  // OpenRouter vision models
  if (
    model.includes("vision") ||
    model.includes("-vl-") ||
    model.includes("pixtral")
  ) {
    return true;
  }
  return false;
}


