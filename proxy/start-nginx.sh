#!/bin/bash

envsubst '${BASE_URL},${STATIC_SERVER}' < /site-base-config/sites-available/reverse > /etc/nginx/sites-available/reverse
ln -s /etc/nginx/sites-available/reverse /etc/nginx/sites-enabled/reverse
nginx