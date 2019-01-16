echo " ----- mongo_create_test_user ----- "
echo " This script creates a user for the test database specified on .env "
echo " Creating a user: DB_TEST_USER with DB_TEST_PASS for db DB_TEST_NAME"
echo " ----------------------------- "

mongo ${TEST_MONGO_DB} \
        --host localhost \
        --port ${MONGO_PORT} \
        -u ${MONGO_ROOT_USER} \
        -p ${MONGO_ROOT_PASS} \
        --authenticationDatabase admin \
        --eval "db.createUser({user: '${TEST_MONGO_USER}', pwd: '${TEST_MONGO_PASS}', roles:[{role:'dbOwner', db: '${TEST_MONGO_DB}'}]});"