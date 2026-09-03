import { chromium } from 'playwright';

async function test() {
  console.log('Iniciando captura de verificação das 5 correções no /3dgame...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox'],
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto('http://localhost:5000/3dgame', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Torii Gate Gakuzuka plaque from inside (looking south towards entrance)
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(0, 0, 36);
      engine.physics.facingAngle = Math.PI;
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(0, 4.2, 33);
        engine.cameraRig.camera.lookAt(0, 5.8, 42);
      };
    }
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'artifacts/fix-torii-both-sides.png' });
  console.log('Saved artifacts/fix-torii-both-sides.png');

  // 2. Arched Bridge & Canal (showing grass 100% excluded from canal water)
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(-26, 0, 0);
      engine.physics.facingAngle = -Math.PI / 2;
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(-20, 7.5, 9);
        engine.cameraRig.camera.lookAt(-34, 1.2, 0);
      };
    }
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'artifacts/fix-canal-grass-clean.png' });
  console.log('Saved artifacts/fix-canal-grass-clean.png');

  // 3. Alpine Pine Tree (Focusing directly on Pine at [-26, 14])
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(-26, 0, 8);
      engine.physics.facingAngle = 0;
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(-26, 3.8, 6.5);
        engine.cameraRig.camera.lookAt(-26, 4.2, 14);
      };
    }
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'artifacts/fix-pine-trees-lush.png' });
  console.log('Saved artifacts/fix-pine-trees-lush.png');

  // 4. Character Drawstrings & Chest Direct Front Close-up
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(0, 0, 8);
      engine.playerCharacter.group.rotation.y = 0;
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(0, 0.95, 9.7);
        engine.cameraRig.camera.lookAt(0, 0.95, 8.0);
      };
    }
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'artifacts/fix-hoodie-drawstrings-connected.png' });
  console.log('Saved artifacts/fix-hoodie-drawstrings-connected.png');

  // 5. Character Shoes Ground Contact (showing soles cleanly resting on ground, no clipping)
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(0, 0, 8);
      engine.playerCharacter.group.rotation.y = 0;
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(0.6, 0.22, 9.3);
        engine.cameraRig.camera.lookAt(0, 0.15, 8.0);
      };
    }
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'artifacts/fix-shoes-ground-contact.png' });
  console.log('Saved artifacts/fix-shoes-ground-contact.png');

  // 6. Mid-Air Jump Pose (verifying full vertical height & natural parabolic posture)
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(0, 0, 8);
      engine.physics.position.set(0, 1.45, 8);
      engine.physics.velocity.y = 6.0;
      engine.physics.isGrounded = false;
      engine.playerCharacter.setPosition(0, 1.45, 8);
      engine.playerCharacter.group.rotation.y = 0;
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(0, 1.8, 11.2);
        engine.cameraRig.camera.lookAt(0, 1.6, 8.0);
      };
    }
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'artifacts/fix-jump-mechanic.png' });
  console.log('Saved artifacts/fix-jump-mechanic.png');

  // 7. NEW EXPRESSIVE FACE (Anime Eyes, Sclera, Iris, Pupils, Bangs, Blush & Lollipop)
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(0, 0, 8);
      engine.physics.facingAngle = 0;
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(0, 1.48, 9.4);
        engine.cameraRig.camera.lookAt(0, 1.46, 8.0);
      };
    }
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'artifacts/fix-leon-face-front.png' });
  console.log('Saved artifacts/fix-leon-face-front.png');

  // 8. HAND CONNECTED TO ARM (Solid Wrist, Knuckles & Zero Gap)
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(0, 0, 8);
      engine.physics.facingAngle = 0;
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(0.48, 1.05, 9.3);
        engine.cameraRig.camera.lookAt(0.38, 0.95, 8.0);
      };
    }
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'artifacts/fix-leon-arm-wrist-connected.png' });
  console.log('Saved artifacts/fix-leon-arm-wrist-connected.png');

  await browser.close();
  console.log('Todas as fotos de verificação salvas com sucesso!');
}

test().catch(console.error);

