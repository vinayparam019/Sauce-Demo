import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/ui/basePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get cartHeading(): Locator {
    return this.page.getByRole('heading', { name: 'My Cart' });
  }

  private get emptyCartText(): Locator {
    return this.page.getByText('It appears that your cart is currently empty!');
  }

  private get removeItemLink(): Locator {
    return this.page.getByRole('link', { name: 'x' });
  }

  private get bronzeSandalsCartItemLink(): Locator {
    return this.page.getByRole('link', { name: 'Bronze sandals' });
  }

  private get quantityTextbox(): Locator {
    return this.bronzeSandalsCartItemLink
      .locator('..')
      .locator('..')
      .locator('..')
      .getByRole('textbox');
  }

  private get totalHeadingForBronzeSandals(): Locator {
    return this.page.getByRole('heading', { name: 'Total £39.99' });
  }

  private get checkOutButton(): Locator {
    return this.page.getByRole('button', { name: 'Check Out' });
  }

  private get continueShoppingLink(): Locator {
    return this.page.getByRole('link', { name: '« Continue Shopping' });
  }

  async navigate(): Promise<void> {
    await this.open('/cart');
  }

  async verifyOnCartPage(): Promise<void> {
    await this.verifyUrl('/cart');
    await expect(this.cartHeading).toBeVisible();
  }

  async clearCartIfNotEmpty(): Promise<void> {
    await this.verifyOnCartPage();

    if (await this.removeItemLink.count()) {
      await this.removeItemLink.first().click();
      await expect(this.emptyCartText).toBeVisible();
    }
  }

  async verifyBronzeSandalsInCart(): Promise<void> {
    await expect(this.bronzeSandalsCartItemLink).toBeVisible();
    await expect(this.totalHeadingForBronzeSandals).toBeVisible();
    await expect(this.quantityTextbox).toHaveValue('1');
  }

  async clickContinueShopping(): Promise<void> {
    await expect(this.continueShoppingLink).toBeVisible();
    await this.continueShoppingLink.click();
  }

  async proceedToCheckout(): Promise<void> {
    await expect(this.checkOutButton).toBeVisible();
    await expect(this.checkOutButton).toBeEnabled();
    await this.checkOutButton.click();
  }
}
