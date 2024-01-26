# flake8: noqa
import logging
import uuid
import typing
import vecs
import backoff
from decouple import config
from langchain.docstore.document import Document
from langchain.embeddings.openai import OpenAIEmbeddings  # type: ignore
from app.utils.helpers import get_first_non_null
from app.vectorstores.abstract import VectorStoreBase

logger = logging.getLogger(__name__)


class SupabaseVectorStore(VectorStoreBase):
    def __init__(
        self,
        options: dict,
        index_name: str = None,
        db_conn_url: str = None,
        url: str = None,
    ) -> None:
        self.options = options

        variables = {
            "SUPABASE_DB_URL": get_first_non_null(
                db_conn_url,
                options.get("SUPABASE_DB_URL"),
                config("SUPABASE_DB_URL", None),
            ),
            "SUPABASE_TABLE_NAME": get_first_non_null(
                index_name,
                options.get("SUPABASE_TABLE_NAME"),
                config("SUPABASE_TABLE_NAME", None),
            ),
        }

        for var, value in variables.items():
            if not value:
                raise ValueError(
                    f"Please provide a {var} via the " f"`{var}` environment variable."
                )

        # create vector store client
        self.client = vecs.create_client(variables["SUPABASE_DB_URL"])

        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-3-small", openai_api_key=config("OPENAI_API_KEY")
        )

        # create a collection named 'sentences' with 1536 dimensional vectors (default dimension for text-embedding-3-small)
        self.collection = self.client.get_or_create_collection(
            name=variables["SUPABASE_TABLE_NAME"], dimension=1536
        )

        logger.info(f"Initialized Supabase PgVector Client with: {self.collection.name}")  # type: ignore

    @backoff.on_exception(backoff.expo, Exception, max_tries=3)
    def _embed_with_retry(self, texts):
        return self.embeddings.embed_documents(texts)

    def embed_documents(self, documents: list[Document], batch_size: int = 100):
        texts = [d.page_content for d in documents]
        metadatas = [
            document.metadata.update({"content": document.page_content})
            or document.metadata
            for document in documents
        ]

        openai_embeddings = self.embeddings.embed_documents(texts)

        embeddings = []
        for i in range(len(texts)):
            embeddings.append((uuid.uuid4(), openai_embeddings[i], metadatas[i]))

        # upsert the embeddings into the the collection
        self.collection.upsert(records=embeddings)

        # create an index for the collection
        self.collection.create_index()

    def query_documents(
        self,
        prompt: str,
        datasource_id: str,
        top_k: int | None,
        _query_type: typing.Literal["document", "all"] = "document",
    ) -> list[str]:
        # create an embedding for the query sentence
        query_embedding = self.embeddings.embed_query(prompt)

        # query the collection for the most similar sentences
        results = self.collection.query(
            data=query_embedding,
            limit=top_k,
            include_metadata=True,
            filters={"datasource_id": {"$eq": datasource_id}},
        )

        docs = []
        for _, metadata in results:
            page_content = metadata["content"]
            # ommitting the document content from metadata
            del metadata["content"]
            docs.append(Document(page_content=page_content, metadata=metadata))
        return docs

    def delete(self, datasource_id: str) -> None:
        try:
            self.collection.delete(filters={"datasource_id": {"$eq": datasource_id}})
        except Exception as e:
            logger.error(f"Failed to delete {datasource_id}. Error: {e}")
