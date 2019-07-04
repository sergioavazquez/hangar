#!/bin/bash
COMMAND=${1}
UPDATE_NGINX_CONFIG=${2}
USER="$(id -u):$(id -g)"

validate_https() {

    if [[ -z ${APP_DOMAIN} || ${APP_DOMAIN} = 'example.com' ]];
    then
        echo " ----- hangar https check failed ----- "
        echo " Setup a valid APP_DOMAIN in .env "
        return 1
    fi

    if [[ ! -d ./ssl_cert/etc/live ]];
    then
        echo " ----- hangar https check failed ----- "
        echo " Missing certificate. "
        echo " Run: "
        echo "  ./hangar.sh --cert-prod "
        return 1
    fi

    if [[ ! -f ./ssl_cert/dhparam/dhparam-2048.pem ]];
    then
        echo " ----- hangar https check failed ----- "
        echo " Missing Diffie-Hellman key. "
        echo " Run: "
        echo "  sudo openssl dhparam -out ./ssl_cert/dhparam/dhparam-2048.pem 2048 "
        echo " Be patient, it takes a while. "
        return 1
    fi

    if [[ ! -f ${HTTPS_NGINX_OUTPUT} || -n ${UPDATE_NGINX_CONFIG} ]];
    then
        eval ./utils/build_nginx_conf.sh -https
    fi

    echo " ----- hangar ----- "
    echo " https configured for: ${APP_DOMAIN}"
    echo " "

    return 0
}

if [[ -z "${COMMAND}" ]];   # -z (string length is zero) and -n (string length is not zero)
then
    echo " ----- hangar failed ----- "
    echo " Provide a command to run: -dev or -start"
    echo "  ./hangar.sh -dev"
    echo " Go to README.md for more info."
    echo " ---------------------------- "
    exit
fi

if [[ -f .env ]];   # -f checks if file exists
then
    # exports all variables in .env file for later use.
    set -o allexport; source .env; set +o allexport
    COMMAND=${1} # Override default command on .env
else
    echo " ----- hangar ----- "
    echo " Missing .env file. "
    echo " Try: "
    echo "   cp example.env .env "
    echo " Then update values in .env file "
    exit
fi

if [[ "${COMMAND}" = '-dev' ]];
then
    echo " ----- hangar ----- "
    echo " Running in dev mode "
    echo " ---------------------- "
    echo " Press ctrl+c to close "
    echo " ---------------------- "
    COMMAND='npm run dev'
    echo "Running docker-compose with ""${COMMAND}"
    COMMAND_PARAMS=${COMMAND} docker-compose -f docker-compose.develop.yml up
    exit
fi

# Beyond this point, Nginx .conf is necessary.
if [[ ! -f ${HTTP_NGINX_OUTPUT} || -n ${UPDATE_NGINX_CONFIG} ]];
then
    eval ./utils/build_nginx_conf.sh -http
fi

# if [[ ! -f ${HTTPS_NGINX_OUTPUT} || -n ${UPDATE_NGINX_CONFIG} ]];
# then
#     eval ./utils/build_nginx_conf.sh -https
# fi


if [[ "${COMMAND}" = '-start' ]];
then
    echo " ----- hangar ----- "
    echo " Running in production mode "
    echo " Docker will run as daemon. "
    echo " ---------------------- "
    echo " List running containers: "
    echo "  docker ps "
    echo " ---------------------- "
    echo " Stop running containers: "
    echo "  docker-compose stop "
    echo " ---------------------- "
    COMMAND='npm start'
    echo "Running docker-compose with ""${COMMAND}"
    COMMAND_PARAMS=${COMMAND} docker-compose up -d
    exit
fi

if [[ "${COMMAND}" = '-start-https' ]];
then
    # validate https configuration before launch
    validate_https
    if [[ $? -eq 1 ]];
    then
        exit
    fi
    echo " ----- hangar ----- "
    echo " Running in production mode "
    echo " Docker will run as daemon. "
    echo " ---------------------- "
    echo " List running containers: "
    echo "  docker ps "
    echo " ---------------------- "
    echo " Stop running containers: "
    echo "  docker-compose stop "
    echo " ---------------------- "
    COMMAND='npm start'
    exit
    echo "Running docker-compose with ""${COMMAND}"
    COMMAND_PARAMS=${COMMAND} docker-compose -f docker-compose.yml -f docker-compose.https.yml up -d
    exit
fi

exit

if [[ "${COMMAND}" = '--start' ]];
then
    echo " ----- hangar ----- "
    echo " Running in production mode "
    echo " ---------------------- "
    echo " List running containers: "
    echo "  docker ps "
    echo " ---------------------- "
    echo " Stop running containers: "
    echo "  docker-compose stop "
    echo " ---------------------- "
    COMMAND='npm start'
    echo "Running docker-compose with ""${COMMAND}"
    COMMAND_PARAMS=${COMMAND} docker-compose -f up
    exit
fi

if [[ "${COMMAND}" = '--cert-stage' ]];
then
    echo " ----- hangar ----- "
    echo " Running certbot: Stage test "
    echo " ---------------------- "
    echo " Press ctrl+c to close "
    echo " ---------------------- "
    COMMAND='npm start'
    echo "Running docker-compose with ""${COMMAND}"
    COMMAND_PARAMS=${COMMAND} docker-compose -f docker-compose.yml -f docker-compose.certbot.yml -f dc-certbot.stage.yml up
    exit
fi

if [[ "${COMMAND}" = '--cert-prod' ]];
then
    echo " ----- hangar ----- "
    echo " Running certbot: Generate certificate "
    echo " ---------------------- "
    echo " Press ctrl+c to close "
    echo " ---------------------- "
    COMMAND='npm start'
    echo "Running docker-compose with ""${COMMAND}"
    COMMAND_PARAMS=${COMMAND} docker-compose -f docker-compose.yml -f docker-compose.certbot.yml -f dc-certbot.prod.yml up
    exit
fi

if [[ "${COMMAND}" = '-test' ]];
then
    echo " ----- hangar ----- "
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
    echo " ----- hangar ----- "
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
    echo " ----- hangar ----- "
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
    echo " ----- hangar ----- "
    echo " Keeping container alive for debugging purposes "
    echo " Open another terminal and run: docker exec -it <name> sh "
    echo " ---------------------- "
    echo " Press ctrl+c to close "
    echo " ---------------------- "
    COMMAND='tail -f /dev/null'
fi

echo "Running docker-compose with ""${COMMAND}"
COMMAND_PARAMS=${COMMAND} docker-compose up

