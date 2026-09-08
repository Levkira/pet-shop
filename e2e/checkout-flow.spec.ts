import { test, expect } from '@playwright/test';

test('add to cart, check out, and see an order confirmation', async ({ page }) => {
  await page.goto('/products');

  const firstTitleLink = page.locator('h3 a[href^="/products/"]').first();
  await expect(firstTitleLink).toBeVisible();
  const productTitle = await firstTitleLink.textContent();

  await page
    .getByRole('button', { name: 'Add to cart' })
    .first()
    .click();

  await expect(page.getByRole('status')).toContainText('Added');
  await expect(page.getByRole('status')).toContainText(productTitle ?? '');

  await expect(page.getByRole('link', { name: /Cart \(1\)/ })).toBeVisible();

  await page.getByRole('link', { name: /Cart/ }).click();
  await expect(page.getByText(/^Total \$/)).toBeVisible();

  await page.getByRole('link', { name: 'Checkout' }).click();

  await page.getByLabel('Full name').fill('Jane Appleseed');
  await page.getByLabel('Email').fill('jane@example.com');
  await page.getByLabel('Shipping address').fill('123 Bark Ave, Springfield');
  await page.getByLabel('Card number').fill('4242 4242 4242 4242');
  await page.getByLabel('Expiry').fill('12/30');

  await page.getByRole('button', { name: /Place order/ }).click();

  await expect(page.getByText('Order placed!')).toBeVisible();
  await expect(page.getByText(/Order #/)).toBeVisible();

  await expect(page.getByRole('link', { name: 'Cart' })).toBeVisible();
  await page.getByRole('link', { name: 'Cart' }).click();
  await expect(page.getByText('Your cart is empty')).toBeVisible();
});

test('shows validation errors for an incomplete checkout form', async ({ page }) => {
  await page.goto('/products');
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.getByRole('link', { name: /Cart/ }).click();
  await page.getByRole('link', { name: 'Checkout' }).click();

  await page.getByLabel('Card number').fill('not-a-card');
  await page.getByRole('button', { name: /Place order/ }).click();

  await expect(page.getByText('Enter your full name')).toBeVisible();
  await expect(page.getByText('Enter a valid card number')).toBeVisible();
});
