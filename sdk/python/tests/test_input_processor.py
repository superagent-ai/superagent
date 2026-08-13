"""
Input processor unit tests -- URL validation, SSRF protection, and content type detection.

All network calls are mocked so these tests run offline.
"""

from unittest.mock import AsyncMock, patch

import pytest

from safety_agent.utils.input_processor import (
    _get_mime_type_from_url,
    _is_image_mime_type,
    _is_pdf_mime_type,
    _is_text_mime_type,
    _is_url_string,
    is_vision_model,
    process_input,
)


# ---------------------------------------------------------------------------
# URL detection
# ---------------------------------------------------------------------------

class TestIsUrlString:
    def test_http(self):
        assert _is_url_string("http://example.com") is True

    def test_https(self):
        assert _is_url_string("https://example.com") is True

    def test_plain_text(self):
        assert _is_url_string("Hello world") is False

    def test_ftp(self):
        assert _is_url_string("ftp://example.com") is False

    def test_empty(self):
        assert _is_url_string("") is False


# ---------------------------------------------------------------------------
# MIME type helpers
# ---------------------------------------------------------------------------

class TestMimeTypeHelpers:
    @pytest.mark.parametrize("mime", [
        "image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp",
    ])
    def test_image_mime_types(self, mime):
        assert _is_image_mime_type(mime) is True

    def test_non_image(self):
        assert _is_image_mime_type("text/plain") is False

    @pytest.mark.parametrize("mime", [
        "text/plain", "text/html", "text/css", "text/javascript",
        "text/csv", "text/xml", "application/json", "application/xml",
    ])
    def test_text_mime_types(self, mime):
        assert _is_text_mime_type(mime) is True

    def test_non_text(self):
        assert _is_text_mime_type("application/octet-stream") is False

    def test_pdf_mime_type(self):
        assert _is_pdf_mime_type("application/pdf") is True

    def test_non_pdf(self):
        assert _is_pdf_mime_type("text/plain") is False


class TestGetMimeTypeFromUrl:
    @pytest.mark.parametrize("url,expected", [
        ("https://example.com/photo.png", "image/png"),
        ("https://example.com/photo.jpg", "image/jpeg"),
        ("https://example.com/photo.jpeg", "image/jpeg"),
        ("https://example.com/anim.gif", "image/gif"),
        ("https://example.com/img.webp", "image/webp"),
        ("https://example.com/doc.pdf", "application/pdf"),
        ("https://example.com/readme.txt", "text/plain"),
        ("https://example.com/page.html", "text/html"),
        ("https://example.com/page.htm", "text/html"),
        ("https://example.com/data.json", "application/json"),
        ("https://example.com/data.xml", "application/xml"),
        ("https://example.com/data.csv", "text/csv"),
    ])
    def test_known_extensions(self, url, expected):
        assert _get_mime_type_from_url(url) == expected

    def test_unknown_extension(self):
        assert _get_mime_type_from_url("https://example.com/file.xyz") is None


# ---------------------------------------------------------------------------
# Vision model detection
# ---------------------------------------------------------------------------

class TestIsVisionModel:
    @pytest.mark.parametrize("model", [
        "openai/gpt-4o",
        "openai/gpt-4o-mini",
        "openai/gpt-4-turbo",
        "anthropic/claude-3-opus-20240229",
        "anthropic/claude-sonnet-4-20250514",
        "anthropic/claude-opus-4-20250514",
        "anthropic/claude-haiku-4-5",
        "google/gemini-2.0-flash",
        "google/gemini-2.5-pro",
    ])
    def test_vision_models(self, model):
        assert is_vision_model(model) is True

    @pytest.mark.parametrize("model", [
        "openai/gpt-3.5-turbo",
        "groq/llama-3.3-70b-versatile",
        "superagent/guard-1.7b",
    ])
    def test_non_vision_models(self, model):
        assert is_vision_model(model) is False


# ---------------------------------------------------------------------------
# process_input (integration-style with mocks)
# ---------------------------------------------------------------------------

class TestProcessInput:
    async def test_plain_text(self):
        result = await process_input("What is the weather?")
        assert result.type == "text"
        assert result.text == "What is the weather?"
        assert result.mime_type == "text/plain"

    async def test_invalid_input_type(self):
        with pytest.raises(ValueError, match="Invalid input type"):
            await process_input(12345)  # type: ignore[arg-type]

    @patch("safety_agent.utils.input_processor._fetch_url", new_callable=AsyncMock)
    async def test_url_delegates_to_fetch(self, mock_fetch):
        from safety_agent.types import ProcessedInput as PI
        mock_fetch.return_value = PI(type="text", text="fetched", mime_type="text/plain")

        result = await process_input("https://example.com/readme.txt")

        assert result.text == "fetched"
        mock_fetch.assert_awaited_once_with("https://example.com/readme.txt")

    async def test_bytes_pdf(self):
        # Minimal valid-ish PDF bytes for magic-byte detection path
        pdf_bytes = b"%PDF-1.4 fake content"
        with patch(
            "safety_agent.utils.input_processor._extract_pdf_pages",
            new_callable=AsyncMock,
            return_value=["Page 1 text"],
        ):
            result = await process_input(pdf_bytes)
            assert result.type == "pdf"
            assert result.pages == ["Page 1 text"]

    async def test_bytes_png(self):
        png_header = b"\x89PNG\r\n\x1a\n" + b"\x00" * 20
        result = await process_input(png_header)
        assert result.type == "image"
        assert result.mime_type == "image/png"
        assert result.image_base64 is not None

    async def test_bytes_jpeg(self):
        jpeg_header = b"\xff\xd8\xff\xe0" + b"\x00" * 20
        result = await process_input(jpeg_header)
        assert result.type == "image"
        assert result.mime_type == "image/jpeg"

    async def test_bytes_text_fallback(self):
        result = await process_input(b"Just some plain text bytes")
        assert result.type == "text"
        assert result.text == "Just some plain text bytes"
