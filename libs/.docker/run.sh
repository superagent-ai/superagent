# Remove any running services
./stop.sh

# Check if the network exists
if ! docker network ls | grep -q superagent_network; then
  # Create the network if it does not exist
  docker network create superagent_network
fi

# Run the core services
docker compose -f docker-compose.yml \
        -f superagent/db/docker-compose.pgdb.yml \
        -f superagent/db/docker-compose.pgadmin.yml \
        -f superagent/motorhead/docker-compose.motorhead.yml \
        -f ui/docker-compose.ui.yml \
        up \
        --build \
        -d
        
docker logs superagent-ui
docker logs superagent-api