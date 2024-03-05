import asyncio

from algoliasearch.search_client import SearchClient
from langchain_community.tools import BaseTool


class Algolia(BaseTool):
    name = "Algolia"
    description = "Useful for querying an Agolia index"
    return_direct = False

    def _init_client_and_index(self):
        app_id = self.metadata["appId"]
        api_key = self.metadata["apiKey"]
        index = self.metadata["index"]
        client = SearchClient.create(app_id, api_key)
        index = client.init_index(index)
        return index

    def _run(self, search_query: str, num_of_results: int = 3) -> str:
        index = self._init_client_and_index()
        output = index.search(search_query)
        return str(output["hits"][:num_of_results])

    async def _arun(self, search_query: str, num_of_results: int = 3) -> str:
        index = self._init_client_and_index()
        loop = asyncio.get_event_loop()
        output = await loop.run_in_executor(None, index.search, search_query)
        return str(output["hits"][:num_of_results])
