import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const HOME_TITLE = 'Home · TestverQA';
export const HOME_HEADING = 'A complete playground for test automation';

/**
 * Home page of the TestverQA playground (https://testplay.venomva.com/).
 * Identity contract for guests mirrors the Explorer-generated spec:
 *   - Page title:  "Home · TestverQA"
 *   - Main heading: "A complete playground for test automation"
 */
export class HomePage extends BasePage {
  readonly page: Page;
  readonly headings: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.headings = page.locator('h1, h2');
    this.heading = page.getByRole('heading', { level: 1 });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(HOME_TITLE);
  }

  async expectHeading(): Promise<void> {
    await expect(this.heading).toHaveText(HOME_HEADING);
  }

  async primaryHeadingText(): Promise<string> {
    return (await this.headings.first().innerText()).trim();
  }
}