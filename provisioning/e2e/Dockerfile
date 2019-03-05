# for local e2e
FROM cypress/base:10
WORKDIR /store-e2e
RUN npm install --save-dev cypress
RUN $(npm bin)/cypress verify
COPY cypress.json ./
COPY cypress ./cypress/

