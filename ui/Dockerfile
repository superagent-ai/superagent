FROM node:20-alpine

COPY . /app

WORKDIR /app

RUN npm install && npm run build

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "start" ]
