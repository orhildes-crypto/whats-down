# Build
FROM node:20-alpine AS build

WORKDIR /app

# Copying workspace settings from the root and from users-service
COPY package*.json ./
COPY tsconfig.base.json ./
COPY shared/package*.json ./shared/
COPY users-service/package*.json ./users-service/

# install dependencies for all workspaces
RUN npm ci

# Copying the relevant source code (shared + users-service)
COPY shared ./shared
COPY users-service ./users-service

# Building the shared package and the users-service
RUN npm run build --workspace=@whats-down/shared
RUN npm run build --workspace=@whats-down/users-service

# Production Run
FROM node:20.10.0-alpine

WORKDIR /app

COPY package*.json ./
COPY shared/package*.json ./shared/
COPY users-service/package*.json ./users-service/

# Run npm ci to install production dependencies only
RUN npm ci --omit=dev

# Copy the built artifacts from the build stage
COPY --from=build /app/shared/dist ./shared/dist
COPY --from=build /app/users-service/dist ./users-service/dist

WORKDIR /app/users-service

EXPOSE 5000

CMD ["npm", "start"]