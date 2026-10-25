import { test, expect } from '../fixtures/fixtures';
import {
  TABLES_TITLE,
  TABLES_HEADING,
  TABLES_SEARCH_PLACEHOLDER,
} from '../pages/TablesPage';

/**
 * Tables & Grids module — guest exploration.
 * Covers the page identity + the read-only grid interactions observed live:
 * client-side search, category filter, pagination, and the master checkbox.
 * Row deletion (t-row-N-del) is intentionally NOT automated: it mutates the
 * sandbox dataset and requires the /api/reset recipe between repeats.
 */

test('Tables & Grids · TestverQA: page identity', async ({ page, tablesPage }) => {
  await tablesPage.goto('/tables');

  await expect(page).toHaveTitle(TABLES_TITLE);
  await expect(tablesPage.heading).toBeVisible();
  await expect(tablesPage.heading).toHaveText(TABLES_HEADING);
});

test('Tables & Grids: search filters rows client-side by SKU', async ({ tablesPage }) => {
  await tablesPage.goto('/tables');

  await expect(tablesPage.table).toBeVisible();
  await expect(tablesPage.searchInput).toHaveAttribute('placeholder', TABLES_SEARCH_PLACEHOLDER);

  // Filter to a single SKU → only that row remains.
  await tablesPage.search('SKU-00003');
  await expect(tablesPage.table.getByText('SKU-00003')).toBeVisible();
  await expect(tablesPage.table.getByText('SKU-00001')).toHaveCount(0);
});

test('Tables & Grids: category filter narrows the dataset', async ({ tablesPage }) => {
  await tablesPage.goto('/tables');

  await tablesPage.filterByCategory('Beauty');

  // Only Beauty rows remain (spot-check one known Beauty SKU).
  await expect(tablesPage.table.getByText('SKU-00002')).toBeVisible();
  // Skew-verify an Automotive row no longer appears.
  await expect(tablesPage.table.getByText('SKU-00005')).toHaveCount(0);
});

test('Tables & Grids: pagination advances pages', async ({ tablesPage }) => {
  await tablesPage.goto('/tables');

  // Default 10 rows per page; page 2 exists.
  const page2 = tablesPage.page.getByTestId('t-page-2');
  await expect(page2).toBeVisible();

  await tablesPage.nextButton.click();

  // Page 1 rows (e.g. SKU-00001..10) leave, page-2 rows appear.
  await expect(tablesPage.table.getByText('SKU-00011')).toBeVisible();
  await expect(tablesPage.table.getByText('SKU-00001')).toHaveCount(0);
});

test('Tables & Grids: limit selector changes page size', async ({ tablesPage }) => {
  await tablesPage.goto('/tables');

  await tablesPage.limitSelect.selectOption('25');

  // With 25 rows per page the grid renders more rows (spot-check).
  await expect(tablesPage.table.getByText('SKU-00025')).toBeVisible();
});

test('Tables & Grids: master checkbox selects all rows on the page', async ({ tablesPage }) => {
  await tablesPage.goto('/tables');

  await tablesPage.checkAll.check();

  const firstRow = tablesPage.page.getByTestId('t-row-1-check');
  await expect(firstRow).toBeChecked();
});