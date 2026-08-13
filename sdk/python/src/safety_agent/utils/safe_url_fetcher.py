"""SSRF-safe remote URL fetching."""

import asyncio
from dataclasses import dataclass
import ipaddress
import socket
from urllib.parse import urljoin, urlparse

import aiohttp
from aiohttp.abc import AbstractResolver, ResolveResult

MAX_URL_LENGTH = 2048
MAX_REDIRECTS = 5
MAX_RESPONSE_BYTES = 25 * 1024 * 1024
REQUEST_TIMEOUT_SECONDS = 30.0


@dataclass
class PublicUrlResponse:
    final_url: str
    content_type: str
    data: bytes


def _validate_url_syntax(url: str) -> tuple[str, int]:
    if len(url) > MAX_URL_LENGTH:
        raise ValueError(
            f"Invalid URL: URL exceeds maximum length of {MAX_URL_LENGTH} characters"
        )

    try:
        parsed = urlparse(url)
        port = parsed.port or (443 if parsed.scheme == "https" else 80)
    except ValueError as error:
        raise ValueError(f"Invalid URL: malformed URL format - {error}") from error

    if parsed.scheme not in ("http", "https"):
        if parsed.scheme == "file":
            raise ValueError("Invalid URL: file:// protocol is not allowed")
        raise ValueError(
            f"Invalid URL: protocol must be http or https, got {parsed.scheme}"
        )
    if not parsed.hostname:
        raise ValueError("Invalid URL: hostname is required")
    if parsed.username or parsed.password:
        raise ValueError("Invalid URL: embedded credentials are not allowed")

    hostname = parsed.hostname.lower()
    if hostname in ("localhost", "localhost.localdomain", "local"):
        raise ValueError("Invalid URL: localhost access is not allowed")

    return parsed.hostname, port


async def _resolve_public_addresses(
    hostname: str, port: int
) -> list[tuple[str, int]]:
    try:
        direct_ip = ipaddress.ip_address(hostname)
        addresses = [
            (
                str(direct_ip),
                socket.AF_INET6 if direct_ip.version == 6 else socket.AF_INET,
            )
        ]
    except ValueError:
        try:
            results = await asyncio.get_running_loop().getaddrinfo(
                hostname,
                port,
                family=socket.AF_UNSPEC,
                type=socket.SOCK_STREAM,
            )
        except (socket.gaierror, socket.herror) as error:
            raise ValueError(
                "Invalid URL: hostname could not be resolved safely"
            ) from error

        addresses = []
        seen: set[tuple[str, int]] = set()
        for family, _type, _proto, _canonname, sockaddr in results:
            entry = (sockaddr[0], family)
            if entry not in seen:
                seen.add(entry)
                addresses.append(entry)

    if not addresses or any(
        not ipaddress.ip_address(address).is_global
        for address, _family in addresses
    ):
        raise ValueError("Invalid URL: private/internal IP addresses are not allowed")

    return addresses


class _PinnedResolver(AbstractResolver):
    def __init__(self, hostname: str, addresses: list[tuple[str, int]]) -> None:
        self._hostname = hostname.lower()
        self._addresses = addresses

    async def resolve(
        self,
        host: str,
        port: int = 0,
        family: socket.AddressFamily = socket.AF_INET,
    ) -> list[ResolveResult]:
        if host.lower() != self._hostname:
            raise OSError("Attempted to resolve an unvalidated hostname")

        return [
            ResolveResult(
                hostname=host,
                host=address,
                port=port,
                family=address_family,
                proto=socket.IPPROTO_TCP,
                flags=socket.AI_NUMERICHOST,
            )
            for address, address_family in self._addresses
            if family in (socket.AF_UNSPEC, address_family)
        ]

    async def close(self) -> None:
        return None


async def fetch_public_url(url: str) -> PublicUrlResponse:
    current_url = url
    timeout = aiohttp.ClientTimeout(total=REQUEST_TIMEOUT_SECONDS)

    for redirect_count in range(MAX_REDIRECTS + 1):
        hostname, port = _validate_url_syntax(current_url)
        addresses = await _resolve_public_addresses(hostname, port)
        connector = aiohttp.TCPConnector(
            resolver=_PinnedResolver(hostname, addresses),
            use_dns_cache=False,
            family=socket.AF_UNSPEC,
        )

        async with aiohttp.ClientSession(
            connector=connector,
            timeout=timeout,
            trust_env=False,
        ) as client:
            async with client.get(current_url, allow_redirects=False) as response:
                if 300 <= response.status < 400:
                    location = response.headers.get("location")
                    if not location:
                        raise RuntimeError(
                            "Failed to fetch URL: redirect is missing Location"
                        )
                    if redirect_count == MAX_REDIRECTS:
                        raise RuntimeError(
                            f"Failed to fetch URL: exceeded {MAX_REDIRECTS} redirects"
                        )
                    current_url = urljoin(current_url, location)
                    continue

                if response.status != 200:
                    raise RuntimeError(
                        f"Failed to fetch URL: {response.status} {response.reason}"
                    )
                if (
                    response.content_length is not None
                    and response.content_length > MAX_RESPONSE_BYTES
                ):
                    raise RuntimeError(
                        f"Failed to fetch URL: response exceeds {MAX_RESPONSE_BYTES} bytes"
                    )

                body = bytearray()
                async for chunk in response.content.iter_chunked(64 * 1024):
                    body.extend(chunk)
                    if len(body) > MAX_RESPONSE_BYTES:
                        raise RuntimeError(
                            f"Failed to fetch URL: response exceeds {MAX_RESPONSE_BYTES} bytes"
                        )

                return PublicUrlResponse(
                    final_url=current_url,
                    content_type=(
                        response.headers.get("content-type", "")
                        .split(";")[0]
                        .strip()
                    ),
                    data=bytes(body),
                )

    raise RuntimeError(f"Failed to fetch URL: exceeded {MAX_REDIRECTS} redirects")
