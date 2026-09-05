import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/amaur/.gemini/antigravity-ide/brain/f162deb8-475d-40ce-8d23-78849a448ddf';

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
  console.log('Navigating to http://localhost:5000/models...');
  await page.goto('http://localhost:5000/models', { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(2000);

  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  const setView = async (cam, tgt, delay = 500) => {
    await page.evaluate(({ c, t }) => {
      const engine = window.__studioEngine;
      if (engine && typeof engine.setCameraView === 'function') {
        engine.setCameraView(c, t);
      }
    }, { c: cam, t: tgt });
    await page.waitForTimeout(delay);
  };

  const setShading = async (mode, delay = 400) => {
    await page.evaluate((m) => {
      const engine = window.__studioEngine;
      if (engine && typeof engine.setShadingMode === 'function') {
        engine.setShadingMode(m);
      }
    }, mode);
    await page.waitForTimeout(delay);
  };

  // ----------------------------------------------------
  // SECTION 1: MASTER BRANCH AUDIT (module-branch)
  // ----------------------------------------------------
  console.log('Selecting module-branch...');
  await page.selectOption('#model-select', 'module-branch');
  await page.waitForTimeout(1000);

  // Frame model
  await page.evaluate(() => {
    const engine = window.__studioEngine;
    if (engine && typeof engine.frameModel === 'function') {
      engine.frameModel();
    }
  });
  await page.waitForTimeout(800);

  console.log('Capturing Branch - Front Elevation...');
  await setView({ x: 1.8, y: 1.6, z: 6.5 }, { x: 1.8, y: 1.3, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'branch_01_front.png') });

  console.log('Capturing Branch - Top (Check for poking sticks)...');
  await setView({ x: 1.8, y: 7.5, z: 0.01 }, { x: 1.8, y: 1.3, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'branch_02_top.png') });

  console.log('Capturing Branch - Bottom / Undercanopy (Check soffit & holes)...');
  await setView({ x: 1.5, y: -0.4, z: 2.2 }, { x: 1.8, y: 1.6, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'branch_03_bottom_soffit.png') });

  console.log('Capturing Branch - Isometric 3/4...');
  await setView({ x: 5.2, y: 3.5, z: 4.6 }, { x: 1.8, y: 1.3, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'branch_04_side.png') });

  console.log('Capturing Branch - Clay Mode...');
  await setShading('clay');
  await setView({ x: 5.2, y: 3.5, z: 4.6 }, { x: 1.8, y: 1.3, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'branch_05_clay.png') });

  console.log('Capturing Branch - Wireframe Mode...');
  await setShading('wireframe');
  await setView({ x: 5.2, y: 3.5, z: 4.6 }, { x: 1.8, y: 1.3, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'branch_06_wireframe.png') });

  // ----------------------------------------------------
  // SECTION 2: FULL TREE AUDIT (tree-lowpoly)
  // ----------------------------------------------------
  console.log('Selecting tree-lowpoly...');
  await setShading('material');
  await page.selectOption('#model-select', 'tree-lowpoly');
  await page.waitForTimeout(1000);

  await page.evaluate(() => {
    const engine = window.__studioEngine;
    if (engine && typeof engine.frameModel === 'function') {
      engine.frameModel();
    }
  });
  await page.waitForTimeout(800);

  console.log('Capturing Tree - Front...');
  await setView({ x: 0, y: 5.0, z: 10.5 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_01_front.png') });

  console.log('Capturing Tree - Aerial...');
  await setView({ x: 0.1, y: 13.5, z: 0.1 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_02_aerial.png') });

  console.log('Capturing Tree - Undercanopy...');
  await setView({ x: 1.2, y: 1.2, z: 1.6 }, { x: 0, y: 5.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_03_undercanopy.png') });

  console.log('Capturing Tree - Base...');
  await setView({ x: 2.4, y: 0.9, z: 2.4 }, { x: 0.1, y: 0.5, z: 0.1 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_04_base.png') });

  console.log('Capturing Tree - East Elevation...');
  await setView({ x: 10.5, y: 5.0, z: 0 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_05_east.png'), timeout: 60000 });

  console.log('Capturing Tree - Fork Junction Close-up...');
  await setView({ x: 2.2, y: 4.6, z: 2.8 }, { x: 0.1, y: 3.7, z: 0.0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_08_fork.png'), timeout: 60000 });

  console.log('Capturing Tree - Isometric Clay...');
  await setShading('clay');
  await setView({ x: 8.5, y: 5.5, z: 8.5 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_06_clay.png'), timeout: 60000 });

  console.log('Capturing Tree - Wireframe...');
  await setShading('wireframe');
  await setView({ x: 8.5, y: 5.5, z: 8.5 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_07_wireframe.png'), timeout: 60000 });

  await browser.close();
  console.log('Audit screenshots captured successfully in', ARTIFACT_DIR);
}

run().catch((err) => {
  console.error('Audit capture failed:', err);
  process.exit(1);
});
