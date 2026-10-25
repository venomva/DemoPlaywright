import { test, expect } from '../fixtures/fixtures';
import { ELEMENTS_TITLE, ELEMENTS_HEADING } from '../pages/ElementsPage';

/**
 * Buttons & Interactions module — guest exploration.
 * Covers the Explorer identity contract for /elements plus an evidence-based
 * read-only interaction (single-click feedback in #click-result). No business
 * data is written; all module interactions are self-contained UI feedback.
 */

test('Buttons & Interactions · TestverQA: page identity', async ({ page, elementsPage }) => {
  await elementsPage.goto('/elements');

  await expect(page).toHaveTitle(ELEMENTS_TITLE);
  await expect(elementsPage.heading).toBeVisible();
  await expect(elementsPage.heading).toHaveText(ELEMENTS_HEADING);
});

test('Buttons & Interactions: single click emits visible feedback', async ({ elementsPage }) => {
  await elementsPage.goto('/elements');

  await elementsPage.singleClickButton.click();
  await expect(elementsPage.clickResult).toBeVisible();
  // Observed feedback text starts with the button label (live exploration).
  await expect(elementsPage.clickResult).toContainText('Single click @');
});