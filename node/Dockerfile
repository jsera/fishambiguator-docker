FROM node

COPY ./start-node-server.sh /

RUN \
    chmod u+x /start-node-server.sh && \
    apt-get update && \
    apt-get install -y ruby && \
    apt-get install -y netcat && \
    npm install -g -y sequelize-cli pg nodemon mocha

CMD ["/start-node-server.sh"]
