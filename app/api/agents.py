from fastapi import APIRouter, Depends
from fastapi.security.api_key import APIKey
from pydantic import BaseModel
from app.lib.auth import get_api_key


class Agent(BaseModel):
    name: str


router = APIRouter()


@router.post("/agents/", name="Agent", description="Agents endpoint")
async def agents(body: Agent, api_key: APIKey = Depends(get_api_key)):
    """Agents endpoint"""
    payload = body

    return payload
