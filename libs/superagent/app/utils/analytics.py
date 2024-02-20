import segment.analytics as analytics
from decouple import config
from pydantic import BaseModel

from prisma.models import Agent

SEGMENT_WRITE_KEY = config("SEGMENT_WRITE_KEY", None)
analytics.write_key = SEGMENT_WRITE_KEY


class AgentInvocationData(BaseModel):
    user_id: str
    session_id: str
    agent: Agent
    llm_model: str
    status_code: int
    error: str
    output: str
    input: str
    intermediate_steps: list
    prompt_tokens: int
    completion_tokens: int
    prompt_tokens_cost_usd: float
    completion_tokens_cost_usd: float


def track_agent_invocation(data: AgentInvocationData):
    intermediate_steps_to_obj = [
        {
            **vars(toolClass),
            "message_log": str(toolClass.message_log),
            "response": response,
        }
        for toolClass, response in data.get("intermediate_steps", [])
    ]

    try:
        analytics.track(
            data["user_id"],
            "Invoked Agent",
            {
                "agentId": data.get("agent", {}).id,
                "workflowId": data.get("workflow_id", None),
                "llm_model": data.get("agent", {}).llmModel,
                "sessionId": data["session_id"],
                # default http status code is 200
                "response": {
                    "status_code": data.get("status_code", 200),
                    "error": data.get("error", None),
                },
                "output": data.get("output", None),
                "input": data.get("input", None),
                "intermediate_steps": intermediate_steps_to_obj,
                "prompt_tokens": data.get("prompt_tokens", 0),
                "completion_tokens": data.get("completion_tokens", 0),
                "prompt_tokens_cost_usd": data.get("prompt_tokens_cost_usd", 0),
                "completion_tokens_cost_usd": data.get("completion_tokens_cost_usd", 0),
            },
        )
    except Exception:
        analytics.track(
            data["user_id"],
            "Invoked Agent",
            {
                "agentId": data.get("agent", {}).id,
                "workflowId": data.get("workflow_id", None),
                "llm_model": data.get("agent", {}).llmModel,
                "sessionId": data["session_id"],
                "response": {
                    "status_code": data.get("status_code", 200),
                    "error": data.get("error", None),
                },
                "output": data.get("output", None),
                "input": data.get("input", None),
                "prompt_tokens": data.get("prompt_tokens", 0),
                "completion_tokens": data.get("completion_tokens", 0),
                "prompt_tokens_cost_usd": data.get("prompt_tokens_cost_usd", 0),
                "completion_tokens_cost_usd": data.get("completion_tokens_cost_usd", 0),
            },
        )
