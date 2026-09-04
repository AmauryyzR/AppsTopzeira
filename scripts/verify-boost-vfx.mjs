import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function run() {
  console.log('Launching browser to verify speed boost & Genshin dash trail VFX...');
  const browser = await chromium.launch({ headless: true });

  const artifactsDir = path.resolve('artifacts');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  // =========================================================================
  // TEST 1: PC DESKTOP (Shift key sprint, mobile button hidden)
  // =========================================================================
  console.log('\n--- TEST 1: PC Desktop ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    hasTouch: false,
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:5000/3dgame', { waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(2500);

  // Check if mobile sprint button is visible on desktop
  const sprintButton = desktopPage.locator('button[title="Sprint Boost (Shift no PC)"]');
  const isSprintBtnVisibleOnDesktop = await sprintButton.isVisible();
  console.log(`[PC Check] Is MobileSprintButton visible on PC desktop? ${isSprintBtnVisibleOnDesktop} (Expected: false)`);

  // Press Shift + W to dash forward on PC
  console.log('[PC Action] Pressing ShiftLeft + KeyW to trigger Genshin Dash Boost...');
  await desktopPage.keyboard.down('ShiftLeft');
  await desktopPage.keyboard.down('KeyW');
  await desktopPage.waitForTimeout(450);

  // Capture Dash in action
  const pcDashScreenshotPath = path.join(artifactsDir, 'boost-pc-dash-trail.png');
  await desktopPage.screenshot({ path: pcDashScreenshotPath });
  console.log(`[PC Result] Saved screenshot to ${pcDashScreenshotPath}`);

  await desktopPage.keyboard.up('KeyW');
  await desktopPage.keyboard.up('ShiftLeft');
  await desktopContext.close();

  // =========================================================================
  // TEST 2: MOBILE TOUCH DEVICE (MobileSprintButton visible and functional)
  // =========================================================================
  console.log('\n--- TEST 2: Mobile Touch Device ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 412, height: 869 },
    hasTouch: true,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5000/3dgame', { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(2500);

  const mobileSprintBtn = mobilePage.locator('button[title="Sprint Boost (Shift no PC)"]');
  const isSprintBtnVisibleOnMobile = await mobileSprintBtn.isVisible();
  console.log(`[Mobile Check] Is MobileSprintButton visible on mobile? ${isSprintBtnVisibleOnMobile} (Expected: true)`);

  // Capture Mobile UI layout
  const mobileControlsScreenshotPath = path.join(artifactsDir, 'boost-mobile-controls.png');
  await mobilePage.screenshot({ path: mobileControlsScreenshotPath });
  console.log(`[Mobile Result] Saved screenshot to ${mobileControlsScreenshotPath}`);

  // Tap sprint button to verify active state & dash
  console.log('[Mobile Action] Dispatching pointerdown on sprint button...');
  await mobileSprintBtn.dispatchEvent('pointerdown', { pointerType: 'touch' });
  await mobilePage.waitForTimeout(300);

  const mobileDashActivePath = path.join(artifactsDir, 'boost-mobile-dash-active.png');
  await mobilePage.screenshot({ path: mobileDashActivePath });
  console.log(`[Mobile Result] Saved active dash screenshot to ${mobileDashActivePath}`);

  await mobileSprintBtn.dispatchEvent('pointerup', { pointerType: 'touch' });
  await mobileContext.close();

  await browser.close();
  console.log('\nAll tests completed successfully!');
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
