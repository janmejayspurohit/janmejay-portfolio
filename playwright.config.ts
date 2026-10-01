import { defineConfig } from '@playwright/test';
import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'tests',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4399',
    channel: 'chrome'
  },
  webServer: {
    command: 'VITE_CONTACT_ENDPOINT=https://contact.test npx astro build --outDir dist-test && node tests/serve.mjs dist-test 4399',
    url: 'http://127.0.0.1:4399/',
    reuseExistingServer: false,
    timeout: 120000
  },
};

export default config;