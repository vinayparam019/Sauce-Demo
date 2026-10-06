/**
 * dataFixture.ts: Test data fixture module.
 * Centralizes access to static/generated test data so spec files never read
 * config directly. Add new data fixtures here as the framework grows.
 */
import { test as baseTest } from '@playwright/test';
import { TEST_USERS } from '../config/userAuth';

export type DataFixtures = {
  testUsers: typeof TEST_USERS;
};

export const test = baseTest.extend<DataFixtures>({
  testUsers: async ({}, use) => {
    await use(TEST_USERS);
  },
});
