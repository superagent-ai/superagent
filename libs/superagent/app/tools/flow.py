import json
import re
from typing import Any, Dict

from decouple import config
from litellm import acompletion
from prefect import flow
from pydantic import BaseModel

from app.tools import TOOL_TYPE_MAPPING
from app.utils.prisma import prisma
from prisma.models import Tool


def get_function_schema(
    name: str, description: str, model: BaseModel
) -> dict[str, Any]:
    signature_parts = []

    for field_name, field_model in model.__annotations__.items():
        field_info = model.__fields__[field_name]
        default_value = field_info.default

        if default_value:
            default_repr = repr(default_value)
            signature_part = f"{field_name}: {field_model.__name__} = {default_repr}"

        else:
            signature_part = f"{field_name}: {field_model.__name__}"

        signature_parts.append(signature_part)
    signature = f"({', '.join(signature_parts)}) -> str"
    schema = {"name": name, "description": description, "signature": signature}
    return schema


def is_valid_config(route_config: str) -> bool:
    try:
        output_json = json.loads(route_config)
        return all(key in output_json for key in ["name", "utterances"])
    except json.JSONDecodeError:
        return False


def parse_config(config: str) -> dict:
    # Regular expression to match content inside <config></config>
    config_pattern = r"<config>(.*?)</config>"
    match = re.search(config_pattern, config, re.DOTALL)

    if match:
        config_content = match.group(1).strip()  # Get the matched content
        return config_content
    else:
        raise ValueError("No <config></config> tags found in the output.")


async def generate_route(function_schema: Dict[str, Any]) -> str:
    prompt = f"""
    You are tasked to generate a JSON configuration based on the provided
    function schema. Please follow the template below, no other tokens allowed:
    
    <config>
    {{
        "name": "<function_name>",
        "utterances": [
            "<example_utterance_1>",
            "<example_utterance_2>",
            "<example_utterance_3>",
            "<example_utterance_4>",
            "<example_utterance_5>"]
    }}
    </config>

    Only include the "name" and "utterances" keys in your answer.
    The "name" should match the function name and the "utterances"
    should comprise a list of 5 example phrases that could be used to invoke
    the function.

    Input schema:
    {function_schema}
    """

    completion = await acompletion(
        model="openrouter/mistralai/mixtral-8x7b-instruct",
        api_key=config("OPENROUTER_API_KEY"),
        messages=[
            {"role": "system", "content": "You are an helpful assistant."},
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.01,
        max_tokens=200,
    )
    output = completion["choices"][0]["message"]["content"]
    route_config = parse_config(config=output)

    if is_valid_config(route_config=route_config):
        return route_config
    raise Exception("No config generated")


@flow(
    name="generate_tool_config",
    description="Generate tool config",
    retries=0,
)
async def generate_tool_config(tool: Tool) -> None:
    tool_instance = TOOL_TYPE_MAPPING[tool.type]
    if tool_instance:
        model = tool_instance.get("schema")
        function_schema = get_function_schema(
            name=tool.name, description=tool.description, model=model
        )
        route = await generate_route(function_schema=function_schema)
        await prisma.tool.update(where={"id": tool.id}, data={"toolConfig": route})
