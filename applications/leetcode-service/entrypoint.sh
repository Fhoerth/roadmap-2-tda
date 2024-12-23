#!/bin/bash

set -ex

echo "Environment Variables:"
printenv | sort

echo "WAYLAND_DISPLAY: '$WAYLAND_DISPLAY'"
echo "HOST_OSTYPE: '$HOST_OSTYPE'"

if [[ "$HOST_OSTYPE" == "darwin"* ]]; then
    export DISPLAY=host.docker.internal:0
    echo "Configured DISPLAY for macOS: $DISPLAY"
else
    if [[ -n "$WAYLAND_DISPLAY" ]]; then
        export DISPLAY=$WAYLAND_DISPLAY
        echo "Configured Wayland DISPLAY: $DISPLAY"
    else
        export DISPLAY=:0
        echo "Configuring default DISPLAY for Linux: $DISPLAY"
    fi
fi

echo "Initializing service..."
npm run start

exec "$@"
