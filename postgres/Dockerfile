# FROM postgres:15

# # Copiamos el script init.sql
# COPY init.sql /docker-entrypoint-initdb.d/

# # Configuramos las variables de entorno

# # Exponemos el puerto (opcional, ya se configura en el docker-compose)
# EXPOSE ${PORT}

FROM postgres:15

ENV PORT=${PORT}
ENV POSTGRES_DB=${POSTGRES_DB}
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

EXPOSE ${PORT}

CMD ["postgres", "-c", "port=${PORT}"]

