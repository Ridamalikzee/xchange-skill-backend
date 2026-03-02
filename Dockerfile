# Strapi v5 Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .

ENV NODE_ENV=production

EXPOSE 1337

CMD ["npm", "run", "develop"]
