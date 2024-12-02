#!/bin/bash
dos2unix mvnw || true

SPRING_CONFIG_LOCATION="$(pwd)/src/main/resources/application.yml"

./mvnw spring-boot:run \
  -Dspring-boot.run.arguments="--spring.config.location=file:$SPRING_CONFIG_LOCATION" &

while true; do
  inotifywait -e modify,create,delete,move -r /backend/src &&
  ./mvnw compile -DskipTests
  PID=$(lsof -t -i:$PORT)
  if [ -n "$PID" ]; then
    echo "Killing process $PID on port $PORT"
    kill -9 $PID
  fi
  ./mvnw spring-boot:run \
    -Dspring-boot.run.arguments="--spring.config.location=file:$SPRING_CONFIG_LOCATION" &
done
