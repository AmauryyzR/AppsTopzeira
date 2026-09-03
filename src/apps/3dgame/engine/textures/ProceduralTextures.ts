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

/**
 * High-Resolution Procedural Anime Face Texture for Leon (1024x1024)
 * - Buttery-smooth vector antialiased anime eyes with vibrant cyan caustic irises and double star catchlights.
 * - Confident brawler eyebrows and expressive smirk holding the lollipop.
 * - Soft peach skin tone with gentle cheek blush and natural hood shadow gradient.
 * - 100% elimination of 3D polygonal clipping and mesh fragmentation on the face.
 */
export function createLeonFaceTexture(options: TextureOptions = {}): THREE.Texture {
  const width = options.width || 1024;
  const height = options.height || 1024;

  const canvas = createOffscreenCanvas(width, height);
  if (!canvas) return createFallbackTexture();

  const ctx = canvas.getContext('2d');
  if (!ctx) return createFallbackTexture();

  // 1. Oval Anime Face Mask (eliminates square plane corners and lets 3D sphere frame naturally)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(512, 530, 430, 460, 0, 0, Math.PI * 2);
  ctx.clip();

  // Warm rich brawler skin tone (rich peach with golden anime glow, doesn't wash out under bright lights!)
  const skinGrad = ctx.createLinearGradient(0, 80, 0, height);
  skinGrad.addColorStop(0, '#fca574');
  skinGrad.addColorStop(0.25, '#fdb992');
  skinGrad.addColorStop(0.65, '#fdb082');
  skinGrad.addColorStop(1, '#f87171');
  ctx.fillStyle = skinGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Soft Ambient Shadow Gradient from Hood Overhang (Top Forehead)
  const hoodShadowGrad = ctx.createLinearGradient(0, 0, 0, height * 0.40);
  hoodShadowGrad.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
  hoodShadowGrad.addColorStop(0.65, 'rgba(15, 23, 42, 0.15)');
  hoodShadowGrad.addColorStop(1, 'rgba(15, 23, 42, 0.0)');
  ctx.fillStyle = hoodShadowGrad;
  ctx.fillRect(0, 0, width, height * 0.40);

  // 3. Cute Anime Rosy Cheek Blush
  const drawBlush = (cx: number, cy: number) => {
    const blushGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120);
    blushGrad.addColorStop(0, 'rgba(244, 63, 94, 0.52)');
    blushGrad.addColorStop(0.55, 'rgba(244, 63, 94, 0.24)');
    blushGrad.addColorStop(1, 'rgba(244, 63, 94, 0.0)');
    ctx.fillStyle = blushGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 120, 0, Math.PI * 2);
    ctx.fill();

    // Subtle anime blush parallel accent streaks
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.60)';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * 24 - 14, cy - 16);
      ctx.lineTo(cx + i * 24 + 14, cy + 16);
      ctx.stroke();
    }
  };
  drawBlush(260, 625);
  drawBlush(764, 625);

  // 4. Large, Expressive Anime Hero Eyes
  const drawAnimeEye = (cx: number, cy: number, isLeft: boolean) => {
    const eyeW = 135;
    const eyeH = 112;

    // --- Sclera (White base with soft upper sky shadow) ---
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx - eyeW * 0.55, cy + 12);
    ctx.bezierCurveTo(cx - eyeW * 0.35, cy - eyeH * 0.65, cx + eyeW * 0.35, cy - eyeH * 0.65, cx + eyeW * 0.55, cy + 12);
    ctx.bezierCurveTo(cx + eyeW * 0.35, cy + eyeH * 0.48, cx - eyeW * 0.35, cy + eyeH * 0.48, cx - eyeW * 0.55, cy + 12);
    ctx.closePath();

    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Upper sclera shadow
    const scleraShadow = ctx.createLinearGradient(0, cy - eyeH * 0.60, 0, cy + 5);
    scleraShadow.addColorStop(0, 'rgba(100, 116, 139, 0.55)');
    scleraShadow.addColorStop(1, 'rgba(100, 116, 139, 0.0)');
    ctx.fillStyle = scleraShadow;
    ctx.fill();

    // Clip to eye opening for iris rendering
    ctx.clip();

    // --- Vibrant Multi-Tone Cyan Iris ---
    const irisR = 52;
    const irisY = cy + 2;
    ctx.beginPath();
    ctx.ellipse(cx, irisY, irisR * 0.88, irisR, 0, 0, Math.PI * 2);

    const irisGrad = ctx.createLinearGradient(0, irisY - irisR, 0, irisY + irisR);
    irisGrad.addColorStop(0, '#0369a1');     // Deep navy cyan
    irisGrad.addColorStop(0.35, '#0284c7');  // Royal cyan
    irisGrad.addColorStop(0.70, '#06b6d4');  // Bright turquoise
    irisGrad.addColorStop(0.92, '#38bdf8');  // Electric cyan
    irisGrad.addColorStop(1, '#e0f2fe');     // Radiant highlight base
    ctx.fillStyle = irisGrad;
    ctx.fill();

    // Limbal ring outer contrast
    ctx.lineWidth = 5.5;
    ctx.strokeStyle = '#082f49';
    ctx.stroke();

    // Lower Caustic Crescent Glow
    ctx.beginPath();
    ctx.ellipse(cx, irisY + 18, irisR * 0.70, irisR * 0.35, 0, 0, Math.PI);
    ctx.fillStyle = 'rgba(186, 230, 253, 0.75)';
    ctx.fill();

    // Obsidian Anime Pupil
    ctx.beginPath();
    ctx.ellipse(cx, irisY - 4, 24, 32, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#090d16';
    ctx.fill();

    // Double Catchlight Highlights
    // Primary large crisp circular highlight
    ctx.beginPath();
    ctx.arc(cx + (isLeft ? 15 : 12), irisY - 14, 13, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Secondary soft circular highlight
    ctx.beginPath();
    ctx.arc(cx - (isLeft ? 14 : 16), irisY + 16, 7.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.fill();

    // Diamond twinkle star
    ctx.beginPath();
    ctx.arc(cx - 3, irisY - 22, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore(); // Restore clip

    // --- Thick Upper Eyeliner with Confident Anime Wing ---
    ctx.save();
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    const x0 = cx - eyeW * 0.58;
    const x1 = cx + eyeW * 0.58;
    const yMid = cy - eyeH * 0.62;

    ctx.moveTo(x0, cy + 12);
    ctx.quadraticCurveTo(cx, yMid - 6, x1, cy + 6);
    ctx.stroke();

    // Cat-eye wing flick
    const wingDir = isLeft ? -1 : 1;
    const outerX = isLeft ? x0 : x1;
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.moveTo(outerX, cy + (isLeft ? 12 : 6));
    ctx.lineTo(outerX + wingDir * 20, cy - 8);
    ctx.lineTo(outerX - wingDir * 12, cy - 14);
    ctx.closePath();
    ctx.fill();

    // Subtle Lower Eyelid Accent Line
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy + 26, 40, isLeft ? 0.35 * Math.PI : 0.45 * Math.PI, isLeft ? 0.55 * Math.PI : 0.65 * Math.PI);
    ctx.stroke();

    ctx.restore();

    // --- Confident Hero Eyebrows ---
    ctx.save();
    ctx.strokeStyle = '#082f49';
    ctx.lineWidth = 8.5;
    ctx.lineCap = 'round';

    ctx.beginPath();
    const browY = cy - 88;
    if (isLeft) {
      ctx.moveTo(cx - 56, browY + 8);
      ctx.quadraticCurveTo(cx - 10, browY - 14, cx + 52, browY + 2);
    } else {
      ctx.moveTo(cx - 52, browY + 2);
      ctx.quadraticCurveTo(cx + 10, browY - 14, cx + 56, browY + 8);
    }
    ctx.stroke();
    ctx.restore();
  };

  drawAnimeEye(360, 485, true);
  drawAnimeEye(664, 485, false);

  // 5. Cute Confident Brawler Smirk / Smile (Right Corner Upturn for Lollipop)
  ctx.save();
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 7.5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(465, 680);
  ctx.quadraticCurveTo(525, 712, 600, 672);
  ctx.stroke();

  // Smirk corner tick
  ctx.beginPath();
  ctx.lineWidth = 5.5;
  ctx.moveTo(595, 676);
  ctx.lineTo(610, 664);
  ctx.stroke();

  // Subtle dark-pink lower lip curve
  ctx.strokeStyle = 'rgba(225, 29, 72, 0.45)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(530, 715, 26, 0.22 * Math.PI, 0.78 * Math.PI);
  ctx.stroke();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return texture;
}

