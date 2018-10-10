FROM node:8.12.0-jessie

COPY . /usr/app

WORKDIR /usr/app

RUN apt-get update && \
    apt-get install -y imagemagick ghostscript poppler-utils

RUN npm install

EXPOSE 80
EXPOSE 443

CMD npm start