import { test } from '@playwright/test';
import { ExamplePage } from '../../pages/examples/examplePage';

function requireAuthFromEnv(): { username: string; password: string } {
  const username = process.env.TEST_USERNAME || process.env.APP_USERNAME;
  const password = process.env.TEST_PASSWORD || process.env.APP_PASSWORD;

  if (!username) {
    throw new Error('Missing username env var: set TEST_USERNAME or APP_USERNAME');
  }

  if (!password) {
    throw new Error('Missing password env var: set TEST_PASSWORD or APP_PASSWORD');
  }

  return { username, password };
}

test.describe('SA-TC-1 - Smoke authenticated landing (@cart @regression)', { tag: ['@cart', '@regression'] }, () => {
  test('@new Smoke - login and reach Dashboard', async ({ page }) => {
    const examplePage = new ExamplePage(page);

    // Arrange
    const { username, password } = requireAuthFromEnv();

    // Act
    await examplePage.login(username, password);

    // Assert
    await examplePage.verifyDashboardVisible();
  });
});
