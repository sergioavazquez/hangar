#!/usr/bin/env bash

echo " ----- mongo_create_user ----- "
echo " This script creates a user for the database specified on .env "
echo " Creating a user: DB_USER with DB_PASSWORD for db DB_NAME"
echo " ----------------------------- "

mongo ${APP_MONGO_DB} \
        --host localhost \
        --port ${MONGO_PORT} \
        -u ${MONGO_ROOT_USER} \
        -p ${MONGO_ROOT_PASS} \
        --authenticationDatabase admin \
        --eval "db.createUser({user: '${APP_MONGO_USER}', pwd: '${APP_MONGO_PASS}', roles:[{role:'dbOwner', db: '${APP_MONGO_DB}'}]});"
