#!/bin/bash

set -e

echo "Iniciando el diagnóstico y reparación de X11..."

# 1. Verificar si `xhost` está instalado
if ! command -v xhost &> /dev/null; then
  echo "El comando 'xhost' no está instalado. Instalándolo..."
  sudo apt-get update && sudo apt-get install -y x11-xserver-utils
fi

# 2. Verificar y configurar la variable DISPLAY
if [ -z "$DISPLAY" ]; then
  echo "La variable DISPLAY no está configurada. Estableciendo DISPLAY=:0..."
  export DISPLAY=:0
else
  echo "Variable DISPLAY detectada: $DISPLAY"
fi

# 3. Verificar el estado de /tmp/.X11-unix
if [ ! -d /tmp/.X11-unix ]; then
  echo "El directorio /tmp/.X11-unix no existe. Creándolo..."
  sudo mkdir -p /tmp/.X11-unix
  sudo chmod 1777 /tmp/.X11-unix
fi

# 4. Verificar permisos en /tmp/.X11-unix
echo "Verificando permisos en /tmp/.X11-unix..."
sudo chmod 1777 /tmp/.X11-unix

# 5. Eliminar posibles bloqueos de X11
echo "Eliminando posibles bloqueos en /tmp/.X11-unix..."
sudo rm -f /tmp/.X11-unix/X*
sudo rm -f /tmp/.X99-lock 2>/dev/null || true

# 6. Reiniciar XQuartz (solo para macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "Detectado macOS. Reiniciando XQuartz..."
  killall XQuartz 2>/dev/null || true
  brew uninstall --cask xquartz
  brew install --cask xquartz
  open -a XQuartz
  echo "Esperando a que XQuartz se inicie..."
  sleep 2
fi

# 2. Verificar y configurar la variable DISPLAY
if [ -z "$DISPLAY" ]; then
  echo "La variable DISPLAY no está configurada. Estableciendo DISPLAY=:0..."
  export DISPLAY=:0
else
  echo "Variable DISPLAY detectada: $DISPLAY"
fi

# 7. Habilitar conexiones de cualquier host para X11
echo "Habilitando conexiones de cualquier host para X11..."
xhost +

# 8. Verificar que X11 esté funcionando con xclock
echo "Probando X11 con xclock..."
if command -v xclock &> /dev/null; then
  xclock &
  sleep 5
  pkill xclock
  echo "X11 está funcionando correctamente."
else
  echo "xclock no está instalado. Instalándolo..."
  sudo apt-get install -y x11-apps
  echo "Instala xclock manualmente si no se instala automáticamente."
fi

echo "Diagnóstico y reparación de X11 completados."

ls -la /private/tmp/com.apple.launchd.*/*org.xquartz*
