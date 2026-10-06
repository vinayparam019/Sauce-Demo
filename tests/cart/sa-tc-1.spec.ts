import { test } from '@playwright/test';
import { credentials } from '../../config/credentials';
import { LoginPage } from '../../pages/orangehrm/loginPage';

test.describe('Cart - Purchase flow smoke', { tag: ['@cart', '@regression'] }, () => {
  test('@new SA-TC-1 - Authenticate user (environment smoke)', async ({ page }) => {
    const loginPage = new LoginPage(page);

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
