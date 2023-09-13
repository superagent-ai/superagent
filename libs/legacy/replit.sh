#!/bin/bash

# Get the currently installed Poetry version
CURRENT_POETRY_VERSION=$(poetry --version | awk '{print $3}')

# Check if Poetry is installed and if the version is lower than 1.5.1
if [[ -z "$CURRENT_POETRY_VERSION" || "$CURRENT_POETRY_VERSION" < "1.5.1" ]]; then
  # Install Poetry version 1.5.1
  pip install poetry==1.5.1
fi

# Install dependencies using Poetry
poetry install

# Install prisma
poetry run prisma generate

# Run Prisma migration
poetry run prisma migrate dev

# Start the application with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000