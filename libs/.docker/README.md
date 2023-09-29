# Run Superagent locally with Docker and docker-compose

## Getting Started

In the `.docker` folder there are several docker-compose files available.

After you have carefully set all the values in both the root `superagent/.env`, `ui/.env` and `.docker/docker.env` files, you can spin the backend up in docker:, see [Setup environment variables](#setup-environment-variables)

- `docker-compose.yml` - Main file, starts the Superagent API, a PostgresDB and PGAdmin to administer the DB, fine for most use cases (combine with other dockerfiles using the `-f` flag)
  
  ``` bash
  docker-compose --env-file docker.env up --build -d
  ```

- `docker-compose.api.yml` - Can be used to independently start Superagent API

  ``` bash
  docker-compose --env-file docker.env -f docker-compose.api.yml up --build -d
  ```

- `docker-compose.pgdb.yml` - Can be used to independently start the PostgresDB with PGAdmin

  ``` bash
  docker-compose --env-file docker.env -f docker-compose.pgdb.yml up --build -d
  ```

- `docker-compose.mh.yml` - Can be used to start a [motorhead](https://github.com/getmetal/motorhead) server. Motorhead is a locally memory and information retrieval server for LLMs.

Stop everything with:

``` bash
docker-compose --env-file docker.env down

# Additionally remove orphaned containers if there are any
docker-compose --env-file docker.env down --remove-orphans

# Delete eveything including volumes images, this will result in total data loss
docker-compose --env-file docker.env down --rmi all -v

# Remove all unused networks
docker network prune

# To remove all stopped containers, unused networks, dangling images, and build cache, you can use:
docker system prune
```

## Setup environment variables

1. Create and fill in the API and UI environment variables. Check the `README` for both the API and the UI for details.

   ``` bash
   # create the api env file
   cp superagent/.env.example superagent/.env

   # create the ui env file
   cp ui/.env.example ui/.env
   ```

2. Copy the `.docker/docker.env.example` into a `docker.env` file.

   ``` bash
   # the example values are placeholders but they will work just fine locally.
   cp .docker/docker.env.example .docker/docker.env
   ```

3. Set the NETWORK_MODE mode suitable for your setup:

   You can create a custom network to use with `docker network create superagent_default` this will allow all the services to communicate with each other even if you start them seperately. If you run `a supabase data base for the frontend set the network as supabase_network_ui``.

   ``` bash
   # Create and use a docker network.
   # Create the network first with `docker network create superagent_default`
   NETWORK_MODE=superagent_default

   # Or Simulate running the docker resources on localhost
   NETWORK_MODE=host

   # Or run the docker resources on localhost the supabase network
   NETWORK_MODE=supabase_network_ui 
   ```

   If running `superagent_default` mode, you may need to add the docker host names for the services to your `hosts` file on Windows, then use these values in place of `localhost` or `127.0.0.1` in your `.env` files. This is especially needed when running the UI in docker as the browser will not be able to access the docker host, while the UI server code can.

   - Open a text editor as admin (right click icon, 'Run as administrator')
   - Open the file `C:\Windows\System32\drivers\etc\hosts`
   - Add the following lines at the bottom

   ``` bash
   127.0.0.1  superagent-api
   127.0.0.1  pgdb
   127.0.0.1  pgadmin
   127.0.0.1  motorhead
   ```

   You can then access any of these resources, running in docker, using these host names in your `superagent/.env` files and in the browser. e.g

   Superagent API: `http://superagent-api:8080`

   PGAdmin: `http://pgadmin:5050`

   Motorhead API: `http://motorhead:8081`

4. In order to connect to the db running in docker, with the example values from `docker.env`, set the following in the root `superagent/.env`. Set the `DATABASE_URL` and `DATABASE_MIGRATION_URL` to the same value and comment out, or remove the `DATABASE_SHADOW_URL`

   - `superagent/.env`

    ``` bash
    # .env
    # 'superbase_default' network mode or supabase network
    DATABASE_URL=postgresql://admin:password@pgdb:5432/superagent
    DATABASE_MIGRATION_URL=postgresql://admin:password@pgdb:5432/superagent
    # DATABASE_SHADOW_URL= # Mandatory for Neon DB

    # 'host' network mode
    DATABASE_URL=postgresql://admin:password@localhost:5432/superagent
    DATABASE_MIGRATION_URL=postgresql://admin:password@localhost:5432/superagent
    # DATABASE_SHADOW_URL= # Mandatory for Neon DB
    ```

    ``` bash
    # superagent/.env
    # to use the selfhosted motorhead set
    # Memory (mandatory)
    MEMORY_API_URL=http://motorhead:8081
    ```


    - `ui/.env`

    ``` bash
    # 'superbase_default' network mode or supabase
    NEXT_PUBLIC_SUPERAGENT_API_URL="http://superagent-api:8080/api/v1"

    # 'host' network mode
    NEXT_PUBLIC_SUPERAGENT_API_URL="http://127.0.0.1:8080/api/v1"
    ```

    ``` bash
    # online dashboard or local CLI dashboard
    NEXT_PUBLIC_SUPABASE_URL=
    NEXT_PUBLIC_SUPABASE_ANON_KEY=
    ```

## Viewing logs in the Docker containers

Each container is named so you can easily view the logs using docker on the CMD line

``` bash
# API logs
docker logs superagent-api -f

# DB logs
docker logs pgdb -f

## Adminer logs
docker logs pgadmin -f

## Motorhead logs
docker logs motorhead -f

```

