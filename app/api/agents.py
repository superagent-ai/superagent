from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.lib.auth.prisma import JWTBearer


class Agent(BaseModel):
    name: str


router = APIRouter()


@router.post("/agents/", name="Agent", description="Agents endpoint")
async def agents(body: Agent, token=Depends(JWTBearer())):
    """Agents endpoint"""
    payload = body

    return payload
