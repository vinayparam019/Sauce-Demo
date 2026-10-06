import { credentials } from './credentials';
import { environment } from './environment';
import { DEFAULTS } from './defaults';

export const BASE_URL = environment.baseURL;
export const API_BASE_URL = environment.apiBaseURL;

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: DEFAULTS.apiTimeout,
  headers: { 'Content-Type': 'application/json' },
  auth: { token: credentials.apiToken },
  // Transient-failure retries only (network errors, 429, 5xx); see core/api/errors.ts.
  retries: environment.isCI ? 1 : 0,
};

export const TEST_USERS = {
  USER: credentials.user,
  SECOND_USER: credentials.secondUser,
  ADMIN: credentials.admin,
};

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
