# Initial docker image
FROM node:10.14
# Create user and group and use them
# RUN groupadd -r nodejs && useradd -m -r -g nodejs nodejs
# USER nodejs
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