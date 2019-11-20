FROM alpine

RUN apk add --no-cache npm imagemagick && \
  npm i -g sails grunt && \
  npm cache clean --force

RUN mkdir -p /sails
WORKDIR /sails

COPY package.json package.json
COPY .npmrc .npmrc
RUN npm install
COPY . .
#COPY .nogrunt  .sailsrc
EXPOSE 1337
CMD [ "npm", "run", "dev"]
