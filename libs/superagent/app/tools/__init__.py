import json
import logging
import re
from enum import Enum
from typing import Any, Dict, Optional, Type

from langchain_community.tools import BaseTool
from pydantic import create_model
from slugify import slugify

from app.datasource.types import (
    VALID_UNSTRUCTURED_DATA_TYPES,
)
from app.models.tools import (
    AdvancedScraperInput,
    AgentInput,
    AlgoliaInput,
    BingSearchInput,
    BrowserInput,
    ChatGPTInput,
    CodeInterpreterInput,
    DatasourceInput,
    # E2BCodeExecutorInput,
    FunctionInput,
    GoogleSearchInput,
    GPTVisionInput,
    HandOffInput,
    HTTPInput,
    MetaphorSearchInput,
    OpenapiInput,
    PubMedInput,
    ReplicateInput,
    ScraperInput,
    SECInput,
    SuperRagInput,
    TavilyInput,
    TTS1Input,
    WolframInput,
    ZapierInput,
)
from app.tools.advanced_scraper import AdvancedScraper
from app.tools.agent import Agent
from app.tools.algolia import Algolia
from app.tools.bing_search import BingSearch, LCBingSearch
from app.tools.browser import Browser, LCBrowser
from app.tools.chatgpt import get_chatpgt_tool
from app.tools.code_interpreter import CodeInterpreter
from app.tools.datasource import DatasourceTool, StructuredDatasourceTool

# from app.tools.e2b import E2BCodeExecutor
from app.tools.function import Function
from app.tools.google_search import GoogleSearch
from app.tools.gpt_vision import GPTVision
from app.tools.hand_off import HandOff
from app.tools.http import LCHttpTool
from app.tools.metaphor import MetaphorSearch
from app.tools.openapi import Openapi
from app.tools.pubmed import PubMed
from app.tools.replicate import Replicate
from app.tools.scraper import Scraper
from app.tools.sec import SEC
from app.tools.superrag import SuperRagTool
from app.tools.tavily import Tavily
from app.tools.tts_1 import TTS1
from app.tools.wolfram_alpha import WolframAlpha
from app.tools.zapier import ZapierNLA
from prisma.models import Agent as AgentModel

logger = logging.getLogger(__name__)

TOOL_TYPE_MAPPING = {
    "AGENT": {"class": Agent, "schema": AgentInput},
    "ALGOLIA": {"class": Algolia, "schema": AlgoliaInput},
    "BING_SEARCH": {
        "class": LCBingSearch,
        "schema": BingSearchInput,
    },
    "METAPHOR": {
        "class": MetaphorSearch,
        "schema": MetaphorSearchInput,
    },
    "PUBMED": {
        "class": PubMed,
        "schema": PubMedInput,
    },
    "ZAPIER_NLA": {"class": ZapierNLA, "schema": ZapierInput},
    "OPENAPI": {"class": Openapi, "schema": OpenapiInput},
    "CHATGPT_PLUGIN": {"class": get_chatpgt_tool, "schema": ChatGPTInput},
    "REPLICATE": {"class": Replicate, "schema": ReplicateInput},
    "WOLFRAM_ALPHA": {"class": WolframAlpha, "schema": WolframInput},
    # "CODE_EXECUTOR": {"class": E2BCodeExecutor, "schema": E2BCodeExecutorInput},
    "CODE_EXECUTOR": {"class": CodeInterpreter, "schema": CodeInterpreterInput},
    "BROWSER": {"class": LCBrowser, "schema": BrowserInput},
    "GPT_VISION": {"class": GPTVision, "schema": GPTVisionInput},
    "TTS_1": {"class": TTS1, "schema": TTS1Input},
    "HAND_OFF": {"class": HandOff, "schema": HandOffInput},
    "FUNCTION": {"class": Function, "schema": FunctionInput},
    "HTTP": {"class": LCHttpTool, "schema": HTTPInput},
    "SUPERRAG": {"class": SuperRagTool, "schema": SuperRagInput},
    "RESEARCH": {"class": Tavily, "schema": TavilyInput},
    "SCRAPER": {"class": Scraper, "schema": ScraperInput},
    "ADVANCED_SCRAPER": {"class": AdvancedScraper, "schema": AdvancedScraperInput},
    "GOOGLE_SEARCH": {"class": GoogleSearch, "schema": GoogleSearchInput},
    "SEC": {"class": SEC, "schema": SECInput},
}

OSS_TOOL_TYPE_MAPPING = {"BROWSER": Browser, "BING_SEARCH": BingSearch}


def create_pydantic_model_from_object(obj: Dict[str, Any]) -> Any:
    fields = {}
    type_mapping = {
        "string": str,
        "integer": int,
        "boolean": bool,
    }
    for key, value in obj.items():
        if isinstance(value, dict):
            type = value.get("type")
            if not type:
                logger.warning(f"Type not found for {key}, defaulting to string")
            if "enum" in value:
                enum_values = value["enum"]
                enum_name = f"{key.capitalize()}Enum"
                field_type = Enum(enum_name, enum_values)
            else:
                field_type = type_mapping.get(type, str)
        else:
            field_type = type_mapping.get(value, str)

        fields[key] = (field_type, ...)
    return create_model("DynamicModel", **fields)


def create_tool(
    tool_class: Type[Any],
    name: str,
    description: str,
    args_schema: Any,
    metadata: Optional[Dict[str, Any]],
    return_direct: Optional[bool],
) -> BaseTool:
    return tool_class(
        name=name,
        description=description,
        args_schema=args_schema,
        metadata=metadata,
        return_direct=return_direct,
    )


def conform_function_name(url):
    """
    Validates OpenAI function names and modifies them to conform to the regex
    """
    regex_pattern = r"^[A-Za-z0-9_]{1,64}$"

    # Check if the URL matches the regex
    if re.match(regex_pattern, url):
        return url  # URL is already valid
    else:
        # Modify the URL to conform to the regex
        valid_url = re.sub(r"[^A-Za-z0-9_]", "", url)[:64]
        return valid_url


def recursive_json_loads(data):
    if isinstance(data, str):
        try:
            data = json.loads(data)
        except json.JSONDecodeError:
            return data
    if isinstance(data, dict):
        return {k: recursive_json_loads(v) for k, v in data.items()}
    if isinstance(data, list):
        return [recursive_json_loads(v) for v in data]
    return data


def get_tools(agent_data: AgentModel, session_id: str) -> list[BaseTool]:
    tools = []
    for agent_datasource in agent_data.datasources:
        tool_type = (
            DatasourceTool
            if agent_datasource.datasource.type in VALID_UNSTRUCTURED_DATA_TYPES
            else StructuredDatasourceTool
        )

        metadata = (
            {
                "datasource_id": agent_datasource.datasource.id,
                "options": (
                    agent_datasource.datasource.vectorDb.options
                    if agent_datasource.datasource.vectorDb
                    else {}
                ),
                "provider": (
                    agent_datasource.datasource.vectorDb.provider
                    if agent_datasource.datasource.vectorDb
                    else None
                ),
                # TODO: This will be removed in v0.3
                # This is for the users who wants to
                # use Azure both for LLM and embeddings
                "embeddings_model_provider": agent_data.llms[0].llm.provider,
                "query_type": "document",
            }
            if tool_type == DatasourceTool
            else {"datasource": agent_datasource.datasource}
        )

        tool_name = conform_function_name(slugify(agent_datasource.datasource.name))
        tool = tool_type(
            metadata=metadata,
            args_schema=DatasourceInput,
            name=tool_name,
            description=agent_datasource.datasource.description,
            return_direct=False,
        )
        tools.append(tool)

    for agent_tool in agent_data.tools:
        agent_tool_metadata = json.loads(agent_tool.tool.metadata or "{}")

        agent_tool_metadata = {
            **agent_tool_metadata,
            "params": {
                **(agent_tool_metadata.get("params", {}) or {}),
                # user id is added to the metadata for superrag tool
                "user_id": agent_data.apiUserId,
                # session id is added to the metadata for agent as tool
                "session_id": session_id,
            },
        }

        tool_info = TOOL_TYPE_MAPPING.get(agent_tool.tool.type)
        if agent_tool.tool.type == "FUNCTION":
            metadata = recursive_json_loads(agent_tool_metadata)
            tool_name = conform_function_name(
                slugify(metadata.get("functionName", agent_tool.tool.name))
            )
            args = metadata.get("args", {})
            PydanticModel = create_pydantic_model_from_object(args)
            tool = create_tool(
                tool_class=tool_info["class"],
                name=tool_name,
                description=agent_tool.tool.description,
                metadata=metadata,
                args_schema=PydanticModel,
                return_direct=agent_tool.tool.returnDirect,
            )
        else:
            metadata = agent_tool_metadata
            tool_name = conform_function_name(
                slugify(metadata.get("functionName", agent_tool.tool.name))
            )
            tool = create_tool(
                tool_class=tool_info["class"],
                name=tool_name,
                description=agent_tool.tool.description,
                metadata=metadata,
                args_schema=tool_info["schema"],
                return_direct=agent_tool.tool.returnDirect,
            )
        tools.append(tool)
    return tools
