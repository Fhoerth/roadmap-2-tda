#!/bin/bash

# Function to check if X11 is installed
check_x11_installed() {
    case "$(uname)" in
        Darwin) # macOS
            if ! command -v xquartz &>/dev/null; then
                echo "XQuartz is not installed. Please install it from https://www.xquartz.org/"
                exit 1
            fi
            ;;
        Linux) # Linux
            if ! command -v Xorg &>/dev/null; then
                echo "X11 is not installed. Please install X11 via your package manager (e.g., apt install xorg)."
                exit 1
            fi
            ;;
        CYGWIN*|MINGW32*|MSYS*|MINGW*) # Windows
            if ! command -v vcxsrv &>/dev/null; then
                echo "VcXsrv is not installed. Please install it from https://sourceforge.net/projects/vcxsrv/."
                exit 1
            fi
            ;;
        *)
            echo "Unsupported operating system."
            exit 1
            ;;
    esac
}

# Function to restart X11 (or XQuartz for macOS)
restart_x11() {
    case "$(uname)" in
        Darwin) # macOS
            echo "Restarting XQuartz..."
            pkill XQuartz || true
            open -a XQuartz
            sleep 2
            echo "XQuartz restarted successfully."
            ;;
        Linux) # Linux
            echo "Restarting X11 server..."
            pkill Xorg || true
            echo "Please start X11 manually (e.g., systemctl start display-manager or startx)."
            exit 1
            ;;
        CYGWIN*|MINGW32*|MSYS*|MINGW*) # Windows
            echo "Please restart VcXsrv manually. Automated restarts are not supported on Windows."
            ;;
        *)
            echo "Unsupported operating system."
            exit 1
            ;;
    esac
}

# Main script
echo "Checking if X11 is installed..."
check_x11_installed

echo "Restarting X11..."
restart_x11

echo "X11 setup completed successfully!"
