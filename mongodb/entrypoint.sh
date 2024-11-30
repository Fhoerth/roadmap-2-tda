#!/bin/bash
set -e

PORT=${PORT:-27017}
MONGO_INITDB_DATABASE=${MONGO_INITDB_DATABASE:-admin}
MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME:-root}
MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD:-password}


cat <<EOF > /etc/mongod.conf
net:
  port: ${PORT}
  bindIp: 0.0.0.0
EOF

mongod --config /etc/mongod.conf --fork --logpath /var/log/mongod.log

echo "Esperando a que MongoDB esté operativo..."
sleep 5

# Crear el usuario root solo si no existe
mongosh --host 127.0.0.1 --port ${PORT} <<EOF
use ${MONGO_INITDB_DATABASE}
if (!db.getUser("${MONGO_INITDB_ROOT_USERNAME}")) {
  db.createUser({
    user: "${MONGO_INITDB_ROOT_USERNAME}",
    pwd: "${MONGO_INITDB_ROOT_PASSWORD}",
    roles: [{ role: "root", db: "admin" }]
  });
}
EOF

mongod --shutdown
echo "MongoDB inicializado correctamente."

# Levantar MongoDB en modo normal
exec mongod --config /etc/mongod.conf

