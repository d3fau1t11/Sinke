import { defineConfig, devices } from '@playwright/test';

const roles = ['customer', 'merchant', 'rider', 'admin'];

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  workers: 2,
  retries: process.env['CI'] ? 1 : 0,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    ...(process.env['CI'] ? {} : { channel: 'chrome' }),
    headless: true,
    trace: 'retain-on-failure',
  },
  webServer: roles.map((role, index) => ({
    command: `pnpm --filter @senik/${role} exec vite preview --host 127.0.0.1 --port ${6183 + index}`,
    url: `http://127.0.0.1:${6183 + index}`,
    reuseExistingServer: false,
    timeout: 60_000,
  })),
});
