import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/ui/basePage';

export interface ShippingDetails {
  email: string;
  lastName: string;
  address: string;
  city: string;
  pinCode: string;
}

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get checkoutHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Sauce Demo Checkout' });
  }

  private get signInLink(): Locator {
    return this.page.getByRole('link', { name: 'Sign in' });
  }

  private get emailTextbox(): Locator {
    return this.page.getByRole('textbox', { name: 'Email' });
  }

  private get countryRegionCombobox(): Locator {
    return this.page.getByRole('combobox', { name: 'Country/Region' });
  }

  private get lastNameTextbox(): Locator {
    return this.page.getByRole('textbox', { name: 'Last name' });
  }

  private get addressCombobox(): Locator {
    return this.page.getByRole('combobox', { name: 'Address' });
  }

  private get cityTextbox(): Locator {
    return this.page.getByRole('textbox', { name: 'City' });
  }

  private get pinCodeTextbox(): Locator {
    return this.page.getByRole('textbox', { name: 'PIN code' });
  }

  private get paymentHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Payment' });
  }

  private get creditCardHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Credit card' });
  }

  private get payNowButton(): Locator {
    return this.page.getByRole('button', { name: 'Pay now' });
  }

  private get orderSummaryHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Order summary' });
  }

  private get shoppingCartTable(): Locator {
    return this.page.getByRole('table', { name: 'Shopping cart' });
  }

  async verifyOnCheckoutPage(): Promise<void> {
    await expect(this.checkoutHeading).toBeVisible();
    await expect(this.signInLink).toBeVisible();
  }

  async assertOnCheckoutUrl(): Promise<void> {
    await expect(this.page).toHaveURL('https://sauce-demo.myshopify.com/checkouts/cn/hWNHgYLHOdfBnZnKAZEvS8we/en-in?_r=AQABit5nJ7Az4te2aHMViNOAhSdTbKN8mDXY4ZUZ4KhGJQfY1bFj');
  }

  async fillShippingDetails({ email, lastName, address, city, pinCode }: ShippingDetails): Promise<void> {
    await expect(this.emailTextbox).toBeVisible();
    await this.emailTextbox.fill(email);

    await expect(this.lastNameTextbox).toBeVisible();
    await this.lastNameTextbox.fill(lastName);

    await expect(this.addressCombobox).toBeVisible();
    await this.addressCombobox.fill(address);

    await expect(this.cityTextbox).toBeVisible();
    await this.cityTextbox.fill(city);

    await expect(this.pinCodeTextbox).toBeVisible();
    await this.pinCodeTextbox.fill(pinCode);
  }

  async assertShippingDetailsAccepted({ email, lastName, address, city, pinCode }: ShippingDetails): Promise<void> {
    await expect(this.emailTextbox).toHaveValue(email);
    await expect(this.lastNameTextbox).toHaveValue(lastName);
    await expect(this.addressCombobox).toHaveValue(address);
    await expect(this.cityTextbox).toHaveValue(city);
    await expect(this.pinCodeTextbox).toHaveValue(pinCode);

    await expect(this.countryRegionCombobox).toBeVisible();
  }

  async verifyPaymentSectionVisible(): Promise<void> {
    await expect(this.paymentHeading).toBeVisible();
    await expect(this.creditCardHeading).toBeVisible();
    await expect(this.payNowButton).toBeVisible();
  }

  async verifyOrderSummaryForGreyJacket(): Promise<void> {
    await expect(this.orderSummaryHeading).toBeVisible();
    await expect(this.shoppingCartTable).toBeVisible();
    await expect(this.shoppingCartTable).toContainText('Grey jacket');
    await expect(this.shoppingCartTable).toContainText('£55.00');
  }
}
