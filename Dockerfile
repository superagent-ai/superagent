FROM python:3.11
# Use the python latest image

RUN pip install poetry

WORKDIR /app

# Copy only dependency files for layer caching
COPY pyproject.toml poetry.lock ./

# Install the required packages of the application into .venv
RUN poetry install --without dev --no-root

COPY . ./

# Bind the port and refer to the app.py app
CMD exec gunicorn --bind :$PORT --workers 2 --worker-class uvicorn.workers.UvicornWorker --timeout 0 --threads 8 app.main:app
