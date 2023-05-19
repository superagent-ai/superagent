FROM python:3.11 AS builder
# Use the python latest image

RUN pip install poetry

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

WORKDIR /app

# Copy only dependency files for layer caching
COPY pyproject.toml poetry.lock ./

# Install the required packages of the application into .venv
RUN poetry install --without dev --no-root && rm -rf $POETRY_CACHE_DIR

COPY . ./

# Bind the port and refer to the app.py app
CMD exec gunicorn --bind :$PORT --workers 2 --worker-class uvicorn.workers.UvicornWorker  --threads 8 app.main:app
