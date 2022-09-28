FROM node:16.16.0-alpine

# Create app directory
WORKDIR /usr/src/app

# node-gyp dependencies
RUN apk add --update --no-cache python3 make g++ && rm -rf /var/cache/apk/*

RUN npm i -g pnpm

# Files required by pnpm install
COPY package.json pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

# App source
COPY . .

CMD [ "pnpm", "start:dev" ]