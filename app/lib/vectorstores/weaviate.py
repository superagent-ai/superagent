import os

import weaviate
from decouple import config
from langchain.vectorstores.weaviate import Weaviate

weaviate_client = weaviate.Client(
    url=config("WEAVIATE_URL"),
    auth_api_key=config("WEAVIATE_API_KEY", None),  # Optional
)
weaviate_index = "superagent"


class WeaviateVectorStore:
    def __init__(self):
        pass

    def from_documents(self, docs, embeddings, index_name, namespace):
        Weaviate.from_texts(
            texts=docs,
            embeddings=embeddings,
            index_name=weaviate_index,
            namespace=namespace,
            client=weaviate_client,
        )

    def from_existing_index(self, embeddings, index_name, namespace):
        return Weaviate.from_existing_index(
            index_name=weaviate_index,
            embedding=embeddings,
            namespace=namespace,
            client=weaviate_client,
        )
