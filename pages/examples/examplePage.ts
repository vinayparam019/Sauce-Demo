import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../../core/ui/basePage';
import { credentials } from '../../config/credentials';

export class ExamplePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Attribute-based, not role/name-based: the demo site localizes input
  // placeholders (e.g. "Benutzername") but not these stable form attributes.
  private get usernameInput(): Locator {
    return this.page.locator('input[name="username"]');
  }

  private get passwordInput(): Locator {
    return this.page.locator('input[name="password"]');
  }

  private get loginButton(): Locator {
    return this.page.locator('button[type="submit"]');
  }

  // The public demo has renamed this heading across versions ("Dashboard" -> "Cockpit");
  // the URL segment has stayed stable, so that is the authoritative check below.
  private get dashboardHeading(): Locator {
    return this.page.getByRole('heading', { name: /Dashboard|Cockpit/ });
  }

  private get searchInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Search' });
  }

  async navigateToLogin(): Promise<void> {
    await this.open('/web/index.php/auth/login');
  }

  async login(
    username: string = process.env.TEST_USERNAME || process.env.APP_USERNAME || credentials.user.email,
    password: string = process.env.TEST_PASSWORD || process.env.APP_PASSWORD || '',
  ): Promise<void> {
    await this.navigateToLogin();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async searchMenu(menuName: string): Promise<void> {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill(menuName);
  }

  async verifyLoginPage(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Login' })).toBeVisible();
  }

  async verifyTitle(title: string): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  async verifyDashboardVisible(): Promise<void> {
    await this.verifyUrl(/\/web\/index\.php\/dashboard\/index/);
    await expect(this.dashboardHeading).toBeVisible();
  }

  async verifyMenuVisible(menuName: string): Promise<void> {
    await expect(this.page.getByRole('link', { name: menuName, exact: true })).toBeVisible();
  }
}
