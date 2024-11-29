FROM postgres:15-alpine

RUN apk add --no-cache su-exec

WORKDIR /postgres

ENV PORT=5432
ENV POSTGRES_DB=OVERRIDE_DEFAULT_DB
ENV POSTGRES_USER=OVERRIDE_DEFAULT_USER
ENV POSTGRES_PASSWORD=OVERRIDE_DEFAULT_PASSWORD
ENV BACKEND_HOST=OVERRIDE_DEFAULT_BACKEND_HOST
ENV PGADMIN_HOST=OVERRIDE_DEFAULT_PG_ADMIN_HOST

COPY init.sql /docker-entrypoint-initdb.d/


RUN mkdir -p /etc/postgresql
RUN chown -R postgres:postgres /etc/postgresql
RUN chmod -R 0755 /etc/postgresql

RUN mv /usr/local/bin/docker-entrypoint.sh /usr/local/bin/docker-entrypoint-original.sh
COPY entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE ${PORT}

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
