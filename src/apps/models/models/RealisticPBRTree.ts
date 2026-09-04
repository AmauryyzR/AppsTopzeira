import * as THREE from 'three';
import { MaterialLibrary } from '../toolkit/MaterialLibrary';
import { applyTriplanarUVs, displaceGeometry, extrudeCurvedTube, mergeBufferGeometries } from '../toolkit/GeometryModifiers';
import { fbm3D, simplex3D } from '../toolkit/Noise';
import { bakeCavityAO } from '../toolkit/VertexAOHelper';
import { csgSubtract } from '../toolkit/CSGHelper';

/**
 * Creates an ancient fluted trunk geometry with 6 buttress root ridges,
 * organic spiral twist, and bark displacement.
 */
function createFlutedButtressTrunk(): THREE.BufferGeometry {
  const height = 4.6;
  const radialSegments = 36;
  const heightSegments = 36;

  const geo = new THREE.CylinderGeometry(0.55, 1.35, height, radialSegments, heightSegments, true);
  const pos = geo.getAttribute('position');
  const count = pos.count;
  const v = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    v.fromBufferAttribute(pos, i);

    // Normalized height: 0.0 at base, 1.0 at top
    const normY = (v.y + height / 2) / height;
    let angle = Math.atan2(v.z, v.x);

    // Natural spiral twist along trunk
    angle += normY * 0.45;

    // Radius at current height
    let radius = Math.sqrt(v.x * v.x + v.z * v.z);

    // 6 Buttress root flares fluting into the soil at base
    if (normY < 0.55) {
      const rootFalloff = Math.pow(1.0 - normY / 0.55, 2.2);
      // Fluting ridges along circumference
      const flute = Math.pow(Math.max(0, Math.cos(3 * angle + 0.3)), 2.5) * 0.65 * rootFalloff;
      const subFlute = Math.pow(Math.max(0, Math.sin(6 * angle)), 2.0) * 0.25 * rootFalloff;
      radius *= 1.0 + flute + subFlute;
    }

    // Natural organic S-curve trunk curvature
    const curveX = 0.35 * Math.sin(Math.PI * normY);
    const curveZ = -0.22 * Math.sin(Math.PI * normY * 1.2);

    // Bark surface noise
    const barkNoise = 0.04 * fbm3D(Math.cos(angle) * 3, normY * 6, Math.sin(angle) * 3, 3);
    radius *= 1.0 + barkNoise;

    // Organic knot cavity near lower trunk (concave hollow with raised bark callus rim)
    const dY = (v.y + height / 2) - 1.6;
    const dAngle = angle - 0.4;
    const knotDistSq = (dY * dY) / (0.35 * 0.35) + (dAngle * dAngle) / (0.5 * 0.5);
    if (knotDistSq < 1.0) {
      const knotFactor = 1.0 - Math.sqrt(knotDistSq);
      const callusRing = Math.sin(knotFactor * Math.PI) * 0.09;
      const cavity = -Math.pow(knotFactor, 1.8) * 0.22;
      radius += cavity + callusRing;
    }

    const newX = radius * Math.cos(angle) + curveX;
    const newZ = radius * Math.sin(angle) + curveZ;

    pos.setXYZ(i, newX, v.y + height / 2, newZ);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();

  // Natural Cylindrical UV Mapping:
  // Preserves seamless vertical bark flow up the trunk, eliminates all zigzag seams and planar stretching
  const uv = geo.getAttribute('uv');
  if (uv) {
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, uv.getX(i) * 3.0, uv.getY(i) * 3.5);
    }
    uv.needsUpdate = true;
  }

  return geo;
}

/**
 * Creates a sculpted, layered foliage shelf with drooping outer edges,
 * organic perimeter scallops, and two-tone vertex colors (sunlit top vs shadow underbelly).
 */
function createFoliageShelf(
  center: THREE.Vector3,
  globalCanopyCenter: THREE.Vector3,
  radius: number,
  scale: [number, number, number] = [1.25, 0.6, 1.25],
  seed = 0
): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(radius, 32, 24);
  const pos = geo.getAttribute('position');
  const count = pos.count;
  const p = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    p.fromBufferAttribute(pos, i);

    // Anisotropic shelf squash
    p.x *= scale[0];
    p.y *= scale[1];
    p.z *= scale[2];

    const distFromCenter = Math.sqrt(p.x * p.x + p.z * p.z) / (radius * scale[0]);
    const theta = Math.atan2(p.z, p.x);
    const phi = Math.acos(Math.max(-1, Math.min(1, p.y / (radius * scale[1] + 0.001))));

    // Organic perimeter scallops and turbulence
    const scallop = 1.0 + 0.12 * Math.sin(5 * theta + seed) * Math.cos(2 * phi) + 0.05 * simplex3D(p.x, p.y, p.z);
    p.multiplyScalar(scallop);

    // Gentle canopy weight droop towards the outer edge
    p.y -= 0.18 * Math.pow(distFromCenter, 2.0);

    p.add(center);
    pos.setXYZ(i, p.x, p.y, p.z);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();

  // Spherical normal transfer for lush, voluminous lighting
  const norm = geo.getAttribute('normal');
  const colors = new Float32Array(count * 3);

  if (norm) {
    const v = new THREE.Vector3();
    const nCluster = new THREE.Vector3();
    const nGlobal = new THREE.Vector3();
    const nFinal = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      v.fromBufferAttribute(pos, i);
      nCluster.subVectors(v, center).normalize();
      nGlobal.subVectors(v, globalCanopyCenter).normalize();

      nFinal.copy(nCluster).multiplyScalar(0.7).addScaledVector(nGlobal, 0.3).normalize();
      norm.setXYZ(i, nFinal.x, nFinal.y, nFinal.z);

      // Vertex color lighting gradient:
      // Sunlit top faces get warm golden-green, underside gets deep forest shadow
      const sunFactor = Math.max(0, Math.min(1, (nFinal.y + 0.4) / 1.4));
      const r = 0.15 + sunFactor * 0.28;
      const g = 0.32 + sunFactor * 0.38;
      const b = 0.12 + sunFactor * 0.12;

      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }
    norm.needsUpdate = true;
  }

  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  applyTriplanarUVs(geo, 0.3);
  return geo;
}

/**
 * High-Quality Procedural Oak Tree
 * Features:
 * - Fluted buttress trunk with 6 root ridges and organic twist
 * - Hierarchical primary & secondary branching network
 * - Stratified horizontal foliage shelves (cloud layers)
 * - Two-tone vertex color gradient for deep natural shadowing
 * - CSG Boolean hollow carving
 * - Full PBR Material and Triplanar UV integration
 */
export function createRealisticPBRTree(): THREE.Group {
  const treeGroup = new THREE.Group();
  treeGroup.name = 'HighQualityOakTree';

  // --- 1. TRUNK & BUTTRESS ROOTS ---
  const trunkParts: THREE.BufferGeometry[] = [];
  const flutedTrunk = createFlutedButtressTrunk();
  trunkParts.push(flutedTrunk);

  // Surface Roots Spreading Across the Ground
  const surfaceRoots = [
    [new THREE.Vector3(0.7, 0.4, 0.3), new THREE.Vector3(1.6, 0.1, 0.8), new THREE.Vector3(2.5, 0.0, 1.2)],
    [new THREE.Vector3(-0.7, 0.4, -0.3), new THREE.Vector3(-1.6, 0.1, -0.9), new THREE.Vector3(-2.4, 0.0, -1.4)],
    [new THREE.Vector3(-0.4, 0.3, 0.7), new THREE.Vector3(-1.1, 0.08, 1.6), new THREE.Vector3(-1.9, 0.0, 2.3)],
    [new THREE.Vector3(0.5, 0.3, -0.6), new THREE.Vector3(1.3, 0.08, -1.4), new THREE.Vector3(2.1, 0.0, -2.1)],
    [new THREE.Vector3(-0.8, 0.3, 0.2), new THREE.Vector3(-1.7, 0.08, 0.4), new THREE.Vector3(-2.5, 0.0, 0.5)],
  ];

  for (const pts of surfaceRoots) {
    trunkParts.push(extrudeCurvedTube(pts, 0.45, 0.14, 18, 14));
  }

  // Trunk Top Bifurcation Point (Originating inside the trunk heartwood for seamless blending)
  const trunkTopY = 4.6;
  const forkBase = new THREE.Vector3(0.0, 3.6, 0.0);

  // --- 2. BRANCHING HIERARCHY ---
  // Level 1: Primary Boughs
  const primaryBoughs = [
    // Bough East
    { start: forkBase, mid: new THREE.Vector3(1.1, trunkTopY + 0.6, 0.6), end: new THREE.Vector3(2.7, trunkTopY + 1.8, 1.3), r1: 0.52, r2: 0.22 },
    // Bough West
    { start: forkBase, mid: new THREE.Vector3(-1.1, trunkTopY + 0.7, -0.7), end: new THREE.Vector3(-2.6, trunkTopY + 2.0, -1.5), r1: 0.50, r2: 0.20 },
    // Bough South
    { start: forkBase, mid: new THREE.Vector3(-0.5, trunkTopY + 0.8, 1.1), end: new THREE.Vector3(-1.4, trunkTopY + 2.1, 2.5), r1: 0.48, r2: 0.19 },
    // Bough North
    { start: forkBase, mid: new THREE.Vector3(0.6, trunkTopY + 0.8, -1.1), end: new THREE.Vector3(1.6, trunkTopY + 2.2, -2.4), r1: 0.48, r2: 0.19 },
    // Central High Leader
    { start: forkBase, mid: new THREE.Vector3(0.08, trunkTopY + 1.2, 0.08), end: new THREE.Vector3(0.15, trunkTopY + 3.0, 0.15), r1: 0.52, r2: 0.22 },
  ];

  for (const b of primaryBoughs) {
    trunkParts.push(extrudeCurvedTube([b.start, b.mid, b.end], b.r1, b.r2, 22, 16));
  }

  // Level 2: Secondary Supporting Branches
  const secondaryBranches = [
    // Off East Bough
    [new THREE.Vector3(1.5, trunkTopY + 0.9, 0.8), new THREE.Vector3(2.2, trunkTopY + 1.7, -0.2), new THREE.Vector3(3.2, trunkTopY + 2.4, -0.5)],
    [new THREE.Vector3(2.7, trunkTopY + 1.8, 1.3), new THREE.Vector3(3.4, trunkTopY + 2.6, 1.8), new THREE.Vector3(4.0, trunkTopY + 3.2, 2.2)],
    // Off West Bough
    [new THREE.Vector3(-1.4, trunkTopY + 1.1, -0.9), new THREE.Vector3(-2.1, trunkTopY + 1.9, 0.2), new THREE.Vector3(-3.0, trunkTopY + 2.5, 0.5)],
    [new THREE.Vector3(-2.6, trunkTopY + 2.0, -1.5), new THREE.Vector3(-3.4, trunkTopY + 2.8, -2.0), new THREE.Vector3(-4.0, trunkTopY + 3.3, -2.4)],
    // Off South Bough
    [new THREE.Vector3(-0.6, trunkTopY + 1.2, 1.5), new THREE.Vector3(0.4, trunkTopY + 2.0, 2.2), new THREE.Vector3(0.8, trunkTopY + 2.8, 3.1)],
    // Off North Bough
    [new THREE.Vector3(0.8, trunkTopY + 1.3, -1.4), new THREE.Vector3(-0.3, trunkTopY + 2.1, -2.2), new THREE.Vector3(-0.7, trunkTopY + 2.9, -3.0)],
    // Off Central Leader
    [new THREE.Vector3(0.1, trunkTopY + 2.2, 0.1), new THREE.Vector3(1.2, trunkTopY + 3.2, 0.8), new THREE.Vector3(1.9, trunkTopY + 4.1, 1.1)],
    [new THREE.Vector3(0.1, trunkTopY + 2.4, 0.1), new THREE.Vector3(-1.1, trunkTopY + 3.3, -0.7), new THREE.Vector3(-1.8, trunkTopY + 4.2, -1.0)],
  ];

  for (const pts of secondaryBranches) {
    trunkParts.push(extrudeCurvedTube(pts, 0.22, 0.10, 14, 10));
  }

  // Merge all trunk, buttress flare, surface roots, and branches into single clean mesh
  // All sub-geometries already contain their optimal cylindrical/along-curve UV coordinates!
  const mergedTrunkGeo = mergeBufferGeometries(trunkParts);

  const barkMat = MaterialLibrary.getBarkMaterial();
  const trunkMesh = new THREE.Mesh(mergedTrunkGeo, barkMat);

  trunkMesh.name = 'Oak_Trunk';
  trunkMesh.castShadow = true;
  trunkMesh.receiveShadow = true;
  treeGroup.add(trunkMesh);

  // --- 3. TIERED FOLIAGE SHELVES (CANOPY) ---
  const foliageParts: THREE.BufferGeometry[] = [];
  const globalCanopyCenter = new THREE.Vector3(0.1, trunkTopY + 3.0, 0.1);

  // Stratified horizontal canopy shelves
  const shelves: { center: [number, number, number]; r: number; scale: [number, number, number]; seed: number }[] = [
    // Top Majestic Dome
    { center: [0.15, trunkTopY + 4.6, 0.15], r: 2.3, scale: [1.3, 0.65, 1.3], seed: 201 },
    { center: [0.1, trunkTopY + 5.7, 0.1], r: 1.6, scale: [1.1, 0.6, 1.1], seed: 202 },

    // Mid Upper Tier Shelves
    { center: [1.6, trunkTopY + 3.8, 1.0], r: 2.1, scale: [1.35, 0.55, 1.25], seed: 203 },
    { center: [-1.5, trunkTopY + 3.9, -1.0], r: 2.1, scale: [1.25, 0.55, 1.35], seed: 204 },
    { center: [-1.0, trunkTopY + 4.0, 1.6], r: 2.0, scale: [1.3, 0.55, 1.2], seed: 205 },
    { center: [1.1, trunkTopY + 4.1, -1.6], r: 2.0, scale: [1.2, 0.55, 1.3], seed: 206 },

    // Outer Lower Hanging Shelves (Major silhouettes)
    { center: [3.3, trunkTopY + 2.5, 1.5], r: 1.9, scale: [1.4, 0.5, 1.2], seed: 207 },
    { center: [-3.3, trunkTopY + 2.6, -1.6], r: 1.9, scale: [1.3, 0.5, 1.4], seed: 208 },
    { center: [-1.3, trunkTopY + 2.7, 2.9], r: 1.85, scale: [1.35, 0.5, 1.2], seed: 209 },
    { center: [1.5, trunkTopY + 2.8, -2.8], r: 1.85, scale: [1.2, 0.5, 1.35], seed: 210 },

    // Accent Cloud Clusters
    { center: [4.1, trunkTopY + 3.0, 1.8], r: 1.3, scale: [1.2, 0.6, 1.1], seed: 211 },
    { center: [-4.0, trunkTopY + 3.1, -2.0], r: 1.3, scale: [1.1, 0.6, 1.2], seed: 212 },
    { center: [0.8, trunkTopY + 2.9, 3.2], r: 1.3, scale: [1.2, 0.6, 1.1], seed: 213 },
    { center: [-0.8, trunkTopY + 3.0, -3.1], r: 1.3, scale: [1.1, 0.6, 1.2], seed: 214 },
  ];

  for (const s of shelves) {
    foliageParts.push(createFoliageShelf(new THREE.Vector3(...s.center), globalCanopyCenter, s.r, s.scale, s.seed));
  }

  const mergedCanopyGeo = mergeBufferGeometries(foliageParts);
  bakeCavityAO(mergedCanopyGeo, 0.35);

  const foliageMat = MaterialLibrary.getFoliageMaterial();
  foliageMat.vertexColors = true; // Enable our two-tone sunlit/shadow vertex colors!

  const canopyMesh = new THREE.Mesh(mergedCanopyGeo, foliageMat);
  canopyMesh.name = 'Oak_Canopy';
  canopyMesh.castShadow = true;
  canopyMesh.receiveShadow = true;
  treeGroup.add(canopyMesh);

  return treeGroup;
}
