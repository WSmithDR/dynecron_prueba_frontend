#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to get container IP
get_container_ip() {
    local container_name=$1
    docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $container_name 2>/dev/null
}

# Function to get container port mapping
get_container_port() {
    local container_name=$1
    docker inspect -f '{{range $p, $conf := .NetworkSettings.Ports}}{{$p}} -> {{(index $conf 0).HostPort}}{{end}}' $container_name 2>/dev/null
}

# Function to get container command
get_container_command() {
    local container_name=$1
    docker inspect -f '{{.Config.Cmd}}' $container_name 2>/dev/null
}

# Function to get container environment
get_container_env() {
    local container_name=$1
    docker inspect -f '{{range .Config.Env}}{{println .}}{{end}}' $container_name 2>/dev/null
}

# 🧹 Stop any orphan containers from previous runs
echo -e "${BLUE}🧹 Cleaning up orphan containers (if any)...${NC}"
docker compose -f docker-compose.yml down --remove-orphans

# 🚀 Build and start the Frontend container in detached mode
echo -e "${BLUE}🚀 Starting 'dynecron_prueba_frontend' container in development mode...${NC}"
docker compose -f docker-compose.yml up -d --build

# Wait for container to be ready
sleep 3

# Get container information
FRONTEND_IP=$(get_container_ip dynecron_prueba_frontend)
FRONTEND_PORT=$(get_container_port dynecron_prueba_frontend)
FRONTEND_CMD=$(get_container_command dynecron_prueba_frontend)
FRONTEND_ENV=$(get_container_env dynecron_prueba_frontend)

# Display service information
echo -e "\n${BLUE}📡 Service Information:${NC}"
echo -e "${BLUE}----------------------------------------${NC}"
echo -e "${GREEN}🌐 Frontend App:${NC}"
echo -e "   • Container: dynecron_prueba_frontend"
echo -e "   • IP: ${FRONTEND_IP}"
echo -e "   • Port Mapping: ${FRONTEND_PORT}"
echo -e "   • Command: ${FRONTEND_CMD}"
echo -e "\n${GREEN}🔧 Environment:${NC}"
echo -e "${FRONTEND_ENV}"
echo -e "${BLUE}----------------------------------------${NC}"

# Check if services are running
if docker ps | grep -q dynecron_prueba_frontend; then
    echo -e "\n${GREEN}✅ Frontend is running successfully!${NC}"
else
    echo -e "\n${RED}❌ Frontend failed to start. Check logs with: docker compose -f docker-compose.yml logs${NC}"
fi

# Show logs
echo -e "\n${YELLOW}📋 Showing frontend logs (Ctrl+C to stop)...${NC}"
docker compose -f docker-compose.yml logs -f 