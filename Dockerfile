FROM node:10.15.3

COPY . /harmony-game

WORKDIR /harmony-game

RUN npm install

CMD ["npm", "start"]