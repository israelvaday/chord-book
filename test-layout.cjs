const { chromium } = require('@playwright/test');

async function testMobile() {
  const browser = await chromium.launch({ headless: true });
  
  console.log('\n=== TESTING MOBILE LAYOUT ===\n');
  
  // Mobile viewport
  const page = await browser.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('https://israelvaday.github.io/free-chord-book/', { waitUntil: 'networkidle' });
  
  // Screenshot home
  await page.screenshot({ path: 'mobile-1-home.png' });
  console.log('1. Home screenshot saved');
  
  // Test dropdown
  await page.fill('.search-input', 'nirvana');
  await page.waitForTimeout(2000);
  
  const dropdown = await page.locator('.suggestions-dropdown');
  const isVisible = await dropdown.isVisible().catch(() => false);
  console.log('2. Dropdown visible:', isVisible);
  
  if (isVisible) {
    const box = await dropdown.boundingBox();
    console.log('   Dropdown size:', box);
    
    const itemCount = await page.locator('.suggestion-item').count();
    console.log('   Suggestion items:', itemCount);
    
    // Check if dropdown overflows
    if (box && box.height > 400) {
      console.log('   WARNING: Dropdown too tall!');
    }
  }
  
  await page.screenshot({ path: 'mobile-2-dropdown.png' });
  console.log('3. Dropdown screenshot saved');
  
  // Close dropdown by clicking elsewhere, then click Top 100
  await page.click('.logo');
  await page.waitForTimeout(500);
  
  await page.click('text=Top 100');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'mobile-3-top100.png' });
  console.log('4. Top 100 screenshot saved');
  
  // Check sidebar height on mobile
  const sidebar = await page.locator('.sidebar');
  const sidebarBox = await sidebar.boundingBox();
  console.log('5. Sidebar size:', sidebarBox);
  
  // Check content area
  const content = await page.locator('.content-area');
  const contentBox = await content.boundingBox();
  console.log('6. Content area size:', contentBox);
  
  // Click a song
  await page.locator('.result-item').first().click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'mobile-4-song.png' });
  console.log('7. Song view screenshot saved');
  
  // Check if content scrolls properly
  const songContent = await page.locator('.song-content');
  const songBox = await songContent.boundingBox().catch(() => null);
  console.log('8. Song content size:', songBox);
  
  await page.close();
  
  // Desktop test
  console.log('\n=== TESTING DESKTOP LAYOUT ===\n');
  
  const desktopPage = await browser.newPage();
  await desktopPage.setViewportSize({ width: 1400, height: 900 });
  await desktopPage.goto('https://israelvaday.github.io/free-chord-book/', { waitUntil: 'networkidle' });
  
  await desktopPage.screenshot({ path: 'desktop-1-home.png' });
  console.log('1. Desktop home saved');
  
  await desktopPage.click('text=Top 100');
  await desktopPage.waitForTimeout(1500);
  await desktopPage.screenshot({ path: 'desktop-2-top100.png' });
  console.log('2. Desktop top100 saved');
  
  await desktopPage.locator('.result-item').first().click();
  await desktopPage.waitForTimeout(1500);
  await desktopPage.screenshot({ path: 'desktop-3-song.png' });
  console.log('3. Desktop song saved');
  
  await browser.close();
  console.log('\n=== DONE ===\n');
}

testMobile().catch(console.error);
