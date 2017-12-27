FROM node

COPY ./start-node-server.sh /

RUN \
    npm install -g -y nodemon && \
    chmod u+x /start-node-server.sh && \
    apt-get update && \
    apt-get install -y ruby && \
    npm install -g -y sequelize-cli pg

CMD ["/start-node-server.sh"]

EXPOSE 3000
