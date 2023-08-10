import json
import logging
import time
import uuid

import pinecone
from decouple import config
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings  # type: ignore
from pydantic.dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class Response:
    id: str
    text: str
    metadata: dict | None = None

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


class PineconeVectorstore:
    def __init__(
        self,
        index_name: str = config("PINECONE_INDEX", "superagent"),
        environment: str = config("PINECONE_ENVIRONMENT"),
        pinecone_api_key: str = config("PINECONE_API_KEY"),
    ) -> None:
        if index_name is None:
            raise ValueError(
                "Please provide a Pinecone Index Name via the "
                "`PINECONE_INDEX` environment variable."
            )

        if environment is None:
            raise ValueError(
                "Please provide a Pinecone Environment/Region Name via the "
                "`PINECONE_ENVIRONMENT` environment variable."
            )

        if pinecone_api_key is None:
            raise ValueError(
                "Please provide a Pinecone API key via the "
                "`PINECONE_API_KEY` environment variable."
            )

        pinecone.init(api_key=pinecone_api_key, environment=environment)

        self.index = pinecone.Index(index_name)
        logger.info(f"Index name: {index_name}")

        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002"
        )  # type: ignore

    def from_documents(self, docs, document_id):
        # Upsert vectors with metadata
        pass

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

        print(f"Chunks: {chunks}")

        def batch_generator(chunks, batch_size):
            for i in range(0, len(chunks), batch_size):
                i_end = min(len(chunks), i + batch_size)
                batch = chunks[i:i_end]
                yield batch

        batch_gen = batch_generator(chunks, batch_size)

        for batch in batch_gen:
            batch_ids = [chunk["id"] for chunk in batch]
            texts_to_embed = [chunk["text"] for chunk in batch]

            embeddings = self.embed_with_retry(texts_to_embed)

            to_upsert = list(zip(batch_ids, embeddings, batch))

            try:
                res = self.index.upsert(vectors=to_upsert)
                logger.info(f"Upserted documents. {res}")
            except Exception as e:
                logger.error(f"Failed to upsert documents. Error: {e}")

        return self.index.describe_index_stats()

    def embed_with_retry(self, texts, max_retries=3):
        for attempt in range(max_retries):
            try:
                res = self.embeddings.embed_documents(texts)
                return res
            except Exception as e:
                logger.error(
                    f"Attempt {attempt+1} failed. Retrying to embed documents."
                    f"Error: {e}"
                )
                sleep_time = 2**attempt
                time.sleep(sleep_time)
        else:
            logger.error("Maximum retries exceeded. Failed to embed documents.")
            raise Exception("Maximum retries exceeded.")

    def _extract_match_data(self, match):
        """Extracts id, text, and metadata from a match."""
        id = match.id
        text = match.metadata["text"]
        metadata = match.metadata
        metadata.pop("text")  # remove text from metadata
        return id, text, metadata

    def _format_response(self, response: dict) -> list[Response]:
        """
        Formats the response dictionary from the vector database into a list of
        Response objects.
        """
        # Extract ids, texts, and metadata from matches
        ids, texts, metadata = zip(
            *[self._extract_match_data(match) for match in response["matches"]]
        )

        # Create Response objects
        responses = [
            Response(id=id, text=text, metadata=meta)
            for id, text, meta in zip(ids, texts, metadata)
        ]

        return responses

    def query(
        self, prompt: str, metadata_filter: dict | None = None, top_k: int = 5
    ) -> str:
        """
        Returns results from the vector database.
        """
        vector = self.embeddings.embed_query(prompt)

        raw_responses = self.index.query(
            vector, filter=metadata_filter, top_k=top_k, include_metadata=True
        )

        print(f"Raw responses: {raw_responses}")

        responses = self._format_response(raw_responses)

        print(f"Formatted responses: {responses}")

        response_dicts = [response.to_dict() for response in responses]
        json_str = json.dumps(response_dicts)

        return json_str

    def query_with_document_id(self, prompt: str, document_id: str):
        return self.query(prompt=prompt, metadata_filter={"document_id": document_id})

    # TODO
    # Missing:
    # rerank,
    # chat with many documents
    # delete document
    # implementation to other document types

    def from_existing_index(self, doc_ids):
        print(f"Fetching documents with ids: {doc_ids}")
        # Fetch vectors and their associated metadata
        pass
        # results = pinecone.fetch(index_name=INDEX_NAME, ids=doc_ids)
        # return results

    def delete_documents(self, document_id):
        print(f"Deleting documents with id: {document_id}")
        pass
        # Delete specific documents from the index
        # return pinecone.delete(index_name=INDEX_NAME, ids=[document_id])
