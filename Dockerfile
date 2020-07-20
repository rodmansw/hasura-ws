FROM node:12.18.2-buster-slim
LABEL mantainer="team@docker.app"

COPY . /api
WORKDIR /api

# Cleaning packages
RUN if [ -d /api/node_modules ]; then rm -rf /api/node_modules; fi

# Prisma not soportin slim and alpine images see: https://github.com/prisma/prisma/issues/1642
# Waiting for fix
RUN apt-get -qy update && apt-get -qy install openssl

# Install packages
RUN yarn install

# Create prisma client
RUN yarn prisma-gen

EXPOSE 4000

CMD yarn start
