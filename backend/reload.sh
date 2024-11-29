#!/bin/bash

# Convertir mvnw a formato Unix si es necesario
dos2unix mvnw || true

# Definir la ubicación del archivo application.yml
SPRING_CONFIG_LOCATION="$(pwd)/src/main/resources/application.yml"

# Iniciar la aplicación Spring Boot con soporte para depuración, puerto dinámico y ubicación del archivo YML
./mvnw spring-boot:run \
  -Dspring-boot.run.arguments="--spring.config.location=file:$SPRING_CONFIG_LOCATION" &
# Observar cambios en el directorio de código fuente
while true; do
  inotifywait -e modify,create,delete,move -r /backend/src &&
  ./mvnw compile -DskipTests
done
