FROM python:3.11
# Use the python latest image
COPY . ./

# Copy the current folder content into the docker image
RUN pip install --no-cache-dir -r requirements.txt

# Bind the port and refer to the app.py app
CMD exec gunicorn --bind :$PORT --workers 2 --worker-class uvicorn.workers.UvicornWorker --timeout 0 --threads 8 app.main:app
