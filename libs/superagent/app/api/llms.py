import json

import segment.analytics as analytics
from decouple import config
from fastapi import APIRouter, Depends

from app.models.request import LLM as LLMRequest
from app.models.response import LLM as LLMResponse
from app.models.response import LLMList as LLMListResponse
from app.utils.api import get_current_api_user, handle_exception
from app.utils.prisma import prisma
from prisma import Json

SEGMENT_WRITE_KEY = config("SEGMENT_WRITE_KEY", None)

router = APIRouter()
analytics.write_key = SEGMENT_WRITE_KEY


@router.post(
    "/llms",
    name="create",
    description="Create a new LLM",
    response_model=LLMResponse,
)
async def create(body: LLMRequest, api_user=Depends(get_current_api_user)):
    """Endpoint for creating an LLM"""
    if SEGMENT_WRITE_KEY:
        analytics.track(api_user.id, "Created LLM")
    data = await prisma.llm.create(
        {
            **body.dict(),
            "apiUserId": api_user.id,
            "options": json.dumps(body.options),
        }
    )
    data.options = json.dumps(data.options)
    return {"success": True, "data": data}


@router.get(
    "/llms",
    name="list",
    description="List all LLMs",
    response_model=LLMListResponse,
)
async def list(api_user=Depends(get_current_api_user)):
    """Endpoint for listing all LLMs"""
    try:
        data = await prisma.llm.find_many(
            where={"apiUserId": api_user.id}, order={"createdAt": "desc"}
        )
        # Convert options to string
        for item in data:
            item.options = json.dumps(item.options)
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/llms/{llm_id}",
    name="get",
    description="Get a single LLM",
    response_model=LLMResponse,
)
async def get(llm_id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for getting a single LLM"""
    try:
        data = await prisma.llm.find_first(
            where={"id": llm_id, "apiUserId": api_user.id}
        )
        data.options = json.dumps(data.options)
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.patch(
    "/llms/{llm_id}",
    name="update",
    description="Patch an LLM",
    response_model=LLMResponse,
)
async def update(llm_id: str, body: LLMRequest, api_user=Depends(get_current_api_user)):
    """Endpoint for patching an LLM"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Updated LLM")
        data = await prisma.llm.update(
            where={"id": llm_id},
            data={
                **body.dict(exclude_unset=True),
                "apiUserId": api_user.id,
                "options": Json(body.options),
            },
        )
        data.options = json.dumps(data.options)
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)
