import json

from typing import Type, Dict, Any, Optional

from app.tools.metaphor import MetaphorSearch
from app.tools.bing_search import BingSearch
from app.tools.pubmed import PubMed
from app.tools.zapier import ZapierNLA
from app.tools.openapi import Openapi
from app.tools.chatgpt import get_chatpgt_tool
from app.tools.replicate import Replicate
from app.models.tools import (
    BingSearchInput,
    MetaphorSearchInput,
    PubMedInput,
    ZapierInput,
    OpenapiInput,
    ChatGPTInput,
    ReplicateInput,
)

TOOL_TYPE_MAPPING = {
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
}


def create_tool(
    tool_class: Type[Any],
    name: str,
    description: str,
    args_schema: Any,
    metadata: Optional[Dict[str, Any]],
) -> Any:
    return tool_class(
        name=name,
        description=description,
        args_schema=args_schema,
        metadata=json.loads(metadata) if metadata else None,
    )
