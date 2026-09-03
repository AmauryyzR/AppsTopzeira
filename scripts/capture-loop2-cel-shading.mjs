import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\amaur\\.gemini\\antigravity\\brain\\9f95b8b8-b0e5-4e7b-98c5-c20013ce4534';

async function main() {
  console.log('[Loop 2 Test] Starting vite preview server on port 5173...');
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

  console.log('[Loop 2 Test] Launching Chromium with WebGL (SwiftShader)...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox'],
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
  });

  page.on('console', (msg) => console.log(`[Browser ${msg.type()}]:`, msg.text()));
  page.on('pageerror', (err) => console.error('[Browser PageError]:', err));

  console.log('[Loop 2 Test] Navigating to http://localhost:5173/3dgame...');
  try {
    await page.goto('http://localhost:5173/3dgame', { waitUntil: 'networkidle', timeout: 15000 });
  } catch (e) {
    console.warn('[Navigation Note]:', e.message);
  }

  // Wait for 3D engine, shaders, and textures to initialize
  await page.waitForTimeout(2500);

  fs.mkdirSync('artifacts', { recursive: true });
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  const captureAndCopy = async (filename) => {
    const localPath = path.join('artifacts', filename);
    const destPath = path.join(ARTIFACT_DIR, filename);
    await page.screenshot({ path: localPath });
    fs.copyFileSync(localPath, destPath);
    console.log(`[Loop 2 Test] Saved: ${localPath} and ${destPath}`);
  };

  // 1. Overview shot: Cel-shaded park, Leon brawler character with rim light & stylized shadows
  console.log('[Shot 1] Capturing Cel-Shaded Park & Hero Overview...');
  await captureAndCopy('loop2-cel-shading-overview.png');

  // 2. Camera Tilt Up / Low Angle Test (Over-The-Shoulder Hero Shot)
  console.log('[Shot 2] Tilting camera up (low angle hero shot) to verify ground clearance and over-the-shoulder framing...');
  // Drag upward by ~200px to tilt camera up (decreasing pitch)
  await page.mouse.move(640, 480);
  await page.mouse.down({ button: 'left' });
  await page.mouse.move(640, 260, { steps: 30 });
  await page.mouse.up({ button: 'left' });
  await page.waitForTimeout(1000);
  await captureAndCopy('loop2-camera-low-angle-sky.png');

  // 3. Return camera to natural pitch and orbit to view fountain, stone chamfers, and sakura trees
  console.log('[Shot 3] Returning pitch to natural elevation and orbiting to view fountain & sakura trees...');
  await page.mouse.move(640, 260);
  await page.mouse.down({ button: 'left' });
  await page.mouse.move(640, 420, { steps: 20 }); // Drag down tilts camera back down to natural eye level
  await page.mouse.up({ button: 'left' });
  await page.waitForTimeout(400);

  // Now orbit to face the side quadrant
  await page.mouse.move(640, 360);
  await page.mouse.down({ button: 'left' });
  await page.mouse.move(340, 360, { steps: 30 });
  await page.mouse.up({ button: 'left' });
  await page.waitForTimeout(1000);
  await captureAndCopy('loop2-parkour-fountain-view.png');

  console.log('[Loop 2 Test] Closing browser and preview server...');
  await browser.close();
  spawn(`taskkill /pid ${server.pid} /T /F`, { shell: true });

  console.log('[Loop 2 Test] All test screenshots completed successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('[Loop 2 Test Error]:', err);
  process.exit(1);
});
