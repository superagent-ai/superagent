import requests

from typing import Any
from langchain.document_loaders import TextLoader
from prisma.models import Datasource
from tempfile import NamedTemporaryFile


class DataLoader:
    def __init__(self, datasource: Datasource):
        self.datasource = datasource

    def load(self) -> Any:
        if self.datasource.type == "TXT":
            return self.load_txt()
        elif self.datasource.type == "PDF":
            return self.load_pdf()
        elif self.datasource.type == "Markdown":
            return self.load_markdown()
        elif self.datasource.type == "GITHUB_REPOSITORY":
            return self.load_github()
        elif self.datasource.type == "WEBPAGE":
            return self.load_webpage()
        elif self.datasource.type == "NOTION":
            return self.load_notion()
        else:
            raise ValueError(f"Unsupported datasource type: {self.datasource.type}")

    def load_txt(self):
        file_response = requests.get(self.datasource.url).text
        with NamedTemporaryFile(suffix=".txt", delete=True) as temp_file:
            temp_file.write(file_response.encode())
            temp_file.flush()
            loader = TextLoader(file_path=temp_file.name)
            return loader.load_and_split()

    def load_pdf(self):
        # Implement PDF loading logic here
        pass

    def load_markdown(self):
        # Implement Markdown loading logic here
        pass

    def load_github(self):
        # Implement Github repository loading logic here
        pass

    def load_webpage(self):
        # Implement webpage loading logic here
        pass

    def load_notion(self):
        # Implement Notion loading logic here
        pass
