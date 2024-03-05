from itertools import zip_longest

from app.api.workflow_configs.api.api_manager import ApiManager
from app.api.workflow_configs.data_transformer import DataTransformer
from app.api.workflow_configs.processors.processor import Processor
from app.api.workflow_configs.validator import SAMLValidator
from app.utils.helpers import compare_dicts, get_first_non_null_key


class AgentProcessor:
    def __init__(self, api_user, api_manager: ApiManager):
        self.api_user = api_user
        self.api_manager = api_manager

    async def process_assistant(
        self,
        old_assistant_obj: dict,
        new_assistant_obj: dict,
        workflow_step_order: int | None = None,
    ):
        new_agent = None

        old_assistant_type: str = get_first_non_null_key(old_assistant_obj)
        new_assistant_type: str = get_first_non_null_key(new_assistant_obj)

        old_assistant = old_assistant_obj.get(old_assistant_type) or {}
        new_assistant = new_assistant_obj.get(new_assistant_type) or {}

        old_data = old_assistant.get("data") or {}
        new_data = new_assistant.get("data") or {}

        old_superrags = old_assistant.get("superrag") or []
        new_superrags = new_assistant.get("superrag") or []

        old_tools = old_assistant.get("tools") or []
        new_tools = new_assistant.get("tools") or []

        old_saml_transformer = DataTransformer(
            self.api_user,
            self.api_manager,
            assistant=old_assistant,
            assistant_type=old_assistant_type,
            tools=old_tools,
            superrags=old_superrags,
        )
        new_saml_transformer = DataTransformer(
            self.api_user,
            self.api_manager,
            assistant=new_assistant,
            assistant_type=new_assistant_type,
            tools=new_tools,
            superrags=new_superrags,
        )
        await old_saml_transformer.transform()
        await new_saml_transformer.transform()

        # this is needed because type can be changed in data transformer
        old_assistant_type = old_assistant.get("type")
        new_assistant_type = new_assistant.get("type")

        if old_assistant:
            old_tool_processor = Processor(
                self.api_user,
                self.api_manager,
            ).get_tool_processor(old_assistant)
            old_data_processor = Processor(
                self.api_user, self.api_manager
            ).get_data_processor(old_assistant)
            old_superrag_processor = Processor(
                self.api_user, self.api_manager
            ).get_superrag_processor(old_assistant)

        if new_assistant:
            new_tool_processor = Processor(
                self.api_user, self.api_manager
            ).get_tool_processor(new_assistant)

            new_data_processor = Processor(
                self.api_user, self.api_manager
            ).get_data_processor(new_assistant)

            new_superrag_processor = Processor(
                self.api_user, self.api_manager
            ).get_superrag_processor(old_assistant)

        if old_assistant_type and new_assistant_type:
            if old_assistant_type != new_assistant_type:
                # order matters here as we need process
                # old data and tools first before deleting the assistant
                await old_data_processor.process(old_data, {})
                await old_tool_processor.process(old_tools, [])
                await old_superrag_processor.process(old_superrags, [])

                await self.api_manager.agent_manager.delete_assistant(
                    assistant=old_assistant,
                )
                await self.api_manager.agent_manager.add_assistant(
                    new_assistant,
                    workflow_step_order,
                )
                # all tools and data should be re-created
                await new_tool_processor.process([], new_tools)
                await new_data_processor.process({}, new_data)
                await new_superrag_processor.process([], new_superrags)

            else:
                changes = compare_dicts(old_assistant, new_assistant)
                if changes:
                    await self.api_manager.agent_manager.update_assistant(
                        assistant=old_assistant,
                        data=changes,
                    )

                print("old_tools", old_tools)
                print("new_tools", new_tools)
                await new_tool_processor.process(old_tools, new_tools)
                await new_data_processor.process(old_data, new_data)
                await new_superrag_processor.process(old_superrags, new_superrags)

        elif old_assistant_type and not new_assistant_type:
            await old_tool_processor.process(old_tools, [])
            await old_data_processor.process(old_data, {})
            await old_superrag_processor.process(old_superrags, {})

            await self.api_manager.agent_manager.delete_assistant(
                assistant=old_assistant,
            )
        elif new_assistant_type and not old_assistant_type:
            new_agent = await self.api_manager.agent_manager.add_assistant(
                new_assistant,
                workflow_step_order,
            )

            await new_tool_processor.process([], new_tools)
            await new_data_processor.process({}, new_data)
            await new_superrag_processor.process([], new_superrags)

        return new_agent

    async def process_assistants(self, old_config, new_config):
        validator = SAMLValidator(new_config, self.api_user)
        await validator.validate()

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
