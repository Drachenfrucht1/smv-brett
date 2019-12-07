FROM node:8.12.0-jessie

COPY . /usr/app

WORKDIR /usr/app

RUN apt-get update && \
    apt-get install -y imagemagick ghostscript poppler-utils

RUN npm install

RUN npm run compile

EXPOSE 80
EXPOSE 443

CMD node index.js