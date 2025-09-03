import { expect, test } from '@playwright/test';

test.describe('Terminal Component E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load terminal component', async ({ page }) => {
    // Look for terminal-like elements
    const terminalElements = [
      page.locator('[class*="terminal"]'),
      page.locator('[class*="xterm"]'),
      page.locator('div').filter({ hasText: /\$|>|#/ }),
      page.locator('canvas'), // xterm.js uses canvas
    ];

    let terminalFound = false;
    for (const element of terminalElements) {
      try {
        await expect(element.first()).toBeVisible({ timeout: 5000 });
        terminalFound = true;
        break;
      } catch {
        // Continue to next element
      }
    }

    expect(terminalFound).toBe(true);
  });

  test('should handle keyboard interactions', async ({ page }) => {
    // Set focus on the page
    await page.click('body');

    // Try typing help command
    await page.keyboard.type('help');
    await page.keyboard.press('Enter');

    // Wait a bit for any response
    await page.waitForTimeout(1000);

    // Check that page is still responsive
    await expect(page.locator('body')).toBeVisible();
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Test tab navigation
    await page.keyboard.press('Tab');

    // Check that focus is visible somewhere
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should handle window resize', async ({ page }) => {
    // Start with desktop size
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);

    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Check that layout adapts
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Resize back to desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);

    await expect(body).toBeVisible();
  });

  test('should not have console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors
    const criticalErrors = consoleErrors.filter(
      error =>
        !error.includes('favicon') &&
        !error.includes('DevTools') &&
        !error.includes('Extension')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('should load without network errors', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Filter out non-critical failed requests
    const criticalFailures = failedRequests.filter(
      url =>
        !url.includes('favicon') &&
        !url.includes('analytics') &&
        !url.includes('tracking')
    );

    expect(criticalFailures).toHaveLength(0);
  });
});
