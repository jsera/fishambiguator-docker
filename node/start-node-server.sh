#!/bin/bash

cd /srv/node
./wait-for-it.sh fish-db:5432
npm install
sequelize db:create
sequelize db:migrate
nodemon
