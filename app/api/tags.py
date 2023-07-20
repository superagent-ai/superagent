from fastapi import APIRouter, Depends

from app.lib.auth.prisma import JWTBearer, decodeJWT
from app.lib.models.tag import Tag
from app.lib.prisma import prisma

router = APIRouter()


@router.post("/tags", name="Create a tag", description="Create a new tag")
async def create_tag(body: Tag, token=Depends(JWTBearer())):
    """Create tag endpoint"""
    decoded = decodeJWT(token)

    tag = prisma.tag.create(
        {
            "name": body.name,
            "color": body.color,
            "userId": decoded["userId"],
        },
    )

    return {"success": True, "data": tag}


@router.get("/tags", name="List tags", description="List all tags")
async def read_tags(token=Depends(JWTBearer())):
    """List tags endpoint"""
    decoded = decodeJWT(token)
    tags = prisma.tag.find_many(
        where={"userId": decoded["userId"]},
        order={"createdAt": "desc"},
    )

    return {"success": True, "data": tags}


@router.get(
    "/tags/{tagId}",
    name="Get tag",
    description="Get a specific tag",
)
async def read_tag(tagId: str, token=Depends(JWTBearer())):
    """Get tag endpoint"""
    tag = prisma.tag.find_unique(where={"id": tagId})

    return {"success": True, "data": tag}


@router.delete(
    "/tags/{tagId}",
    name="Delete tag",
    description="Delete a specific tag",
)
async def delete_tag(tagId: str, token=Depends(JWTBearer())):
    """Delete tag endpoint"""
    prisma.tag.delete(where={"id": tagId})

    return {"success": True, "data": None}


@router.patch("/tags/{tagId}", name="Patch tag", description="Patch a specific tag")
async def patch_tag(tagId: str, body: dict, token=Depends(JWTBearer())):
    """Patch tag endpoint"""
    tag = prisma.tag.update(
        data=body,
        where={"id": tagId},
    )

    return {"success": True, "data": tag}
