import asyncio

from decouple import config
from langchain_community.tools import BaseTool
from tavily import TavilyClient


class Tavily(BaseTool):
    name = "PubMed® search"
    description = "useful for answering question about medical publications"
    return_direct = False

    def _run(self, query: str) -> str:
        tavily = TavilyClient(
            api_key=self.metadata.get("apiKey") or config("TAVILY_API_KEY")
        )
        response = tavily.search(query=query, search_depth="advanced")
        context = [
            {"url": obj["url"], "content": obj["content"]} for obj in response.results
        ]
        return context

    async def _arun(self, query: str) -> str:
        tavily = TavilyClient(
            api_key=self.metadata.get("apiKey") or config("TAVILY_API_KEY")
        )
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, tavily.search, query, "advanced")
        context = [
            {"url": obj["url"], "content": obj["content"]}
            for obj in response.get("results")
        ]
        return context
