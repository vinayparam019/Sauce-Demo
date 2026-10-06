import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';
import { BASE_URL, BROWSER_CONFIG, IS_CI, PLAYWRIGHT_CONFIG } from './config/userAuth';

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
  workers: IS_CI ? CI_WORKERS : 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  reporter: 'html',
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

  /* Configure the browser project */
  projects: [
    {
      name: 'chromium',
      testDir: './tests',
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
    },
  ],
  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',
};

export default defineConfig(config);
