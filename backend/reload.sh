#!/bin/bash
dos2unix mvnw || true
SPRING_CONFIG_LOCATION="$(pwd)/src/main/resources/application.yml"
./mvnw spring-boot:run \
  -Dspring-boot.run.arguments="--spring.config.location=file:$SPRING_CONFIG_LOCATION" &
while true; do
  inotifywait -e modify,create,delete,move -r /backend/src &&
  ./mvnw compile -DskipTests
done
