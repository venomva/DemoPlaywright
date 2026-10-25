import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const SETTINGS_TITLE = 'Account settings · TestverQA';
export const SETTINGS_HEADING = 'Account settings';
export const ADMIN_USERNAME = 'admin';
export const ADMIN_ROLE = 'admin';
export const ADMIN_EMAIL = 'admin@testverqa.io';
export const ADMIN_FULL_NAME = 'Admin User';
/** Seeded manager identity on /auth/settings (verified live on staging). */
export const MANAGER_USERNAME = 'manager';
export const MANAGER_ROLE = 'manager';
export const MANAGER_EMAIL = 'manager@testverqa.io';
export const MANAGER_FULL_NAME = 'Manager User';
/**
 * Manager account security state: 2FA is NOT enabled for this account, so the
 * "Enable 2FA" toggle and the "Generate codes" recovery button are disabled
 * (unlike admin, whose 2FA is already enabled).
 */
export const MANAGER_2FA_DISABLED = true;
/** Success feedback after Save profile / Save preferences. */
export const SETTINGS_SUCCESS_PROFILE = 'Profile details saved successfully.';
export const SETTINGS_SUCCESS_PREFS = 'Notification preferences saved.';

/**
 * Account settings page (/auth/settings) of the TestverQA playground — logged-in only.
 *
 * Sections: Profile details (readonly username/role, editable full name + email),
 * Change password, Security (2FA + recovery codes), Notification preferences
 * (4 toggles), Active sessions, Danger zone.
 *
 * WRITE CONTRACT (verified live on staging):
 *   - Save profile -> .alert.alert-success[data-testid="settings-success"]
 *     "Profile details saved successfully." and the value persists on /auth/profile.
 *   - Save preferences -> same success alert, "Notification preferences saved."
 * Danger zone / password change are intentionally NOT automated (see run plan).
 */
export class SettingsPage extends BasePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly usernameInput: Locator;
  readonly roleInput: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly saveProfileButton: Locator;
  readonly savePrefsButton: Locator;
  readonly prefEmailToggle: Locator;
  readonly prefNewsToggle: Locator;
  readonly prefDigestToggle: Locator;
  readonly prefSmsToggle: Locator;
  readonly successAlert: Locator;
  readonly savePasswordButton: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.usernameInput = page.getByTestId('settings-username');
    this.roleInput = page.getByTestId('settings-role');
    this.fullNameInput = page.getByTestId('settings-fullname');
    this.emailInput = page.getByTestId('settings-email');
    this.saveProfileButton = page.getByTestId('settings-save-profile');
    this.savePrefsButton = page.getByTestId('settings-save-prefs');
    this.prefEmailToggle = page.getByTestId('pref-email-toggle');
    this.prefNewsToggle = page.getByTestId('pref-news-toggle');
    this.prefDigestToggle = page.getByTestId('pref-digest-toggle');
    this.prefSmsToggle = page.getByTestId('pref-sms-toggle');
    this.successAlert = page.getByTestId('settings-success');
    this.savePasswordButton = page.getByTestId('settings-save-password');
    this.currentPasswordInput = page.getByTestId('pw-current');
    this.newPasswordInput = page.getByTestId('pw-new');
    this.confirmPasswordInput = page.getByTestId('pw-confirm');
  }

  async gotoSettings(path = '/auth/settings'): Promise<void> {
    await this.goto(path);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(SETTINGS_TITLE);
  }

  async expectHeading(): Promise<void> {
    await expect(this.heading).toHaveText(SETTINGS_HEADING);
  }

  /** Username and role are immutable (readonly) identity fields. */
  async expectIdentityReadOnly(role = ADMIN_ROLE, username = ADMIN_USERNAME): Promise<void> {
    await expect(this.usernameInput).toHaveAttribute('readonly', '');
    await expect(this.roleInput).toHaveAttribute('readonly', '');
    await expect(this.usernameInput).toHaveValue(username);
    await expect(this.roleInput).toHaveValue(role);
  }

  /**
   * Security-section contract. The manager account has 2FA disabled, so both
   * the "Enable 2FA" toggle (sec-2fa-toggle) and "Generate codes" recovery
   * button (sec-gen-codes) must render DISABLED. Verified live on staging.
   */
  async expectSecurity2faDisabled(): Promise<void> {
    await expect(this.page.getByTestId('sec-2fa-toggle')).toBeVisible();
    await expect(this.page.getByTestId('sec-2fa-toggle')).toBeDisabled();
    await expect(this.page.getByTestId('sec-gen-codes')).toBeVisible();
    await expect(this.page.getByTestId('sec-gen-codes')).toBeDisabled();
  }

  /** Notification preferences render as 4 switch rows (wrapper visible, inputs are checkbox state). */
  async expectPreferenceToggles(): Promise<void> {
    const rows = ['pref-email', 'pref-news', 'pref-digest', 'pref-sms'];
    for (const row of rows) {
      await expect(this.page.getByTestId(row)).toBeVisible();
      await expect(this.page.getByTestId(`${row}-toggle`)).toHaveAttribute('type', 'checkbox');
    }
  }

  /** Fill the profile details and save. Returns nothing; caller asserts on the alert. */
  async updateFullNameAndSave(fullName = ADMIN_FULL_NAME, email = ADMIN_EMAIL): Promise<void> {
    await this.fullNameInput.fill(fullName);
    await this.emailInput.fill(email);
    await this.saveProfileButton.click();
  }

  async expectSuccessAlert(message: string): Promise<void> {
    await expect(this.successAlert).toBeVisible();
    await expect(this.successAlert).toHaveText(message);
  }
}