import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const ADMIN_TITLE = 'Admin Dashboard · TestverQA';

/**
 * Seeded KPI values of the TestverQA playground dashboard (verified live on
 * staging — in-memory seed state, /admin renders for guest and logged-in alike).
 */
export const KPI_USERS = '50';
export const KPI_PRODUCTS = '500';
export const KPI_ORDERS = '201';
export const KPI_REVENUE = '$1,233,808.23';
export const RECENT_ORDERS_COUNT = 7;
export const NOTIFICATION_COUNT = 8;

/**
 * Admin dashboard page (/admin) of the TestverQA playground.
 *
 * Renders: four KPI stat cards, an "Orders by status" Chart.js bar chart
 * (canvas, no interactive DOM tooltip), a notifications feed (8 seeded cards)
 * and a "Recent orders" table whose rows carry ord-<id> testids.
 *
 * The module is read-only — no write/submit surfaces on this page.
 */
export class AdminDashboardPage extends BasePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly statUsers: Locator;
  readonly statProducts: Locator;
  readonly statOrders: Locator;
  readonly statRevenue: Locator;
  /** "Orders by status" Chart.js bar chart canvas. */
  readonly chartBar: Locator;
  /** Notifications feed container. */
  readonly notifList: Locator;
  /** The 8 seeded notification cards (notif-1 … notif-8). */
  readonly notifCards: Locator;
  /** Recent-orders data table. */
  readonly recentOrdersTable: Locator;
  /** "View shop" link in the Recent orders card header. */
  readonly viewShopLink: Locator;
  /** Sidebar admin link. */
  readonly navAdmin: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.heading = page.getByTestId('page-title');
    this.statUsers = page.getByTestId('stat-users');
    this.statProducts = page.getByTestId('stat-products');
    this.statOrders = page.getByTestId('stat-orders');
    this.statRevenue = page.getByTestId('stat-revenue');
    this.chartBar = page.getByTestId('chart-bar');
    this.notifList = page.getByTestId('notif-list');
    this.notifCards = page.getByTestId(/^notif-\d+$/);
    this.recentOrdersTable = page.getByTestId('recent-orders');
    this.viewShopLink = page.getByTestId('view-shop');
    this.navAdmin = page.getByTestId('nav-admin');
  }

  async gotoAdmin(path = '/admin'): Promise<void> {
    await this.goto(path);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.heading).toHaveText('Admin Dashboard');
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(ADMIN_TITLE);
  }

  /** All four KPI stat cards are visible with their seeded values. */
  async expectKpis(
    users = KPI_USERS,
    products = KPI_PRODUCTS,
    orders = KPI_ORDERS,
    revenue = KPI_REVENUE,
  ): Promise<void> {
    await expect(this.statUsers).toHaveText(users);
    await expect(this.statProducts).toHaveText(products);
    await expect(this.statOrders).toHaveText(orders);
    await expect(this.statRevenue).toHaveText(revenue);
  }

  /** The Chart.js bar chart canvas is rendered. */
  async expectChartVisible(): Promise<void> {
    await expect(this.chartBar).toBeVisible();
  }

  /** The notifications feed lists the seeded number of cards, each non-empty. */
  async expectNotificationCount(count = NOTIFICATION_COUNT): Promise<void> {
    await expect(this.notifList).toBeVisible();
    const cards = this.notifCards;
    await expect(cards).toHaveCount(count);
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toHaveText(/\S+/);
    }
  }

  /** Recent-orders table renders the 5 expected column headers. */
  async expectRecentOrdersHeaders(): Promise<void> {
    await expect(this.recentOrdersTable.locator('thead th')).toHaveText([
      'Order #',
      'Customer',
      'Total',
      'Status',
      'Date',
    ]);
  }

  /** Recent-orders table renders the seeded number of rows. */
  async expectRecentOrdersCount(count = RECENT_ORDERS_COUNT): Promise<void> {
    await expect(this.recentOrdersTable.locator('tbody tr')).toHaveCount(count);
  }

  /** The first (newest) order row matches the seeded ORD-000201 order. */
  async expectFirstOrderRow(): Promise<void> {
    const firstRow = this.recentOrdersTable.locator('tbody tr').first();
    await expect(firstRow).toContainText('ORD-000201');
    await expect(firstRow).toContainText('Ada Lovelace');
    await expect(firstRow).toContainText('$2146.23');
    await expect(firstRow).toContainText('pending');
  }

  /** Open the shop via the Recent orders card "View shop" link. */
  async clickViewShop(): Promise<void> {
    await this.viewShopLink.click();
  }
}