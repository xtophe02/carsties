# Development stage
FROM node:18 AS development
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY prisma ./prisma/
RUN npx prisma generate

EXPOSE 7001
CMD npx wait-on tcp:auction-db:5432 && \
    npx prisma migrate dev && \
    npm run seed && \
    npm run dev

# Production stage
FROM node:18 AS production
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .

EXPOSE 7001
CMD npx wait-on tcp:auction-db:5432 && \
    npx prisma migrate deploy && \
    npm run start
