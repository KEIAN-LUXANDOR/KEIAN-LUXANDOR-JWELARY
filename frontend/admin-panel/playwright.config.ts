import { defineConfig, devices } from '@playwright/test';

// End-to-end tests (tests/e2e) run against a real browser.
// First time only: npx playwright install chromium
// Run: npm run test:e2e   (starts the admin panel on port 5174 if it isn't running)
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5174',
    trace: 'retain-on-failure',
    // Optional: use an installed Chrome instead of downloading one (CHROME_PATH=/path/to/chrome).
    launchOptions: process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: 'npm run dev', url: 'http://localhost:5174/login', reuseExistingServer: true, timeout: 120_000 },
});
