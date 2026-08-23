import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { buildProps } from './WorldProps';

export interface Collider {
  x: number;
  z: number;
  r: number;
}

export interface WorldRefs {
  colliders: Collider[];
  isOverBridge(x: number, z: number): boolean;
  update(t: number, dt: number): void;
  dispose(): void;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const POND = { x: -24, z: -18 };
const PLAZA = { x: 0, z: 0 };

function makeGrassTexture(rand: () => number): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d')!;

  g.fillStyle = '#48b83c';
  g.fillRect(0, 0, 256, 256);

  const shades = ['#3ca830', '#56c64a', '#64d257', '#349929', '#78de6b', '#42b036'];
  for (let i = 0; i < 3000; i++) {
    g.globalAlpha = 0.22 + rand() * 0.35;
    g.fillStyle = shades[Math.floor(rand() * shades.length)];
    g.fillRect(rand() * 256, rand() * 256, 1 + rand() * 2, 1 + rand() * 3);
  }

  g.globalAlpha = 0.35;
  g.fillStyle = '#9ee87d';
  for (let i = 0; i < 100; i++) {
    g.fillRect(rand() * 256, rand() * 256, 2, 2 + rand() * 2);
  }

  g.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 16);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function buildWorld(scene: THREE.Scene): WorldRefs {
  const rand = mulberry32(20260823);
  const disposables: { dispose(): void }[] = [];
  const colliders: Collider[] = [];
  const updaters: ((t: number, dt: number) => void)[] = [];

  const track = <T extends { dispose(): void }>(d: T): T => {
    disposables.push(d);
    return d;
  };

  const m4 = new THREE.Matrix4();
  const qT = new THREE.Quaternion();
  const eT = new THREE.Euler();
  const vT = new THREE.Vector3();
  const sT = new THREE.Vector3();
  const cT = new THREE.Color();

  const B_CYL = new THREE.CylinderGeometry(1, 1, 1, 14);
  const B_BOX = new THREE.BoxGeometry(1, 1, 1);

  const buckets: Record<string, THREE.BufferGeometry[]> = {
    sand: [],
    stone: [],
    wood: [],
    trunk: [],
    leaf: [],
    fruit: [],
    rock: [],
    plant: [],
    lamp: [],
  };

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

  const addPart = (
    bucket: THREE.BufferGeometry[],
    base: THREE.BufferGeometry,
    px: number,
    py: number,
    pz: number,
    sx: number,
    sy: number,
    sz: number,
    color: number,
    rx = 0,
    ry = 0,
    rz = 0
  ) => {
    const g = base.clone();
    eT.set(rx, ry, rz);
    qT.setFromEuler(eT);
    vT.set(px, py, pz);
    sT.set(sx, sy, sz);
    m4.compose(vT, qT, sT);
    g.applyMatrix4(m4);
    bucket.push(colorize(g, color));
  };

  // --- 1. SKY SPHERE ---
  const skyMat = track(
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        topColor: { value: new THREE.Color(0x288be6) },
        bottomColor: { value: new THREE.Color(0xcaefff) },
        offset: { value: 20 },
        exponent: { value: 0.65 },
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPosition = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
          vec3 sky = mix(bottomColor, topColor, pow(max(h, 0.0), exponent));
          gl_FragColor = vec4(sky, 1.0);
        }
      `,
    })
  );
  const skyMesh = new THREE.Mesh(track(new THREE.SphereGeometry(450, 24, 16)), skyMat);
  skyMesh.matrixAutoUpdate = false;
  skyMesh.frustumCulled = false;
  skyMesh.updateMatrix();
  scene.add(skyMesh);

  // --- 2. GROUND & INFINITE GREEN HORIZON ---
  const grassTex = makeGrassTexture(rand);
  track(grassTex);
  const groundMat = track(new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.9, metalness: 0.0 }));
  const ground = new THREE.Mesh(track(new THREE.CircleGeometry(64, 96).rotateX(-Math.PI / 2)), groundMat);
  ground.receiveShadow = true;
  ground.matrixAutoUpdate = false;
  ground.frustumCulled = false;
  ground.updateMatrix();
  scene.add(ground);

  // Massive seamless green ground plane (1200x1200m) stretching past the horizon in all directions
  const outerMat = track(new THREE.MeshStandardMaterial({ color: 0x3aa830, roughness: 1.0, metalness: 0.0 }));
  const outerMesh = new THREE.Mesh(track(new THREE.PlaneGeometry(1200, 1200).rotateX(-Math.PI / 2)), outerMat);
  outerMesh.position.y = -0.06;
  outerMesh.receiveShadow = false;
  outerMesh.matrixAutoUpdate = false;
  outerMesh.frustumCulled = false;
  outerMesh.updateMatrix();
  scene.add(outerMesh);

  // --- 3. CONTINUOUS SEAMLESS PATHWAY RIBBON (Zero Z-Fighting!) ---
  const pathPoints: THREE.Vector2[] = [];
  const loopPts = [
    [0, -4.5],
    [10, -1],
    [18, 7],
    [17, 18],
    [8, 26],
    [-2, 28],
    [-12, 24],
    [-18, 14],
    [-15, 3],
    [-8, -2],
  ].map(([x, z]) => new THREE.Vector3(x, 0, z));

  const curve = new THREE.CatmullRomCurve3(loopPts, true, 'catmullrom', 0.5);
  const N = 64;
  const pathWidth = 2.1;
  const positions: number[] = [];
  const indices: number[] = [];

  const sampledPts: THREE.Vector3[] = [];
  for (let i = 0; i < N; i++) {
    const p = curve.getPoint(i / N);
    sampledPts.push(p);
    pathPoints.push(new THREE.Vector2(p.x, p.z));
  }

  for (let i = 0; i < N; i++) {
    const p = sampledPts[i];
    const prev = sampledPts[(i - 1 + N) % N];
    const next = sampledPts[(i + 1) % N];
    const tx = next.x - prev.x;
    const tz = next.z - prev.z;
    const len = Math.hypot(tx, tz) || 1;
    const nx = -tz / len;
    const nz = tx / len;

    positions.push(p.x - nx * pathWidth, 0.014, p.z - nz * pathWidth);
    positions.push(p.x + nx * pathWidth, 0.014, p.z + nz * pathWidth);

    const i0 = i * 2;
    const i1 = i * 2 + 1;
    const i2 = ((i + 1) % N) * 2;
    const i3 = ((i + 1) % N) * 2 + 1;

    indices.push(i0, i1, i2);
    indices.push(i1, i3, i2);
  }

  const pathGeo = new THREE.BufferGeometry();
  pathGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  pathGeo.setIndex(indices);
  pathGeo.computeVertexNormals();
  buckets.sand.push(colorize(pathGeo, 0xf3cd8a));

  // Branch 1: Center Plaza connector
  const b1Pos: number[] = [];
  const b1Idx: number[] = [];
  for (let i = 0; i <= 6; i++) {
    const t = i / 6;
    const pz = -4.5 * t;
    b1Pos.push(-1.9, 0.014, pz);
    b1Pos.push(1.9, 0.014, pz);
    if (i < 6) {
      const idx = i * 2;
      b1Idx.push(idx, idx + 1, idx + 2, idx + 1, idx + 3, idx + 2);
    }
    pathPoints.push(new THREE.Vector2(0, pz));
  }
  const b1Geo = new THREE.BufferGeometry();
  b1Geo.setAttribute('position', new THREE.Float32BufferAttribute(b1Pos, 3));
  b1Geo.setIndex(b1Idx);
  b1Geo.computeVertexNormals();
  buckets.sand.push(colorize(b1Geo, 0xf3cd8a));

  // Branch 2: Pond connector
  const b2Pos: number[] = [];
  const b2Idx: number[] = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const px = -15 - 8.5 * t;
    const pz = 3 - 18 * t;
    b2Pos.push(px - 1.8 * 0.8, 0.014, pz - 1.8 * 0.6);
    b2Pos.push(px + 1.8 * 0.8, 0.014, pz + 1.8 * 0.6);
    if (i < 8) {
      const idx = i * 2;
      b2Idx.push(idx, idx + 1, idx + 2, idx + 1, idx + 3, idx + 2);
    }
    pathPoints.push(new THREE.Vector2(px, pz));
  }
  const b2Geo = new THREE.BufferGeometry();
  b2Geo.setAttribute('position', new THREE.Float32BufferAttribute(b2Pos, 3));
  b2Geo.setIndex(b2Idx);
  b2Geo.computeVertexNormals();
  buckets.sand.push(colorize(b2Geo, 0xf3cd8a));

  const nearPath = (x: number, z: number, m: number) => {
    const rr = (3.0 + m) * (3.0 + m);
    for (const p of pathPoints) {
      const dx = x - p.x;
      const dz = z - p.y;
      if (dx * dx + dz * dz < rr) return true;
    }
    return false;
  };

  const blocked = (x: number, z: number, m = 0) =>
    nearPath(x, z, m) || Math.hypot(x - PLAZA.x, z - PLAZA.z) < 8.2 + m || Math.hypot(x - POND.x, z - POND.z) < 12.0 + m;

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

  // --- 4. CENTRAL PLAZA & FOUNTAIN ---
  addPart(buckets.sand, B_CYL, PLAZA.x, 0.02, PLAZA.z, 6.6, 0.04, 6.6, 0xf6dfab);
  const plazaRing = new THREE.TorusGeometry(6.6, 0.12, 8, 48).rotateX(Math.PI / 2);
  plazaRing.translate(PLAZA.x, 0.06, PLAZA.z);
  buckets.sand.push(colorize(plazaRing, 0xdba256));

  const innerRing = new THREE.TorusGeometry(3.6, 0.08, 6, 36).rotateX(Math.PI / 2);
  innerRing.translate(PLAZA.x, 0.05, PLAZA.z);
  buckets.sand.push(colorize(innerRing, 0xe5bd7d));

  // Stone Basin Base (at y=0.06 with height 0.12, top at y=0.12)
  addPart(buckets.stone, B_CYL, PLAZA.x, 0.06, PLAZA.z, 2.5, 0.12, 2.5, 0xd4cdc0);

  // Outer Basin Rim (Torus around perimeter at y=0.38)
  const basinRim = new THREE.TorusGeometry(2.35, 0.14, 8, 36).rotateX(Math.PI / 2);
  basinRim.translate(PLAZA.x, 0.38, PLAZA.z);
  buckets.stone.push(colorize(basinRim, 0xe8e2d5));

  // Central Column
  addPart(buckets.stone, B_CYL, PLAZA.x, 0.55, PLAZA.z, 0.36, 0.85, 0.36, 0xdcd6cb);

  // Middle Tier Rim & Base
  const midRim = new THREE.TorusGeometry(0.95, 0.09, 8, 24).rotateX(Math.PI / 2);
  midRim.translate(PLAZA.x, 1.05, PLAZA.z);
  buckets.stone.push(colorize(midRim, 0xe8e2d5));

  addPart(buckets.stone, B_CYL, PLAZA.x, 0.98, PLAZA.z, 0.95, 0.08, 0.95, 0xd4cdc0);
  addPart(buckets.stone, B_CYL, PLAZA.x, 1.3, PLAZA.z, 0.22, 0.45, 0.22, 0xdcd6cb);

  // FOUNTAIN WATER
  const waterMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x18c8e6,
      roughness: 0.1,
      metalness: 0.15,
    })
  );

  const bottomWater = new THREE.Mesh(track(new THREE.CircleGeometry(2.26, 32).rotateX(-Math.PI / 2)), waterMat);
  bottomWater.position.set(PLAZA.x, 0.28, PLAZA.z);
  bottomWater.matrixAutoUpdate = false;
  bottomWater.frustumCulled = false;
  bottomWater.updateMatrix();
  scene.add(bottomWater);

  const midWater = new THREE.Mesh(track(new THREE.CircleGeometry(0.9, 20).rotateX(-Math.PI / 2)), waterMat);
  midWater.position.set(PLAZA.x, 1.01, PLAZA.z);
  midWater.matrixAutoUpdate = false;
  midWater.frustumCulled = false;
  midWater.updateMatrix();
  scene.add(midWater);

  const jet = new THREE.Mesh(
    track(new THREE.ConeGeometry(0.14, 0.75, 10)),
    track(new THREE.MeshStandardMaterial({ color: 0xd6f7ff, roughness: 0.1 }))
  );
  jet.position.set(PLAZA.x, 1.7, PLAZA.z);
  scene.add(jet);

  updaters.push((t) => {
    jet.scale.y = 1 + Math.sin(t * 5) * 0.15;
    jet.position.y = 1.7 + Math.sin(t * 5) * 0.02;
  });

  colliders.push({ x: PLAZA.x, z: PLAZA.z, r: 2.6 });

  // --- 5. EXCAVATED POND & WATER ---
  const shoreRing = new THREE.RingGeometry(8.6, 10.4, 36).rotateX(-Math.PI / 2);
  shoreRing.translate(POND.x, 0.02, POND.z);
  buckets.sand.push(colorize(shoreRing, 0xe2c68e));

  addPart(buckets.sand, B_CYL, POND.x, -0.35, POND.z, 8.8, 0.1, 8.8, 0x2e6b72);

  const pondWaterMat = track(
    new THREE.MeshStandardMaterial({
      color: 0x1dbfd8,
      roughness: 0.08,
      metalness: 0.12,
    })
  );
  const pondMesh = new THREE.Mesh(track(new THREE.CircleGeometry(8.62, 48).rotateX(-Math.PI / 2)), pondWaterMat);
  pondMesh.position.set(POND.x, 0.04, POND.z);
  pondMesh.matrixAutoUpdate = false;
  pondMesh.frustumCulled = false;
  pondMesh.updateMatrix();
  scene.add(pondMesh);

  const foamRing = new THREE.TorusGeometry(8.6, 0.07, 6, 48).rotateX(Math.PI / 2);
  foamRing.translate(POND.x, 0.048, POND.z);
  buckets.plant.push(colorize(foamRing, 0xffffff));

  // Shoreline rocks
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + (rand() - 0.5) * 0.15;
    const r = 8.9 + rand() * 0.8;
    const rx = POND.x + Math.cos(a) * r;
    const rz = POND.z + Math.sin(a) * r;
    const s = 0.5 + rand() * 0.45;
    addPart(buckets.rock, new THREE.DodecahedronGeometry(1, 0), rx, 0.15 * s, rz, s * 0.8, s * 0.6, s * 0.8, 0xa0acb4, rand(), rand() * Math.PI, 0);
  }

  // Lily Pads with Flowers
  const lilyPads: { mesh: THREE.Group; phase: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const a = rand() * Math.PI * 2;
    const r = 1.8 + rand() * 5.5;
    const lx = POND.x + Math.cos(a) * r;
    const lz = POND.z + Math.sin(a) * r;
    const s = 0.48 + rand() * 0.3;

    const padGroup = new THREE.Group();
    padGroup.position.set(lx, 0.048, lz);

    const padMesh = new THREE.Mesh(
      track(new THREE.CylinderGeometry(s, s, 0.015, 14, 1, false, 0, Math.PI * 1.8)),
      track(new THREE.MeshStandardMaterial({ color: 0x2e9b48, roughness: 0.6 }))
    );
    padGroup.add(padMesh);

    if (rand() < 0.65) {
      const flowerMat = track(new THREE.MeshStandardMaterial({ color: rand() < 0.5 ? 0xff4081 : 0xffffff, roughness: 0.4 }));
      for (let p = 0; p < 5; p++) {
        const pa = (p / 5) * Math.PI * 2;
        const petal = new THREE.Mesh(track(new THREE.ConeGeometry(0.05, 0.12, 4)), flowerMat);
        petal.position.set(Math.cos(pa) * 0.06, 0.05, Math.sin(pa) * 0.06);
        petal.rotation.z = Math.PI / 4;
        petal.rotation.y = pa;
        padGroup.add(petal);
      }
      const core = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.04, 6, 6)),
        track(new THREE.MeshStandardMaterial({ color: 0xffb800, roughness: 0.5 }))
      );
      core.position.y = 0.04;
      padGroup.add(core);
    }

    scene.add(padGroup);
    lilyPads.push({ mesh: padGroup, phase: rand() * Math.PI * 2 });
  }

  // Reeds
  for (let i = 0; i < 12; i++) {
    const a = rand() * Math.PI * 2;
    const r = 9.2 + rand() * 1.2;
    const cx = POND.x + Math.cos(a) * r;
    const cz = POND.z + Math.sin(a) * r;
    const n = 2 + Math.floor(rand() * 3);

    for (let j = 0; j < n; j++) {
      const h = 1.0 + rand() * 0.7;
      const rx = cx + (rand() - 0.5) * 0.6;
      const rz = cz + (rand() - 0.5) * 0.6;
      addPart(buckets.plant, B_CYL, rx, h / 2, rz, 0.024, h, 0.024, 0x388e3c, 0, 0, (rand() - 0.5) * 0.12);
      if (rand() > 0.4) {
        addPart(buckets.plant, B_CYL, rx, h + 0.1, rz, 0.05, 0.24, 0.05, 0x6d4c41);
      }
    }
  }

  // Bridge
  const bridgeX = POND.x + 6.8;
  const bridgeZ = POND.z - 4.5;
  const bridgeYaw = -0.5;

  for (let i = 0; i < 10; i++) {
    const t = i / 9;
    const archH = 0.25 + Math.sin(t * Math.PI) * 0.35;
    const bx = bridgeX + (t - 0.5) * 4.8 * Math.cos(bridgeYaw);
    const bz = bridgeZ + (t - 0.5) * 4.8 * Math.sin(bridgeYaw);
    addPart(buckets.wood, B_BOX, bx, archH, bz, 1.4, 0.06, 0.4, 0x945f30, 0, bridgeYaw, 0);

    if (i === 0 || i === 4 || i === 9) {
      for (const side of [-0.65, 0.65]) {
        const px = bx + side * Math.sin(bridgeYaw);
        const pz = bz - side * Math.cos(bridgeYaw);
        addPart(buckets.wood, B_BOX, px, archH + 0.4, pz, 0.08, 0.8, 0.08, 0x73431d);
      }
    }
  }

  const isOverBridge = (x: number, z: number): boolean => {
    return Math.hypot(x - bridgeX, z - bridgeZ) < 2.5;
  };

  updaters.push((t) => {
    for (const lp of lilyPads) {
      lp.mesh.position.y = 0.048 + Math.sin(t * 1.5 + lp.phase) * 0.003;
    }
  });

  colliders.push({ x: POND.x, z: POND.z, r: 8.8 });

  // --- 6. BUILD PROPS ---
  const props = buildProps({ scene, rand, addPart, buckets, findSpot, pathPoints, colliders });
  updaters.push(...props.updaters);

  // --- 7. MERGE GEOMETRIES (Frustum culling disabled to prevent popping/black triangles) ---
  const matFor = (flat: boolean, rough: number, metal = 0.0) =>
    track(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: rough, metalness: metal, flatShading: flat }));

  const mergeBucket = (name: string, mat: THREE.Material, cast: boolean, receive: boolean) => {
    const list = buckets[name];
    if (!list.length) return;

    for (const g of list) {
      if (!g.attributes.normal) g.computeVertexNormals();
      if (g.attributes.uv) g.deleteAttribute('uv');
    }

    const merged = mergeGeometries(list, false);
    if (!merged) {
      console.warn('mergeGeometries failed for bucket', name);
      return;
    }

    track(merged);
    for (const g of list) g.dispose();
    list.length = 0;

    const mesh = new THREE.Mesh(merged, mat);
    mesh.castShadow = cast;
    mesh.receiveShadow = receive;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false; // Never cull merged world meshes
    mesh.updateMatrix();
    scene.add(mesh);
  };

  mergeBucket('sand', matFor(false, 0.95), false, true);
  mergeBucket('stone', matFor(false, 0.85, 0.05), true, true);
  mergeBucket('wood', matFor(false, 0.75, 0.02), true, true);
  mergeBucket('trunk', matFor(true, 0.9), true, false);
  mergeBucket('leaf', matFor(true, 0.8), true, false);
  mergeBucket('fruit', matFor(false, 0.35, 0.05), true, false);
  mergeBucket('rock', matFor(true, 0.9, 0.05), true, true);
  mergeBucket('plant', matFor(true, 0.85), true, false);
  mergeBucket('lamp', matFor(false, 0.4, 0.3), true, false);

  B_CYL.dispose();
  B_BOX.dispose();

  return {
    colliders,
    isOverBridge,
    update(t, dt) {
      for (const u of updaters) u(t, dt);
    },
    dispose() {
      for (const d of disposables) d.dispose();
      disposables.length = 0;
    },
  };
}
