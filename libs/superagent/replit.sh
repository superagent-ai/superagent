#!/bin/bash

# Install dependencies
poetry install

# Install prisma
poetry run prisma generate

# Migrate database
poetry run prisma migrate deploy

# Start the application with auto-reload
gunicorn --bind :8000 --workers 2 --timeout 0  --worker-class uvicorn.workers.UvicornWorker  --threads 8 app.main:app