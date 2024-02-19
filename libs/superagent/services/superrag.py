from typing import Optional

import aiohttp
import requests
from decouple import config


class SuperRagService:
    def __init__(self, url: Optional[str] = None):
        self.url = url or config("SUPERRAG_API_URL")

        if not self.url:
            raise ValueError("SUPERRAG_API_URL is not set")

    async def _arequest(self, method, endpoint, data):
        async with aiohttp.ClientSession() as session:
            async with session.request(
                method, f"{self.url}/{endpoint}", json=data
            ) as response:
                return await response.json()

    def _request(self, method, endpoint, data):
        return requests.request(method, f"{self.url}/{endpoint}", json=data).json()

    async def aingest(self, data):
        return await self._arequest(
            "POST",
            "ingest",
            data,
        )

    async def adelete(self, data):
        return await self._arequest("DELETE", "delete", data)

    def query(self, data):
        return self._request(
            "POST",
            "query",
            data,
        )
