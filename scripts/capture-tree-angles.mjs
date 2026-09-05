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
  await page.goto('http://localhost:5000/models', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  const setView = async (camPos, targetPos, delay = 600) => {
    await page.evaluate(({ cam, tgt }) => {
      const engine = window.__studioEngine;
      if (engine && typeof engine.setCameraView === 'function') {
        engine.setCameraView(cam, tgt);
      }
    }, { cam: camPos, tgt: targetPos });
    await page.waitForTimeout(delay);
  };

  // 1. Front View (South)
  console.log('Capturing Angle 1: Front (South)...');
  await setView({ x: 0, y: 5.0, z: 10.0 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_angle_1_front_south.png') });

  // 2. Right Side View (East)
  console.log('Capturing Angle 2: Right (East)...');
  await setView({ x: 10.0, y: 5.0, z: 0 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_angle_2_right_east.png') });

  // 3. Back View (North)
  console.log('Capturing Angle 3: Back (North)...');
  await setView({ x: 0, y: 5.0, z: -10.0 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_angle_3_back_north.png') });

  // 4. Left Side View (West)
  console.log('Capturing Angle 4: Left (West)...');
  await setView({ x: -10.0, y: 5.0, z: 0 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_angle_4_left_west.png') });

  // 5. Aerial Top-Down View (Zenith)
  console.log('Capturing Angle 5: Aerial Top-Down (Zenith)...');
  await setView({ x: 0.2, y: 12.5, z: 0.2 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_angle_5_aerial_topdown.png') });

  // 6. Worm-Eye View Looking Up Into Canopy (Underneath)
  console.log('Capturing Angle 6: Under Canopy Looking Up...');
  await setView({ x: 1.2, y: 1.1, z: 1.6 }, { x: 0, y: 5.8, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_angle_6_under_canopy_upward.png') });

  // 7. Zoomed In: Roots & Buttresses at Soil Level
  console.log('Capturing Angle 7: Zoomed Roots & Buttress Base...');
  await setView({ x: 2.2, y: 0.9, z: 2.4 }, { x: 0.1, y: 0.5, z: 0.1 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_angle_7_zoom_roots_soil.png') });

  // 8. Zoomed In: Trunk Crown & Branch Fork Sockets
  console.log('Capturing Angle 8: Zoomed Trunk Crown & Branch Sockets...');
  await setView({ x: 1.5, y: 4.1, z: 1.7 }, { x: 0.05, y: 3.75, z: 0.05 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_angle_8_zoom_branch_forks.png') });

  // 9. Zoomed In: Macro Foliage & Leaves (Creases, SSS & Rim Light)
  console.log('Capturing Angle 9: Macro Foliage & Leaf Creases...');
  await setView({ x: 2.1, y: 5.9, z: 1.8 }, { x: 1.3, y: 5.4, z: 1.1 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_angle_9_macro_foliage_leaves.png') });

  // 10. Zoomed In: Another canopy cluster angle
  console.log('Capturing Angle 10: Canopy Side Cluster Zoom...');
  await setView({ x: -2.2, y: 5.2, z: 2.0 }, { x: -1.2, y: 4.9, z: 1.0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'tree_angle_10_zoom_canopy_side.png') });

  await browser.close();
  console.log('Successfully captured all 10 angles and zoom levels!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
