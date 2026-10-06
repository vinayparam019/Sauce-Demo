import { expect, Page } from '@playwright/test';
import { BasePage } from '../../core/ui/basePage';
import { credentials } from '../../config/credentials';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.open('/account/login');
  }

  async verifyFormVisible(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Customer Login' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Email Address' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  }

  async signIn(
    email = credentials.user.email,
    password = credentials.user.password,
  ): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Email Address' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Sign In' }).click();
  }
}