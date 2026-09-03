import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\amaur\\.gemini\\antigravity\\brain\\2bb1b2f9-d134-49aa-a3a0-084a92f1bbba';
const OUTPUT_DIR = path.resolve('output', 'screenshots');
const LOCAL_ARTIFACTS = path.resolve('artifacts');

async function main() {
  console.log('[Loop 4 Test] Starting vite preview server on port 5173...');
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

  console.log('[Loop 4 Test] Launching Chromium with WebGL (SwiftShader)...');
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

  console.log('[Loop 4 Test] Navigating to http://localhost:5173/3dgame...');
  try {
    await page.goto('http://localhost:5173/3dgame', { waitUntil: 'domcontentloaded', timeout: 15000 });
  } catch (e) {
    console.warn('[Navigation Note]:', e.message);
  }

  // Wait for canvas and 3D engine to mount
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(3000);

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
    console.log(`[Loop 4 Test] ✅ Saved screenshot: ${filename}`);
  };

  // 1. Shot 1: loop4-trees-sakura-meadow.png
  // Heroic composition of the sculpted Japanese Sakura tree with gnarled artistic trunk,
  // roots in the living grass meadow, pink cloud canopy, and Leon character standing gracefully beside it.
  console.log('[Shot 1] Framing Sakura tree in pristine meadow with anime sky...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(-14.8, 0, 16.8);
      engine.physics.facingAngle = Math.PI * 0.75;
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(-11.5, 2.2, 13.0);
        engine.cameraRig.camera.lookAt(-16.0, 2.6, 18.0);
      };
    }
  });
  await page.waitForTimeout(1200);
  await captureCanvas('loop4-trees-sakura-meadow.png');

  // 2. Shot 2: loop4-trees-canopy-closeup.png
  // Pure artistic macro closeup right into the cloud-like volumetric foliage clusters,
  // showcasing Spherical Normal Transfer, smooth anime cel-shading bands, and subtle petal translucency rim.
  console.log('[Shot 2] Framing close-up on cloud-like volumetric foliage canopy...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(-13.5, 4.3, 15.5);
        engine.cameraRig.camera.lookAt(-16.0, 4.4, 18.0);
      };
    }
  });
  await page.waitForTimeout(1200);
  await captureCanvas('loop4-trees-canopy-closeup.png');

  // 3. Shot 3: loop4-overview.png
  // Sweeping high-elevation panoramic overview of the park showing the harmony of Sakuras, Summer Oaks,
  // Alpine Pines, the living grass meadow, stone plaza, fountain, and sky.
  console.log('[Shot 3] Framing panoramic overview of the sculpted anime park...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(0, 0, 0);
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(22.0, 16.0, 28.0);
        engine.cameraRig.camera.lookAt(0, 1.0, 0);
      };
    }
  });
  await page.waitForTimeout(1200);
  await captureCanvas('loop4-overview.png');

  console.log('[Loop 4 Test] Closing browser and preview server...');
  await browser.close();
  spawn(`taskkill /pid ${server.pid} /T /F`, { shell: true });

  console.log('[Loop 4 Test] All screenshots captured successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('[Loop 4 Test Error]:', err);
  process.exit(1);
});
