import * as THREE from 'three';

/**
 * Procedural texture generators for SharkAnimestyle.
 * Includes defensive fallback for headless / Node.js environments.
 */

function createSafeCanvas(width: number, height: number): HTMLCanvasElement | null {
  if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext ? canvas.getContext('2d') : null;
      if (ctx && typeof ctx.fillRect === 'function' && typeof ctx.createImageData === 'function') {
        canvas.width = width;
        canvas.height = height;
        return canvas;
      }
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Creates the Kangaroo Pocket Shark-Wave graphic texture.
 * Features a slate-blue shark silhouette with a cresting white wave belly and black eye.
 */
export function createPocketSharkTexture(): THREE.CanvasTexture | THREE.DataTexture {
  const width = 512;
  const height = 512;
  const canvas = createSafeCanvas(width, height);

  if (!canvas) {
    // Headless / Node fallback
    const data = new Uint8Array(width * height * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 20;     // R
      data[i + 1] = 20; // G
      data[i + 2] = 22; // B
      data[i + 3] = 255;
    }
    const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
  }

  const ctx = canvas.getContext('2d')!;

  // 1. Dark matte hoodie background (#18191c)
  ctx.fillStyle = '#18191c';
  ctx.fillRect(0, 0, width, height);

  // 2. Slate-Blue shark silhouette body (#537593)
  ctx.fillStyle = '#537593';
  ctx.beginPath();
  ctx.moveTo(80, 420);
  ctx.bezierCurveTo(80, 240, 180, 120, 340, 140);
  ctx.bezierCurveTo(420, 150, 470, 200, 470, 280);
  ctx.bezierCurveTo(470, 360, 400, 440, 260, 440);
  ctx.bezierCurveTo(160, 440, 80, 430, 80, 420);
  ctx.closePath();
  ctx.fill();

  // 3. Cresting White wave belly (#f2f5f8)
  ctx.fillStyle = '#f2f5f8';
  ctx.beginPath();
  ctx.moveTo(80, 420);
  ctx.bezierCurveTo(140, 400, 180, 320, 240, 320);
  ctx.bezierCurveTo(290, 320, 310, 370, 360, 370);
  ctx.bezierCurveTo(420, 370, 450, 300, 470, 280);
  ctx.bezierCurveTo(440, 380, 380, 440, 260, 440);
  ctx.bezierCurveTo(160, 440, 80, 430, 80, 420);
  ctx.closePath();
  ctx.fill();

  // 4. Shark Eye: glossy black pupil (#111113) with small white highlight
  ctx.fillStyle = '#111113';
  ctx.beginPath();
  ctx.arc(380, 200, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(386, 194, 6, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates the Sleeve Wave/Fin graphic texture.
 * Dynamic wave motif cutting diagonally across the bicep and forearm.
 */
export function createSleeveWaveTexture(): THREE.CanvasTexture | THREE.DataTexture {
  const width = 512;
  const height = 512;
  const canvas = createSafeCanvas(width, height);

  if (!canvas) {
    const data = new Uint8Array(width * height * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 22;
      data[i + 1] = 22;
      data[i + 2] = 25;
      data[i + 3] = 255;
    }
    const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
  }

  const ctx = canvas.getContext('2d')!;

  // 1. Black sleeve base
  ctx.fillStyle = '#18191c';
  ctx.fillRect(0, 0, width, height);

  // 2. Slate blue wave band
  ctx.fillStyle = '#537593';
  ctx.beginPath();
  ctx.moveTo(0, 200);
  ctx.bezierCurveTo(150, 160, 250, 300, 512, 180);
  ctx.lineTo(512, 360);
  ctx.bezierCurveTo(320, 440, 160, 320, 0, 380);
  ctx.closePath();
  ctx.fill();

  // 3. Crisp white wave crest
  ctx.fillStyle = '#f2f5f8';
  ctx.beginPath();
  ctx.moveTo(0, 200);
  ctx.bezierCurveTo(150, 160, 250, 300, 512, 180);
  ctx.lineTo(512, 230);
  ctx.bezierCurveTo(280, 330, 180, 220, 0, 260);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates subtle fabric weave normal/bump map.
 */
export function createFabricBumpTexture(): THREE.CanvasTexture | THREE.DataTexture {
  const size = 256;
  const canvas = createSafeCanvas(size, size);

  if (!canvas) {
    const data = new Uint8Array(size * size * 4);
    data.fill(128);
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
  }

  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const v = ((x % 4 < 2) !== (y % 4 < 2)) ? 140 : 115;
      data[idx] = v;
      data[idx + 1] = v;
      data[idx + 2] = v;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.needsUpdate = true;
  return texture;
}
