from fastapi import APIRouter, Depends, HTTPException, status

from app.lib.auth.prisma import JWTBearer, decodeJWT
from app.lib.documents import upsert_document
from app.lib.models.document import Document
from app.lib.prisma import prisma

router = APIRouter()


@router.post("/documents/", name="Create document", description="Create a new document")
async def create_document(body: Document, token=Depends(JWTBearer())):
    """Create document endpoint"""

    try:
        decoded = decodeJWT(token)
        document_type = body.type
        document_url = body.url
        document = await prisma.document.create(
            {"type": document_type, "url": document_url, "userId": decoded["userId"]}
        )

        await upsert_document(
            url=document_url, type=document_type, document_id=document.id
        )

        return {"success": True, "data": document}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )


@router.get("/documents/", name="List documents", description="List all documents")
async def read_documents(token=Depends(JWTBearer())):
    """List documents endpoint"""
    decoded = decodeJWT(token)
    documents = await prisma.document.find_many(
        where={"userId": decoded["userId"]}, include={"user": True}
    )

    if documents:
        return {"success": True, "data": documents}

    return HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="No agents found",
    )


@router.get(
    "/documents/{documentId}",
    name="Get document",
    description="Get a specific document",
)
async def read_document(documentId: str, token=Depends(JWTBearer())):
    """Get a single document"""
    document = await prisma.document.find_unique(
        where={"id": documentId}, include={"user": True}
    )

    if document:
        return {"success": True, "data": document}

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"Agent with id: {documentId} not found",
    )


@router.delete(
    "/agents/{documentId}",
    name="Delete document",
    description="Delete a specific document",
)
async def delete_document(documentId: str, token=Depends(JWTBearer())):
    """Delete a document"""
    try:
        await prisma.agent.delete(where={"id": documentId})

        return {"success": True, "data": None}
    except Exception as e:
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )
