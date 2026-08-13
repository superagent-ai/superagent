import socket
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from safety_agent.utils.safe_url_fetcher import (
    _resolve_public_addresses,
    fetch_public_url,
)


@pytest.mark.parametrize(
    "url",
    [
        "http://127.0.0.1/admin",
        "http://10.0.0.1/internal",
        "http://172.16.0.1/internal",
        "http://192.168.1.1/internal",
        "http://169.254.169.254/latest/meta-data/",
        "http://[::1]/admin",
        "http://[fc00::1]/internal",
        "http://[fe80::1]/internal",
    ],
)
async def test_blocks_non_public_destinations(url):
    with pytest.raises(
        ValueError,
        match="private/internal IP addresses are not allowed",
    ):
        await fetch_public_url(url)


async def test_blocks_hostname_when_any_dns_result_is_non_public():
    loop = MagicMock()
    loop.getaddrinfo = AsyncMock(
        return_value=[
            (socket.AF_INET, socket.SOCK_STREAM, 6, "", ("93.184.216.34", 443)),
            (socket.AF_INET, socket.SOCK_STREAM, 6, "", ("10.0.0.1", 443)),
        ]
    )

    with patch(
        "safety_agent.utils.safe_url_fetcher.asyncio.get_running_loop",
        return_value=loop,
    ):
        with pytest.raises(
            ValueError,
            match="private/internal IP addresses are not allowed",
        ):
            await _resolve_public_addresses("mixed.example", 443)


async def test_validates_private_redirect_targets():
    response = MagicMock()
    response.status = 302
    response.headers = {
        "location": "http://169.254.169.254/latest/meta-data/",
    }
    response.__aenter__ = AsyncMock(return_value=response)
    response.__aexit__ = AsyncMock(return_value=None)

    session = MagicMock()
    session.get.return_value = response
    session.__aenter__ = AsyncMock(return_value=session)
    session.__aexit__ = AsyncMock(return_value=None)

    with (
        patch(
            "safety_agent.utils.safe_url_fetcher.aiohttp.TCPConnector",
            return_value=MagicMock(),
        ),
        patch(
            "safety_agent.utils.safe_url_fetcher.aiohttp.ClientSession",
            return_value=session,
        ),
    ):
        with pytest.raises(
            ValueError,
            match="private/internal IP addresses are not allowed",
        ):
            await fetch_public_url("https://93.184.216.34/redirect")

    session.get.assert_called_once()


async def test_downloads_content_from_public_url():
    class FakeContent:
        async def iter_chunked(self, _size):
            yield b"remote document"

    response = MagicMock()
    response.status = 200
    response.reason = "OK"
    response.headers = {"content-type": "text/plain"}
    response.content_length = len(b"remote document")
    response.content = FakeContent()
    response.__aenter__ = AsyncMock(return_value=response)
    response.__aexit__ = AsyncMock(return_value=None)

    session = MagicMock()
    session.get.return_value = response
    session.__aenter__ = AsyncMock(return_value=session)
    session.__aexit__ = AsyncMock(return_value=None)

    with (
        patch(
            "safety_agent.utils.safe_url_fetcher.aiohttp.TCPConnector",
            return_value=MagicMock(),
        ),
        patch(
            "safety_agent.utils.safe_url_fetcher.aiohttp.ClientSession",
            return_value=session,
        ),
    ):
        result = await fetch_public_url("https://93.184.216.34/document.txt")

    assert result.data == b"remote document"
    assert result.content_type == "text/plain"


async def test_rejects_credentials_and_non_http_protocols():
    with pytest.raises(ValueError, match="embedded credentials"):
        await fetch_public_url("https://user:password@example.com/file")
    with pytest.raises(ValueError, match="file:// protocol"):
        await fetch_public_url("file:///etc/passwd")
