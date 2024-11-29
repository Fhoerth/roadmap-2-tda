#!/bin/bash
set -e

BACKEND_PG_HOST=${BACKEND_PG_HOST:-backend}
PGADMIN_PG_HOST=${PGADMIN_PG_HOST:-pgadmin}

cat <<EOF > /etc/postgresql/pg_hba.conf
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
host    all             all             ${BACKEND_PG_HOST:-backend}        md5
host    all             all             ${PGADMIN_PG_HOST:-pgadmin}        md5
host    all             all             0.0.0.0/0               md5
EOF

# Establecer permisos correctos para que PostgreSQL lo lea
chown postgres:postgres /etc/postgresql/pg_hba.conf
chmod 600 /etc/postgresql/pg_hba.conf

export POSTGRES_PORT=${PORT:-5432}

echo $POSTGRES_PORT

exec docker-entrypoint-original.sh postgres -c port=$POSTGRES_PORT -c hba_file=/etc/postgresql/pg_hba.conf

# -c listen_addresses="${BACKEND_PG_HOST},${PGADMIN_PG_HOST},localhost"
