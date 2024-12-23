FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm i -g serve
RUN npm run build

EXPOSE 6969

CMD ["serve", "-s", "dist", "-l", "6969"]