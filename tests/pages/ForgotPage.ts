import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const FORGOT_TITLE = 'Forgot password · TestverQA';
export const FORGOT_HEADING = 'Reset your password';
/** Observed: the email field on /auth/forgot is required. */
export const FORGOT_EMAIL_REQUIRED = true;

/**
 * Forgot-password page of the TestverQA playground.
 *
 * Covers the guest navigation contract: the "Forgot password?" link on
 * /auth/login lands on /auth/forgot with title "Forgot password · TestverQA"
 * and heading "Reset your password".
 *
 * EXPLORATION SCOPE — guest role: submitting the reset-link form (POST
 * business-data write) is intentionally NOT implemented; it would require an
 * approved state/cleanup recipe and would mutate email delivery state.
 */
export class ForgotPage extends BasePage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(FORGOT_TITLE);
  }

  async expectHeading(): Promise<void> {
    await expect(this.heading).toHaveText(FORGOT_HEADING);
  }
}