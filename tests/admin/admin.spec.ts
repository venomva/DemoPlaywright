import { test, expect } from '../fixtures/fixtures';
import {
  AdminDashboardPage,
  ADMIN_TITLE,
  KPI_USERS,
  KPI_PRODUCTS,
  KPI_ORDERS,
  KPI_REVENUE,
  RECENT_ORDERS_COUNT,
  NOTIFICATION_COUNT,
} from '../pages/AdminDashboardPage';
import { loginAsAdmin } from '../helpers/auth';

/**
 * Logged-in admin dashboard journeys (TestverQA /admin).
 *
 * The dashboard is a read-only module: KPI stat cards, an "Orders by status"
 * Chart.js bar chart, a notifications feed and a recent-orders table. All
 * journeys run as the admin user (session restored, consistent with the
 * profile suite) and assert only read state — nothing on this page writes.
 */

test('Admin dashboard renders with title, heading and nav active state', async ({
  loginPage,
  tfaPage,
  adminDashboardPage,
}) => {
  await loginAsAdmin(loginPage, tfaPage);

  await adminDashboardPage.gotoAdmin();
  await adminDashboardPage.expectTitle();
  await adminDashboardPage.expectLoaded();

  // Sidebar: Admin Dashboard is the active section, and the global user pill
  // confirms the admin session is live.
  await expect(adminDashboardPage.navAdmin).toHaveClass(/active/);
  await expect(loginPage.page.getByTestId('user-pill')).toBeVisible();
});

test('Admin dashboard shows all four KPI stat cards with seeded values', async ({
  loginPage,
  tfaPage,
  adminDashboardPage,
}) => {
  await loginAsAdmin(loginPage, tfaPage);

  await adminDashboardPage.gotoAdmin();
  await adminDashboardPage.expectKpis(KPI_USERS, KPI_PRODUCTS, KPI_ORDERS, KPI_REVENUE);
  await adminDashboardPage.expectChartVisible();
});

test('Admin dashboard notifications feed renders all seeded notifications', async ({
  loginPage,
  tfaPage,
  adminDashboardPage,
}) => {
  await loginAsAdmin(loginPage, tfaPage);

  await adminDashboardPage.gotoAdmin();
  await adminDashboardPage.expectNotificationCount(NOTIFICATION_COUNT);
});

test('Admin dashboard recent-orders table shows headers and seeded rows', async ({
  loginPage,
  tfaPage,
  adminDashboardPage,
}) => {
  await loginAsAdmin(loginPage, tfaPage);

  await adminDashboardPage.gotoAdmin();
  await adminDashboardPage.expectRecentOrdersHeaders();
  await adminDashboardPage.expectRecentOrdersCount(RECENT_ORDERS_COUNT);
  await adminDashboardPage.expectFirstOrderRow();
});

test('Admin dashboard View shop link navigates to the shop module', async ({
  loginPage,
  tfaPage,
  adminDashboardPage,
}) => {
  await loginAsAdmin(loginPage, tfaPage);

  await adminDashboardPage.gotoAdmin();
  await adminDashboardPage.clickViewShop();

  await expect(adminDashboardPage.page).toHaveURL('https://testplay.venomva.com/shop');
  await expect(adminDashboardPage.page).toHaveTitle(/Shop/);
});