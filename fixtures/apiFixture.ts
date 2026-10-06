/**
 * apiFixture.ts: API client fixture module.
 * Provides the raw and authenticated `APIClient` instances used by API and
 * integration tests. This module never imports Page/Browser types: the
 * authenticated session is bootstrapped once by the `setup` project
 * (see tests-setup/auth.setup.ts) and read here as a plain storageState file,
 * so pure API tests never launch a browser.
 */
import { test as baseTest, request as pwRequest } from '@playwright/test';
import { APIClient } from '../core/api/client';
import { API_CONFIG } from '../config/userAuth';
import { AUTH_STATE_PATH } from '../config/authState';

export type ApiFixtures = {
  apiClient: APIClient;
};

export type ApiWorkerFixtures = {
  authenticatedApiClient: APIClient;
};

export const test = baseTest.extend<ApiFixtures, ApiWorkerFixtures>({
  apiClient: async ({ request }, use) => {
    await use(
      new APIClient(request, {
        baseURL: API_CONFIG.baseURL,
        timeout: API_CONFIG.timeout,
        headers: API_CONFIG.headers,
        authToken: API_CONFIG.auth.token || undefined,
        retries: API_CONFIG.retries,
      }),
    );
  },

  // Worker-scoped: establishing the session is comparatively expensive and is safe to
  // share read-only across tests within a worker; each worker gets its own context.
  authenticatedApiClient: [
    async ({}, use) => {
      const context = await pwRequest.newContext({
        baseURL: API_CONFIG.baseURL,
        storageState: AUTH_STATE_PATH,
        extraHTTPHeaders: API_CONFIG.headers,
      });
      try {
        await use(
          new APIClient(context, {
            baseURL: API_CONFIG.baseURL,
            timeout: API_CONFIG.timeout,
            headers: API_CONFIG.headers,
            authToken: API_CONFIG.auth.token || undefined,
            retries: API_CONFIG.retries,
          }),
        );
      } finally {
        await context.dispose();
      }
    },
    { scope: 'worker' },
  ],
});
