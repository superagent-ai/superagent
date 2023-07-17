import json

from fastapi import APIRouter, Depends

from app.lib.auth.prisma import JWTBearer, decodeJWT
from app.lib.models.prompt import Prompt
from app.lib.prisma import prisma

router = APIRouter()


@router.post("/prompts", name="Create a prompt", description="Create a new prompt")
async def create_prompt(body: Prompt, token=Depends(JWTBearer())):
    """Create prompt endpoint"""
    decoded = decodeJWT(token)

    prompt = prisma.prompt.create(
        {
            "name": body.name,
            "input_variables": json.dumps(body.input_variables),
            "template": body.template,
            "userId": decoded["userId"],
        },
        include={"user": True},
    )

    return {"success": True, "data": prompt}


@router.get("/prompts", name="List prompts", description="List all prompts")
async def read_prompts(token=Depends(JWTBearer())):
    """List prompts endpoint"""
    decoded = decodeJWT(token)
    prompts = prisma.prompt.find_many(
        where={"userId": decoded["userId"]},
        include={"user": True},
        order={"createdAt": "desc"},
        take=100
    )

    return {"success": True, "data": prompts}


@router.get(
    "/prompts/{promptId}",
    name="Get prompt",
    description="Get a specific prompt",
)
async def read_prompt(promptId: str, token=Depends(JWTBearer())):
    """Get prompt endpoint"""
    prompt = prisma.prompt.find_unique(where={"id": promptId}, include={"user": True})

    return {"success": True, "data": prompt}


@router.delete(
    "/prompts/{promptId}",
    name="Delete prompt",
    description="Delete a specific prompt",
)
async def delete_prompt(promptId: str, token=Depends(JWTBearer())):
    """Delete prompt endpoint"""
    prisma.prompt.delete(where={"id": promptId})

    return {"success": True, "data": None}


@router.patch(
    "/prompts/{promptId}", name="Patch prompt", description="Patch a specific prompt"
)
async def patch_prompt(promptId: str, body: dict, token=Depends(JWTBearer())):
    """Patch prompt endpoint"""
    input_variables = body["input_variables"]
    if input_variables or input_variables == []:
        body["input_variables"] = json.dumps(input_variables)

    prompt = prisma.prompt.update(
        data=body,
        where={"id": promptId},
    )

    return {"success": True, "data": prompt}
