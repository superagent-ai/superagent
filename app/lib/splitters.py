from langchain.text_splitter import (
    CharacterTextSplitter,
    NLTKTextSplitter,
    RecursiveCharacterTextSplitter,
    SpacyTextSplitter,
    TokenTextSplitter,
)


class TextSplitters:
    def __init__(self, documents, text_splitter):
        self.documents = documents
        if text_splitter is None:
            self.split_type = "recursive"
            self.chunk_size = 1000
            self.chunk_overlap = 0

        else:
            self.split_type = text_splitter["type"]
            self.chunk_size = text_splitter["chunk_size"]
            self.chunk_overlap = text_splitter["chunk_overlap"]

    def document_splitter(self):
        if self.split_type == "character":
            return self.character_splitter()
        elif self.split_type == "recursive":
            return self.recursive_splitter()
        elif self.split_type == "token":
            return self.token_splitter()
        elif self.split_type == "spacy":
            return self.spacy_splitter()
        elif self.split_type == "nltk":
            return self.nltk_splitter()
        elif self.split_type == "huggingface":
            return self.huggingface_splitter()
        else:
            return self.character_splitter()

    def character_splitter(self):
        """
        Splits a document into chunks of characters using the
        character text splitter (default)
        """
        text_splitter = CharacterTextSplitter(
            chunk_size=self.chunk_size, chunk_overlap=self.chunk_overlap
        )
        docs = text_splitter.split_documents(self.documents)
        return docs

    def recursive_splitter(self):
        """
        Splits a document into chunks of characters
        using the recursive character text splitter
        """

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size, chunk_overlap=self.chunk_overlap
        )
        docs = text_splitter.split_documents(self.documents)
        return docs

    def token_splitter(self):
        """
        Splits a document into chunks of tokens using the token text splitter
        """

        text_splitter = TokenTextSplitter(
            chunk_size=self.chunk_size, chunk_overlap=self.chunk_overlap
        )
        docs = text_splitter.split_text(self.documents)
        return docs

    def spacy_splitter(self):
        """
        Splits a document into chunks of tokens using the spacy text splitter
        """

        text_splitter = SpacyTextSplitter(chunk_size=self.chunk_size)
        docs = text_splitter.split_text(self.documents)
        return docs

    def nltk_splitter(self):
        """
        Splits a document into chunks of tokens using the nltk text splitter
        """

        text_splitter = NLTKTextSplitter(chunk_size=self.chunk_size)
        docs = text_splitter.split_text(self.documents)
        return docs

    def huggingface_splitter(self):
        """
        Splits a document into chunks of tokens using the huggingface text splitter
        """

        try:
            from transformers import GPT2TokenizerFast
        except ImportError:
            raise ImportError(
                "transformers package not found, please install it with "
                "`pip install transformers`"
            )

        tokenizer = GPT2TokenizerFast.from_pretrained("gpt2")
        text_splitter = CharacterTextSplitter.from_huggingface_tokenizer(
            tokenizer, chunk_size=self.chunk_size, chunk_overlap=self.chunk_overlap
        )
        docs = text_splitter.split_text(self.documents)
        return docs
