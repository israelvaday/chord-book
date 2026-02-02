import { test, expect } from '@playwright/test';

test('Hebrew chord alignment test', async ({ page }) => {
  // Load the Hebrew song
  await page.goto('http://localhost:3000/?song=10005781&type=chord');
  
  // Wait for content to load
  await page.waitForSelector('.text-emerald-400', { timeout: 10000 });
  
  // Take screenshot for visual comparison
  await page.screenshot({ path: '/tmp/chord-test.png', fullPage: true });
  
  // Get the first chord line and first lyric line
  const chordLines = await page.locator('.text-emerald-400').allTextContents();
  const lyricLines = await page.locator('.text-zinc-100').allTextContents();
  
  console.log('\n=== CHORD LINES ===');
  chordLines.slice(0, 10).forEach((line, i) => {
    console.log(`${i}: "${line}"`);
  });
  
  console.log('\n=== LYRIC LINES ===');
  lyricLines.slice(0, 10).forEach((line, i) => {
    console.log(`${i}: "${line}"`);
  });
  
  // Check that chord lines have content
  expect(chordLines.length).toBeGreaterThan(0);
  
  // Check specific chord line has correct spacing
  // Line: "G#m       D#m       C#m        G#m" should have spaces
  const secondChordLine = chordLines[1] || chordLines[0];
  console.log('\n=== CHECKING SPACING ===');
  console.log(`Second chord line: "${secondChordLine}"`);
  console.log(`Length: ${secondChordLine.length}`);
  
  // It should have multiple spaces between chords
  expect(secondChordLine).toContain('  '); // At least 2 spaces somewhere
});
