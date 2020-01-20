#!/bin/sh
set -e
yarn install --frozen-lockfile
node ./server/server.js
