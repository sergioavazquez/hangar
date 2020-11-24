# Initial docker image
FROM node:12.19.1
# Set node as user and group for the app
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Container internal path.
WORKDIR /home/node/app
# Copy project's package.json to workdir to install dependencies
COPY package*.json ./
USER node

RUN npm install

COPY --chown=node:node . .

# This is needed to build the image but not otherwise.
# EXPOSE 3000
# CMD ["npm", "start"]

# Useful for debugging to keep container running.
# CMD tail -f /dev/null