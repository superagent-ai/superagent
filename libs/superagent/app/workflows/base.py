import logging
from typing import Any, List

from agentops.langchain_callback_handler import (
    AsyncCallbackHandler,
    LangchainCallbackHandler,
)
from langchain.output_parsers.json import SimpleJsonOutputParser

from app.agents.base import AgentFactory
from app.utils.callbacks import CustomAsyncIteratorCallbackHandler

logger = logging.getLogger(__name__)


class WorkflowBase:
    def __init__(
        self,
        workflow_steps: list[Any],
        callbacks: List[CustomAsyncIteratorCallbackHandler],
        session_id: str,
        constructor_callbacks: List[
            AsyncCallbackHandler | LangchainCallbackHandler
        ] = None,
        enable_streaming: bool = False,
    ):
        self.workflow_steps = workflow_steps
        self.enable_streaming = enable_streaming
        self.session_id = session_id
        self.constructor_callbacks = constructor_callbacks
        self.callbacks = callbacks

    async def arun(self, input: Any):
        previous_output = input
        steps_output = []

        for stepIndex, step in enumerate(self.workflow_steps):
            agent_data = step["agent_data"]
            input = previous_output
            output_schema = step["output_schema"]
            agent_base = AgentFactory(
                enable_streaming=self.enable_streaming,
                callbacks=self.constructor_callbacks,
                session_id=self.session_id,
                agent_data=agent_data,
                output_schema=output_schema,
            )

            agent = await agent_base.get_agent()

            agent_response = await agent.ainvoke(
                input=input,
                config={
                    "callbacks": self.callbacks[stepIndex],
                },
            )
            if output_schema:
                # TODO: throw error if output is not valid
                parser = SimpleJsonOutputParser()
                try:
                    agent_response["output"] = parser.parse(
                        text=agent_response["output"]
                    )
                except Exception as e:
                    logger.error(f"Error parsing output: {e}")
                    agent_response["output"] = {}

            previous_output = agent_response.get("output")
            steps_output.append(agent_response)

        return {"steps": steps_output, "output": previous_output}
