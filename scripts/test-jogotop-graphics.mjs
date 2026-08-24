import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { analyzePngBuffer } from './lib/analyze-jogotop-frame.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'output', 'jogotop-v2', 'failures');

const PORT = 5199;
const SERVER_URL = `http://localhost:${PORT}/jogotop`;

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720, dpr: 1.5, quality: 'desktop' },
  { name: 'mobile-portrait', width: 390, height: 844, dpr: 2, quality: 'mobile' },
  { name: 'mobile-landscape', width: 844, height: 390, dpr: 2, quality: 'mobile' },
];

async function run() {
  console.log('=== Iniciando Teste Gráfico Automatizado JogoTop V2 ===');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Start Vite Server
  console.log(`Iniciando servidor Vite na porta ${PORT}...`);
  const server = await createServer({
    root: rootDir,
    server: {
      port: PORT,
      strictPort: true,
    },
  });
  await server.listen();

  let browser;
  let totalFramesChecked = 0;
  let totalFailures = 0;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--enable-webgl', '--use-gl=angle', '--use-angle=swiftshader'],
    });

    for (const vp of VIEWPORTS) {
      console.log(`\nTestando viewport: ${vp.name} (${vp.width}x${vp.height}, dpr=${vp.dpr})...`);

      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.dpr,
      });

      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      page.on('pageerror', (err) => {
        pageErrors.push(err.message);
      });

      const url = `${SERVER_URL}?graphicsTest=orbit&quality=${vp.quality}&renderer=v2`;
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

      // Wait for canvas to be mounted and ready
      const canvasHandle = await page.waitForSelector('canvas', { timeout: 10000 });
      if (!canvasHandle) {
        throw new Error(`Canvas element not found in viewport ${vp.name}`);
      }

      // Allow 1 second for initial render and loading dismissal
      await page.waitForTimeout(1000);

      const framesCount = 20;
      for (let f = 0; f < framesCount; f++) {
        await page.waitForTimeout(150); // ~3 seconds total animation
        const screenshotBuffer = await canvasHandle.screenshot({ type: 'png' });
        totalFramesChecked++;

        const analysis = analyzePngBuffer(screenshotBuffer);

        if (analysis.hasBlackArtifacts) {
          totalFailures++;
          const failFile = path.join(outputDir, `fail_${vp.name}_frame_${f}.png`);
          fs.writeFileSync(failFile, screenshotBuffer);
          console.error(
            `❌ [FALHA] Artefato preto detectado em ${vp.name} frame ${f}: ` +
              `maxComponentRatio=${(analysis.maxComponentRatio * 100).toFixed(2)}%, ` +
              `maxWidthSpan=${(analysis.maxWidthSpan * 100).toFixed(2)}%, ` +
              `maxHeightSpan=${(analysis.maxHeightSpan * 100).toFixed(2)}%. Salvo em ${failFile}`
          );
        }
      }

      if (consoleErrors.length > 0) {
        console.warn(`Avisos/Erros no console em ${vp.name}:`, consoleErrors);
      }
      if (pageErrors.length > 0) {
        totalFailures += pageErrors.length;
        console.error(`❌ Erros de página em ${vp.name}:`, pageErrors);
      }

      await context.close();
      console.log(`✓ Concluído ${vp.name}: ${framesCount} frames verificados sem artefatos.`);
    }
  } catch (err) {
    console.error('❌ Erro durante execução do teste:', err);
    totalFailures++;
  } finally {
    if (browser) await browser.close();
    await server.close();
  }

  console.log('\n======================================================');
  console.log(`Total de frames inspecionados: ${totalFramesChecked}`);
  console.log(`Total de falhas: ${totalFailures}`);
  console.log('======================================================\n');

  if (totalFailures > 0) {
    console.error('❌ O teste gráfico do JogoTop V2 FALHOU.');
    process.exit(1);
  } else {
    console.log('✅ O teste gráfico do JogoTop V2 PASSOU com 100% de sucesso!');
    process.exit(0);
  }
}

run();
