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
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();
  console.log('Navigating to http://localhost:5000/models?model=shark-animestyle...');
  await page.goto('http://localhost:5000/models?model=shark-animestyle', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  // 1. Reset frame with F
  await page.keyboard.press('f');
  await page.waitForTimeout(600);

  // 1. Front 3/4 Perspective View (Full Body, Matching Reference media_1788651755125.jpg)
  await page.evaluate(() => {
    const engine = window.__studioEngine;
    if (engine) {
      engine.setCameraView({ x: 1.15, y: 1.05, z: 2.35 }, { x: 0.0, y: 0.90, z: 0.05 });
    }
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shark_perspective.png') });
  console.log('Front 3/4 perspective screenshot saved.');

  // 2. Side Profile View (Full Body, Matching Reference media_1788651755029.jpg)
  await page.evaluate(() => {
    const engine = window.__studioEngine;
    if (engine) {
      engine.setCameraView({ x: 2.50, y: 0.95, z: 0.05 }, { x: 0.0, y: 0.90, z: 0.05 });
    }
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shark_profile.png') });
  console.log('Side profile screenshot saved.');

  // 3. Rear View (Full Body, Matching Reference media_1788651755188.png)
  await page.evaluate(() => {
    const engine = window.__studioEngine;
    if (engine) {
      engine.setCameraView({ x: 0.0, y: 1.05, z: -2.55 }, { x: 0.0, y: 0.90, z: 0.0 });
    }
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shark_rear.png') });
  console.log('Rear view screenshot saved.');

  // 4. Head & Hood Close-up (18 hair strands, blindfold, teeth, shark eyes, gill slits)
  await page.evaluate(() => {
    const engine = window.__studioEngine;
    if (engine) {
      engine.setCameraView({ x: 0.38, y: 1.36, z: 0.88 }, { x: 0.0, y: 1.34, z: 0.16 });
    }
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shark_head_closeup.png') });
  console.log('Head & hood close-up screenshot saved.');

  // 5. Chunky Platform Sneaker Close-up (Sole layers, laces, heel mini-fin)
  await page.evaluate(() => {
    const engine = window.__studioEngine;
    if (engine) {
      engine.setCameraView({ x: 0.42, y: 0.28, z: 0.55 }, { x: 0.10, y: 0.10, z: 0.02 });
    }
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shark_shoes_closeup.png') });
  console.log('Sneakers close-up screenshot saved.');

  // Reset camera view with [F]
  await page.keyboard.press('f');
  await page.waitForTimeout(400);

  // 6. Skeleton Helper Toggle (Armature 30 bones)
  const checkbox = await page.$('input[type="checkbox"]');
  if (checkbox) {
    await checkbox.check();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shark_skeleton.png') });
    console.log('Skeleton screenshot saved.');
    await checkbox.uncheck();
    await page.waitForTimeout(300);
  }

  // 7. Animations: AnimePose & Walk
  const animSelect = await page.$('#rig-animation');
  if (animSelect) {
    await animSelect.selectOption('AnimePose');
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shark_anime_pose.png') });
    console.log('AnimePose screenshot saved.');

    await animSelect.selectOption('Walk');
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shark_walk.png') });
    console.log('Walk screenshot saved.');

    await animSelect.selectOption('Rest');
    await page.waitForTimeout(300);
  }

  // 8. Clay Shading Mode
  const clayBtn = await page.$('button[title*="Clay"]');
  if (clayBtn) {
    await clayBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'shark_clay.png') });
    console.log('Clay screenshot saved.');
  }

  await browser.close();
  console.log('Finished capturing all SharkAnimestyle screenshots.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
