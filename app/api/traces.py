import logging

from fastapi import APIRouter, Depends, HTTPException, status

from app.lib.auth.prisma import JWTBearer
from app.lib.prisma import prisma

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get(
    "/traces",
    name="List agent traces",
    description="List all agent traces",
)
async def list_agent_traces(token=Depends(JWTBearer())):
    """List agent traces endpoint"""
    try:
        agent_traces = prisma.agenttrace.find_many(
            where={"userId": token["userId"]},
            include={
                "agent": True,
            },
            order={"createdAt": "desc"},
        )
        return {"success": True, "data": agent_traces}
    except Exception as e:
        logger.error("Couldn't find agent traces for user", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
