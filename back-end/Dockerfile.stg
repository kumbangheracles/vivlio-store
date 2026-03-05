FROM node:22-alpine

WORKDIR /app

COPY package* .

RUN npm ci

COPY . .

RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

CMD ["./docker-entrypoint.sh"]