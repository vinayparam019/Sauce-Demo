import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/ui/basePage';

export class CatalogPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get greyJacketProductLink(): Locator {
    return this.page.getByRole('link', { name: 'Grey jacket Grey jacket £55.00' });
  }

  async navigate(): Promise<void> {
    await this.open('/collections/all');
  }

  async verifyOnCatalogPage(): Promise<void> {
    await this.verifyUrl('/collections/all');
    await expect(this.page.getByRole('heading', { name: 'Products' })).toBeVisible();
  }

  async openGreyJacketProduct(): Promise<void> {
    await expect(this.greyJacketProductLink).toBeVisible();
    await this.greyJacketProductLink.click();
  }
}
