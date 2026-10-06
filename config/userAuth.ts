import { environment } from './environment';
import { DEFAULTS } from './defaults';

export const BASE_URL = environment.baseURL;

export const BROWSER_CONFIG = {
  headless: process.env.HEADLESS !== 'false',
  slowMo: Number.parseInt(process.env.SLOW_MO || '0', 10),
  viewport: { width: 1920, height: 1080 },
};

export const PLAYWRIGHT_CONFIG = {
  testTimeout: DEFAULTS.testTimeout,
  expectTimeout: DEFAULTS.expectTimeout,
  navigationTimeout: DEFAULTS.navigationTimeout,
};

export const ENVIRONMENT = environment.name;
export const IS_CI = environment.isCI;
