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

if [[ "${COMMAND}" = '-debug' ]];
then
    echo " ----- run_docker ----- "
    echo "Keeping container alive for debugging purposes"
    echo "Open another terminal and run: docker exec -it <name> sh "
    echo " ---------------------- "
    echo " Press ctrl+c to close "
    echo " ---------------------- "
    COMMAND='tail -f /dev/null'
fi

if [[ "${COMMAND}" = '-test' ]];
then
    echo " ----- run_docker ----- "
    echo "Keeping container alive for debugging purposes"
    echo "Open another terminal and run: docker exec -it <name> sh "
    echo " ---------------------- "
    echo " Press ctrl+c to close "
    echo " ---------------------- "
    COMMAND='npm run dev'
    echo "Running docker-compose with ""${COMMAND}"
    COMMAND_PARAMS=${COMMAND} CURRENT_UID=${USER} docker-compose -f docker-compose.yml -f docker-compose.test.yml up
    exit
fi


echo "Running docker-compose with ""${COMMAND}"
COMMAND_PARAMS=${COMMAND} CURRENT_UID=${USER} docker-compose up