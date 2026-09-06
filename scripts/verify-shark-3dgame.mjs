import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';

async function main() {
  fs.mkdirSync('artifacts', { recursive: true });

  // 1. Start Vite server on port 5000
  console.log('Starting Vite server...');
  const viteProcess = spawn('npx', ['vite', '--port', '5000', '--host'], {
    shell: true,
    stdio: 'pipe',
  });

  // Wait for server to become responsive
  let serverReady = false;
  for (let i = 0; i < 30; i++) {
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

  if (!serverReady) {
    viteProcess.kill();
    throw new Error('Vite server failed to start within timeout');
  }
  console.log('Vite server is ready at http://localhost:5000/3dgame');

  // 2. Launch headless browser with WebGL
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();

  console.log('Navigating to http://localhost:5000/3dgame...');
  await page.goto('http://localhost:5000/3dgame', { waitUntil: 'networkidle' });

  // Wait for engine and character to load
  await page.waitForFunction(() => {
    const eng = window.__engine;
    return eng && eng.playerCharacter && eng.playerCharacter.isLoaded;
  }, { timeout: 15000 });

  console.log('Shark character loaded and attached to skeleton!');

  // Query skeleton and character status
  const characterStats = await page.evaluate(() => {
    const eng = window.__engine;
    const pc = eng.playerCharacter;
    let totalMeshes = 0;
    pc.modelRoot.traverse((c) => {
      if (c.isMesh) totalMeshes++;
    });
    return {
      isLoaded: pc.isLoaded,
      baseScale: pc.baseScale,
      totalMeshes,
      headChildren: pc.headBone.children.length,
      chestChildren: pc.chestBone.children.length,
      tailChildren: pc.tailBone.children.length,
      cordLChildren: pc.cordLBone.children.length,
      cordRChildren: pc.cordRBone.children.length,
      footLChildren: pc.footL.children.length,
      footRChildren: pc.footR.children.length,
      position: pc.group.position.toArray(),
    };
  });
  console.log('Character Stats:', JSON.stringify(characterStats, null, 2));

  // Let animations settle
  await page.waitForTimeout(1000);

  // 1. Capture front hero view (set camera in front of the character)
  await page.evaluate(() => {
    const eng = window.__engine;
    // Position camera facing the front of the character
    eng.cameraRig.yaw = Math.PI; // Face front of character
    eng.cameraRig.pitch = 0.15;
    eng.cameraRig.distance = 4.2;
  });
  await page.waitForTimeout(600);
  console.log('Capturing artifacts/shark-3dgame-front.png...');
  await page.screenshot({ path: 'artifacts/shark-3dgame-front.png', timeout: 15000 });

  // 2. 3/4 Hero view (slightly to the side)
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.yaw = Math.PI + 0.55;
    eng.cameraRig.pitch = 0.20;
    eng.cameraRig.distance = 4.0;
  });
  await page.waitForTimeout(600);
  console.log('Capturing artifacts/shark-3dgame-3quarter.png...');
  await page.screenshot({ path: 'artifacts/shark-3dgame-3quarter.png', timeout: 15000 });

  // 3. Close-up on Shark Hoodie & Teeth
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.yaw = Math.PI + 0.25;
    eng.cameraRig.pitch = 0.10;
    eng.cameraRig.distance = 2.4;
  });
  await page.waitForTimeout(600);
  console.log('Capturing artifacts/shark-3dgame-close.png...');
  await page.screenshot({ path: 'artifacts/shark-3dgame-close.png', timeout: 15000 });

  // 4. Back view showing shark tail & dorsal fin!
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.yaw = 0.35; // Behind the character
    eng.cameraRig.pitch = 0.18;
    eng.cameraRig.distance = 3.5;
  });
  await page.waitForTimeout(600);
  console.log('Capturing artifacts/shark-3dgame-tail.png...');
  await page.screenshot({ path: 'artifacts/shark-3dgame-tail.png', timeout: 15000 });

  // 5. Simulate Run
  console.log('Simulating run movement (W key)...');
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(800);
  console.log('Capturing artifacts/shark-3dgame-run.png...');
  await page.screenshot({ path: 'artifacts/shark-3dgame-run.png', timeout: 15000 });

  // 6. Simulate Jump
  console.log('Simulating jump action (Space key)...');
  await page.keyboard.down('Space');
  await page.waitForTimeout(200);
  await page.keyboard.up('Space');
  await page.waitForTimeout(250);
  console.log('Capturing artifacts/shark-3dgame-jump.png...');
  await page.screenshot({ path: 'artifacts/shark-3dgame-jump.png', timeout: 15000 });

  await page.keyboard.up('KeyW');
  await page.waitForTimeout(500);

  await browser.close();
  viteProcess.kill();

  console.log('All verification screenshots successfully captured!');
}

main().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
