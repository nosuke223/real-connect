FROM node:10.16.0

RUN npm install -g node-gyp
RUN npm install -g gulp

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm rebuild
RUN gulp