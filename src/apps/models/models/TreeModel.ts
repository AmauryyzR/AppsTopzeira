import * as THREE from 'three';

/**
 * Merges multiple BufferGeometries into a single BufferGeometry.
 */
function mergeGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const merged = new THREE.BufferGeometry();
  let totalPos = 0;
  let totalNorm = 0;
  let totalUv = 0;
  let totalIndex = 0;

  for (const g of geometries) {
    if (g.attributes.position) totalPos += g.attributes.position.array.length;
    if (g.attributes.normal) totalNorm += g.attributes.normal.array.length;
    if (g.attributes.uv) totalUv += g.attributes.uv.array.length;
    if (g.index) totalIndex += g.index.array.length;
  }

  const posArr = new Float32Array(totalPos);
  const normArr = new Float32Array(totalNorm);
  const uvArr = new Float32Array(totalUv);
  const indexArr = totalIndex > 0 ? new Uint32Array(totalIndex) : null;

  let posOffset = 0;
  let normOffset = 0;
  let uvOffset = 0;
  let indexOffset = 0;
  let vertexOffset = 0;

  for (const g of geometries) {
    const p = g.attributes.position;
    const n = g.attributes.normal;
    const u = g.attributes.uv;
    const idx = g.index;

    if (p) {
      posArr.set(p.array, posOffset);
      posOffset += p.array.length;
    }
    if (n) {
      normArr.set(n.array, normOffset);
      normOffset += n.array.length;
    }
    if (u) {
      uvArr.set(u.array, uvOffset);
      uvOffset += u.array.length;
    }
    if (idx && indexArr) {
      for (let i = 0; i < idx.array.length; i++) {
        indexArr[indexOffset + i] = idx.array[i] + vertexOffset;
      }
      indexOffset += idx.array.length;
    }
    if (p) {
      vertexOffset += p.count;
    }
  }

  merged.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  if (totalNorm > 0) merged.setAttribute('normal', new THREE.BufferAttribute(normArr, 3));
  if (totalUv > 0) merged.setAttribute('uv', new THREE.BufferAttribute(uvArr, 2));
  if (indexArr) merged.setIndex(new THREE.BufferAttribute(indexArr, 1));

  return merged;
}

/**
 * Smooth spherical normal transfer for cloud-like foliage crowns.
 */
function applySphericalNormals(
  geometry: THREE.BufferGeometry,
  clusterCenter: THREE.Vector3,
  globalCenter: THREE.Vector3,
  blend = 0.7
): void {
  const pos = geometry.getAttribute('position');
  const norm = geometry.getAttribute('normal');
  if (!pos || !norm) return;

  const v = new THREE.Vector3();
  const nCluster = new THREE.Vector3();
  const nGlobal = new THREE.Vector3();
  const nFinal = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    nCluster.subVectors(v, clusterCenter).normalize();
    nGlobal.subVectors(v, globalCenter).normalize();

    nFinal.copy(nCluster).multiplyScalar(blend).addScaledVector(nGlobal, 1 - blend).normalize();
    norm.setXYZ(i, nFinal.x, nFinal.y, nFinal.z);
  }
  norm.needsUpdate = true;
}

/**
 * Creates an organic foliage puff geometry.
 */
function createFoliagePuff(
  radius: number,
  center: THREE.Vector3,
  globalCenter: THREE.Vector3,
  scale: [number, number, number] = [1, 0.85, 1],
  seed = 0
): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(radius, 28, 22);
  const pos = geo.getAttribute('position');
  const p = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    p.x *= scale[0];
    p.y *= scale[1];
    p.z *= scale[2];

    const theta = Math.atan2(p.z, p.x);
    const phi = Math.acos(Math.max(-1, Math.min(1, p.y / (radius * scale[1] + 0.001))));
    const ripple = 1.0 + 0.08 * Math.sin(3 * theta + seed) * Math.cos(2 * phi);
    p.multiplyScalar(ripple);

    p.add(center);
    pos.setXYZ(i, p.x, p.y, p.z);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
  applySphericalNormals(geo, center, globalCenter, 0.7);
  return geo;
}

/**
 * Connects two 3D points with an oriented cylinder branch.
 */
function createBranch(
  from: THREE.Vector3,
  to: THREE.Vector3,
  radiusBottom: number,
  radiusTop: number,
  segments = 12
): THREE.BufferGeometry {
  const dir = new THREE.Vector3().subVectors(to, from);
  const len = dir.length();
  const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, len, segments, 2);

  geo.translate(0, len / 2, 0);
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  geo.applyQuaternion(quat);
  geo.translate(from.x, from.y, from.z);

  return geo;
}

/**
 * Generates an organic Oak Tree (Carvalho).
 */
export function createOakTree(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'OakTree';

  // --- TRUNK & ROOTS ---
  const trunkParts: THREE.BufferGeometry[] = [];
  const trunkHeight = 3.6;
  const trunkGeo = new THREE.CylinderGeometry(0.55, 0.85, trunkHeight, 18, 12);
  const pos = trunkGeo.getAttribute('position');
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const normY = (v.y + trunkHeight / 2) / trunkHeight;
    const angle = Math.atan2(v.z, v.x);

    // Root flares near base
    if (normY < 0.4) {
      const flareFade = Math.pow(1.0 - normY / 0.4, 2.0);
      const flare = Math.pow(Math.max(0, Math.cos(4 * angle + 0.2)), 2.0) * 0.55 * flareFade;
      v.x *= 1.0 + flare;
      v.z *= 1.0 + flare;
    }

    // Natural trunk curvature
    v.x += 0.15 * Math.sin(Math.PI * normY);
    v.z -= 0.1 * Math.sin(Math.PI * normY);

    pos.setXYZ(i, v.x, v.y + trunkHeight / 2, v.z);
  }
  pos.needsUpdate = true;
  trunkGeo.computeVertexNormals();
  trunkParts.push(trunkGeo);

  // Main Boughs/Branches
  const boughTop = new THREE.Vector3(0.15 * Math.sin(Math.PI), trunkHeight, -0.1 * Math.sin(Math.PI));
  const branches: [THREE.Vector3, THREE.Vector3, number, number][] = [
    [boughTop, new THREE.Vector3(1.7, trunkHeight + 1.2, 0.6), 0.38, 0.24],
    [boughTop, new THREE.Vector3(-1.6, trunkHeight + 1.1, -0.7), 0.36, 0.22],
    [boughTop, new THREE.Vector3(-0.5, trunkHeight + 1.5, 1.5), 0.35, 0.22],
    [boughTop, new THREE.Vector3(0.6, trunkHeight + 1.6, -1.4), 0.34, 0.20],
    [boughTop, new THREE.Vector3(0.1, trunkHeight + 2.0, 0.2), 0.40, 0.22],
    // Secondary sub-branches
    [new THREE.Vector3(1.7, trunkHeight + 1.2, 0.6), new THREE.Vector3(2.5, trunkHeight + 2.0, 0.9), 0.22, 0.12],
    [new THREE.Vector3(-1.6, trunkHeight + 1.1, -0.7), new THREE.Vector3(-2.4, trunkHeight + 1.8, -1.1), 0.20, 0.11],
    [new THREE.Vector3(-0.5, trunkHeight + 1.5, 1.5), new THREE.Vector3(-0.8, trunkHeight + 2.3, 2.2), 0.20, 0.11],
    [new THREE.Vector3(0.6, trunkHeight + 1.6, -1.4), new THREE.Vector3(1.0, trunkHeight + 2.4, -2.1), 0.18, 0.10],
  ];

  for (const [from, to, rBottom, rTop] of branches) {
    trunkParts.push(createBranch(from, to, rBottom, rTop));
  }

  const mergedTrunkGeo = mergeGeometries(trunkParts);
  mergedTrunkGeo.computeVertexNormals();

  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x543d2b,
    roughness: 0.85,
    metalness: 0.05,
    name: 'BarkMaterial',
  });

  const trunkMesh = new THREE.Mesh(mergedTrunkGeo, trunkMaterial);
  trunkMesh.name = 'TreeTrunk';
  trunkMesh.castShadow = true;
  trunkMesh.receiveShadow = true;
  group.add(trunkMesh);

  // --- CANOPY FOLIAGE ---
  const canopyParts: THREE.BufferGeometry[] = [];
  const globalCanopyCenter = new THREE.Vector3(0, trunkHeight + 2.2, 0);

  const foliageClusters: { center: [number, number, number]; r: number; scale: [number, number, number]; seed: number }[] = [
    // Central crowns
    { center: [0.0, trunkHeight + 2.4, 0.1], r: 2.2, scale: [1.15, 0.9, 1.15], seed: 1 },
    { center: [0.1, trunkHeight + 3.4, 0.0], r: 1.8, scale: [1.0, 0.85, 1.0], seed: 2 },
    { center: [0.0, trunkHeight + 4.2, -0.1], r: 1.3, scale: [0.95, 0.8, 0.95], seed: 3 },
    // Outer bough clusters
    { center: [2.1, trunkHeight + 1.8, 0.7], r: 1.65, scale: [1.1, 0.85, 1.05], seed: 4 },
    { center: [-1.9, trunkHeight + 1.7, -0.8], r: 1.6, scale: [1.05, 0.85, 1.1], seed: 5 },
    { center: [-0.6, trunkHeight + 2.0, 1.8], r: 1.55, scale: [1.1, 0.85, 1.0], seed: 6 },
    { center: [0.8, trunkHeight + 2.1, -1.6], r: 1.5, scale: [1.05, 0.85, 1.1], seed: 7 },
    // Sub-cluster accents
    { center: [2.6, trunkHeight + 2.2, 0.9], r: 1.2, scale: [1.0, 0.8, 1.0], seed: 8 },
    { center: [-2.4, trunkHeight + 2.0, -1.1], r: 1.15, scale: [1.0, 0.8, 1.0], seed: 9 },
    { center: [-0.9, trunkHeight + 2.5, 2.3], r: 1.1, scale: [0.95, 0.8, 0.95], seed: 10 },
    { center: [1.1, trunkHeight + 2.6, -2.1], r: 1.1, scale: [0.95, 0.8, 0.95], seed: 11 },
  ];

  for (const c of foliageClusters) {
    const puffCenter = new THREE.Vector3(...c.center);
    canopyParts.push(createFoliagePuff(c.r, puffCenter, globalCanopyCenter, c.scale, c.seed));
  }

  const mergedCanopyGeo = mergeGeometries(canopyParts);
  mergedCanopyGeo.computeVertexNormals();

  const foliageMaterial = new THREE.MeshStandardMaterial({
    color: 0x3d7e35,
    roughness: 0.65,
    metalness: 0.0,
    flatShading: false,
    name: 'FoliageMaterial',
  });

  const canopyMesh = new THREE.Mesh(mergedCanopyGeo, foliageMaterial);
  canopyMesh.name = 'TreeCanopy';
  canopyMesh.castShadow = true;
  canopyMesh.receiveShadow = true;
  group.add(canopyMesh);

  return group;
}

/**
 * Generates an organic Sakura Tree (Cerejeira).
 */
export function createSakuraTree(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'SakuraTree';

  const trunkParts: THREE.BufferGeometry[] = [];
  const trunkHeight = 3.2;
  const trunkGeo = new THREE.CylinderGeometry(0.42, 0.72, trunkHeight, 18, 10);
  const pos = trunkGeo.getAttribute('position');
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const normY = (v.y + trunkHeight / 2) / trunkHeight;
    const angle = Math.atan2(v.z, v.x);

    if (normY < 0.35) {
      const flareFade = Math.pow(1.0 - normY / 0.35, 2.0);
      const flare = Math.pow(Math.max(0, Math.cos(4 * angle + 0.5)), 2.0) * 0.45 * flareFade;
      v.x *= 1.0 + flare;
      v.z *= 1.0 + flare;
    }

    // Elegant bonsai-style curve
    v.x += 0.35 * Math.sin(Math.PI * normY);
    v.z += 0.15 * Math.sin(Math.PI * normY * 1.3);

    pos.setXYZ(i, v.x, v.y + trunkHeight / 2, v.z);
  }
  pos.needsUpdate = true;
  trunkGeo.computeVertexNormals();
  trunkParts.push(trunkGeo);

  const topPoint = new THREE.Vector3(0.35 * Math.sin(Math.PI), trunkHeight, 0.15 * Math.sin(Math.PI * 1.3));
  const branches: [THREE.Vector3, THREE.Vector3, number, number][] = [
    [topPoint, new THREE.Vector3(1.8, trunkHeight + 0.8, 1.2), 0.32, 0.18],
    [topPoint, new THREE.Vector3(-1.7, trunkHeight + 1.0, -1.0), 0.30, 0.17],
    [topPoint, new THREE.Vector3(-1.0, trunkHeight + 1.2, 1.4), 0.28, 0.16],
    [topPoint, new THREE.Vector3(1.2, trunkHeight + 1.4, -1.3), 0.28, 0.16],
  ];

  for (const [from, to, rBottom, rTop] of branches) {
    trunkParts.push(createBranch(from, to, rBottom, rTop));
  }

  const mergedTrunkGeo = mergeGeometries(trunkParts);
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x3d2b24,
    roughness: 0.8,
    name: 'SakuraBarkMaterial',
  });

  const trunkMesh = new THREE.Mesh(mergedTrunkGeo, trunkMaterial);
  trunkMesh.name = 'SakuraTrunk';
  trunkMesh.castShadow = true;
  trunkMesh.receiveShadow = true;
  group.add(trunkMesh);

  // Pink Blossom Canopy
  const canopyParts: THREE.BufferGeometry[] = [];
  const globalCanopyCenter = new THREE.Vector3(0.2, trunkHeight + 1.8, 0);

  const clusters: { center: [number, number, number]; r: number; scale: [number, number, number]; seed: number }[] = [
    { center: [0.3, trunkHeight + 1.8, 0.1], r: 2.1, scale: [1.25, 0.8, 1.25], seed: 15 },
    { center: [0.2, trunkHeight + 2.7, 0.0], r: 1.6, scale: [1.1, 0.75, 1.1], seed: 16 },
    { center: [2.1, trunkHeight + 1.4, 1.4], r: 1.5, scale: [1.2, 0.8, 1.2], seed: 17 },
    { center: [-1.9, trunkHeight + 1.5, -1.2], r: 1.5, scale: [1.2, 0.8, 1.2], seed: 18 },
    { center: [-1.2, trunkHeight + 1.7, 1.6], r: 1.4, scale: [1.15, 0.8, 1.15], seed: 19 },
    { center: [1.4, trunkHeight + 1.9, -1.5], r: 1.4, scale: [1.15, 0.8, 1.15], seed: 20 },
  ];

  for (const c of clusters) {
    canopyParts.push(createFoliagePuff(c.r, new THREE.Vector3(...c.center), globalCanopyCenter, c.scale, c.seed));
  }

  const mergedCanopyGeo = mergeGeometries(canopyParts);
  const foliageMaterial = new THREE.MeshStandardMaterial({
    color: 0xf59ebc,
    roughness: 0.6,
    metalness: 0.0,
    name: 'SakuraBlossomMaterial',
  });

  const canopyMesh = new THREE.Mesh(mergedCanopyGeo, foliageMaterial);
  canopyMesh.name = 'SakuraCanopy';
  canopyMesh.castShadow = true;
  canopyMesh.receiveShadow = true;
  group.add(canopyMesh);

  return group;
}

/**
 * Generates a Conifer Pine Tree (Pinheiro).
 */
export function createPineTree(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PineTree';

  // Tall straight trunk
  const trunkHeight = 6.0;
  const trunkGeo = new THREE.CylinderGeometry(0.28, 0.58, trunkHeight, 16);
  trunkGeo.translate(0, trunkHeight / 2, 0);

  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x473426,
    roughness: 0.85,
  });
  const trunkMesh = new THREE.Mesh(trunkGeo, trunkMaterial);
  trunkMesh.name = 'PineTrunk';
  trunkMesh.castShadow = true;
  trunkMesh.receiveShadow = true;
  group.add(trunkMesh);

  // Tiered Cones for needles
  const tiers = [
    { y: 2.2, r: 2.3, h: 2.0 },
    { y: 3.4, r: 1.9, h: 1.9 },
    { y: 4.5, r: 1.5, h: 1.8 },
    { y: 5.5, r: 1.1, h: 1.6 },
    { y: 6.4, r: 0.65, h: 1.4 },
  ];

  const coneParts: THREE.BufferGeometry[] = [];
  for (const tier of tiers) {
    const cone = new THREE.ConeGeometry(tier.r, tier.h, 16);
    cone.translate(0, tier.y + tier.h / 2, 0);
    coneParts.push(cone);
  }

  const mergedCanopyGeo = mergeGeometries(coneParts);
  const pineMaterial = new THREE.MeshStandardMaterial({
    color: 0x245431,
    roughness: 0.7,
  });

  const pineCanopy = new THREE.Mesh(mergedCanopyGeo, pineMaterial);
  pineCanopy.name = 'PineCanopy';
  pineCanopy.castShadow = true;
  pineCanopy.receiveShadow = true;
  group.add(pineCanopy);

  return group;
}

/**
 * Default Tree Model Creator
 */
export function createTreeModel(variant: 'oak' | 'sakura' | 'pine' = 'oak'): THREE.Group {
  switch (variant) {
    case 'sakura':
      return createSakuraTree();
    case 'pine':
      return createPineTree();
    case 'oak':
    default:
      return createOakTree();
  }
}
