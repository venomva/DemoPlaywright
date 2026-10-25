import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const WIDGETS_TITLE = 'Tabs & Accordions · TestverQA';
export const WIDGETS_HEADING = 'Tabs, Accordions & Navigation Widgets';

/**
 * Widgets module (Tabs & Accordions) of the TestverQA playground.
 *
 * Confirmed live (guest, staging):
 *   - Horizontal tabs, lazy-loaded content (lt-tab-1..4): clicking a tab
 *     renders "Lazy-loaded content for tab \"<key>\" at <timestamp>".
 *   - Accordion (acc-1..3): Q&A collapse panels, content expands on click.
 *   - Mega menu (mega-trigger) + vertical tabs (vtab-1..4, default "Profile").
 */
export class WidgetsPage extends BasePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly statisticsTab: Locator;
  readonly reviewsTab: Locator;
  readonly settingsTab: Locator;
  readonly accordionFirst: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.statisticsTab = page.getByTestId('lt-tab-2');
    this.reviewsTab = page.getByTestId('lt-tab-3');
    this.settingsTab = page.getByTestId('lt-tab-4');
    this.accordionFirst = page.getByTestId('acc-1');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(WIDGETS_TITLE);
  }

  async expectHeading(): Promise<void> {
    await expect(this.heading).toHaveText(WIDGETS_HEADING);
  }
}