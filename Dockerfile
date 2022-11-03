#Stage 0: install base dependencies
# Use node version 16.15.1
FROM node:16.15.1-alpine3.16@sha256:c785e617c8d7015190c0d41af52cc69be8a16e3d9eb7cb21f0bb58bcfca14d6b AS dependencies

LABEL maintainer="Justin Kim <jkim452@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# define environment as production
ENV NODE_ENV production

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY --chown=node:node package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm ci --only=production
USER node
# Copy src to /app/src/
COPY --chown=node:node ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

#################################################################################
#Stage 1: build application
FROM node:16.15.1-alpine3.16@sha256:c785e617c8d7015190c0d41af52cc69be8a16e3d9eb7cb21f0bb58bcfca14d6b AS build

# Use /app as our working directory
WORKDIR /app
USER node
# copy the generated dependencies (node_modules/)
COPY --chown=node:node --from=dependencies /app /app
COPY --chown=node:node . .
CMD ["npm", "start"]
USER node
# We run our service on port 8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3 CMD [ curl --fail localhost:8080 || exit 1]
