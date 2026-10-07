import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/ui/basePage';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get firstNameInput(): Locator {
    return this.page.getByText('First Name').locator('..').getByRole('textbox');
  }

  private get lastNameInput(): Locator {
    return this.page.getByText('Last Name').locator('..').getByRole('textbox');
  }

  private get emailAddressInput(): Locator {
    return this.page.getByText('Email Address').locator('..').getByRole('textbox');
  }

  private get passwordInput(): Locator {
    return this.page.getByText('Password').locator('..').getByRole('textbox');
  }

  private get createButton(): Locator {
    return this.page.getByRole('button', { name: 'Create' });
  }

  private get homeNavLink(): Locator {
    return this.page.locator('#main-menu').getByRole('link', { name: 'Home' });
  }

  async navigate(): Promise<void> {
    await this.open('/account/register');
  }

  async verifyOnRegisterPage(): Promise<void> {
    await this.verifyUrl('/account/register');
    await expect(this.page.getByRole('heading', { name: 'Create Account' })).toBeVisible();
  }

  async verifyRegistrationFormFieldsVisible(): Promise<void> {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.emailAddressInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();

    await expect(this.createButton).toBeVisible();
    await expect(this.createButton).toBeEnabled();
  }

  async clickHomeInNavigation(): Promise<void> {
    await expect(this.homeNavLink).toBeVisible();
    await this.homeNavLink.click();
  }

  async verifyOnHomePage(): Promise<void> {
    await this.verifyUrl('/');
    await expect(this.page.getByRole('heading', { name: 'Sauce Demo' })).toBeVisible();
  }
}
