from itertools import zip_longest

from app.api.agents import OpenAIAssistantSdk
from app.api.workflow_configs.processors.base import BaseProcessor
from app.api.workflow_configs.processors.utils import get_first_key
from app.utils.prisma import prisma
from prisma.enums import LLMProvider


class OpenaiDataProcessor(BaseProcessor):
    async def process(self, old_data, new_data):
        old_data = old_data or {}
        new_data = new_data or {}

        old_items = old_data.items()
        new_items = new_data.items()

        old_urls = []
        new_urls = []
        for old_item, new_item in zip_longest(old_items, new_items):
            _, old_datasource = old_item or (None, {})
            _, new_datasource = new_item or (None, {})

            old_files = old_datasource.get("files", [])
            new_files = new_datasource.get("files", [])

            old_urls.extend([file.get("url") for file in old_files])
            new_urls.extend([file.get("url") for file in new_files])

        if set(old_urls) != set(new_urls):
            agent = await self.api_manager.agent_manager.get_assistant(self.assistant)

            llm = await prisma.llm.find_first(
                where={
                    "provider": LLMProvider.OPENAI.value,
                    "apiUserId": self.api_manager.api_user.id,
                }
            )

            assistant_sdk = OpenAIAssistantSdk(llm)
            metadata = agent.metadata

            file_ids = metadata.get("file_ids", [])

            while len(file_ids) > 0:
                file_id = file_ids.pop()
                await assistant_sdk.delete_file(file_id)

            for url in new_urls:
                file = await assistant_sdk.upload_file(url)
                file_ids.append(file.id)

            metadata["file_ids"] = file_ids

            await self.api_manager.agent_manager.update_assistant(
                assistant=self.assistant,
                data={
                    "metadata": metadata,
                },
            )


class OpenaiToolProcessor(BaseProcessor):
    async def process(self, old_tools, new_tools):
        if old_tools != new_tools:
            agent = await self.api_manager.agent_manager.get_assistant(self.assistant)

            metadata = agent.metadata

            tool_types = [
                {
                    "type": get_first_key(tool),
                }
                for tool in new_tools
            ]

            metadata["tools"] = tool_types

            await self.api_manager.agent_manager.update_assistant(
                assistant=self.assistant,
                data={
                    "metadata": metadata,
                },
            )
