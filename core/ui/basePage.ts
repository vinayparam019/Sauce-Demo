import { expect, Locator, Page } from '@playwright/test';
import { withErrorContext } from '../utils/withErrorContext';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  async open(path: string): Promise<void> {
    await withErrorContext(() => this.page.goto(path).then(() => undefined), `Navigate to "${path}"`);
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async verifyUrl(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }
}
