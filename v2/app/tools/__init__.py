import json

from typing import Type, Dict, Any

from app.tools.metaphor import MetaphorSearch
from app.tools.bing_search import BingSearch
from app.models.tools import BingSearchInput, MetaphorSearchInput

TOOL_TYPE_MAPPING = {
    "BING_SEARCH": {
        "class": BingSearch,
        "schema": BingSearchInput,
    },
    "METAPHOR": {
        "class": MetaphorSearch,
        "schema": MetaphorSearchInput,
    },
}


def create_tool(
    tool_class: Type[Any],
    name: str,
    description: str,
    args_schema: Any,
    metadata: Dict[str, Any],
) -> Any:
    return tool_class(
        name=name,
        description=description,
        args_schema=args_schema,
        metadata=json.loads(metadata),
    )
