import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.janmejay.info',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  redirects: { '/work': '/experience' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  vite: { envPrefix: ['VITE_', 'PUBLIC_'] },
});