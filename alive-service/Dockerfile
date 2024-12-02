FROM node:slim AS app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

RUN useradd -m puppeteer

WORKDIR /app

WORKDIR /app
COPY --chown=puppeteer:puppeteer package.json .
COPY --chown=puppeteer:puppeteer src/index.js .
COPY --chown=puppeteer:puppeteer src/config.js .
RUN npm install

USER puppeteer

EXPOSE ${PORT}

CMD ["node", "/app/index.js"]