FROM mongo:latest

RUN apt-get update && apt-get install -y wget gnupg && \
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add - && \
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/debian bullseye/mongodb-org/6.0 multiverse" > /etc/apt/sources.list.d/mongodb-org-6.0.list && \
    apt-get update && apt-get install -y mongodb-mongosh && \
    apt-get clean

WORKDIR /mongodb

COPY entrypoint.sh /etc/entrypoint.sh

ENV PORT=9995
ENV MONGO_INITDB_DATABASE=OVERRIDE_MONGO_INITDB_DATABASE
ENV MONGO_INITDB_ROOT_USERNAME=OVERRIDE_MONGO_INITDB_ROOT_USERNAME
ENV MONGO_INITDB_ROOT_PASSWORD=OVERRIDE_MONGO_INITDB_ROOT_PASSWORD

EXPOSE ${PORT}

RUN chmod +x /etc/entrypoint.sh

ENTRYPOINT ["/etc/entrypoint.sh"]