# flake8: noqa

from typing import Any, Optional, Type
from enum import Enum
from decouple import config
from langchain.agents import Tool
from langchain.utilities import BingSearchAPIWrapper
from langchain.utilities.wolfram_alpha import WolframAlphaAPIWrapper
from langchain.chains.summarize import load_summarize_chain
from langchain.llms.replicate import Replicate


class ToolDescription(Enum):
    SEARCH = "useful for when you need to search for answers on the internet. You should ask targeted questions."
    WOLFRAM_ALPHA = "useful for when you need to do computation or calculation."
    REPLICATE = "useful for when you need to create an image."


def get_search_tool() -> Any:
    search = BingSearchAPIWrapper(
        bing_search_url=config("BING_SEARCH_URL"),
        bing_subscription_key=config("BING_SUBSCRIPTION_KEY"),
    )

    return search


def get_wolfram_alpha_tool() -> Any:
    wolfram = WolframAlphaAPIWrapper()

    return wolfram


def get_replicate_tool(metadata: dict) -> Any:
    model = metadata["model"]
    api_token = metadata["api_key"]
    input = metadata["arguments"]
    model = Replicate(
        model=model,
        replicate_api_token=api_token if api_token else config("REPLICATE_API_TOKEN"),
        input=input,
    )

    return model


class DocSummarizerTool:
    def __init__(self, docsearch: Any, llm: Any):
        self.docsearch = docsearch
        self.llm = llm

    def run(self, *args) -> str:
        """Use the tool."""
        chain = load_summarize_chain(self.llm, chain_type="stuff")
        search = self.docsearch.similarity_search(" ")
        summary = chain.run(
            input_documents=search, question="Write a concise summary within 200 words."
        )

        return summary
