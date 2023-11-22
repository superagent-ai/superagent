import json
from typing import Any, Dict, Optional, Type

from app.models.tools import (
    AgentInput,
    AlgoliaInput,
    BingSearchInput,
    BrowserInput,
    ChatGPTInput,
    E2BCodeExecutorInput,
    GPTVisionInput,
    MetaphorSearchInput,
    OpenapiInput,
    PubMedInput,
    ReplicateInput,
    TTS1Input,
    WolframInput,
    ZapierInput,
    HandOffInput,
)
from app.tools.agent import Agent
from app.tools.algolia import Algolia
from app.tools.bing_search import BingSearch
from app.tools.browser import Browser
from app.tools.chatgpt import get_chatpgt_tool
from app.tools.e2b import E2BCodeExecutor
from app.tools.gpt_vision import GPTVision
from app.tools.metaphor import MetaphorSearch
from app.tools.openapi import Openapi
from app.tools.pubmed import PubMed
from app.tools.replicate import Replicate
from app.tools.tts_1 import TTS1
from app.tools.wolfram_alpha import WolframAlpha
from app.tools.zapier import ZapierNLA
from app.tools.hand_off import HandOff

TOOL_TYPE_MAPPING = {
    "AGENT": {"class": Agent, "schema": AgentInput},
    "ALGOLIA": {"class": Algolia, "schema": AlgoliaInput},
    "BING_SEARCH": {
        "class": BingSearch,
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
    "CODE_EXECUTOR": {"class": E2BCodeExecutor, "schema": E2BCodeExecutorInput},
    "BROWSER": {"class": Browser, "schema": BrowserInput},
    "GPT_VISION": {"class": GPTVision, "schema": GPTVisionInput},
    "TTS_1": {"class": TTS1, "schema": TTS1Input},
    "HAND_OFF": {"class": HandOff, "schema": HandOffInput},
}


def create_tool(
    tool_class: Type[Any],
    name: str,
    description: str,
    args_schema: Any,
    metadata: Optional[Dict[str, Any]],
    return_direct: Optional[bool],
) -> Any:
    return tool_class(
        name=name,
        description=description,
        args_schema=args_schema,
        metadata=json.loads(metadata) if metadata else None,
        return_direct=return_direct,
    )
