cd ..
docker-compose down -v
docker-compose down --volumes --remove-orphans
docker system prune -af --volumes
docker builder prune
docker volume prune -f