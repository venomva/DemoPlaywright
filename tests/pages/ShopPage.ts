import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const SHOP_TITLE = 'Shop · TestverQA';
export const SHOP_HEADING = 'Shop';
/** Prominent product shown on page 1 of the shop (position 1, featured). */
export const SHOP_FIRST_PRODUCT = 'Incredible Wooden Ball';
/** Cart CTA appears as "🛒 Cart (N)" where N is the line-item count. */
export const CART_COUNT_PREFIX = '🛒 Cart (';

/**
 * Shop (E-commerce flow) of the TestverQA playground.
 *
 * Guest exploration (staging, no restrictions): adding to cart, applying
 * coupons, and completing a 5-step checkout are legitimate sandbox journeys
 * (in-memory state, test card 4242…, order confirmations are fake).
 *
 * Identity contract observed live:
 *   - Page title: "Shop · TestverQA"
 *   - Heading:    "Shop"
 *   - 500 products, 12 per page, "Add to cart" (data-testid="add-cart-N"),
 *     filter by name/category/price, sort, paginate.
 */
export class ShopPage extends BasePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly cartLink: Locator;
  readonly cartCount: Locator;
  readonly firstAddToCartButton: Locator;
  readonly searchInput: Locator;
  readonly categorySelect: Locator;
  readonly sortSelect: Locator;
  readonly applyFiltersButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.cartLink = page.getByTestId('cart-link');
    this.cartCount = page.getByTestId('cart-count');
    this.firstAddToCartButton = page.getByTestId('add-cart-1');
    this.searchInput = page.getByTestId('filter-search');
    // The category/sort selects carry only name= attributes (no test-ids).
    this.categorySelect = page.locator('select[name="category"]');
    this.sortSelect = page.locator('select[name="sort"]');
    this.applyFiltersButton = page.getByTestId('filter-apply');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(SHOP_TITLE);
  }

  async expectHeading(): Promise<void> {
    await expect(this.heading).toHaveText(SHOP_HEADING);
  }

  /** Add the first product on the current page to the cart. */
  async addFirstProductToCart(): Promise<void> {
    await this.firstAddToCartButton.click();
  }

  /** Read the cart badge line-item count as an integer (e.g. "🛒 Cart (3)" → 3). */
  async cartCountValue(): Promise<number> {
    const badge = await this.cartCount.innerText();
    const match = badge.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
}