import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';

async function main() {
  console.log('Starting preview server on port 5173...');
  const server = spawn('npx vite preview --port 5173 --host', {
    shell: true,
  });

  await new Promise((resolve, reject) => {
    server.stdout.on('data', (d) => {
      const msg = d.toString();
      console.log('[Server]:', msg.trim());
      if (msg.includes('Local:') || msg.includes('http://')) {
        resolve();
      }
    });
    server.stderr.on('data', (d) => console.error('[Server Err]:', d.toString().trim()));
    setTimeout(() => resolve(), 5000);
  });

  console.log('Launching browser with WebGL (SwiftShader)...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox'],
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });

  page.on('console', (msg) => console.log(`[Browser Console ${msg.type()}]:`, msg.text()));
  page.on('pageerror', (err) => console.error('[Browser PageError]:', err));

  try {
    console.log('Navigating to http://localhost:5173/3dgame...');
    await page.goto('http://localhost:5173/3dgame', { waitUntil: 'networkidle', timeout: 15000 });
  } catch (e) {
    console.warn('Navigation note:', e.message);
  }

  // Wait for 3D engine to render
  await page.waitForTimeout(2000);

  fs.mkdirSync('artifacts', { recursive: true });

  // 1. Default view with character, playground and anime sky horizon
  console.log('Capturing default horizon view...');
  await page.screenshot({ path: 'artifacts/sky-default-view.png' });

  // 2. Drag mouse UP to tilt camera up toward the anime sky dome & clouds
  console.log('Tilting camera up to capture anime sky dome...');
  await page.mouse.move(640, 450);
  await page.mouse.down({ button: 'left' });
  await page.mouse.move(640, 150, { steps: 25 }); // Drag up tilts camera up
  await page.mouse.up({ button: 'left' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'artifacts/sky-zenith-clouds.png' });

  // 3. Orbit camera to look towards the sun & corona
  console.log('Orbiting camera to face sun...');
  await page.mouse.move(640, 360);
  await page.mouse.down({ button: 'left' });
  await page.mouse.move(1000, 200, { steps: 25 }); // Orbit to face sun direction
  await page.mouse.up({ button: 'left' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'artifacts/sky-sun-corona.png' });

  console.log('Closing browser and server...');
  await browser.close();

  // On Windows, kill process tree
  spawn(`taskkill /pid ${server.pid} /T /F`, { shell: true });

  console.log('Done! Screenshots saved to artifacts/');
  process.exit(0);
}

main().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
