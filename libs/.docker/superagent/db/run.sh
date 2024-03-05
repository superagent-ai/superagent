# Remove any running services
./stop.sh

# Check if the network exists
if ! docker network ls | grep -q superagent_network; then
  # Create the network if it does not exist
  docker network create superagent_network
fi

# Run the db services
docker compose -f docker-compose.pgdb.yml \
        -f docker-compose.pgadmin.yml \
        up \
        --build \
        -d
        
docker logs pgdb