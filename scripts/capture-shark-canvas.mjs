import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';

async function main() {
  fs.mkdirSync('artifacts', { recursive: true });

  console.log('Checking or starting Vite...');
  let serverReady = false;
  try {
    const res = await fetch('http://localhost:5000/3dgame');
    if (res.ok) serverReady = true;
  } catch {}

  let viteProc = null;
  if (!serverReady) {
    viteProc = spawn('npx', ['vite', '--port', '5000', '--host'], {
      shell: true,
      stdio: 'pipe',
    });
    for (let i = 0; i < 25; i++) {
      try {
        const res = await fetch('http://localhost:5000/3dgame');
        if (res.ok) {
          serverReady = true;
          break;
        }
      } catch {
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1
  });

  console.log('Loading /3dgame...');
  await page.goto('http://localhost:5000/3dgame', { waitUntil: 'domcontentloaded' });

  // Wait for player character to be loaded
  await page.waitForFunction(() => {
    const eng = window.__engine;
    return eng && eng.playerCharacter && eng.playerCharacter.isLoaded;
  }, { timeout: 20000 });

  console.log('Character is loaded in game!');

  const canvas = page.locator('canvas');
  await page.waitForTimeout(1000);

  // 1. Front view of character
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.yaw = Math.PI; // Face front of character
    eng.cameraRig.pitch = 0.12;
    eng.cameraRig.distance = 4.5;
  });
  await page.waitForTimeout(600);
  console.log('Saving artifacts/shark-3dgame-front.png...');
  await canvas.screenshot({ path: 'artifacts/shark-3dgame-front.png' });

  // 2. 3/4 Dynamic Hero view
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.yaw = Math.PI + 0.65;
    eng.cameraRig.pitch = 0.22;
    eng.cameraRig.distance = 3.8;
  });
  await page.waitForTimeout(600);
  console.log('Saving artifacts/shark-3dgame-3quarter.png...');
  await canvas.screenshot({ path: 'artifacts/shark-3dgame-3quarter.png' });

  // 3. Close-up on shark hoodie head & teeth
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.yaw = Math.PI + 0.30;
    eng.cameraRig.pitch = 0.08;
    eng.cameraRig.distance = 2.2;
  });
  await page.waitForTimeout(600);
  console.log('Saving artifacts/shark-3dgame-close.png...');
  await canvas.screenshot({ path: 'artifacts/shark-3dgame-close.png' });

  // 4. Back view showing shark tail & dorsal fin!
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.yaw = 0.30;
    eng.cameraRig.pitch = 0.20;
    eng.cameraRig.distance = 3.6;
  });
  await page.waitForTimeout(600);
  console.log('Saving artifacts/shark-3dgame-tail.png...');
  await canvas.screenshot({ path: 'artifacts/shark-3dgame-tail.png' });

  // 5. Simulate Run
  console.log('Simulating run...');
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(600);
  console.log('Saving artifacts/shark-3dgame-run.png...');
  await canvas.screenshot({ path: 'artifacts/shark-3dgame-run.png' });

  // 6. Simulate Jump
  console.log('Simulating jump...');
  await page.keyboard.down('Space');
  await page.waitForTimeout(200);
  await page.keyboard.up('Space');
  await page.waitForTimeout(200);
  console.log('Saving artifacts/shark-3dgame-jump.png...');
  await canvas.screenshot({ path: 'artifacts/shark-3dgame-jump.png' });

  await page.keyboard.up('KeyW');

  await browser.close();
  if (viteProc) viteProc.kill();
  console.log('All screenshots captured successfully!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
