import { test, expect } from '../fixtures/fixtures';
import { HOME_TITLE, HOME_HEADING } from '../pages/HomePage';

/**
 * Baseline scenario — establishes the framework end-to-end and matches the
 * Explorer-generated contract for the TestverQA playground home page:
 *   title "Home · TestverQA" + heading "A complete playground for test automation" (guest).
 */
test('Home page loads with expected identity', async ({ page, homePage }) => {
  await homePage.goto('/');

  await expect(page).toHaveTitle(HOME_TITLE);
  await expect(homePage.heading).toBeVisible();
  await expect(homePage.heading).toHaveText(HOME_HEADING);
});

/**
 * Additive baseline: one sample home page verification step.
 */
test('Home page heading text matches expectations', async ({ homePage }) => {
  await homePage.goto('/');

  await homePage.expectLoaded();
  await expect(homePage.heading).toHaveText(HOME_HEADING);

  // Fallback assertion must never alter the canonical heading check above.
  const headingText = await homePage.primaryHeadingText();
  expect(headingText).toContain('complete playground');
});

/**
 * Navigation contract: the shared app-header "Sign in" CTA on the home page
 * (guest role) routes to /auth/login.
 */
test('Home: header Sign in CTA navigates to /auth/login', async ({ homePage }) => {
  await homePage.goto('/');

  await homePage.goToSignInViaHeader();

  await expect(homePage.page).toHaveURL('https://testplay.venomva.com/auth/login');
});