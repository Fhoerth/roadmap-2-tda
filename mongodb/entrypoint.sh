#!/bin/bash
set -e

PORT=${PORT:-27017}
MONGO_DB=${MONGO_DB:-admin}
MONGO_DB_USER=${MONGO_DB_USER:-root}
MONGO_DB_PASSWORD=${MONGO_DB_PASSWORD:-password}

echo $PORT
echo $MONGO_DB
echo $MONGO_DB_USER
echo $MONGO_DB_PASSWORD

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
use admin
if (!db.getUser("${MONGO_DB_USER}")) {
  db.createUser({
    user: "${MONGO_DB_USER}",
    pwd: "${MONGO_DB_PASSWORD}",
    roles: [
        { role: "readWrite", db: "${MONGO_DB}" },
        { role: "readWriteAnyDatabase", db: "admin" }
    ]
  });
}
EOF

mongod --shutdown
echo "MongoDB inicializado correctamente."

# Levantar MongoDB en modo normal
exec mongod --config /etc/mongod.conf

