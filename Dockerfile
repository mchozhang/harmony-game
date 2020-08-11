FROM node:10.15.3

COPY . /harmony-game

WORKDIR /harmony-game

RUN npm install

EXPOSE 80
EXPOSE 3000

CMD ["npm", "start"]