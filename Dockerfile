FROM node:20 as builder

ARG NODE_OPTIONS
ENV NODE_OPTIONS=${NODE_OPTIONS}

RUN apt-get update && apt-get install -y gcc g++ make python3
RUN mkdir -p /build
WORKDIR /build
COPY package.json yarn.lock /build/
RUN yarn install

COPY . /build/
RUN NODE_OPTIONS=--max-old-space-size=3000 yarn run tsc:build

FROM node:20

ENV HOME=/home/envuser NODE_PATH=/home/envuser/apphome/dist NODE_ENV=production
RUN useradd --user-group --create-home --shell /bin/false envuser &&\
  mkdir -p $HOME/apphome &&\
  chown -R envuser:envuser $HOME/
USER envuser
WORKDIR $HOME/apphome

COPY --from=builder --chown=envuser:envuser /build/ $HOME/apphome/

EXPOSE 10000

CMD ["yarn", "prod"]