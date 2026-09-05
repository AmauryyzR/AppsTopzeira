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

  const setView = async (cam, tgt, delay = 600) => {
    await page.evaluate(({ c, t }) => {
      const engine = window.__studioEngine;
      if (engine && typeof engine.setCameraView === 'function') {
        engine.setCameraView(c, t);
      }
    }, { c: cam, t: tgt });
    await page.waitForTimeout(delay);
  };

  const setShading = async (mode, delay = 500) => {
    await page.evaluate((m) => {
      const engine = window.__studioEngine;
      if (engine && typeof engine.setShadingMode === 'function') {
        engine.setShadingMode(m);
      }
    }, mode);
    await page.waitForTimeout(delay);
  };

  console.log('Selecting tree-lowpoly...');
  await page.selectOption('#model-select', 'tree-lowpoly');
  await page.waitForTimeout(1000);

  // Exact angle matching user's screenshot media_1788620112209.png
  console.log('Capturing Fork Close-up - Material Mode...');
  await setShading('material');
  await setView({ x: 2.2, y: 4.8, z: 2.6 }, { x: 0.1, y: 3.6, z: 0.0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_08_fork_material.png'), timeout: 60000 });

  console.log('Capturing Fork Close-up - Clay Mode...');
  await setShading('clay');
  await setView({ x: 2.2, y: 4.8, z: 2.6 }, { x: 0.1, y: 3.6, z: 0.0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_09_fork_clay.png'), timeout: 60000 });

  console.log('Capturing Fork Close-up - Wireframe Mode...');
  await setShading('wireframe');
  await setView({ x: 2.2, y: 4.8, z: 2.6 }, { x: 0.1, y: 3.6, z: 0.0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_10_fork_wireframe.png'), timeout: 60000 });

  await browser.close();
  console.log('Fork audit screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Fork capture failed:', err);
  process.exit(1);
});
