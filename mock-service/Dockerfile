# Build
FROM node:20-alpine AS build

WORKDIR /app

# Copying workspace settings from the root, shared, and mock-service
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY mock-service/package*.json ./mock-service/

# install dependencies for all workspaces
RUN npm ci

# Copying the relevant source code (shared + mock-service)
COPY shared ./shared
COPY mock-service ./mock-service

# Building the shared package and the mock-service
RUN npm run build --workspace=@whats-down/shared
RUN npm run build --workspace=@whats-down/mock-service

# Production Run
FROM node:20.10.0-alpine

WORKDIR /app

COPY package*.json ./
COPY shared/package*.json ./shared/
COPY mock-service/package*.json ./mock-service/

# Run npm ci to install production dependencies only
RUN npm ci --omit=dev

# Copy the built artifacts from the build stage
COPY --from=build /app/shared/dist ./shared/dist
COPY --from=build /app/mock-service/dist ./mock-service/dist

WORKDIR /app/mock-service

CMD ["npm", "start"]