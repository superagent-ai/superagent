from typing import Any

from decouple import config


class VectorStoreBase:
    def __init__(self):
        """
        Determine the vectorstore
        """
        self.vectorstore = config("VECTORSTORE", default="pinecone")

    def get_database(self) -> Any:
        if self.vectorstore == "pinecone":
            from app.lib.vectorstores.pinecone import PineconeVectorstore

            return PineconeVectorstore()
