import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\amaur\\.gemini\\antigravity\\brain\\a5420dc6-fd8b-44eb-beba-7190465e80e8';
const OUTPUT_DIR = path.resolve('output', 'screenshots');
const LOCAL_ARTIFACTS = path.resolve('artifacts');

async function main() {
  console.log('[Loop 5 Test] Starting vite preview server on port 5173...');
  const server = spawn('npx vite preview --port 5173 --host', {
    shell: true,
  });

  await new Promise((resolve) => {
    server.stdout.on('data', (d) => {
      const msg = d.toString();
      console.log('[Server]:', msg.trim());
      if (msg.includes('Local:') || msg.includes('http://')) {
        resolve();
      }
    });
    server.stderr.on('data', (d) => console.error('[Server Err]:', d.toString().trim()));
    setTimeout(() => resolve(), 4000);
  });

  console.log('[Loop 5 Test] Launching Chromium with WebGL (SwiftShader)...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  page.on('console', (msg) => console.log(`[Browser ${msg.type()}]:`, msg.text()));
  page.on('pageerror', (err) => console.error('[Browser PageError]:', err));

  console.log('[Loop 5 Test] Navigating to http://localhost:5173/3dgame...');
  try {
    await page.goto('http://localhost:5173/3dgame', { waitUntil: 'domcontentloaded', timeout: 15000 });
  } catch (e) {
    console.warn('[Navigation Note]:', e.message);
  }

  // Wait for canvas and 3D engine to mount
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(3500);

  fs.mkdirSync(LOCAL_ARTIFACTS, { recursive: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  const captureCanvas = async (filename) => {
    const localPath = path.join(LOCAL_ARTIFACTS, filename);
    const outPath = path.join(OUTPUT_DIR, filename);
    const destPath = path.join(ARTIFACT_DIR, filename);

    await page.screenshot({ path: localPath });
    fs.copyFileSync(localPath, outPath);
    fs.copyFileSync(localPath, destPath);
    console.log(`[Loop 5 Test] ✅ Saved screenshot: ${filename}`);
  };

  // -------------------------------------------------------------
  // Shot 1: loop5-fountain-water-closeup.png
  // Macro closeup of translucent anime water pool surface showcasing:
  // - Turquoise-to-sapphire depth gradient (#2dd4bf -> #0284c7)
  // - Two-layer procedural Voronoi caustics dancing on water & stone floor
  // - Crisp bubbly shoreline foam rim (#f0fdfa) along coping and pedestal
  // - Trochoidal waves with starry anime sun specular glints
  // -------------------------------------------------------------
  console.log('[Shot 1] Framing macro closeup of translucent anime water with caustics and foam rim...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      // Place player standing on the fountain rim to demonstrate collision fidelity
      engine.physics.reset(0, 0.98, 4.25);
      engine.physics.facingAngle = Math.PI;
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(2.2, 2.3, 4.5);
        engine.cameraRig.camera.lookAt(0.2, 0.92, 2.2);
      };
    }
  });
  await page.waitForTimeout(1500);
  await captureCanvas('loop5-fountain-water-closeup.png');

  // -------------------------------------------------------------
  // Shot 2: loop5-fountain-cascades.png
  // Hydrodynamic cascade composition showcasing:
  // - Overflow waterfall curtain falling between upper bowl and lower pool
  // - Lower cascade splash ring with bubbling froth
  // - Central geyser spout with flared spray plume reaching high into the sky
  // - 8 Parabolic arched water jets arching from the pedestal into the pool
  // -------------------------------------------------------------
  console.log('[Shot 2] Framing cascading waterfalls, central geyser and parabolic jets...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(3.2, 0.98, 3.2);
      engine.physics.facingAngle = -Math.PI * 0.75;
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(-4.5, 3.4, 5.8);
        engine.cameraRig.camera.lookAt(0, 3.0, 0);
      };
    }
  });
  await page.waitForTimeout(1500);
  await captureCanvas('loop5-fountain-cascades.png');

  // -------------------------------------------------------------
  // Shot 3: loop5-overview-water.png
  // Sweeping anime park overview showcasing the entire monumental fountain:
  // - Water pool with caustics, cascades, and arching water jets
  // - Player standing freely atop the refined octagonal stone rim (no invisible walls!)
  // - Integration with living grass meadow, sculpted trees, and cel-shaded sky dome
  // -------------------------------------------------------------
  console.log('[Shot 3] Framing sweeping overview of monumental fountain in anime park...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(0, 0.98, 4.25);
      engine.physics.facingAngle = Math.PI;
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(9.8, 6.5, 12.2);
        engine.cameraRig.camera.lookAt(0, 2.0, 0);
      };
    }
  });
  await page.waitForTimeout(1500);
  await captureCanvas('loop5-overview-water.png');

  console.log('[Loop 5 Test] Closing browser and preview server...');
  await browser.close();
  spawn(`taskkill /pid ${server.pid} /T /F`, { shell: true });

  console.log('[Loop 5 Test] All Loop 5 screenshots captured successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('[Loop 5 Test Error]:', err);
  process.exit(1);
});
