from app.api.agents import OpenAIAssistantSdk
from app.api.workflow_configs.processors.base import BaseProcessor
from app.utils.helpers import get_first_non_null_key
from app.utils.prisma import prisma


class OpenaiDataProcessor(BaseProcessor):
    async def process(self, old_data, new_data):
        old_urls = old_data.get("urls") or []
        new_urls = new_data.get("urls") or []

        if set(old_urls) != set(new_urls):
            agent = await self.api_manager.agent_manager.get_assistant(self.assistant)

            llm = await prisma.llm.find_first(
                where={
                    "provider": "OPENAI",
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
                    "type": get_first_non_null_key(tool),
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
