cd backend && ./format.sh && cd .. &&
cd frontend && yarn config set nodeLinker node-modules && yarn install && ./format.sh && yarn config set nodeLinker pnp && yarn install && cd ..