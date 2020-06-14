FROM node:lts

WORKDIR /app

EXPOSE 3000
COPY . .
RUN npm install

CMD ["npm", "start"]
