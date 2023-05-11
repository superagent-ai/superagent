from fastapi import APIRouter, Depends

from app.lib.auth.prisma import JWTBearer
from app.lib.models.agents import Agent

router = APIRouter()


@router.post("/agents/", name="Agent", description="Agents endpoint")
async def agents(body: Agent, token=Depends(JWTBearer())):
    """Agents endpoint"""
    payload = body

    return payload
