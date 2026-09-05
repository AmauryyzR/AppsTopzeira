import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/amaur/.gemini/antigravity/brain/1d4f43f4-da24-4ae3-bc2b-3ded28ebf95a';

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:5000/models?model=dino-chibi...');
  await page.goto('http://localhost:5000/models?model=dino-chibi', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  // 1. Front Screenshot
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dino_front.png') });
  console.log('Front screenshot saved.');

  // 2. Toggle skeleton
  const checkbox = await page.$('input[type="checkbox"]');
  if (checkbox) {
    await checkbox.check();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dino_skeleton.png') });
    console.log('Skeleton screenshot saved.');
    await checkbox.uncheck();
    await page.waitForTimeout(300);
  }

  // 3. Animation: Wave
  const animSelect = await page.$('#rig-animation');
  if (animSelect) {
    await animSelect.selectOption('Wave');
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dino_wave.png') });
    console.log('Wave screenshot saved.');

    // 4. Animation: Walk
    await animSelect.selectOption('Walk');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dino_walk.png') });
    console.log('Walk screenshot saved.');

    await animSelect.selectOption('Rest');
    await page.waitForTimeout(300);
  }

  // 5. Clay Shading
  const clayBtn = await page.$('button[title*="Clay"]');
  if (clayBtn) {
    await clayBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dino_clay.png') });
    console.log('Clay screenshot saved.');
  }

  await browser.close();
  console.log('Finished capturing screenshots.');
}

run().catch(console.error);
