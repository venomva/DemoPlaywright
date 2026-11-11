import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const CART_TITLE = 'Cart · TestverQA';
export const CART_HEADING = 'Your cart';
/** Hint text listing the valid coupon codes on the cart page. */
export const CART_COUPON_HINT = 'SAVE10, WELCOME20, EXPIRED, MAXEDOUT';

/**
 * Cart page of the TestverQA shop.
 *
 * Confirmed live (guest, staging): line items with qty (data-testid="qty-N"),
 * remove (data-testid="remove-N"), coupon application via data-testid="coupon-input"
 * + "apply-coupon" (SAVE10 → -10%, WELCOME20 → -20%, EXPIRED/MAXEDOUT → errors),
 * order summary rows (Subtotal / Discount / Shipping / Tax (8%) / Total) and
 * "#coupon-msg" feedback. "Proceed to checkout" → /shop/checkout/{n}.
 */
export class CartPage extends BasePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly couponInput: Locator;
  readonly applyCouponButton: Locator;
  readonly couponMessage: Locator;
  readonly checkoutLink: Locator;
  readonly itemCount: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.couponInput = page.getByTestId('coupon-input');
    this.applyCouponButton = page.getByTestId('apply-coupon');
    this.couponMessage = page.locator('#coupon-msg');
    this.checkoutLink = page.getByRole('link', { name: /Proceed to checkout/ });
    this.itemCount = page.locator('p', { hasText: /item\(s\)/ });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(CART_TITLE);
  }

  async expectHeading(): Promise<void> {
    await expect(this.heading).toHaveText(CART_HEADING);
  }

  /** Apply a coupon code (e.g. SAVE10) and return immediately (caller asserts feedback). */
  async applyCoupon(code: string): Promise<void> {
    await this.couponInput.fill(code);
    await this.applyCouponButton.click();
  }

  /** Read the order-summary "Total" value as displayed (e.g. "$1932.61"). */
  async totalText(): Promise<string> {
    // Anchor "^Total" so "Subtotal" does not match too.
    const totalRow = this.page.locator('.flex-between', { hasText: /^Total/ });
    return (await totalRow.innerText()).trim();
  }

  /** Read the "Discount" row text (empty string when no coupon applied). */
  async discountText(): Promise<string> {
    const row = this.page.locator('.flex-between.text-success');
    return row.isVisible() ? (await row.innerText()).trim() : '';
  }

  /** Go to checkout (step 1). */
  async goToCheckout(): Promise<void> {
    await this.checkoutLink.click();
  }

  /** Wait until the order summary re-renders with a Discount row (coupon accepted). */
  async expectDiscountApplied(): Promise<void> {
    await expect(this.page.locator('.flex-between', { hasText: /^\s*Discount/ })).toBeVisible({
      timeout: 15000,
    });
  }

  /**
   * Order-summary amounts keyed by lower-cased label, e.g.
   * { subtotal: 268.5, discount: 26.85, shipping: 9.99, tax: 20.13, total: 283.12 }.
   * The discount is returned as a positive magnitude.
   */
  async summaryAmounts(): Promise<Record<string, number>> {
    const summary: Record<string, number> = {};
    const rowTexts = await this.page.locator('.flex-between').allInnerTexts();

    for (const text of rowTexts) {
      const label = text.match(/^\s*([A-Za-z][A-Za-z ]*)/);
      const amount = text.match(/-?\$([0-9][0-9,]*\.?[0-9]*)/);
      if (!label || !amount) {
        continue;
      }
      const key = label[1].trim().toLowerCase().replace(/\s*\(.*\)$/, '');
      summary[key] = Number(amount[1].replace(/,/g, ''));
    }

    // The Total cell carries its own test id — always prefer it.
    const totalText = await this.page.getByTestId('sum-total').innerText();
    const total = totalText.match(/-?\$([0-9][0-9,]*\.?[0-9]*)/);
    if (total) {
      summary.total = Number(total[1].replace(/,/g, ''));
    }
    return summary;
  }
}
