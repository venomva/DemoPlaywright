import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const LOGIN_TITLE = 'Sign in · TestverQA';
export const LOGIN_HEADING = 'Welcome back 👋';
export const FORGOT_PASSWORD_PATH = '/auth/forgot';
/**
 * Seeded demo credentials documented on the playground itself
 * (/debug/state -> "Test credentials", requires no private data).
 */
export const SEEDED_ADMIN_USERNAME = 'admin';
export const SEEDED_ADMIN_PASSWORD = 'admin123';
/**
 * Seeded manager credentials documented on the playground itself
 * (/debug/state -> "Test credentials"). The manager account does NOT go
 * through 2FA — submitting the login form lands directly on home.
 */
export const SEEDED_MANAGER_USERNAME = 'manager';
export const SEEDED_MANAGER_PASSWORD = 'manager123';

/**
 * Authentication module of the TestverQA playground.
 *
 * Identity contract for guests mirrors the Explorer-generated spec:
 *   - Page title:  "Sign in · TestverQA"
 *   - Main heading: "Welcome back 👋"
 *
 * EXPLORATION SCOPE — guest role: this page object only covers reading the
 * page identity, the auth-card link and the navigation links. Submitting the
 * login form (POST business-data write) is intentionally NOT implemented:
 * it requires an approved state/cleanup recipe and real credentials, which
 * are out of scope for the guest exploration mission.
 */
export class LoginPage extends BasePage {
  readonly page: Page;
  readonly heading: Locator;
  /** Auth-card brand link ("Testver", aria-label "Testver home") → home page. */
  readonly brandLink: Locator;
  readonly forgotLink: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberCheckbox: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.brandLink = page.getByRole('link', { name: 'Testver home' });
    this.forgotLink = page.getByTestId('forgot-link');
    this.usernameInput = page.getByTestId('username-input');
    // "Password" input on the sign-in form (required)
    this.passwordInput = page.getByTestId('password-input');
    this.rememberCheckbox = page.getByTestId('remember-checkbox');
    this.submitButton = page.getByTestId('login-submit');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(LOGIN_TITLE);
  }

  async expectHeading(): Promise<void> {
    await expect(this.heading).toHaveText(LOGIN_HEADING);
  }

  /**
   * Submit the login form with the seeded admin credentials.
   * The admin account goes through 2FA on submit (lands on /auth/2fa).
   */
  async submitAdminCredentials(
    username = SEEDED_ADMIN_USERNAME,
    password = SEEDED_ADMIN_PASSWORD,
  ): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  /**
   * Submit the login form with the seeded manager credentials.
   * The manager account does NOT go through 2FA — submitting lands directly
   * on the authenticated home page (no /auth/2fa step).
   */
  async submitManagerCredentials(
    username = SEEDED_MANAGER_USERNAME,
    password = SEEDED_MANAGER_PASSWORD,
  ): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}