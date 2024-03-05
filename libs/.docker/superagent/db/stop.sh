# Remove any running services
docker compose -f docker-compose.pgdb.yml \
        -f docker-compose.pgadmin.yml \
        down
        # -v # TODO: remove the -v flag when we have a persistent database
