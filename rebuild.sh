docker-compose -p $(basename $PWD) -f .devcontainer/docker-compose.yml up -d --force-recreate --renew-anon-volumes
