import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/ui/basePage';
import { CheckoutContactAndShipping } from '../../types/cart.types';

export class StorefrontCheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get checkoutHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Sauce Demo Checkout' });
  }

  private get orderSummaryButton(): Locator {
    return this.page.getByRole('button', { name: 'Order summary Total 1 item GBP £55.00' });
  }

  private get emailInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Email' });
  }

  private get lastNameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Last name' });
  }

  private get addressInput(): Locator {
    return this.page.getByRole('combobox', { name: 'Address' });
  }

  private get cityInput(): Locator {
    return this.page.getByRole('textbox', { name: 'City' });
  }

  private get pinCodeInput(): Locator {
    return this.page.getByRole('textbox', { name: 'PIN code' });
  }

  private get payNowButton(): Locator {
    return this.page.getByRole('button', { name: 'Pay now' });
  }

  async verifyCheckoutPageVisible(): Promise<void> {
    await this.verifyUrl(/\/checkouts\//);
    await expect(this.checkoutHeading).toBeVisible();
    await expect(this.orderSummaryButton).toBeVisible();
  }

  async fillContactAndShipping(params: CheckoutContactAndShipping): Promise<void> {
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(params.email);

    await expect(this.lastNameInput).toBeVisible();
    await this.lastNameInput.fill(params.lastName);

    await expect(this.addressInput).toBeVisible();
    await this.addressInput.fill(params.address);

    await expect(this.cityInput).toBeVisible();
    await this.cityInput.fill(params.city);

    await expect(this.pinCodeInput).toBeVisible();
    await this.pinCodeInput.fill(params.pinCode);
  }

  async verifyContactAndShippingValues(params: CheckoutContactAndShipping): Promise<void> {
    await expect(this.emailInput).toHaveValue(params.email);
    await expect(this.lastNameInput).toHaveValue(params.lastName);
    await expect(this.addressInput).toHaveValue(params.address);
    await expect(this.cityInput).toHaveValue(params.city);
    await expect(this.pinCodeInput).toHaveValue(params.pinCode);
  }

  async verifyPayNowButtonIsEnabled(): Promise<void> {
    await expect(this.payNowButton).toBeVisible();
    await expect(this.payNowButton).toBeEnabled();
  }
}
