## To run everything in docker locally (UI, API, DB, etc.)

docker compose down && docker-compose --env-file docker.env up --build -d
## When developing just the UI locally, you can run the following:
## This will only run the DB and API in docker
## You can then run the UI locally with `npm run dev`

# docker-compose --env-file docker.env -f docker-compose.deps.yml -f docker-compose.api.yml up --build -d

## Or if you are only developing with the API, you can run the following:
##This will only run the DB and UI in docker
## you can then run the API locally with venv

# docker-compose --env-file docker.env -f docker-compose.deps.yml -f docker-compose.ui.yml up --build -d

## If you just want to run the DB in docker, so you can run API and UI locally

# docker-compose --env-file docker.env -f docker-compose.deps.yml up --build -d

## Any combimation of the above is possible, add one or more of the docker-compose files to the command
# docker-compose --env-file docker.env -f docker-compose.ui.yml up --build -d