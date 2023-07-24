import os
from supabase import create_client
from langchain.vectorstores.supabase import SupabaseVectorStore

supabase_url = os.environ['SUPABASE_URL']
supabase_key = os.environ['SUPABASE_KEY']

supabase_client = create_client(supabase_url, supabase_key)
supabase_table = "superagent"

class SupabaseVectorStore:

    def __init__(self):
        pass

    def from_documents(self, docs, embeddings, table_name):
        return SupabaseVectorStore.from_texts(
            texts=docs,
            embeddings=embeddings,
            table_name=supabase_table,
            client=supabase_client
        )
    
    def from_existing(self, embeddings, table_name):
         return SupabaseVectorStore(
            client=supabase_client,
            embedding=embeddings,
            table_name=supabase_table
        )
