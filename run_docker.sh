#!/bin/bash
COMMAND=${1}
USER="$(id -u):$(id -g)"

if [[ -z "${COMMAND}" ]];   # -z (string length is zero) and -n (string length is not zero)
then
    echo " ----- run_docker failed ----- "
    echo "Provide a command to run: 'npm start' or 'npm run build'"
    echo "./run_docker.sh 'npm start'"
    echo " ---------------------------- "
    exit
fi

if [[ "${COMMAND}" = '-dev' ]];
then
    echo " ----- run_docker ----- "
    echo " Running in dev mode "
    echo " ---------------------- "
    echo " Press ctrl+c to close "
    echo " ---------------------- "
    COMMAND='npm run dev'
    echo "Running docker-compose with ""${COMMAND}"
    COMMAND_PARAMS=${COMMAND} docker-compose -f docker-compose.develop.yml up
    exit
fi

if [[ "${COMMAND}" = '-start' ]];
then
    echo " ----- run_docker ----- "
    echo " Running in production mode "
    echo " Docker will run as daemon. "
    echo " ---------------------- "
    echo " List running containers: "
    echo " docker ps "
    echo " ---------------------- "
    echo " Stop running containers: "
    echo " docker-compose stop "
    echo " ---------------------- "
    COMMAND='npm start'
    echo "Running docker-compose with ""${COMMAND}"
    COMMAND_PARAMS=${COMMAND} docker-compose up -d
    exit
fi

if [[ "${COMMAND}" = '-test' ]];
then
    echo " ----- run_docker ----- "
    echo " Running integration tests "
    echo " ---------------------- "
    echo " Press ctrl+c to close "
    echo " ---------------------- "
    COMMAND='npm run test:int'
    echo "Running docker-compose with ""${COMMAND}"
    COMMAND_PARAMS=${COMMAND} docker-compose -f docker-compose.yml -f docker-compose.test.yml up
    exit
fi

if [[ "${COMMAND}" = '-test_u' ]];
then
    echo " ----- run_docker ----- "
    echo " Running unit tests "
    echo " ---------------------- "
    echo " Press ctrl+c to close "
    echo " ---------------------- "
    COMMAND='npm run test:unit'
    echo "Running docker-compose with ""${COMMAND}"
    COMMAND_PARAMS=${COMMAND} docker-compose -f docker-compose.yml -f docker-compose.test.yml up
    exit
fi

if [[ "${COMMAND}" = '-test_d' ]];
then
    echo " ----- run_docker ----- "
    echo " Running tests with attached inspector for debugging "
    echo " Open another terminal and run: docker exec -it <name> sh "
    echo " ---------------------- "
    echo " Press ctrl+c to close "
    echo " ---------------------- "
    COMMAND='npm run test:dev'
    echo "Running docker-compose with ""${COMMAND}"
    COMMAND_PARAMS=${COMMAND} docker-compose -f docker-compose.yml -f docker-compose.test.yml up
    exit
fi

if [[ "${COMMAND}" = '-debug' ]];
then
    echo " ----- run_docker ----- "
    echo " Keeping container alive for debugging purposes "
    echo " Open another terminal and run: docker exec -it <name> sh "
    echo " ---------------------- "
    echo " Press ctrl+c to close "
    echo " ---------------------- "
    COMMAND='tail -f /dev/null'
fi

echo "Running docker-compose with ""${COMMAND}"
COMMAND_PARAMS=${COMMAND} docker-compose up