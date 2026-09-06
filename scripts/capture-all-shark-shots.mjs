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

  // Block external Google fonts to prevent document.fonts.ready hang
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());

  console.log('Navigating to http://localhost:5000/3dgame...');
  await page.goto('http://localhost:5000/3dgame', { waitUntil: 'domcontentloaded' });

  await page.waitForFunction(() => {
    const eng = window.__engine;
    return eng && eng.playerCharacter && eng.playerCharacter.isLoaded;
  }, { timeout: 30000 });

  console.log('Shark character loaded and active!');
  await page.waitForTimeout(1500);

  // 1. Close-up on Shark Hoodie Head, Teeth & Face
  console.log('1. Capturing Close-up on Shark Face & Teeth...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.yaw = Math.PI + 0.15; // Front-facing
    eng.cameraRig.pitch = 0.05;
    eng.cameraRig.distance = 1.9; // Tight portrait framing
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'artifacts/shark-face-teeth-closeup.png' });
  console.log('Saved shark-face-teeth-closeup.png');

  // 2. 3/4 Dynamic Hero View (Full Body)
  console.log('2. Capturing 3/4 Hero Full-Body...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.yaw = Math.PI + 0.55;
    eng.cameraRig.pitch = 0.16;
    eng.cameraRig.distance = 3.6;
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'artifacts/shark-3quarter-hero.png' });
  console.log('Saved shark-3quarter-hero.png');

  // 3. Back View showing Shark Tail Fluke & Hoodie Dorsal Fin
  console.log('3. Capturing Back View with Shark Tail Fluke...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.yaw = 0.28; // Behind character
    eng.cameraRig.pitch = 0.22;
    eng.cameraRig.distance = 3.4;
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'artifacts/shark-tail-back.png' });
  console.log('Saved shark-tail-back.png');

  // 4. Running Action Pose
  console.log('4. Capturing Running Action Pose with Stride & Tail Wag...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.yaw = Math.PI + 0.70;
    eng.cameraRig.pitch = 0.15;
    eng.cameraRig.distance = 3.8;
  });
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'artifacts/shark-run-action.png' });
  console.log('Saved shark-run-action.png');

  // 5. Jump Action Pose (Apex Leap)
  console.log('5. Capturing Jump Action Pose (Apex Leap)...');
  await page.keyboard.down('Space');
  await page.waitForTimeout(220);
  await page.keyboard.up('Space');
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'artifacts/shark-jump-action.png' });
  console.log('Saved shark-jump-action.png');

  await page.keyboard.up('KeyW');
  await page.waitForTimeout(400);

  await browser.close();
  console.log('All shark character showcase screenshots saved successfully!');
}

main().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
