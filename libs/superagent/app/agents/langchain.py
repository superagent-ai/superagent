import datetime
import json
import litellm

from typing import Any, List

from decouple import config
from langchain.agents import AgentType, initialize_agent
from langchain.chains import LLMChain
from langchain.chat_models import AzureChatOpenAI, ChatOpenAI
from langchain.memory.motorhead_memory import MotorheadMemory
from langchain.prompts import MessagesPlaceholder, PromptTemplate
from langchain.schema import SystemMessage
from slugify import slugify

from app.agents.base import AgentBase
from app.datasource.types import (
    VALID_UNSTRUCTURED_DATA_TYPES,
)
from app.models.tools import DatasourceInput
from app.tools import TOOL_TYPE_MAPPING, create_pydantic_model_from_object, create_tool
from app.tools.datasource import DatasourceTool, StructuredDatasourceTool
from app.utils.llm import LLM_MAPPING
from prisma.models import Agent, AgentDatasource, AgentLLM, AgentTool
from langchain.tools import format_tool_to_openai_function


DEFAULT_PROMPT = (
    "You are a helpful AI Assistant, anwer the users questions to "
    "the best of your ability."
)


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
        tools = {}
        for agent_datasource in agent_datasources:
            tool_type = (
                DatasourceTool
                if agent_datasource.datasource.type in VALID_UNSTRUCTURED_DATA_TYPES
                else StructuredDatasourceTool
            )
            metadata = (
                {
                    "datasource_id": agent_datasource.datasource.id,
                    "query_type": "document",
                }
                if tool_type == DatasourceTool
                else {"datasource": agent_datasource.datasource}
            )
            tool = tool_type(
                metadata=metadata,
                args_schema=DatasourceInput,
                name=slugify(agent_datasource.datasource.name),
                description=agent_datasource.datasource.description,
                return_direct=False,
            )
            tools[agent_datasource.datasource.id] = tool
            # tools.append(tool)
        for agent_tool in agent_tools:
            tool_info = TOOL_TYPE_MAPPING.get(agent_tool.tool.type)
            if agent_tool.tool.type == "FUNCTION":
                metadata = recursive_json_loads(agent_tool.tool.metadata)
                args = metadata.get("args", {})
                PydanticModel = create_pydantic_model_from_object(args)
                tool = create_tool(
                    tool_class=tool_info["class"],
                    name=metadata.get("functionName"),
                    description=agent_tool.tool.description,
                    metadata=agent_tool.tool.metadata,
                    args_schema=PydanticModel,
                    return_direct=agent_tool.tool.returnDirect,
                )
            else:
                tool = create_tool(
                    tool_class=tool_info["class"],
                    name=slugify(agent_tool.tool.name),
                    description=agent_tool.tool.description,
                    metadata=agent_tool.tool.metadata,
                    args_schema=tool_info["schema"],
                    session_id=f"{self.agent_id}-{self.session_id}"
                    if self.session_id
                    else f"{self.agent_id}",
                    return_direct=agent_tool.tool.returnDirect,
                )
            tools[agent_tool.tool.type] = tool
        return tools

    async def _get_llm(self, agent_llm: AgentLLM, model: str) -> Any:
        if agent_llm.llm.provider == "OPENAI":
            return ChatOpenAI(
                model=LLM_MAPPING[model],
                openai_api_key=agent_llm.llm.apiKey,
                temperature=0,
                streaming=self.enable_streaming,
                callbacks=[self.callback] if self.enable_streaming else [],
                **(agent_llm.llm.options if agent_llm.llm.options else {}),
            )
        if agent_llm.llm.provider == "AZURE_OPENAI":
            return AzureChatOpenAI(
                openai_api_key=agent_llm.llm.apiKey,
                temperature=0,
                streaming=self.enable_streaming,
                callbacks=[self.callback] if self.enable_streaming else [],
                **(agent_llm.llm.options if agent_llm.llm.options else {}),
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
        return content

    async def _get_memory(self) -> List:
        memory = MotorheadMemory(
            session_id=f"{self.agent_id}-{self.session_id}"
            if self.session_id
            else f"{self.agent_id}",
            memory_key="chat_history",
            url=config("MEMORY_API_URL"),
            return_messages=True,
            output_key="output",
        )
        await memory.init()
        return memory

    async def get_agent(self, config: Agent):
        llm = await self._get_llm(agent_llm=config.llms[0], model=config.llmModel)
        tools = await self._get_tools(
            agent_datasources=config.datasources, agent_tools=config.tools
        )
        prompt = await self._get_prompt(agent=config)
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
                f"{config.prompt.replace('{', '{{').replace('}', '}}')}"
                if config.prompt
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

    async def _get_functions(self, tools) -> List:
        functions = []
        # get the functions from tools object
        for name, tool in tools.items():
            functions.append(
                    {    
                    "type": "function",
                    "function": {
                        **format_tool_to_openai_function(tool) ,
                        "name": name,
                    }
                    }
                )

        return functions
    
       

    async def get_agent_litellm(self, config: Agent, input: str = None):
        llm = await self._get_llm(agent_llm=config.llms[0], model=config.llmModel)
        tools = await self._get_tools(
            agent_datasources=config.datasources, agent_tools=config.tools
        )
        functions = await self._get_functions(tools)
        prompt = await self._get_prompt(agent=config)
        memory = await self._get_memory()

        messages = [
                {"role": "system", "content": prompt},
                {
                    "role": "user",
                    "content": input,
                },
            ]

        response = await litellm.acompletion(
            model="gpt-3.5-turbo", 
            messages=messages,
            tools=functions,
        )

        response_message = response.choices[0].message

        tool_calls = response_message.tool_calls


        # check if the model wanted to call a function
        if tool_calls:
            messages.append(response_message)  # extend conversation with assistant's reply

            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)
                function_to_call = tools[function_name]
                function_response = await function_to_call._arun(**function_args)
                messages.append(
                    {
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": function_response,
                    }
                )  # extend conversation with function response
            

            response = litellm.acreate(
                    model="gpt-3.5-turbo-1106",
                    messages=messages,
                    stream=self.enable_streaming,
            )  # get a new response from the model where it can see the function response
        def run():
            if self.enable_streaming:
                return response
            return response

        return run

        # if self.enable_streaming:
        #     return response 

        

        # return response["choices"][0]["message"]["content"]
     