# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# 1. העתקת קבצי הגדרות ה-workspaces מהשורש ומהשירותים
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY backend-service/package*.json ./backend-service/

# 2. התקנת dependencies לכל המזער במונו-רפו
RUN npm ci

# 3. העתקת ה-source code הרלוונטי (shared + backend-service)
COPY shared ./shared
COPY backend-service ./backend-service

# 4. בניית החבילה המשותפת והשירות
RUN npm run build --workspace=@whats-down/shared
RUN npm run build --workspace=@whats-down/backend-service

# Stage 2: Production Run
FROM node:20.10.0-alpine

WORKDIR /app

COPY package*.json ./
COPY shared/package*.json ./shared/
COPY backend-service/package*.json ./backend-service/

# התקנת תלויות Production בלבד
RUN npm ci --omit=dev

# העתקת ה-dist של shared והשירות
COPY --from=build /app/shared/dist ./shared/dist
COPY --from=build /app/backend-service/dist ./backend-service/dist

WORKDIR /app/backend-service

EXPOSE 3000

CMD ["npm", "start"]