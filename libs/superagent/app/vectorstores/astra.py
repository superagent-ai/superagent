import logging
import os
import uuid
from typing import Literal

import backoff
from decouple import config
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings  # type: ignore
from pydantic.dataclasses import dataclass

from app.vectorstores.astra_client import AstraClient, QueryResponse

logger = logging.getLogger(__name__)


@dataclass
class Response:
    id: str
    text: str
    metadata: dict

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "metadata": self.metadata,
        }

    def __init__(self, id: str, text: str, metadata: dict | None = None):
        """Core dataclass for single record."""
        self.id = id
        self.text = text
        self.metadata = metadata or {}


class AstraVectorStore:
    def __init__(
        self,
        astra_id: str = config("ASTRA_DB_ID", ""),
        astra_region: str = config("ASTRA_DB_REGION", "us-east1"),
        astra_application_token: str = config("ASTRA_DB_APPLICATION_TOKEN", ""),
        collection_name: str = config("ASTRA_DB_COLLECTION_NAME", "superagent"),
        keyspace_name: str = config("ASTRA_DB_KEYSPACE_NAME", ""),
    ) -> None:
        if not astra_id:
            raise ValueError(
                "Please provide an Astra DB ID via the "
                "`ASTRA_DB_ID` environment variable."
            )

        if not astra_region:
            raise ValueError(
                "Please provide an Astra Region Name via the "
                "`ASTRA_DB_REGION` environment variable."
            )

        if not astra_application_token:
            raise ValueError(
                "Please provide an Astra token via the "
                "`ASTRA_DB_APPLICATION_TOKEN` environment variable."
            )

        if not collection_name:
            raise ValueError(
                "Please provide an Astra collection name via the "
                "`ASTRA_DB_COLLECTION_NAME` environment variable."
            )

        if not keyspace_name:
            raise ValueError(
                "Please provide an Astra keyspace via the "
                "`ASTRA_DB_KEYSPACE_NAME` environment variable."
            )

        self.index = AstraClient(
            astra_id,
            astra_region,
            astra_application_token,
            keyspace_name,
            collection_name,
        )

        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002",
            openai_api_key=os.getenv("OPENAI_API_KEY", ""),
        )

    @backoff.on_exception(backoff.expo, Exception, max_tries=3)
    def _embed_with_retry(self, texts):
        return self.embeddings.embed_documents(texts)

    def embed_documents(self, documents: list[Document], batch_size: int = 100):
        chunks = [
            {
                "id": str(uuid.uuid4()),
                "text": doc.page_content,
                "chunk": i,
                **doc.metadata,
            }
            for i, doc in enumerate(documents)
        ]

        def batch_generator(chunks, batch_size):
            for i in range(0, len(chunks), batch_size):
                i_end = min(len(chunks), i + batch_size)
                batch = chunks[i:i_end]
                yield batch

        batch_gen = batch_generator(chunks, batch_size)

        for batch in batch_gen:
            batch_ids = [chunk["id"] for chunk in batch]
            texts_to_embed = [chunk["text"] for chunk in batch]
            logger.debug(f"Texts to embed: {texts_to_embed}")

            embeddings = self._embed_with_retry(texts_to_embed)
            to_upsert = list(zip(batch_ids, embeddings, batch))
            logger.debug(f"Upserting: {to_upsert}")

            try:
                res = self.index.upsert(to_upsert=to_upsert)
                logger.info(f"Upserted documents. {res}")
            except Exception as e:
                logger.error(f"Failed to upsert documents. Error: {e}")

        return self.index.describe_index_stats()

    def query(
        self,
        prompt: str,
        metadata_filter: dict | None = None,
        top_k: int = 3,
        namespace: str | None = None,
        min_score: float | None = None,  # new argument for minimum similarity score
    ) -> list[Response]:
        """
        Returns results from the vector database.
        """
        vector = self.embeddings.embed_query(prompt)

        raw_responses: QueryResponse = self.index.query(
            vector,
            filter=metadata_filter,
            top_k=top_k,
            include_metadata=True,
            namespace=namespace,
        )
        logger.debug(f"Raw responses: {raw_responses}")  # leaving for debugging

        # filter raw_responses based on the minimum similarity score if min_score is set
        if min_score is not None:
            raw_responses.matches = [
                match for match in raw_responses.matches if match.score >= min_score
            ]

        formatted_responses = self._format_response(raw_responses)
        return formatted_responses

    def query_documents(
        self,
        prompt: str,
        datasource_id: str,
        top_k: int | None,
        query_type: Literal["document", "all"] = "document",
    ) -> list[str]:
        if top_k is None:
            top_k = 3

        logger.info(f"Executing query with document id in namespace {datasource_id}")
        documents_in_namespace = self.query(
            prompt=prompt,
            namespace=datasource_id,
        )

        if documents_in_namespace == [] and query_type == "document":
            logger.info("No result with namespace. Executing query without namespace.")
            documents_in_namespace = self.query(
                prompt=prompt,
                metadata_filter={"datasource_id": datasource_id},
                top_k=top_k,
            )

        # A hack if we want to search in all documents but with backwards compatibility
        # with namespaces
        if documents_in_namespace == [] and query_type == "all":
            logger.info("Querying all documents.")
            documents_in_namespace = self.query(
                prompt=prompt,
                top_k=top_k,
            )

        return [str(response) for response in documents_in_namespace]

    def _extract_match_data(self, match):
        """Extracts id, text, and metadata from a match."""
        id = match.id
        text = match.metadata.get("text")
        metadata = match.metadata
        metadata.pop("text")
        return id, text, metadata

    def _format_response(self, response: QueryResponse) -> list[Response]:
        """
        Formats the response dictionary from the vector database into a list of
        Response objects.
        """
        if not response.get("matches"):
            return []

        ids, texts, metadata = zip(
            *[self._extract_match_data(match) for match in response.matches]
        )

        responses = [
            Response(id=id, text=text, metadata=meta)
            for id, text, meta in zip(ids, texts, metadata)
        ]

        return responses

    def delete(self, datasource_id: str):
        try:
            pass
        except Exception as e:
            logger.error(f"Failed to delete {datasource_id}. Error: {e}")

    def clear_cache(self, agent_id: str, datasource_id: str | None = None):
        try:
            filter_dict = {"agentId": agent_id, "type": "cache"}
            if datasource_id:
                filter_dict["datasource_id"] = datasource_id

            self.index.delete(filter=dict(filter_dict), delete_all=False)
            logger.info(f"Deleted vectors with agentId `{agent_id}`.")
        except Exception as e:
            logger.error(
                f"Failed to delete vectors with agentId `{agent_id}`. Error: {e}"
            )
