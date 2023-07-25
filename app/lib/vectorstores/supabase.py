import os

from decouple import config
from langchain.vectorstores.supabase import SupabaseVectorStore
from supabase import create_client

supabase_url = config("SUPABASE_URL")
supabase_key = config("SUPABASE_SERVICE_KEY")

supabase_client = create_client(supabase_url, supabase_key)
supabase_table = "superagent_vectorstore"


class SupabaseVectorStore:
    def __init__(self):
        pass

    def from_documents(self, docs, embeddings, namespace):
        return SupabaseVectorStore.from_documents(
            docs=docs,
            embeddings=embeddings,
            client=supabase_client,
            table_name=supabase_table,
            namespace=namespace,
        )

    def from_existing(self, embeddings, namespace):
        return SupabaseVectorStore.from_existing(
            client=supabase_client,
            table_name=supabase_table,
            embeddings=embeddings,
            namespace=namespace,
        )
