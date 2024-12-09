#!/bin/bash

echo "Sistema detectado: Linux. Ejecutando con Xvfb."
Xvfb :99 -screen 0 1280x1024x24 &
  export DISPLAY=:99

# Ejecutar la aplicación
echo "Iniciando la aplicación..."
npm run start
