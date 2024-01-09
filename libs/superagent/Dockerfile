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

# RUN apt-get update && apt-get install -y curl && \
#     curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
#     apt-get install -y nodejs

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

RUN prisma generate
# RUN curl -o wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
#     && chmod +x wait-for-it.sh


# Bind the port and refer to the app.py app
# CMD prisma migrate deploy && exec gunicorn --bind :$PORT --workers 2 --timeout 0  --worker-class uvicorn.workers.UvicornWorker  --threads 8 app.main:app
# CMD ./wait-for-it.sh ${POSTGRES_DB_HOST}:5432 -- prisma migrate deploy && exec gunicorn --bind :$PORT --workers 2 --timeout 0 --worker-class uvicorn.workers.UvicornWorker --threads 8 app.main:app
# TODO: Move the network check and db push to compose file
# CMD echo 'waiting for ${POSTGRES_DB_HOST}:5432 to be available' && nc -zv ${POSTGRES_DB_HOST} 5432 && prisma migrate deploy && exec gunicorn --bind :$PORT --workers 2 --timeout 0 --worker-class uvicorn.workers.UvicornWorker --threads 8 app.main:app
CMD until nc -z ${POSTGRES_DB_HOST} 5432; do echo 'waiting for ${POSTGRES_DB_HOST}:5432 to be available'; sleep 1; done && prisma migrate deploy && exec gunicorn --bind :$PORT --workers 2 --timeout 0 --worker-class uvicorn.workers.UvicornWorker --threads 8 app.main:app
