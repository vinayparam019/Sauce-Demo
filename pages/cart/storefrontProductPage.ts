import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/ui/basePage';

export class StorefrontProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get productNameHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Grey jacket' });
  }

  private get productPriceHeading(): Locator {
    return this.page.getByRole('heading', { name: '£55.00' });
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

  async goto(): Promise<void> {
    await this.open('/collections/frontpage/products/grey-jacket');
  }

  async verifyGreyJacketProductVisible(): Promise<void> {
    await this.verifyUrl('/collections/frontpage/products/grey-jacket');
    await expect(this.productNameHeading).toBeVisible();
    await expect(this.productPriceHeading).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
  }

  async addToCart(): Promise<void> {
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.addToCartButton).toBeEnabled();
    await this.addToCartButton.click();
  }

  async verifyCartCountIsOne(): Promise<void> {
    await expect(this.myCartLinkWithOneItem).toBeVisible();
  }

  async goToCartViaHeaderCheckoutLink(): Promise<void> {
    await expect(this.checkOutLink).toBeVisible();
    await expect(this.checkOutLink).toBeEnabled();
    await this.checkOutLink.click();
  }
}
