import logging

from fastapi import APIRouter, Depends, HTTPException, status
from starlette.requests import Request

from app.lib.auth.prisma import JWTBearer
from app.lib.models.agent_document import AgentDocument
from app.lib.prisma import prisma

logger = logging.getLogger(__name__)
router = APIRouter()


def parse_filter_params(request: Request):
    query_params = request.query_params
    filter_params = {}

    for k, v in query_params.items():
        if k.startswith("filter[") and k.endswith("]"):
            # Removing 'filter[' from start and ']' from end
            filter_key = k[7:-1]
            filter_params[filter_key] = v

    return filter_params


@router.post(
    "/agent-documents",
    name="Create agent document",
    description="Create a agent document",
)
async def create_agent_document(body: AgentDocument, token=Depends(JWTBearer())):
    """Create api token endpoint"""
    try:
        agent_document = prisma.agentdocument.create(
            {"agentId": body.agentId, "documentId": body.documentId}
        )
        return {"success": True, "data": agent_document}
    except Exception as e:
        logger.error(
            """
            Cannot create agent document for agent {body.agentId} 
            and document {body.documentId}
            """,
            exc_info=e,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@router.get(
    "/agent-documents",
    name="List agent documents",
    description="List all agent documents",
)
async def read_agent_documents(
    filters: dict = Depends(parse_filter_params),
    expand: bool = False,
    token=Depends(JWTBearer()),
):
    """List api tokens endpoint"""

    try:
        agent_documents = prisma.agentdocument.find_many(
            where=filters, include={"document": expand}
        )
    except Exception as e:
        logger.error("Cannot read agent documents", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return {"success": True, "data": agent_documents}


@router.get(
    "/agent-documents/{agentDocumentId}",
    name="Get agent document",
    description="Get a specific agent document",
)
async def read_agent_document(agentDocumentId: str, token=Depends(JWTBearer())):
    """Get an agent document"""
    try:
        agent_document = prisma.agentdocument.find_unique(where={"id": agentDocumentId})
    except Exception as e:
        logger.error("Cannot read agent document {agentDocumentId}", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return {"success": True, "data": agent_document}


@router.delete(
    "/agent-documents/{agentDocumentId}",
    name="Delete agent document",
    description="Delete a specific agent document",
)
async def delete_agent_document(agentDocumentId: str, token=Depends(JWTBearer())):
    """Delete agent document endpoint"""

    try:
        prisma.agentdocument.delete(where={"id": agentDocumentId})
    except Exception as e:
        logger.error("Cannot delete agent document {agentDocumentId}", exc_info=e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return {"success": True, "data": None}
