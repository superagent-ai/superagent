import logging
from typing import Literal

import openai
from decouple import config
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings  # type: ignore
from qdrant_client import QdrantClient, models
from qdrant_client.http import models as rest
from qdrant_client.http.models import PointStruct

from app.utils.env import get_first_non_null

logger = logging.getLogger(__name__)


class QdrantVectorStore:
    def __init__(
        self,
        options: dict,
        index_name: str = config("QDRANT_INDEX", None),
        host: str = config("QDRANT_HOST", None),
        api_key: str = config("QDRANT_API_KEY", None),
    ) -> None:
        self.options = options
        self.index_name = get_first_non_null(
            index_name, self.options.get("QDRANT_INDEX")
        )
        self.host = get_first_non_null(
            host,
            self.options.get("QDRANT_HOST"),
            "https://xxxxxx-xxxxx-xxxxx-xxxx-xxxxxxxxx.us-east.aws.cloud.qdrant.io:6333",
        )
        self.api_key = get_first_non_null(api_key, self.options.get("QDRANT_API_KEY"))
        self.client = QdrantClient(
            url=self.host,
            api_key=self.api_key,
        )
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002", openai_api_key=config("OPENAI_API_KEY")
        )

        logger.info(f"Initialized Qdrant Client with: {self.index_name}")

    def embed_documents(
        self, documents: list[Document], _batch_size: int = 100
    ) -> None:
        collections = self.client.get_collections()
        if self.index_name not in [c.name for c in collections.collections]:
            self.client.recreate_collection(
                collection_name=self.index_name,
                vectors_config={
                    "content": rest.VectorParams(
                        distance=rest.Distance.COSINE,
                        size=1536,
                    ),
                },
            )
        points = []
        i = 0
        for document in documents:
            i += 1
            response = openai.embeddings.create(
                input=document.page_content, model="text-embedding-ada-002"
            )
            points.append(
                PointStruct(
                    id=i,
                    vector={"content": response.data[0].embedding},
                    payload={"text": document.page_content, **document.metadata},
                )
            )
        self.client.upsert(collection_name=self.index_name, wait=True, points=points)

    def query_documents(
        self,
        prompt: str,
        datasource_id: str,
        top_k: int | None,
        _query_type: Literal["document", "all"] = "document",
    ) -> list[str]:
        response = openai.embeddings.create(
            input=prompt, model="text-embedding-ada-002"
        )
        embeddings = response.data[0].embedding
        search_result = self.client.search(
            collection_name=self.index_name,
            query_vector=("content", embeddings),
            limit=top_k,
            query_filter=models.Filter(
                must=[
                    models.FieldCondition(
                        key="datasource_id",
                        match=models.MatchValue(value=datasource_id),
                    ),
                ]
            ),
            with_payload=True,
        )
        return search_result

    def delete(self, datasource_id: str) -> None:
        try:
            self.client.delete(
                collection_name=self.index_name,
                points_selector=models.FilterSelector(
                    filter=models.Filter(
                        must=[
                            models.FieldCondition(
                                key="datasource_id",
                                match=models.MatchValue(value=datasource_id),
                            ),
                        ],
                    )
                ),
            )
        except Exception as e:
            logger.error(f"Failed to delete {datasource_id}. Error: {e}")
