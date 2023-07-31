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
   `cp .docker/docker.example.env .docker/docker.env`
   ```

3. In order to connect to the db running in docker, with the example values from `docker.env`, set the following in the root `.env`. Set the `DATABASE_URL` and `DATABASE_MIGRATION_URL` to the same value and comment out, or remove the `DATABASE_SHADOW_URL`

    ``` bash
    # .env
    DATABASE_URL=postgresql://admin:password@localhost:5432/superagent
    DATABASE_MIGRATION_URL=postgresql://admin:password@localhost:5432/superagent
    # DATABASE_SHADOW_URL= # Mandatory for Neon DB
    ```

## Run Superagent with docker-compose

After you have carefully set all the values in both the root `.env`, `ui/.env` and `.docker/docker.env` files, you can spin everything up in docker:

### Run the UI. API and a Postgres DB together

``` bash
cd .docker
docker-compose --env-file docker.env up --build -d

# you can spin everything down with
docker compose down

# It's often best to combine these and run this everytime to avoid issues
docker compose down && docker-compose --env-file docker.env up --build -d

```

### Run any single part individually or in combination with docker-compose.

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

# Run the DB and the API together
docker-compose --env-file docker.env -f docker-compose.pgdb.yml -f docker-compose.api.yml up --build -d

# Run the DB and the UI together
docker-compose --env-file docker.env -f docker-compose.pgdb.yml -f docker-compose.ui.yml up --build -d

```
