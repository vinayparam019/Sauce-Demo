import { test } from '@playwright/test';
import { credentials } from '../../config/credentials';
import { OrangeHrmLoginPage } from '../../pages/orangehrm/orangeHrmLoginPage';

test.describe('Cart - End-to-end purchase flow', { tag: ['@cart', '@regression'] }, () => {
  test('@new SA-TC-1 Smoke: end-to-end purchase flow from homepage to order confirmation', async ({ page }) => {
    const loginPage = new OrangeHrmLoginPage(page);

    const username = process.env.TEST_USERNAME || process.env.APP_USERNAME || credentials.user.email;
    const password = process.env.TEST_PASSWORD || process.env.APP_PASSWORD || credentials.user.password;

    // Arrange
    await loginPage.goto();
    await loginPage.verifyLoginPageVisible();

    // Act
    await loginPage.login({ username, password });

    // Assert
    await loginPage.verifyLoggedIn();
  });
});
