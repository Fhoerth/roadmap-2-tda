FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY index.js .
COPY config.js .

RUN npm install

ENV PORT=8080

EXPOSE ${PORT}

CMD ["node", "index.js"]