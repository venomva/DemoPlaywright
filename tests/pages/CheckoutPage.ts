import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export const CHECKOUT_TITLE = 'Checkout · TestverQA';
export const CHECKOUT_HEADING = 'Checkout';
/** Test card accepted by the sandbox gateway (placeholder on the payment step). */
export const TEST_CARD_NUMBER = '4242 4242 4242 4242';

/**
 * Checkout flow of the TestverQA shop — 5 steps.
 *
 * Confirmed live (guest, staging):
 *   1 /shop/checkout/1 — shipping: ck-name, ck-phone, ck-address, ck-city, ck-zip (all required), country select (name=country)
 *   2 /shop/checkout/2 — billing: same-as-shipping checkbox (checked default)
 *   3 /shop/checkout/3 — method: Standard $9.99 / Express $19.99 / Overnight $39.99
 *   4 /shop/checkout/4 — payment: card tab, number/expiry/cvv; wallet; cod
 *   5 /shop/checkout/5 — review + "I agree to the terms & conditions" + Place order
 * Success → /shop/order/ORD-<id> "Order placed successfully!"
 */
export class CheckoutPage extends BasePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly zipInput: Locator;
  readonly countrySelect: Locator;
  readonly continueButton: Locator;
  readonly cardNumberInput: Locator;
  readonly cardExpiryInput: Locator;
  readonly cardCvvInput: Locator;
  readonly agreeCheckbox: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.nameInput = page.getByTestId('ck-name');
    this.phoneInput = page.getByTestId('ck-phone');
    this.addressInput = page.getByTestId('ck-address');
    this.cityInput = page.getByTestId('ck-city');
    this.zipInput = page.getByTestId('ck-zip');
    this.countrySelect = page.locator('select[name="country"]');
    this.continueButton = page.getByTestId('ck-next');
    this.cardNumberInput = page.getByTestId('card-number');
    this.cardExpiryInput = page.getByTestId('card-exp');
    this.cardCvvInput = page.getByTestId('card-cvv');
    this.agreeCheckbox = page.getByTestId('ck-agree');
    this.placeOrderButton = page.getByTestId('ck-next');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async expectTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(CHECKOUT_TITLE);
  }

  /** Fill the step-1 shipping form (all fields are required). */
  async fillShipping(
    name: string,
    phone: string,
    address: string,
    city: string,
    zip: string,
    country = 'United States',
  ): Promise<void> {
    await this.nameInput.fill(name);
    await this.phoneInput.fill(phone);
    await this.addressInput.fill(address);
    await this.cityInput.fill(city);
    await this.zipInput.fill(zip);
    await this.countrySelect.selectOption(country);
  }

  /** Fill the step-4 payment card fields with the sandbox test card. */
  async fillCardPayment(
    number = TEST_CARD_NUMBER,
    expiry = '12/28',
    cvv = '123',
  ): Promise<void> {
    await this.cardNumberInput.fill(number);
    await this.cardExpiryInput.fill(expiry);
    await this.cardCvvInput.fill(cvv);
  }

  /** Accept terms on step 5 (required before placing the order). */
  async acceptTerms(): Promise<void> {
    await this.agreeCheckbox.check();
  }

  async goToNextStep(): Promise<void> {
    await this.continueButton.click();
  }
}