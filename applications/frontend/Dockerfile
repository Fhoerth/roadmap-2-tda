FROM node:22-alpine as build

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV MODE=production
ENV NODE_ENV=production

RUN mkdir -p /etc/secrets
RUN touch /etc/secrets/.env

WORKDIR /frontend

RUN cp /etc/secrets/.env .env

COPY package.json .yarnrc.yml
COPY . .

RUN npm install -g --force yarn
RUN corepack enable
RUN yarn set version berry
RUN yarn plugin import https://raw.githubusercontent.com/mhassan1/yarn-plugin-after-install/v0.6.0/bundles/@yarnpkg/plugin-after-install.js
RUN yarn install
RUN yarn build

ENV PORT=9996

EXPOSE ${PORT}

CMD ["sh", "-c", "yarn serve -s dist -l $PORT --single"]