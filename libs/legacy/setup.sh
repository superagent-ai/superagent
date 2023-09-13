#!/bin/bash

# Create and activate the virtual environment
virtualenv venv
source venv/bin/activate

# Install dependencies using Poetry
poetry install

# Run Prisma migration
poetry run prisma migrate dev

# Start the application with auto-reload
uvicorn app.main:app --reload