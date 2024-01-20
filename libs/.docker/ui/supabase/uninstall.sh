# Ensure Superagent is down first
cd ../../
./stop.sh
# Ensure supabase is down and remove volumes, delete local volume db data once down
cd ui/supabase
docker compose down -v --remove-orphans && rm -rf volumes/db/data/ && rm -rf volumes/storage

if docker network ls | grep -q superagent_network; then
  # Remove the network if it exists
  docker network remove superagent_network
fi
