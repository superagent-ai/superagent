# Run Superagent locally with Docker and docker-compose

## Getting Started

In the `.docker` folder there are several docker-compose files available.

After you have carefully set all the values in both the root `.env`, `ui/.env` and `.docker/docker.env` files, you can spin everything up in docker:, see [Setup environment variables](#setup-environment-variables)

- `docker-compose.yml` - Main file, starts the Superagent API, a PostgresDB and PGAdmin to administer the DB, fine for most use cases (combine with other dockerfiles using the `-f` flag)
  
  ``` bash
  docker-compose --env-file docker.env up --build -d
  ```

- `docker-compose.ui.yml` - Starts the Superagent UI, run it with the API and DB by passing both files in with `-f`
  
  ``` bash
  docker-compose --env-file docker.env -f docker-compose.yml -f docker-compose.ui.yml up --build -d
  ```

- `docker-compose.api.yml` - Can be used to independently start Superagent API

  ``` bash
  docker-compose --env-file docker.env -f docker-compose.api.yml up --build -d
  ```

- `docker-compose.pgdb.yml` - Can be used to independently start the PostgresDB with PGAdmin

  ``` bash
  docker-compose --env-file docker.env -f docker-compose.pgdb.yml up --build -d
  ```

- `docker-compose.minio.yml` - Can be used to start a [Minio](https://github.com/minio/minio) server. Minio is a locally hostable swap in replacement for AWS S3, it has a UI and an AWS S3 compatible API, great for local development. See the section [Setting up Minio](#setting-up-minio-as-a-local-replacement-for-aws-s3) for details on additional setup needed

  ``` bash
  # Start it with everything else
  docker-compose --env-file docker.env -f docker-compose.yml -f docker-compose.ui.yml -f docker-compose.minio.yml up --build -d
  ```

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
   cp .env.example .env

   # create the ui env file
   cp ui/.env.example ui/.env
   ```

2. Copy the `.docker/docker.env.example` into a `docker.env` file.

   ``` bash
   # the example values are placeholders but they will work just fine locally.
   cp .docker/docker.env.example .docker/docker.env
   ```

3. Set the NETWORK_MODE mode suitable for your setup:

   You can create a custom network to use with `docker network create superagent_default` this will allow all the services to communicate with each other even if you start them seperately.

   ``` bash
   # Create and use a docker network.
   # Create the network first with `docker network create superagent_default`
   NETWORK_MODE=superagent_default

   # Or Simulate running the docker resources on localhost
   NETWORK_MODE=host
   ```

   If running `superagent_default` mode, you may need to add the docker host names for the services to your `hosts` file on Windows, then use these values in place of `localhost` or `127.0.0.1` in your `.env` files. This is especially needed when running the UI in docker as the browser will not be able to access the docker host, while the UI server code can.

   - Open a text editor as admin (right click icon, 'Run as administrator')
   - Open the file `C:\Windows\System32\drivers\etc\hosts`
   - Add the following lines at the bottom

   ``` bash
   127.0.0.1  superagent-api
   127.0.0.1  superagent-ui
   127.0.0.1  pgdb
   127.0.0.1  pgadmin
   127.0.0.1  minio
   ```

   You can then access any of these resources, running in docker, using these host names in your `.env` files and in the browser. e.g

   Superagent UI: `http://superagent-ui:3000`

   Superagent API: `http://superagent-api:8080`

   PGAdmin: `http://pgadmin:5050`

   Minio Console (web ui): `http://minio:9090`

   Minio S3 Compatible API: `http://minio:9000`

4. In order to connect to the db running in docker, with the example values from `docker.env`, set the following in the root `.env`. Set the `DATABASE_URL` and `DATABASE_MIGRATION_URL` to the same value and comment out, or remove the `DATABASE_SHADOW_URL`

   - root `.env`

    ``` bash
    # .env
    # 'superbase_default' network mode
    DATABASE_URL=postgresql://admin:password@pgdb:5432/superagent
    DATABASE_MIGRATION_URL=postgresql://admin:password@pgdb:5432/superagent
    # DATABASE_SHADOW_URL= # Mandatory for Neon DB

    # 'host' network mode
    DATABASE_URL=postgresql://admin:password@localhost:5432/superagent
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

## Viewing logs in the Docker containers

Each container is named so you can easily view the logs using docker on the CMD line

``` bash
# UI logs
docker logs superagent-ui -f

# API logs
docker logs superagent-api -f

# DB logs
docker logs pgdb -f

## Adminer logs
docker logs pgadmin -f

## Minio (S3) Logs
docker logs minio -f

```

## Setting up Minio as a local replacement for AWS S3

You will need to setup a few things to use Minio in place of AWS S3 locally. This is a very basic setup suitable for local use. See the the [Minio](https://github.com/minio/minio) github repo for other options if you want to deploy this to production.

1. Update `.docker/docker.env` with the user and pass for Minio
   This is used both for logging into the Minio web ui, the user is used as the S Key, the pass as the S3 secret. (you can set up other users to use as key and secret in the Minio web ui)

   ``` env
   MINIO_ROOT_USER:root
   MINIO_ROOT_PASSWORD:password
   ```

2. Update `ui/.env` with the setting for Minio in place of AWS S3, the region can be any, it's not used by minio, but will be needed by the AWS SDK.

   ``` env
   NEXT_PUBLIC_AWS_S3_BUCKET=superagent
   NEXT_PUBLIC_AWS_S3_REGION=eu-west-1
   NEXT_PUBLIC_AMAZON_S3_ACCESS_KEY_ID=root
   NEXT_PUBLIC_AMAZON_S3_SECRET_ACCESS_KEY=password
   NEXT_PUBLIC_AWS_OVERRIDE_S3_BASEURL=http://minio:9000
   ```

3. Unless you can use `NETWORK_MODE=host` with docker, then you will need to add minio to the hosts file

   ``` hosts
   127.0.0.1  minio
   ```

   The minio Web UI will be available at `http://minio:9090`. You can use this to add buckets and users etc.

   The minio S3 API is at `http://minio:9000`, this is used as the override base URL for S3.

4. Start up Minio along with Superagent, e.g the following starts API, DB, UI and Minio with docker.

   ``` bash
   docker-compose --env-file docker.env -f docker-compose.yml -f docker-compose.ui.yml -f docker-compose.minio.yml up --build -d
   ```

5. Setup a bucket in the Minio Console (UI)
   - Open the minio ui at `http:minio:9090`
   - login with the user from `MINIO_ROOT_USER` and password from `MINIO_ROOT_PASSWORD`
   - On the buckets tab, create a bucket called `superagent`, save it
   - Open the bucket, Set the policy to `Public`, this won't make it publicly available on the internet of course (unlike AWS S3), it just means you can read the files with their direct URL without using the API to authenticate.

You should now be able to upload files via Superagent, you can see the files in the object browser, where you can manage / delete them if needed
