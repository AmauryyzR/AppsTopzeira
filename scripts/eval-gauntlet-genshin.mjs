import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\amaur\\.gemini\\antigravity\\brain\\14dbf5fc-d7fc-4aea-a6cf-8a95915dcd16';
const LOCAL_ARTIFACTS = path.resolve('artifacts');

async function main() {
  console.log('[Gauntlet Eval] Launching headless browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });

  console.log('[Gauntlet Eval] Loading 3D Game at http://localhost:5000/3dgame...');
  await page.goto('http://localhost:5000/3dgame', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3500);

  fs.mkdirSync(LOCAL_ARTIFACTS, { recursive: true });
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  const canvas = page.locator('canvas');

  const capture = async (name) => {
    const loc = path.join(LOCAL_ARTIFACTS, name);
    const art = path.join(ARTIFACT_DIR, name);
    await page.screenshot({ path: loc });
    fs.copyFileSync(loc, art);
    console.log(`[Gauntlet Eval] ✅ Captured ${name}`);
  };

  // 1. Trees Rim Glow (Close-up of Oak and Sakura canopy showing the fine white glow border)
  console.log('[Shot 1] Trees Rim Glow...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(14.0, 0.05, 12.0);
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(11.0, 3.2, 10.0);
        engine.cameraRig.camera.lookAt(16.0, 4.5, 16.0);
      };
    }
  });
  await page.waitForTimeout(600);
  await capture('gauntlet-genshin-1-trees-rim.png');

  // 2. Canopy Foliage Volume & Lighting (Looking through Sakura and Oak trees toward sunlight)
  console.log('[Shot 2] Canopy Volume & Lighting...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(16.0, 0.05, 10.0);
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(16.0, 3.0, 6.0);
        engine.cameraRig.camera.lookAt(16.0, 5.2, 16.0);
      };
    }
  });
  await page.waitForTimeout(600);
  await capture('gauntlet-genshin-2-canopy-lighting.png');

  // 3. Central Fountain & Stylized Water (Caustics, ripples, foam, and cascade)
  console.log('[Shot 3] Central Fountain Water...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(0, 0.05, 8.0);
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(4.5, 3.2, 7.5);
        engine.cameraRig.camera.lookAt(0, 1.2, 0);
      };
    }
  });
  await page.waitForTimeout(600);
  await capture('gauntlet-genshin-3-fountain-water.png');

  // 4. Dense Living Grass Meadow (Tip glow, wind waves, and dense blades)
  console.log('[Shot 4] Dense Grass Meadow...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(10.0, 0.05, -12.0);
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(10.0, 1.2, -15.0);
        engine.cameraRig.camera.lookAt(18.0, 0.6, -8.0);
      };
    }
  });
  await page.waitForTimeout(600);
  await capture('gauntlet-genshin-4-grass-meadow.png');

  // 5. Pagoda Gazebo & Chōchin Lanterns (Lacquered wood, warm amber glow, clean railings)
  console.log('[Shot 5] Pagoda Gazebo Lanterns...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(30.8, 0.16, 0);
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(27.5, 2.2, 0.0);
        engine.cameraRig.camera.lookAt(36.0, 2.2, 0.0);
      };
    }
  });
  await page.waitForTimeout(600);
  await capture('gauntlet-genshin-5-pagoda-lanterns.png');

  // 6. Zen Rock Garden (White quartz sand, clean cypress borders, boulders, and moss)
  console.log('[Shot 6] Zen Rock Garden...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(22.0, 0.2, 14.0);
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(13.0, 8.5, 9.0);
        engine.cameraRig.camera.lookAt(22.0, 1.0, 20.0);
      };
    }
  });
  await page.waitForTimeout(600);
  await capture('gauntlet-genshin-6-zen-garden.png');

  // 7. Celestial Sun & Sky Atmosphere (Atmospheric fog gradient, sun corona, celestial sky dome)
  console.log('[Shot 7] Sun & Atmosphere...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(0, 0.05, 15.0);
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(0, 1.8, 22.0);
        engine.cameraRig.camera.lookAt(25.0, 28.0, 10.0);
      };
    }
  });
  await page.waitForTimeout(600);
  await capture('gauntlet-genshin-7-sun-atmosphere.png');

  // 8. Hero Sprint Dash Trail VFX (Leon character, speed boost after-images and ribbon streamers)
  console.log('[Shot 8] Sprint Dash Trail VFX...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(0, 0.05, 30.0);
      engine.physics.facingAngle = Math.PI; // Heading North
      engine.physics.speed = 18.0;
      engine.physics.velocity.set(0, 0, -18);
      engine.dashVFX.triggerDashBurst(engine.physics.position, engine.physics.velocity);
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(0, 2.2, 36.0);
        engine.cameraRig.camera.lookAt(0, 1.3, 26.0);
      };
    }
  });
  await page.waitForTimeout(600);
  await capture('gauntlet-genshin-8-hero-dash-vfx.png');

  await browser.close();
  console.log('[Gauntlet Eval] Completed all 8 diagnostic captures!');
}

main().catch((err) => {
  console.error('[Gauntlet Eval] Error:', err);
  process.exit(1);
});
