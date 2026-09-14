# syntax=docker/dockerfile:1

# ---- Build stage ----
# Compiles the Vite/React app into static files in /app/dist
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies first (better layer caching).
# .npmrc carries `legacy-peer-deps=true`, which npm ci honors.
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# Copy the rest of the source and build
COPY . .
RUN npm run build

# ---- Serve stage ----
# Serves the static build with nginx (tiny, fast, no Node at runtime)
FROM nginx:1.27-alpine AS runtime

# SPA-friendly nginx config (history fallback + asset caching)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
