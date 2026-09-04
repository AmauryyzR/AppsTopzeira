import * as THREE from 'three';
import { fbm3D, simplex3D } from './Noise';

export interface PBRTextureSet {
  map: THREE.CanvasTexture;
  normalMap?: THREE.CanvasTexture;
  roughnessMap?: THREE.CanvasTexture;
}

/**
 * Converts a grayscale height buffer to a Tangent-Space Normal Map using a 3x3 Sobel filter.
 */
export function createNormalMapFromHeight(
  heights: Float32Array,
  width: number,
  height: number,
  strength = 3.0
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const getHeight = (x: number, y: number): number => {
    const wrappedX = (x + width) % width;
    const wrappedY = (y + height) % height;
    return heights[wrappedY * width + wrappedX];
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // 3x3 Sobel kernel sampling
      const tl = getHeight(x - 1, y - 1);
      const tm = getHeight(x, y - 1);
      const tr = getHeight(x + 1, y - 1);
      const ml = getHeight(x - 1, y);
      const mr = getHeight(x + 1, y);
      const bl = getHeight(x - 1, y + 1);
      const bm = getHeight(x, y + 1);
      const br = getHeight(x + 1, y + 1);

      // Horizontal and vertical gradients
      const dx = (tr + 2 * mr + br) - (tl + 2 * ml + bl);
      const dy = (bl + 2 * bm + br) - (tl + 2 * tm + tr);
      const dz = 1.0 / Math.max(0.1, strength);

      // Normalize vector
      const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const nx = -dx / len;
      const ny = -dy / len;
      const nz = dz / len;

      // Map from [-1, 1] to [0, 255] RGB
      const idx = (y * width + x) * 4;
      data[idx] = Math.floor(((nx + 1) * 0.5) * 255);     // Red (X)
      data[idx + 1] = Math.floor(((ny + 1) * 0.5) * 255); // Green (Y)
      data[idx + 2] = Math.floor(((nz + 1) * 0.5) * 255); // Blue (Z)
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generates high-detail Procedural Bark PBR Textures (Color, Normal, Roughness)
 */
export function createProceduralBarkTextures(size = 512): PBRTextureSet {
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext('2d')!;
  const colorData = colorCtx.createImageData(size, size);

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const roughCtx = roughCanvas.getContext('2d')!;
  const roughData = roughCtx.createImageData(size, size);

  const heightBuffer = new Float32Array(size * size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * 4.0;
      const v = (y / size) * 16.0; // Anisotropic stretch for vertical bark fibers

      // Bark noise with directional stretch
      const n1 = fbm3D(u, v * 0.25, 0.0, 5, 2.2, 0.55);
      const fissure = Math.pow(Math.abs(simplex3D(u * 2.0, v * 0.1, 1.2)), 1.5);
      const detail = 0.2 * simplex3D(u * 12.0, v * 2.0, 3.4);

      const h = Math.max(0, Math.min(1, 0.5 + 0.4 * n1 - 0.45 * fissure + detail));
      heightBuffer[y * size + x] = h;

      // Color gradation (warm dark bark to lighter weathered ridges)
      const r = Math.floor(45 + h * 55 + (Math.random() * 6 - 3));
      const g = Math.floor(28 + h * 42 + (Math.random() * 4 - 2));
      const b = Math.floor(18 + h * 28 + (Math.random() * 3 - 1));

      const idx = (y * size + x) * 4;
      colorData.data[idx] = r;
      colorData.data[idx + 1] = g;
      colorData.data[idx + 2] = b;
      colorData.data[idx + 3] = 255;

      // Roughness (fissures are rougher, ridges slightly smoother)
      const rough = Math.floor(160 + (1 - h) * 85);
      roughData.data[idx] = rough;
      roughData.data[idx + 1] = rough;
      roughData.data[idx + 2] = rough;
      roughData.data[idx + 3] = 255;
    }
  }

  colorCtx.putImageData(colorData, 0, 0);
  roughCtx.putImageData(roughData, 0, 0);

  const colorTexture = new THREE.CanvasTexture(colorCanvas);
  colorTexture.wrapS = THREE.RepeatWrapping;
  colorTexture.wrapT = THREE.RepeatWrapping;

  const roughTexture = new THREE.CanvasTexture(roughCanvas);
  roughTexture.wrapS = THREE.RepeatWrapping;
  roughTexture.wrapT = THREE.RepeatWrapping;

  const normalTexture = createNormalMapFromHeight(heightBuffer, size, size, 4.5);

  return {
    map: colorTexture,
    normalMap: normalTexture,
    roughnessMap: roughTexture,
  };
}

/**
 * Generates Procedural Stylized Leaf / Foliage Texture
 */
export function createProceduralFoliageTexture(size = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Seamless 4D torus projection into 3D FBM noise space
      const angleX = (x / size) * Math.PI * 2;
      const angleY = (y / size) * Math.PI * 2;
      const nx = Math.cos(angleX) * 1.5;
      const ny = Math.sin(angleX) * 1.5;
      const nz = Math.cos(angleY) * 1.5;
      const nw = Math.sin(angleY) * 1.5;

      const n1 = fbm3D(nx, ny, nz, 4);
      const n2 = simplex3D(nz * 2.5, nw * 2.5, nx * 2.5);
      const leafFactor = Math.max(0, Math.min(1, 0.5 + n1 * 0.35 + n2 * 0.15));

      const r = Math.floor(40 + leafFactor * 45);
      const g = Math.floor(100 + leafFactor * 65);
      const b = Math.floor(30 + leafFactor * 25);

      const idx = (y * size + x) * 4;
      imgData.data[idx] = r;
      imgData.data[idx + 1] = g;
      imgData.data[idx + 2] = b;
      imgData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generates Procedural Stone / Rock PBR textures
 */
export function createProceduralStoneTextures(size = 512): PBRTextureSet {
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const colorCtx = colorCanvas.getContext('2d')!;
  const colorData = colorCtx.createImageData(size, size);
  const heightBuffer = new Float32Array(size * size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * 6.0;
      const v = (y / size) * 6.0;

      const n = fbm3D(u, v, 0.5, 5, 2.0, 0.5);
      const cracks = Math.pow(Math.abs(simplex3D(u * 2.0, v * 2.0, 5.0)), 3.0);
      const h = Math.max(0, Math.min(1, 0.5 + 0.45 * n - 0.4 * cracks));
      heightBuffer[y * size + x] = h;

      const shade = Math.floor(90 + h * 70);
      const idx = (y * size + x) * 4;
      colorData.data[idx] = shade;
      colorData.data[idx + 1] = shade + 4;
      colorData.data[idx + 2] = shade + 6;
      colorData.data[idx + 3] = 255;
    }
  }

  colorCtx.putImageData(colorData, 0, 0);

  const colorTexture = new THREE.CanvasTexture(colorCanvas);
  colorTexture.wrapS = THREE.RepeatWrapping;
  colorTexture.wrapT = THREE.RepeatWrapping;

  const normalTexture = createNormalMapFromHeight(heightBuffer, size, size, 5.0);

  return {
    map: colorTexture,
    normalMap: normalTexture,
  };
}
