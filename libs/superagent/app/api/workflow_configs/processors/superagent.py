import logging
from itertools import zip_longest

from app.api.workflow_configs.api.api_agent_tool_manager import (
    ApiAgentToolManager,
)
from app.api.workflow_configs.api.api_datasource_superrag_manager import (
    ApiDatasourceSuperRagManager,
)
from app.api.workflow_configs.api.api_manager import ApiManager
from app.api.workflow_configs.processors.base import BaseProcessor
from app.utils.helpers import (
    MIME_TYPE_TO_EXTENSION,
    compare_dicts,
    get_first_non_null_key,
    get_mimetype_from_url,
)

from .utils import (
    check_is_agent_tool,
)

logger = logging.getLogger(__name__)


class SuperragDataProcessor(BaseProcessor):
    async def process(self, old_data, new_data):
        datasource_manager = ApiDatasourceSuperRagManager(
            self.api_user, self.api_manager.agent_manager
        )
        for old_obj, new_obj in zip_longest(old_data, new_data, fillvalue={}):
            old_node_name = get_first_non_null_key(old_obj)
            new_node_name = get_first_non_null_key(new_obj)

            old_datasource = old_obj.get(old_node_name, {})
            new_datasource = new_obj.get(new_node_name, {})

            old_datasource_name = old_datasource.get("name")
            new_datasource_name = new_datasource.get("name")

            if old_datasource_name and new_datasource_name:
                is_changed = compare_dicts(old_datasource, new_datasource)

                if is_changed:
                    await datasource_manager.delete_datasource(
                        self.assistant,
                        old_datasource,
                    )
                    await datasource_manager.add_datasource(
                        self.assistant,
                        new_datasource,
                    )

            elif old_datasource_name and not new_datasource_name:
                await datasource_manager.delete_datasource(
                    self.assistant,
                    old_datasource,
                )
            elif new_datasource_name and not old_datasource_name:
                await datasource_manager.add_datasource(
                    self.assistant,
                    new_datasource,
                )


class SuperagentDataProcessor(BaseProcessor):
    async def process(self, old_data, new_data):
        old_urls = old_data.get("urls") or []
        new_urls = new_data.get("urls") or []

        # Process data URLs changes
        for url in set(old_urls) | set(new_urls):
            type = get_mimetype_from_url(url)

            use_for = new_data.get("use_for") or old_data.get("use_for") or ""

            datasource_name = f"{MIME_TYPE_TO_EXTENSION[type]} doc {use_for}"

            if url in old_urls and url not in new_urls:
                # TODO: find a better way to deciding which datasource to delete
                await self.api_manager.delete_datasource(
                    assistant=self.assistant,
                    datasource={
                        "name": datasource_name,
                    },
                )

            elif url in new_urls and url not in old_urls:
                if type in MIME_TYPE_TO_EXTENSION:
                    await self.api_manager.add_datasource(
                        self.assistant,
                        data={
                            # TODO: this will be changed once we implement superrag
                            "name": datasource_name,
                            "description": new_data.get("use_for"),
                            "url": url,
                            "type": MIME_TYPE_TO_EXTENSION[type],
                        },
                    )


class SuperagentToolProcessor(BaseProcessor):
    async def process(self, old_tools, new_tools):
        for old_tool_obj, new_tool_obj in zip_longest(
            old_tools, new_tools, fillvalue={}
        ):
            old_tool = old_tool_obj.get(get_first_non_null_key(old_tool_obj), {})
            new_tool = new_tool_obj.get(get_first_non_null_key(new_tool_obj), {})

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
