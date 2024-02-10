from app.utils.helpers import (
    remove_key_if_present,
    rename_and_remove_keys,
)
from app.utils.llm import LLM_REVERSE_MAPPING

from .saml_schema import WorkflowAssistant, WorkflowTool


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
    def transform_assistant(assistant: WorkflowAssistant, assistant_type: str):
        remove_key_if_present(assistant, "data")
        remove_key_if_present(assistant, "tools")
        rename_and_remove_keys(
            assistant, {"llm": "llmModel", "intro": "initialMessage"}
        )

        if assistant.get("llmModel"):
            assistant["llmModel"] = LLM_REVERSE_MAPPING[assistant["llmModel"]]

        if assistant_type:
            assistant["type"] = assistant_type.upper()
