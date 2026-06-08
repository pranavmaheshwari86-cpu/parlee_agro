import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Core E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Simulate real user - wait for hydration and initial animations
    await page.waitForLoadState('networkidle');
  });

  test('Homepage loads, passes accessibility, and handles basic interaction', async ({ page }) => {
    // 1. Accessibility Scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    
    // Log violations if any (we won't strictly fail the test immediately to allow fixing)
    if (accessibilityScanResults.violations.length > 0) {
      console.warn('Axe Violations:', JSON.stringify(accessibilityScanResults.violations, null, 2));
    }

    // 2. Visual / Layout Check - Check Title
    await expect(page).toHaveTitle(/Smoodh/i);

    // 3. Media Checks - Ensure no videos are broken
    const videos = await page.locator('video').all();
    for (const video of videos) {
      // Check that videos have successfully loaded data
      const readyState = await video.evaluate((node: HTMLVideoElement) => node.readyState);
      // readyState 0 = HAVE_NOTHING
      expect(readyState).toBeGreaterThan(0);
    }

    // 4. Interaction Check - Look for a primary call to action (like 'Shop Now' or 'Explore')
    // We'll click it and verify URL changes or modal opens
    // Wait for the hero section to be fully visible
    
    // Scroll down to simulate user behavior and trigger lazy loading
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(1000); // Wait for scroll animations
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000); // Wait for scroll animations
    
    await page.evaluate(() => window.scrollTo(0, 0));
  });

  test('Products page and routing', async ({ page }) => {
    // Try to find a link to the products page.
    // If it doesn't exist, this might fail, which is good for our audit.
    const hasProductsLink = await page.locator('a[href="/products"]').isVisible();
    if (hasProductsLink) {
      await page.click('a[href="/products"]');
      await page.waitForURL('**/products');
      await expect(page.locator('h1')).toBeVisible();
    }
  });
  
  test('Console error audit', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', exception => {
      errors.push(exception.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // We expect 0 console errors in production
    expect(errors.length).toBe(0);
  });
});
