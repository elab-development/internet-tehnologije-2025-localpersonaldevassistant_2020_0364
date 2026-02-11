FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx tsc

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "npm run migration:run && node dist/server.js"]