import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const FORMS_TITLE = 'Form Elements · TestverQA';
export const FORMS_HEADING = 'Form Elements Playground';
/** Observed HTML constraints on the "Standard inputs" form (evidence-based). */
export const FORMS_NUMBER_MIN = 0;
export const FORMS_NUMBER_MAX = 100;
export const FORMS_TEXTAREA_MAX_LENGTH = 200;
export const FORMS_READONLY_VALUE = 'Cannot edit me';
export const FORMS_DISABLED_VALUE = 'Disabled field';

/**
 * Form Elements module of the TestverQA playground.
 *
 * Identity contract for guests mirrors the Explorer-generated spec:
 *   - Page title:  "Form Elements · TestverQA"
 *   - Main heading: "Form Elements Playground"
 *
 * The "Standard inputs" form is a GET form (action=/forms) — reading field
 * constraints (number 0–100, textarea maxLength 200, readonly/disabled values)
 * is a read-only observation. Submitting it would re-render the same page with
 * query params; per the guest exploration scope, we do not submit business data.
 */
export class FormsPage extends BasePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly numberInput: Locator;
  readonly textareaInput: Locator;
  readonly readonlyInput: Locator;
  readonly disabledInput: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.numberInput = page.getByTestId('input-number');
    this.textareaInput = page.getByTestId('input-textarea');
    this.readonlyInput = page.getByTestId('input-readonly');
    this.disabledInput = page.getByTestId('input-disabled');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(FORMS_TITLE);
  }

  async expectHeading(): Promise<void> {
    await expect(this.heading).toHaveText(FORMS_HEADING);
  }
}