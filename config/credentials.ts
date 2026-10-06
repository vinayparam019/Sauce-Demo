import fs from 'fs';
import path from 'path';
import { ConfigurationError } from './errors';

export interface TestUser {
  email: string;
  password: string;
}

// Flat map of semantic user key -> username/email. Usernames are test data, not
// secrets, so they live in data/user.json; each user's password comes from its
// own env var (e.g. "secondUser" -> SECOND_USER_PASSWORD).
const userDataPath = path.resolve(__dirname, '../data/user.json');
const userData: Record<string, string> = JSON.parse(fs.readFileSync(userDataPath, 'utf-8'));

function passwordEnvVar(key: string): string {
  return `${key.replace(/([A-Z])/g, '_$1').toUpperCase()}_PASSWORD`;
}

function requirePassword(key: string): string {
  const envVar = passwordEnvVar(key);
  const value = process.env[envVar];
  if (!value) {
    throw new ConfigurationError(`${envVar} is required to authenticate test user "${key}".`);
  }
  return value;
}

export function getUser(key: string): TestUser {
  const email = userData[key];
  if (!email) {
    throw new ConfigurationError(`Unknown test user key "${key}" in data/user.json.`);
  }
  return {
    email,
    get password(): string {
      return requirePassword(key);
    },
  };
}

export const credentials = {
  apiToken: process.env.API_AUTH_TOKEN || '',
  user: getUser('user'),
  secondUser: getUser('secondUser'),
  admin: getUser('admin'),
};

