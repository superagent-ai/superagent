from typing import Any, List, Dict

from litellm import acompletion
from app.agents.base import AgentBase
from app.memory.base import Memory
from decouple import config
from slugify import slugify
from prisma.models import Agent, AgentDatasource, AgentLLM, AgentTool
from app.datasource.types import (
    VALID_UNSTRUCTURED_DATA_TYPES,
)
from app.tools.prompts import (
    create_function_calling_prompt,
    create_function_response_prompt,
)
from app.tools.chitchat import ChitChatTool
from app.tools.runner import ToolRunner


class Completion:
    def __init__(self, prompt: str, llm: str, memory: str, tools: List[str]):
        self.prompt = prompt
        self.llm = llm
        self.memory = memory
        self.tools = tools

    async def _run_completion(
        self,
        prompt: str,
        model: str = "replicate/mistral-7b-instruct-v0.1:83b6a56e7c828e667f21fd596c338fd4f0039b46bcfa18d973e8e70e455fda70",
        temperature: int = 0.5,
        max_tokens: int = 1024,
    ):
        print(model)
        messages = [{"content": prompt, "role": "user"}]
        response = await acompletion(
            temperature=temperature,
            max_tokens=max_tokens,
            model=model,
            messages=messages,
        )
        print(f"Invoking LLM: {response['usage']['total_tokens']} tokens used")
        return response

    async def acall(self, *args, **kwargs):
        input = kwargs["inputs"]["input"]
        prompt = create_function_calling_prompt(input=input, tools=[ChitChatTool])
        response = await self._run_completion(prompt)
        runner = ToolRunner(response["choices"][0]["message"]["content"])
        prediction = await runner.run()

        if prediction["type"] == "function_call":
            prompt = create_function_response_prompt(
                input=input, context=prediction["content"]
            )
            print(prompt)
            response = await self._run_completion(prompt)
            return response["choices"][0]["message"]["content"]
        else:
            return prediction["content"]


class SuperagentAgent(AgentBase):
    async def _get_tools(
        self, agent_datasources: List[AgentDatasource], agent_tools: List[AgentTool]
    ) -> List:
        tools = [ChitChatTool]
        return tools

    async def _get_llm(self, agent_llm: AgentLLM, model: str) -> Any:
        # Implement the method specific to the Open Source LLM Agent
        pass

    async def _get_prompt(self, agent: Agent) -> str:
        # Implement the method specific to the Open Source LLM Agent
        pass

    async def _get_memory(self) -> List:
        memory = Memory(
            session_id=f"{self.agent_id}-{self.session_id}"
            if self.session_id
            else f"{self.agent_id}",
            url=config("MEMORY_API_URL"),
        )
        chat_memory = await memory.init()
        return chat_memory

    async def _run_completion(self) -> Dict:
        pass

    async def arun(self) -> None:
        pass

    async def get_agent(self, config: Agent) -> Any:
        memory = await self._get_memory()
        tools = await self._get_tools(
            agent_datasources=config.datasources, agent_tools=config.tools
        )
        prompt = await self._get_prompt(agent=config)
        return Completion(memory=memory, prompt=prompt, tools=tools, llm="")
