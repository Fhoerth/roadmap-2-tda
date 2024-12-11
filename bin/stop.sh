#!/bin/bash

# Function to stop all running containers
stop_containers() {
    echo "Stopping all running containers..."
    docker ps -q | while read -r container_id; do
        docker stop "$container_id"
    done
}

# Function to stop all Docker Compose services
stop_compose_services() {
    echo "Stopping all Docker Compose services..."
    docker compose ls --all --format "table {{.Name}}" | tail -n +2 | while read -r compose_service; do
        docker compose -p "$compose_service" down
    done
}

# Main execution
stop_containers
stop_compose_services

echo "All Docker containers and services have been stopped!"
