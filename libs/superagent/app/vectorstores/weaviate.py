import logging
import uuid
from typing import Dict, List, Literal

import backoff
import weaviate
from decouple import config
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings  # type: ignore
from pydantic.dataclasses import dataclass

logger = logging.getLogger(__name__)


def _default_schema(index_name: str) -> Dict:
    return {
        "class": index_name,
        "properties": [
            {
                "name": "text",
                "dataType": ["text"],
            }
        ],
    }


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


class WeaviateVectorStore:
    def __init__(self, index_name: str = None) -> None:
        variables = {
            "WEAVIATE_URL": config("WEAVIATE_URL", None),
            "WEAVIATE_API_KEY": config("WEAVIATE_API_KEY", None),
        }

        for var, value in variables.items():
            if not value:
                raise ValueError(
                    f"Please provide a {var} via the " f"`{var}` environment variable."
                )

        auth = weaviate.auth.AuthApiKey(api_key=variables["WEAVIATE_API_KEY"])
        self.index_name = config("WEAVIATE_INDEX", "superagent")
        self.client = weaviate.Client(
            url=variables["WEAVIATE_URL"],
            auth_client_secret=auth,
        )
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002", openai_api_key=config("OPENAI_API_KEY")
        )

        logger.info(f"Initialized Weaviate Client with: {index_name}")  # type: ignore

    @backoff.on_exception(backoff.expo, Exception, max_tries=3)
    def _embed_with_retry(self, texts):
        return self.embeddings.embed_documents(texts)

    def _similarity_search_by_vector(
        self, embedding: List[float], datasource_id: str, k: int = 4
    ) -> List[Document]:
        """Look up similar documents by embedding vector in Weaviate."""
        vector = {"vector": embedding}
        query_obj = self.client.query.get(
            self.index_name, ["text", "datasource_id", "source"]
        )
        result = query_obj.with_near_vector(vector).with_limit(k).do()
        docs = []
        for res in result["data"]["Get"][self.index_name.capitalize()]:
            text = res.pop("text")
            if text is None or res.get("datasource_id") != datasource_id:
                continue
            docs.append(Document(page_content=text, metadata=res))
        return docs

    def embed_documents(self, documents: list[Document], batch_size: int = 100):
        texts = [d.page_content for d in documents]
        metadatas = [d.metadata for d in documents]

        if batch_size:
            self.client.batch.configure(batch_size=batch_size)

        schema = _default_schema(self.index_name)
        embeddings = self.embeddings.embed_documents(texts)

        # check whether the index already exists
        if not self.client.schema.exists(self.index_name):
            self.client.schema.create_class(schema)

        with self.client.batch as batch:
            for i, text in enumerate(texts):
                id = uuid.uuid4()
                data_properties = {
                    "text": text,
                }
                if metadatas is not None:
                    for key in metadatas[i].keys():
                        data_properties[key] = metadatas[i][key]

                _id = str(id)

                # if an embedding strategy is not provided, we let
                # weaviate create the embedding. Note that this will only
                # work if weaviate has been installed with a vectorizer module
                # like text2vec-contextionary for example
                params = {
                    "uuid": _id,
                    "data_object": data_properties,
                    "class_name": self.index_name,
                }
                if embeddings is not None:
                    params["vector"] = embeddings[i]

                batch.add_data_object(**params)

            batch.flush()

    def query_documents(
        self,
        prompt: str,
        datasource_id: str,
        top_k: int | None,
        _query_type: Literal["document", "all"] = "document",
    ) -> list[str]:
        if top_k is None:
            top_k = 5

        logger.info(f"Executing query with document id in namespace {datasource_id}")
        vector = self.embeddings.embed_query(prompt)
        results = self._similarity_search_by_vector(
            embedding=vector, k=top_k, datasource_id=datasource_id
        )
        return results

    def delete(self, datasource_id: str) -> None:
        try:
            pass
        except Exception as e:
            logger.error(f"Failed to delete {datasource_id}. Error: {e}")
