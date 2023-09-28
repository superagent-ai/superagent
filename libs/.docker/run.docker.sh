## To run in docker the backend locally (API, DB, motorhead etc.)

docker compose down && docker-compose --env-file docker.env up --build -d

## This will only run the DB and API in docker
## You can then run the UI locally with `npm run dev` and the motorhead in cloud for example

# docker-compose --env-file docker.env -f docker-compose.pgdb.yml -f docker-compose.api.yml up --build -d
