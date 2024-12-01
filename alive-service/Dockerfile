FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY index.js .
COPY config.js .

RUN npm install

CMD ["node", "index.js"]