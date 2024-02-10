from itertools import zip_longest

from app.api.workflow_configs.api.api_agent_tool_manager import (
    ApiAgentToolManager,
)
from app.api.workflow_configs.api.api_manager import ApiManager
from app.api.workflow_configs.processors.base import BaseProcessor
from app.models.request import (
    Datasource as DatasourceRequest,
)
from app.models.request import (
    DatasourceUpdate as DatasourceUpdateRequest,
)
from app.models.request import (
    Tool as ToolRequest,
)
from app.models.request import (
    ToolUpdate as ToolUpdateRequest,
)
from app.utils.helpers import (
    MIME_TYPE_TO_EXTENSION,
    compare_dicts,
    get_mimetype_from_url,
)

from .utils import (
    check_is_agent_tool,
    get_first_key,
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
                    datasource=DatasourceUpdateRequest(name=datasource_name),
                )

            elif url in new_urls and url not in old_urls:
                if type in MIME_TYPE_TO_EXTENSION:
                    await self.api_manager.add_datasource(
                        self.assistant,
                        data=DatasourceRequest(
                            # TODO: this will be changed once we implement superrag
                            name=datasource_name,
                            description=new_data.get("use_for"),
                            url=url,
                            type=MIME_TYPE_TO_EXTENSION[type],
                        ),
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
                            tool=ToolRequest(**old_tool),
                            assistant=self.assistant,
                        )

                    if not check_is_agent_tool(new_tool_type):
                        await self.api_manager.add_tool(
                            assistant=self.assistant,
                            data=ToolRequest(
                                **new_tool,
                            ),
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
                                tool=ToolUpdateRequest(**old_tool),
                                data=ToolUpdateRequest(
                                    **changes,
                                ),
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
                        tool=ToolRequest(**old_tool),
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
                        assistant=self.assistant,
                        data=ToolRequest(
                            **new_tool,
                        ),
                    )
