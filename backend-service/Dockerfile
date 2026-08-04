# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY shared/package*.json ./shared/
COPY backend-service/package*.json ./backend-service/

RUN npm ci

COPY shared ./shared
COPY backend-service ./backend-service

RUN npm run build --workspace=@whats-down/shared
RUN npm run build --workspace=@whats-down/backend-service

# Stage 2: Production Run
FROM node:20.10.0-alpine

WORKDIR /app

COPY package*.json ./
COPY shared/package*.json ./shared/
COPY backend-service/package*.json ./backend-service/

RUN npm ci --omit=dev

COPY --from=build /app/shared/dist ./shared/dist
COPY --from=build /app/backend-service/dist ./backend-service/dist

WORKDIR /app/backend-service

EXPOSE 3000

CMD ["npm", "start"]