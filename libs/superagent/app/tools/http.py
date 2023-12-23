import json

import aiohttp
import requests
from langchain.tools import BaseTool as LCBaseTool


class LCHttpTool(LCBaseTool):
    name = "API Request"
    description = "useful for making GET/POST API requests"
    return_direct = False

    def _run(self, url: str, method: str = "GET", body: dict = None) -> None:
        headers = (
            json.loads(self.metadata.get("headers"))
            if self.metadata.get("headers")
            else {}
        )
        try:
            request_kwargs = {"method": method, "url": url, "headers": headers}
            if body is not None:
                request_kwargs["json"] = body
            response = requests.request(**request_kwargs)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return str(e)

    async def _arun(self, url: str, method: str = "GET", body: dict = None) -> str:
        headers = (
            json.loads(self.metadata.get("headers"))
            if self.metadata.get("headers")
            else {}
        )
        try:
            async with aiohttp.ClientSession() as session:
                request_kwargs = {"method": method, "url": url, "headers": headers}
                if body is not None:
                    request_kwargs["json"] = body
                async with session.request(**request_kwargs) as response:
                    return await response.json()
        except Exception as e:
            return str(e)
