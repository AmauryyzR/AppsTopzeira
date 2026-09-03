import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\amaur\\.gemini\\antigravity\\brain\\2c6ab3bf-405a-49d0-9456-d96c9203ba61';
const OUTPUT_DIR = path.resolve('output', 'screenshots');
const LOCAL_ARTIFACTS = path.resolve('artifacts');

async function main() {
  console.log('[Loop 6 Test] Starting vite preview server on port 5173...');
  const server = spawn('npx vite preview --port 5173 --host', {
    shell: true,
  });

  await new Promise((resolve) => {
    server.stdout.on('data', (d) => {
      const msg = d.toString();
      console.log('[Server]:', msg.trim());
      if (msg.includes('Local:') || msg.includes('http://')) {
        resolve();
      }
    });
    server.stderr.on('data', (d) => console.error('[Server Err]:', d.toString().trim()));
    setTimeout(() => resolve(), 4500);
  });

  console.log('[Loop 6 Test] Launching Chromium with WebGL (SwiftShader)...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox'],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  page.on('console', (msg) => console.log(`[Browser ${msg.type()}]:`, msg.text()));
  page.on('pageerror', (err) => console.error('[Browser PageError]:', err));

  console.log('[Loop 6 Test] Navigating to http://localhost:5173/3dgame...');
  try {
    await page.goto('http://localhost:5173/3dgame', { waitUntil: 'domcontentloaded', timeout: 15000 });
  } catch (e) {
    console.warn('[Navigation Note]:', e.message);
  }

  // Wait for canvas and 3D engine to mount
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(4000);

  fs.mkdirSync(LOCAL_ARTIFACTS, { recursive: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  const captureCanvas = async (filename) => {
    const localPath = path.join(LOCAL_ARTIFACTS, filename);
    const outPath = path.join(OUTPUT_DIR, filename);
    const destPath = path.join(ARTIFACT_DIR, filename);

    await page.screenshot({ path: localPath });
    fs.copyFileSync(localPath, outPath);
    fs.copyFileSync(localPath, destPath);
    console.log(`[Loop 6 Test] ✅ Saved screenshot: ${filename}`);
  };

  // -------------------------------------------------------------
  // Shot 1: loop6-torii-gate.png
  // Heroic monumental shot of the South Entrance Torii Gate (z = 42) showcasing:
  // - Cinnabar vermilion cel-shaded finish with golden rim sheen (#dc2626)
  // - Obsidian lacquered black roof ridge and chamfered prow terminals
  // - Sweeping curved kasagi lintel, secondary nuki tie-beam, and gakuzuka tablet with gold emblem
  // - Dual inclined pillars with protective black nemaki and granite stone sapatas
  // - Flanking authentic stone lanterns (tōrō) with glowing fireboxes
  // - Sandstone threshold looking straight into the park through the portal
  // -------------------------------------------------------------
  console.log('[Shot 1] Framing heroic composition of South Monumental Torii Gate...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(0, 0.05, 45.5);
      engine.physics.facingAngle = 0; // Facing North toward park fountain
      engine.cameraRig.update = () => {
        // Direct avenue perspective on the stone pathway looking up at the monumental Torii
        engine.cameraRig.camera.position.set(0, 1.9, 50.5);
        engine.cameraRig.camera.lookAt(0, 3.8, 41.5);
      };
    }
  });
  await page.waitForTimeout(1500);
  await captureCanvas('loop6-torii-gate.png');

  // -------------------------------------------------------------
  // Shot 2: loop6-pagoda-gazebo.png
  // Heroic shot of the Zen Pagoda Gazebo of Contemplation at East Plaza (x = 36) showcasing:
  // - Raised octagonal polished cedar platform with accessible 3-tier stairs
  // - 8 cylindrical hinoki wood columns with stone soseki plinths
  // - Multi-tiered pagoda roof with sori upswept flared eaves and exposed rafters
  // - Slate-verdigris ceramic temple tiles with golden flaming jewel spire (hōju)
  // - 8 hanging emissive Japanese lanterns (chōchin) casting warm anime amber radiance
  // - Player character standing on the gazebo platform viewing the gardens
  // -------------------------------------------------------------
  console.log('[Shot 2] Framing Zen Pagoda Gazebo of Contemplation in East Plaza...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(35.0, 0.48, 0.2);
      engine.physics.facingAngle = Math.PI * 0.75;
      engine.cameraRig.update = () => {
        // Elevated 3/4 perspective capturing the double roof, spire, lanterns, columns, and stairs
        engine.cameraRig.camera.position.set(27.0, 3.5, -6.5);
        engine.cameraRig.camera.lookAt(36.0, 2.7, 0.0);
      };
    }
  });
  await page.waitForTimeout(1500);
  await captureCanvas('loop6-pagoda-gazebo.png');

  // -------------------------------------------------------------
  // Shot 3: loop6-arched-bridge.png
  // Heroic shot of the traditional Taiko Bashi / Arched Moon Bridge at West Canal (x = -34) showcasing:
  // - 12m crossing arch rising to 1.35m over the scenic turquoise canal
  // - 30 individual chamfered cedar planks with transverse foot-traction cleats
  // - Sweeping curved vermilion handrails (kasagi-rankan) following the arch curve
  // - 12 burnished bronze giboshi onion finials crowning each vertical post
  // - Stone abutment piers and river embankments
  // - Player character ascending the bridge with fluid physical footing
  // -------------------------------------------------------------
  console.log('[Shot 3] Framing traditional Taiko Bashi / Arched Moon Bridge over West Canal...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(-34, 1.35, 0);
      engine.physics.facingAngle = -Math.PI / 2;
      engine.cameraRig.update = () => {
        engine.cameraRig.camera.position.set(-26.2, 2.6, 5.8);
        engine.cameraRig.camera.lookAt(-34, 1.2, 0);
      };
    }
  });
  await page.waitForTimeout(1500);
  await captureCanvas('loop6-arched-bridge.png');

  // -------------------------------------------------------------
  // Shot 4: loop6-park-landmarks-overview.png
  // Sweeping high-angle panoramic overview of the entire anime park showcasing:
  // - The Architectural Triad: Monumental Torii Gate (South), Pagoda Gazebo (East), Taiko Bashi (West)
  // - Central Grand Tiered Fountain with sparkling caustics, cascades, and parabolic jets
  // - Translucent fountain pool floor collision allowing knee-deep wading
  // - Instanced living grass field, sculpted trees, and cel-shaded sky dome
  // -------------------------------------------------------------
  console.log('[Shot 4] Framing sweeping high-angle overview of all park landmarks...');
  await page.evaluate(() => {
    const engine = window.__engine;
    if (engine) {
      engine.physics.reset(0, 0.98, 4.25);
      engine.physics.facingAngle = 0;
      engine.cameraRig.update = () => {
        // High South-East vantage point capturing Torii (foreground South), Fountain (center), Pagoda (right East), Bridge (left West)
        engine.cameraRig.camera.position.set(16, 28, 56);
        engine.cameraRig.camera.lookAt(0, 2.0, 10);
      };
    }
  });
  await page.waitForTimeout(1500);
  await captureCanvas('loop6-park-landmarks-overview.png');

  console.log('[Loop 6 Test] Closing browser and preview server...');
  await browser.close();
  spawn(`taskkill /pid ${server.pid} /T /F`, { shell: true });

  console.log('[Loop 6 Test] All 4 Loop 6 screenshots captured successfully!');
  process.exit(0);
}

main().catch((err) => {
  console.error('[Loop 6 Test Error]:', err);
  process.exit(1);
});
