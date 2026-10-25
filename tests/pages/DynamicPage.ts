import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const DYNAMIC_TITLE = 'Loaders & Waits · TestverQA';
export const DYNAMIC_HEADING = 'Loaders & Waits';
/** Default spinner delay (ms) on the delay input. */
export const DYNAMIC_DELAY_DEFAULT = '2000';

/**
 * Loaders & Waits module of the TestverQA playground.
 *
 * Confirmed live (guest, staging):
 *   - Spinner with configurable delay (delay-input, start-spinner) →
 *     resolves to "Resolved at <ISO timestamp>".
 *   - Skeleton loaders (skel-load) → real content.
 *   - Late element appears after 3s (late-trigger) — "A new button appears
 *     after 3 seconds."
 *   - Ephemeral element disappears after 5s (disappear-trigger).
 *   - Deterministic progress bar (prog-start, 5s).
 *   - Auto-refreshing counter (updates every second).
 *   - Infinite scroll list (infinite-scroll panel, items #101+).
 */
export class DynamicPage extends BasePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly delayInput: Locator;
  readonly startSpinnerButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.delayInput = page.getByTestId('delay-input');
    this.startSpinnerButton = page.getByTestId('start-spinner');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(DYNAMIC_TITLE);
  }

  async expectHeading(): Promise<void> {
    await expect(this.heading).toHaveText(DYNAMIC_HEADING);
  }
}