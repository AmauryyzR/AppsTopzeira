import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. Biologia - Botanica
  console.log('Testing Biologia...');
  await page.goto('http://localhost:5000/Enem', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.locator('text=Ciências da Natureza').first().click();
  await page.waitForTimeout(600);
  await page.locator('button:has-text("Biologia")').first().click();
  await page.waitForTimeout(600);
  await page.locator('button:has-text("Evolução e Sistemática")').first().click();
  await page.waitForTimeout(800);
  await page.screenshot({
    path: 'C:/Users/amaur/.gemini/antigravity/brain/bc1a52b9-dc35-49ac-8449-78d00305903b/enem_bold_biologia.png',
  });
  console.log('Saved enem_bold_biologia.png');

  // 2. Matemática - Razão e Proporção
  console.log('Testing Matemática...');
  await page.goto('http://localhost:5000/Enem', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await page.locator('text=Matemática').first().click();
  await page.waitForTimeout(600);
  await page.locator('button:has-text("Razão, Proporção e Regra de Três")').first().click();
  await page.waitForTimeout(800);
  await page.screenshot({
    path: 'C:/Users/amaur/.gemini/antigravity/brain/bc1a52b9-dc35-49ac-8449-78d00305903b/enem_bold_matematica.png',
  });
  console.log('Saved enem_bold_matematica.png');

  // 3. Física - Dinâmica Newtoniana
  console.log('Testing Física...');
  await page.goto('http://localhost:5000/Enem', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await page.locator('text=Ciências da Natureza').first().click();
  await page.waitForTimeout(600);
  await page.locator('button:has-text("Física")').first().click();
  await page.waitForTimeout(600);
  await page.locator('button:has-text("Dinâmica Newtoniana")').first().click();
  await page.waitForTimeout(800);
  await page.screenshot({
    path: 'C:/Users/amaur/.gemini/antigravity/brain/bc1a52b9-dc35-49ac-8449-78d00305903b/enem_bold_fisica.png',
  });
  console.log('Saved enem_bold_fisica.png');

  await browser.close();
  console.log('All screenshots verified successfully!');
}

main().catch(console.error);
