import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';

async function main() {
  const server = spawn('npx vite preview --port 5173 --host', { shell: true });

  await new Promise((resolve) => {
    server.stdout.on('data', (d) => {
      if (d.toString().includes('Local:') || d.toString().includes('http://')) resolve();
    });
    setTimeout(resolve, 4000);
  });

  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox'],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  await page.goto('http://localhost:5173/3dgame', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  fs.mkdirSync('artifacts', { recursive: true });

  // Evaluate directly in page context to position camera rig to inspect sky & sun
  await page.evaluate(() => {
    // Access engine via window if available or simulate mouse drag
  });

  // 1. Capture front horizon view
  await page.screenshot({ path: 'artifacts/view-1-horizon.png' });

  // 2. Rotate to face the sun (sun is at x: 45, y: 65, z: 35)
  // Drag mouse right-to-left
  await page.mouse.move(640, 360);
  await page.mouse.down({ button: 'left' });
  await page.mouse.move(240, 360, { steps: 20 });
  await page.mouse.up({ button: 'left' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'artifacts/view-2-sun.png' });

  // 3. Rotate 180 degrees to look behind
  await page.mouse.move(640, 360);
  await page.mouse.down({ button: 'left' });
  await page.mouse.move(140, 360, { steps: 25 });
  await page.mouse.up({ button: 'left' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'artifacts/view-3-clouds.png' });

  await browser.close();
  spawn(`taskkill /pid ${server.pid} /T /F`, { shell: true });
  process.exit(0);
}

main().catch(console.error);
