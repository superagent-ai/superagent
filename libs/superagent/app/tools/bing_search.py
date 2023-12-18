import asyncio

from langchain.tools import BaseTool as LCBaseTool
from langchain.utilities import BingSearchAPIWrapper
from pydantic import BaseModel, Field

from app.tools.base import BaseTool


class LCBingSearch(LCBaseTool):
    name = "bing search"
    description = "useful for searching the internet"
    return_direct = False

    def _run(self, search_query: str) -> str:
        bing_search_url = self.metadata["bingSearchUrl"]
        bing_subscription_key = self.metadata["bingSubscriptionKey"]
        search = BingSearchAPIWrapper(
            bing_search_url=bing_search_url,
            bing_subscription_key=bing_subscription_key,
        )
        output = search.run(search_query)
        return output

    async def _arun(self, search_query: str) -> str:
        bing_search_url = self.metadata["bingSearchUrl"]
        bing_subscription_key = self.metadata["bingSubscriptionKey"]
        search = BingSearchAPIWrapper(
            bing_search_url=bing_search_url,
            bing_subscription_key=bing_subscription_key,
        )
        loop = asyncio.get_event_loop()
        output = await loop.run_in_executor(None, search.run, search_query)
        return output


class BingSearchArgs(BaseModel):
    search_query: str = Field(..., description="A search query")


class BingSearch(BaseTool):
    args_schema = BingSearchArgs

    async def arun(self, args: BingSearchArgs) -> dict:
        bing_search_url = self.metadata["bingSearchUrl"]
        bing_subscription_key = self.metadata["bingSubscriptionKey"]
        search_query = args.search_query
        search = BingSearchAPIWrapper(
            bing_search_url=bing_search_url,
            bing_subscription_key=bing_subscription_key,
        )
        loop = asyncio.get_event_loop()
        output = await loop.run_in_executor(None, search.run, search_query)
        return {"type": "function_call", "content": output}
