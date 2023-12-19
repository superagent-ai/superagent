import logging
import uuid
from typing import Literal

import backoff
import pinecone
from decouple import config
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings  # type: ignore
from pinecone.core.client.models import QueryResponse
from pydantic.dataclasses import dataclass

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


class PineconeVectorStore:
    def __init__(
        self,
        index_name: str = config("PINECONE_INDEX", ""),
        environment: str = config("PINECONE_ENVIRONMENT", ""),
        pinecone_api_key: str = config("PINECONE_API_KEY", ""),
    ) -> None:
        if not index_name:
            raise ValueError(
                "Please provide a Pinecone Index Name via the "
                "`PINECONE_INDEX` environment variable."
            )

        if not environment:
            raise ValueError(
                "Please provide a Pinecone Environment/Region Name via the "
                "`PINECONE_ENVIRONMENT` environment variable."
            )

        if not pinecone_api_key:
            raise ValueError(
                "Please provide a Pinecone API key via the "
                "`PINECONE_API_KEY` environment variable."
            )

        pinecone.init(api_key=pinecone_api_key, environment=environment)

        logger.info(f"Index name: {index_name}")
        self.index = pinecone.Index(index_name)
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002", openai_api_key=config("OPENAI_API_KEY")
        )  # type: ignore

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
                res = self.index.upsert(vectors=to_upsert)
                logger.info(f"Upserted documents. {res}")
            except Exception as e:
                logger.error(f"Failed to upsert documents. Error: {e}")

        return self.index.describe_index_stats()

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
            *[self._extract_match_data(match) for match in response["matches"]]
        )

        responses = [
            Response(id=id, text=text, metadata=meta)
            for id, text, meta in zip(ids, texts, metadata)
        ]

        return responses

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
            raw_responses["matches"] = [
                match
                for match in raw_responses["matches"]
                if match["score"] >= min_score
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
            top_k = 5
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

    def delete(self, datasource_id: str):
        try:
            logger.info(f"Deleting vectors for datasource with id: {datasource_id}")
            self.index.delete(filter={"datasource_id": datasource_id})

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
