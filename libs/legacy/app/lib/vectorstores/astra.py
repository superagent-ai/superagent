import logging
import os
import uuid
from typing import Literal
import json
import requests

import backoff
# import pinecone
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings  # type: ignore
# from pinecone.core.client.models import QueryResponse
# from pydantic.dataclasses import dataclass

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


class Request:
    request_url: str
    request_header: dict

    def __init__(self, request_url: str, request_header: dict):
        """Core dataclass for single record."""
        self.request_url = request_url
        self.request_header = request_header

class AstraVectorStore:
    def __init__(
        self,
        astra_id: str = os.getenv("ASTRA_DB_ID", ""),
        astra_region: str = os.getenv("ASTRA_DB_REGION", "us-east1"),
        astra_application_token: str = os.getenv("ASTRA_DB_APPLICATION_TOKEN", ""),
        collection_name: str = os.getenv("COLLECTION_NAME", "test"),
        keyspace_name: str = os.getenv("KEYSPACE_NAME", "test"),
    ) -> None:
        if not astra_id:
            raise ValueError(
                "Please provide an Astra DB ID via the "
                "`ASTRA_DB_ID` environment variable."
            )

        if not astra_region:
            raise ValueError(
                "Please provide a Astra Region Name via the "
                "`ASTRA_DB_REGION` environment variable."
            )

        if not astra_application_token:
            raise ValueError(
                "Please provide a Astra token via the "
                "`ASTRA_DB_APPLICATION_TOKEN` environment variable."
            )

        if not collection_name:
            raise ValueError(
                "Please provide a Astra collection anme via the "
                "`COLLECTION_NAME` environment variable."
            )

        if not keyspace_name:
            raise ValueError(
                "Please provide a Astra keyspace via the "
                "`KEYSPACE_NAME` environment variable."
            )

        request_url = f"https://{ASTRA_DB_ID}-{ASTRA_DB_REGION}.apps.astra.datastax.com/api/json/v1/{KEYSPACE_NAME}/{COLLECTION_NAME}"
        request_headers = { 'x-cassandra-token': app_token,  'Content-Type': 'application/json'}
        astra_init = Request(request_url, request_headers)

        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002"
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
                ## need to implement upsert here using our json api methods
                res = self.index.upsert(vectors=to_upsert)
                logger.info(f"Upserted documents. {res}")
            except Exception as e:
                logger.error(f"Failed to upsert documents. Error: {e}")

        return self.index.describe_index_stats()


        ### For requesting from astra we can use this: to query
        # json.dumps({"find": {"sort": {"$vector": embedding},"options": {"limit": number}}})
        # requests.request("POST", astra_init.request_url, headers=astra_init.request_headers, data=payload).json()

        ### to insert:
        #to_insert = {"insertOne": {"document": {"document_id": document_id, "question_id": question_id, "answer":answer, "question":question,"$vector":embedding}}}
        #response = requests.request("POST", astra_init.request_url, headers=astra_init.request_headers, data=json.dumps(to_insert))

        

