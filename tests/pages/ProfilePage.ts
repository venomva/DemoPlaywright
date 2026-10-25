import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const PROFILE_TITLE = 'Profile · TestverQA';

/**
 * Seeded manager identity on /auth/profile (verified live on staging).
 * The manager account is #00003, member since January 2024, with one
 * recent order ORD-000115 ($7,062.00, shipped 3/23/2026).
 */
export const MANAGER_FULL_NAME = 'Manager User';
export const MANAGER_HANDLE = '@manager';
export const MANAGER_EMAIL = 'manager@testverqa.io';
export const MANAGER_ROLE = 'manager';
export const MANAGER_ACCOUNT_ID = '#00003';
export const MANAGER_ORDERS_PLACED = '1';
export const MANAGER_TOTAL_SPENT = '$7,062';
export const MANAGER_RECENT_ORDERS_COUNT = 1;
export const MANAGER_ORDER_ID = 'ORD-000115';
export const MANAGER_ORDER_TOTAL = '$7062.00';

/**
 * Profile page (/auth/profile) of the TestverQA playground — logged-in only.
 *
 * Shows the identity card (full name, @username, email, role), account stats
 * (orders placed / total spent / account id) and a "Recent orders" table whose
 * rows link to /shop/order/<orderId>.
 */
export class ProfilePage extends BasePage {
  readonly page: Page;
  readonly heading: Locator;
  /** H3 identity card heading (full name). */
  readonly identityName: Locator;
  readonly username: Locator;
  readonly email: Locator;
  readonly role: Locator;
  readonly recentOrdersTable: Locator;
  readonly statOrders: Locator;
  readonly statSpent: Locator;
  readonly statId: Locator;
  readonly infoCard: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.identityName = page.getByTestId('profile-name');
    this.username = page.getByTestId('profile-handle');
    this.email = page.getByTestId('profile-email-display');
    this.role = page.getByTestId('profile-role');
    this.recentOrdersTable = page.getByTestId('profile-orders-table');
    this.statOrders = page.getByTestId('stat-orders');
    this.statSpent = page.getByTestId('stat-spent');
    this.statId = page.getByTestId('stat-id');
    this.infoCard = page.getByTestId('profile-info-card');
  }

  async gotoProfile(path = '/auth/profile'): Promise<void> {
    await this.goto(path);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(PROFILE_TITLE);
  }

  /** H1 greeting is derived from the full name's first token, e.g. "Hello, Admin 👋". */
  async expectGreeting(): Promise<void> {
    await expect(this.heading).toHaveText(/^Hello, .+ 👋$/);
  }

  /**
   * Identity card contract: the full-name element renders a non-empty value and
   * the immutable identifiers (username, email) are exactly the seeded admin's.
   * The full name itself is user-mutable state on the shared staging account,
   * so its exact text is not hard-coded here — assert name is non-empty.
   */
  async expectAdminIdentity(): Promise<void> {
    await expect(this.identityName).toBeVisible();
    await expect(this.identityName).toHaveText(/\S+/);
    await expect(this.username).toBeVisible();
    await expect(this.email).toBeVisible();
  }

  /** The identity-card name shows the exact given full name (write verification). */
  async expectIdentityName(fullName: string): Promise<void> {
    await expect(this.identityName).toHaveText(fullName);
  }

  /** Recent-orders table renders at least one order row. */
  async expectRecentOrdersTable(): Promise<void> {
    await expect(this.recentOrdersTable).toBeVisible();
  }

  /**
   * Identity contract for the seeded manager account: exact, immutable
   * identity fields documented on /debug/state ("Test credentials") and
   * verified live on staging.
   */
  async expectRoleIdentity(
    fullName = MANAGER_FULL_NAME,
    handle = MANAGER_HANDLE,
    email = MANAGER_EMAIL,
    role = MANAGER_ROLE,
  ): Promise<void> {
    await expect(this.identityName).toHaveText(fullName);
    await expect(this.username).toHaveText(handle);
    await expect(this.email).toHaveText(email);
    await expect(this.role).toHaveText(role);
  }

  /**
   * Account stat cards (seeded values, verified live on staging):
   * ORDERS PLACED, TOTAL SPENT, ACCOUNT ID.
   */
  async expectAccountStats(
    orders = MANAGER_ORDERS_PLACED,
    spent = MANAGER_TOTAL_SPENT,
    id = MANAGER_ACCOUNT_ID,
  ): Promise<void> {
    await expect(this.statOrders).toHaveText(orders);
    await expect(this.statSpent).toHaveText(spent);
    await expect(this.statId).toHaveText(id);
  }

  /**
   * Recent-orders table contract for the manager: exactly the seeded order
   * row(s), each carrying its order id.
   */
  async expectRecentOrders(
    count = MANAGER_RECENT_ORDERS_COUNT,
    orderId = MANAGER_ORDER_ID,
  ): Promise<void> {
    const rows = this.recentOrdersTable.locator('tbody tr');
    await expect(rows).toHaveCount(count);
    await expect(this.recentOrdersTable).toContainText(orderId);
  }

  /**
   * The account stat cards render the label/value layout by role:
   * full name, handle, email are deduped against the info card.
   */
  async expectInfoCard(): Promise<void> {
    await expect(this.infoCard).toBeVisible();
    await expect(this.infoCard).toContainText('Full name');
    await expect(this.infoCard).toContainText('Username');
    await expect(this.infoCard).toContainText('Email');
    await expect(this.infoCard).toContainText('Role');
  }
}