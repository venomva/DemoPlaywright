import { test, expect } from '../fixtures/fixtures';
import { WIDGETS_TITLE, WIDGETS_HEADING } from '../pages/WidgetsPage';

/**
 * Tabs & Accordions module — guest exploration.
 * Read-only interactions only: switching lazy-loaded tabs and expanding an
 * accordion panel. Matches observed behavior on staging.
 */

test('Tabs & Accordions · TestverQA: page identity', async ({ page, widgetsPage }) => {
  await widgetsPage.goto('/widgets');

  await expect(page).toHaveTitle(WIDGETS_TITLE);
  await expect(widgetsPage.heading).toBeVisible();
  await expect(widgetsPage.heading).toHaveText(WIDGETS_HEADING);
});

test('Tabs & Accordions: lazy tab loads content on click', async ({ widgetsPage }) => {
  await widgetsPage.goto('/widgets');

  // Default overview tab; clicking Statistics lazy-loads its panel.
  await widgetsPage.statisticsTab.click();

  await expect(
    widgetsPage.page.getByText(/Lazy-loaded content for tab "stats"/),
  ).toBeVisible();
});

test('Tabs & Accordions: accordion expands a panel on click', async ({ widgetsPage }) => {
  await widgetsPage.goto('/widgets');

  // The first accordion question; clicking reveals its answer text.
  await widgetsPage.accordionFirst.click();

  await expect(
    widgetsPage.page.getByText('A comprehensive web app to exercise every pattern'),
  ).toBeVisible();
});

test('Tabs & Accordions: vertical tabs switch panels', async ({ widgetsPage }) => {
  await widgetsPage.goto('/widgets');

  // Default "Profile" panel is visible.
  await expect(widgetsPage.page.getByText('Profile settings panel content.')).toBeVisible();

  // Switch to Security panel.
  await widgetsPage.page.getByTestId('vtab-2').click();

  await expect(widgetsPage.page.getByText('Two-factor, sessions, devices.')).toBeVisible();
});