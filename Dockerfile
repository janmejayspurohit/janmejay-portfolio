# Stage 1: Build prod
# Expects a standard Vite or Create React App project in this directory.
# Run: docker compose up -d --build janmejay-portfolio  after any code change.
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
# Use deterministic install when lockfile exists; otherwise do a regular install.
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
ARG VITE_CONTACT_ENDPOINT
ENV VITE_CONTACT_ENDPOINT=${VITE_CONTACT_ENDPOINT}
RUN npm run build

# Stage 2: Build beta preview (served at /beta on the same domain).
# Source comes from the `beta` additional build context (see docker-compose.yml),
# pointing at the janmejay-portfolio-beta git worktree — a separate branch of
# this same repo, not a separate project.
FROM node:22-alpine AS builder-beta

WORKDIR /app
COPY --from=beta package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY --from=beta . .
ARG VITE_CONTACT_ENDPOINT
ENV VITE_CONTACT_ENDPOINT=${VITE_CONTACT_ENDPOINT}
ENV BASE_PATH=/beta/
RUN npm run build

# Stage 3: Serve both
# Vite outputs to /app/dist, CRA outputs to /app/build — adjust below if needed.
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder-beta /app/dist /usr/share/nginx/html/beta

# SPA fallback for both the prod site and the /beta preview. The /beta block
# must come first so it wins for anything under that prefix.
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    location /beta/ {\n\
        try_files $uri $uri/ /beta/index.html;\n\
    }\n\
\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
