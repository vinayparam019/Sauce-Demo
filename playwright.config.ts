import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { BASE_URL, BROWSER_CONFIG, IS_CI, PLAYWRIGHT_CONFIG } from './config/userAuth';

dotenv.config({ path: path.resolve(__dirname, '.env') });

// Configuration constants
const TIMEOUTS = {
  TEST: PLAYWRIGHT_CONFIG.testTimeout,
  EXPECT: PLAYWRIGHT_CONFIG.expectTimeout,
} as const;

const CI_WORKERS = 3;
const CI_RETRIES = 0;
const config: PlaywrightTestConfig = {
  /* Maximum time one test can run for. */
  timeout: TIMEOUTS.TEST,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: TIMEOUTS.EXPECT,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: IS_CI,
  /* Retry on CI only */
  retries: IS_CI ? CI_RETRIES : 0,
  /* Opt out of parallel tests on CI. */
  // The public OrangeHRM demo shares one account; serialize examples to avoid session invalidation.
  workers: process.env.TAGS === '@example' ? 1 : IS_CI ? CI_WORKERS : 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  reporter: process.env.ALLURE === 'true'
    ? [['html'], ['junit', { outputFile: 'test-results/junit.xml' }], ['allure-playwright']]
    : process.env.CI
      ? [['blob'], ['junit', { outputFile: 'test-results/junit.xml' }]]
      : [['html']],
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: 'data-test-id',
    headless: BROWSER_CONFIG.headless,
    screenshot: 'only-on-failure',
    viewport: null,
    // Pin locale so accessible-name locators (e.g. "Username") stay stable regardless
    // of the host machine/CI runner's system language or the app's locale negotiation.
    locale: 'en-US',
    launchOptions: {
      args: [
        // '--start-maximized',
        '--window-size=1920,1080',
      ],
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      // One-time UI login that seeds storageState for `authenticatedApiClient`.
      // Runs once per suite invocation, isolated from the test projects below.
      name: 'setup',
      testDir: './tests-setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      testDir: './tests',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        channel: process.env.BROWSER || undefined,
        deviceScaleFactor: undefined,
        viewport: null,
        launchOptions: {
          args: [
            // '--start-maximized',
            '--window-size=1920,1080',
          ],
        },
      },
      grep:
        process.env.TAGS && process.env.TAGS !== 'all'
          ? new RegExp(process.env.TAGS, 'g')
          : undefined,
    },
  ],
  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',
};

if (config.projects) {
  for (const project of config.projects) {
    if (!project.use) {
      continue;
    }

    project.use.userAgent += ' Playwright/1';
  }
}

export default defineConfig(config);
