## To run in docker the backend locally (API, DB, motorhead etc.)

# Check if the network exists
if ! docker network ls | grep -q superagent_network; then
  # Create the network if it does not exist
  docker network create superagent_network
fi

docker compose down && docker-compose up --build -d
# docker compose down && docker-compose --env-file .env -f superagent/docker-compose.api.yml -f ui/docker-compose.ui.yml up --build -d
# docker compose down && docker-compose -f docker-compose.yml -f ui/docker-compose.ui.yml up --build -d

## This will only run the DB and API in docker
## You can then run the UI locally with `npm run dev` and the motorhead in cloud for example

# docker-compose --env-file docker.env -f docker-compose.pgdb.yml -f docker-compose.api.yml up --build -d

docker logs superagent-ui -f