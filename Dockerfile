# Stage 1: build the static site with Astro.
# Run: docker compose up -d --build janmejay-portfolio  after any code change.
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# The contact-relay Worker URL is baked into the client scripts at build time.
ARG VITE_CONTACT_ENDPOINT
ENV VITE_CONTACT_ENDPOINT=${VITE_CONTACT_ENDPOINT}
RUN npm run build

# Stage 2: serve the files with nginx.
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
