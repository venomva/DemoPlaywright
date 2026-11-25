import { test, expect } from '../fixtures/fixtures';
import { APIRequestContext } from '@playwright/test';
import { SHOP_TITLE, SHOP_HEADING } from '../pages/ShopPage';
import { CART_TITLE, CART_HEADING } from '../pages/CartPage';
import { CHECKOUT_TITLE, CHECKOUT_HEADING } from '../pages/CheckoutPage';

/**
 * Shop (E-commerce flow) — guest exploration, staging, no restrictions declared.
 * Sandbox shop: in-memory state, fake orders, test card 4242…
 *
 * CRITICAL JOURNEY: browse → add to cart → coupon → checkout (5 steps) → order confirmation.
 * The /api/reset recipe (POST, {"size":"medium"}) guarantees a clean, deterministic
 * starting state — the same recipe the API docs instruct for test isolation.
 */

const BASE_URL = (process.env.BASE_URL || 'https://testplay.venomva.com').replace(/\/$/, '');
const RESET_BODY = { size: 'medium' };

async function resetState(request: APIRequestContext): Promise<void> {
  const res = await request.post(`${BASE_URL}/api/reset`, { data: RESET_BODY });
  expect(res.ok(), 'POST /api/reset should succeed').toBeTruthy();
}

test('Shop · TestverQA: page identity', async ({ page, shopPage }) => {
  await shopPage.goto('/shop');

  await expect(page).toHaveTitle(SHOP_TITLE);
  await expect(shopPage.heading).toBeVisible();
  await expect(shopPage.heading).toHaveText(SHOP_HEADING);
});

test('Shop: adding a product increments the cart badge', async ({ page, shopPage }) => {
  await resetState(page.request);
  await shopPage.goto('/shop');

  await expect(shopPage.heading).toBeVisible();
  expect(await shopPage.cartCountValue()).toBe(0);

  await shopPage.addFirstProductToCart();

  await expect(shopPage.cartCount).toHaveText('1');
});

test('Shop: cart total and coupon SAVE10 discount are applied', async ({
  page,
  shopPage,
  cartPage,
}) => {
  await resetState(page.request);
  await shopPage.goto('/shop');
  await shopPage.addFirstProductToCart();

  // The add is an async JS POST — wait for the badge to confirm it landed
  // BEFORE navigating, otherwise the in-flight request gets aborted by goto.
  await expect(shopPage.cartCount).toHaveText('1');

  // Cart shows the line item and the full price before any coupon.
  await cartPage.goto('/shop/cart');
  await expect(page).toHaveTitle(CART_TITLE);
  await expect(cartPage.heading).toBeVisible();
  await expect(cartPage.heading).toHaveText(CART_HEADING);
  await expect(cartPage.totalText()).resolves.toContain('2146.23');

  // Apply SAVE10 → 10% discount on subtotal; totals shift accordingly.
  await cartPage.applyCoupon('SAVE10');
  await expect(cartPage.couponMessage).toBeVisible();
  await expect(cartPage.discountText()).resolves.toContain('197.80');
  await expect(cartPage.totalText()).resolves.toContain('1932.61');
});

test('Shop: full checkout journey places an order', async ({
  page,
  shopPage,
  cartPage,
  checkoutPage,
}) => {
  await resetState(page.request);

  // Step 0 — browse + add to cart.
  await shopPage.goto('/shop');
  await shopPage.addFirstProductToCart();
  // Wait for the add (async JS POST) to land before navigating.
  await expect(shopPage.cartCount).toHaveText('1');

  // Step 1 — shipping address (required fields).
  await cartPage.goto('/shop/cart');
  await cartPage.goToCheckout();
  await expect(page).toHaveTitle(CHECKOUT_TITLE);
  await expect(checkoutPage.heading).toBeVisible();
  await expect(checkoutPage.heading).toHaveText(CHECKOUT_HEADING);
  await checkoutPage.fillShipping(
    'Ada Lovelace',
    '+1 555 0100',
    '42 Analytical Lane',
    'London',
    '10001',
  );
  await checkoutPage.goToNextStep();

  // Step 2 — billing (same as shipping is checked by default) → step 3.
  const sameAsShipping = checkoutPage.page.getByTestId('ck-same');
  await expect(sameAsShipping).toBeChecked();
  await checkoutPage.goToNextStep();

  // Step 3 — shipping method (Standard $9.99 default) → step 4.
  const standard = checkoutPage.page.getByTestId('ship-std');
  await expect(standard).toBeChecked();
  await checkoutPage.goToNextStep();

  // Step 4 — payment with the sandbox test card → step 5.
  await checkoutPage.fillCardPayment();
  await checkoutPage.goToNextStep();

  // Step 5 — accept terms + place order.
  await checkoutPage.acceptTerms();
  await checkoutPage.placeOrderButton.click();

  // Order confirmation.
  await expect(page).toHaveURL(/\/shop\/order\/ORD-\d+$/);
  await expect(page).toHaveTitle(/Order ORD-\d+ · TestverQA/);
  await expect(page.getByText('Order placed successfully!')).toBeVisible();
  await expect(page.getByText('Incredible Wooden Ball')).toBeVisible();
});