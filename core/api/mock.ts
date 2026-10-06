import { Page } from '@playwright/test';

export async function mockJSONResponse(
  page: Page,
  route: string | RegExp,
  body: unknown,
  status = 200,
): Promise<void> {
  await page.route(route, async (requestRoute) => {
    await requestRoute.fulfill({ status, json: body });
  });
}
