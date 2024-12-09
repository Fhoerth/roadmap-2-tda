#!/bin/bash

# Detectar si el sistema es Linux
if [[ "$(uname -s)" == "Linux" ]]; then
  echo "Sistema detectado: Linux. Ejecutando con Xvfb."
  Xvfb :99 -screen 0 1280x1024x24 &  # Iniciar Xvfb
  export DISPLAY=:99
fi

# Ejecutar la aplicación
echo "Iniciando la aplicación..."
npm run start
