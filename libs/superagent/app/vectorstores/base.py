import os
from typing import Any, Optional

from decouple import config

from app.vectorstores.astra import AstraVectorStore
from app.vectorstores.pinecone import PineconeVectorStore

# NOTE: Need an abstract class for the base vectorstore with defined methods


class VectorStoreBase:
    def __init__(self):
        """
        Determine the vectorstore
        """
        self.vectorstore = config("VECTORSTORE", default="pinecone")
        self.get_database()

    def get_database(self, index_name: Optional[str] = None) -> Any:
        if self.vectorstore == "pinecone":
            if index_name is None:
                index_name = os.getenv("PINECONE_INDEX", "superagent")
            return PineconeVectorStore(index_name=index_name)
        if self.vectorstore == "astra":
            if index_name is None:
                index_name = os.getenv("COLLECTION_NAME", "superagent")
            return AstraVectorStore(collection_name=index_name)
