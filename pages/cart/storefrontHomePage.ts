import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/ui/basePage';

export class StorefrontHomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get catalogLink(): Locator {
    return this.page.getByRole('link', { name: 'Catalog' });
  }

  private get logInLink(): Locator {
    return this.page.getByRole('link', { name: 'Log In' });
  }

  private get greyJacketProductLink(): Locator {
    return this.page.getByRole('link', { name: 'Grey jacket Grey jacket £55.00' });
  }

  async goto(): Promise<void> {
    await this.open('/');
  }

  async verifyHomePageVisible(): Promise<void> {
    await this.verifyUrl('/');
    await expect(this.catalogLink).toBeVisible();
    await expect(this.greyJacketProductLink).toBeVisible();
  }

  async clickCatalog(): Promise<void> {
    await expect(this.catalogLink).toBeVisible();
    await expect(this.catalogLink).toBeEnabled();
    await this.catalogLink.click();
  }

  async clickLogIn(): Promise<void> {
    await expect(this.logInLink).toBeVisible();
    await expect(this.logInLink).toBeEnabled();
    await this.logInLink.click();
  }

  async openGreyJacketProduct(): Promise<void> {
    await expect(this.greyJacketProductLink).toBeVisible();
    await expect(this.greyJacketProductLink).toBeEnabled();
    await this.greyJacketProductLink.click();
  }
}
