from litellm import get_llm_provider

from app.utils.helpers import (
    remove_key_if_present,
    rename_and_remove_keys,
)
from app.utils.llm import LLM_REVERSE_MAPPING

from .saml_schema import WorkflowTool


class DataTransformer:
    @staticmethod
    def transform_tool(tool: WorkflowTool, tool_type: str):
        rename_and_remove_keys(tool, {"use_for": "description"})

        if tool_type:
            tool["type"] = tool_type.upper()

        if tool.get("type") == "FUNCTION":
            tool["metadata"] = {
                "functionName": tool.get("name"),
                **tool.get("metadata", {}),
            }

    @staticmethod
    def transform_assistant(assistant: dict, assistant_type: str):
        remove_key_if_present(assistant, "data")
        remove_key_if_present(assistant, "tools")
        rename_and_remove_keys(
            assistant, {"llm": "llmModel", "intro": "initialMessage"}
        )

        if assistant_type:
            assistant["type"] = assistant_type.upper()

        llm_model = assistant.get("llmModel")

        if assistant.get("type") == "LLM":
            assistant["metadata"] = {
                "model": llm_model,
                **assistant.get("metadata", {}),
            }

        if llm_model:
            _, provider, _, _ = get_llm_provider(llm_model)

            if provider:
                assistant["llmProvider"] = provider.upper()

            assistant["llmModel"] = LLM_REVERSE_MAPPING.get(llm_model)

        if assistant.get("type") == "LLM":
            remove_key_if_present(assistant, "llmModel")
