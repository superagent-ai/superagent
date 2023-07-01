#!/bin/bash

# Create and activate the virtual environment
# Install dependencies using Poetry
poetry install

# Run Prisma migration
poetry shell

# Start the application with auto-reload
uvicorn app.main:app --reload