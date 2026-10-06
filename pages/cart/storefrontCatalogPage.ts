import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/ui/basePage';

export class StorefrontCatalogPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get productsHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Products' });
  }

  private get greyJacketProductLink(): Locator {
    return this.page.getByRole('link', { name: 'Grey jacket Grey jacket £55.00' });
  }

  private get logInLink(): Locator {
    return this.page.getByRole('link', { name: 'Log In' });
  }

  async goto(): Promise<void> {
    await this.open('/collections/all');
  }

  async verifyCatalogVisible(): Promise<void> {
    await this.verifyUrl('/collections/all');
    await expect(this.productsHeading).toBeVisible();
    await expect(this.greyJacketProductLink).toBeVisible();
  }

  async clickLogIn(): Promise<void> {
    await expect(this.logInLink).toBeVisible();
    await expect(this.logInLink).toBeEnabled();
    await this.logInLink.click();
  }
}
