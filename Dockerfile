# Initial docker image
FROM node:10.14
# Container internal path.
WORKDIR /usr/src/app
# Copy project's package.json to workdir to install dependencies
COPY package.json ./
RUN npm install

EXPOSE 3000

# This is needed to build the image but not otherwise.
# CMD ["npm", "start"]

# Useful for debugging to keep container running.
# CMD tail -f /dev/null