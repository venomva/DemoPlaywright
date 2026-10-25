import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const ELEMENTS_TITLE = 'Buttons & Interactions · TestverQA';
export const ELEMENTS_HEADING = 'Buttons & Interactions';

/**
 * Buttons & Interactions module of the TestverQA playground.
 *
 * Identity contract for guests mirrors the Explorer-generated spec:
 *   - Page title:  "Buttons & Interactions · TestverQA"
 *   - Main heading: "Buttons & Interactions"
 *
 * Evidence-based interaction (read-only feedback, no business write):
 * clicking "Single click" (#btn-single) fills #click-result with text
 * starting "Single click @" — verified live during exploration.
 */
export class ElementsPage extends BasePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly singleClickButton: Locator;
  readonly clickResult: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.singleClickButton = page.getByTestId('btn-single');
    this.clickResult = page.getByTestId('click-result');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(ELEMENTS_TITLE);
  }

  async expectHeading(): Promise<void> {
    await expect(this.heading).toHaveText(ELEMENTS_HEADING);
  }
}