import asyncio
import json
from queue import Queue
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security.api_key import APIKey
from starlette.responses import StreamingResponse

from app.lib.agents import Agent as AgentDefinition
from app.lib.auth.api import get_api_key
from app.lib.auth.prisma import JWTBearer, decodeJWT
from app.lib.models.agent import Agent, PredictAgent
from app.lib.prisma import prisma

router = APIRouter()


@router.post("/agents/", name="Create agent", description="Create a new agent")
async def create_agent(body: Agent, token=Depends(JWTBearer())):
    """Agents endpoint"""
    decoded = decodeJWT(token)

    try:
        agent = await prisma.agent.create(
            {
                "name": body.name,
                "type": body.type,
                "llm": json.dumps(body.llm),
                "hasMemory": body.has_memory,
                "userId": decoded["userId"],
            },
            include={"user": True},
        )

        return {"success": True, "data": agent}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )


@router.get("/agents/", name="List all agents", description="List all agents")
async def read_agents(token=Depends(JWTBearer())):
    """Agents endpoint"""
    decoded = decodeJWT(token)
    agents = await prisma.agent.find_many(
        where={"userId": decoded["userId"]}, include={"user": True}
    )

    if agents:
        return {"success": True, "data": agents}

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="No agents found",
    )


@router.get("/agents/{agentId}", name="Get agent", description="Get a specific agent")
async def read_agent(agentId: str, token=Depends(JWTBearer())):
    """Agent detail endpoint"""
    agent = await prisma.agent.find_unique(
        where={"id": agentId}, include={"user": True}
    )

    if agent:
        return {"success": True, "data": agent}

    raise HTTPException(
        status_code=status.HTTP_404_INTERNAL_SERVER_ERROR,
        detail=f"Agent with id: {agentId} not found",
    )


@router.delete(
    "/agents/{agentId}", name="Delete agent", description="Delete a specific agent"
)
async def delete_agent(agentId: str, token=Depends(JWTBearer())):
    """Deleta agent endpoint"""
    try:
        await prisma.agent.delete(where={"id": agentId})

        return {"success": True, "data": None}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_404_INTERNAL_SERVER_ERROR,
            detail=e,
        )


@router.post(
    "/agents/{agentId}/predict",
    name="Prompt agent",
    description="Invoke a specific agent",
)
async def run_agent(
    agentId: str, body: PredictAgent, api_key: APIKey = Depends(get_api_key)
):
    """Agent detail endpoint"""
    input = body.input
    has_streaming = body.has_streaming
    agent = await prisma.agent.find_unique(
        where={"id": agentId}, include={"user": True, "document": True}
    )

    await prisma.agentmemory.create(
        {
            "author": "HUMAN",
            "message": input.get("human_input", input.get("question", "")),
            "agentId": agentId,
        }
    )

    if agent:
        if has_streaming:

            async def on_llm_new_token(token) -> None:
                await data_queue.put(token)

            async def on_llm_end() -> None:
                await data_queue.put("[END]")

            async def on_chain_end(outputs: Dict[str, Any]) -> None:
                pass

            async def event_stream(data_queue: Queue) -> str:
                ai_message = ""
                while True:
                    data = await data_queue.get()
                    ai_message += data
                    if data == "[END]":
                        await prisma.agentmemory.create(
                            {"author": "AI", "message": ai_message, "agentId": agentId}
                        )
                        yield f"data: {data}\n\n"
                        break
                    yield f"data: {data}\n\n"

            async def conversation_run_thread(input: dict) -> None:
                agent_definition = AgentDefinition(
                    agent=agent,
                    has_streaming=has_streaming,
                    on_llm_new_token=on_llm_new_token,
                    on_llm_end=on_llm_end,
                    on_chain_end=on_chain_end,
                )
                agent_executor = await agent_definition.get_agent()
                await agent_executor.arun(input)

            data_queue = asyncio.Queue()
            asyncio.create_task(conversation_run_thread(input))
            response = StreamingResponse(
                event_stream(data_queue), media_type="text/event-stream"
            )

            return response

        else:
            agent_definition = AgentDefinition(agent=agent, has_streaming=has_streaming)
            agent_executor = await agent_definition.get_agent()
            output = await agent_executor.arun(input)
            await prisma.agentmemory.create(
                {"author": "AI", "message": output, "agentId": agentId}
            )

            return {"success": True, "data": output}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Agent with id: {agentId} not found",
    )
