import { test, expect } from '@playwright/test';

test('searching narrows the product grid', async ({ page }) => {
  await page.goto('/products');
  await expect(page.locator('a[href^="/products/"]').first()).toBeVisible();

  const initialCount = await page.locator('a[href^="/products/"]').count();

  await page.getByPlaceholder('Search products…').fill('tunnel');

  await expect(page.getByRole('heading', { name: 'Tunnel' })).toBeVisible();
  const filteredCount = await page.locator('a[href^="/products/"]').count();
  expect(filteredCount).toBeLessThan(initialCount);
});

test('sorting by price reorders the grid', async ({ page }) => {
  await page.goto('/products');
  await expect(page.locator('a[href^="/products/"]').first()).toBeVisible();

  await page.getByLabel('Sort by').selectOption('price-asc');

  const prices = await page.locator('text=/^\\$\\d+\\.\\d{2}$/').allTextContents();
  const numericPrices = prices.map((p) => parseFloat(p.replace('$', '')));
  const sorted = [...numericPrices].sort((a, b) => a - b);
  expect(numericPrices).toEqual(sorted);
});

test('clicking a product opens its detail page with reviews', async ({ page }) => {
  await page.goto('/products');
  await page.getByRole('heading', { name: 'Tunnel' }).click();

  await expect(page).toHaveURL(/\/products\/.+/);
  await expect(page.getByRole('heading', { name: 'Tunnel', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Reviews' })).toBeVisible();
});
