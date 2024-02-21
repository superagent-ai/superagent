FROM python:3.11 AS builder
# Use the python latest image

RUN pip install poetry

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1 \
    POETRY_CACHE_DIR=/tmp/poetry_cache \
    MAX_CONCURRENCY=20

WORKDIR /app

# Copy only dependency files for layer caching
COPY pyproject.toml poetry.lock ./

# Install the required packages of the application into .venv
RUN poetry install --no-root && rm -rf $POETRY_CACHE_DIR

FROM python:3.11 AS runtime

RUN apt-get update && apt-get install -y curl ca-certificates gnupg netcat-openbsd && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg && \
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x bookworm main" | tee /etc/apt/sources.list.d/nodesource.list && \
    apt-get update && \
    apt-get install -y nodejs

ENV PATH="/app/.venv/bin:$PATH"
ENV PORT="8080"

COPY --from=builder /app/.venv /app/.venv

COPY . ./

# Improve grpc error messages
RUN pip install grpcio-status

# Enable prisma migrations
RUN prisma generate

CMD exec gunicorn --bind :$PORT --workers 2 --timeout 0 --worker-class uvicorn.workers.UvicornWorker --threads 8 app.main:app
