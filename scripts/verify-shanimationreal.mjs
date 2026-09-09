import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function main() {
  fs.mkdirSync('artifacts', { recursive: true });

  console.log('1. Starting Vite server on port 5000...');
  const viteProcess = spawn('npx', ['vite', '--port', '5000', '--host'], {
    shell: true,
    stdio: 'pipe',
  });

  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://localhost:5000/3dgame');
      if (res.ok) {
        serverReady = true;
        break;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  if (!serverReady) {
    viteProcess.kill();
    throw new Error('Vite server failed to start within timeout');
  }
  console.log('Vite server is ready at http://localhost:5000/3dgame');

  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('[Browser Error]', msg.text());
    }
  });

  console.log('Navigating to http://localhost:5000/3dgame...');
  await page.goto('http://localhost:5000/3dgame', { waitUntil: 'domcontentloaded' });

  await page.waitForFunction(() => {
    const eng = window.__engine;
    return eng && eng.playerCharacter && eng.playerCharacter.isLoaded;
  }, { timeout: 30000 });

  console.log('Character is loaded and active in 3dgame engine!');

  // Check character status
  const stats = await page.evaluate(() => {
    const eng = window.__engine;
    const pc = eng.playerCharacter;
    return {
      isLoaded: pc.isLoaded,
      baseScale: pc.baseScale,
      hasRoot: !!pc.rootBone,
      hasHips: !!pc.hipsBone,
      hasTail: !!pc.tailBone,
      hasArms: !!(pc.upperArmL && pc.upperArmR),
      hasLegs: !!(pc.thighL && pc.thighR),
      position: pc.group.position.toArray(),
    };
  });
  console.log('Character stats:', stats);

  const saveFrame = async (filename) => {
    const dataUrl = await page.evaluate(() => {
      const eng = window.__engine;
      eng.composer.render();
      const canvas = document.querySelector('canvas');
      return canvas ? canvas.toDataURL('image/png') : null;
    });
    if (!dataUrl) throw new Error('Failed to capture canvas dataURL');
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    const outPath = path.join('artifacts', filename);
    fs.writeFileSync(outPath, Buffer.from(base64, 'base64'));
    console.log('Saved ' + outPath + ' (' + fs.statSync(outPath).size + ' bytes)');
  };

  await page.waitForTimeout(1500);

  // 1. Front Full Body
  console.log('Capturing front full body...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.setOrbit(Math.PI, 0.08, 3.2);
  });
  await page.waitForTimeout(600);
  await saveFrame('shark-shanimation-front.png');

  // 2. 3/4 Hero View
  console.log('Capturing 3/4 hero view...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.setOrbit(Math.PI + 0.45, 0.14, 3.2);
  });
  await page.waitForTimeout(600);
  await saveFrame('shark-shanimation-3quarter.png');

  // 3. Close-up on Head, Teeth, Face
  console.log('Capturing close-up...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.setOrbit(Math.PI + 0.10, 0.05, 1.8);
  });
  await page.waitForTimeout(600);
  await saveFrame('shark-shanimation-closeup.png');

  // 4. Back View with Tail Fluke & Dorsal Fin
  console.log('Capturing back view...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.setOrbit(0.35, 0.16, 2.9);
  });
  await page.waitForTimeout(600);
  await saveFrame('shark-shanimation-back.png');

  // 5. Running Action Pose
  console.log('Capturing running action pose...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.setOrbit(Math.PI + 0.55, 0.12, 3.4);
  });
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(800);
  await saveFrame('shark-shanimation-run.png');
  await page.keyboard.up('KeyW');
  await page.waitForTimeout(400);

  await browser.close();
  viteProcess.kill();
  console.log('Verification completed successfully!');
}

main().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
