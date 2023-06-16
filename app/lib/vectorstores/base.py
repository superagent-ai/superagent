from decouple import config
from typing import Any


class VectorStoreBase:
    def __init__(self):
        # Determine the database here (e.g., based on environment variables or configuration file)
        self.vectorstore = config("VECTORSTORE", default="pinecone")

    def get_database(self):
        if self.vectorstore == 'pinecone':
            from app.lib.vectorstores.pinecone import PineconeVS
            return PineconeVS()