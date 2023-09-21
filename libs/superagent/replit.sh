#!/bin/bash

# Install dependencies
poetry install

# Install prisma
poetry run prisma generate

# Start the application with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000