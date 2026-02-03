"""
Tests for cold start fallback functionality
"""

import os
import pytest

from safety_agent.providers.superagent import (
    get_fallback_url,
    DEFAULT_FALLBACK_URL,
    DEFAULT_FALLBACK_TIMEOUT,
)
from safety_agent.providers import FallbackOptions
from safety_agent.types import ClientConfig


class TestGetFallbackUrl:
    """Test cases for get_fallback_url function."""

    def test_returns_client_option_when_provided(self, monkeypatch):
        """Should return client option when provided (highest priority)."""
        client_url = "https://custom-fallback.example.com/api/chat"
        monkeypatch.setenv("SUPERAGENT_FALLBACK_URL", "https://env-fallback.example.com/api/chat")

        result = get_fallback_url(client_url)

        assert result == client_url

    def test_returns_env_var_when_no_client_option(self, monkeypatch):
        """Should return environment variable when client option is not provided."""
        env_url = "https://env-fallback.example.com/api/chat"
        monkeypatch.setenv("SUPERAGENT_FALLBACK_URL", env_url)

        result = get_fallback_url(None)

        assert result == env_url

    def test_returns_default_when_nothing_set(self, monkeypatch):
        """Should return default constant when no client option or env var."""
        monkeypatch.delenv("SUPERAGENT_FALLBACK_URL", raising=False)

        result = get_fallback_url(None)

        assert result == DEFAULT_FALLBACK_URL

    def test_empty_string_client_option_falls_back_to_env(self, monkeypatch):
        """Should fall back to env var when client option is empty string."""
        env_url = "https://env-fallback.example.com/api/chat"
        monkeypatch.setenv("SUPERAGENT_FALLBACK_URL", env_url)

        result = get_fallback_url("")

        assert result == env_url


class TestFallbackConstants:
    """Test cases for fallback constants."""

    def test_default_fallback_url(self):
        """Default fallback URL should be the production endpoint."""
        assert DEFAULT_FALLBACK_URL == "https://superagent.sh/api/fallback"

    def test_default_fallback_timeout(self):
        """Default fallback timeout should be 5 seconds."""
        assert DEFAULT_FALLBACK_TIMEOUT == 5.0


class TestFallbackOptions:
    """Test cases for FallbackOptions dataclass."""

    def test_default_values(self):
        """FallbackOptions should have None defaults."""
        opts = FallbackOptions()

        assert opts.enable_fallback is None
        assert opts.fallback_timeout is None
        assert opts.fallback_url is None

    def test_custom_values(self):
        """FallbackOptions should accept custom values."""
        opts = FallbackOptions(
            enable_fallback=True,
            fallback_timeout=3.0,
            fallback_url="https://custom.example.com/api/chat",
        )

        assert opts.enable_fallback is True
        assert opts.fallback_timeout == 3.0
        assert opts.fallback_url == "https://custom.example.com/api/chat"


class TestClientConfig:
    """Test cases for ClientConfig with fallback options."""

    def test_client_config_accepts_fallback_options(self):
        """ClientConfig should accept fallback configuration."""
        config = ClientConfig(
            api_key="test-key",
            enable_fallback=True,
            fallback_timeout=3.0,
            fallback_url="https://custom.example.com/api/chat",
        )

        assert config.api_key == "test-key"
        assert config.enable_fallback is True
        assert config.fallback_timeout == 3.0
        assert config.fallback_url == "https://custom.example.com/api/chat"

    def test_client_config_default_fallback_values(self):
        """ClientConfig should have None defaults for fallback options."""
        config = ClientConfig(api_key="test-key")

        assert config.enable_fallback is None
        assert config.fallback_timeout is None
        assert config.fallback_url is None


class TestFallbackLogic:
    """Test cases for fallback logic behavior."""

    def test_fallback_enabled_by_default(self, monkeypatch):
        """Fallback should be enabled by default with production URL."""
        monkeypatch.delenv("SUPERAGENT_FALLBACK_URL", raising=False)

        fallback_url = get_fallback_url(None)

        # The default URL is a real endpoint, so fallback should be available
        fallback_available = fallback_url != "FALLBACK_ENDPOINT_PLACEHOLDER"
        assert fallback_available is True
        assert fallback_url == "https://superagent.sh/api/fallback"

    def test_fallback_url_override_via_env(self, monkeypatch):
        """Fallback URL can be overridden via environment variable."""
        custom_url = "https://custom-fallback.example.com/api/chat"
        monkeypatch.setenv("SUPERAGENT_FALLBACK_URL", custom_url)

        fallback_url = get_fallback_url(None)

        assert fallback_url == custom_url

    def test_default_url_when_no_env_var(self, monkeypatch):
        """Should use default URL when no env var is set."""
        monkeypatch.delenv("SUPERAGENT_FALLBACK_URL", raising=False)

        fallback_url = get_fallback_url(None)

        assert fallback_url == DEFAULT_FALLBACK_URL
        assert fallback_url == "https://superagent.sh/api/fallback"
