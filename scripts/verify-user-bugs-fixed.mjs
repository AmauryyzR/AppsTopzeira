import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\amaur\\.gemini\\antigravity\\brain\\14dbf5fc-d7fc-4aea-a6cf-8a95915dcd16';
const LOCAL_ARTIFACTS = path.resolve('artifacts');

async function main() {
  console.log('[Verify] Launching headless browser...');
  const browser = await chromium.launch({ headless: true });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });

  console.log('[Verify] Navigating to http://localhost:5000/3dgame...');
  await page.goto('http://localhost:5000/3dgame', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);

  fs.mkdirSync(LOCAL_ARTIFACTS, { recursive: true });
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  const canvas = page.locator('canvas');

  const capture = async (name) => {
    const loc = path.join(LOCAL_ARTIFACTS, name);
    const art = path.join(ARTIFACT_DIR, name);
    await canvas.screenshot({ path: loc });
    fs.copyFileSync(loc, art);
    console.log(`[Verify] ✅ Captured ${name}`);
  };

  // 1. Gazebo Railings (Direct frontal view matching user photo)
  console.log('[Verify] Capturing Gazebo...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(30.8, 0.16, 0);
      engine.physics.facingAngle = Math.PI / 2; // Facing East toward gazebo
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(28.2, 2.2, 0.0);
        engine.cameraRig.camera.lookAt(36.0, 1.8, 0.0);
      };
    }
  });
  await page.waitForTimeout(1000);
  await capture('fixed-bug-1-gazebo.png');

  // 2. Zen Garden Bed & Platforms (elevated 3/4 view matching user photo)
  console.log('[Verify] Capturing Zen Garden...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(22, 0.2, 14);
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(13.0, 8.5, 9.0);
        engine.cameraRig.camera.lookAt(22.0, 1.0, 20.0);
      };
    }
  });
  await page.waitForTimeout(1000);
  await capture('fixed-bug-2-zen-garden.png');

  // 3. Torii Gate (frontal avenue view matching user photo)
  console.log('[Verify] Capturing Torii Gate...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(0, 0.08, 48.0);
      engine.physics.facingAngle = Math.PI; // Facing North
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(0, 2.3, 50.0);
        engine.cameraRig.camera.lookAt(0, 3.8, 42.0);
      };
    }
  });
  await page.waitForTimeout(1000);
  await capture('fixed-bug-3-torii-gate.png');

  await browser.close();
  console.log('[Verify] All screenshots captured successfully!');
}

main().catch((err) => {
  console.error('[Verify] Error:', err);
  process.exit(1);
});
