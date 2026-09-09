# Build
FROM node:20-alpine AS build

WORKDIR /app

# copying workspace settings from the root and from systems-service
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY tsconfig.base.json ./
COPY systems-service/package*.json ./systems-service/

# run npm ci to install dependencies for all workspaces
RUN npm ci

# copying the relevant source code 
COPY shared ./shared
COPY systems-service ./systems-service

# Build the shared package and the system service
RUN npm run build --workspace=@whats-down/shared
RUN npm run build --workspace=@whats-down/systems-service

# Production Run
FROM node:20.10.0-alpine

WORKDIR /app

COPY package*.json ./
COPY shared/package*.json ./shared/
COPY systems-service/package*.json ./systems-service/

# Install production dependencies only
RUN npm ci --omit=dev

# Copy the built artifacts from the build stage
COPY --from=build /app/shared/dist ./shared/dist
COPY --from=build /app/systems-service/dist ./systems-service/dist

WORKDIR /app/systems-service

EXPOSE 8000

CMD ["npm", "start"]