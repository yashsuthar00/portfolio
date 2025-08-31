import { test, expect } from '@playwright/test';

test.describe('Portfolio Website - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that the page has loaded correctly
    await expect(page).toHaveTitle(/portfolio/i);
  });

  test('should display navigation elements', async ({ page }) => {
    // Check navbar is present
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();

    // Check footer is present
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should display portfolio content on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Check for 3D card component
    const canvas = page
      .locator('[data-testid="canvas"]')
      .or(page.locator('canvas'));
    await expect(canvas).toBeVisible();

    // Check for terminal component
    const terminal = page
      .locator('[class*="terminal"]')
      .or(page.locator('div').filter({ hasText: /terminal/i }));
    await expect(terminal).toBeVisible();
  });

  test('should display terminal-only on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    // Terminal should be visible
    const terminal = page
      .locator('[class*="terminal"]')
      .or(page.locator('div').filter({ hasText: /terminal/i }));
    await expect(terminal).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'mobile-small' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'desktop-small' },
      { width: 1920, height: 1080, name: 'desktop-large' },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.waitForLoadState('networkidle');

      // Page should not have horizontal scroll
      const body = page.locator('body');
      const boundingBox = await body.boundingBox();
      expect(boundingBox?.width).toBeLessThanOrEqual(viewport.width + 1); // +1 for potential rounding

      // Navigation should be visible
      const navbar = page.locator('nav');
      await expect(navbar).toBeVisible();
    }
  });
});
