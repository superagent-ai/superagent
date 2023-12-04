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
RUN poetry install --no-root && rm -rf $POETRY_CACHE_DIR

FROM python:3.11 AS runtime

RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Read Docker arguments
ARG DATABASE_URL
ARG DATABASE_MIGRATION_URL
ARG OPENAI_API_KEY
ARG JWT_SECRET
ARG VECTORSTORE
ARG PINECONE_ENVIRONMENT
ARG PINECONE_API_KEY
ARG PINECONE_INDEX
ARG SUPERAGENT_TRACING

# Pass Docker arguments via environment variables
ENV DATABASE_URL=$DATABASE_URL
ENV DATABASE_MIGRATION_URL=$DATABASE_MIGRATION_URL
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV JWT_SECRET=$JWT_SECRET
ENV VECTORSTORE=$VECTORSTORE
ENV PINECONE_ENVIRONMENT=$PINECONE_ENVIRONMENT
ENV PINECONE_API_KEY=$PINECONE_API_KEY
ENV PINECONE_INDEX=$PINECONE_INDEX
ENV SUPERAGENT_TRACING=$SUPERAGENT_TRACING

ENV PATH="/app/.venv/bin:$PATH"
ENV PORT="8080"

COPY --from=builder /app/.venv /app/.venv

COPY . ./

# Migrate database
RUN prisma generate && prisma migrate deploy

# Bind the port and refer to the app.py app
CMD exec gunicorn --bind :$PORT --workers 2 --timeout 0  --worker-class uvicorn.workers.UvicornWorker  --threads 8 app.main:app
