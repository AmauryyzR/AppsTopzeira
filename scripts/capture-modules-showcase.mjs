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
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();
  await page.goto('http://localhost:5000/models', { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(2000);

  const selectModel = async (modelId, delay = 600) => {
    await page.evaluate((id) => {
      const select = document.querySelector('select');
      if (select) {
        select.value = id;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, modelId);
    await page.waitForTimeout(delay);
  };

  // 1. Module Leaf
  console.log('Capturing Module Leaf...');
  await selectModel('module-leaf');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'showcase_module_leaf.png') });

  // 2. Module Sprig
  console.log('Capturing Module Sprig...');
  await selectModel('module-sprig');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'showcase_module_sprig.png') });

  // 3. Module Branch
  console.log('Capturing Module Branch...');
  await selectModel('module-branch');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'showcase_module_branch.png') });

  // 4. Module Trunk
  console.log('Capturing Module Trunk...');
  await selectModel('module-trunk');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'showcase_module_trunk.png') });

  await browser.close();
  console.log('All modular showcases captured successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
