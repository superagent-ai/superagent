"""
Input processor unit tests -- URL validation, SSRF protection, and content type detection.

All network calls are mocked so these tests run offline.
"""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from safety_agent.utils.input_processor import (
    _get_mime_type_from_url,
    _is_image_mime_type,
    _is_pdf_mime_type,
    _is_private_ip,
    _is_text_mime_type,
    _is_url_string,
    _validate_url,
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
# Private IP / SSRF protection
# ---------------------------------------------------------------------------

class TestIsPrivateIp:
    def test_localhost_hostname(self):
        assert _is_private_ip("localhost") is True

    def test_localhost_ip(self):
        assert _is_private_ip("127.0.0.1") is True

    def test_loopback_range(self):
        assert _is_private_ip("127.1.2.3") is True

    @pytest.mark.parametrize("ip", ["10.0.0.1", "10.255.255.255"])
    def test_10_range(self, ip):
        assert _is_private_ip(ip) is True

    @pytest.mark.parametrize("ip", ["172.16.0.1", "172.31.255.255"])
    def test_172_range(self, ip):
        assert _is_private_ip(ip) is True

    @pytest.mark.parametrize("ip", ["192.168.0.1", "192.168.255.255"])
    def test_192_range(self, ip):
        assert _is_private_ip(ip) is True

    def test_link_local(self):
        assert _is_private_ip("169.254.1.1") is True

    def test_public_ip(self):
        assert _is_private_ip("8.8.8.8") is False

    @patch("safety_agent.utils.input_processor.socket.gethostbyname", return_value="127.0.0.1")
    def test_hostname_resolving_to_private(self, _mock):
        assert _is_private_ip("evil.example.com") is True

    @patch("safety_agent.utils.input_processor.socket.gethostbyname", return_value="93.184.216.34")
    def test_hostname_resolving_to_public(self, _mock):
        assert _is_private_ip("example.com") is False


# ---------------------------------------------------------------------------
# URL validation
# ---------------------------------------------------------------------------

class TestValidateUrl:
    def test_valid_https(self):
        # Should not raise
        _validate_url("https://example.com/page")

    def test_valid_http(self):
        _validate_url("http://example.com/page")

    def test_file_protocol(self):
        with pytest.raises(ValueError, match="file:// protocol is not allowed"):
            _validate_url("file:///etc/passwd")

    def test_ftp_protocol(self):
        with pytest.raises(ValueError, match="protocol must be http or https"):
            _validate_url("ftp://example.com/file")

    def test_localhost_blocked(self):
        with pytest.raises(ValueError, match="localhost access is not allowed"):
            _validate_url("http://localhost/secret")

    def test_127_blocked(self):
        with pytest.raises(ValueError, match="localhost access is not allowed"):
            _validate_url("http://127.0.0.1/secret")

    def test_private_ip_blocked(self):
        with pytest.raises(ValueError, match="private/internal IP addresses are not allowed"):
            _validate_url("http://10.0.0.1/internal")

    def test_url_too_long(self):
        long_url = "https://example.com/" + "a" * 2050
        with pytest.raises(ValueError, match="URL exceeds maximum length"):
            _validate_url(long_url)


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


# ---------------------------------------------------------------------------
# Redirect SSRF protection
# ---------------------------------------------------------------------------
#
# `_fetch_url` previously passed `follow_redirects=True` to httpx. That meant
# a public URL (which passes `_validate_url`) could issue a 302 to an internal
# address like 127.0.0.1 or 169.254.169.254 (AWS metadata) and httpx would
# transparently follow it. These tests cover the manual redirect loop that
# re-runs `_validate_url` on every hop.

import httpx as _httpx  # noqa: E402

from safety_agent.utils.input_processor import (  # noqa: E402
    MAX_REDIRECTS,
    _fetch_url,
)


_REAL_ASYNC_CLIENT = _httpx.AsyncClient


class _FakeAsyncClient:
    """Minimal async-context-manager stand-in for httpx.AsyncClient that
    routes requests through an httpx.MockTransport so we can script
    redirect chains without hitting the network."""

    def __init__(self, *, transport: _httpx.MockTransport):
        # Use the unpatched AsyncClient so we don't re-enter the fake.
        self._inner = _REAL_ASYNC_CLIENT(transport=transport)

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):
        await self._inner.aclose()

    async def get(self, url, *, follow_redirects=False, timeout=None):
        return await self._inner.get(url, follow_redirects=follow_redirects, timeout=timeout)


def _patch_client(transport: _httpx.MockTransport):
    return patch(
        "safety_agent.utils.input_processor.httpx.AsyncClient",
        lambda: _FakeAsyncClient(transport=transport),
    )


class TestFetchUrlRedirectSsrf:
    async def test_redirect_to_loopback_blocked(self):
        """A public URL redirecting to 127.0.0.1 must raise, not silently fetch."""

        def handler(request: _httpx.Request) -> _httpx.Response:
            if request.url.host == "safe.example.com":
                return _httpx.Response(302, headers={"location": "http://127.0.0.1/secret"})
            # If the fetcher ever reaches 127.0.0.1, return a marker we can fail on.
            return _httpx.Response(200, text="LEAKED INTERNAL DATA")

        transport = _httpx.MockTransport(handler)
        with _patch_client(transport):
            with pytest.raises(ValueError, match="localhost access is not allowed"):
                await _fetch_url("https://safe.example.com/r")

    async def test_redirect_to_link_local_metadata_blocked(self):
        """302 -> 169.254.169.254 (AWS/GCP metadata) must raise."""

        def handler(request: _httpx.Request) -> _httpx.Response:
            return _httpx.Response(
                302,
                headers={"location": "http://169.254.169.254/latest/meta-data/"},
            )

        transport = _httpx.MockTransport(handler)
        with _patch_client(transport):
            with pytest.raises(ValueError, match="private/internal IP addresses"):
                await _fetch_url("https://safe.example.com/r")

    async def test_redirect_relative_path_to_private_blocked(self):
        """Relative redirects get resolved against the current URL, then revalidated.
        A hostname that quietly resolves to a private IP still trips the check."""

        def handler(request: _httpx.Request) -> _httpx.Response:
            if request.url.host == "public.example.com":
                return _httpx.Response(302, headers={"location": "http://10.0.0.1/secret"})
            return _httpx.Response(200, text="LEAKED")

        transport = _httpx.MockTransport(handler)
        with _patch_client(transport):
            with pytest.raises(ValueError, match="private/internal IP addresses"):
                await _fetch_url("https://public.example.com/redir")

    async def test_redirect_chain_public_to_public_ok(self):
        """Legitimate public-to-public 302 chain must still succeed."""

        def handler(request: _httpx.Request) -> _httpx.Response:
            if request.url.host == "one.example.com":
                return _httpx.Response(
                    302, headers={"location": "https://two.example.com/final"}
                )
            return _httpx.Response(
                200,
                headers={"content-type": "text/plain"},
                text="ok",
            )

        transport = _httpx.MockTransport(handler)
        with _patch_client(transport):
            result = await _fetch_url("https://one.example.com/a")

        assert result.type == "text"
        assert result.text == "ok"

    async def test_too_many_redirects_raises(self):
        """Redirect loops must terminate after MAX_REDIRECTS hops."""
        calls = {"n": 0}

        def handler(request: _httpx.Request) -> _httpx.Response:
            calls["n"] += 1
            # Keep bouncing between two public hosts; never return a terminal 200.
            next_host = "a.example.com" if request.url.host == "b.example.com" else "b.example.com"
            return _httpx.Response(
                302, headers={"location": f"https://{next_host}/loop"}
            )

        transport = _httpx.MockTransport(handler)
        with _patch_client(transport):
            with pytest.raises(RuntimeError, match="exceeded maximum of .* redirects"):
                await _fetch_url("https://a.example.com/loop")

        # MAX_REDIRECTS + 1 request attempts (original + MAX_REDIRECTS hops).
        assert calls["n"] == MAX_REDIRECTS + 1

    async def test_redirect_without_location_raises(self):
        """3xx response with a missing Location header is reported as an error
        rather than silently swallowed."""

        def handler(request: _httpx.Request) -> _httpx.Response:
            return _httpx.Response(302, headers={})  # no location

        transport = _httpx.MockTransport(handler)
        with _patch_client(transport):
            with pytest.raises(RuntimeError, match="without Location header"):
                await _fetch_url("https://safe.example.com/r")

    async def test_redirect_to_file_scheme_blocked(self):
        """Location: file:///etc/passwd must be caught by _validate_url."""

        def handler(request: _httpx.Request) -> _httpx.Response:
            return _httpx.Response(302, headers={"location": "file:///etc/passwd"})

        transport = _httpx.MockTransport(handler)
        with _patch_client(transport):
            with pytest.raises(ValueError, match="file:// protocol is not allowed"):
                await _fetch_url("https://safe.example.com/r")
