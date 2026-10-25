import { test, expect } from '../fixtures/fixtures';
import { LOGIN_TITLE, LOGIN_HEADING, FORGOT_PASSWORD_PATH } from '../pages/LoginPage';
import { FORGOT_TITLE, FORGOT_HEADING } from '../pages/ForgotPage';

/**
 * Authentication module — guest exploration.
 * Covers the Explorer candidates for /auth/login and the auth-card links.
 * Form SUBMISSION (POST) is a business-data write and remains BLOCKED for the
 * guest role: no approved state/cleanup recipe and no credentials are supplied.
 * All assertions on the login form are read-only (field presence/constraints).
 */

test('Sign in · TestverQA: page identity', async ({ page, loginPage }) => {
  await loginPage.goto('/auth/login');

  await expect(page).toHaveTitle(LOGIN_TITLE);
  await expect(loginPage.heading).toBeVisible();
  await expect(loginPage.heading).toHaveText(LOGIN_HEADING);
});

test('Sign in: navigation from auth-card "Testver" link', async ({ loginPage }) => {
  await loginPage.goto('/auth/login');

  await loginPage.brandLink.click();

  await expect(loginPage.page).toHaveURL('https://testplay.venomva.com/');
});

test('Sign in: navigation via "Forgot password?" link', async ({ page, loginPage }) => {
  await loginPage.goto('/auth/login');

  await loginPage.forgotLink.click();

  await expect(page).toHaveURL(FORGOT_PASSWORD_PATH);
});

test('Forgot password · TestverQA: page identity', async ({ page, forgotPage }) => {
  await forgotPage.goto('/auth/forgot');

  await expect(page).toHaveTitle(FORGOT_TITLE);
  await expect(forgotPage.heading).toBeVisible();
  await expect(forgotPage.heading).toHaveText(FORGOT_HEADING);
});

test('Sign in form exposes required username/password fields (guest, read-only)', async ({
  loginPage,
}) => {
  await loginPage.goto('/auth/login');

  // Read-only form constraints observed on the login page (guest role).
  const username = loginPage.page.getByTestId('username-input');
  const password = loginPage.page.getByTestId('password-input');
  const remember = loginPage.page.getByTestId('remember-checkbox');

  await expect(username).toBeVisible();
  await expect(password).toBeVisible();
  await expect(remember).toBeVisible();

  // The two auth fields are required per the observed HTML contract.
  await expect(username).toHaveAttribute('required', '');
  await expect(password).toHaveAttribute('required', '');
});