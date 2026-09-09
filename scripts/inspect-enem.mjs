import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:5000/Enem ...');
  await page.goto('http://localhost:5000/Enem', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Click Ciências da Natureza
  await page.locator('text=Ciências da Natureza').first().click();
  await page.waitForTimeout(600);

  // 2. Click Biologia tab
  const bioTab = page.locator('button:has-text("Biologia")').first();
  if (await bioTab.isVisible()) {
    await bioTab.click();
    await page.waitForTimeout(600);
  }

  // 3. Click "Evolução e Sistemática: Briófitas..."
  const botanicaSub = page.locator('button:has-text("Evolução e Sistemática")').first();
  await botanicaSub.click();
  await page.waitForTimeout(800);

  // 4. Take screenshot of the exact page the user gave as reference!
  await page.screenshot({
    path: 'C:/Users/amaur/.gemini/antigravity/brain/bc1a52b9-dc35-49ac-8449-78d00305903b/enem_botanica_bold_test.png',
  });
  console.log('Saved enem_botanica_bold_test.png');

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
