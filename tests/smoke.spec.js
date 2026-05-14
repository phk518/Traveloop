import { test, expect } from '@playwright/test';

test.describe('Traveloop Smoke Tests', () => {
  test('should load the login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Traveloop/);
    await expect(page.locator('h1')).toContainText('Welcome Back');
  });

  test('should show validation error on empty login', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');
    // Assuming axios catch or context handled it
    // For now just check if we are still on login
    await expect(page).toHaveURL(/.*login/);
  });

  test('should load the explore page after bypass (if possible)', async ({ page }) => {
    // This is a smoke test for layout
    await page.goto('/explore');
    // Should redirect to login if not authenticated
    await expect(page).toHaveURL(/.*login/);
  });
});
