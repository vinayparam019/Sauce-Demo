import { expect, Locator, Page } from '@playwright/test';
import { BaseComponent } from './baseComponent';

export abstract class BaseModal extends BaseComponent {
  protected constructor(page: Page) {
    super(page);
  }

  protected get dialog(): Locator {
    return this.page.getByRole('dialog');
  }

  protected get closeButton(): Locator {
    return this.dialog.getByRole('button', { name: /close|cancel/i });
  }

  protected get confirmButton(): Locator {
    return this.dialog.getByRole('button', { name: /confirm|submit|ok/i });
  }

  async verifyVisible(): Promise<void> {
    await expect(this.dialog).toBeVisible();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }

  async confirm(): Promise<void> {
    await this.confirmButton.click();
  }
}
