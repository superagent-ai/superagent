"""
Integration tests for the scan() method using Daytona sandboxes.

These tests require:
- DAYTONA_API_KEY environment variable
- SUPERAGENT_API_KEY environment variable
- Network access to Daytona API

Run with: uv run pytest tests/test_scan.py -v
"""

import os

import pytest

from safety_agent import create_client


# Check if we have credentials for integration tests
DAYTONA_API_KEY = os.environ.get("DAYTONA_API_KEY")
SUPERAGENT_API_KEY = os.environ.get("SUPERAGENT_API_KEY")
SKIP_INTEGRATION = not DAYTONA_API_KEY or not SUPERAGENT_API_KEY


@pytest.fixture
def client():
    """Create a Safety Agent client for testing."""
    return create_client()


class TestInputValidation:
    """Test input validation (doesn't require credentials)."""

    @pytest.mark.asyncio
    async def test_requires_repository_url(self, client):
        """Should require repository URL."""
        with pytest.raises(ValueError, match="Repository URL is required"):
            await client.scan(repo=None)

    @pytest.mark.asyncio
    async def test_requires_https_or_git_url(self, client):
        """Should require https:// or git@ URL scheme."""
        with pytest.raises(ValueError, match="Repository URL must start with"):
            await client.scan(repo="http://github.com/user/repo")

        with pytest.raises(ValueError, match="Repository URL must start with"):
            await client.scan(repo="ftp://github.com/user/repo")

    @pytest.mark.asyncio
    async def test_validates_empty_repo_url(self, client):
        """Should reject empty repo URL."""
        with pytest.raises(ValueError, match="Repository URL must start with"):
            await client.scan(repo="")


class TestDaytonaCredentials:
    """Test Daytona credentials handling."""

    @pytest.mark.asyncio
    async def test_requires_daytona_credentials(self, client):
        """Should require Daytona API key."""
        original_key = os.environ.get("DAYTONA_API_KEY")
        try:
            os.environ.pop("DAYTONA_API_KEY", None)
            with pytest.raises(ValueError, match="Daytona API key required"):
                await client.scan(repo="https://github.com/user/repo")
        finally:
            if original_key:
                os.environ["DAYTONA_API_KEY"] = original_key


@pytest.mark.skipif(SKIP_INTEGRATION, reason="DAYTONA_API_KEY or SUPERAGENT_API_KEY not set")
class TestRealRepositoryScanning:
    """Integration tests that actually scan repositories."""

    @pytest.mark.asyncio
    @pytest.mark.timeout(300)  # 5 minute timeout
    async def test_scan_superagent_starter(self, client):
        """Should scan the superagent-starter repository and return structured response."""
        result = await client.scan(
            repo="https://github.com/superagent-ai/superagent-starter",
            branch="main",
        )

        # Check result field
        assert result.result is not None
        assert isinstance(result.result, str)
        assert len(result.result) > 0

        # Check usage field
        assert result.usage is not None
        assert isinstance(result.usage.input_tokens, int)
        assert isinstance(result.usage.output_tokens, int)
        assert isinstance(result.usage.reasoning_tokens, int)
        assert isinstance(result.usage.cost, float)
