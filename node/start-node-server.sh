#!/bin/bash

cd /srv/node
npm install
sequelize db:migrate
nodemon
