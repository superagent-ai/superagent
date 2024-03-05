# flake8: noqa
from litellm.exceptions import NotFoundError as LiteLLMNotFoundError

from app.utils.helpers import get_first_non_null_key
from app.utils.llm import get_llm_provider
from app.utils.prisma import prisma


class RepeatedNameError(Exception):
    pass


class UnknownLLMProvider(Exception):
    pass


class SAMLValidator:
    def __init__(self, config, api_user):
        self.config = config
        self.api_user = api_user

    async def validate(self):
        self.validate_assistant_names()
        self.validate_tool_names()
        self.validate_superrag_names()
        await self.validate_llm_provider_has_set()

    def validate_assistant_names(self):
        assistants = self.config.get("workflows") or []
        assistant_names = []

        for new_assistant in assistants:
            assistant_type = get_first_non_null_key(new_assistant)
            assistant_name = new_assistant.get(assistant_type).get("name")

            if assistant_name in assistant_names:
                raise RepeatedNameError(
                    f"Assistant name '{assistant_name}' is repeated in the SAML,"
                    f"please use unique names for each assistant."
                )
            assistant_names.append(assistant_name)

    def validate_tool_names(self):
        assistants = self.config.get("workflows") or []

        for new_assistant in assistants:
            assistant_type = get_first_non_null_key(new_assistant)
            assistant = new_assistant.get(assistant_type)

            tools = assistant.get("tools") or []
            tool_names = []

            for tool in tools:
                tool_type = get_first_non_null_key(tool)
                tool_name = tool.get(tool_type).get("name")

                if tool_name in tool_names:
                    raise RepeatedNameError(
                        f"Tool name '{tool_name}' is repeated in the SAML,"
                        f"please use unique names for each tool."
                    )
                tool_names.append(tool_name)

    def validate_superrag_names(self):
        assistants = self.config.get("workflows") or []

        for new_assistant in assistants:
            assistant_type = get_first_non_null_key(new_assistant)
            assistant = new_assistant.get(assistant_type)

            superrag = assistant.get("superrag") or []
            superrag_names = []

            for superrag_data in superrag:
                node_type = get_first_non_null_key(superrag_data)
                superrag_name = superrag_data.get(node_type).get("name")

                if superrag_name in superrag_names:
                    raise RepeatedNameError(
                        f"Superrag name '{superrag_name}' is repeated in the SAML,"
                        f"please use unique names for each superrag."
                    )
                superrag_names.append(superrag_name)

    async def validate_llm_provider_has_set(self):
        assistants = self.config.get("workflows") or []

        for assistant in assistants:
            assistant_type = get_first_non_null_key(assistant)
            llm_model = assistant[assistant_type]["llm"]

            try:
                provider = get_llm_provider(llm_model)
            except LiteLLMNotFoundError:
                raise UnknownLLMProvider(
                    f"Could not find provider for LLM model {llm_model}. "
                    "Please ensure that the model is supported."
                )

            llm_provider = await prisma.llm.find_first(
                where={"provider": provider, "apiUserId": self.api_user.id}
            )

            if not llm_provider:
                raise UnknownLLMProvider(
                    f"Please configure LLM Provider - {provider.capitalize()} in the integrations page."
                )
