import { expect, type Page } from '@playwright/test';

export const DEMO_EMAIL = 'admin@keianluxandor.com';
export const DEMO_PASSWORD = 'keian-admin';

/** Fresh demo data, then sign in as the owner. */
export async function signIn(page: Page, email = DEMO_EMAIL) {
  await page.goto('/login');
  await page.evaluate(() => window.localStorage.clear());
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}
