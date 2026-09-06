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
  console.log('Navigating to http://localhost:5000/models?model=GemniDINO...');
  await page.goto('http://localhost:5000/models?model=GemniDINO', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  // 1. High-precision Head & Face close-up
  await page.evaluate(() => {
    const engine = window.__studioEngine;
    if (engine) {
      engine.setCameraView({ x: 0.0, y: 0.96, z: 0.65 }, { x: 0.0, y: 0.95, z: 0.12 });
    }
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gemnidino_face_closeup.png') });
  console.log('Face close-up screenshot saved.');

  // Reset camera view with [F]
  await page.keyboard.press('f');
  await page.waitForTimeout(400);

  // 2. Full-body front screenshot
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gemnidino_front.png') });
  console.log('Front screenshot saved.');

  // 3. Perspective View
  await page.evaluate(() => {
    const engine = window.__studioEngine;
    if (engine) {
      engine.setCameraView({ x: 0.45, y: 0.35, z: 0.65 }, { x: 0, y: 0.25, z: 0 });
    }
  });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gemnidino_perspective.png') });
  console.log('Perspective screenshot saved.');

  // Reset camera view with [F]
  await page.keyboard.press('f');
  await page.waitForTimeout(400);

  // 4. Toggle skeleton helper
  const checkbox = await page.$('input[type="checkbox"]');
  if (checkbox) {
    await checkbox.check();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gemnidino_skeleton.png') });
    console.log('Skeleton screenshot saved.');
    await checkbox.uncheck();
    await page.waitForTimeout(300);
  }

  // 5. Animation: Wave
  const animSelect = await page.$('#rig-animation');
  if (animSelect) {
    await animSelect.selectOption('Wave');
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gemnidino_wave.png') });
    console.log('Wave screenshot saved.');

    // 6. Animation: Walk
    await animSelect.selectOption('Walk');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gemnidino_walk.png') });
    console.log('Walk screenshot saved.');

    await animSelect.selectOption('Rest');
    await page.waitForTimeout(300);
  }

  // 7. Clay Shading
  const clayBtn = await page.$('button[title*="Clay"]');
  if (clayBtn) {
    await clayBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gemnidino_clay.png') });
    console.log('Clay screenshot saved.');
  }

  await browser.close();
  console.log('Finished capturing all GemniDINO screenshots.');
}

run().catch(console.error);
