import { test } from '@playwright/test';
import { LoginPage } from '../../pages/storefront/loginPage';

function getResetEmail(): string {
  const email = process.env.TEST_USERNAME ?? process.env.APP_USERNAME;
  if (!email) {
    throw new Error('Missing reset email. Set TEST_USERNAME or APP_USERNAME environment variable.');
  }
  return email;
}

test.describe('Auth - Password reset from login page', { tag: ['@cart', '@regression'] }, () => {
  test('@new SA-TC-2 - Verify password reset flow from the login page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Arrange
    await loginPage.navigate();

    // Act
    await loginPage.verifyOnLoginPage();
    await loginPage.openForgotPassword();

    // Assert
    await loginPage.verifyResetPasswordSectionVisible();
    await loginPage.submitPasswordReset(getResetEmail());
    await loginPage.verifyCaptchaChallengeVisible();
  });
});
