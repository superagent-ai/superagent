# Check if the network exists
if ! docker network ls | grep -q superagent_network; then
  # Create the network if it does not exist
  docker network create superagent_network
fi

./stop.sh && docker compose up -d

docker logs weaviate