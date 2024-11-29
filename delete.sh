docker-compose down --volumes --remove-orphans
docker system prune -af --volumes
docker builder prune