docker-compose -p $(basename $PWD) -f .devcontainer/docker-compose.yml exec client ./k6 --vus 20 --iterations 200000 run /workspace/test/select-true.js
