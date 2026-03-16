# Stage 1: Build
# Expects a standard Vite or Create React App project in this directory.
# Run: docker compose up -d --build janmejay-portfolio  after any code change.
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
# Use deterministic install when lockfile exists; otherwise do a regular install.
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN npm run build

# Stage 2: Serve
# Vite outputs to /app/dist, CRA outputs to /app/build — adjust below if needed.
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# SPA fallback: all routes return index.html so React Router works correctly
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
