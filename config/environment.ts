import dotenv from 'dotenv';
import { DEFAULTS } from './defaults';
import { ConfigurationError } from './errors';

dotenv.config();

const name = process.env.ENVIRONMENT || 'local';
// The public OrangeHRM demo is a safe default only for local/demo runs; a real
// target environment must set its own URLs explicitly rather than fall back silently.
const isLocal = name === 'local';

function requireEnv(value: string | undefined, key: string): string {
  if (!value) {
    throw new ConfigurationError(`${key} is required for environment "${name}".`);
  }
  return value;
}

export const environment = {
  baseURL: isLocal
    ? process.env.BASE_URL || DEFAULTS.baseURL
    : requireEnv(process.env.BASE_URL, 'BASE_URL'),
  apiBaseURL: isLocal
    ? process.env.API_BASE_URL || DEFAULTS.apiBaseURL
    : requireEnv(process.env.API_BASE_URL, 'API_BASE_URL'),
  name,
  browser: process.env.BROWSER || 'chromium',
  isCI: process.env.CI === 'true',
};
