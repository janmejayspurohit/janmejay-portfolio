# Janmejay Portfolio

Modern React + Vite portfolio deployed with Docker and reverse-proxied through Nginx Proxy Manager.

## Features

- Single-page portfolio experience
- Light and dark theme support
- Responsive layout for desktop and mobile
- Dockerized production deployment with Nginx
- GitHub Actions CI/CD to auto-deploy on push

## Tech Stack

- React 18
- Vite 5
- React Router 6
- Nginx (containerized)
- Docker Compose
- GitHub Actions

## Local Development

### Prerequisites

- Node.js 22+
- npm

### Run locally

```bash
npm install
npm run dev
```

App runs on `http://localhost:5173`.

### Production build

```bash
npm run build
npm run preview
```

## Docker Deployment

This app is built and served through the Dockerfile in this repository.

From your server stack directory:

```bash
cd /home/janmejay/docker
docker compose up -d --build janmejay-portfolio
```

## CI/CD

Automatic deployment is configured with GitHub Actions.

Workflow file:

- `.github/workflows/deploy.yml`

Detailed setup guide:

- `docs/cicd-setup.md`

### Deployment flow

1. Push code to `main` or `master`.
2. GitHub Actions installs dependencies and builds the app.
3. Action SSHes into the server.
4. Server pulls latest branch and rebuilds `janmejay-portfolio` container.

## Project Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build production assets
- `npm run preview` - Preview production build locally

## Notes

- Production service path on server: `/home/janmejay/code/janmejay-portfolio`
- Docker Compose stack path on server: `/home/janmejay/docker`
