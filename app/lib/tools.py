# flake8: noqa
from typing import List

from decouple import config
from langchain.agents import Tool
from langchain.utilities import BingSearchAPIWrapper
from langchain.utilities.wolfram_alpha import WolframAlphaAPIWrapper


def get_search_tool() -> List:
    search = BingSearchAPIWrapper(
        bing_search_url=config("BING_SEARCH_URL"),
        bing_subscription_key=config("BING_SUBSCRIPTION_KEY"),
    )
    tools = [
        Tool(
            name="Search",
            func=search.run,
            description="useful for when you need to answer questions about current events. You should ask targeted questions.",
        )
    ]

    return tools


def get_wolfram_alpha_tool() -> List:
    wolfram = WolframAlphaAPIWrapper()
    tools = [
        Tool(
            name="Wolfram Alpha",
            func=wolfram.run,
            description="useful for when you need to do computation",
        )
    ]

    return tools
