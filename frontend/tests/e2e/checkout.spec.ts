import { test, expect } from '@playwright/test';

test.describe('E2E Checkout Flow', () => {
  test('should load the homepage and open the cart drawer', async ({ page }) => {
    await page.goto('/');

    // Ensure Navbar loads
    await expect(page.locator('text=Smoodh').first()).toBeVisible();

    // The cart button usually has an SVG or a role. 
    // Wait for the cart icon to be visible and click it
    const cartButton = page.locator('button').filter({ has: page.locator('svg') }).last();
    await expect(cartButton).toBeVisible();
    await cartButton.click();

    // Verify Cart Drawer opens
    await expect(page.locator('text=Your Cart').first()).toBeVisible();
  });

  test('should navigate to products via nav links', async ({ page }) => {
    await page.goto('/');
    
    // Click on Fizz link
    await page.click('text=Fizz');
    
    // Check if the URL changed or scrolled
    // Usually it scrolls to the section. We'll verify a product name is visible.
    await expect(page.locator('text=Appy Fizz').first()).toBeVisible();
  });
});
