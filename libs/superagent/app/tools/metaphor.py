from langchain_community.tools import BaseTool
from langchain_community.utilities import MetaphorSearchAPIWrapper


class MetaphorSearch(BaseTool):
    name = "metaphor search"
    description = "useful for researching a certain topic"
    return_direct = False

    def _run(self, search_query: str) -> str:
        search = MetaphorSearchAPIWrapper(
            metaphor_api_key=self.metadata["metaphorApiKey"]
        )
        output = search.results(search_query, 10, use_autoprompt=True)
        return output

    async def _arun(self, search_query: str) -> str:
        search = MetaphorSearchAPIWrapper(
            metaphor_api_key=self.metadata["metaphorApiKey"]
        )
        output = await search.results_async(search_query, 10, use_autoprompt=True)
        return output
