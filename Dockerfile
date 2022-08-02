FROM node:16.15-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# node-gyp dependencies
RUN apk add --update --no-cache python3 make g++ && rm -rf /var/cache/apk/*

RUN npm i -g pnpm

# Files required by pnpm install
COPY .npmrc package.json pnpm-lock.yaml ./

# Install dependencies from pnpm-lock.yaml
RUN pnpm i --frozen-lockfile

COPY . .

RUN pnpm build

# Remove the packages specified in devDependencie
RUN pnpm prune --prod --no-optional

# By using the FROM statement again, we are telling Docker that it should create a new,
# fresh image without any connection to the previous one.
FROM node:16.15-alpine AS build

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./

# Copy node_modules from builder. This will contains only production dependencies
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy the built /dist folder from the builder image.
# This way we are only getting the /dist directory, without the devDependencies,
# installed in our final image.
COPY --from=builder /usr/src/app/dist ./dist

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

CMD [ "npm", "run", "start:prod" ]