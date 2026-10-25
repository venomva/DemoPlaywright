import { test, expect } from '../fixtures/fixtures';
import {
  FORMS_TITLE,
  FORMS_HEADING,
  FORMS_NUMBER_MIN,
  FORMS_NUMBER_MAX,
  FORMS_TEXTAREA_MAX_LENGTH,
  FORMS_READONLY_VALUE,
  FORMS_DISABLED_VALUE,
} from '../pages/FormsPage';

/**
 * Form Elements module — guest exploration.
 * The "Standard inputs" form is GET (action=/forms); assertions below are
 * READ-ONLY (visible labels, observed HTML constraints 0..100, maxLength 200,
 * readonly/disabled values). No form submission occurs — that would be a
 * business write requiring an approved state/cleanup recipe.
 */

test('Form Elements · TestverQA: page identity', async ({ page, formsPage }) => {
  await formsPage.goto('/forms');

  await expect(page).toHaveTitle(FORMS_TITLE);
  await expect(formsPage.heading).toBeVisible();
  await expect(formsPage.heading).toHaveText(FORMS_HEADING);
});

test('Form Elements: header brand link returns to Home', async ({ formsPage }) => {
  await formsPage.goto('/forms');

  await formsPage.goHomeViaHeader();

  await expect(formsPage.page).toHaveURL('https://testplay.venomva.com/');
});

test('Form Elements: header Sign in CTA navigates to /auth/login', async ({ formsPage }) => {
  await formsPage.goto('/forms');

  await formsPage.goToSignInViaHeader();

  await expect(formsPage.page).toHaveURL('https://testplay.venomva.com/auth/login');
});

test('Form Elements: number input enforces observed min/max 0..100', async ({ formsPage }) => {
  await formsPage.goto('/forms');

  const numberInput = formsPage.numberInput;
  await expect(numberInput).toBeVisible();
  await expect(numberInput).toHaveAttribute('type', 'number');
  // Observed boundary constraints on the number field.
  await expect(numberInput).toHaveAttribute('min', String(FORMS_NUMBER_MIN));
  await expect(numberInput).toHaveAttribute('max', String(FORMS_NUMBER_MAX));
});

test('Form Elements: textarea enforces maxLength 200', async ({ formsPage }) => {
  await formsPage.goto('/forms');

  const textarea = formsPage.textareaInput;
  await expect(textarea).toBeVisible();
  await expect(textarea).toHaveAttribute('maxlength', String(FORMS_TEXTAREA_MAX_LENGTH));
});

test('Form Elements: readonly and disabled inputs expose fixed values', async ({ formsPage }) => {
  await formsPage.goto('/forms');

  await expect(formsPage.readonlyInput).toHaveAttribute('readonly', '');
  await expect(formsPage.readonlyInput).toHaveValue(FORMS_READONLY_VALUE);

  await expect(formsPage.disabledInput).toBeDisabled();
  await expect(formsPage.disabledInput).toHaveValue(FORMS_DISABLED_VALUE);
});