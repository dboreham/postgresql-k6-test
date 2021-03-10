docker-compose -p $(basename $PWD) -f .devcontainer/docker-compose.yml exec client ./k6 run --vus 20 --iterations 1000000 /workspace/test/select-indexed.js
