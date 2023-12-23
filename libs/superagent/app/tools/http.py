import aiohttp
import requests
from langchain.tools import BaseTool as LCBaseTool


class LCHttpTool(LCBaseTool):
    name = "API Request"
    description = "useful for making GET/POST API requests"
    return_direct = False

    def _run(self, url: str, method: str, body: dict) -> None:
        headers = self.metadata.get("headers")
        try:
            response = requests.request(method, url, headers=headers, json=body)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return str(e)

    async def _arun(self, url: str, method: str, body: dict) -> str:
        headers = self.metadata.get("headers")
        try:
            async with aiohttp.ClientSession() as session:
                async with session.request(
                    method, url, headers=headers, json=body
                ) as response:
                    return await response.json()
        except Exception as e:
            return str(e)
