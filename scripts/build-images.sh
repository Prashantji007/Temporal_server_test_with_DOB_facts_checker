#!/bin/bash

# Build Docker images for Kubernetes deployment

echo "Building DOB Facts application images..."

# Build backend image
echo "Building backend image..."
docker build -f Dockerfile.backend -t dob-facts-backend:latest .

# Build frontend image
echo "Building frontend image..."
docker build -f Dockerfile.frontend -t dob-facts-frontend:latest .

echo "Images built successfully!"
echo "Backend image: dob-facts-backend:latest"
echo "Frontend image: dob-facts-frontend:latest"

# Tag images for registry (uncomment and modify for your registry)
# docker tag dob-facts-backend:latest your-registry/dob-facts-backend:latest
# docker tag dob-facts-frontend:latest your-registry/dob-facts-frontend:latest

# Push to registry (uncomment and modify for your registry)
# docker push your-registry/dob-facts-backend:latest
# docker push your-registry/dob-facts-frontend:latest