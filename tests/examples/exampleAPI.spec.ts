import { test, expect } from '../../fixtures';
import { ExampleAPIService } from '../../utils/examples/exampleAPIService';

test.describe('@example OrangeHRM API Tests', () => {
  test('@smoke @example OrangeHRM dashboard shortcuts API returns typed data', async ({ authenticatedApiClient }) => {
    const service = new ExampleAPIService(authenticatedApiClient);
    const shortcuts = await service.getDashboardShortcuts();
    expect(shortcuts.data).toBeDefined();
  });

});
