import logging


from app.api.workflow_configs.api.api_manager import ApiManager
from app.api.workflow_configs.saml_schema import Superrag
from app.utils.helpers import (
    get_first_non_null_key,
    get_mimetype_from_url,
    get_superrag_compatible_credentials,
    remove_key_if_present,
    rename_and_remove_keys,
)
from app.utils.llm import LLM_REVERSE_MAPPING, get_llm_provider
from app.vectorstores.base import REVERSE_VECTOR_DB_MAPPING

logger = logging.getLogger(__name__)


DEFAULT_ENCODER_OPTIONS = {
    "type": "openai",
    "name": "text-embedding-3-small",
    "dimensions": 1536,
}


SUPERRAG_MIME_TYPE_TO_EXTENSION = {
    "text/plain": "TXT",
    "text/markdown": "MARKDOWN",
    "application/pdf": "PDF",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
    "text/csv": "CSV",
}


class MissingVectorDatabaseProvider(Exception):
    pass


class UnkownFileType(Exception):
    pass


class DataTransformer:
    def __init__(self, api_user, api_manager: ApiManager):
        self.api_user = api_user
        self.api_manager = api_manager

    @staticmethod
    def transform_tool(tool: dict, tool_type: str):
        rename_and_remove_keys(tool, {"use_for": "description"})

        if tool_type:
            tool["type"] = tool_type.upper()

        if tool.get("type") == "FUNCTION":
            tool["metadata"] = {
                "functionName": tool.get("name"),
                **tool.get("metadata", {}),
            }

    @staticmethod
    def transform_assistant(assistant: dict, assistant_type: str):
        remove_key_if_present(assistant, "data")
        remove_key_if_present(assistant, "tools")
        rename_and_remove_keys(
            assistant, {"llm": "llmModel", "intro": "initialMessage"}
        )

        if assistant_type:
            assistant["type"] = assistant_type.upper()

        llm_model = assistant.get("llmModel")

        if assistant.get("type") == "LLM":
            assistant["metadata"] = {
                "model": llm_model,
                **assistant.get("metadata", {}),
            }

            provider = get_llm_provider(llm_model)
            if provider:
                assistant["llmProvider"] = provider

            assistant["llmModel"] = LLM_REVERSE_MAPPING.get(llm_model)

        if assistant.get("type") == "LLM":
            remove_key_if_present(assistant, "llmModel")

    async def transform_superrag_data(self, superrag_data: Superrag):
        for superrag_obj in superrag_data:
            node_name = get_first_non_null_key(superrag_obj)
            datasource = superrag_obj.get(node_name, {})

            rename_and_remove_keys(datasource, {"use_for": "description"})

            files = []
            for url in datasource.get("urls", []):
                try:
                    file_type = SUPERRAG_MIME_TYPE_TO_EXTENSION[
                        get_mimetype_from_url(url)
                    ]
                except KeyError:
                    supported_file_types = ", ".join(
                        value for value in SUPERRAG_MIME_TYPE_TO_EXTENSION.values()
                    )
                    raise UnkownFileType(
                        f"Unknown file type for URL {url}"
                        f"Supported file types are: {supported_file_types}"
                    )

                files.append(
                    {
                        "type": file_type,
                        "url": url,
                    }
                )

            datasource["files"] = files

            remove_key_if_present(datasource, "urls")

            database_provider = datasource.get("database_provider")
            if database_provider:
                database = await self.api_manager.get_vector_database_by_provider(
                    database_provider
                )
            else:
                database = await self.api_manager.get_vector_database_by_user_id()
            # this is for superrag
            if database:
                database_provider = REVERSE_VECTOR_DB_MAPPING.get(database.provider)
                credentials = get_superrag_compatible_credentials(database.options)
                datasource["vector_database"] = {
                    "type": database_provider,
                    "config": credentials,
                }
            else:
                raise MissingVectorDatabaseProvider(
                    "No compatible vector database found. "
                    "Please ensure that the provider is supported."
                )

            remove_key_if_present(datasource, "database_provider")
            datasource["encoder"] = datasource.get("encoder") or DEFAULT_ENCODER_OPTIONS
