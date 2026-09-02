import { chromium } from 'playwright';
import fs from 'fs';

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();

  console.log('Navigating to http://localhost:5000/3dgame...');
  await page.goto('http://localhost:5000/3dgame', { waitUntil: 'networkidle' });

  // Wait for 3D scene to mount
  await page.waitForTimeout(1500);

  fs.mkdirSync('artifacts', { recursive: true });

  // 1. Capture pure front view
  console.log('Capturing front hero view...');
  await page.screenshot({ path: 'artifacts/character-front-default.png' });

  // 2. Zoom in with wheel for close-up
  console.log('Zooming in for close-up...');
  await page.mouse.move(640, 360);
  await page.mouse.wheel(0, -600);
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'artifacts/character-front-close.png' });

  // 3. Rotate 40 degrees for 3/4 hero shot
  console.log('Rotating for 3/4 hero shot...');
  await page.mouse.down({ button: 'left' });
  await page.mouse.move(500, 360, { steps: 15 });
  await page.mouse.up({ button: 'left' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'artifacts/character-3quarter.png' });

  await browser.close();
  console.log('All character screenshots captured in artifacts/');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
