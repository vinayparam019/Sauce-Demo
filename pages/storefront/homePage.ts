import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/ui/basePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get logInLink(): Locator {
    return this.page.getByRole('link', { name: 'Log In' });
  }

  private get signUpLink(): Locator {
    return this.page.getByRole('link', { name: 'Sign up' });
  }

  private get myCartLink(): Locator {
    return this.page.getByRole('link', { name: 'My Cart (0)' });
  }

  private get checkOutLink(): Locator {
    return this.page.getByRole('link', { name: 'Check Out' });
  }

  private get catalogLink(): Locator {
    return this.page.getByRole('link', { name: 'Catalog' });
  }

  async navigate(): Promise<void> {
    await this.open('/');
  }

  async verifyOnHomePage(): Promise<void> {
    await this.verifyUrl('/');
    await expect(this.page.getByRole('heading', { name: 'Sauce Demo' })).toBeVisible();
  }

  async verifyUnauthenticatedHeaderLinksVisible(): Promise<void> {
    await expect(this.logInLink).toBeVisible();
    await expect(this.signUpLink).toBeVisible();
  }

  async verifyCartCountIsZero(): Promise<void> {
    await expect(this.myCartLink).toBeVisible();
  }

  async goToCart(): Promise<void> {
    await expect(this.checkOutLink).toBeVisible();
    await this.checkOutLink.click();
  }

  async goToCatalog(): Promise<void> {
    await expect(this.catalogLink).toBeVisible();
    await this.catalogLink.click();
  }
}
