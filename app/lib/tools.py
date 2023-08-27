# flake8: noqa
import json
import requests

from typing import Any
from enum import Enum
from app.lib.vectorstores.base import VectorStoreBase
from decouple import config
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
from langchain.docstore.document import Document

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
    openapi_url = metadata.get("openApiUrl")
    headers = metadata.get("headers")
    agent = get_openapi_chain(
        spec=openapi_url, headers=json.loads(headers) if headers else None
    )

    return agent


class AgentTool:
    def __init__(self, metadata: dict, api_key: str) -> Any:
        self.metadata = metadata
        self.api_key = api_key

    def run(self, *args) -> str:
        url = f"https://api.superagent.sh/api/v1/agents/{self.metadata['agentId']}/predict"
        headers = {
            "content-type": "application/json",
            "authorization": f"Bearar {self.api_key}",
        }
        data = {"has_streaming": False, "input": {"input": args[0]}}
        response = requests.post(url, json=data, headers=headers)
        response_json = response.json()

        return response_json.get("data")


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

        return str(output)


class DocSummarizerTool:
    def __init__(self, document_id: str, llm: Any):
        self.document_id = document_id
        self.llm = llm

    def run(self, *args) -> str:
        """Use the tool."""
        document_text = (
            VectorStoreBase()
            .get_database()
            .query(
                prompt=" ",
                document_id=self.document_id,
                query_type="document",
                top_k=9999,
            )
        )

        documents = [Document(page_content=text) for text in document_text]
        chain = load_summarize_chain(self.llm, chain_type="stuff")
        summary = chain.run(
            input_documents=documents,
            question="Write a concise summary within 200 words.",
        )

        return summary


class DocumentTool:
    def __init__(self, document_id: str, query_type: str = "document"):
        self.document_id = document_id
        self.query_type = query_type

    def run(self, prompt: str) -> str:
        """Use the tool."""
        results = (
            VectorStoreBase()
            .get_database()
            .query(
                prompt=prompt,
                document_id=self.document_id,
                query_type=self.query_type,
                top_k=3,
            )
        )

        return results
