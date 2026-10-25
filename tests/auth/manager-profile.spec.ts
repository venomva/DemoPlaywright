import { test, expect } from '../fixtures/fixtures';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage, PROFILE_TITLE } from '../pages/ProfilePage';
import { SettingsPage, SETTINGS_TITLE, SETTINGS_SUCCESS_PROFILE, SETTINGS_SUCCESS_PREFS, MANAGER_ROLE, MANAGER_USERNAME } from '../pages/SettingsPage';
import { loginAsManager } from '../helpers/auth';

/**
 * Logged-in manager profile journeys — TestverQA (/auth/profile, /auth/settings).
 *
 * Authentication: the seeded manager account (manager/manager123, documented on
 * /debug/state -> "Test credentials") does NOT go through 2FA — submitting
 * /auth/login lands directly on the authenticated home page.
 *
 * READ CONTRACT (verified live on staging):
 *   - Profile: identity card "Manager User", @manager, manager@testverqa.io,
 *     role badge "manager"; stats ORDERS PLACED 1 / TOTAL SPENT $7,062 /
 *     ACCOUNT ID #00003; recent-orders table with the single seeded order
 *     ORD-000115 ($7062.00) whose View link opens /shop/order/ORD-000115.
 *   - Settings: username+role readonly, full name+email editable;
 *     Security section: "Enable 2FA" and "Generate codes" DISABLED (manager
 *     has no 2FA enrolled — unlike admin).
 *
 * WRITE CONTRACT (verified live on staging):
 *   - Save profile  -> success alert "Profile details saved successfully."
 *   - Save prefs    -> success alert "Notification preferences saved."
 * The profile-name test restores the pre-existing value afterwards so it
 * leaves no residue on the shared staging account.
 */

test('Manager login lands directly authenticated (no 2FA step)', async ({
  loginPage,
}) => {
  await loginAsManager(loginPage);
  // Logging in as manager must NOT show the 2FA page — the OTP input must be gone.
  await expect(loginPage.page.getByTestId('otp-input')).toHaveCount(0);
  await expect(loginPage.page.getByTestId('user-pill')).toHaveText('manager');
});

test('Manager profile shows identity, account stats and recent orders', async ({
  loginPage,
  profilePage,
}) => {
  await loginAsManager(loginPage);

  await profilePage.gotoProfile();
  await expect(profilePage.page).toHaveTitle(PROFILE_TITLE);
  await profilePage.expectGreeting();

  // Identity card contract (seeded manager).
  await profilePage.expectRoleIdentity();

  // Account stats.
  await profilePage.expectAccountStats();

  // Recent orders table renders its 1 seeded order with the View link target.
  await profilePage.expectRecentOrders();
  const orderLink = profilePage.page.getByTestId('profile-order-view-115');
  await expect(orderLink).toHaveAttribute(
    'href',
    '/shop/order/ORD-000115',
  );
});

test('Manager recent-order View opens the order confirmation', async ({
  loginPage,
  profilePage,
}) => {
  await loginAsManager(loginPage);

  await profilePage.gotoProfile();
  const orderLink = profilePage.page.getByTestId('profile-order-view-115');
  await orderLink.click();

  await expect(profilePage.page).toHaveURL(/\/shop\/order\/ORD-000115$/);
  await expect(profilePage.page.getByRole('heading', { level: 1 })).toHaveText(
    'Order placed successfully!',
  );
  await expect(profilePage.page.getByRole('heading', { level: 2 })).toHaveText(
    'ORD-000115',
  );
  await expect(profilePage.page.getByText('$7062.00')).toBeVisible();
});

test('Manager settings: identity is read-only, 2FA controls are disabled', async ({
  loginPage,
  settingsPage,
}) => {
  await loginAsManager(loginPage);

  await settingsPage.gotoSettings();
  await expect(settingsPage.page).toHaveTitle(SETTINGS_TITLE);
  await settingsPage.expectLoaded();
  await settingsPage.expectIdentityReadOnly(MANAGER_ROLE, MANAGER_USERNAME);
  await settingsPage.expectPreferenceToggles();
  await settingsPage.expectSecurity2faDisabled();
});

test('Manager settings: save profile shows success and persists to profile (self-restoring)', async ({
  loginPage,
  profilePage,
  settingsPage,
}) => {
  await loginAsManager(loginPage);

  await settingsPage.gotoSettings();

  // Capture the pre-existing full name so we can restore it exactly.
  const originalName = await settingsPage.fullNameInput.inputValue();

  // Unique test value -> saves and reflects on the identity card.
  const testName = 'QA Manager Playwright';
  try {
    await settingsPage.updateFullNameAndSave(testName, 'manager@testverqa.io');
    await settingsPage.expectSuccessAlert(SETTINGS_SUCCESS_PROFILE);

    await profilePage.gotoProfile();
    await profilePage.expectIdentityName(testName);
  } finally {
    // Restore the original value so the shared staging account stays clean,
    // even if an assertion above fails mid-test.
    await settingsPage.gotoSettings();
    await settingsPage.updateFullNameAndSave(originalName, 'manager@testverqa.io');
    await settingsPage.expectSuccessAlert(SETTINGS_SUCCESS_PROFILE);
  }

  await profilePage.gotoProfile();
  await profilePage.expectIdentityName(originalName);
});

test('Manager settings: saving notification preferences confirms with success alert', async ({
  loginPage,
  settingsPage,
}) => {
  await loginAsManager(loginPage);

  await settingsPage.gotoSettings();
  await settingsPage.expectPreferenceToggles();

  // No-op save: no toggle changed, so the write is state-neutral.
  await settingsPage.savePrefsButton.click();
  await settingsPage.expectSuccessAlert(SETTINGS_SUCCESS_PREFS);
});