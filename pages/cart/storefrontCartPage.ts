import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/ui/basePage';

export class StorefrontCartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get myCartHeading(): Locator {
    return this.page.getByRole('heading', { name: 'My Cart' });
  }

  private get cartItemLink(): Locator {
    return this.page.getByRole('link', { name: 'Grey jacket - Grey jacket' });
  }

  private get cartLineItem(): Locator {
    return this.page.getByRole('heading', { name: 'Grey jacket - Grey jacket' });
  }

  private get quantityTextbox(): Locator {
    return this.cartLineItem.locator('..').locator('..').getByRole('textbox');
  }

  private get totalHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Total £55.00' });
  }

  private get checkOutButton(): Locator {
    return this.page.getByRole('button', { name: 'Check Out' });
  }

  async goto(): Promise<void> {
    await this.open('/cart');
  }

  async verifyCartPageVisible(): Promise<void> {
    await this.verifyUrl('/cart');
    await expect(this.myCartHeading).toBeVisible();
    await expect(this.cartItemLink).toBeVisible();
    await expect(this.totalHeading).toBeVisible();
  }

  async verifyGreyJacketQuantityIsOne(): Promise<void> {
    await expect(this.quantityTextbox).toHaveValue('1');
  }

  async proceedToCheckout(): Promise<void> {
    await expect(this.checkOutButton).toBeVisible();
    await expect(this.checkOutButton).toBeEnabled();
    await this.checkOutButton.click();
  }
}
