# flake8: noqa
import json

from typing import Any, Optional, Type
from enum import Enum
from decouple import config
from langchain.agents import Tool
from langchain.utilities import BingSearchAPIWrapper
from langchain.utilities.wolfram_alpha import WolframAlphaAPIWrapper
from langchain.chains.summarize import load_summarize_chain
from langchain.llms.replicate import Replicate
from langchain.agents.agent_toolkits import ZapierToolkit
from langchain.agents import AgentType, initialize_agent
from langchain.utilities.zapier import ZapierNLAWrapper
from langchain.utilities import MetaphorSearchAPIWrapper
from langchain.chains.openai_functions.openapi import get_openapi_chain
from langchain.tools import AIPluginTool
from langchain.agents import load_tools

from superagent.client import Superagent


class ToolDescription(Enum):
    SEARCH = "useful for when you need to search for answers on the internet. You should ask targeted questions."
    WOLFRAM_ALPHA = "useful for when you need to do computation or calculation."
    REPLICATE = "useful for when you need to create an image."
    ZAPIER_NLA = "useful for when you need to do tasks."
    AGENT = "useful for when you need help completing something."
    OPENAPI = "useful for when you need to do API requests to a third-party service."
    CHATGPT_PLUGIN = "useful for when you need to interact with a third-party service"
    METAPHOR = "useful for when you need to search search for answers on the internet."


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


def get_zapier_nla_tool(metadata: dict, llm: Any) -> Any:
    zapier = ZapierNLAWrapper(zapier_nla_api_key=metadata["zapier_nla_api_key"])
    toolkit = ZapierToolkit.from_zapier_nla_wrapper(zapier)
    agent = initialize_agent(
        toolkit.get_tools(),
        llm,
        agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        verbose=True,
    )

    return agent


def get_chatgpt_plugin_tool(metadata: dict) -> Any:
    plugin_url = metadata["chatgptPluginURL"]
    tool = AIPluginTool.from_plugin_url(plugin_url)
    tools = load_tools(["requests_all"])
    tools += [tool]
    return tools


def get_openapi_tool(metadata: dict) -> Any:
    openapi_url = metadata["openApiUrl"]
    headers = metadata["headers"]
    agent = get_openapi_chain(
        spec=openapi_url, headers=json.loads(headers) if headers else None
    )

    return agent


class AgentTool:
    def __init__(self, metadata: dict, api_key: str) -> Any:
        self.metadata = metadata
        self.api_key = api_key

    def run(self, *args) -> str:
        superagent = Superagent(
            environment="https://api.superagent.sh", api_key=self.api_key
        )
        agent_id = self.metadata["agentId"]
        output = superagent.agent.prompt_agent(
            agent_id=agent_id, input={"input": args[0]}
        )

        return output["data"]


class MetaphorTool:
    def __init__(
        self,
        metadata: dict,
    ) -> Any:
        self.metadata = metadata

    def run(self, *args) -> str:
        search = MetaphorSearchAPIWrapper(
            metaphor_api_key=self.metadata["metaphor_api_key"]
        )
        output = search.results(args[0], 10, use_autoprompt=True)

        return output


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
