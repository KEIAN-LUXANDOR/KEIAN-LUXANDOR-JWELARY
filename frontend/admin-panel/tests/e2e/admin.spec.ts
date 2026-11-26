import { expect, test } from '@playwright/test';
import { signIn } from './helpers';

test('sends visitors to sign in, and back to the page they wanted', async ({ page }) => {
  await page.goto('/login');
  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/orders');
  await expect(page).toHaveURL(/\/login\?next=%2Forders/);
  await page.getByLabel('Email').fill('admin@keianluxandor.com');
  await page.getByLabel('Password').fill('wrong-password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Email or password is incorrect.')).toBeVisible();
  await page.getByLabel('Password').fill('keian-admin');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/orders$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Orders' })).toBeVisible();
});

test('dashboard shows the numbers and the four metals', async ({ page }) => {
  await signIn(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Welcome back/);
  for (const label of ['Revenue', 'Orders', 'Average order', 'New customers']) await expect(page.locator('.stat__label', { hasText: label })).toBeVisible();
  for (const metal of ['Yellow Gold', 'Rose Gold', 'White Gold', 'Silver 925']) await expect(page.locator('.legend__label', { hasText: metal })).toBeVisible();
});

test('add a product, find it, then delete it', async ({ page }) => {
  await signIn(page);
  await page.goto('/products/add');
  await page.getByRole('button', { name: 'Save product' }).click();
  await expect(page.getByText('Enter a product name')).toBeVisible();

  await page.getByLabel('Name').fill('Test Halo Ring');
  await page.getByLabel('Style # (SKU)').fill('kl-test-001');
  await page.getByLabel('Metal', { exact: true }).selectOption({ label: 'Silver 925' });
  await page.getByLabel('Price (USD)').fill('450');
  await page.getByLabel('In stock').fill('7');
  await page.getByRole('button', { name: 'Save product' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Test Halo Ring' })).toBeVisible();
  await expect(page.getByText('Style #KL-TEST-001')).toBeVisible();

  await page.goto('/products');
  await page.getByLabel('Search products').fill('KL-TEST-001');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await page.getByRole('button', { name: 'Delete Test Halo Ring' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('No products match these filters')).toBeVisible();
});

test('change stock on the inventory page', async ({ page }) => {
  await signIn(page);
  await page.goto('/inventory');
  const first = page.locator('tbody tr').first();
  const input = first.locator('input[type=number]');
  await input.fill('25');
  await input.press('Enter');
  await expect(page.locator('.toast')).toContainText('stock is now 25');
});

test('move an order along and see it in the history', async ({ page }) => {
  await signIn(page);
  await page.goto('/orders');
  await page.getByLabel('Order status').selectOption({ index: 2 }); // Processing
  await page.locator('tbody tr').first().locator('a').first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Order #KL-/);
  await page.getByLabel('Change to').selectOption('Shipped');
  await page.getByLabel('Tracking number').fill('1Z999');
  await page.getByLabel('Note (optional)').fill('Sent with UPS');
  await page.getByRole('button', { name: 'Save status' }).click();
  await expect(page.locator('.timeline li').first()).toContainText('Shipped — Sent with UPS');
  await expect(page.getByText('Tracking: 1Z999')).toBeVisible();
});

test('create a coupon; duplicate codes are refused', async ({ page }) => {
  await signIn(page);
  await page.goto('/coupons');
  await page.getByRole('button', { name: 'Add coupon' }).click();
  await page.getByLabel('Code').fill('welcome10');
  await page.getByRole('button', { name: 'Save coupon' }).click();
  await expect(page.getByText('This code already exists')).toBeVisible();
  await page.getByLabel('Code').fill('DIWALI25');
  await page.getByLabel('Percent off').fill('25');
  await page.getByRole('button', { name: 'Save coupon' }).click();
  await expect(page.locator('tbody')).toContainText('DIWALI25');
  await expect(page.locator('tbody')).toContainText('25% off');
});

test('staff only see the areas they are allowed to manage', async ({ page }) => {
  await signIn(page, 'daniel@keianluxandor.com');
  const menu = page.getByRole('complementary', { name: 'Admin menu' });
  await expect(menu.getByRole('link', { name: 'Orders' })).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Settings' })).toHaveCount(0);
  await page.goto('/settings');
  await expect(page.getByText("You don't have access to this page")).toBeVisible();
});

test('forgot password always shows the same message', async ({ page }) => {
  await page.goto('/forgot-password');
  await page.getByLabel('Email').fill('someone@example.com');
  await page.getByRole('button', { name: 'Send reset link' }).click();
  await expect(page.getByText(/If an admin account exists for someone@example.com/)).toBeVisible();
});

test('every admin page opens without errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await signIn(page);
  for (const path of ['/products', '/products/categories', '/specifications', '/inventory', '/pricing', '/orders', '/customers', '/payments', '/offers', '/coupons', '/banners', '/reviews', '/reports', '/users', '/settings']) {
    await page.goto(path);
    await expect(page.locator('h1')).toBeVisible();
  }
  expect(errors).toEqual([]);
});
