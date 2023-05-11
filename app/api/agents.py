from fastapi import APIRouter, Depends, HTTPException, status

from app.lib.auth.prisma import JWTBearer, decodeJWT
from app.lib.models.agents import Agent
from app.lib.prisma import prisma

router = APIRouter()


@router.post("/agents/", name="Agent", description="Agents endpoint")
async def agents(body: Agent, token=Depends(JWTBearer())):
    """Agents endpoint"""
    decoded = decodeJWT(token)

    try:
        agent = await prisma.agent.create(
            {
                "name": body.name,
                "type": body.type,
                "userId": decoded["userId"],
            },
            include={"user": True},
        )

        return {"success": True, "data": agent}

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Exception while creating agent",
        )
