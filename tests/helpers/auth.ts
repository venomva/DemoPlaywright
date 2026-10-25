import { expect } from '@playwright/test';
import type { LoginPage } from '../pages/LoginPage';
import type { TfaPage } from '../pages/TfaPage';

/**
 * Sign in through the full admin flow: /auth/login (admin/admin123, seeded on
 * /debug/state) -> /auth/2fa (OTP "123456", hinted on the 2FA page) -> home.
 */
export async function loginAsAdmin(
  loginPage: LoginPage,
  tfaPage: TfaPage,
): Promise<void> {
  await loginPage.goto('/auth/login');
  await expect(loginPage.usernameInput).toBeVisible({ timeout: 15000 });
  await loginPage.submitAdminCredentials();

  await expect(tfaPage.otpInput).toBeVisible({ timeout: 15000 });
  await tfaPage.submitOtp();

  // Authenticated landing: home page with the user pill in the header.
  await expect(loginPage.page.getByTestId('user-pill')).toBeVisible({ timeout: 15000 });
  await expect(loginPage.page).toHaveURL('https://testplay.venomva.com/');
}

/**
 * Sign in as the seeded manager (manager/manager123, documented on
 * /debug/state). Unlike admin, the manager account has NO 2FA step:
 * submitting /auth/login lands directly on the authenticated home page.
 */
export async function loginAsManager(loginPage: LoginPage): Promise<void> {
  await loginPage.goto('/auth/login');
  await expect(loginPage.usernameInput).toBeVisible({ timeout: 15000 });
  await loginPage.submitManagerCredentials();

  // Authenticated landing: home page with the user pill in the header.
  await expect(loginPage.page.getByTestId('user-pill')).toBeVisible({ timeout: 15000 });
  await expect(loginPage.page).toHaveURL('https://testplay.venomva.com/');
}