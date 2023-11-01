#!/bin/bash

git pull
docker compose -f docker-compose.yaml --project-name eess up -d --build
