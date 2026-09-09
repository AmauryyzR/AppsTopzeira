import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function main() {
  fs.mkdirSync('artifacts', { recursive: true });

  console.log('Launching Chromium...');
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
  console.log('Character stats:', JSON.stringify(stats, null, 2));

  const saveFrame = async (filename) => {
    const dataUrl = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      return canvas ? canvas.toDataURL('image/png') : null;
    });
    if (!dataUrl) throw new Error('Failed to capture canvas dataURL');
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    const outPath = path.join('artifacts', filename);
    fs.writeFileSync(outPath, Buffer.from(base64, 'base64'));
    console.log(`Saved ${outPath} (${fs.statSync(outPath).size} bytes)`);
  };

  await page.waitForTimeout(2000);

  // 1. Front Full Body
  console.log('1. Capturing front view...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.setOrbit(Math.PI, 0.08, 3.2);
  });
  await page.waitForTimeout(600);
  await saveFrame('shanimation-front.png');

  // 2. 3/4 Hero View
  console.log('2. Capturing 3/4 hero view...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.setOrbit(Math.PI + 0.45, 0.14, 3.2);
  });
  await page.waitForTimeout(600);
  await saveFrame('shanimation-3quarter.png');

  // 3. Close-up on Head, Teeth, Face
  console.log('3. Capturing close-up on head and face...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.setOrbit(Math.PI + 0.10, 0.05, 1.8);
  });
  await page.waitForTimeout(600);
  await saveFrame('shanimation-closeup.png');

  // 4. Back View with Tail Fluke & Dorsal Fin
  console.log('4. Capturing back view with tail and dorsal fin...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.setOrbit(0.35, 0.16, 2.9);
  });
  await page.waitForTimeout(600);
  await saveFrame('shanimation-back.png');

  // 5. Running Action Pose
  console.log('5. Capturing running action stride...');
  await page.evaluate(() => {
    const eng = window.__engine;
    eng.cameraRig.setOrbit(Math.PI + 0.55, 0.12, 3.4);
  });
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(800);
  await saveFrame('shanimation-run.png');
  await page.keyboard.up('KeyW');
  await page.waitForTimeout(400);

  // 6. Jump Action Pose (Apex Leap)
  console.log('6. Capturing jump apex leap...');
  await page.keyboard.down('Space');
  await page.waitForTimeout(220);
  await page.keyboard.up('Space');
  await page.waitForTimeout(200);
  await saveFrame('shanimation-jump.png');

  await browser.close();
  console.log('All verification images successfully captured!');
}

main().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
