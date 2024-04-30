import json

import aiohttp
import requests
from langchain_community.tools import BaseTool

url = "https://google.serper.dev/search"


class GoogleSearch(BaseTool):
    name = "PubMed® search"
    description = "useful for answering question about medical publications"
    return_direct = False

    def _run(self, query: str) -> str:
        headers = {
            "X-API-KEY": self.metadata.get("apiKey"),
            "Content-Type": "application/json",
        }
        payload = json.dumps({"q": query})
        response = requests.request("POST", url, headers=headers, data=payload)
        return response.text

    async def _arun(self, query: str) -> str:
        headers = {
            "X-API-KEY": self.metadata.get("apiKey"),
            "Content-Type": "application/json",
        }
        payload = json.dumps({"q": query})

        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, data=payload) as response:
                return await response.text()
