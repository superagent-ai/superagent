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


