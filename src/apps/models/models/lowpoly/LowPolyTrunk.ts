import * as THREE from 'three';
import {
  createBranchWoodMaterial,
  MASTER_BRANCH_T0,
  SUMMIT_BRANCH_T0,
  smoothRingSeamNormals,
} from './LowPolyBranch';

export interface TrunkBranchSocket {
  position: THREE.Vector3;
  direction: THREE.Vector3;
  quaternion: THREE.Quaternion;
  rotation: THREE.Euler;
  scale: number;
  radius: number;
}

export interface SocketDefinition {
  name: string;
  y: number;
  direction: THREE.Vector3;
  scale: number;
  radius: number;
  knollRadius: number;
}

/**
 * Botanical limb emergence definitions:
 * - 4 Lateral boughs distributed in a harmonious golden spiral phyllotaxis around the trunk
 * - 1 Zenith leader socket continuing the trunk leader upward into the apex canopy
 */
export const TRUNK_SOCKET_DEFINITIONS: SocketDefinition[] = [
  // 1. Lower Ancient Bough (y = 2.45m, South-East: +X, +Z)
  {
    name: 'Lower Ancient Bough',
    y: 2.35,
    direction: new THREE.Vector3(-0.95, 0.27, 0.10).normalize(),
    scale: 0.77,
    radius: 0.155,
    knollRadius: 0.075,
  },
  // 2. Mid Counter Bough (y = 3.25m, North-West: -X, -Z)
  {
    name: 'Mid Counter Bough',
    y: 3.10,
    direction: new THREE.Vector3(0.92, 0.33, 0.20).normalize(),
    scale: 1.03,
    radius: 0.145,
    knollRadius: 0.065,
  },
  // 3. High Canopy Bough (y = 3.95m, South-West: -X, +Z)
  {
    name: 'High Canopy Bough',
    y: 3.88,
    direction: new THREE.Vector3(-0.90, 0.28, -0.14).normalize(),
    scale: 0.96,
    radius: 0.138,
    knollRadius: 0.055,
  },
  // 4. Crown Fork Bough (y = 4.45m, North-East: +X, -Z)
  {
    name: 'Crown Fork Bough',
    y: 4.45,
    direction: new THREE.Vector3(0.45, 0.32, -0.86).normalize(),
    scale: 0.79,
    radius: 0.130,
    knollRadius: 0.048,
  },
  // 5. Central Summit Leader (y = 4.80m, continues trunk leader into apex dome)
  {
    name: 'Central Summit Leader',
    y: 4.80,
    direction: new THREE.Vector3(0.04, 0.98, -0.04).normalize(),
    scale: 1.00,
    radius: 0.145,
    knollRadius: 0.0,
  },
];

/**
 * Creates an ancient, elegant low-poly tree trunk inspired by Genshin Impact & Studio Ghibli.
 * Features:
 * - Clean, grounded flared base that sits smoothly on the terrain (all separate messy roots removed)
 * - 24-segment organic fluted cross-section with gentle S-curve sweep
 * - Staggered organic branch emergence (no flat shelf, no unnatural basket forks)
 * - Smooth transition into 5 main bough origins
 */
export function createSculptedTrunkGeometry(height = 4.85): THREE.BufferGeometry {
  const radialSegments = 64;
  const heightSegments = 64;
  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let s = 0; s <= heightSegments; s++) {
    const t = s / heightSegments;
    const y = t * height;

    // Organic S-curve gesture along the trunk height
    const curveX = Math.sin(t * Math.PI * 2.1) * 0.40 + t * 0.12;
    const curveZ = -Math.cos(t * Math.PI * 0.75) * 0.30 + Math.sin(t * Math.PI * 1.5) * 0.10;

    // Natural upward taper: robust ancient trunk tapering smoothly towards crown
    let baseR = 0.61 * Math.pow(Math.max(0.08, 1.0 - t * 0.76), 0.72);

    // Clean, elegant grounded bell flare at base (replaces messy separate roots)
    if (t < 0.32) {
      const baseT = 1.0 - t / 0.32;
      baseR += Math.pow(baseT, 2.2) * 0.48; // Gracefully widens to ~1.43m diameter at ground
    }

    // Smooth organic convergence at the very tip (inside summit foliage crown)
    if (t > 0.96) {
      const tipT = (t - 0.96) / 0.04;
      baseR *= Math.cos(tipT * Math.PI * 0.5);
    }

    // Gentle azimuthal bark twist
    const twist = t * 0.28;

    for (let i = 0; i <= radialSegments; i++) {
      const u = i / radialSegments;
      const angle = u * Math.PI * 2 + twist;

      // Soft organic fluted bark ribs (gentle and rounded, no sharp creases)
      const flute = Math.cos(angle * 5.0 + t * 2.1) * 0.060 * (1.0 - t * 0.4);

      // Subtle flare at the 4 cardinal buttresses that ground the trunk into the earth
      let cardinalGrip = 0;
      if (t < 0.32) {
        const gT = 1.0 - t / 0.32;
        const cardCos = Math.cos(angle * 5.0 + .4);
        cardinalGrip = Math.pow(Math.max(0, cardCos), 2.0) * 0.45 * Math.pow(gT, 1.7);
      }

      // Sculpted organic branch collar swellings (mounds) where limbs emerge
      let branchKnoll = 0;
      for (const def of TRUNK_SOCKET_DEFINITIONS.slice(0, 4)) {
        const moundAngle = Math.atan2(def.direction.z, def.direction.x);
        const dy = (y - def.y) / 0.38;
        let dAngle = Math.abs(angle - moundAngle);
        while (dAngle > Math.PI) dAngle = Math.abs(dAngle - Math.PI * 2);
        const dTheta = dAngle / 0.55;
        const dist2 = dy * dy + dTheta * dTheta;
        if (dist2 < 4.0) {
          branchKnoll += Math.exp(-dist2 * 0.80) * def.knollRadius;
        }
      }

      const finalR = Math.max(0.01, baseR + flute + cardinalGrip + branchKnoll);

      const px = Math.cos(angle) * finalR + curveX;
      const py = y;
      const pz = Math.sin(angle) * finalR + curveZ;

      vertices.push(px, py, pz);
      uvs.push(u, t);

      // Smooth organic normal pointing outward
      const nx = Math.cos(angle);
      const ny = (t < 0.18 ? 0.32 : (t > 0.95 ? 0.45 : 0.02));
      const nz = Math.sin(angle);
      const nLen = Math.hypot(nx, ny, nz) || 1.0;
      normals.push(nx / nLen, ny / nLen, nz / nLen);
    }
  }

  // Generate quad indices (CCW outward winding)
  const ringVerts = radialSegments + 1;
  for (let s = 0; s < heightSegments; s++) {
    for (let i = 0; i < radialSegments; i++) {
      const bL = s * ringVerts + i;
      const bR = bL + 1;
      const tL = (s + 1) * ringVerts + i;
      const tR = tL + 1;

      indices.push(bL, tL, bR);
      indices.push(bR, tL, tR);
    }
  }

  // Cap bottom at y = 0
  const bottomCenterIndex = vertices.length / 3;
  vertices.push(0, 0, 0);
  normals.push(0, -1, 0);
  uvs.push(0.5, 0.5);
  for (let i = 0; i < radialSegments; i++) {
    indices.push(bottomCenterIndex, i, i + 1);
  }

  // Smooth summit vertex
  const topCenterIndex = vertices.length / 3;
  const topX = Math.sin(Math.PI * 2.1) * 0.40 + 0.12;
  const topZ = -Math.cos(Math.PI * 0.75) * 0.30 + Math.sin(Math.PI * 1.5) * 0.10;
  vertices.push(topX, height + 0.02, topZ);
  normals.push(0, 1, 0);
  uvs.push(0.5, 0.5);

  const topRingStart = heightSegments * ringVerts;
  for (let i = 0; i < radialSegments; i++) {
    indices.push(topCenterIndex, topRingStart + i + 1, topRingStart + i);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  smoothRingSeamNormals(geo, radialSegments, heightSegments);

  return geo;
}

/**
 * Calculates the exact trunk centerline coordinates at any given height y.
 */
export function getTrunkCenterAt(y: number, height = 4.85): THREE.Vector3 {
  const t = Math.max(0, Math.min(1, y / height));
  const cx = Math.sin(t * Math.PI * 2.1) * 0.40 + t * 0.12;
  const cz = -Math.cos(t * Math.PI * 0.75) * 0.30 + Math.sin(t * Math.PI * 1.5) * 0.10;
  return new THREE.Vector3(cx, y, cz);
}

/**
 * Creates the Trunk Mesh with mathematically continuous branch attachment points.
 * Sockets use a natural golden-ratio decrescendo vertical rhythm:
 * y = 2.45m -> 3.25m -> 3.95m -> 4.45m -> 4.80m (summit).
 */
export function createLowPolyTrunkMesh(): { group: THREE.Group; sockets: TrunkBranchSocket[] } {
  const group = new THREE.Group();
  group.name = 'Sculpted_Trunk_Genshin';

  const woodMat = createBranchWoodMaterial();

  const trunkHeight = 4.85;
  const trunkGeo = createSculptedTrunkGeometry(trunkHeight);
  const trunkMesh = new THREE.Mesh(trunkGeo, woodMat);
  trunkMesh.castShadow = true;
  trunkMesh.receiveShadow = true;
  group.add(trunkMesh);

  // Construct mathematically aligned sockets with exact quaternions and matching bark knolls
  const sockets: TrunkBranchSocket[] = TRUNK_SOCKET_DEFINITIONS.map((def, idx) => {
    const isSummit = idx === 4;
    const baseT0 = isSummit ? SUMMIT_BRANCH_T0 : MASTER_BRANCH_T0;
    // Yaw first, then pitch: a shortest-arc rotation alone flips west-facing crowns upside down.
    const yaw = Math.atan2(baseT0.z, baseT0.x) - Math.atan2(def.direction.z, def.direction.x);
    const q = isSummit ? new THREE.Quaternion() : new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    const pitched = new THREE.Quaternion().setFromUnitVectors(baseT0.clone().applyQuaternion(q), def.direction);
    q.premultiply(pitched);
    const rot = new THREE.Euler().setFromQuaternion(q, 'XYZ');

    return {
      position: getTrunkCenterAt(def.y, trunkHeight),
      direction: def.direction.clone(),
      quaternion: q,
      rotation: rot,
      scale: def.scale,
      radius: def.radius,
    };
  });

  return { group, sockets };
}

