#!/bin/bash
COMMAND=${1}
input="none"
output="none"

if [[ -z "${COMMAND}" ]];   # -z (string length is zero) and -n (string length is not zero)
then
    echo " ----- build_nginx_conf ----- "
    echo " Missing parameter:"
    echo "  ./build_nginx_conf.sh -http || -https"
    exit
fi

if [[ -z "${HANGAR_VERSION}" ]];
then
    echo " ----- build_nginx_conf ----- "
    echo " HANGAR_VERSION is not defined. "
    echo " If using this script directly, this is expected. "
    echo " This script requires variables defined in hangar.sh "
    exit
fi

if [[ "${COMMAND}" = '-http' ]];
then
    input=${HTTP_NGINX_TEMPLATE}
    output=${HTTP_NGINX_OUTPUT}
fi

if [[ "${COMMAND}" = '-https' ]];
then
    input=${HTTPS_NGINX_TEMPLATE}
    output=${HTTPS_NGINX_OUTPUT}
fi

if [[ "${input}" = 'none' || "${output}" = 'none' ]];
then
    echo " ----- build_nginx_conf ----- "
    echo " Missing input template / output paths."
    echo " Verify the following variables are declared in .env: "
    echo "   HTTP[S]_NGINX_TEMPLATE"
    echo "   HTTP[S]_NGINX_OUTPUT"
    exit
fi

if [[ -f ${output} ]];
then
    echo " ----- build_nginx_conf ----- "
    echo " ${output} already exists."
    read -p " Update existing file? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1
    rm -f ${output}
fi

echo " ----- build_nginx_conf ----- "
echo " Building Nginx .conf:"
echo "  From template: ${input}"
echo "  Output file: ${output}"

sed -e "
s/{HANGAR_PORT}/${HANGAR_PORT}/g;
s/{SERVER_PORT}/${SERVER_PORT}/g;
s/{APP_DOMAIN}/${APP_DOMAIN}/g
" ${input} > ${output}