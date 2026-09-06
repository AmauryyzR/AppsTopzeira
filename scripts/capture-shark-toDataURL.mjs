import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function capture() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  console.log('Navigating to http://localhost:5000/3dgame...');
  await page.goto('http://localhost:5000/3dgame', { waitUntil: 'domcontentloaded' });

  await page.waitForFunction(() => {
    const eng = window.__engine;
    return eng && eng.playerCharacter && eng.playerCharacter.isLoaded;
  }, { timeout: 20000 });

  console.log('Shark character loaded and active!');

  const saveCanvas = async (filename) => {
    const dataUrl = await page.evaluate(() => {
      const eng = window.__engine;
      // Force composer render so the current frame is fresh in buffer
      eng.composer.render();
      return eng.renderer.domElement.toDataURL('image/png');
    });
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(path.join('artifacts', filename), Buffer.from(base64Data, 'base64'));
    console.log(`Saved artifacts/${filename} (${fs.statSync(path.join('artifacts', filename)).size} bytes)`);
  };

  // Wait 1.5s for initial setup & physics to settle
  await page.waitForTimeout(1500);

  // 1. Front hero view
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.yaw = Math.PI; // Face the front of the shark
    eng.cameraRig.pitch = 0.12;
    eng.cameraRig.distance = 4.2;
  });
  await page.waitForTimeout(500);
  await saveCanvas('shark-3dgame-front.png');

  // 2. 3/4 Perspective Hero view
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.yaw = Math.PI + 0.60;
    eng.cameraRig.pitch = 0.18;
    eng.cameraRig.distance = 3.8;
  });
  await page.waitForTimeout(500);
  await saveCanvas('shark-3dgame-3quarter.png');

  // 3. Close-up on Shark Hoodie & Teeth
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.yaw = Math.PI + 0.20;
    eng.cameraRig.pitch = 0.08;
    eng.cameraRig.distance = 2.4;
  });
  await page.waitForTimeout(500);
  await saveCanvas('shark-3dgame-close.png');

  // 4. Back view showing shark tail fluke & hoodie back
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.yaw = 0.25;
    eng.cameraRig.pitch = 0.18;
    eng.cameraRig.distance = 3.5;
  });
  await page.waitForTimeout(500);
  await saveCanvas('shark-3dgame-tail.png');

  // 5. Simulate Run
  console.log('Simulating run...');
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(600);
  await saveCanvas('shark-3dgame-run.png');

  // 6. Simulate Jump
  console.log('Simulating jump...');
  await page.keyboard.down('Space');
  await page.waitForTimeout(200);
  await page.keyboard.up('Space');
  await page.waitForTimeout(200);
  await saveCanvas('shark-3dgame-jump.png');

  await page.keyboard.up('KeyW');

  await browser.close();
  console.log('All 6 high-resolution screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
