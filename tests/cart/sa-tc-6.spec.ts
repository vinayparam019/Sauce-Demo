import { test } from '@playwright/test';
import { RegisterPage } from '../../pages/storefront/registerPage';

test.describe('Create Account - Registration form fields and navigation links', { tag: ['@cart', '@regression'] }, () => {
  test('@new SA-TC-6 Verify the Create Account page registration form fields and navigation links', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    // Arrange
    await registerPage.navigate();

    // Act
    await registerPage.verifyOnRegisterPage();
    await registerPage.verifyRegistrationFormFieldsVisible();
    await registerPage.clickHomeInNavigation();

    // Assert
    await registerPage.verifyOnHomePage();
  });
});
