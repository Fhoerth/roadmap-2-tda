FROM node:22-alpine as build

WORKDIR /frontend

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV MODE=production
ENV NODE_ENV=development

COPY package.json .yarnrc.yml .pnp.cjs .pnp.loader.mjs postinstall.js .
COPY . .

RUN npm install -g --force yarn
RUN corepack enable
RUN yarn set version berry
RUN yarn plugin import https://raw.githubusercontent.com/mhassan1/yarn-plugin-after-install/v0.6.0/bundles/@yarnpkg/plugin-after-install.js
RUN yarn install
RUN yarn clean
RUN yarn build

ENV PORT=9996

EXPOSE ${PORT}

CMD ["sh", "-c", "yarn serve -s dist -l $PORT --single"]