import { test } from '../../fixtures';

test.describe('@example OrangeHRM UI Tests', () => {
  test('@smoke @example OrangeHRM login page loads', async ({ examplePage }) => {
    await examplePage.navigateToLogin();
    await examplePage.verifyLoginPage();
    await examplePage.verifyTitle('OrangeHRM');
  });

  test('@smoke @example OrangeHRM user can log in', async ({ examplePage }) => {
    await examplePage.login();
    await examplePage.verifyDashboardVisible();
  });

  test('@regression @example OrangeHRM dashboard exposes navigation', async ({ examplePage }) => {
    await examplePage.login();
    await examplePage.verifyDashboardVisible();
    await examplePage.verifyMenuVisible('Admin');
    await examplePage.verifyMenuVisible('Performance');
    await examplePage.searchMenu('Leave');
  });
});
