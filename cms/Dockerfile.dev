FROM node:22-alpine

WORKDIR /APP

COPY package* .

RUN npm i

COPY . .

CMD ["npm", "run", "dev"]