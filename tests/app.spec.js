import { test, expect } from '@playwright/test';

test.describe('Tab Viewer App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('homepage loads with title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Tab Viewer');
  });

  test('search works with Enter key', async ({ page }) => {
    await page.fill('input[type="text"]', 'wonderwall');
    await page.press('input[type="text"]', 'Enter');
    await page.waitForTimeout(3000);
    // Check results appear - using result-item class
    const results = page.locator('.result-item');
    await expect(results.first()).toBeVisible({ timeout: 10000 });
  });

  test('filter toggles exist and are visible', async ({ page }) => {
    // Look for filter buttons by class
    const allBtn = page.locator('.filter-btn').first();
    const tabsBtn = page.locator('.filter-btn:has-text("Tabs")');
    const chordsBtn = page.locator('.filter-btn:has-text("Chords")');
    
    await expect(allBtn).toBeVisible();
    await expect(tabsBtn).toBeVisible();
    await expect(chordsBtn).toBeVisible();
    
    // Verify "All" is active by default
    await expect(allBtn).toHaveClass(/active/);
  });

  test('random song button works', async ({ page }) => {
    const randomBtn = page.locator('button:has-text("Random")');
    if (await randomBtn.isVisible()) {
      await randomBtn.click();
      await page.waitForTimeout(2000);
      // Should show song content
      const content = page.locator('pre, .tab-content, .chord-content');
      await expect(content).toBeVisible({ timeout: 10000 });
    }
  });

  test('autocomplete shows suggestions on type', async ({ page }) => {
    // Type at least 2 chars to trigger autocomplete
    await page.fill('input[type="text"]', 'beatles');
    await page.waitForTimeout(2000);
    // Check for suggestions dropdown
    const suggestions = page.locator('.suggestions-dropdown');
    await expect(suggestions).toBeVisible({ timeout: 8000 });
  });
});
