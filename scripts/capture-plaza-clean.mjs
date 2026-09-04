import { chromium } from 'playwright';
import path from 'path';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });

  await page.goto('http://localhost:5000/3dgame', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  // Rotate camera around by 180 degrees to look from behind character toward fountain
  await page.mouse.move(640, 360);
  await page.mouse.down();
  await page.mouse.move(640 + 320, 360 - 80); // orbit yaw + pitch up
  await page.mouse.up();
  await page.waitForTimeout(500);

  // Zoom out slightly
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(800);

  const outPath = path.resolve('artifacts/plaza-clean-no-benches.png');
  await page.screenshot({ path: outPath });
  console.log(`Saved overview screenshot to ${outPath}`);

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
