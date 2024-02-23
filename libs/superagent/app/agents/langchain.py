import datetime
import json
import re
from typing import Any, List

from decouple import config
from langchain.agents import AgentType, initialize_agent
from langchain.chains import LLMChain
from langchain.memory import (
    ConversationBufferWindowMemory,
    MotorheadMemory,
    RedisChatMessageHistory,
)
from langchain.prompts import MessagesPlaceholder, PromptTemplate
from langchain.schema import SystemMessage
from langchain_openai import AzureChatOpenAI, ChatOpenAI
from slugify import slugify

from app.agents.base import AgentBase
from app.datasource.types import (
    VALID_UNSTRUCTURED_DATA_TYPES,
)
from app.models.tools import DatasourceInput
from app.tools import TOOL_TYPE_MAPPING, create_pydantic_model_from_object, create_tool
from app.tools.datasource import DatasourceTool, StructuredDatasourceTool
from app.utils.llm import LLM_MAPPING
from prisma.models import LLM, Agent, AgentDatasource, AgentTool

DEFAULT_PROMPT = (
    "You are a helpful AI Assistant, answer the users questions to "
    "the best of your ability."
)


def conform_function_name(url):
    """
    Validates OpenAI function names and modifies them to conform to the regex
    """
    regex_pattern = r"^[a-zA-Z0-9_-]{1,64}$"

    # Check if the URL matches the regex
    if re.match(regex_pattern, url):
        return url  # URL is already valid
    else:
        # Modify the URL to conform to the regex
        valid_url = re.sub(r"[^a-zA-Z0-9_-]", "", url)[:64]
        return valid_url


def recursive_json_loads(data):
    if isinstance(data, str):
        try:
            data = json.loads(data)
        except json.JSONDecodeError:
            return data
    if isinstance(data, dict):
        return {k: recursive_json_loads(v) for k, v in data.items()}
    if isinstance(data, list):
        return [recursive_json_loads(v) for v in data]
    return data


class LangchainAgent(AgentBase):
    async def _get_tools(
        self,
        agent_datasources: List[AgentDatasource],
        agent_tools: List[AgentTool],
    ) -> List:
        tools = []
        for agent_datasource in agent_datasources:
            tool_type = (
                DatasourceTool
                if agent_datasource.datasource.type in VALID_UNSTRUCTURED_DATA_TYPES
                else StructuredDatasourceTool
            )

            metadata = (
                {
                    "datasource_id": agent_datasource.datasource.id,
                    "options": (
                        agent_datasource.datasource.vectorDb.options
                        if agent_datasource.datasource.vectorDb
                        else {}
                    ),
                    "provider": (
                        agent_datasource.datasource.vectorDb.provider
                        if agent_datasource.datasource.vectorDb
                        else None
                    ),
                    "query_type": "document",
                }
                if tool_type == DatasourceTool
                else {"datasource": agent_datasource.datasource}
            )
            tool = tool_type(
                metadata=metadata,
                args_schema=DatasourceInput,
                name=conform_function_name(slugify(agent_datasource.datasource.name)),
                description=agent_datasource.datasource.description,
                return_direct=False,
            )
            tools.append(tool)
        for agent_tool in agent_tools:
            agent_tool_metadata = json.loads(agent_tool.tool.metadata or "{}")

            # user id is added to the metadata for superrag tool
            agent_tool_metadata = {
                "user_id": self.agent_config.apiUserId,
                **agent_tool_metadata,
            }

            tool_info = TOOL_TYPE_MAPPING.get(agent_tool.tool.type)
            if agent_tool.tool.type == "FUNCTION":
                metadata = recursive_json_loads(agent_tool_metadata)
                args = metadata.get("args", {})
                PydanticModel = create_pydantic_model_from_object(args)
                tool = create_tool(
                    tool_class=tool_info["class"],
                    name=conform_function_name(
                        slugify(metadata.get("functionName", agent_tool.tool.name))
                    ),
                    description=agent_tool.tool.description,
                    metadata=metadata,
                    args_schema=PydanticModel,
                    return_direct=agent_tool.tool.returnDirect,
                )
            else:
                metadata = agent_tool_metadata
                tool = create_tool(
                    tool_class=tool_info["class"],
                    name=conform_function_name(slugify(agent_tool.tool.name)),
                    description=agent_tool.tool.description,
                    metadata=metadata,
                    args_schema=tool_info["schema"],
                    session_id=(
                        f"{self.agent_id}-{self.session_id}"
                        if self.session_id
                        else f"{self.agent_id}"
                    ),
                    return_direct=agent_tool.tool.returnDirect,
                )
            tools.append(tool)
        return tools

    async def _get_llm(self, llm: LLM, model: str) -> Any:
        llm_params = {
            "temperature": 0,
            **(self.llm_params.dict() if self.llm_params else {}),
        }

        if llm.provider == "OPENAI":
            return ChatOpenAI(
                model=LLM_MAPPING[model],
                openai_api_key=llm.apiKey,
                streaming=self.enable_streaming,
                callbacks=self.callbacks,
                **(llm.options if llm.options else {}),
                **(llm_params),
            )
        elif llm.provider == "AZURE_OPENAI":
            return AzureChatOpenAI(
                api_key=llm.apiKey,
                streaming=self.enable_streaming,
                callbacks=self.callbacks,
                **(llm.options if llm.options else {}),
                **(llm_params),
            )

    async def _get_prompt(self, agent: Agent) -> str:
        if self.output_schema:
            if agent.prompt:
                content = (
                    f"{agent.prompt}\n\n"
                    "Always answer using the below output schema. "
                    "No other characters allowed.\n\n"
                    "Here is the output schema:\n"
                    f"{self.output_schema}"
                    "\n\nCurrent date: "
                    f"{datetime.datetime.now().strftime('%Y-%m-%d')}"
                )
            else:
                content = (
                    f"{DEFAULT_PROMPT}\n\n"
                    "Always answer using the below output schema. "
                    "No other characters allowed.\n\n"
                    "Here is the output schema:\n"
                    f"{self.output_schema}"
                    "\n\nCurrent date: "
                    f"{datetime.datetime.now().strftime('%Y-%m-%d')}"
                )
        else:
            content = agent.prompt or DEFAULT_PROMPT
            content = f"{content}" f"\n\n{datetime.datetime.now().strftime('%Y-%m-%d')}"
        return SystemMessage(content=content)

    async def _get_memory(self) -> List:
        memory_type = config("MEMORY", "motorhead")
        if memory_type == "redis":
            memory = ConversationBufferWindowMemory(
                chat_memory=RedisChatMessageHistory(
                    session_id=(
                        f"{self.agent_id}-{self.session_id}"
                        if self.session_id
                        else f"{self.agent_id}"
                    ),
                    url=config("REDIS_MEMORY_URL", "redis://localhost:6379/0"),
                    key_prefix="superagent:",
                ),
                memory_key="chat_history",
                return_messages=True,
                output_key="output",
                k=config("REDIS_MEMORY_WINDOW", 10),
            )
        else:
            memory = MotorheadMemory(
                session_id=(
                    f"{self.agent_id}-{self.session_id}"
                    if self.session_id
                    else f"{self.agent_id}"
                ),
                memory_key="chat_history",
                url=config("MEMORY_API_URL"),
                return_messages=True,
                output_key="output",
            )
            await memory.init()
        return memory

    async def get_agent(self):
        llm = await self._get_llm(
            llm=self.agent_config.llms[0].llm, model=self.agent_config.llmModel
        )
        tools = await self._get_tools(
            agent_datasources=self.agent_config.datasources,
            agent_tools=self.agent_config.tools,
        )
        prompt = await self._get_prompt(agent=self.agent_config)
        memory = await self._get_memory()

        if len(tools) > 0:
            agent = initialize_agent(
                tools,
                llm,
                agent=AgentType.OPENAI_FUNCTIONS,
                agent_kwargs={
                    "system_message": prompt,
                    "extra_prompt_messages": [
                        MessagesPlaceholder(variable_name="chat_history")
                    ],
                },
                memory=memory,
                return_intermediate_steps=True,
                verbose=True,
            )
            return agent
        else:
            prompt_base = (
                f"{self.agent_config.prompt.replace('{', '{{').replace('}', '}}')}"
                if self.agent_config.prompt
                else None
            )
            prompt_base = prompt_base or DEFAULT_PROMPT
            prompt_question = "Question: {input}"
            prompt_history = "History: \n {chat_history}"
            prompt = f"{prompt_base} \n {prompt_question} \n {prompt_history}"
            agent = LLMChain(
                llm=llm,
                memory=memory,
                output_key="output",
                verbose=True,
                prompt=PromptTemplate.from_template(prompt),
            )
        return agent
