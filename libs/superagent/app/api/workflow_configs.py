import json
import logging

import segment.analytics as analytics
import yaml
from decouple import config
from fastapi import APIRouter, Body, Depends, HTTPException

from app.api.workflow_configs.api.api_agent_manager import ApiAgentManager
from app.api.workflow_configs.api.api_manager import ApiManager
from app.utils.api import get_current_api_user, handle_exception
from app.utils.prisma import prisma

from .workflow_configs.processors.agent_processor import AgentProcessor
from .workflow_configs.saml_schema import WorkflowConfig

SEGMENT_WRITE_KEY = config("SEGMENT_WRITE_KEY", None)

router = APIRouter()
logger = logging.getLogger(__name__)
analytics.write_key = SEGMENT_WRITE_KEY


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
            # validating the parsed yaml
            new_config = WorkflowConfig(**parsed_yaml).dict()
        except yaml.YAMLError as e:
            logger.error("Invalid YAML: ", e)
            raise HTTPException(status_code=400, detail=f"Error parsing YAML: {str(e)}")

        new_config_str = json.dumps(new_config)

        new_config = json.loads(new_config_str)
        old_config = {} if not workflow_config else workflow_config.config

        agent_manager = ApiAgentManager(workflow_id, api_user)
        api_manager = ApiManager(api_user, agent_manager)
        processor = AgentProcessor(api_user, api_manager)
        await processor.process_assistants(old_config, new_config)

        config = await prisma.workflowconfig.create(
            data={
                "workflowId": workflow_id,
                "config": new_config_str,
                "apiUserId": api_user.id,
            }
        )

        return {"success": True, "data": config}
    except Exception as e:
        handle_exception(e)
