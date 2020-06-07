FROM node:14.4.0-alpine

WORKDIR /usr/src/app

RUN apk update && \
    npm install -g npm && \
    npm update -g yarn && \
    yarn global add @vue/cli@4.4.1
