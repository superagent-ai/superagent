"""
Scan unit tests – input validation and credential checks only.
"""

import os

import pytest

from safety_agent import create_client


@pytest.fixture
def client():
    return create_client(api_key="test-key")


class TestInputValidation:
    """Test input validation (doesn't require credentials)."""

    @pytest.mark.asyncio
    async def test_requires_repository_url(self, client):
        with pytest.raises(ValueError, match="Repository URL is required"):
            await client.scan(repo=None)

    @pytest.mark.asyncio
    async def test_requires_https_or_git_url(self, client):
        with pytest.raises(ValueError, match="Repository URL must start with"):
            await client.scan(repo="http://github.com/user/repo")

        with pytest.raises(ValueError, match="Repository URL must start with"):
            await client.scan(repo="ftp://github.com/user/repo")

    @pytest.mark.asyncio
    async def test_validates_empty_repo_url(self, client):
        with pytest.raises(ValueError, match="Repository URL must start with"):
            await client.scan(repo="")


class TestDaytonaCredentials:
    """Test Daytona credentials handling."""

    @pytest.mark.asyncio
    async def test_requires_daytona_credentials(self, client):
        original_key = os.environ.get("DAYTONA_API_KEY")
        try:
            os.environ.pop("DAYTONA_API_KEY", None)
            with pytest.raises(ValueError, match="Daytona API key required"):
                await client.scan(repo="https://github.com/user/repo")
        finally:
            if original_key:
                os.environ["DAYTONA_API_KEY"] = original_key
