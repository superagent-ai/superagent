import logging

from app.api.agents import (
    add_datasource as api_add_agent_datasource,
)
from app.api.datasources import (
    create as api_create_datasource,
)
from app.api.datasources import (
    delete as api_delete_datasource,
)
from app.api.workflow_configs.api.base import (
    BaseApiAgentManager,
    BaseApiDatasourceManager,
)
from app.models.request import (
    AgentDatasource as AgentDatasourceRequest,
)
from app.models.request import (
    Datasource as DatasourceRequest,
)

logger = logging.getLogger(__name__)


class ApiDatasourceManager(BaseApiDatasourceManager):
    """
    Class for managing datasources.
    """

    def __init__(self, api_user, agent_manager: BaseApiAgentManager):
        self.api_user = api_user
        self.agent_manager = agent_manager

    # for ensuring unique datasource names
    def _get_datasource_name(
        self, file_type: str, file_url: str, description: str
    ) -> str:
        return f"{file_type} doc {description} - {file_url}"

    async def create_datasource(self, data: dict):
        try:
            res = await api_create_datasource(
                body=DatasourceRequest.parse_obj(data),
                api_user=self.api_user,
            )

            new_datasource = res.get("data", {})

            logger.info(f"Created datasource: {data}")
            return new_datasource
        except Exception:
            logger.error(f"Error creating datasource: {data}")

    async def add_datasource(self, assistant: dict, data: dict):
        assistant = await self.agent_manager.get_assistant(assistant)

        files = data.get("files", [])

        for file in files:
            file_url = file.get("url")
            file_type = file.get("type")
            description = data.get("description")

            datasource_data = {
                "name": self._get_datasource_name(
                    file_type,
                    file_url,
                    description,
                ),
                "description": description,
                "url": file_url,
                "type": file_type,
            }

            new_datasource = await self.create_datasource(datasource_data)

            try:
                await api_add_agent_datasource(
                    agent_id=assistant.id,
                    body=AgentDatasourceRequest(
                        datasourceId=new_datasource.id,
                    ),
                    api_user=self.api_user,
                )
                logger.info(
                    f"Added datasource: {new_datasource.name} - {assistant.name}"
                )
            except Exception:
                logger.error(f"Error adding datasource: {new_datasource} - {assistant}")

    async def delete_datasource(self, assistant: dict, datasource: dict):
        assistant = await self.agent_manager.get_assistant(assistant)
        files = datasource.get("files", [])

        for file in files:
            try:
                datasource = {
                    "name": self._get_datasource_name(
                        file_type=file.get("type"),
                        file_url=file.get("url"),
                        description=datasource.get("description"),
                    ),
                }

                datasource = await self.agent_manager.get_datasource(
                    assistant, datasource
                )
                await api_delete_datasource(
                    datasource_id=datasource.id,
                    api_user=self.api_user,
                )
                logger.info(f"Deleted datasource: {datasource.name} - {assistant.name}")
            except Exception:
                logger.error(f"Error deleting datasource: {datasource} - {assistant}")

    async def update_datasource(
        self, assistant: dict, old_datasource: dict, new_datasource: dict
    ):
        try:
            await self.delete_datasource(assistant, old_datasource)
            await self.add_datasource(assistant, new_datasource)
        except Exception:
            logger.error(
                f"Error updating datasource: {old_datasource} - {new_datasource}"
            )
