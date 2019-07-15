# Docker Image

We provide a single Docker image that provides both the REST API as well as the web frontend. This image relies on the master branch of the GitHub repository (<https://github.com/xJREB/ms-scenario-evaluation>), i.e. it does not respect local changes.

```bash
# building the application image locally (not necessary, because it will be pulled from DockerHub otherwise)
docker build -t xjreb/ms-scenario-evaluation -f docker/Dockerfile .

# start MongoDB container
docker run --name ms-scenario-evaluation-db -p 27017:27017 -d mongo:4

# get IP from the MongoDB container, e.g. 172.17.0.3 (needs to be passed to the application container)
docker inspect ms-scenario-evaluation-db

# run application container
docker run --name ms-scenario-evaluation \
    -p 8000:80 \
    -p 3000:3000 \
    -e DB_HOST=172.17.0.3:27017 \
    -d xjreb/ms-scenario-evaluation

# UI will be available at http://localhost:8000
# API will be available at http://localhost:3000
# Swagger UI will be available at http://localhost:3000/api-docs
```

## Docker-Compose

We also provide a docker-compose file to start everything with a single command. Simply download the `docker/docker-compose.yaml` file to your local machine, then start with one of the following commands.

```bash
# start in foreground (abort with CTRL + c)
docker-compose up

# UI will be available at http://localhost:8000
# API will be available at http://localhost:3000
# Swagger UI will be available at http://localhost:3000/api-docs

# start in daemonized mode (background)
docker-compose up -d

# stop the daemonized components (containers won't be deleted)
docker-compose stop

# stop and remove the daemonized components (containers will be deleted)
docker-compose down
```
