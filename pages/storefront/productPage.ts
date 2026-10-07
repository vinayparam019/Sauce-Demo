import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/ui/basePage';

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get addToCartButton(): Locator {
    return this.page.getByRole('button', { name: 'Add to Cart' });
  }

  private get myCartLinkWithOneItem(): Locator {
    return this.page.getByRole('link', { name: 'My Cart (1)' });
  }

  private get checkOutLink(): Locator {
    return this.page.getByRole('link', { name: 'Check Out' });
  }

  async navigateToBronzeSandalsProduct(): Promise<void> {
    await this.open('/products/bronze-sandals');
  }

  async verifyOnBronzeSandalsProductPage(): Promise<void> {
    await this.verifyUrl('/products/bronze-sandals');
    await expect(this.page.getByRole('heading', { name: 'Bronze sandals' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: '£39.99' })).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
  }

  async verifyOnGreyJacketProductPage(): Promise<void> {
    await this.verifyUrl('/products/grey-jacket');
    await expect(this.page.getByRole('heading', { name: 'Grey jacket' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: '£55.00' })).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.addToCartButton).toBeEnabled();
  }

  async verifyCartCountIsOne(): Promise<void> {
    await expect(this.myCartLinkWithOneItem).toBeVisible();
  }

  async addToCart(): Promise<void> {
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.addToCartButton).toBeEnabled();
    await this.addToCartButton.click();
  }

  async goToCart(): Promise<void> {
    await expect(this.checkOutLink).toBeVisible();
    await this.checkOutLink.click();
  }
}
