from fastapi import APIRouter, Depends

from app.lib.auth.prisma import JWTBearer, decodeJWT
from app.lib.prisma import prisma

router = APIRouter()


@router.get(
    "/traces",
    name="List agent traces",
    description="List all agent traces",
)
async def list_agent_traces(token=Depends(JWTBearer())):
    """List agent traces endpoint"""
    decoded = decodeJWT(token)
    agent_traces = prisma.agenttrace.find_many(
        where={"userId": decoded["userId"]},
        include={
            "agent": True,
        },
    )

    return {"success": True, "data": agent_traces}
