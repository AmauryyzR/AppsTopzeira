import {
  BenchDescriptor,
  BushDescriptor,
  ButterflyDescriptor,
  Collider,
  FlowerDescriptor,
  LampDescriptor,
  LilyPadDescriptor,
  PerimeterFenceDescriptor,
  ReedDescriptor,
  RockDescriptor,
  ShoreRockDescriptor,
  TreeDescriptor,
  TuftDescriptor,
  WorldDefinitionData,
} from '../types';

export const SEED_CONSTANT = 20260823;
export const BOUNDS_RADIUS = 53.5;
export const FENCE_RADIUS = 56;
export const SPAWN_POSITION: [number, number, number] = [3.2, 0, 4.2];
export const SPAWN_YAW = Math.PI * 0.75;
export const PLAZA_CENTER = { x: 0, z: 0, radius: 2.6 };
export const POND_CENTER = { x: -24, z: -18, radius: 8.8 };
export const BRIDGE_CENTER = {
  x: POND_CENTER.x + 6.8,
  z: POND_CENTER.z - 4.5,
  yaw: -0.5,
  radius: 2.5,
};

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Color palette constants
export const LEAF_COLORS = [0x34b84c, 0x43ca5b, 0x2b9e42, 0x52d669, 0x228a36];
export const FLOWER_COLORS = [0xff2d68, 0xffb800, 0xffffff, 0xff5500, 0x9c27b0, 0x00bcd4, 0xffeb3b];
export const TUFT_COLORS = [0x388e3c, 0x4caf50, 0x2e7d32, 0x66bb6a, 0x43a047];
export const BUTTERFLY_COLORS = [0xff5722, 0x00bcd4, 0xffeb3b, 0xe91e63, 0x9c27b0, 0x4caf50];

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h, s, l];
}

function hue2rgb(p: number, q: number, t: number): number {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r, g, b];
}

function hexToRgb(hex: number): [number, number, number] {
  const r = ((hex >> 16) & 255) / 255;
  const g = ((hex >> 8) & 255) / 255;
  const b = (hex & 255) / 255;
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): number {
  const ir = Math.min(255, Math.max(0, Math.round(r * 255)));
  const ig = Math.min(255, Math.max(0, Math.round(g * 255)));
  const ib = Math.min(255, Math.max(0, Math.round(b * 255)));
  return (ir << 16) | (ig << 8) | ib;
}

export function jitterColor(hex: number, dl: number, ds = 0, dh = 0): number {
  const [r, g, b] = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(r, g, b);
  const nh = (h + dh + 1) % 1;
  const ns = Math.min(1, Math.max(0, s + ds));
  const nl = Math.min(1, Math.max(0, l + dl));
  const [nr, ng, nb] = hslToRgb(nh, ns, nl);
  return rgbToHex(nr, ng, nb);
}

// 2D Closed Catmull-Rom spline sampling
export function sampleClosedCatmullRom(controlPoints: [number, number][], samplesCount: number): [number, number][] {
  const n = controlPoints.length;
  const sampled: [number, number][] = [];

  for (let i = 0; i < samplesCount; i++) {
    const globalT = (i / samplesCount) * n;
    const segment = Math.floor(globalT);
    const t = globalT - segment;

    const p0 = controlPoints[(segment - 1 + n) % n];
    const p1 = controlPoints[segment % n];
    const p2 = controlPoints[(segment + 1) % n];
    const p3 = controlPoints[(segment + 2) % n];

    const t2 = t * t;
    const t3 = t2 * t;

    const x = 0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
    const z = 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);

    sampled.push([x, z]);
  }

  return sampled;
}

export function generateWorldDefinition(seed = SEED_CONSTANT): WorldDefinitionData {
  const rand = mulberry32(seed);

  // 1. PATH POINTS
  const rawLoopPts: [number, number][] = [
    [0, -4.5],
    [10, -1],
    [18, 7],
    [18, 18],
    [8, 26],
    [-2, 28],
    [-12, 24],
    [-18, 14],
    [-15, 3],
    [-8, -2],
  ];

  const mainPathSamples = sampleClosedCatmullRom(rawLoopPts, 64);
  const pathPoints: [number, number][] = [...mainPathSamples];

  // Branch 1: Center Plaza connector (6 samples)
  for (let i = 0; i <= 6; i++) {
    const t = i / 6;
    const pz = -4.5 * t;
    pathPoints.push([0, pz]);
  }

  // Branch 2: Pond connector (8 samples)
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const px = -15 - 8.5 * t;
    const pz = 3 - 18 * t;
    pathPoints.push([px, pz]);
  }

  const nearPath = (x: number, z: number, m: number) => {
    const rr = (3.0 + m) * (3.0 + m);
    for (const p of pathPoints) {
      const dx = x - p[0];
      const dz = z - p[1];
      if (dx * dx + dz * dz < rr) return true;
    }
    return false;
  };

  const blocked = (x: number, z: number, m = 0) =>
    nearPath(x, z, m) ||
    Math.hypot(x - PLAZA_CENTER.x, z - PLAZA_CENTER.z) < 8.2 + m ||
    Math.hypot(x - POND_CENTER.x, z - POND_CENTER.z) < 12.0 + m;

  const findSpot = (minR: number, maxR: number, margin: number): [number, number] | null => {
    for (let i = 0; i < 40; i++) {
      const a = rand() * Math.PI * 2;
      const r = minR + rand() * (maxR - minR);
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;
      if (!blocked(x, z, margin)) return [x, z];
    }
    return null;
  };

  const colliders: Collider[] = [
    { x: PLAZA_CENTER.x, z: PLAZA_CENTER.z, r: PLAZA_CENTER.radius },
    { x: POND_CENTER.x, z: POND_CENTER.z, r: POND_CENTER.radius },
  ];

  // 2. TREES
  const trees: TreeDescriptor[] = [];
  const treePositions: { x: number; z: number }[] = [];

  const isTooCloseToTrees = (x: number, z: number, minDist = 8.0) => {
    for (const tp of treePositions) {
      if (Math.hypot(x - tp.x, z - tp.z) < minDist) return true;
    }
    return false;
  };

  const addTree = (x: number, z: number) => {
    const s = 0.95 + rand() * 0.4;
    const yaw = rand() * Math.PI * 2;
    const trunkColor = jitterColor(0x8a5229, (rand() - 0.5) * 0.08, (rand() - 0.5) * 0.05);
    const mainLeaf = LEAF_COLORS[Math.floor(rand() * LEAF_COLORS.length)];
    const secLeaf = LEAF_COLORS[Math.floor(rand() * LEAF_COLORS.length)];
    const hasFruit = rand() < 0.5;
    const fruitColor = hasFruit ? (rand() < 0.65 ? 0xe53935 : 0xff9800) : undefined;

    trees.push({
      x,
      z,
      scale: s,
      yaw,
      trunkColor,
      mainLeafColor: mainLeaf,
      secLeafColor: secLeaf,
      hasFruit,
      fruitColor,
    });
    treePositions.push({ x, z });
    colliders.push({ x, z, r: 0.8 * s });
  };

  // Perimeter Trees
  const perimeterCount = 18;
  for (let i = 0; i < perimeterCount; i++) {
    const a = (i / perimeterCount) * Math.PI * 2 + (rand() - 0.5) * 0.15;
    const r = 42 + rand() * 8;
    const tx = Math.cos(a) * r;
    const tz = Math.sin(a) * r;
    if (!isTooCloseToTrees(tx, tz, 7.0)) {
      addTree(tx, tz);
    }
  }

  // Inner Park Trees
  for (let i = 0; i < 20; i++) {
    if (treePositions.length >= 26) break;
    const spot = findSpot(14, 34, 2.5);
    if (spot && !isTooCloseToTrees(spot[0], spot[1], 8.5)) {
      addTree(spot[0], spot[1]);
    }
  }

  // 3. BUSHES
  const bushes: BushDescriptor[] = [];
  for (let i = 0; i < 16; i++) {
    const spot = findSpot(9, 46, 1.2);
    if (!spot || isTooCloseToTrees(spot[0], spot[1], 3.5)) continue;
    const [x, z] = spot;
    const s = 0.75 + rand() * 0.5;
    const bushColor = LEAF_COLORS[Math.floor(rand() * LEAF_COLORS.length)];
    const hasBerries = rand() < 0.5;
    const berryColor = hasBerries ? (rand() < 0.5 ? 0xff2d68 : 0xffb800) : undefined;

    bushes.push({
      x,
      z,
      scale: s,
      color: bushColor,
      yaw: rand() * Math.PI,
      hasBerries,
      berryColor,
    });
  }

  // 4. ROCKS
  const rocks: RockDescriptor[] = [];
  for (let i = 0; i < 12; i++) {
    const spot = findSpot(8, 48, 1.0);
    if (!spot || isTooCloseToTrees(spot[0], spot[1], 3.0)) continue;
    const [x, z] = spot;
    const s = 0.55 + rand() * 0.7;
    const rockColor = jitterColor(0x9aa8b2, (rand() - 0.5) * 0.1);

    rocks.push({
      x,
      z,
      scale: s,
      color: rockColor,
      rx: rand() * 0.3,
      ry: rand() * Math.PI,
      rz: rand() * 0.3,
    });
    colliders.push({ x, z, r: 0.7 * s });
  }

  // 5. BENCHES
  const benches: BenchDescriptor[] = [];
  for (const idx of [6, 18, 30, 42]) {
    const i = idx % mainPathSamples.length;
    const p = mainPathSamples[i];
    const prev = mainPathSamples[(i - 1 + mainPathSamples.length) % mainPathSamples.length];
    const next = mainPathSamples[(i + 1) % mainPathSamples.length];
    const tx = next[0] - prev[0];
    const tz = next[1] - prev[1];
    const tl = Math.hypot(tx, tz) || 1;
    const bx = p[0] + (-tz / tl) * 3.2;
    const bz = p[1] + (tx / tl) * 3.2;
    if (Math.hypot(bx - POND_CENTER.x, bz - POND_CENTER.z) < 11) continue;
    const yaw = Math.atan2(p[0] - bx, p[1] - bz);
    benches.push({ x: bx, z: bz, yaw });
    colliders.push({ x: bx, z: bz, r: 1.0 });
  }

  // 6. WILDFLOWERS
  const flowers: FlowerDescriptor[] = [];
  const targetFlowers = 260;
  while (flowers.length < targetFlowers) {
    const spot = findSpot(4.5, 52, -0.4);
    if (!spot) break;
    const [x, z] = spot;
    const h = 0.3 + rand() * 0.16;
    const s = 0.85 + rand() * 0.55;
    const c = FLOWER_COLORS[Math.floor(rand() * FLOWER_COLORS.length)];
    flowers.push({
      x,
      z,
      height: h,
      scale: s,
      rx: (rand() - 0.5) * 0.3,
      ry: rand() * Math.PI * 2,
      rz: (rand() - 0.5) * 0.3,
      color: c,
    });
  }

  // 7. GRASS TUFTS
  const tufts: TuftDescriptor[] = [];
  const targetTufts = 360;
  while (tufts.length < targetTufts) {
    const spot = findSpot(3.5, 53, -0.6);
    if (!spot) break;
    const [x, z] = spot;
    const s = 0.75 + rand() * 0.85;
    const c = TUFT_COLORS[Math.floor(rand() * TUFT_COLORS.length)];
    tufts.push({
      x,
      z,
      scale: s,
      rx: (rand() - 0.5) * 0.4,
      ry: rand() * Math.PI * 2,
      rz: (rand() - 0.5) * 0.4,
      color: c,
    });
  }

  // 8. STREET LAMPS
  const lamps: LampDescriptor[] = [];
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i / 4) * Math.PI * 2;
    const lx = Math.cos(a) * 7.2;
    const lz = Math.sin(a) * 7.2;
    lamps.push({ x: lx, z: lz });
    colliders.push({ x: lx, z: lz, r: 0.45 });
  }

  // 9. BUTTERFLIES
  const butterflies: ButterflyDescriptor[] = [];
  for (let i = 0; i < 7; i++) {
    const spot = findSpot(6, 42, 0);
    const [ax, az] = spot ?? [0, -10];
    butterflies.push({
      startX: ax,
      startZ: az,
      speed: i * 1.5,
      color: BUTTERFLY_COLORS[i % BUTTERFLY_COLORS.length],
    });
  }

  // 10. POND LILY PADS
  const lilyPads: LilyPadDescriptor[] = [];
  for (let i = 0; i < 7; i++) {
    const a = rand() * Math.PI * 2;
    const r = 1.8 + rand() * 5.5;
    const lx = POND_CENTER.x + Math.cos(a) * r;
    const lz = POND_CENTER.z + Math.sin(a) * r;
    const s = 0.48 + rand() * 0.3;
    const hasFlower = rand() < 0.65;
    const flowerColor = hasFlower ? (rand() < 0.5 ? 0xff4081 : 0xffffff) : undefined;
    lilyPads.push({
      x: lx,
      z: lz,
      scale: s,
      phase: rand() * Math.PI * 2,
      hasFlower,
      flowerColor,
    });
  }

  // 11. SHORE ROCKS
  const shoreRocks: ShoreRockDescriptor[] = [];
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + (rand() - 0.5) * 0.15;
    const r = 8.9 + rand() * 0.8;
    const rx = POND_CENTER.x + Math.cos(a) * r;
    const rz = POND_CENTER.z + Math.sin(a) * r;
    const s = 0.5 + rand() * 0.45;
    shoreRocks.push({
      x: rx,
      z: rz,
      scale: s,
      color: 0xa0acb4,
      rx: rand(),
      ry: rand() * Math.PI,
    });
  }

  // 12. REEDS
  const reeds: ReedDescriptor[] = [];
  for (let i = 0; i < 12; i++) {
    const a = rand() * Math.PI * 2;
    const r = 9.2 + rand() * 1.2;
    const cx = POND_CENTER.x + Math.cos(a) * r;
    const cz = POND_CENTER.z + Math.sin(a) * r;
    const n = 2 + Math.floor(rand() * 3);

    for (let j = 0; j < n; j++) {
      const h = 1.0 + rand() * 0.7;
      const rx = cx + (rand() - 0.5) * 0.6;
      const rz = cz + (rand() - 0.5) * 0.6;
      const hasHead = rand() > 0.4;
      reeds.push({
        x: rx,
        z: rz,
        height: h,
        rz: (rand() - 0.5) * 0.12,
        hasHead,
      });
    }
  }

  // 13. PERIMETER FENCE
  const postCount = Math.floor((2 * Math.PI * FENCE_RADIUS) / 2.4);
  const fence: PerimeterFenceDescriptor = {
    radius: FENCE_RADIUS,
    postCount,
  };

  // VALIDATION: Ensure no NaNs or Infinities in any descriptor
  const validateNumber = (n: number, label: string) => {
    if (!Number.isFinite(n)) {
      throw new Error(`Invalid non-finite number in WorldDefinition [${label}]: ${n}`);
    }
  };

  for (const c of colliders) {
    validateNumber(c.x, 'collider.x');
    validateNumber(c.z, 'collider.z');
    validateNumber(c.r, 'collider.r');
  }

  for (const t of trees) {
    validateNumber(t.x, 'tree.x');
    validateNumber(t.z, 'tree.z');
    validateNumber(t.scale, 'tree.scale');
    validateNumber(t.yaw, 'tree.yaw');
  }

  return {
    seed,
    bounds: BOUNDS_RADIUS,
    spawnPosition: SPAWN_POSITION,
    spawnYaw: SPAWN_YAW,
    plaza: PLAZA_CENTER,
    pond: POND_CENTER,
    bridge: BRIDGE_CENTER,
    pathPoints,
    colliders,
    trees,
    bushes,
    rocks,
    benches,
    flowers,
    tufts,
    lamps,
    butterflies,
    lilyPads,
    shoreRocks,
    reeds,
    fence,
  };
}
