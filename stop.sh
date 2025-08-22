#!/bin/bash

# Colors
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Stop and remove the frontend container and its associated network
echo -e "${GREEN}Stopping and cleaning up Dynecron frontend development environment...${NC}"
docker compose -f docker-compose.yml down

echo -e "${GREEN}✅ Dynecron frontend development environment has been stopped and cleaned up.${NC}" 