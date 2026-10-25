import type { Locator, Page } from '@playwright/test';

/**
 * Base page: shared navigation + waits for the TestverQA playground.
 */
export class BasePage {
  protected readonly page: Page;
  /** Shared app-header brand link ("Testver Playground") — back to the home page. */
  readonly brandLink: Locator;
  /** Shared app-header "Sign in" CTA — opens the auth module. */
  readonly headerSignInLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.brandLink = page.getByTestId('brand-link');
    this.headerSignInLink = page.getByTestId('header-login');
  }

  async goto(path = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /** Navigate to the home page via the shared app-header brand link. */
  async goHomeViaHeader(): Promise<void> {
    await this.brandLink.click();
  }

  /** Navigate to /auth/login via the shared app-header "Sign in" CTA. */
  async goToSignInViaHeader(): Promise<void> {
    await this.headerSignInLink.click();
  }
}