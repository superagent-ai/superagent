import logging
import segment.analytics as analytics

from decouple import config
from fastapi import APIRouter, Depends

from app.models.request import (
    Workflow as WorkflowRequest,
)
from app.models.request import (
    WorkflowInvoke as WorkflowInvokeRequest,
)
from app.models.request import (
    WorkflowStep as WorkflowStepRequest,
)
from app.models.response import Workflow as WorkflowResponse
from app.models.response import WorkflowList as WorkflowListResponse
from app.utils.api import get_current_api_user, handle_exception
from app.utils.prisma import prisma
from app.workflows.base import WorkflowBase

SEGMENT_WRITE_KEY = config("SEGMENT_WRITE_KEY", None)

router = APIRouter()
logger = logging.getLogger(__name__)
analytics.write_key = SEGMENT_WRITE_KEY


@router.post(
    "/workflows",
    name="create",
    description="Create a new workflow",
    response_model=WorkflowResponse,
)
async def create(body: WorkflowRequest, api_user=Depends(get_current_api_user)):
    """Endpoint for creating a worflow"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Created Workflow")
        data = await prisma.workflow.create(
            {
                **body.dict(),
                "apiUserId": api_user.id,
            }
        )
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/workflows",
    name="list",
    description="List all workflows",
    response_model=WorkflowListResponse,
)
async def list(api_user=Depends(get_current_api_user)):
    """Endpoint for listing all workflows"""
    try:
        data = await prisma.workflow.find_many(
            where={"apiUserId": api_user.id}, order={"createdAt": "desc"}
        )
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/workflows/{workflow_id}",
    name="get",
    description="Get a single workflow",
    response_model=WorkflowResponse,
)
async def get(workflow_id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for getting a single workflow"""
    try:
        data = await prisma.workflow.find_first(
            where={"id": workflow_id, "apiUserId": api_user.id}
        )
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.patch(
    "/workflows/{workflow_id}",
    name="update",
    description="Patch a workflow",
    response_model=WorkflowResponse,
)
async def update(
    workflow_id: str, body: WorkflowRequest, api_user=Depends(get_current_api_user)
):
    """Endpoint for patching a workflow"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Updated Workflow")
        data = await prisma.workflow.update(
            where={"id": workflow_id},
            data={
                **body.dict(),
                "apiUserId": api_user.id,
            },
        )
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.delete(
    "/workflows/{workflow_id}",
    name="delete",
    description="Delete a specific workflow",
)
async def delete(workflow_id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for deleting a specific workflow"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Deleted Workflow")
        await prisma.workflowstep.delete_many(where={"workflowId": workflow_id})
        await prisma.workflow.delete(where={"id": workflow_id})
        return {"success": True, "data": None}
    except Exception as e:
        handle_exception(e)


@router.post(
    "/workflows/{workflow_id}/invoke",
    name="invoke",
    description="Invoke a specific workflow",
)
async def invoke(
    workflow_id: str,
    body: WorkflowInvokeRequest,
    api_user=Depends(get_current_api_user),
):
    """Endpoint for invoking a specific workflow"""
    if SEGMENT_WRITE_KEY:
        analytics.track(api_user.id, "Invoked Workflow")
    workflow = WorkflowBase(
        workflow_id=workflow_id, enable_streaming=body.enableStreaming
    )
    output = await workflow.arun(body.input)
    return {"success": True, "data": output}


# Workflow steps
@router.post(
    "/workflows/{workflow_id}/steps",
    name="add_step",
    description="Create a new workflow step",
    response_model=WorkflowResponse,
)
async def add_step(
    workflow_id: str, body: WorkflowStepRequest, api_user=Depends(get_current_api_user)
):
    """Endpoint for creating a workflow step"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Created Workflow Step")
        data = await prisma.workflowstep.create(
            {
                **body.dict(),
                "workflowId": workflow_id,
            },
            include={"agent": True, "workflow": True},
        )
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.get(
    "/workflows/{workflow_id}/steps",
    name="list_steps",
    description="List all steps of a workflow",
    response_model=WorkflowListResponse,
)
async def list_steps(workflow_id: str, api_user=Depends(get_current_api_user)):
    """Endpoint for listing all steps of a workflow"""
    try:
        data = await prisma.workflowstep.find_many(
            where={"workflowId": workflow_id}, order={"order": "asc"}
        )
        return {"success": True, "data": data}
    except Exception as e:
        handle_exception(e)


@router.delete(
    "/workflows/{workflow_id}/steps/{step_id}",
    name="delete_step",
    description="Delete a specific workflow step",
)
async def delete_step(
    workflow_id: str, step_id: str, api_user=Depends(get_current_api_user)
):
    """Endpoint for deleting a specific workflow step"""
    try:
        if SEGMENT_WRITE_KEY:
            analytics.track(api_user.id, "Deleted Workflow Step")
        await prisma.workflowstep.delete(where={"id": step_id})
        return {"success": True, "data": None}
    except Exception as e:
        handle_exception(e)
