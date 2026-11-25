import { test, expect } from '../fixtures/fixtures';
import { STATE_SNAPSHOT_FILENAME } from '../pages/StateInspectorPage';

/**
 * State Inspector — snapshot download journey (/debug/state).
 *
 * Guest, read-only: the "Snapshot & restore" card exposes a "Download state.json"
 * button that streams a complete dump of the in-memory store. Nothing is written
 * (the reset form on the same page is deliberately never submitted).
 *
 * Verified live on staging:
 *   - Home header icon link opens /debug/state.
 *   - "Download state.json" triggers a browser download whose suggested file
 *     name is "state.json" and whose JSON body holds the seeded collections
 *     (users, products, orders, reviews, tasks, notifications, uploads,
 *     coupons, carts).
 */

test('File Download Verification', async ({ stateInspectorPage }) => {
  // Navigate to the playground home page.
  await stateInspectorPage.goto('/');
  await expect(stateInspectorPage.page).toHaveURL('https://testplay.venomva.com/');

  // Open the State Inspector from the app-header icon link.
  await stateInspectorPage.goToStateViaHeader();
  await stateInspectorPage.expectTitle();
  await stateInspectorPage.expectHeading();

  // The page body (State Inspector main content) is rendered before the download.
  await stateInspectorPage.expectMainContent();

  // Press "Download state.json" and capture the browser download event.
  const download = await stateInspectorPage.downloadSnapshot();

  // Step 5 (custom): validate the file downloaded successfully.
  const snapshot = await stateInspectorPage.expectDownloadSucceeded(
    download,
    STATE_SNAPSHOT_FILENAME,
  );

  // Sanity: the snapshot is a real dump, not an almost-empty object.
  expect(Object.keys(snapshot).length).toBeGreaterThan(3);
});
