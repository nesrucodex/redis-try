FROM node:22.6.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4040

CMD ["npm", "start"]