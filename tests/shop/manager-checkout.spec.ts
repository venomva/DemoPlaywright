import { test, expect } from '../fixtures/fixtures';
import { loginAsManager } from '../helpers/auth';
import { resetState } from '../helpers/reset';
import { loadCustomers } from '../helpers/testData';
import { SHOP_TITLE } from '../pages/ShopPage';
import { CART_TITLE, CART_HEADING } from '../pages/CartPage';
import { CHECKOUT_TITLE, CHECKOUT_HEADING } from '../pages/CheckoutPage';
import { PROFILE_TITLE } from '../pages/ProfilePage';

/**
 * Logged-in manager purchase journey (TestverQA):
 * sign in → baseline orders count → shop (Electronics, price low→high) →
 * add the two cheapest products → cart coupon SAVE10 with total arithmetic →
 * 5-step checkout (Express shipping) → order confirmation → profile post-check.
 *
 * Data: the shipping details come from data/customers.csv — the journey runs
 * once per customer row in that file.
 * State: POST /api/reset {"size":"medium"} runs before and after each test for
 * a deterministic shop/cart/order baseline.
 */

const ELECTRONICS_CATEGORY = 'Electronics';
const SORT_PRICE_ASC = 'price-asc';
/** The two cheapest Electronics products (their "+ Add" buttons, as recorded). */
const CHEAPEST_PRODUCT_IDS = [442, 331] as const;
const COUPON_CODE = 'SAVE10';
/** SAVE10 takes 10% off the subtotal. */
const SAVE10_PERCENT = 0.1;
const CENTS_TOLERANCE = 0.02;

/** Every customer row of data/customers.csv — one test per row. */
const CUSTOMERS = loadCustomers();

// The purchase persists in the sandbox store, so restore the seeded state
// afterwards — the shared manager account must not accumulate orders.
test.beforeEach(async ({ request }) => {
  await resetState(request);
});

test.afterEach(async ({ request }) => {
  await resetState(request);
});

for (const customer of CUSTOMERS) {
  test(`Manager buys the cheapest electronics with a coupon - ${customer.fullName}`, async ({
    page,
    loginPage,
    profilePage,
    shopPage,
    cartPage,
    checkoutPage,
  }) => {
    // Log in as the manager using loginAsManager
    await loginAsManager(loginPage);

    // Baseline: the orders count before this purchase.
    await profilePage.gotoProfile();
    await expect(page).toHaveTitle(PROFILE_TITLE);
    // Read the Orders count on the profile and keep it as ordersBefore
    const ordersBefore = await profilePage.ordersCount();

    // Shop: cheapest Electronics first.
    await shopPage.goto('/shop');
    await expect(page).toHaveTitle(SHOP_TITLE);
    await shopPage.applyProductFilters(ELECTRONICS_CATEGORY, SORT_PRICE_ASC);

    // Check the products are sorted by price, cheapest first.
    const prices = await shopPage.listedPrices();
    expect(prices.length).toBeGreaterThan(1);
    const ascending = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(ascending);

    // Add the two cheapest products to the cart.
    for (const productId of CHEAPEST_PRODUCT_IDS) {
      await shopPage.addProductToCart(productId);
    }

    // The cart badge shows 2 line items.
    await expect(shopPage.cartCount).toHaveText(String(CHEAPEST_PRODUCT_IDS.length));

    // Open the cart and apply the SAVE10 coupon.
    await shopPage.cartLink.click();
    await expect(page).toHaveTitle(CART_TITLE);
    await expect(cartPage.heading).toHaveText(CART_HEADING);
    await cartPage.applyCoupon(COUPON_CODE);
    await expect(cartPage.couponMessage).toBeVisible();
    // The summary re-renders asynchronously once the coupon is accepted.
    await cartPage.expectDiscountApplied();

    // The total must equal subtotal minus discount plus shipping plus tax.
    const summary = await cartPage.summaryAmounts();
    const expectedTotal =
      summary.subtotal - (summary.discount ?? 0) + (summary.shipping ?? 0) + (summary.tax ?? 0);
    expect(summary.discount, 'SAVE10 should produce a discount row').toBeGreaterThan(0);
    expect(Math.abs(summary.total - expectedTotal)).toBeLessThanOrEqual(CENTS_TOLERANCE);

    // SAVE10 takes exactly ten percent off the subtotal.
    const expectedDiscount = summary.subtotal * SAVE10_PERCENT;
    expect(
      Math.abs(summary.discount - expectedDiscount),
      `discount ${summary.discount} should be ${SAVE10_PERCENT * 100}% of subtotal ${summary.subtotal}`,
    ).toBeLessThanOrEqual(CENTS_TOLERANCE);

    // Proceed to checkout (step 1 — shipping), filled from the customer row.
    await checkoutPage.page.getByTestId('checkout-btn').click();
    await expect(page).toHaveTitle(CHECKOUT_TITLE);
    await expect(checkoutPage.heading).toHaveText(CHECKOUT_HEADING);
    await checkoutPage.fillShipping(
      customer.fullName,
      customer.phone,
      customer.address,
      customer.city,
      customer.zip,
    );
    await checkoutPage.goToNextStep();

    // Step 2 — billing (same as shipping is checked by default).
    await checkoutPage.goToNextStep();

    // Step 3 — Express shipping method.
    await checkoutPage.selectExpressShipping();
    await checkoutPage.goToNextStep();

    // Step 4 — payment with the sandbox test card.
    await checkoutPage.fillCardPayment('4242 4242 4242 4242', '12/30', '123');
    await checkoutPage.goToNextStep();

    // Step 5 — accept terms and place the order.
    await checkoutPage.acceptTerms();
    await checkoutPage.placeOrderButton.click();

    // Order placed successfully!
    await expect(page).toHaveURL(/\/shop\/order\/ORD-\d+$/);
    await checkoutPage.expectOrderPlaced();

    // Keep the order number shown on the confirmation as orderNumber
    const orderNumber = await checkoutPage.orderNumber();
    expect(orderNumber).toMatch(/^ORD-\d+$/);

    // Back on the profile: one more order, and the newest row is this order.
    await profilePage.gotoProfile();
    expect(await profilePage.ordersCount()).toBe(ordersBefore + 1);
    expect(await profilePage.newestOrderId()).toBe(orderNumber);
  });
}
