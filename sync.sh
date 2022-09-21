##!/usr/bin/env bash

# variables
GIT_PATH=git@gitlab.com:vidosign

#init
echo "init..."
if [ ! -d "data" ]
then
    mkdir data
    mkdir data/esdata
fi

#backend
echo "updating bakend..."
if [ -d "backend" ]
then
    cd backend
    git pull
    cd ..
else
    git clone $GIT_PATH/backend.git
fi

#panel
echo "updating panel..."
if [ -d "panel" ]
then
    cd panel
    git pull
    cd ..
else
    git clone $GIT_PATH/panel.git
fi

#web
echo "updating web..."
if [ -d "web" ]
then
    cd web
    git pull
    cd ..
else
    git clone $GIT_PATH/web.git
fi

#run docker-compose
echo "running docker compose..."
docker compose down -v
docker compose up -d --build
docker compose logs -f
