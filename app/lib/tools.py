# flake8: noqa
from typing import List
from enum import Enum
from decouple import config
from langchain.agents import Tool
from langchain.utilities import BingSearchAPIWrapper
from langchain.utilities.wolfram_alpha import WolframAlphaAPIWrapper


class ToolDescription(Enum):
    SEARCH = "useful for when you need to answer questions about current events. You should ask targeted questions."
    WOLFRAM_ALPHA = "useful for when you need to do computation or calculation."


def get_search_tool() -> List:
    search = BingSearchAPIWrapper(
        bing_search_url=config("BING_SEARCH_URL"),
        bing_subscription_key=config("BING_SUBSCRIPTION_KEY"),
    )
    tools = [
        Tool(
            name="Search",
            func=search.run,
            description=ToolDescription.SEARCH,
        )
    ]

    return tools


def get_wolfram_alpha_tool() -> List:
    wolfram = WolframAlphaAPIWrapper()
    tools = [
        Tool(
            name="Wolfram Alpha",
            func=wolfram.run,
            description=ToolDescription.WOLFRAM_ALPHA,
        )
    ]

    return tools
