#!/bin/bash

# Run Prisma migration
prisma migrate dev

# Start the application with auto-reload
gunicorn --bind :$PORT --workers 2 --timeout 0  --worker-class uvicorn.workers.UvicornWorker  --threads 8 app.main:app
