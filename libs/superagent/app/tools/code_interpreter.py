import aiohttp
import requests
from decouple import config
from langchain_community.tools import BaseTool


class CodeInterpreter(BaseTool):
    name = "Code executor"
    description = "useful for executing code. returns the evaluation/result"

    def _setup_request(self, code: str):
        api_token = config("CODE_EXECUTOR_TOKEN")
        url = config("CODE_EXECUTOR_URL")
        headers = {
            "content-type": "application/json",
            "authorization": f"Bearer {api_token}",
        }
        data = {"code": code, "interpreter_mode": True}
        return url, headers, data

    def _run(self, python_code: str) -> str:
        url, headers, data = self._setup_request(python_code)
        return requests.post(url=url, headers=headers, json=data).text

    async def _arun(self, python_code: str) -> str:
        url, headers, data = self._setup_request(python_code)
        async with aiohttp.ClientSession() as session:
            async with session.post(url=url, headers=headers, json=data) as response:
                output = await response.text()
        return output
