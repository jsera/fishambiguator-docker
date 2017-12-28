#!/bin/bash

cd /srv/node
./wait-for-it.sh fish-db:5432
npm install
sequelize db:migrate
nodemon
