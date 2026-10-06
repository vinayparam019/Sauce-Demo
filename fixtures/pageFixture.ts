/**
 * pageFixture.ts: UI page object fixture module.
 * Instantiates Page Object Model classes bound to the test's `page`. Add one
 * entry per page object here as the framework grows, rather than editing
 * the merged entry point directly.
 */
import { test as baseTest } from '@playwright/test';
import { ExamplePage } from '../pages/examples/examplePage';

export type PageFixtures = {
  examplePage: ExamplePage;
};

export const test = baseTest.extend<PageFixtures>({
  examplePage: async ({ page }, use) => {
    await use(new ExamplePage(page));
  },
});
