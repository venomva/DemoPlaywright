import { test, expect } from '../fixtures/fixtures';
import { LoginPage } from '../pages/LoginPage';
import { TfaPage } from '../pages/TfaPage';
import { ProfilePage, PROFILE_TITLE } from '../pages/ProfilePage';
import { SettingsPage, SETTINGS_TITLE, ADMIN_EMAIL, SETTINGS_SUCCESS_PROFILE, SETTINGS_SUCCESS_PREFS } from '../pages/SettingsPage';

/**
 * Logged-in admin profile journeys — TestverQA (/auth/profile, /auth/settings).
 *
 * Authentication: the seeded admin account goes through 2FA. Login is
 * admin/admin123 (documented on /debug/state — "Test credentials"), then the
 * OTP step uses the hint documented on /auth/2fa ("Hint for tests: 123456").
 *
 * WRITE CONTRACT (verified live on staging):
 *   - Save profile  -> success alert "Profile details saved successfully."
 *   - Save prefs    -> success alert "Notification preferences saved."
 * The profile-name test restores the pre-existing value afterwards so it
 * leaves no residue on the shared staging account.
 */

/** Sign in through the full login + 2FA flow. */
async function loginAsAdmin(loginPage: LoginPage, tfaPage: TfaPage): Promise<void> {
  await loginPage.goto('/auth/login');
  await expect(loginPage.usernameInput).toBeVisible({ timeout: 15000 });
  await loginPage.submitAdminCredentials();

  await expect(tfaPage.otpInput).toBeVisible({ timeout: 15000 });
  await tfaPage.submitOtp();

  // Authenticated landing: home page with the user pill in the header.
  await expect(loginPage.page.getByTestId('user-pill')).toBeVisible({ timeout: 15000 });
  await expect(loginPage.page).toHaveURL('https://testplay.venomva.com/');
}

test('Admin login completes 2FA and lands authenticated (home)', async ({ loginPage, tfaPage }) => {
  await loginAsAdmin(loginPage, tfaPage);
});

test('Admin profile page shows identity, account stats and recent orders', async ({
  loginPage,
  tfaPage,
  profilePage,
}) => {
  await loginAsAdmin(loginPage, tfaPage);

  await profilePage.gotoProfile();
  await expect(profilePage.page).toHaveTitle(PROFILE_TITLE);
  await profilePage.expectGreeting();

  // Identity card contract (seeded admin).
  await profilePage.expectAdminIdentity();

  // Recent orders table renders with its 3 seeded orders.
  await profilePage.expectRecentOrdersTable();
  const rows = profilePage.recentOrdersTable.locator('tbody tr');
  await expect(rows).toHaveCount(3);
});

test('Admin settings: identity is read-only, preferences render as toggles', async ({
  loginPage,
  tfaPage,
  settingsPage,
}) => {
  await loginAsAdmin(loginPage, tfaPage);

  await settingsPage.gotoSettings();
  await expect(settingsPage.page).toHaveTitle(SETTINGS_TITLE);
  await settingsPage.expectLoaded();
  await settingsPage.expectIdentityReadOnly();
  await settingsPage.expectPreferenceToggles();
});

test('Admin settings: save profile shows success and persists to profile (self-restoring)', async ({
  loginPage,
  tfaPage,
  profilePage,
  settingsPage,
}) => {
  await loginAsAdmin(loginPage, tfaPage);

  await settingsPage.gotoSettings();

  // Capture the pre-existing full name so we can restore it exactly.
  const originalName = await settingsPage.fullNameInput.inputValue();

  // Unique test value -> saves and reflects on the identity card.
  const testName = 'QA Admin Playwright';
  try {
    await settingsPage.updateFullNameAndSave(testName, ADMIN_EMAIL);
    await settingsPage.expectSuccessAlert(SETTINGS_SUCCESS_PROFILE);

    await profilePage.gotoProfile();
    await profilePage.expectIdentityName(testName);
  } finally {
    // Restore the original value so the shared staging account stays clean,
    // even if an assertion above fails mid-test.
    await settingsPage.gotoSettings();
    await settingsPage.updateFullNameAndSave(originalName, ADMIN_EMAIL);
    await settingsPage.expectSuccessAlert(SETTINGS_SUCCESS_PROFILE);
  }

  await profilePage.gotoProfile();
  await profilePage.expectIdentityName(originalName);
});

test('Admin settings: saving notification preferences confirms with success alert', async ({
  loginPage,
  tfaPage,
  settingsPage,
}) => {
  await loginAsAdmin(loginPage, tfaPage);

  await settingsPage.gotoSettings();
  await settingsPage.expectPreferenceToggles();

  // No-op save: no toggle changed, so the write is state-neutral.
  await settingsPage.savePrefsButton.click();
  await settingsPage.expectSuccessAlert(SETTINGS_SUCCESS_PREFS);
});