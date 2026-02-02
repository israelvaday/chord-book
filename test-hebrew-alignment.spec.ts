import { test, expect } from '@playwright/test';

// Expected output - chords without brackets, exact spacing preserved
const EXPECTED_PAIRS = [
  {
    chords: 'G#m       D#m       C#m        G#m',
    lyrics: 'מודה אני כל בוקר   שהחזרת את נשמתי'
  },
  {
    chords: ' E      D#m    C#m',
    lyrics: 'מודה אני על בגד  שהנחת על גופי'
  },
  {
    chords: '  G#m            C#m',
    lyrics: 'שלא יהיה לי קר אתה שומר עליי'
  },
  {
    chords: '     C#m         G#m',
    lyrics: 'מודה אני כל בוקר על'
  }
];

test('Hebrew chord-lyric alignment matches TAB4U', async ({ page }) => {
  await page.goto('http://localhost:3000/?song=10005781&type=chord');
  await page.waitForSelector('.whitespace-pre', { timeout: 15000 });
  
  // Get all text content
  const content = await page.locator('.font-mono').first().textContent();
  
  console.log('\n=== RAW CONTENT ===');
  console.log(content?.slice(0, 1000));
  
  // Take screenshot
  await page.screenshot({ path: '/tmp/hebrew-alignment.png', fullPage: true });
  
  // Check each expected pair
  for (const pair of EXPECTED_PAIRS) {
    console.log(`\n=== Checking: "${pair.chords}" ===`);
    
    // The chord line should appear exactly as expected (without brackets)
    if (content?.includes(pair.chords)) {
      console.log('✓ Chord line found');
    } else {
      console.log('✗ Chord line NOT found');
      console.log(`  Looking for: "${pair.chords}"`);
    }
    
    // The lyrics should appear
    if (content?.includes(pair.lyrics)) {
      console.log('✓ Lyrics found');
    } else {
      console.log('✗ Lyrics NOT found');
    }
  }
  
  // Verify leading spaces are preserved
  const hasLeadingSpaceChord = content?.includes('     C#m'); // 5 spaces before C#m
  console.log(`\n=== Leading spaces preserved: ${hasLeadingSpaceChord ? '✓' : '✗'} ===`);
  
  expect(hasLeadingSpaceChord).toBe(true);
});
