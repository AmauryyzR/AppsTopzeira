import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\amaur\\.gemini\\antigravity\\brain\\1d13eb49-4524-4f52-946a-b9dcbfb7054a';
const OUTPUT_DIR = path.resolve('output', 'screenshots');
const LOCAL_ARTIFACTS = path.resolve('artifacts');

async function main() {
  console.log('[Loop 3 Test] Starting vite preview server on port 5173...');
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

  console.log('[Loop 3 Test] Launching Chromium with WebGL (SwiftShader)...');
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

  console.log('[Loop 3 Test] Navigating to http://localhost:5173/3dgame...');
  try {
    await page.goto('http://localhost:5173/3dgame', { waitUntil: 'domcontentloaded', timeout: 15000 });
  } catch (e) {
    console.warn('[Navigation Note]:', e.message);
  }

  // Wait for canvas and 3D engine to mount
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(2500);

  fs.mkdirSync(LOCAL_ARTIFACTS, { recursive: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  const captureCanvas = async (filename) => {
    const canvas = await page.$('canvas');
    if (!canvas) throw new Error('Canvas element not found');

    const localPath = path.join(LOCAL_ARTIFACTS, filename);
    const outPath = path.join(OUTPUT_DIR, filename);
    const destPath = path.join(ARTIFACT_DIR, filename);

    await canvas.screenshot({ path: localPath, timeout: 15000 });
    fs.copyFileSync(localPath, outPath);
    fs.copyFileSync(localPath, destPath);
    console.log(`[Loop 3 Test] ✅ Saved screenshot: ${filename}`);
  };

  // 1. Panoramic Overview Shot: High camera elevation viewing the vast field of stylized grass
  console.log('[Shot 1] Setting up Panoramic Overview of the Instanced Grass Field...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.cameraRig.setOrbit(0.65, 0.45, 15.0);
    }
  });
  await page.waitForTimeout(1000);
  await captureCanvas('loop3-grass-panoramic-meadow.png');

  // 2. Hero Running in Grass Shot: Move character deep into the grass meadow
  console.log('[Shot 2] Moving character into the grass field and capturing player interaction & running...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      // Position character in the lush grass quadrant
      engine.physics.reset(14.0, 0, 14.0);
      engine.physics.facingAngle = Math.PI * 0.25;
      engine.cameraRig.setOrbit(Math.PI * 0.25, 0.22, 5.5);
    }
  });
  // Simulate forward sprint running through the grass for dynamic blade bending
  await page.keyboard.down('KeyW');
  await page.keyboard.down('ShiftLeft');
  await page.waitForTimeout(1200);
  await captureCanvas('loop3-grass-hero-running.png');
  await page.keyboard.up('ShiftLeft');
  await page.keyboard.up('KeyW');

  // 3. Close-up Macro Shot: High-fidelity look right into the grass blades and wind deformation
  console.log('[Shot 3] Setting up Close-up Macro View inside the open Grass Meadow...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      // Position character and camera in clear open grass meadow away from obstacle course
      engine.physics.reset(-12.0, 0, 22.0);
      engine.physics.facingAngle = Math.PI * 0.8;
      engine.cameraRig.setOrbit(2.2, 0.12, 3.6);
    }
  });
  await page.waitForTimeout(1000);
  await captureCanvas('loop3-grass-closeup-sheen.png');

  console.log('[Loop 3 Test] Closing browser and preview server...');
  await browser.close();
  spawn(`taskkill /pid ${server.pid} /T /F`, { shell: true });

  console.log('[Loop 3 Test] All screenshots captured and saved successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('[Loop 3 Test Error]:', err);
  process.exit(1);
});
