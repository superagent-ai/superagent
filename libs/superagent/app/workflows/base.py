import logging
from dataclasses import dataclass
from typing import Any, List

from agentops.langchain_callback_handler import (
    AsyncCallbackHandler,
)
from langchain.output_parsers.json import SimpleJsonOutputParser

from app.agents.base import AgentFactory
from prisma.models import Agent

logger = logging.getLogger(__name__)


@dataclass
class WorkflowStep:
    agent_data: Agent
    output_schema: dict[str, str]
    callbacks: List[AsyncCallbackHandler]


class WorkflowBase:
    def __init__(
        self,
        workflow_steps: list[WorkflowStep],
        session_id: str,
        enable_streaming: bool = False,
    ):
        self.workflow_steps = workflow_steps
        self.enable_streaming = enable_streaming
        self.session_id = session_id

    async def arun(self, input: Any):
        previous_output = input
        steps_output = []

        for _, step in enumerate(self.workflow_steps):
            input = previous_output
            agent_base = AgentFactory(
                enable_streaming=self.enable_streaming,
                callbacks=step.callbacks,
                session_id=self.session_id,
                agent_data=step.agent_data,
                output_schema=step.output_schema,
            )

            agent = await agent_base.get_agent()

            agent_response = await agent.ainvoke(
                input=input,
                config={"callbacks": step.callbacks},
            )
            if step.output_schema:
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
