from typing import List

from decouple import config
from langchain.agents import Tool
from langchain.utilities import BingSearchAPIWrapper


def get_search_tool() -> List:
    search = BingSearchAPIWrapper(
        bing_search_url=config("BING_SEARCH_URL"),
        bing_subscription_key=config("BING_SUBSCRIPTION_KEY"),
    )
    tools = [
        Tool(
            name="Bing search",
            func=search.run,
            description="useful for when you need to ask with search",
        )
    ]

    return tools
