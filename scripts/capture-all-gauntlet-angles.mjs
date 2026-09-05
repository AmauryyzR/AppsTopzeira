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
  console.log('Navigating to http://localhost:5000/models...');
  await page.goto('http://localhost:5000/models', { waitUntil: 'networkidle', timeout: 20000 });
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

  // 1. Front Elevation (South) - Material
  console.log('1. Front Elevation (Material)...');
  await setView({ x: 0, y: 5.0, z: 10.5 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gauntlet_01_front_material.png') });

  // 2. Right Elevation (East) - Material
  console.log('2. Right Elevation (Material)...');
  await setView({ x: 10.5, y: 5.0, z: 0 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gauntlet_02_east_material.png') });

  // 3. Back Elevation (North) - Material
  console.log('3. Back Elevation (Material)...');
  await setView({ x: 0, y: 5.0, z: -10.5 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gauntlet_03_north_material.png') });

  // 4. Left Elevation (West) - Material
  console.log('4. Left Elevation (Material)...');
  await setView({ x: -10.5, y: 5.0, z: 0 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gauntlet_04_west_material.png') });

  // 5. Aerial Top-Down (Crown) - Material
  console.log('5. Aerial Crown (Material)...');
  await setView({ x: 0.1, y: 13.5, z: 0.1 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gauntlet_05_aerial_material.png') });

  // 6. Under-Canopy Upward (Soffit & Branch Scaffold) - Material
  console.log('6. Under-Canopy Upward (Material)...');
  await setView({ x: 1.2, y: 1.2, z: 1.6 }, { x: 0, y: 5.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gauntlet_06_undercanopy_material.png') });

  // 7. Roots & Buttress Base Zoom - Material
  console.log('7. Roots & Base (Material)...');
  await setView({ x: 2.4, y: 0.9, z: 2.4 }, { x: 0.1, y: 0.5, z: 0.1 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gauntlet_07_roots_material.png') });

  // 8. Branch Sockets & Crotches Zoom - Material
  console.log('8. Branch Sockets (Material)...');
  await setView({ x: 1.6, y: 4.2, z: 1.8 }, { x: 0.05, y: 3.8, z: 0.05 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gauntlet_08_sockets_material.png') });

  // 9. Isometric - Clay Mode
  console.log('9. Isometric (Clay)...');
  await setShading('clay');
  await setView({ x: 8.5, y: 5.5, z: 8.5 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gauntlet_09_clay_isometric.png') });

  // 10. Under-Canopy - Clay Mode
  console.log('10. Under-Canopy (Clay)...');
  await setView({ x: 1.2, y: 1.2, z: 1.6 }, { x: 0, y: 5.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gauntlet_10_clay_undercanopy.png') });

  // 11. Roots Close-up - Clay Mode
  console.log('11. Roots (Clay)...');
  await setView({ x: 2.4, y: 0.9, z: 2.4 }, { x: 0.1, y: 0.5, z: 0.1 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gauntlet_11_clay_roots.png') });

  // 12. Topology - Wireframe Mode
  console.log('12. Topology (Wireframe)...');
  await setShading('wireframe');
  await setView({ x: 8.5, y: 5.5, z: 8.5 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'gauntlet_12_wireframe.png') });

  await browser.close();
  console.log('All 12 Gauntlet audit angles captured successfully!');
}

run().catch((err) => {
  console.error('Audit capture failed:', err);
  process.exit(1);
});
