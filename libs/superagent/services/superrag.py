from typing import Optional

import aiohttp
from decouple import config


class SuperRagService:
    def __init__(self, url: Optional[str] = None):
        self.url = url or config("SUPERRAG_API_URL")

        if not self.url:
            raise ValueError("SUPERRAG_API_URL is not set")

    async def _request(self, endpoint, data):
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{self.url}/{endpoint}", json=data) as response:
                return await response.json()

    async def ingest(self, data):
        return await self._request("ingest", data)

    async def query(self, data):
        return await self._request("query", data)

    async def delete(self, data):
        return await self._request("delete", data)
