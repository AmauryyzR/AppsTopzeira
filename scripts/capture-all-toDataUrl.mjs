import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function main() {
  fs.mkdirSync('artifacts', { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1
  });

  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());

  console.log('Navigating to http://localhost:5000/3dgame...');
  await page.goto('http://localhost:5000/3dgame', { waitUntil: 'domcontentloaded' });

  await page.waitForFunction(() => {
    const eng = window.__engine;
    return eng && eng.playerCharacter && eng.playerCharacter.isLoaded;
  }, { timeout: 60000 });

  console.log('Shark character loaded and active!');
  await page.waitForTimeout(2000);

  const saveFrame = async (filename) => {
    const dataUrl = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return canvas ? canvas.toDataURL('image/png') : null;
    });
    if (!dataUrl) throw new Error('Canvas not found or failed to export');
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    const outPath = path.join('artifacts', filename);
    fs.writeFileSync(outPath, Buffer.from(base64, 'base64'));
    console.log(`Saved ${outPath} (${fs.statSync(outPath).size} bytes)`);
  };

  // 1. Close-up on Shark Hoodie Head, Teeth & Face
  console.log('1. Close-up on Shark Face & Teeth...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.setOrbit(Math.PI + 0.08, 0.04, 1.8);
  });
  await page.waitForTimeout(600);
  await saveFrame('shark-face-teeth-closeup.png');

  // 2. 3/4 Dynamic Hero View (Full Body)
  console.log('2. 3/4 Hero Full-Body...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.setOrbit(Math.PI + 0.45, 0.14, 3.2);
  });
  await page.waitForTimeout(600);
  await saveFrame('shark-3quarter-hero.png');

  // 3. Back View showing Shark Tail Fluke & Hoodie Dorsal Fin
  console.log('3. Back View with Shark Tail Fluke...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.setOrbit(0.35, 0.16, 2.9);
  });
  await page.waitForTimeout(600);
  await saveFrame('shark-tail-back.png');

  // 4. Running Action Pose
  console.log('4. Running Action Pose with Stride & Tail Wag...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.setOrbit(Math.PI + 0.55, 0.12, 3.4);
  });
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(800);
  await saveFrame('shark-run-action.png');

  // 5. Jump Action Pose (Apex Leap)
  console.log('5. Jump Action Pose (Apex Leap)...');
  await page.keyboard.down('Space');
  await page.waitForTimeout(220);
  await page.keyboard.up('Space');
  await page.waitForTimeout(200);
  await saveFrame('shark-jump-action.png');

  await page.keyboard.up('KeyW');
  await page.waitForTimeout(400);

  await browser.close();
  console.log('All 5 shark showcase images successfully captured!');
}

main().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
