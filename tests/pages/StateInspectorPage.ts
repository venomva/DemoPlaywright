import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const STATE_TITLE = 'State Inspector · TestverQA';
export const STATE_HEADING = 'State Inspector';

/**
 * State Inspector page of the TestverQA playground.
 *
 * Identity contract for guests mirrors the Explorer-generated spec:
 *   - Page title:  "State Inspector · TestverQA"
 *   - Main heading: "State Inspector"
 *
 * The reset form (POST action=/debug/reset) is a state-mutating write —
 * intentionally NOT submitted in guest exploration scope without an approved
 * state/cleanup recipe.
 */
export class StateInspectorPage extends BasePage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(STATE_TITLE);
  }

  async expectHeading(): Promise<void> {
    await expect(this.heading).toHaveText(STATE_HEADING);
  }
}