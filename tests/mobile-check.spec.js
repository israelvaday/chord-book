import { test, expect } from '@playwright/test';

test('mobile view check', async ({ page }) => {
  // Set mobile viewport (iPhone 12/13 size)
  await page.setViewportSize({ width: 390, height: 844 });
  
  await page.goto('http://localhost:5173');
  
  // Screenshot 1: Mobile home
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/mobile-1-home.png', fullPage: true });
  
  // Screenshot 2: Mobile search
  await page.fill('input[type="text"]', 'coldplay');
  await page.press('input[type="text"]', 'Enter');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/mobile-2-search.png', fullPage: true });
  
  // Screenshot 3: Mobile song content
  await page.click('h1');
  await page.waitForTimeout(300);
  const firstResult = page.locator('.result-item').first();
  if (await firstResult.isVisible()) {
    await firstResult.click({ force: true });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/mobile-3-content.png', fullPage: true });
  }
  
  // Screenshot 4: Mobile autocomplete
  await page.fill('input[type="text"]', '');
  await page.fill('input[type="text"]', 'taylor');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/mobile-4-autocomplete.png', fullPage: true });
  
  console.log('Mobile screenshots saved!');
});
