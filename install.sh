cd frontend && npm i -g yarn && corepack enable && yarn set version berry && yarn config set nodeLinker node-modules && yarn install && cd ../ && cd backend && mvn dependency:go-offline && mvn clean install && cd ..