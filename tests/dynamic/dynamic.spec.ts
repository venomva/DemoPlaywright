import { test, expect } from '../fixtures/fixtures';
import { DYNAMIC_TITLE, DYNAMIC_HEADING, DYNAMIC_DELAY_DEFAULT } from '../pages/DynamicPage';

/**
 * Loaders & Waits module — guest exploration.
 * Condition-based waits only (Playwright auto-waits + expect polling), no
 * bare sleeps. Verifies the wait-logic behaviors observed live on staging.
 */

test('Loaders & Waits · TestverQA: page identity', async ({ page, dynamicPage }) => {
  await dynamicPage.goto('/dynamic');

  await expect(page).toHaveTitle(DYNAMIC_TITLE);
  await expect(dynamicPage.heading).toBeVisible();
  await expect(dynamicPage.heading).toHaveText(DYNAMIC_HEADING);
});

test('Loaders & Waits: spinner resolves after the configured delay', async ({
  dynamicPage,
}) => {
  await dynamicPage.goto('/dynamic');

  // Default delay is 2000 ms; keep the default and start the spinner.
  await expect(dynamicPage.delayInput).toHaveValue(DYNAMIC_DELAY_DEFAULT);
  await dynamicPage.startSpinnerButton.click();

  // The spinner resolves to a "Resolved at <timestamp>" line.
  await expect(
    dynamicPage.page.getByText(/Resolved at \d{4}-\d{2}-\d{2}T/),
  ).toBeVisible({ timeout: 10_000 });
});

test('Loaders & Waits: late element appears after its timeout', async ({ dynamicPage }) => {
  await dynamicPage.goto('/dynamic');

  await dynamicPage.page.getByTestId('late-trigger').click();

  // Hint text advertises a new button after 3 seconds.
  await expect(
    dynamicPage.page.getByText('A new button appears after 3 seconds.'),
  ).toBeVisible();
});

test('Loaders & Waits: auto-refreshing counter updates', async ({ dynamicPage }) => {
  await dynamicPage.goto('/dynamic');

  const counter = dynamicPage.page.getByTestId('auto-counter');
  await expect(counter).toBeVisible();

  const first = await counter.innerText();
  await expect
    .poll(async () => (await counter.innerText()).trim(), { timeout: 5_000 })
    .not.toBe(first.trim());
});

test('Loaders & Waits: infinite scroll list renders items', async ({ dynamicPage }) => {
  await dynamicPage.goto('/dynamic');

  // #inf-scroll starts pre-populated with 20 rows and appends more on
  // scroll-to-bottom. The row numbers are global (advance every visit), so
  // match any "Infinite scroll item #<number>" row inside the panel.
  const scroller = dynamicPage.page.locator('#inf-scroll');
  await expect(scroller.getByText(/Infinite scroll item #\d+/).first()).toBeVisible();

  // Scrolling to the bottom appends at least 20 new rows.
  const countBefore = (await scroller.locator('div').count());
  await scroller.evaluate((el) => {
    (el as HTMLElement).scrollTop = (el as HTMLElement).scrollHeight;
  });
  await expect
    .poll(async () => scroller.locator('div').count(), { timeout: 5_000 })
    .toBeGreaterThan(countBefore);
});