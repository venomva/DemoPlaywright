import { test, expect } from '../fixtures/fixtures';
import { STATE_TITLE, STATE_HEADING } from '../pages/StateInspectorPage';

/**
 * State Inspector page — guest exploration.
 * Covers the Explorer identity contract for /debug/state plus the read-only
 * reset-size selector. The reset form (POST action=/debug/reset) is a
 * state-mutating write — intentionally NOT submitted without an approved
 * state/cleanup recipe.
 */

test('State Inspector · TestverQA: page identity', async ({ page, stateInspectorPage }) => {
  await stateInspectorPage.goto('/debug/state');

  await expect(page).toHaveTitle(STATE_TITLE);
  await expect(stateInspectorPage.heading).toBeVisible();
  await expect(stateInspectorPage.heading).toHaveText(STATE_HEADING);
});

test('State Inspector: brand link returns to Home', async ({ stateInspectorPage }) => {
  await stateInspectorPage.goto('/debug/state');

  await stateInspectorPage.goHomeViaHeader();

  await expect(stateInspectorPage.page).toHaveURL('https://testplay.venomva.com/');
});

test('State Inspector: header Sign in CTA navigates to /auth/login', async ({
  stateInspectorPage,
}) => {
  await stateInspectorPage.goto('/debug/state');

  await stateInspectorPage.goToSignInViaHeader();

  await expect(stateInspectorPage.page).toHaveURL('https://testplay.venomva.com/auth/login');
});

test('State Inspector: reset size selector exposes three observed options', async ({
  stateInspectorPage,
}) => {
  await stateInspectorPage.goto('/debug/state');

  const sizeSelect = stateInspectorPage.page.locator('select[name="size"]');
  await expect(sizeSelect).toBeVisible();

  const options = sizeSelect.locator('option');
  await expect(options).toHaveCount(3);
  await expect(options.nth(0)).toHaveText('Small (~10 users / 50 products)');
  await expect(options.nth(1)).toHaveText('Medium (~50 users / 500 products)');
  await expect(options.nth(2)).toHaveText('Large (~200 users / 5,000 products)');
});