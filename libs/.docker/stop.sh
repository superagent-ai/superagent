# Remove any running services
docker compose -f docker-compose.yml \
        -f superagent/db/docker-compose.pgdb.yml \
        -f superagent/db/docker-compose.pgadmin.yml \
        -f superagent/motorhead/docker-compose.motorhead.yml \
        -f ui/docker-compose.ui.yml \
        down
        # -v # TODO: remove the -v flag when we have a persistent database
