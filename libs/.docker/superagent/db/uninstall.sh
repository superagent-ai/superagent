# Remove any running services
docker compose -f docker-compose.pgdb.yml \
        -f docker-compose.pgadmin.yml \
        down \
        -v \
        --remove-orphans