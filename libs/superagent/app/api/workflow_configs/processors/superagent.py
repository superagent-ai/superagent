import logging
from itertools import zip_longest

from app.api.workflow_configs.api.api_agent_tool_manager import (
    ApiAgentToolManager,
)
from app.api.workflow_configs.api.api_datasource_manager import ApiDatasourceManager
from app.api.workflow_configs.api.api_datasource_superrag_manager import (
    ApiDatasourceSuperRagManager,
)
from app.api.workflow_configs.api.api_manager import ApiManager
from app.api.workflow_configs.api.base import BaseApiDatasourceManager
from app.api.workflow_configs.processors.base import BaseProcessor
from app.utils.helpers import (
    compare_dicts,
)

from .utils import (
    check_is_agent_tool,
    get_first_key,
)

logger = logging.getLogger(__name__)


class SuperagentDataProcessor(BaseProcessor):
    async def _process_datasource(
        self,
        old_datasource,
        new_datasource,
        old_datasource_manager: BaseApiDatasourceManager,
        new_datasource_manager: BaseApiDatasourceManager,
    ):
        old_datasource_name = old_datasource.get("name")
        new_datasource_name = new_datasource.get("name")

        if old_datasource_name and new_datasource_name:
            changes = compare_dicts(old_datasource, new_datasource)
            if changes:
                await old_datasource_manager.delete_datasource(
                    self.assistant,
                    old_datasource,
                )
                await new_datasource_manager.add_datasource(
                    self.assistant,
                    new_datasource,
                )

        elif old_datasource_name and not new_datasource_name:
            await old_datasource_manager.delete_datasource(
                self.assistant,
                old_datasource,
            )
        elif new_datasource_name and not old_datasource_name:
            await new_datasource_manager.add_datasource(
                self.assistant,
                new_datasource,
            )

    def _get_datasource_manager(self, flags: dict | None):
        flags = flags or {}
        if flags.get("superrag") is True:
            logger.info(
                "Processing datasource using Super RAG",
            )
            return ApiDatasourceSuperRagManager(
                self.api_manager.api_user,
                self.api_manager.agent_manager,
            )
        else:
            logger.info(
                "Processing datasource using Naive RAG",
            )
            return ApiDatasourceManager(
                self.api_manager.api_user,
                self.api_manager.agent_manager,
            )

    async def process(self, old_data, new_data):
        old_data = old_data or {}
        new_data = new_data or {}

        old_items = old_data.items()
        new_items = new_data.items()

        for old_item, new_item in zip_longest(old_items, new_items):
            _, old_datasource = old_item or (None, {})
            _, new_datasource = new_item or (None, {})

            new_datasource_manager = self._get_datasource_manager(
                new_datasource.get("flags")
            )
            old_datasource_manager = self._get_datasource_manager(
                old_datasource.get("flags")
            )

            await self._process_datasource(
                old_datasource=old_datasource,
                new_datasource=new_datasource,
                old_datasource_manager=old_datasource_manager,
                new_datasource_manager=new_datasource_manager,
            )


class SuperagentToolProcessor(BaseProcessor):
    async def process(self, old_tools, new_tools):
        for old_tool_obj, new_tool_obj in zip_longest(
            old_tools, new_tools, fillvalue={}
        ):
            old_tool = old_tool_obj.get(get_first_key(old_tool_obj), {})
            new_tool = new_tool_obj.get(get_first_key(new_tool_obj), {})

            old_tool_type = old_tool.get("type")
            new_tool_type = new_tool.get("type")

            if check_is_agent_tool(new_tool_type) or check_is_agent_tool(old_tool_type):
                from .agent_processor import AgentProcessor

                parent_agent = await self.api_manager.agent_manager.get_assistant(
                    self.assistant
                )
                agent_tool_manager = ApiAgentToolManager(
                    parent_agent, self.api_manager.api_user
                )
                new_api_manager = ApiManager(
                    self.api_manager.api_user, agent_tool_manager
                )
                agent_processor = AgentProcessor(
                    self.api_manager.api_user,
                    new_api_manager,
                )

            if old_tool_type and new_tool_type:
                if old_tool_type != new_tool_type:
                    if not check_is_agent_tool(old_tool_type):
                        await self.api_manager.delete_tool(
                            tool=old_tool,
                            assistant=self.assistant,
                        )

                    if not check_is_agent_tool(new_tool_type):
                        await self.api_manager.add_tool(
                            assistant=self.assistant,
                            data=new_tool,
                        )

                    if check_is_agent_tool(new_tool_type):
                        await agent_processor.process_assistant(
                            {},
                            {
                                new_tool_type: new_tool,
                            },
                        )
                else:
                    if check_is_agent_tool(new_tool_type):
                        await agent_processor.process_assistant(
                            {
                                old_tool_type: old_tool,
                            },
                            {
                                new_tool_type: new_tool,
                            },
                        )
                    else:
                        changes = compare_dicts(old_tool, new_tool)
                        if changes:
                            await self.api_manager.update_tool(
                                assistant=self.assistant,
                                tool=old_tool,
                                data=changes,
                            )

            elif old_tool_type and not new_tool_type:
                if check_is_agent_tool(old_tool_type):
                    await agent_processor.process_assistant(
                        {
                            old_tool_type: old_tool,
                        },
                        {},
                    )
                else:
                    await self.api_manager.delete_tool(
                        tool=old_tool,
                        assistant=self.assistant,
                    )

            elif new_tool_type and not old_tool_type:
                if check_is_agent_tool(new_tool_type):
                    await agent_processor.process_assistant(
                        {
                            old_tool_type: old_tool,
                        },
                        {
                            new_tool_type: new_tool,
                        },
                    )
                else:
                    await self.api_manager.add_tool(
                        assistant=self.assistant, data=new_tool
                    )
