ARG NODE_VERSION=19.1.0

FROM node:${NODE_VERSION}-alpine as build
WORKDIR /opt

COPY . .

RUN npm install

RUN npm run build

ENV WORKDIR /opt

RUN npm install -g pm2

ENV NODE_ENV production

#CMD ["pm2-runtime", "start", "processes.config.js", "--env", "production"]
CMD ["npm", "run", "start:prod"]
