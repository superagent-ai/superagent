import asyncio
from typing import Any, List

from app.agents.base import AgentBase
from app.utils.streaming import (
    CustomAsyncIteratorCallbackHandler,
    get_intermediate_steps_event,
)
from prisma.models import Workflow


class WorkflowBase:
    def __init__(
        self,
        workflow: Workflow,
        callbacks: List[CustomAsyncIteratorCallbackHandler],
        session_id: str,
    ):
        self.workflow = workflow
        self.session_id = session_id
        self.callbacks = callbacks

    async def astream(self, input: Any):
        self.workflow.steps.sort(key=lambda x: x.order)
        previous_output = input
        stepIndex = 0

        for step in self.workflow.steps:
            can_stream, agent = await AgentBase(
                agent_id=step.agentId,
                enable_streaming=True,
                session_id=self.session_id,
            ).get_agent()
            agent_name = self.workflow.steps[stepIndex].agent.name
            current_callback = self.callbacks[stepIndex]

            task = asyncio.ensure_future(
                agent.acall(
                    inputs={"input": previous_output},
                    callbacks=[current_callback],
                )
            )

            # streaming the agent token-by-token if streaming is supported
            if can_stream:
                async for token in current_callback.aiter():
                    yield f"id: {agent_name}\ndata: {token} \n\n"

            await task
            result = task.result()
            # if agent can't stream, we are streaming the parsed output
            # for example we need to parse the outpuf of ReActAgent response
            # https://api.python.langchain.com/en/latest/agents/langchain.agents.react.output_parser.ReActOutputParser.html
            if not can_stream:
                out: str = result.get("output")
                for token in out.split(" "):
                    yield f"id: {agent_name}\ndata: {token} \n\n"

            # streaming the intermediate steps
            intermediate_steps = get_intermediate_steps_event(result)
            if intermediate_steps:
                for step in intermediate_steps:
                    yield step

            current_callback.done.set()
            stepIndex += 1

    async def arun(self, input: Any):
        self.workflow.steps.sort(key=lambda x: x.order)
        previous_output = input
        steps_output = {}
        stepIndex = 0

        for step in self.workflow.steps:
            _, agent = await AgentBase(
                agent_id=step.agentId,
                session_id=self.session_id,
            ).get_agent()

            agent_response = await agent.acall(
                inputs={"input": previous_output},
            )

            previous_output = agent_response.get("output")
            steps_output[step.order] = agent_response

            stepIndex += 1
        # returning the all steps output and the final output
        return {"steps": steps_output, "output": previous_output}
