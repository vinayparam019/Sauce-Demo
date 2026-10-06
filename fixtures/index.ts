import { expect } from '@playwright/test';
import { test as pageTest } from './pageFixture';
import { BASE_URL } from '../config/userAuth';

export const test = pageTest;

export { expect };
export { BASE_URL };
