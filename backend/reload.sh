#!/bin/bash

# Convertir mvnw a formato Unix si es necesario
dos2unix mvnw || true

# Iniciar la aplicación Spring Boot con soporte para depuración
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005" &

# Observar cambios en el directorio de código fuente
while true; do
  inotifywait -e modify,create,delete,move -r /backend/src &&
  ./mvnw compile -DskipTests
done
