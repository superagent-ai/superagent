import json
import inspect

from decouple import config
from prefect import flow, task
from prisma.models import Tool
from typing import Any, Dict
from litellm import acompletion
from app.tools import TOOL_TYPE_MAPPING

from app.utils.prisma import prisma


def get_function_schema(function) -> dict[str, Any]:
    schema = {
        "name": function.__name__,
        "description": str(inspect.getdoc(function)),
        "signature": str(inspect.signature(function)),
        "output": str(
            inspect.signature(function).return_annotation,
        ),
    }
    return schema


def is_valid_config(route_config_str: str) -> bool:
    try:
        output_json = json.loads(route_config_str)
        return all(key in output_json for key in ["name", "utterances"])
    except json.JSONDecodeError:
        return False


async def generate_route(function: Dict[str, Any]) -> dict:
    function_schema = get_function_schema(function)
    prompt = f"""
    You are tasked to generate a JSON configuration based on the provided
    function schema. Please follow the template below:

    {{
        "name": "<function_name>",
        "utterances": [
            "<example_utterance_1>",
            "<example_utterance_2>",
            "<example_utterance_3>",
            "<example_utterance_4>",
            "<example_utterance_5>"]
    }}

    Only include the "name" and "utterances" keys in your answer.
    The "name" should match the function name and the "utterances"
    should comprise a list of 5 example phrases that could be used to invoke
    the function.

    Input schema:
    {function_schema}
    """


@flow(
    name="generate_tool_config",
    description="Generate tool config",
    retries=0,
)
async def generate_tool_config(tool: Tool) -> None:
    # Run completion to generate config
    tool_instance = TOOL_TYPE_MAPPING[tool.type]
    print(tool_instance.get("schema"))
    # await prisma.tool.update(where={"id": tool.id}, data={"toolConfig": None})
