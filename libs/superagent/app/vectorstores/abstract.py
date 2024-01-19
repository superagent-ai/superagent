from abc import ABC, abstractmethod


class VectorStoreBase(ABC):
    @abstractmethod
    def embed_documents(self):
        pass

    @abstractmethod
    def query_documents():
        pass

    @abstractmethod
    def delete(self):
        pass
