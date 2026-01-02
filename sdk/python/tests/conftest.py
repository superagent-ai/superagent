"""
pytest configuration and fixtures
"""

import os
from pathlib import Path

import pytest
from dotenv import load_dotenv

# Load environment variables from root .env file
env_path = Path(__file__).parent.parent.parent.parent / ".env"
load_dotenv(env_path)


@pytest.fixture
def client():
    """Create a Safety Agent client for testing."""
    from safety_agent import create_client

    return create_client()
