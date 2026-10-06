import { test, expect } from '../../fixtures';
import { ExampleAPIService } from '../../utils/examples/exampleAPIService';

test('@example OrangeHRM UI + API integration workflow', async ({
  examplePage,
  authenticatedApiClient,
}) => {
  const service = new ExampleAPIService(authenticatedApiClient);
  await examplePage.login();
  await examplePage.verifyDashboardVisible();
  await examplePage.verifyMenuVisible('Admin');

  const shortcuts = await service.getDashboardShortcuts();
  expect(shortcuts.data).toBeDefined();
});
