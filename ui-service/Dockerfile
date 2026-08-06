# Stage 1: Build Vite Application
FROM node:20-alpine AS build

WORKDIR /app

# Copying workspace settings from the root and from ui-service/shared.
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY ui-service/package*.json ./ui-service/
COPY backend-service/package*.json ./backend-service/
COPY systems-service/package*.json ./systems-service/
COPY users-service/package*.json ./users-service/

# Installing dependencies
RUN npm ci

# Copying the source files
COPY shared ./shared
COPY ui-service ./ui-service

# Building the shared package and the UI application
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Building the shared package and the UI application
RUN npm run build --workspace=@whats-down/shared
RUN npm run build --workspace=@whats-down/ui-service

# Serve with Nginx
FROM nginx:alpine

# Copying the Nginx configuration file
COPY ui-service/nginx.conf /etc/nginx/conf.d/default.conf

# Copying the built UI application to the Nginx html directory
COPY --from=build /app/ui-service/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]