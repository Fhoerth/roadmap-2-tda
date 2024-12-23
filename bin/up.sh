#!/bin/bash
./bin/setup-x11.sh
export OSTYPE=$OSTYPE && docker-compose --env-file .env up --build