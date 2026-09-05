import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/amaur/.gemini/antigravity-ide/brain/7699239c-6636-4021-b925-22f0d3eade53';

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

  console.log('Navigating to http://localhost:5000/models...');
  await page.goto('http://localhost:5000/models', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  // 1. Capture complete tree in material mode
  console.log('Capturing complete Genshin tree (Material)...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'genshin_tree_lowpoly_material.png') });

  // 2. Switch to Clay mode
  console.log('Capturing complete Genshin tree (Clay)...');
  await page.click('button[title*="Clay"]');
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'genshin_tree_lowpoly_clay.png') });

  // Return to Material mode
  await page.click('button[title*="Material"]');
  await page.waitForTimeout(600);

  // 3. Trunk close-up
  console.log('Capturing trunk and root buttresses close-up...');
  await page.evaluate(() => {
    const engine = window.__studioEngine;
    if (engine && typeof engine.setCameraView === 'function') {
      engine.setCameraView({ x: 1.8, y: 1.6, z: 3.4 }, { x: 0.1, y: 1.8, z: 0.0 });
    }
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'genshin_tree_roots_closeup.png') });

  // Reset focus
  await page.keyboard.press('f');
  await page.waitForTimeout(600);

  // 4. Select module-trunk
  console.log('Selecting module-trunk...');
  await page.selectOption('select', 'module-trunk');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'genshin_module_trunk.png') });

  // 5. Select module-branch
  console.log('Selecting module-branch...');
  await page.selectOption('select', 'module-branch');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'genshin_module_branch.png') });

  // 6. Select module-sprig
  console.log('Selecting module-sprig...');
  await page.selectOption('select', 'module-sprig');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'genshin_module_sprig.png') });

  // 7. Select module-leaf
  console.log('Selecting module-leaf...');
  await page.selectOption('select', 'module-leaf');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'genshin_module_leaf.png') });

  // 8. Navigate to /3dgame and capture in-game view
  console.log('Navigating to http://localhost:5000/3dgame...');
  await page.goto('http://localhost:5000/3dgame', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'game3d_with_ancient_trees.png') });

  await browser.close();

  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors);
  } else {
    console.log('Captured all models and in-game scenes successfully!');
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
