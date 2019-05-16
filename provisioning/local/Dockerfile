FROM node:8.10
COPY package.json yarn.lock ./
RUN npm i -g yarn && yarn global add pm2 serverless && yarn install
WORKDIR /books
