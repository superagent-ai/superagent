"""
pytest configuration and fixtures
"""

import pytest

from safety_agent import create_client


@pytest.fixture
def client():
    """Create a Safety Agent client for testing with a fake API key."""
    return create_client(api_key="test-key")
