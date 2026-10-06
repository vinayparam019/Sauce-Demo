/**
 * index.ts: Main entry point for test fixtures.
 * Merges the api/page/data fixture modules into a single test object.
 * Import individual fixtures directly (e.g. `examplePage`, `authenticatedApiClient`)
 * rather than through grouped wrapper objects, so fixture dependencies stay explicit.
 */
import { expect, mergeTests } from '@playwright/test';
import { test as apiTest } from './apiFixture';
import { test as pageTest } from './pageFixture';
import { test as dataTest } from './dataFixture';
import { BASE_URL } from '../config/userAuth';

export const test = mergeTests(apiTest, pageTest, dataTest);

export { expect };
export { BASE_URL };
