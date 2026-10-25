import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { FormsPage } from '../pages/FormsPage';
import { ElementsPage } from '../pages/ElementsPage';
import { ForgotPage } from '../pages/ForgotPage';
import { StateInspectorPage } from '../pages/StateInspectorPage';
import { ShopPage } from '../pages/ShopPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { TablesPage } from '../pages/TablesPage';
import { WidgetsPage } from '../pages/WidgetsPage';
import { DynamicPage } from '../pages/DynamicPage';
import { TfaPage } from '../pages/TfaPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';

/**
 * TestverQA fixtures. Every test gets ready-to-use page objects.
 * `page` is the Playwright fixture; each named fixture is a Page Object.
 */
type Fixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  formsPage: FormsPage;
  elementsPage: ElementsPage;
  forgotPage: ForgotPage;
  stateInspectorPage: StateInspectorPage;
  shopPage: ShopPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  tablesPage: TablesPage;
  widgetsPage: WidgetsPage;
  dynamicPage: DynamicPage;
  tfaPage: TfaPage;
  profilePage: ProfilePage;
  settingsPage: SettingsPage;
  adminDashboardPage: AdminDashboardPage;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  formsPage: async ({ page }, use) => {
    await use(new FormsPage(page));
  },
  elementsPage: async ({ page }, use) => {
    await use(new ElementsPage(page));
  },
  forgotPage: async ({ page }, use) => {
    await use(new ForgotPage(page));
  },
  stateInspectorPage: async ({ page }, use) => {
    await use(new StateInspectorPage(page));
  },
  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  tablesPage: async ({ page }, use) => {
    await use(new TablesPage(page));
  },
  widgetsPage: async ({ page }, use) => {
    await use(new WidgetsPage(page));
  },
  dynamicPage: async ({ page }, use) => {
    await use(new DynamicPage(page));
  },
  tfaPage: async ({ page }, use) => {
    await use(new TfaPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
  adminDashboardPage: async ({ page }, use) => {
    await use(new AdminDashboardPage(page));
  },
});

export { expect } from '@playwright/test';