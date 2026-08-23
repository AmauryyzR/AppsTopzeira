import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export interface PropContext {
  scene: THREE.Scene;
  rand: () => number;
  addPart: (
    bucket: THREE.BufferGeometry[],
    base: THREE.BufferGeometry,
    px: number,
    py: number,
    pz: number,
    sx: number,
    sy: number,
    sz: number,
    color: number,
    rx?: number,
    ry?: number,
    rz?: number
  ) => void;
  buckets: Record<string, THREE.BufferGeometry[]>;
  findSpot: (minR: number, maxR: number, margin: number) => [number, number] | null;
  pathPoints: THREE.Vector2[];
  colliders: { x: number; z: number; r: number }[];
}

export interface WorldPropsResult {
  updaters: ((t: number, dt: number) => void)[];
}

// Vibrant, lush, vivid park palette
const LEAF_COLORS = [0x34b84c, 0x43ca5b, 0x2b9e42, 0x52d669, 0x228a36];
const FLOWER_COLORS = [0xff2d68, 0xffb800, 0xffffff, 0xff5500, 0x9c27b0, 0x00bcd4, 0xffeb3b];
const TUFT_COLORS = [0x388e3c, 0x4caf50, 0x2e7d32, 0x66bb6a, 0x43a047];

export function buildProps(ctx: PropContext): WorldPropsResult {
  const { scene, rand, addPart, buckets, findSpot, pathPoints, colliders } = ctx;
  const updaters: ((t: number, dt: number) => void)[] = [];

  const cT = new THREE.Color();
  const eT = new THREE.Euler();
  const qT = new THREE.Quaternion();
  const vT = new THREE.Vector3();
  const sT = new THREE.Vector3();
  const m4 = new THREE.Matrix4();

  const jitter = (hex: number, dl: number) => cT.set(hex).offsetHSL(0, (rand() - 0.5) * 0.05, dl).getHex();

  const colorize = (g: THREE.BufferGeometry, hex: number) => {
    if (!g.attributes.normal) g.computeVertexNormals();
    if (g.attributes.uv) g.deleteAttribute('uv');
    const n = g.attributes.position.count;
    const arr = new Float32Array(n * 3);
    cT.set(hex);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = cT.r;
      arr[i * 3 + 1] = cT.g;
      arr[i * 3 + 2] = cT.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
    return g;
  };

  // Base Geometries
  const B_BOX = new THREE.BoxGeometry(1, 1, 1);
  const B_CYL = new THREE.CylinderGeometry(1, 1, 1, 14);
  const B_CYL8 = new THREE.CylinderGeometry(1, 1, 1, 8);
  const B_SPH = new THREE.SphereGeometry(1, 14, 10);
  const B_ICO = new THREE.IcosahedronGeometry(1, 1);
  const B_DODE = new THREE.DodecahedronGeometry(1, 0);
  const B_CONE = new THREE.ConeGeometry(1, 1, 10);

  // Keep track of placed trees to strictly avoid ANY clumping!
  const treePositions: { x: number; z: number }[] = [];

  const isTooCloseToTrees = (x: number, z: number, minDist = 8.0) => {
    for (const tp of treePositions) {
      if (Math.hypot(x - tp.x, z - tp.z) < minDist) return true;
    }
    return false;
  };

  // -------------------------------------------------------------
  // 1. CLEAN STYLIZED PARK TREES (No chaotic blobs, well-spaced)
  // -------------------------------------------------------------
  const addStylizedTree = (x: number, z: number) => {
    const s = 0.95 + rand() * 0.4;
    const ry = rand() * Math.PI * 2;
    const trunkColor = jitter(0x8a5229, (rand() - 0.5) * 0.08);

    // Clean tapered trunk
    addPart(buckets.trunk, B_CONE, x, 0.4 * s, z, 0.5 * s, 0.8 * s, 0.5 * s, trunkColor, 0, ry, 0);
    addPart(buckets.trunk, B_CYL8, x, 1.4 * s, z, 0.26 * s, 1.8 * s, 0.26 * s, trunkColor, 0, ry, 0);

    // Cohesive, clean canopy silhouette
    const crownY = 3.0 * s;
    const mainLeaf = LEAF_COLORS[Math.floor(rand() * LEAF_COLORS.length)];
    const secLeaf = LEAF_COLORS[Math.floor(rand() * LEAF_COLORS.length)];

    // Center crown
    addPart(buckets.leaf, B_ICO, x, crownY, z, 1.6 * s, 1.4 * s, 1.6 * s, mainLeaf, rand() * 0.2, ry, 0);
    // Top crown peak
    addPart(buckets.leaf, B_ICO, x, crownY + 0.65 * s, z, 1.15 * s, 0.95 * s, 1.15 * s, secLeaf, 0.1, ry + 1.0, 0);
    // 2 side puffs for natural silhouette
    for (const [pa, pDist, pSize] of [
      [ry + 0.8, 0.85 * s, 0.9 * s],
      [ry + 3.2, 0.85 * s, 0.85 * s],
    ] as const) {
      addPart(
        buckets.leaf,
        B_ICO,
        x + Math.cos(pa) * pDist,
        crownY - 0.15 * s,
        z + Math.sin(pa) * pDist,
        pSize,
        pSize * 0.85,
        pSize,
        mainLeaf,
        0,
        pa,
        0
      );
    }

    // Firmly attached fruits (Red Apples or Golden Oranges)
    if (rand() < 0.5) {
      const fruitColor = rand() < 0.65 ? 0xe53935 : 0xff9800;
      for (let i = 0; i < 3; i++) {
        const fa = ry + (i / 3) * Math.PI * 2 + 0.3;
        const fx = x + Math.cos(fa) * 1.35 * s;
        const fy = crownY - 0.25 * s;
        const fz = z + Math.sin(fa) * 1.35 * s;
        const fSize = 0.12 * s;

        addPart(buckets.fruit, B_SPH, fx, fy, fz, fSize, fSize, fSize, fruitColor);
        addPart(buckets.plant, B_CYL, fx, fy + fSize * 0.9, fz, 0.015 * s, 0.05 * s, 0.015 * s, 0x2e7d32, 0.1, 0, 0.1);
      }
    }

    treePositions.push({ x, z });
    colliders.push({ x, z, r: 0.8 * s });
  };

  // Perimeter Trees (evenly spaced along outer fence)
  const perimeterCount = 18;
  for (let i = 0; i < perimeterCount; i++) {
    const a = (i / perimeterCount) * Math.PI * 2 + (rand() - 0.5) * 0.15;
    const r = 42 + rand() * 8;
    const tx = Math.cos(a) * r;
    const tz = Math.sin(a) * r;
    if (!isTooCloseToTrees(tx, tz, 7.0)) {
      addStylizedTree(tx, tz);
    }
  }

  // Standalone Inner Park Trees (generously spaced apart)
  for (let i = 0; i < 20; i++) {
    if (treePositions.length >= 26) break;
    const spot = findSpot(14, 34, 2.5);
    if (spot && !isTooCloseToTrees(spot[0], spot[1], 8.5)) {
      addStylizedTree(spot[0], spot[1]);
    }
  }

  // -------------------------------------------------------------
  // 2. FLOWERING BUSHES & ROCKS (Well-spaced)
  // -------------------------------------------------------------
  for (let i = 0; i < 16; i++) {
    const spot = findSpot(9, 46, 1.2);
    if (!spot || isTooCloseToTrees(spot[0], spot[1], 3.5)) continue;
    const [x, z] = spot;
    const s = 0.75 + rand() * 0.5;
    const bushColor = LEAF_COLORS[Math.floor(rand() * LEAF_COLORS.length)];

    addPart(buckets.leaf, B_ICO, x, 0.45 * s, z, 1.2 * s, 0.8 * s, 1.2 * s, bushColor, 0, rand() * Math.PI, 0);
    addPart(buckets.leaf, B_ICO, x + 0.45 * s, 0.35 * s, z + 0.2 * s, 0.75 * s, 0.6 * s, 0.75 * s, bushColor, 0, rand() * Math.PI, 0);

    if (rand() < 0.5) {
      const berryColor = rand() < 0.5 ? 0xff2d68 : 0xffb800;
      for (let j = 0; j < 4; j++) {
        const ba = rand() * Math.PI * 2;
        const br = (0.35 + rand() * 0.35) * s;
        addPart(buckets.fruit, B_SPH, x + Math.cos(ba) * br, (0.4 + rand() * 0.25) * s, z + Math.sin(ba) * br, 0.065 * s, 0.065 * s, 0.065 * s, berryColor);
      }
    }
  }

  // Rocks
  for (let i = 0; i < 12; i++) {
    const spot = findSpot(8, 48, 1.0);
    if (!spot || isTooCloseToTrees(spot[0], spot[1], 3.0)) continue;
    const [x, z] = spot;
    const s = 0.55 + rand() * 0.7;
    const rockColor = jitter(0x9aa8b2, (rand() - 0.5) * 0.1);

    addPart(buckets.rock, B_DODE, x, 0.3 * s, z, s, s * 0.75, s * 0.9, rockColor, rand() * 0.3, rand() * Math.PI, rand() * 0.3);
    addPart(buckets.rock, B_DODE, x + s * 0.75, 0.2 * s, z + s * 0.25, s * 0.5, s * 0.4, s * 0.5, rockColor, rand(), rand() * Math.PI, 0);

    colliders.push({ x, z, r: 0.7 * s });
  }

  // -------------------------------------------------------------
  // 3. SOLID PARK BENCH (No floating parts!)
  // -------------------------------------------------------------
  const addParkBench = (x: number, z: number, yaw: number) => {
    const parts: THREE.BufferGeometry[] = [];
    const woodColor = 0x9e5f2e;
    const ironColor = 0x222a30;
    const boltColor = 0xb0bec5;

    const put = (base: THREE.BufferGeometry, px: number, py: number, pz: number, sx: number, sy: number, sz: number, c: number, rx = 0, ry = 0, rz = 0) => {
      const g = base.clone();
      eT.set(rx, ry, rz);
      qT.setFromEuler(eT);
      vT.set(px, py, pz);
      sT.set(sx, sy, sz);
      m4.compose(vT, qT, sT);
      g.applyMatrix4(m4);
      parts.push(colorize(g, c));
    };

    // Seat Planks
    for (const lz of [-0.16, 0.0, 0.16]) {
      put(B_BOX, 0, 0.48, lz, 1.8, 0.045, 0.13, woodColor);
      for (const side of [-0.75, 0.75]) {
        put(B_CYL, side, 0.505, lz, 0.016, 0.01, 0.016, boltColor);
      }
    }

    // Backrest Planks
    for (const [ly, lz] of [
      [0.76, -0.22],
      [0.92, -0.26],
    ] as const) {
      put(B_BOX, 0, ly, lz, 1.8, 0.12, 0.045, woodColor, -0.2);
      for (const side of [-0.75, 0.75]) {
        put(B_CYL, side, ly, lz + 0.024, 0.016, 0.01, 0.016, boltColor, -0.2);
      }
    }

    // Cast iron structural supports
    for (const side of [-1, 1]) {
      const bx = 0.75 * side;
      put(B_BOX, bx, 0.24, 0.18, 0.06, 0.48, 0.06, ironColor, 0.1);
      put(B_BOX, bx, 0.24, -0.18, 0.06, 0.48, 0.06, ironColor, -0.1);
      put(B_BOX, bx, 0.12, 0, 0.05, 0.04, 0.42, ironColor);
      put(B_BOX, bx, 0.44, 0, 0.06, 0.05, 0.48, ironColor);
      put(B_BOX, bx, 0.72, -0.21, 0.055, 0.58, 0.055, ironColor, -0.2);
      put(B_BOX, bx, 0.62, 0.02, 0.055, 0.04, 0.42, ironColor);
      put(B_BOX, bx, 0.54, 0.2, 0.05, 0.18, 0.05, ironColor);
    }

    put(B_BOX, 0, 0.72, -0.21, 0.04, 0.56, 0.04, ironColor, -0.2);
    put(B_BOX, 0, 0.44, 0, 0.04, 0.04, 0.46, ironColor);

    const merged = mergeGeometries(parts)!;
    for (const g of parts) g.dispose();

    eT.set(0, yaw, 0);
    qT.setFromEuler(eT);
    vT.set(x, 0, z);
    sT.set(1, 1, 1);
    m4.compose(vT, qT, sT);
    merged.applyMatrix4(m4);
    buckets.wood.push(merged);

    colliders.push({ x, z, r: 1.0 });
  };

  for (const idx of [6, 18, 30, 42]) {
    const i = idx % pathPoints.length;
    const p = pathPoints[i];
    const prev = pathPoints[(i - 1 + pathPoints.length) % pathPoints.length];
    const next = pathPoints[(i + 1) % pathPoints.length];
    const tx = next.x - prev.x;
    const tz = next.y - prev.y;
    const tl = Math.hypot(tx, tz) || 1;
    const bx = p.x + (-tz / tl) * 3.2;
    const bz = p.y + (tx / tl) * 3.2;
    if (Math.hypot(bx + 24, bz + 18) < 11) continue;
    addParkBench(bx, bz, Math.atan2(p.x - bx, p.y - bz));
  }

  // -------------------------------------------------------------
  // 4. VIBRANT WILDFLOWERS & GRASS TUFTS
  // -------------------------------------------------------------
  const flowerCount = 260;
  const headGeo = new THREE.IcosahedronGeometry(0.11, 0);
  const stemGeo = new THREE.CylinderGeometry(0.016, 0.022, 0.32, 6);
  const headMat = new THREE.MeshStandardMaterial({ roughness: 0.6 });
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x388e3c, roughness: 0.9 });
  const heads = new THREE.InstancedMesh(headGeo, headMat, flowerCount);
  const stems = new THREE.InstancedMesh(stemGeo, stemMat, flowerCount);
  let placed = 0;

  while (placed < flowerCount) {
    const spot = findSpot(4.5, 52, -0.4);
    if (!spot) break;
    const [x, z] = spot;
    eT.set((rand() - 0.5) * 0.3, rand() * Math.PI * 2, (rand() - 0.5) * 0.3);
    qT.setFromEuler(eT);
    const h = 0.3 + rand() * 0.16;
    vT.set(x, h / 2, z);
    sT.set(1, 1, 1);
    m4.compose(vT, qT, sT);
    stems.setMatrixAt(placed, m4);

    vT.set(x, h + 0.05, z);
    const cs = 0.85 + rand() * 0.55;
    sT.set(cs, cs, cs);
    m4.compose(vT, qT, sT);
    heads.setMatrixAt(placed, m4);
    heads.setColorAt(placed, cT.set(FLOWER_COLORS[Math.floor(rand() * FLOWER_COLORS.length)]));
    placed++;
  }
  heads.count = placed;
  stems.count = placed;
  heads.instanceMatrix.needsUpdate = true;
  stems.instanceMatrix.needsUpdate = true;
  if (heads.instanceColor) heads.instanceColor.needsUpdate = true;
  scene.add(heads, stems);

  // Grass Tufts
  const tuftCount = 360;
  const tuftGeo = new THREE.ConeGeometry(0.065, 0.45, 5);
  const tuftMat = new THREE.MeshStandardMaterial({ roughness: 0.95 });
  const tufts = new THREE.InstancedMesh(tuftGeo, tuftMat, tuftCount);
  let tPlaced = 0;

  while (tPlaced < tuftCount) {
    const spot = findSpot(3.5, 53, -0.6);
    if (!spot) break;
    const [x, z] = spot;
    eT.set((rand() - 0.5) * 0.4, rand() * Math.PI * 2, (rand() - 0.5) * 0.4);
    qT.setFromEuler(eT);
    const s = 0.75 + rand() * 0.85;
    vT.set(x, 0.18 * s, z);
    sT.set(s, s, s);
    m4.compose(vT, qT, sT);
    tufts.setMatrixAt(tPlaced, m4);
    tufts.setColorAt(tPlaced, cT.set(TUFT_COLORS[Math.floor(rand() * TUFT_COLORS.length)]));
    tPlaced++;
  }
  tufts.count = tPlaced;
  tufts.instanceMatrix.needsUpdate = true;
  if (tufts.instanceColor) tufts.instanceColor.needsUpdate = true;
  scene.add(tufts);

  // -------------------------------------------------------------
  // 5. STREET LAMPS
  // -------------------------------------------------------------
  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xfff3cf,
    emissive: 0xffd54f,
    emissiveIntensity: 1.8,
    roughness: 0.3,
  });
  const bulbGeo = new THREE.SphereGeometry(0.2, 14, 10);

  const addLamp = (x: number, z: number) => {
    addPart(buckets.lamp, B_CYL, x, 0.08, z, 0.3, 0.16, 0.3, 0x242e36);
    addPart(buckets.lamp, B_CYL, x, 0.22, z, 0.22, 0.14, 0.22, 0x242e36);
    addPart(buckets.lamp, B_CYL, x, 1.6, z, 0.065, 2.7, 0.065, 0x1f272e);
    addPart(buckets.lamp, B_CONE, x, 3.25, z, 0.38, 0.28, 0.38, 0x182026);
    addPart(buckets.lamp, B_CYL, x, 2.82, z, 0.22, 0.04, 0.22, 0x1f272e);

    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(x, 2.96, z);
    scene.add(bulb);

    colliders.push({ x, z, r: 0.45 });
  };

  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i / 4) * Math.PI * 2;
    addLamp(Math.cos(a) * 7.2, Math.sin(a) * 7.2);
  }

  // -------------------------------------------------------------
  // 6. PERIMETER FENCE
  // -------------------------------------------------------------
  const FENCE_R = 56;
  const postCount = Math.floor((2 * Math.PI * FENCE_R) / 2.4);
  for (let i = 0; i < postCount; i++) {
    const a = (i / postCount) * Math.PI * 2;
    addPart(buckets.wood, B_BOX, Math.cos(a) * FENCE_R, 0.55, Math.sin(a) * FENCE_R, 0.22, 1.15, 0.22, jitter(0x945f30, (rand() - 0.5) * 0.1), 0, rand() * 0.2, 0);
  }
  for (const ry of [0.48, 0.94]) {
    const rail = new THREE.TorusGeometry(FENCE_R, 0.055, 6, 160).rotateX(Math.PI / 2);
    rail.translate(0, ry, 0);
    buckets.wood.push(colorize(rail, 0xa5764a));
  }

  // -------------------------------------------------------------
  // 7. BUTTERFLIES
  // -------------------------------------------------------------
  const wingGeoL = new THREE.PlaneGeometry(0.24, 0.18).rotateX(-Math.PI / 2).translate(-0.12, 0, 0);
  const wingGeoR = new THREE.PlaneGeometry(0.24, 0.18).rotateX(-Math.PI / 2).translate(0.12, 0, 0);
  const bodyGeoB = new THREE.BoxGeometry(0.04, 0.04, 0.18);
  const bColors = [0xff5722, 0x00bcd4, 0xffeb3b, 0xe91e63, 0x9c27b0, 0x4caf50];
  const bBodyMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.6 });

  const butterflies: { g: THREE.Group; wl: THREE.Mesh; wr: THREE.Mesh; ax: number; az: number; s: number; px: number; pz: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const spot = findSpot(6, 42, 0);
    const [ax, az] = spot ?? [0, -10];
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: bColors[i % bColors.length], roughness: 0.5, side: THREE.DoubleSide });
    const wl = new THREE.Mesh(wingGeoL, mat);
    const wr = new THREE.Mesh(wingGeoR, mat);
    const bb = new THREE.Mesh(bodyGeoB, bBodyMat);
    g.add(wl, wr, bb);
    scene.add(g);
    butterflies.push({ g, wl, wr, ax, az, s: i * 1.5, px: ax, pz: az });
  }

  updaters.push((t) => {
    for (const b of butterflies) {
      const nx = b.ax + Math.sin(t * 0.38 + b.s) * 6;
      const nz = b.az + Math.cos(t * 0.32 + b.s * 1.2) * 6;
      const ny = 1.3 + Math.sin(t * 1.8 + b.s) * 0.45;
      b.g.position.set(nx, ny, nz);
      b.g.rotation.y = Math.atan2(nx - b.px, nz - b.pz);
      b.px = nx;
      b.pz = nz;
      const f = 0.18 + Math.abs(Math.sin(t * 15 + b.s)) * 1.15;
      b.wl.rotation.z = -f;
      b.wr.rotation.z = f;
    }
  });

  B_BOX.dispose();
  B_CYL.dispose();
  B_CYL8.dispose();
  B_SPH.dispose();
  B_ICO.dispose();
  B_DODE.dispose();
  B_CONE.dispose();
  headGeo.dispose();
  stemGeo.dispose();
  tuftGeo.dispose();
  bulbGeo.dispose();
  wingGeoL.dispose();
  wingGeoR.dispose();
  bodyGeoB.dispose();

  return { updaters };
}
