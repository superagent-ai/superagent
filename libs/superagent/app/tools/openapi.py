import asyncio
import json

from langchain.chains.openai_functions.openapi import get_openapi_chain
from langchain_community.tools import BaseTool


class Openapi(BaseTool):
    name = "API"
    description = "useful for querying an api"
    return_direct = False

    def _run(self, input: str) -> str:
        openapi_url = self.metadata["openApiUrl"]
        headers = self.metadata.get("headers")
        agent = get_openapi_chain(
            spec=openapi_url, headers=json.loads(headers) if headers else None
        )
        output = agent.run(input)
        return output

    async def _arun(self, input: str) -> str:
        openapi_url = self.metadata["openApiUrl"]
        headers = self.metadata.get("headers")
        try:
            agent = get_openapi_chain(
                spec=openapi_url, headers=json.loads(headers) if headers else None
            )
            loop = asyncio.get_event_loop()
            output = await loop.run_in_executor(None, agent.run, input)
        except Exception as e:
            output = str(e)
        return output
