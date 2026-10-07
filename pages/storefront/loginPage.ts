import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/ui/basePage';
import { credentials } from '../../config/credentials';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  private get customerLoginHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Customer Login' });
  }

  private get emailAddressInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Email Address' });
  }

  private get passwordInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Password' });
  }

  private get signInButton(): Locator {
    return this.page.getByRole('button', { name: 'Sign In' });
  }

  private get forgotYourPasswordLink(): Locator {
    return this.page.getByRole('link', { name: 'Forgot your password?' });
  }

  private get resetPasswordHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Reset Password' });
  }

  private get resetEmailInput(): Locator {
    return this.page.locator('#recover-email');
  }

  private get resetSubmitButton(): Locator {
    return this.page.locator('#recover-password').getByRole('button', { name: 'Submit' });
  }

  private get hCaptchaProtectedByText(): Locator {
    return this.page.getByText('Protected by hCaptcha');
  }

  async navigate(): Promise<void> {
    await this.open('/account/login');
  }

  async verifyOnLoginPage(): Promise<void> {
    await this.verifyUrl('/account/login');
    await expect(this.customerLoginHeading).toBeVisible();
  }

  async verifyFormVisible(): Promise<void> {
    await expect(this.customerLoginHeading).toBeVisible();
    await expect(this.emailAddressInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async signIn(email = credentials.user.email, password = credentials.user.password): Promise<void> {
    await this.emailAddressInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async openForgotPassword(): Promise<void> {
    await expect(this.forgotYourPasswordLink).toBeVisible();
    await expect(this.forgotYourPasswordLink).toBeEnabled();
    await this.forgotYourPasswordLink.click();
  }

  async verifyResetPasswordSectionVisible(): Promise<void> {
    await expect(this.resetPasswordHeading).toBeVisible();
    await expect(this.resetEmailInput).toBeVisible();
    await expect(this.resetSubmitButton).toBeVisible();
  }

  async submitPasswordReset(email: string): Promise<void> {
    await this.resetEmailInput.fill(email);
    await this.resetSubmitButton.click();
  }

  async verifyCaptchaChallengeVisible(): Promise<void> {
    await expect(this.hCaptchaProtectedByText).toBeVisible();
  }
}
