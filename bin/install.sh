cd ./applications/frontend && npm i -g yarn && corepack enable && yarn set version berry && \
yarn config set nodeLinker node-modules && yarn install && cd ../.. && \

cd ./applications/leetcode-service && \
pnpm i && cd ../.. && \

cd ./applications/backend && mvn dependency:go-offline -Dmaven.repo.local=.mvn/.m2 && cd ..