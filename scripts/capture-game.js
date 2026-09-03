#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    url: 'http://localhost:5000',
    selector: null,
    tab: null,
    output: null,
    wait: 1000,
    width: 1280,
    height: 800,
    clip: null,
    actions: [],
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--url' || arg === '-u') options.url = args[++i];
    else if (arg === '--selector' || arg === '-s') options.selector = args[++i];
    else if (arg === '--tab' || arg === '-t') options.tab = args[++i];
    else if (arg === '--output' || arg === '-o') options.output = args[++i];
    else if (arg === '--wait' || arg === '-w') options.wait = parseInt(args[++i], 10);
    else if (arg === '--viewport' || arg === '-v') {
      const [w, h] = args[++i].split('x').map(Number);
      if (w && h) {
        options.width = w;
        options.height = h;
      }
    } else if (arg === '--clip' || arg === '-c') {
      const [x, y, w, h] = args[++i].split(',').map(Number);
      options.clip = { x, y, width: w, height: h };
    } else if (arg === '--click') {
      options.actions.push({ type: 'click', selector: args[++i] });
    } else if (arg === '--press') {
      options.actions.push({ type: 'press', key: args[++i] });
    } else if (arg === '--eval') {
      options.actions.push({ type: 'eval', code: args[++i] });
    }
  }

  return options;
}

async function run() {
  const options = parseArgs();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const defaultDir = path.resolve(process.cwd(), 'output', 'screenshots');
  fs.mkdirSync(defaultDir, { recursive: true });

  const targetName = options.selector
    ? options.selector.replace(/[^a-zA-Z0-9_-]/g, '_')
    : (options.tab || 'view');

  const outputPath = options.output
    ? path.resolve(process.cwd(), options.output)
    : path.join(defaultDir, `capture-${targetName}-${timestamp}.png`);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  console.log(`[Gauntlet Capture] Iniciando captura...`);
  console.log(`- URL: ${options.url}`);
  if (options.tab) console.log(`- Tab alvo: ${options.tab}`);
  if (options.selector) console.log(`- Seletor do elemento: ${options.selector}`);
  console.log(`- Destino: ${outputPath}`);

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox'],
    });
  } catch (err) {
    browser = await chromium.launch({
      channel: 'msedge',
      headless: true,
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-webgl', '--no-sandbox'],
    });
  }

  const context = await browser.newContext({
    viewport: { width: options.width, height: options.height },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  try {
    await page.goto(options.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
  } catch (e) {
    console.warn(`[Gauntlet Capture] Aviso no goto: ${e.message}`);
  }

  // Switch tab if specified
  if (options.tab) {
    const tabName = options.tab.toLowerCase();
    let switched = false;

    // Check TabBar first
    const tabHeader = await page.$(`header div:has-text("${options.tab}"), header span:has-text("${options.tab}")`);
    if (tabHeader) {
      await tabHeader.click();
      switched = true;
    } else {
      // Check CoverPage card
      const card = await page.$(`div:has-text("${options.tab}"), h3:has-text("${options.tab}")`);
      if (card) {
        await card.click();
        switched = true;
      }
    }
    await page.waitForTimeout(500);
  }

  // Execute custom actions
  for (const act of options.actions) {
    if (act.type === 'click') {
      console.log(`[Action] Clicando em '${act.selector}'...`);
      try {
        await page.waitForSelector(act.selector, { timeout: 4000 });
        await page.click(act.selector);
      } catch (err) {
        console.warn(`[Action] Não encontrou seletor de clique '${act.selector}'. Tentando avaliar texto...`);
        await page.evaluate((text) => {
          const match = Array.from(document.querySelectorAll('button, div, h3, a')).find(
            el => el.textContent && el.textContent.includes(text)
          );
          if (match) match.click();
        }, act.selector);
      }
    } else if (act.type === 'press') {
      console.log(`[Action] Pressionando tecla '${act.key}'...`);
      await page.keyboard.press(act.key);
    } else if (act.type === 'eval') {
      console.log(`[Action] Executando script na página...`);
      await page.evaluate(act.code);
    }
    await page.waitForTimeout(250);
  }

  if (options.wait > 0) {
    await page.waitForTimeout(options.wait);
  }

  // Capture
  if (options.selector) {
    console.log(`[Gauntlet Capture] Aguardando elemento '${options.selector}'...`);
    await page.waitForSelector(options.selector, { timeout: 10000 });
    const element = await page.$(options.selector);
    if (!element) {
      throw new Error(`Elemento '${options.selector}' não encontrado.`);
    }
    await element.screenshot({ path: outputPath });
    console.log(`[Gauntlet Capture] ✅ Elemento capturado com sucesso!`);
  } else if (options.clip) {
    console.log(`[Gauntlet Capture] Capturando recorte...`);
    await page.screenshot({ path: outputPath, clip: options.clip });
    console.log(`[Gauntlet Capture] ✅ Recorte capturado com sucesso!`);
  } else {
    console.log(`[Gauntlet Capture] Capturando viewport completo...`);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`[Gauntlet Capture] ✅ Viewport capturado com sucesso!`);
  }

  await browser.close();

  console.log(`\n=========================================`);
  console.log(`CAPTURED_IMAGE_PATH=${outputPath}`);
  console.log(`=========================================\n`);
  return outputPath;
}

run().catch((err) => {
  console.error(`[Gauntlet Capture Error]:`, err);
  process.exit(1);
});