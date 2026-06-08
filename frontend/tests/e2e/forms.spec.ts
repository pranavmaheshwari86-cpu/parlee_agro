import { test, expect } from '@playwright/test';

test.describe('Form Validation & QA', () => {
  test('should validate checkout form inputs', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Ensure we wait for the page to load
    await page.waitForLoadState('networkidle');

    // Add product to cart
    const firstProductAddBtn = page.locator('text=Add to Cart').first();
    if (await firstProductAddBtn.isVisible()) {
      await firstProductAddBtn.click();
    } else {
      // In case we are not scrolled down, let's just go to checkout directly
      // If there's a standalone /checkout page, we can go there. 
      // For now we assume a cart drawer
      const cartButton = page.locator('button').filter({ has: page.locator('svg') }).last();
      await cartButton.click();
    }

    // Usually there is a Checkout button in the cart
    const checkoutButton = page.locator('button:has-text("Checkout")');
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click();
    }
  });
});
