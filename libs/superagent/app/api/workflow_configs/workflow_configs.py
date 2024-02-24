import json
import logging

import segment.analytics as analytics
import yaml
from decouple import config
from fastapi import APIRouter, Body, Depends, status
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.api.workflow_configs.api.api_agent_manager import ApiAgentManager
from app.api.workflow_configs.api.api_manager import ApiManager
from app.api.workflow_configs.data_transformer import (
    MissingVectorDatabaseProvider,
    UnkownFileType,
)
from app.api.workflow_configs.processors.agent_processor import AgentProcessor
from app.api.workflow_configs.saml_schema import WorkflowConfigModel
from app.api.workflow_configs.validator import (
    RepeatedNameError,
    UnknownLLMProvider,
)
from app.utils.api import get_current_api_user
from app.utils.prisma import prisma

SEGMENT_WRITE_KEY = config("SEGMENT_WRITE_KEY", None)

router = APIRouter()
logger = logging.getLogger(__name__)
analytics.write_key = SEGMENT_WRITE_KEY


@router.get("/workflows/config/schema")
async def get_schema():
    return WorkflowConfigModel.schema()


@router.post("/workflows/{workflow_id}/config")
async def add_config(
    workflow_id: str,
    yaml_content: str = Body(..., media_type="application/x-yaml"),
    api_user=Depends(get_current_api_user),
):
    try:
        workflow_config = await prisma.workflowconfig.find_first(
            where={"workflowId": workflow_id}, order={"createdAt": "desc"}
        )
        try:
            parsed_yaml = yaml.safe_load(yaml_content)
        except yaml.YAMLError as e:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"error": {"message": f"Invalid YAML format: {str(e)}"}},
            )

        try:
            new_config = WorkflowConfigModel(**parsed_yaml).dict()
        except ValidationError as e:
            logger.exception(e)
            errors = e.errors()
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "error": {
                        "message": errors[0]["msg"],
                    },
                },
            )

        new_config_str = json.dumps(new_config)

        new_config = json.loads(new_config_str)
        old_config = {} if not workflow_config else workflow_config.config

        agent_manager = ApiAgentManager(workflow_id, api_user)
        api_manager = ApiManager(api_user, agent_manager)
        processor = AgentProcessor(api_user, api_manager)

        try:
            await processor.process_assistants(old_config, new_config)
        except (
            MissingVectorDatabaseProvider,
            UnkownFileType,
            UnknownLLMProvider,
            RepeatedNameError,
        ) as e:
            logger.exception(e)
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "error": {
                        "message": str(e),
                    },
                },
            )

        config = await prisma.workflowconfig.create(
            data={
                "workflowId": workflow_id,
                "config": new_config_str,
                "apiUserId": api_user.id,
            }
        )

        return {"success": True, "data": config}
    except Exception as e:
        logger.exception(e)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": {
                    "message": "Something went wrong",
                },
            },
        )
