import { chromium } from 'playwright';
import path from 'path';

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
  await page.goto('http://localhost:5000/models', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const setView = async (camPos, targetPos) => {
    await page.evaluate(({ cam, tgt }) => {
      const engine = window.__studioEngine;
      if (engine && typeof engine.setCameraView === 'function') {
        engine.setCameraView(cam, tgt);
      }
    }, { cam: camPos, tgt: targetPos });
    await page.waitForTimeout(600);
  };

  // 7. Zoomed In: Roots & Buttresses at Soil Level
  console.log('Capturing Angle 7: Zoomed Roots & Buttress Base...');
  await setView({ x: 3.2, y: 1.2, z: 3.0 }, { x: 0.2, y: 0.6, z: 0.1 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_angle_7_zoom_roots_soil.png'), timeout: 10000 });

  // 8. Zoomed In: Trunk Crown & Branch Fork Sockets
  console.log('Capturing Angle 8: Zoomed Trunk Crown & Branch Sockets...');
  await setView({ x: 2.2, y: 4.4, z: 2.2 }, { x: 0.1, y: 3.8, z: 0.1 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_angle_8_zoom_branch_forks.png'), timeout: 10000 });

  // 9. Zoomed In: Macro Foliage & Leaves (Creases, SSS & Rim Light)
  console.log('Capturing Angle 9: Macro Foliage & Leaf Creases...');
  await setView({ x: 1.8, y: 5.6, z: 2.2 }, { x: 0.8, y: 5.2, z: 1.0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_angle_9_macro_foliage_leaves.png'), timeout: 10000 });

  // 10. Zoomed In: Canopy Side Cluster Zoom
  console.log('Capturing Angle 10: Canopy Side Cluster Zoom...');
  await setView({ x: -2.8, y: 5.6, z: 2.4 }, { x: -0.8, y: 5.2, z: 0.6 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_angle_10_zoom_canopy_side.png'), timeout: 10000 });

  await browser.close();
  console.log('Successfully captured zooms 7, 8, 9, 10!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
