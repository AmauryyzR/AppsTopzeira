import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/amaur/.gemini/antigravity-ide/brain/7699239c-6636-4021-b925-22f0d3eade53';

async function run() {
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();
  await page.goto('http://localhost:5000/models', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const setView = async (cam, tgt, delay = 400) => {
    await page.evaluate(({ c, t }) => {
      window.__studioEngine?.setCameraView(c, t);
    }, { c: cam, t: tgt });
    await page.waitForTimeout(delay);
  };

  const setShading = async (mode) => {
    await page.evaluate((m) => {
      window.__studioEngine?.setShadingMode(m);
    }, mode);
    await page.waitForTimeout(300);
  };

  // 1. Full Elevation Front (Side silhouette)
  await setView({ x: 0, y: 4.8, z: 12.0 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_01_elevation_front.png'), timeout: 8000 });

  // 2. Full Elevation Side (East)
  await setView({ x: 12.0, y: 4.8, z: 0 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_02_elevation_east.png'), timeout: 8000 });

  // 3. Top Down (Aerial crown view)
  await setView({ x: 0.1, y: 14.0, z: 0.1 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_03_aerial_crown.png'), timeout: 8000 });

  // 4. Under-Canopy: Branch Junctions & Sockets (Zoomed looking up)
  await setView({ x: 1.0, y: 2.2, z: 1.8 }, { x: 0.1, y: 4.2, z: -0.1 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_04_under_canopy_junctions.png'), timeout: 8000 });

  // 5. Roots & Buttress Close-up (Ground level)
  await setView({ x: 3.0, y: 0.8, z: 2.5 }, { x: 0.2, y: 0.4, z: 0.1 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_05_roots_ground_detail.png'), timeout: 8000 });

  // 6. Branch tips and leaf attachments close-up
  await setView({ x: 2.8, y: 5.2, z: 2.0 }, { x: 1.6, y: 4.9, z: 1.0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_06_branch_leaf_attachment.png'), timeout: 8000 });

  // 7. CLAY MODE: Full Tree
  await setShading('clay');
  await setView({ x: 8.5, y: 5.5, z: 8.5 }, { x: 0, y: 4.5, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_07_clay_isometric.png'), timeout: 8000 });

  // 8. CLAY MODE: Branch Sockets Underneath
  await setView({ x: 1.2, y: 2.4, z: 1.6 }, { x: 0.1, y: 4.2, z: 0.1 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_08_clay_junctions.png'), timeout: 8000 });

  // 9. WIREFRAME MODE: Topology and Overlap Analysis
  await setShading('wireframe');
  await setView({ x: 7.0, y: 4.5, z: 7.0 }, { x: 0, y: 4.2, z: 0 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_09_wireframe_topology.png'), timeout: 8000 });

  // 10. WIREFRAME MODE: Roots and Trunk Topology
  await setView({ x: 2.6, y: 1.2, z: 2.6 }, { x: 0.1, y: 1.0, z: 0.1 });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_10_wireframe_roots.png'), timeout: 8000 });

  await browser.close();
  console.log('Deep audit captures finished successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
