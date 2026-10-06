/**
 * auth.setup.ts: one-time UI login that seeds storageState for API tests.
 * Runs once (as the `setup` project dependency) so API fixtures can read the
 * resulting session cookies from disk without ever constructing a Page.
 */
import { test as setup } from '@playwright/test';
import { ExamplePage } from '../pages/examples/examplePage';
import { AUTH_STATE_PATH } from '../config/authState';

setup('authenticate', async ({ page }) => {
  const loginPage = new ExamplePage(page);
  await loginPage.login();
  await loginPage.verifyDashboardVisible();
  await page.context().storageState({ path: AUTH_STATE_PATH });
});
