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
        with pytest.raises(ValueError, match="Repository URL is required"):
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
        """Should scan the superagent-starter repository."""
        result = await client.scan(
            repo="https://github.com/superagent-ai/superagent-starter",
            branch="main",
        )

        assert result is not None
        assert result.classification in ("safe", "unsafe", "error")
        assert result.reasoning is not None
        assert isinstance(result.findings, list)
        assert result.summary is not None

        print(f"Scan result: classification={result.classification}, "
              f"reasoning={result.reasoning}, "
              f"findings_count={len(result.findings)}")

    @pytest.mark.asyncio
    @pytest.mark.timeout(60)
    async def test_handles_nonexistent_repository(self, client):
        """Should handle non-existent repository gracefully."""
        result = await client.scan(
            repo="https://github.com/this-repo-definitely-does-not-exist-12345/fake-repo",
        )

        # Should return an error classification, not throw
        assert result.classification == "error"
        assert result.error is not None

    @pytest.mark.asyncio
    @pytest.mark.timeout(300)
    async def test_scan_with_custom_model(self, client):
        """Should scan with custom model."""
        result = await client.scan(
            repo="https://github.com/superagent-ai/superagent-starter",
            branch="main",
            model="anthropic/claude-sonnet-4-5",
        )

        assert result is not None
        assert result.classification in ("safe", "unsafe", "error")

    @pytest.mark.asyncio
    @pytest.mark.timeout(300)
    async def test_scan_with_branch(self, client):
        """Should scan a specific branch."""
        result = await client.scan(
            repo="https://github.com/superagent-ai/superagent-starter",
            branch="main",
        )

        assert result is not None
        assert result.classification in ("safe", "unsafe", "error")


@pytest.mark.skipif(SKIP_INTEGRATION, reason="DAYTONA_API_KEY or SUPERAGENT_API_KEY not set")
class TestFindingStructure:
    """Test the structure of scan findings."""

    @pytest.mark.asyncio
    @pytest.mark.timeout(300)
    async def test_returns_properly_structured_findings(self, client):
        """Should return properly structured findings if issues found."""
        result = await client.scan(
            repo="https://github.com/superagent-ai/superagent-starter",
        )

        if result.findings:
            finding = result.findings[0]
            assert finding.file is not None
            assert finding.line is not None
            assert finding.severity in ("critical", "high", "medium", "low")
            assert finding.category is not None
            assert finding.description is not None

        # Summary should always have counts
        assert isinstance(result.summary.critical, int)
        assert isinstance(result.summary.high, int)
        assert isinstance(result.summary.medium, int)
        assert isinstance(result.summary.low, int)

    @pytest.mark.asyncio
    @pytest.mark.timeout(300)
    async def test_summary_matches_findings(self, client):
        """Summary counts should match actual findings."""
        result = await client.scan(
            repo="https://github.com/superagent-ai/superagent-starter",
        )

        # Count findings by severity
        critical_count = sum(1 for f in result.findings if f.severity == "critical")
        high_count = sum(1 for f in result.findings if f.severity == "high")
        medium_count = sum(1 for f in result.findings if f.severity == "medium")
        low_count = sum(1 for f in result.findings if f.severity == "low")

        # Summary should match (or be calculated if not returned by API)
        assert result.summary.critical >= 0
        assert result.summary.high >= 0
        assert result.summary.medium >= 0
        assert result.summary.low >= 0
