FROM ubuntu

COPY ./start-nginx.sh /

RUN \
    chmod u+x /start-nginx.sh && \
    apt-get update && \
    apt-get install -y python-software-properties && \
    apt-get install -y software-properties-common && \
    add-apt-repository -y ppa:nginx/stable && \
    apt-get update && \
    apt-get install -y net-tools && \
    apt-get install -y iputils-ping && \
    apt-get install -y gettext-base && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/* && \
    echo "\ndaemon off;" >> /etc/nginx/nginx.conf && \
    chown -R www-data:www-data /var/lib/nginx

CMD ["/start-nginx.sh"]

EXPOSE 80
EXPOSE 443
