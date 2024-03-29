from typing import Any, List

from agentops.langchain_callback_handler import (
    AsyncCallbackHandler,
    LangchainCallbackHandler,
)
from langchain.output_parsers.json import SimpleJsonOutputParser

from app.agents.base import AgentBase
from app.utils.callbacks import CustomAsyncIteratorCallbackHandler

# Adapted from https://github.com/langchain-ai/langchain/blob/d1a2e194c376f241116bf8e520f1a9bb297cdf3a/libs/core/langchain_core/output_parsers/format_instructions.py
JSON_FORMAT_INSTRUCTIONS = """The output should be formatted as a JSON instance that conforms to the JSON schema below.

As an example, for the schema {{"properties": {{"foo": {{"title": "Foo", "description": "a list of strings", "type": "array", "items": {{"type": "string"}}}}}}, "required": ["foo"]}}
the object {{"foo": ["bar", "baz"]}} is a well-formatted instance of the schema. The object {{"properties": {{"foo": ["bar", "baz"]}}}} is not well-formatted.

Here is the output schema:
```
{schema}
```
"""


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
            agent_config = step["agent_data"]
            input = previous_output
            output_schema = step["output_schema"]
            agent_base = AgentBase(
                agent_id=agent_config.id,
                enable_streaming=self.enable_streaming,
                callbacks=self.constructor_callbacks,
                session_id=self.session_id,
                agent_config=agent_config,
                output_schema=output_schema,
            )

            agent = await agent_base.get_agent()

            agent_input = agent_base.get_input(
                input=input,
                agent_type=agent_config.type,
            )

            agent_response = await agent.ainvoke(
                input=agent_input,
                config={
                    "callbacks": self.callbacks[stepIndex],
                },
            )
            if output_schema:
                # TODO: throw error if output is not valid
                json_parser = SimpleJsonOutputParser()
                agent_response["output"] = json_parser.parse(
                    text=agent_response["output"]
                )

            previous_output = agent_response.get("output")
            steps_output.append(agent_response)

        return {"steps": steps_output, "output": previous_output}
