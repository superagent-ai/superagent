docker compose down -v --remove-orphans

# Check if the network exists
if docker network ls | grep -q superagent_network; then
  # Create the network if it does not exist
  docker network rm superagent_network
fi

