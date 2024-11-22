#!/bin/bash

echo "Starting backend build..."
cd backend
./gradlew clean build
cd ..
echo "Backend build completed."
echo "Starting Docker Compose..."
docker-compose up --build
