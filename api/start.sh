#!/bin/bash

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    source $HOME/.cargo/env
fi

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment with uv using Python 3.12..."
    uv venv --python python3.12
fi

# Install dependencies
echo "Installing dependencies with uv..."
uv pip install -r requirements.txt --index-strategy unsafe-best-match

# Start the server
echo "Starting redaction API server on port 3000..."
uv run python main.py