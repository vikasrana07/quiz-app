FROM node:15-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY decorate-angular-cli.js ./

RUN npm install

COPY . .

RUN npm run build

WORKDIR /usr/src/app/dist/apps/api

CMD ["node", "main.js"]