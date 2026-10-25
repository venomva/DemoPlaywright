import { test, expect } from '../fixtures/fixtures';
import { MODULE_PAGES } from '../pages/ModulePages';

/**
 * Module inventory — guest exploration of the TestverQA playground.
 * One data-driven identity assertion per module page captured during the
 * crawl (title + H1). Read-only; no business data is written.
 *
 * Pages with dedicated behaviour specs (home/auth/forms/elements/tables/
 * widgets/dynamic/state/shop) are included here only as an identity sweep —
 * the behaviour specs remain the source of truth for those modules.
 */

for (const { path, title, h1 } of MODULE_PAGES) {
  test(`Module page ${path} → "${h1}"`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });

    await expect(page).toHaveTitle(title);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(h1);
  });
}