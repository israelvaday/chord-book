import { test, expect } from '@playwright/test';

test('visual check - songs display', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Screenshot 1: Home page
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'screenshots/1-home.png', fullPage: true });
  
  // Screenshot 2: Search for "wonderwall" 
  await page.fill('input[type="text"]', 'wonderwall');
  await page.press('input[type="text"]', 'Enter');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/2-search-results.png', fullPage: true });
  
  // Screenshot 3: Click on a song to see content
  // Close dropdown first by clicking elsewhere
  await page.click('h1');
  await page.waitForTimeout(300);
  const firstResult = page.locator('.result-item').first();
  if (await firstResult.isVisible()) {
    await firstResult.click({ force: true });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/3-song-content.png', fullPage: true });
  }
  
  // Screenshot 4: Test autocomplete
  await page.fill('input[type="text"]', '');
  await page.fill('input[type="text"]', 'beatles');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/4-autocomplete.png', fullPage: true });
  
  // Screenshot 5: Random song
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(500);
  const randomBtn = page.locator('button:has-text("Random")');
  if (await randomBtn.isVisible()) {
    await randomBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshots/5-random-song.png', fullPage: true });
  }
  
  console.log('Screenshots saved to ./screenshots/');
});
