import { defineConfig, devices } from '@playwright/test';

/**
 * Baseline config for the TestverQA playground (https://testplay.venomva.com/).
 * Mirrors the existing Explorer-generated convention (Playwright + TypeScript,
 * guest role on the home page) while keeping all runs scoped per file.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    // Target site for the run. Defaults to the TestverQA playground so existing
    // runs are unchanged; override per environment with BASE_URL=... (e.g.
    // BASE_URL=https://staging.example.com npx playwright test).
    baseURL: process.env.BASE_URL || 'https://testplay.venomva.com/',
    trace: 'retain-on-failure', // Auto-Heal reads the failing page from the trace
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      // channel 'chrome' => use the system-installed Google Chrome instead of
      // downloading the Playwright browser bundle from the network-restricted CDN.
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});