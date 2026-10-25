import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const TABLES_TITLE = 'Tables & Grids · TestverQA';
export const TABLES_HEADING = 'Tables & Grids';
/** Placeholder on the table search box — searches name or SKU. */
export const TABLES_SEARCH_PLACEHOLDER = 'Search name or SKU…';

/**
 * Tables & Grids module of the TestverQA playground.
 *
 * Confirmed live (guest, staging): "Rich data table" tab (default) with a
 * sortable/filterable/paginated grid (9 cols), client-side search by name/SKU
 * (data-testid="t-search"), category filter (t-cat), page-size limit (t-limit),
 * pagination (t-page-N / t-prev / t-next), row checkboxes (t-row-N-check,
 * master t-checkall), per-row delete (t-row-N-del). Tabs switch to Static /
 * Expandable / Virtual (10k rows) variants. Server-backed via /tables/data.
 */
export class TablesPage extends BasePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly table: Locator;
  readonly searchInput: Locator;
  readonly categorySelect: Locator;
  readonly limitSelect: Locator;
  readonly nextButton: Locator;
  readonly prevButton: Locator;
  readonly checkAll: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.table = page.getByTestId('t-table');
    this.searchInput = page.getByTestId('t-search');
    this.categorySelect = page.locator('select#t-cat');
    this.limitSelect = page.locator('select#t-limit');
    this.nextButton = page.getByTestId('t-next');
    this.prevButton = page.getByTestId('t-prev');
    this.checkAll = page.getByTestId('t-checkall');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(TABLES_TITLE);
  }

  async expectHeading(): Promise<void> {
    await expect(this.heading).toHaveText(TABLES_HEADING);
  }

  /** Perform a client-side search by name or SKU (e.g. "SKU-00003"). */
  async search(value: string): Promise<void> {
    await this.searchInput.fill(value);
  }

  /** Filter by category label (e.g. "Beauty"). */
  async filterByCategory(label: string): Promise<void> {
    await this.categorySelect.selectOption(label);
  }
}