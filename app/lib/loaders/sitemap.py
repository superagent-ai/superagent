import re
from xml.etree import ElementTree

import requests
from bs4 import BeautifulSoup
from langchain.schema import Document


class SitemapLoader:
    SITEMAP_NAMESPACE = "{http://www.sitemaps.org/schemas/sitemap/0.9}"

    def __init__(self, sitemap_url, filter_urls=None):
        self.sitemap_url = sitemap_url
        self.filter_urls = filter_urls if filter_urls else []

    def fetch(self, url):
        """Fetch content of a URL using requests."""
        response = requests.get(url)
        response.raise_for_status()  # Raise exception for HTTP errors
        return response.text

    def fetch_text(self, url):
        response = requests.get(url)
        response.raise_for_status()  # Raise exception for HTTP errors
        soup = BeautifulSoup(response.content, "html.parser")
        raw_text = soup.get_text(separator=" ").strip()
        cleaned_text = re.sub(r"\s+", " ", raw_text)

        return cleaned_text

    def matches_any_pattern(self, url):
        """Check if the URL matches any of the given patterns."""
        is_match = any(re.search(pattern, url) for pattern in self.filter_urls)

        if is_match:
            print(f"Matched URL: {url}")

        return is_match

    def fetch_sitemap_urls(self):
        """Fetch URLs from a sitemap.xml file and filter based on patterns."""
        sitemap_content = self.fetch(self.sitemap_url)

        # Parse XML content
        root = ElementTree.fromstring(sitemap_content)
        urls = [
            url_element.text
            for url_element in root.findall(
                f"{self.SITEMAP_NAMESPACE}url/{self.SITEMAP_NAMESPACE}loc"
            )
        ]

        # Filter URLs
        if self.filter_urls:
            urls = [url for url in urls if self.matches_any_pattern(url)]

        return urls

    def load(self):
        """Fetch content of each URL listed in a sitemap.xml file."""
        urls = self.fetch_sitemap_urls()

        return [
            Document(page_content=self.fetch_text(url), metadata={"url": url})
            for url in urls
        ]
