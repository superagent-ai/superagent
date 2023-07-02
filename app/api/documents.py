import json

from fastapi import APIRouter, Depends, HTTPException, status

from app.lib.auth.prisma import JWTBearer, decodeJWT
from app.lib.documents import upsert_document, valid_ingestion_types
from app.lib.models.document import Document
from app.lib.prisma import prisma

router = APIRouter()


@router.post("/documents", name="Create document", description="Create a new document")
async def create_document(body: Document, token=Depends(JWTBearer())):
    """Create document endpoint"""
    decoded = decodeJWT(token)
    document = prisma.document.create(
        {
            "type": body.type,
            "url": body.url,
            "userId": decoded["userId"],
            "name": body.name,
            "splitter": json.dumps(body.splitter),
            "authorization": json.dumps(body.authorization),
            "metadata": json.dumps(body.metadata)
        }
    )

    try:
        decoded = decodeJWT(token)
        document = prisma.document.create(
            {
                "type": body.type,
                "url": body.url,
                "userId": decoded["userId"],
                "name": body.name,
                "splitter": json.dumps(body.splitter),
                "authorization": json.dumps(body.authorization),
                "metadata": json.dumps(body.metadata),
            }
        )

        if body.type in valid_ingestion_types:
            upsert_document(
                url=body.url,
                type=body.type,
                document_id=document.id,
                authorization=body.authorization,
                metadata=body.metadata,
                text_splitter=body.splitter,
                from_page=body.from_page,
                to_page=body.to_page,
            )

        return {"success": True, "data": document}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )


@router.get("/documents", name="List documents", description="List all documents")
async def read_documents(token=Depends(JWTBearer())):
    """List documents endpoint"""
    decoded = decodeJWT(token)
    documents = prisma.document.find_many(
        where={"userId": decoded["userId"]}, include={"user": True}
    )

    if documents:
        return {"success": True, "data": documents}

    raise HTTPException(
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
    document = prisma.document.find_unique(
        where={"id": documentId}, include={"user": True}
    )

    if document:
        return {"success": True, "data": document}

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"Agent with id: {documentId} not found",
    )


@router.delete(
    "/documents/{documentId}",
    name="Delete document",
    description="Delete a specific document",
)
async def delete_document(documentId: str, token=Depends(JWTBearer())):
    """Delete a document"""
    try:
        prisma.document.delete(where={"id": documentId})

        return {"success": True, "data": None}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e,
        )
