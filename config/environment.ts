import dotenv from 'dotenv';
import { DEFAULTS } from './defaults';
import { ConfigurationError } from './errors';

dotenv.config();

const name = process.env.ENVIRONMENT || 'local';
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
  name,
  browser: process.env.BROWSER || 'chromium',
  isCI: process.env.CI === 'true',
};
