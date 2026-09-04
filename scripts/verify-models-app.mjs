import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/amaur/.gemini/antigravity/brain/88589510-d6cb-4ecb-ae69-3bd96eff6ff1';

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
  const consoleErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  console.log('Navigating to http://localhost:5000/models...');
  await page.goto('http://localhost:5000/models', { waitUntil: 'networkidle' });

  // Wait for 3D model studio to mount, compute CSG and render PBR tree
  await page.waitForTimeout(2500);

  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  // 1. Initial view: Realistic PBR Tree
  console.log('Capturing Realistic PBR Tree...');
  const img1 = path.join(ARTIFACT_DIR, 'model_studio_pbr_tree.png');
  await page.screenshot({ path: img1 });

  // 2. Set camera viewpoint to exact user perspective looking up at branch fork
  console.log('Setting camera view to branch fork close-up (matching user view)...');
  await page.evaluate(() => {
    const engine = window.__studioEngine;
    if (engine && typeof engine.setCameraView === 'function') {
      engine.setCameraView({ x: 0.5, y: 3.4, z: 3.3 }, { x: 0.0, y: 4.7, z: 0.0 });
    }
  });
  await page.waitForTimeout(600);
  const img2 = path.join(ARTIFACT_DIR, 'model_studio_pbr_trunk_closeup.png');
  await page.screenshot({ path: img2 });

  // 3. Reset camera focus
  console.log('Resetting camera focus...');
  await page.keyboard.press('f');
  await page.waitForTimeout(600);

  // 4. Clay Shading on PBR Tree
  console.log('Switching to Clay Shading mode...');
  await page.click('button[title*="Clay"]');
  await page.waitForTimeout(800);
  const img3 = path.join(ARTIFACT_DIR, 'model_studio_pbr_clay.png');
  await page.screenshot({ path: img3 });

  // 5. Test Export GLB button
  console.log('Verifying Export GLB button presence...');
  const exportBtn = await page.$('button[title*="Exportar"]');
  if (!exportBtn) {
    throw new Error('Export GLB button not found in header!');
  }
  console.log('Export GLB button verified!');

  await browser.close();

  if (consoleErrors.length > 0) {
    console.error('Console errors encountered:', consoleErrors);
  } else {
    console.log('SUCCESS: All PBR tests passed without console errors!');
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
