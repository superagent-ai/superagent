import asyncio

from langchain.tools import BaseTool
from algoliasearch.search_client import SearchClient


class Algolia(BaseTool):
    name = "Algolia"
    description = "Useful for querying an Agolia index"
    return_direct = False

    def _run(self, search_query: str, num_of_results: int = 3) -> str:
        app_id = self.metadata["appId"]
        api_key = self.metadata["apiKey"]
        index = self.metadata["index"]
        client = SearchClient.create(app_id, api_key)
        index = client.init_index(index)
        output = index.search(search_query)
        return output["hits"][:num_of_results]

    async def _arun(self, search_query: str, num_of_results: int = 3) -> str:
        app_id = self.metadata["appId"]
        api_key = self.metadata["apiKey"]
        index = self.metadata["index"]
        client = SearchClient.create(app_id, api_key)
        index = client.init_index(index)
        loop = asyncio.get_event_loop()
        output = await loop.run_in_executor(None, index.search, search_query)
        return output["hits"][:num_of_results]
