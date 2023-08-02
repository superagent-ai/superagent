# Run Superagent locally with Docker and docker-compose

## Setup environment variables first

1. Create and fill in the API and UI environment variables. Check the `README` for both the API and the UI for details.

   ``` bash
   # create the api env file
   cp .env.example .env

   # create the ui env file
   cp ui/.env.example ui/.env
   ```

2. Copy the `.docker/docker.example.env` into a `docker.env` file.

   ``` bash
   # the example values are placeholders but they will work just fine locally.
   cp .docker/docker.example.env .docker/docker.env
   ```

3. Set the NETWORK_HOST mode suitable for your setup:

   ``` bash
   # Default docker network, same as not having set NETWORK_HOST in docker-compose files. 
   NETWORK_HOST=superagent_default

   # Simulate running the docker resources on localhost
   NETWORK_HOST=host

   # Custom network, for some cloud deployments
   NETWORK_HOST=mycustom_network_name
   ```

   If running `superagent_default` mode, you may need to add the docker host names for the services to your `hosts` file on Windows, then use these values in place of `localhost` or `127.0.0.1` in your `.env` files. This is especially needed when running the UI in docker as the browser will not be able to access the docker host, while the UI server code can.

   - Open a text editor as admin (right click icon, 'Run as administrator')
   - Open the file `C:\Windows\System32\drivers\etc\hosts`
   - Add the following lines at the bottom

   ``` bash
   127.0.0.1		superagent-api
   127.0.0.1		superagent-ui
   127.0.0.1		pgdb
   127.0.0.1		pgadmin
   ```

   You can then access any of these resources, running in docker, using these host names in your `.env` files and in the browser. e.g `http://superagent-ui:3000`, `http://superagent-api:8080`, `http://pgadmin:5050`

4. In order to connect to the db running in docker, with the example values from `docker.env`, set the following in the root `.env`. Set the `DATABASE_URL` and `DATABASE_MIGRATION_URL` to the same value and comment out, or remove the `DATABASE_SHADOW_URL`

   - root `.env`

    ``` bash
    # .env
    # 'superbase_default' network mode
    DATABASE_URL=postgresql://admin:password@pgdb:5432/superagent
    DATABASE_MIGRATION_URL=postgresql://admin:password@pgdb:5432/superagent
    # DATABASE_SHADOW_URL= # Mandatory for Neon DB

    # 'host' network mode
    DATABASE_URL=postgresql://admin:password@locahost:5432/superagent
    DATABASE_MIGRATION_URL=postgresql://admin:password@localhost:5432/superagent
    # DATABASE_SHADOW_URL= # Mandatory for Neon DB
    ```

    - `ui/.env`

    ``` bash
    # 'superbase_default' network mode
    NEXTAUTH_URL="http://superagent-ui:3000"
    NEXT_PUBLIC_SUPERAGENT_API_URL="http://superagent-api:8080/api/v1"

    # 'host' network mode
    NEXTAUTH_URL="http://localhost:3000"
    NEXT_PUBLIC_SUPERAGENT_API_URL="http://127.0.0.1:8080/api/v1"
    ```

## Run Superagent with docker-compose

After you have carefully set all the values in both the root `.env`, `ui/.env` and `.docker/docker.env` files, you can spin everything up in docker:

### Run API and a Postgres DB together

The default `docker-compose.yml` file will run the API and a Postgres DB (including the PGAdmin tool), meaning you can run the UI either locally with npm or in docker seperately.

``` bash
cd .docker
docker-compose --env-file docker.env up --build -d

# OR: Optionally also start the UI in docker too.
docker-compose --env-file docker.env -f docker-compose.yml -f docker-compose.ui.yml up --build -d

# you can spin everything down with
docker compose --env-file docker.env down

# It's often best to make sure the last run is shut down everytime to avoid issues, combine down and up commands:
docker compose --env-file docker.env down && docker-compose --env-file docker.env up --build -d

```

### Run any single part individually or in combination with docker-compose

You can run just the bits you need in docker, meaning you can run the UI locally with npm, or the API with venv/conda locally to develop, while only running dependencies in docker for example.

Or if you are developing only the UI for example, you could just run both the API and DB in docker, while running the UI with npm locally, any combination is fine.

``` bash
cd .docker

# Run just the Postgress DB 
docker-compose --env-file docker.env -f docker-compose.pgdb.yml up --build -d

# Run just the UI
docker-compose --env-file docker.env -f docker-compose.ui.yml up --build -d

# Run just the API
docker-compose --env-file docker.env -f docker-compose.api.yml up --build -d

# Run the DB and the UI together
docker-compose --env-file docker.env -f docker-compose.pgdb.yml -f docker-compose.ui.yml up --build -d

# Run everything, the DB, the API and the UI together
docker-compose --env-file docker.env -f docker-compose.yml -f docker-compose.ui.yml up --build -d

```

## Viewing logs in the Docker containers

Each container is named so you can easily view the logs using docker on the CMD line

``` bash
# UI logs
docker logs superagent-ui -f

# API logs
docker logs superagent-api -f

# DB logs
docker logs superagent-pgdb -f

## Adminer logs
docker logs superagent-adminer -f
```
