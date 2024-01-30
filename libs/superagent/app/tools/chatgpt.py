from typing import Any

from langchain_community.tools import AIPluginTool


def get_chatpgt_tool(metadata: dict | None, *_args, **_kwargs) -> Any:
    return AIPluginTool.from_plugin_url(metadata["chatgptPluginURL"])
