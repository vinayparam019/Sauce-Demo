import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/ui/basePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get loginHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Login' });
  }

  private get usernameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Username' });
  }

  private get passwordInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Password' });
  }

  private get loginButton(): Locator {
    return this.page.getByRole('button', { name: 'Login' });
  }

  async goto(): Promise<void> {
    await this.open('/web/index.php/auth/login');
  }

  async verifyLoginPageVisible(): Promise<void> {
    await this.verifyUrl('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await expect(this.loginHeading).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async login(params: { username: string; password: string }): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(params.username);
    await this.passwordInput.fill(params.password);
    await this.loginButton.click();
  }

  async verifyLoggedIn(): Promise<void> {
    await expect(this.page).not.toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await expect(this.loginButton).toHaveCount(0);
  }
}
