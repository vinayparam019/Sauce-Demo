import { test, expect } from '../../fixtures';
import { mockJSONResponse } from '../../core/api';

test('@example OrangeHRM API mock can isolate a UI dependency', async ({ examplePage, page }) => {
  await mockJSONResponse(page, '**/web/index.php/api/v2/dashboard/shortcuts', {
    data: { 'time.my_timesheet': true },
    meta: [],
    rels: [],
  });

  // Assert against the mocked network layer rather than full SPA render: the live
  // demo's post-login rendering depends on many other live widgets/requests that
  // are outside the scope of this mock and shouldn't gate this assertion.
  const [response] = await Promise.all([
    page.waitForResponse('**/web/index.php/api/v2/dashboard/shortcuts'),
    examplePage.login(),
  ]);

  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toMatchObject({ data: { 'time.my_timesheet': true } });
});