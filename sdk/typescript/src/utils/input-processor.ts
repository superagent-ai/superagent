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
 * Check if an IP address is private/internal
 */
function isPrivateIp(hostname: string): boolean {
  /**
   * Check if a hostname resolves to a private/internal IP address.
   *
   * Blocks:
   * - localhost and 127.0.0.0/8 (loopback)
   * - 10.0.0.0/8 (private)
   * - 172.16.0.0/12 (private)
   * - 192.168.0.0/16 (private)
   * - localhost hostname
   */
  const lowerHostname = hostname.toLowerCase();

  // Check for localhost hostname
  if (lowerHostname === "localhost" || lowerHostname === "localhost.localdomain" || lowerHostname === "local") {
    return true;
  }

  // Check if it's a direct IP address
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = hostname.match(ipv4Regex);
  
  if (match) {
    const octets = match.slice(1, 5).map(Number);
    
    // Validate octets are in valid range
    if (octets.some((octet) => octet > 255)) {
      return false;
    }

    // Check for loopback (127.0.0.0/8)
    if (octets[0] === 127) {
      return true;
    }

    // Check for private IP ranges
    // 10.0.0.0/8
    if (octets[0] === 10) {
      return true;
    }

    // 172.16.0.0/12
    if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) {
      return true;
    }

    // 192.168.0.0/16
    if (octets[0] === 192 && octets[1] === 168) {
      return true;
    }

    // Check for link-local (169.254.0.0/16)
    if (octets[0] === 169 && octets[1] === 254) {
      return true;
    }

    // Check for multicast (224.0.0.0/4)
    if (octets[0] >= 224 && octets[0] <= 239) {
      return true;
    }
  }

  // Check for IPv6 loopback
  if (hostname === "::1" || hostname.toLowerCase() === "localhost") {
    return true;
  }

  return false;
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
 * - No private/internal IP addresses
 * - No localhost access
 * - No file:// protocol
 * - URL length is reasonable (max 2048 characters)
 */
function validateUrl(url: string): void {
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

  // Check for private/internal IP addresses
  if (isPrivateIp(hostname)) {
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
  validateUrl(url);

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


