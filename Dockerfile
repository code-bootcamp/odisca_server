FROM node:14

COPY ./package.json /wisc/
COPY ./yarn.lock /wisc/
WORKDIR /wisc/

RUN yarn install
COPY . /wisc/

CMD yarn start:dev