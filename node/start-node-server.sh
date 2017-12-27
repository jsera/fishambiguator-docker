#!/bin/bash

cd /srv/node
npm install
sequelize db:migrate
foreman run nodemon
