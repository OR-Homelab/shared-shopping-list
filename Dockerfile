FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8080
ENV MONGODB_URL='mongodb://127.0.0.1/shopping-list'

EXPOSE 8080

CMD [ "npm", "start" ]