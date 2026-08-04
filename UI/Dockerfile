# Stage 1: Build Vite Application
FROM node:20-alpine AS build

WORKDIR /app

# Copying workspace settings from the root and from UI/shared.
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY UI/package*.json ./UI/
COPY backend-service/package*.json ./backend-service/
COPY system-service/package*.json ./system-service/
COPY users-service/package*.json ./users-service/

# Installing dependencies
RUN npm ci

# Copying the source files
COPY shared ./shared
COPY UI ./UI

# Building the shared package and the UI application
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Building the shared package and the UI application
RUN npm run build --workspace=@whats-down/shared
RUN npm run build --workspace=@whats-down/UI

# Serve with Nginx
FROM nginx:alpine

# Copying the Nginx configuration file
COPY UI/nginx.conf /etc/nginx/conf.d/default.conf

# Copying the built UI application to the Nginx html directory
COPY --from=build /app/UI/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]