import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const TFA_TITLE = '2FA · TestverQA';
export const TFA_HEADING = 'Two-factor authentication';
/**
 * Demo OTP documented directly on the 2FA page ("Hint for tests: 123456")
 * as part of the TestverQA playground's seeded credentials contract
 * (see /debug/state -> Test credentials: admin/admin123 goes through 2FA).
 */
export const TFA_OTP = '123456';

/**
 * Two-factor-authentication page of the TestverQA playground.
 *
 * The admin login flow is multi-page: /auth/login (username/password) ->
 * /auth/2fa (OTP) -> home. This page object covers the OTP step for the
 * seeded admin credential.
 */
export class TfaPage extends BasePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly otpInput: Locator;
  readonly verifyButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.otpInput = page.getByTestId('otp-input');
    this.verifyButton = page.getByTestId('otp-submit');
  }

  async gotoTfa(path = '/auth/2fa'): Promise<void> {
    await this.goto(path);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(TFA_TITLE);
  }

  async expectHeading(): Promise<void> {
    await expect(this.heading).toHaveText(TFA_HEADING);
  }

  /**
   * Complete the OTP step with the documented demo code.
   * Lands on the home page as the logged-in user.
   */
  async submitOtp(otp = TFA_OTP): Promise<void> {
    await this.otpInput.fill(otp);
    await this.verifyButton.click();
  }
}