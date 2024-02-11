from itertools import zip_longest

from app.api.workflow_configs.api.api_manager import ApiManager
from app.api.workflow_configs.processors.processor import Processor
from app.api.workflow_configs.processors.utils import get_first_key
from app.utils.helpers import compare_dicts

from ..data_transformer import DataTransformer


class AgentProcessor:
    def __init__(self, api_user, api_manager: ApiManager):
        self.api_user = api_user
        self.api_manager = api_manager

    async def process_assistant(
        self,
        old_assistant_obj,
        new_assistant_obj,
        workflow_step_order: int | None = None,
    ):
        new_agent = None
        old_type = get_first_key(old_assistant_obj)
        new_type = get_first_key(new_assistant_obj)

        old_assistant = old_assistant_obj.get(old_type, {})
        new_assistant = new_assistant_obj.get(new_type, {})

        old_data = old_assistant.get("data") or {}
        new_data = new_assistant.get("data") or {}

        old_tools = old_assistant.get("tools") or []
        new_tools = new_assistant.get("tools") or []

        dt = DataTransformer()
        dt.transform_assistant(new_assistant, new_type)
        dt.transform_assistant(old_assistant, old_type)

        for tool in old_tools:
            tool_type = get_first_key(tool)
            tool = tool.get(tool_type, {})

            dt.transform_tool(tool, tool_type)

        for tool in new_tools:
            tool_type = get_first_key(tool)
            tool = tool.get(tool_type, {})

            dt.transform_tool(tool, tool_type)

        if old_assistant:
            old_tool_processor = Processor(
                self.api_user, self.api_manager
            ).get_tool_processor(old_assistant)
            old_data_processor = Processor(
                self.api_user, self.api_manager
            ).get_data_processor(old_assistant)

        if new_assistant:
            new_tool_processor = Processor(
                self.api_user, self.api_manager
            ).get_tool_processor(new_assistant)

            new_data_processor = Processor(
                self.api_user, self.api_manager
            ).get_data_processor(new_assistant)

        if old_type and new_type:
            if old_type != new_type:
                await self.api_manager.agent_manager.delete_assistant(
                    assistant=old_assistant,
                )
                await self.api_manager.agent_manager.add_assistant(
                    new_assistant,
                    workflow_step_order,
                )
                # all tools and data should be re-created
                await old_tool_processor.process(old_tools, [])
                await new_tool_processor.process([], new_tools)
                await old_data_processor.process(old_data, {})
                await new_data_processor.process({}, new_data)

            else:
                changes = compare_dicts(old_assistant, new_assistant)
                if changes:
                    await self.api_manager.agent_manager.update_assistant(
                        assistant=old_assistant,
                        data=changes,
                    )
                await new_tool_processor.process(old_tools, new_tools)
                await new_data_processor.process(old_data, new_data)

        elif old_type and not new_type:
            await old_tool_processor.process(old_tools, [])
            await old_data_processor.process(old_data, {})

            await self.api_manager.agent_manager.delete_assistant(
                assistant=old_assistant,
            )
        elif new_type and not old_type:
            new_agent = await self.api_manager.agent_manager.add_assistant(
                new_assistant,
                workflow_step_order,
            )

            await new_tool_processor.process([], new_tools)
            await new_data_processor.process({}, new_data)

        return new_agent

    async def process_assistants(self, old_config, new_config):
        old_assistants = old_config.get("workflows", [])
        new_assistants = new_config.get("workflows", [])

        workflow_step_order = 0
        for old_assistant_obj, new_assistant_obj in zip_longest(
            old_assistants, new_assistants, fillvalue={}
        ):
            await self.process_assistant(
                old_assistant_obj,
                new_assistant_obj,
                workflow_step_order,
            )
            workflow_step_order += 1
