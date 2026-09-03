import * as THREE from 'three';

interface TextureOptions {
  width?: number;
  height?: number;
  repeatX?: number;
  repeatY?: number;
}

/**
 * Creates an in-memory HTML5 Canvas element if supported, or null in headless/SSR environments.
 */
function createOffscreenCanvas(width: number, height: number): HTMLCanvasElement | null {
  if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  return null;
}

/**
 * Fallback 1x1 white DataTexture when running in non-DOM test environments.
 */
function createFallbackTexture(): THREE.DataTexture {
  const data = new Uint8Array([255, 255, 255, 255]);
  const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Procedural Micro-Weave Fabric Texture (Trama Têxtil de Malha / Moletom Esportivo)
 * - Micro-interlaced warp and weft yarn matrix.
 * - Gentle luminance contrast (~0.88 to 1.0) centered on high brightness so multiplying
 *   with cel-shaded toon base colors preserves radiant hue while adding tactile knitted depth.
 * - 100% seamless tileable wrap.
 */
export function createFabricTexture(options: TextureOptions = {}): THREE.Texture {
  const width = options.width || 256;
  const height = options.height || 256;
  const repeatX = options.repeatX || 10;
  const repeatY = options.repeatY || 10;

  const canvas = createOffscreenCanvas(width, height);
  if (!canvas) return createFallbackTexture();

  const ctx = canvas.getContext('2d');
  if (!ctx) return createFallbackTexture();

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const threadSize = 8; // 8x8 pixels per thread weave cell (32x32 threads across 256x256)

  for (let y = 0; y < height; y++) {
    const gy = Math.floor(y / threadSize);
    const py = (y % threadSize) / threadSize; // 0..1 in thread

    for (let x = 0; x < width; x++) {
      const gx = Math.floor(x / threadSize);
      const px = (x % threadSize) / threadSize; // 0..1 in thread

      const idx = (y * width + x) * 4;
      const isHorizontal = (gx + gy) % 2 === 0;

      let threadArch: number;
      let crossDist: number;

      if (isHorizontal) {
        // Horizontal yarn passing over vertical yarn
        threadArch = Math.sin(px * Math.PI); // arch along length
        crossDist = Math.sin(py * Math.PI);  // curve across diameter
      } else {
        // Vertical yarn passing over horizontal yarn
        threadArch = Math.sin(py * Math.PI);
        crossDist = Math.sin(px * Math.PI);
      }

      // Height profile of the rounded thread crown
      const threadHeight = threadArch * 0.35 + crossDist * 0.65;

      // Base luminance: 226 in crevices up to 255 at yarn crown
      let luma = 224 + threadHeight * 28;

      // Subtle organic yarn micro-fuzz / fiber noise
      const fuzz = ((x * 37 + y * 59) % 17 - 8) * 0.8;
      luma = Math.max(212, Math.min(255, Math.round(luma + fuzz)));

      data[idx] = luma;
      data[idx + 1] = Math.min(255, luma + 1); // very faint crisp freshness
      data[idx + 2] = luma;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return texture;
}

/**
 * Procedural Denim Twill Texture (Trama Diagonal de Jeans Índigo Autêntico)
 * - 3x1 Right-Hand Twill diagonal ridges at 45 degrees.
 * - Alternating indigo warp ridges and subtle ecru weft cross-flecks.
 * - Horizontal slub yarn variations mimicking genuine denim wash.
 * - Seamless 256x256 repeating tile.
 */
export function createDenimTexture(options: TextureOptions = {}): THREE.Texture {
  const width = options.width || 256;
  const height = options.height || 256;
  const repeatX = options.repeatX || 8;
  const repeatY = options.repeatY || 8;

  const canvas = createOffscreenCanvas(width, height);
  if (!canvas) return createFallbackTexture();

  const ctx = canvas.getContext('2d');
  if (!ctx) return createFallbackTexture();

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const twillStep = 8; // Period of diagonal twill ridge

  for (let y = 0; y < height; y++) {
    // Subtle horizontal slub variation across rows
    const slub = Math.sin(y * 0.15) * 4 + ((y * 13) % 7 - 3) * 1.5;

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // 45-degree diagonal coordinate
      const diag = (x + y) % twillStep;
      const diagNorm = diag / twillStep;

      // Distinctive twill ridge: sharp rise and rounded top
      const ridge = Math.sin(diagNorm * Math.PI * 2);

      // Weft cross fleck (ecru yarn dipping under every 4 pixels)
      const weftCrossing = ((x - y * 2 + 1024) % 16 < 3) ? 14 : 0;

      // Luminance curve: base ~218, peak ~252
      let luma = 228 + ridge * 18 + weftCrossing + slub;
      luma = Math.max(205, Math.min(255, Math.round(luma)));

      data[idx] = luma - 2; // subtle cool denim balance
      data[idx + 1] = luma;
      data[idx + 2] = Math.min(255, luma + 3);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return texture;
}

/**
 * Procedural Pebbled Leather Texture (Grão de Couro de Brawler / Sneaker Upper & Luvas de Combate)
 * - Cellular Voronoi pebbled grain with seamless toroidal boundary wrapping.
 * - Smooth rounded pebble domes with deep valley crease shadows and micro-pore stippling.
 * - Seamless 256x256 repeating tile.
 */
export function createLeatherTexture(options: TextureOptions = {}): THREE.Texture {
  const width = options.width || 256;
  const height = options.height || 256;
  const repeatX = options.repeatX || 4;
  const repeatY = options.repeatY || 4;

  const canvas = createOffscreenCanvas(width, height);
  if (!canvas) return createFallbackTexture();

  const ctx = canvas.getContext('2d');
  if (!ctx) return createFallbackTexture();

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  // 16x16 grid of jittered Voronoi cell seeds
  const gridSize = 16;
  const cellWidth = width / gridSize;
  const cellHeight = height / gridSize;

  // Deterministic seed offsets
  const seeds: [number, number][] = [];
  for (let gy = 0; gy < gridSize; gy++) {
    for (let gx = 0; gx < gridSize; gx++) {
      // Deterministic pseudo-random offset inside [0.15, 0.85]
      const hash = Math.sin(gx * 12.9898 + gy * 78.233) * 43758.5453;
      const jx = 0.18 + (hash - Math.floor(hash)) * 0.64;
      const hash2 = Math.sin((gx + 17) * 93.9898 + (gy + 31) * 67.233) * 24634.6345;
      const jy = 0.18 + (hash2 - Math.floor(hash2)) * 0.64;

      seeds[gy * gridSize + gx] = [
        (gx + jx) * cellWidth,
        (gy + jy) * cellHeight,
      ];
    }
  }

  for (let y = 0; y < height; y++) {
    const gy = Math.floor(y / cellHeight);

    for (let x = 0; x < width; x++) {
      const gx = Math.floor(x / cellWidth);

      // Search 3x3 neighbor cells with toroidal wrapping
      let d1 = 999999;
      let d2 = 999999;

      for (let oy = -1; oy <= 1; oy++) {
        const ngy = (gy + oy + gridSize) % gridSize;
        for (let ox = -1; ox <= 1; ox++) {
          const ngx = (gx + ox + gridSize) % gridSize;
          const seed = seeds[ngy * gridSize + ngx];

          // Compute wrapped toroidal delta
          let dx = Math.abs(x - seed[0]);
          if (dx > width * 0.5) dx = width - dx;

          let dy = Math.abs(y - seed[1]);
          if (dy > height * 0.5) dy = height - dy;

          const distSq = dx * dx + dy * dy;
          if (distSq < d1) {
            d2 = d1;
            d1 = distSq;
          } else if (distSq < d2) {
            d2 = distSq;
          }
        }
      }

      d1 = Math.sqrt(d1);
      d2 = Math.sqrt(d2);

      // Edge valley border width
      const edge = Math.max(0, Math.min(1, (d2 - d1) / (cellWidth * 0.32)));

      // Dome elevation of the leather pebble
      const dome = Math.cos(Math.min(Math.PI * 0.5, (d1 / (cellWidth * 0.65)) * Math.PI * 0.5));

      // Micro-pore stippling
      const pore = ((x * 47 + y * 73) % 19 - 9) * 0.5;

      // Blend pebble dome highlight with crease shadow
      let luma = 214 + edge * 24 + dome * 14 + pore;
      luma = Math.max(208, Math.min(255, Math.round(luma)));

      const idx = (y * width + x) * 4;
      data[idx] = luma;
      data[idx + 1] = luma;
      data[idx + 2] = luma;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return texture;
}

/**
 * Procedural Rubber Sole Grip Texture (Padrão de Sola de Borracha Antiderrapante)
 * - Diamond-knurl / cross-hatch vulcanized tread lugs.
 * - Deep recessed grip sipes / traction grooves with shadow crevice.
 * - Matte rubber micro-stippling on raised contact surfaces.
 * - Seamless 256x256 repeating tile.
 */
export function createRubberSoleTexture(options: TextureOptions = {}): THREE.Texture {
  const width = options.width || 256;
  const height = options.height || 256;
  const repeatX = options.repeatX || 6;
  const repeatY = options.repeatY || 6;

  const canvas = createOffscreenCanvas(width, height);
  if (!canvas) return createFallbackTexture();

  const ctx = canvas.getContext('2d');
  if (!ctx) return createFallbackTexture();

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const diamondPitch = 16; // 16x16 pixel diamond grid

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Rotated 45-degree diamond axes
      const u = (x + y) % diamondPitch;
      const v = (x - y + 1024) % diamondPitch;

      const normU = Math.abs(u - diamondPitch * 0.5) / (diamondPitch * 0.5);
      const normV = Math.abs(v - diamondPitch * 0.5) / (diamondPitch * 0.5);

      // Distance to diamond border (tread groove)
      const borderDist = Math.min(normU, normV);

      // Diamond lug center height
      const lugHeight = Math.pow(Math.max(0, 1.0 - (1.0 - normU) * (1.0 - normV)), 0.7);

      // Stippling for matte vulcanized rubber grip
      const rubberGrain = ((x * 61 + y * 89) % 23 - 11) * 0.6;

      let luma: number;
      if (borderDist < 0.16) {
        // Deep groove shadow
        luma = 202 + borderDist * 60;
      } else {
        // Raised tread lug with non-slip stippling
        luma = 232 + lugHeight * 20 + rubberGrain;
      }

      luma = Math.max(198, Math.min(255, Math.round(luma)));

      data[idx] = luma;
      data[idx + 1] = luma;
      data[idx + 2] = luma;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return texture;
}
