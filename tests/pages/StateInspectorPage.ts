import { expect, type Download, type Locator, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { BasePage } from './BasePage';

export const STATE_TITLE = 'State Inspector · TestverQA';
export const STATE_HEADING = 'State Inspector';
/** File name the "Snapshot & restore" card downloads. */
export const STATE_SNAPSHOT_FILENAME = 'state.json';
/**
 * Collections the state.json dump is expected to expose — the same store
 * sections the State Inspector page renders counters for.
 */
export const STATE_SNAPSHOT_KEYS = [
  'users',
  'products',
  'orders',
  'reviews',
  'tasks',
  'notifications',
  'uploads',
  'coupons',
  'carts',
];

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
  /** "Download state.json" button in the Snapshot & restore card. */
  readonly downloadSnapshotButton: Locator;
  /** State Inspector icon link in the shared app-header action bar. */
  readonly headerStateNavLink: Locator;
  /** Main content region of the State Inspector page. */
  readonly mainContent: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    // "Download state.json" secondary button under Snapshot & restore
    // Alt: [css] #snap-btn (0.97), [xpath] //button[normalize-space(text())='Download state.json'] (0.9)
    this.downloadSnapshotButton = page.getByTestId('snap-btn');
    // State Inspector icon link in the app-header actions (the recorded target was the SVG inside it)
    // Alt: [css] body > header > div:nth-of-type(3) > a:nth-of-type(1) (0.42), [xpath] /html/body/header[1]/div[3]/a[1] (0.35)
    this.headerStateNavLink = page.locator('header a[href*="/debug/state"]');
    // State Inspector main content region (page body under the app header)
    // Alt: [css] main.app-content (0.87), [xpath] //main[contains(normalize-space(.), 'DEBUG State Inspector Inspect, reseed, a')] (0.68)
    this.mainContent = page.getByTestId('app-content');
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

  /** Open the State Inspector from the shared app-header icon link. */
  async goToStateViaHeader(): Promise<void> {
    await this.headerStateNavLink.click();
    await this.page.waitForURL(/\/debug\/state/);
  }

  /** The State Inspector main content region is rendered. */
  async expectMainContent(): Promise<void> {
    await expect(this.mainContent).toBeVisible();
  }

  /** Press "Download state.json" and return the resulting browser download. */
  async downloadSnapshot(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadSnapshotButton.click(),
    ]);
    return download;
  }

  /**
   * Assert a browser download actually completed: no failure reason, the
   * expected JSON file name, a non-empty body, and a parseable snapshot that
   * carries the seeded store collections.
   *
   * The app names the file "state.json" and adds a timestamp suffix when it
   * has already been downloaded in the same session (e.g. "state-1795502721732.json"),
   * so the name check accepts both forms.
   */
  async expectDownloadSucceeded(
    download: Download,
    expectedFilename = STATE_SNAPSHOT_FILENAME,
  ): Promise<Record<string, unknown>> {
    const filename = download.suggestedFilename();
    const base = expectedFilename.replace(/\.json$/i, '');
    expect(await download.failure(), 'download should not report a failure').toBeNull();
    expect(filename, `download file name should be ${base}.json or ${base}-<timestamp>.json`).toMatch(
      new RegExp(`^${base}(-\\d+)?\\.json$`, 'i'),
    );

    const path = await download.path();
    expect(path, 'download should be saved to a temp path').toBeTruthy();

    const raw = readFileSync(path as string, 'utf-8');
    expect(raw.trim().length, 'downloaded file should not be empty').toBeGreaterThan(0);

    const snapshot = JSON.parse(raw) as Record<string, unknown>;
    for (const key of STATE_SNAPSHOT_KEYS) {
      expect(snapshot, `snapshot should expose the "${key}" collection`).toHaveProperty(key);
    }
    return snapshot;
  }
}