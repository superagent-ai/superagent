"""
Input processor for handling various input types (text, URLs, images, PDFs)
"""

import base64
from urllib.parse import urlparse

import httpx

from ..types import GuardInput, ProcessedInput

# Image MIME types supported by vision models
IMAGE_MIME_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
]

# PDF MIME types
PDF_MIME_TYPES = ["application/pdf"]

# Text MIME types that can be processed directly
TEXT_MIME_TYPES = [
    "text/plain",
    "text/html",
    "text/css",
    "text/javascript",
    "text/csv",
    "text/xml",
    "application/json",
    "application/xml",
]


def _is_url_string(input_str: str) -> bool:
    """Check if a string looks like a URL."""
    return input_str.startswith("http://") or input_str.startswith("https://")


def _is_image_mime_type(mime_type: str) -> bool:
    """Check if MIME type is an image."""
    return any(mime_type.startswith(t) for t in IMAGE_MIME_TYPES)


def _is_text_mime_type(mime_type: str) -> bool:
    """Check if MIME type is text-based."""
    return (
        any(mime_type.startswith(t) for t in TEXT_MIME_TYPES)
        or mime_type.startswith("text/")
    )


def _is_pdf_mime_type(mime_type: str) -> bool:
    """Check if MIME type is PDF."""
    return any(mime_type.startswith(t) for t in PDF_MIME_TYPES)


def _get_mime_type_from_url(url: str) -> str | None:
    """Get MIME type from URL based on extension."""
    parsed = urlparse(url)
    pathname = parsed.path.lower()

    if pathname.endswith(".png"):
        return "image/png"
    if pathname.endswith(".jpg") or pathname.endswith(".jpeg"):
        return "image/jpeg"
    if pathname.endswith(".gif"):
        return "image/gif"
    if pathname.endswith(".webp"):
        return "image/webp"
    if pathname.endswith(".pdf"):
        return "application/pdf"
    if pathname.endswith(".txt"):
        return "text/plain"
    if pathname.endswith(".html") or pathname.endswith(".htm"):
        return "text/html"
    if pathname.endswith(".json"):
        return "application/json"
    if pathname.endswith(".xml"):
        return "application/xml"
    if pathname.endswith(".csv"):
        return "text/csv"

    return None


def _bytes_to_base64(data: bytes) -> str:
    """Convert bytes to base64 string."""
    return base64.b64encode(data).decode("utf-8")


async def _extract_pdf_pages(data: bytes) -> list[str]:
    """Extract text from each page of a PDF."""
    from pypdf import PdfReader
    from io import BytesIO

    reader = PdfReader(BytesIO(data))
    pages = []

    for page in reader.pages:
        text = page.extract_text() or ""
        pages.append(text)

    return pages


async def _fetch_url(url: str) -> ProcessedInput:
    """Fetch content from a URL and return as ProcessedInput."""
    async with httpx.AsyncClient() as client:
        response = await client.get(url, follow_redirects=True, timeout=30.0)

        if response.status_code != 200:
            raise RuntimeError(
                f"Failed to fetch URL: {response.status_code} {response.reason_phrase}"
            )

        # Get content type from response or infer from URL
        content_type = response.headers.get("content-type", "").split(";")[0].strip()

        if not content_type:
            content_type = _get_mime_type_from_url(url) or "text/plain"

        data = response.content

        if _is_pdf_mime_type(content_type):
            pages = await _extract_pdf_pages(data)
            return ProcessedInput(
                type="pdf",
                pages=pages,
                mime_type=content_type,
            )

        if _is_image_mime_type(content_type):
            return ProcessedInput(
                type="image",
                image_base64=_bytes_to_base64(data),
                mime_type=content_type,
            )

        if _is_text_mime_type(content_type):
            return ProcessedInput(
                type="text",
                text=data.decode("utf-8"),
                mime_type=content_type,
            )

        # For other content types, try to read as text
        try:
            return ProcessedInput(
                type="text",
                text=data.decode("utf-8"),
                mime_type=content_type,
            )
        except UnicodeDecodeError:
            raise RuntimeError(f"Unsupported content type: {content_type}")


async def _process_bytes(data: bytes, mime_type: str | None = None) -> ProcessedInput:
    """Process bytes and return as ProcessedInput."""
    # Try to detect content type from magic bytes
    detected_mime = mime_type or "application/octet-stream"

    # Check for PDF magic bytes
    if data[:4] == b"%PDF":
        detected_mime = "application/pdf"
    # Check for PNG magic bytes
    elif data[:8] == b"\x89PNG\r\n\x1a\n":
        detected_mime = "image/png"
    # Check for JPEG magic bytes
    elif data[:2] == b"\xff\xd8":
        detected_mime = "image/jpeg"
    # Check for GIF magic bytes
    elif data[:6] in (b"GIF87a", b"GIF89a"):
        detected_mime = "image/gif"
    # Check for WebP magic bytes
    elif data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        detected_mime = "image/webp"

    if _is_pdf_mime_type(detected_mime):
        pages = await _extract_pdf_pages(data)
        return ProcessedInput(
            type="pdf",
            pages=pages,
            mime_type=detected_mime,
        )

    if _is_image_mime_type(detected_mime):
        return ProcessedInput(
            type="image",
            image_base64=_bytes_to_base64(data),
            mime_type=detected_mime,
        )

    if _is_text_mime_type(detected_mime):
        return ProcessedInput(
            type="text",
            text=data.decode("utf-8"),
            mime_type=detected_mime,
        )

    # Try to read as text for unknown types
    try:
        return ProcessedInput(
            type="text",
            text=data.decode("utf-8"),
            mime_type=detected_mime,
        )
    except UnicodeDecodeError:
        raise RuntimeError(f"Unsupported content type: {detected_mime}")


async def process_input(input_data: GuardInput) -> ProcessedInput:
    """
    Process guard input and return normalized ProcessedInput.

    Auto-detection:
    - string starting with http:// or https:// -> fetch URL
    - string not starting with http(s):// -> plain text
    - bytes -> process based on content type detection
    """
    # Handle bytes
    if isinstance(input_data, bytes):
        return await _process_bytes(input_data)

    # Handle string
    if isinstance(input_data, str):
        # Check if it's a URL
        if _is_url_string(input_data):
            return await _fetch_url(input_data)

        # Plain text
        return ProcessedInput(
            type="text",
            text=input_data,
            mime_type="text/plain",
        )

    raise ValueError("Invalid input type")


def is_vision_model(model: str) -> bool:
    """Check if a model supports vision (multimodal) input."""
    # OpenAI vision models
    if any(x in model for x in ["gpt-4o", "gpt-4-turbo", "gpt-4.1", "gpt-5"]):
        return True

    # Anthropic Claude 3+ models support vision
    if any(x in model for x in [
        "claude-3",
        "claude-sonnet-4",
        "claude-opus-4",
        "claude-haiku-4",
    ]):
        return True

    # Google Gemini models support vision
    if "gemini" in model:
        return True

    # Vercel/OpenRouter models with vision
    if any(x in model for x in ["grok-2-vision", "pixtral", "vision", "-vl-"]):
        return True

    return False
