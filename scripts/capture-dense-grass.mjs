import { chromium } from 'playwright';
import path from 'path';

async function run() {
  console.log('Capturing screenshot of updated grass density in /3dgame...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });

  await page.goto('http://localhost:5000/3dgame', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Turn camera slightly to look into the lush grass meadow
  await page.mouse.move(640, 360);
  await page.mouse.down();
  await page.mouse.move(480, 340);
  await page.mouse.up();
  await page.waitForTimeout(1000);

  const outPath = path.resolve('artifacts/dense-grass-field.png');
  await page.screenshot({ path: outPath });
  console.log(`Saved screenshot to ${outPath}`);

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
