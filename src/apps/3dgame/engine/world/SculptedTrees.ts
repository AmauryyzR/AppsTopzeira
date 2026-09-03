import * as THREE from 'three';
import { createToonMaterial, TOON_PRESETS } from '../shaders/ToonMaterial';

export type SculptedTreeType = 'sakura' | 'oak' | 'pine';

export interface SculptedTreeDefinition {
  type: SculptedTreeType;
  position: [number, number]; // [x, z]
  scale?: number;
  rotationY?: number;
}

export interface TreeCollisionBox {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
}

/**
 * Helper to combine multiple BufferGeometries into a single BufferGeometry
 * without external dependencies, preserving positions, normals, and UVs.
 */
function mergeBufferGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
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
 * Spherical Normal Transfer:
 * Overrides per-vertex normals with normalized vectors originating from the cluster center
 * (blended with the global canopy center). This eliminates polyhedral facet cuts and soccer-ball
 * polygon edges in cel-shading, turning foliage into painterly Ghibli/Genshin cloud masses.
 */
export function applySphericalNormals(
  geometry: THREE.BufferGeometry,
  clusterCenter: THREE.Vector3,
  globalCanopyCenter?: THREE.Vector3,
  blendFactor: number = 0.75
): THREE.BufferGeometry {
  const posAttr = geometry.getAttribute('position');
  const normalAttr = geometry.getAttribute('normal');
  if (!posAttr || !normalAttr) return geometry;

  const v = new THREE.Vector3();
  const nCluster = new THREE.Vector3();
  const nGlobal = new THREE.Vector3();
  const nFinal = new THREE.Vector3();

  for (let i = 0; i < posAttr.count; i++) {
    v.fromBufferAttribute(posAttr, i);

    nCluster.subVectors(v, clusterCenter);
    if (nCluster.lengthSq() > 0.0001) {
      nCluster.normalize();
    } else {
      nCluster.set(0, 1, 0);
    }

    if (globalCanopyCenter) {
      nGlobal.subVectors(v, globalCanopyCenter);
      if (nGlobal.lengthSq() > 0.0001) {
        nGlobal.normalize();
      } else {
        nGlobal.set(0, 1, 0);
      }
      nFinal
        .copy(nCluster)
        .multiplyScalar(blendFactor)
        .addScaledVector(nGlobal, 1.0 - blendFactor)
        .normalize();
    } else {
      nFinal.copy(nCluster);
    }

    normalAttr.setXYZ(i, nFinal.x, nFinal.y, nFinal.z);
  }

  normalAttr.needsUpdate = true;
  return geometry;
}

/**
 * Creates an organic foliage puff (cloud-like dome/sphere) with smooth surface ripples
 * and Spherical Normal Transfer for AAA cel-shading.
 */
function createOrganicFoliagePuff(
  radius: number,
  center: THREE.Vector3,
  globalCanopyCenter: THREE.Vector3,
  widthScale = 1.0,
  heightScale = 0.88,
  depthScale = 1.0,
  seed = 0
): THREE.BufferGeometry {
  // Dense 20x16 sphere for smooth anime contours
  const geo = new THREE.SphereGeometry(radius, 20, 16);
  const pos = geo.getAttribute('position');
  const p = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);

    // Apply directional anisotropic squash/puffing
    p.x *= widthScale;
    p.y *= heightScale;
    p.z *= depthScale;

    // Organic harmonic wave ripple for painterly silhouette
    const theta = Math.atan2(p.z, p.x);
    const phi = Math.acos(Math.max(-1, Math.min(1, p.y / (radius * heightScale + 0.001))));
    const ripple =
      1.0 +
      0.07 * Math.sin(3 * theta + seed) * Math.cos(2 * phi) +
      0.04 * Math.sin(4 * phi + seed * 1.5);
    p.multiplyScalar(ripple);

    // Translate to cluster position in tree local coordinates
    p.add(center);
    pos.setXYZ(i, p.x, p.y, p.z);
  }

  pos.needsUpdate = true;

  // Apply Spherical Normal Transfer from the puff center!
  applySphericalNormals(geo, center, globalCanopyCenter, 0.72);

  return geo;
}

/**
 * Creates a stylized tree branch cylinder connecting two 3D points.
 */
function createBranchSegment(
  from: THREE.Vector3,
  to: THREE.Vector3,
  radiusBottom: number,
  radiusTop: number,
  radialSegments = 10
): THREE.BufferGeometry {
  const dir = new THREE.Vector3().subVectors(to, from);
  const length = dir.length();
  const geo = new THREE.CylinderGeometry(radiusTop, radiusBottom, length, radialSegments, 2);

  // Position base at origin and align with direction vector
  geo.translate(0, length / 2, 0);
  const up = new THREE.Vector3(0, 1, 0);
  const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
  geo.applyQuaternion(quat);
  geo.translate(from.x, from.y, from.z);

  return geo;
}

/**
 * Creates an organic Oak tree trunk with root flares, subtle bend, and upper branch supports.
 */
function createOakTrunkGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const height = 3.0;
  const radialSegs = 16;
  const heightSegs = 10;

  // 1. Main trunk body with 4 root flares and subtle bend
  const trunkBaseGeo = new THREE.CylinderGeometry(0.46, 0.78, height, radialSegs, heightSegs);
  const pos = trunkBaseGeo.getAttribute('position');
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    // Height ratio: 0.0 at base (y = -height/2), 1.0 at top (y = height/2)
    const normY = (v.y + height / 2) / height;
    const angle = Math.atan2(v.z, v.x);

    // 4 Organic root flares spreading into the grass terrain
    if (normY < 0.45) {
      const flareFade = Math.pow(1.0 - normY / 0.45, 2.2);
      const flare = Math.pow(Math.max(0, Math.cos(4 * angle + 0.35)), 2.0) * 0.42 * flareFade;
      v.x *= 1.0 + flare;
      v.z *= 1.0 + flare;
    }

    // Gentle organic curvature
    v.x += 0.12 * Math.sin(Math.PI * normY);
    v.z -= 0.08 * Math.sin(Math.PI * normY);

    pos.setXYZ(i, v.x, v.y + height / 2, v.z); // translate base to y = 0
  }

  pos.needsUpdate = true;
  trunkBaseGeo.computeVertexNormals();
  parts.push(trunkBaseGeo);

  // 2. Three stylized structural branches supporting the foliage puffs
  parts.push(
    createBranchSegment(
      new THREE.Vector3(0.04, 2.6, 0.0),
      new THREE.Vector3(0.85, 3.8, 0.45),
      0.22,
      0.12,
      8
    )
  );
  parts.push(
    createBranchSegment(
      new THREE.Vector3(-0.04, 2.5, 0.0),
      new THREE.Vector3(-0.80, 3.7, -0.55),
      0.20,
      0.11,
      8
    )
  );
  parts.push(
    createBranchSegment(
      new THREE.Vector3(0.0, 2.7, 0.0),
      new THREE.Vector3(-0.20, 4.1, 0.75),
      0.18,
      0.10,
      8
    )
  );

  const merged = mergeBufferGeometries(parts);
  for (const p of parts) p.dispose();
  return merged;
}

/**
 * Creates an artistic Japanese Sakura tree trunk with gnarled S-curve and expressive branching.
 */
function createSakuraTrunkGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const height = 3.2;
  const radialSegs = 16;
  const heightSegs = 12;

  const trunkBaseGeo = new THREE.CylinderGeometry(0.36, 0.68, height, radialSegs, heightSegs);
  const pos = trunkBaseGeo.getAttribute('position');
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    const normY = (v.y + height / 2) / height;
    const angle = Math.atan2(v.z, v.x);

    // 3 Tri-radial graceful root flares
    if (normY < 0.4) {
      const flareFade = Math.pow(1.0 - normY / 0.4, 2.0);
      const flare = Math.pow(Math.max(0, Math.cos(3 * angle)), 2.0) * 0.45 * flareFade;
      v.x *= 1.0 + flare;
      v.z *= 1.0 + flare;
    }

    // Expressive Bonsai-style S-curve
    v.x += 0.36 * Math.sin(Math.PI * normY) + 0.08 * Math.sin(2 * Math.PI * normY);
    v.z -= 0.22 * Math.sin(Math.PI * normY);

    pos.setXYZ(i, v.x, v.y + height / 2, v.z);
  }

  pos.needsUpdate = true;
  trunkBaseGeo.computeVertexNormals();
  parts.push(trunkBaseGeo);

  // Sculptural artistic branches reaching into pink sakura flower clouds
  parts.push(
    createBranchSegment(
      new THREE.Vector3(0.28, 2.7, -0.12),
      new THREE.Vector3(1.30, 3.8, 0.35),
      0.19,
      0.09,
      8
    )
  );
  parts.push(
    createBranchSegment(
      new THREE.Vector3(0.18, 2.6, -0.15),
      new THREE.Vector3(-1.15, 3.6, -0.45),
      0.18,
      0.08,
      8
    )
  );
  parts.push(
    createBranchSegment(
      new THREE.Vector3(0.24, 2.8, -0.10),
      new THREE.Vector3(0.25, 4.2, 0.85),
      0.17,
      0.08,
      8
    )
  );

  const merged = mergeBufferGeometries(parts);
  for (const p of parts) p.dispose();
  return merged;
}

/**
 * Creates a slender Alpine Pine trunk with base taper and subtle branch stubs.
 */
function createPineTrunkGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const height = 5.2; // Stops safely inside foliage tiers so it never sticks out bare at top
  const radialSegs = 14;
  const heightSegs = 12;

  const trunkBaseGeo = new THREE.CylinderGeometry(0.12, 0.48, height, radialSegs, heightSegs);
  const pos = trunkBaseGeo.getAttribute('position');
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    const normY = (v.y + height / 2) / height;
    const angle = Math.atan2(v.z, v.x);

    // Sturdy rooted base
    if (normY < 0.28) {
      const flareFade = Math.pow(1.0 - normY / 0.28, 2.0);
      const flare = Math.pow(Math.cos(4 * angle), 2.0) * 0.35 * flareFade;
      v.x *= 1.0 + flare;
      v.z *= 1.0 + flare;
    }

    pos.setXYZ(i, v.x, v.y + height / 2, v.z);
  }

  pos.needsUpdate = true;
  trunkBaseGeo.computeVertexNormals();
  parts.push(trunkBaseGeo);

  // Subtle horizontal branch stubs under canopy tiers
  parts.push(
    createBranchSegment(
      new THREE.Vector3(0, 2.0, 0),
      new THREE.Vector3(0.50, 2.1, 0.25),
      0.08,
      0.04,
      6
    )
  );
  parts.push(
    createBranchSegment(
      new THREE.Vector3(0, 3.1, 0),
      new THREE.Vector3(-0.45, 3.2, -0.22),
      0.07,
      0.035,
      6
    )
  );

  const merged = mergeBufferGeometries(parts);
  for (const p of parts) p.dispose();
  return merged;
}

/**
 * Creates an anime stylized pine foliage tier (bell/skirt shape) with upturned edges
 * and radial lobes, replacing stiff cones with Ghibli/Genshin alpine silhouette.
 */
function createPineSkirtGeometry(
  bottomRadius: number,
  topRadius: number,
  height: number,
  yOffset: number,
  upturnAmount = 0.28,
  radialLobes = 9,
  isApexSpire = false
): THREE.BufferGeometry {
  const radialSegs = 24;
  const heightSegs = 8;
  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const tierCenter = new THREE.Vector3(0, yOffset + height * 0.25, 0);

  // Generate vertices ring by ring from bottom (v=0) to top (v=1)
  for (let h = 0; h <= heightSegs; h++) {
    const v = h / heightSegs; // 0.0 at bottom, 1.0 at top
    // Bell curve radius: flairs wider at bottom
    const rBase = THREE.MathUtils.lerp(bottomRadius, Math.max(0.01, topRadius), Math.pow(v, 0.72));

    // Upturn curvature at bottom rim
    let upturnY = 0;
    if (v < 0.35) {
      const rimFactor = Math.pow(1.0 - v / 0.35, 1.8);
      upturnY = upturnAmount * rimFactor;
    }

    const y = yOffset + v * height + upturnY;

    for (let s = 0; s <= radialSegs; s++) {
      const u = s / radialSegs;
      const angle = u * Math.PI * 2;

      // Stylized petal/lobe ripples on rim
      const lobeMod = 1.0 + 0.06 * Math.cos(radialLobes * angle);
      const r = rBase * lobeMod;

      const px = Math.cos(angle) * r;
      const pz = Math.sin(angle) * r;
      const py = y;

      vertices.push(px, py, pz);
      uvs.push(u, v);

      // Spherical smooth normal pointing outward from tier center
      const nx = px - tierCenter.x;
      const ny = py - tierCenter.y + (v < 0.2 ? 0.2 : 0.0); // slight upward tilt on bottom lip
      const nz = pz - tierCenter.z;
      const len = Math.hypot(nx, ny, nz) || 1.0;
      normals.push(nx / len, ny / len, nz / len);
    }
  }

  // Standard Three.js Counter-Clockwise (CCW) front-facing quads
  for (let h = 0; h < heightSegs; h++) {
    for (let s = 0; s < radialSegs; s++) {
      const bL = h * (radialSegs + 1) + s;
      const bR = bL + 1;
      const tL = (h + 1) * (radialSegs + 1) + s;
      const tR = tL + 1;

      indices.push(bL, tL, bR);
      indices.push(tL, tR, bR);
    }
  }

  // Add subtle concave underside cap so camera looking upward sees clean foliage
  const underCenterIndex = vertices.length / 3;
  vertices.push(0, yOffset + 0.15, 0);
  normals.push(0, -1, 0);
  uvs.push(0.5, 0.5);

  const bottomRingStart = 0;
  for (let s = 0; s < radialSegs; s++) {
    const p1 = bottomRingStart + s;
    const p2 = bottomRingStart + s + 1;
    indices.push(underCenterIndex, p1, p2);
  }

  // If this is the apex spire or has a very small top radius, add a closed pinnacle apex vertex
  if (isApexSpire || topRadius <= 0.08) {
    const apexIndex = vertices.length / 3;
    vertices.push(0, yOffset + height + 0.38, 0);
    normals.push(0, 1, 0);
    uvs.push(0.5, 1.0);

    const topRingStart = heightSegs * (radialSegs + 1);
    for (let s = 0; s < radialSegs; s++) {
      const t1 = topRingStart + s;
      const t2 = topRingStart + s + 1;
      indices.push(apexIndex, t2, t1);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);

  return geo;
}

/**
 * AAA Sculpted Nature System (Ghibli / Zelda: Breath of the Wild / Genshin Impact style).
 * - Eliminates dodecahedra and hard cone artifacts.
 * - Organic sculpted trunks with root flares, subtle bends, and natural branch forks.
 * - Volumetric cloud foliage canopies with Spherical Normal Transfer for seamless cel-shading.
 * - 3 Master species: Sakura (Cherry Blossom), Summer Oak, and Alpine Pine.
 * - Master-shared geometry buffers & materials for ultra-efficient rendering across 28+ trees.
 * - Rigorous zero-leak disposal.
 */
export class SculptedTreesManager {
  public readonly group = new THREE.Group();
  public readonly collisionBoxes: TreeCollisionBox[] = [];

  // Master shared geometries (allocated once, reused across all instances)
  private masterGeometries: THREE.BufferGeometry[] = [];
  // Master shared materials
  private masterMaterials: THREE.Material[] = [];

  constructor(onAddCollision?: (x: number, y: number, z: number, w: number, h: number, d: number) => void) {
    this.buildMasterAssetsAndTrees(onAddCollision);
  }

  private trackGeo<T extends THREE.BufferGeometry>(geo: T): T {
    this.masterGeometries.push(geo);
    return geo;
  }

  private trackMat<T extends THREE.Material>(mat: T): T {
    this.masterMaterials.push(mat);
    return mat;
  }

  private buildMasterAssetsAndTrees(
    onAddCollision?: (x: number, y: number, z: number, w: number, h: number, d: number) => void
  ) {
    // -------------------------------------------------------------
    // 1. MASTER MATERIALS (Curated Cel-Shaded Anime Palettes)
    // -------------------------------------------------------------
    // Trunk wood material
    const woodMat = this.trackMat(createToonMaterial(TOON_PRESETS.wood));

    // Summer Oak Foliage: Meadow Green & Emerald Sunlit Highlights
    const oakMeadowMat = this.trackMat(
      createToonMaterial({
        color: 0x34b85c, // Vibrant Zelda BotW meadow green
        gradientBands: 3,
        rimColor: 0xa7f3d0, // Sunlit foliage edge glow
        rimPower: 2.6,
        rimIntensity: 0.65,
        shadowColor: 0x14532d, // Deep jade anime shadow
        shadowIntensity: 0.55,
      })
    );

    const oakEmeraldMat = this.trackMat(
      createToonMaterial({
        color: 0x4ade80, // Lighter emerald canopy crown highlight
        gradientBands: 3,
        rimColor: 0xdcfce7,
        rimPower: 2.8,
        rimIntensity: 0.70,
        shadowColor: 0x166534,
        shadowIntensity: 0.50,
      })
    );

    // Sakura Blossom Foliage: Anime Pink & Soft Pale Blossom
    const sakuraPinkMat = this.trackMat(
      createToonMaterial({
        color: 0xf472b6, // Vibrant anime sakura petal pink (#f472b6)
        gradientBands: 4,
        rimColor: 0xffedd5, // Soft morning peach rim
        rimPower: 2.7,
        rimIntensity: 0.55,
        shadowColor: 0xdb2777, // Rich magenta petal shadow (#db2777)
        shadowIntensity: 0.48,
      })
    );

    const sakuraHighlightMat = this.trackMat(
      createToonMaterial({
        color: 0xfbcfe8, // Soft pale petal crown (#fbcfe8)
        gradientBands: 4,
        rimColor: 0xfff1f2, // Pearl blossom rim
        rimPower: 2.5,
        rimIntensity: 0.65,
        shadowColor: 0xdb2777, // (#db2777)
        shadowIntensity: 0.45,
      })
    );

    // Alpine Pine Foliage: Deep Evergreen & Sunlit Pine
    const pineDeepMat = this.trackMat(
      createToonMaterial({
        color: 0x1e7846, // Cool alpine pine green
        gradientBands: 3,
        rimColor: 0xa7f3d0, // Mint frosted edge rim
        rimPower: 2.7,
        rimIntensity: 0.65,
        shadowColor: 0x0f3d23, // Deep evergreen midnight shadow
        shadowIntensity: 0.60,
        side: THREE.DoubleSide,
      })
    );

    const pineLightMat = this.trackMat(
      createToonMaterial({
        color: 0x22c55e, // Fresh pine needle highlight
        gradientBands: 3,
        rimColor: 0xd1fae5,
        rimPower: 2.5,
        rimIntensity: 0.70,
        shadowColor: 0x14532d,
        shadowIntensity: 0.55,
        side: THREE.DoubleSide,
      })
    );

    // -------------------------------------------------------------
    // 2. MASTER TRUNK GEOMETRIES
    // -------------------------------------------------------------
    const oakTrunkGeo = this.trackGeo(createOakTrunkGeometry());
    const sakuraTrunkGeo = this.trackGeo(createSakuraTrunkGeometry());
    const pineTrunkGeo = this.trackGeo(createPineTrunkGeometry());

    // -------------------------------------------------------------
    // 3. MASTER CANOPY GEOMETRIES (Spherical Normal Transfer Applied)
    // -------------------------------------------------------------
    // A. Summer Oak Foliage Canopies
    const oakCanopyCenter = new THREE.Vector3(0, 4.4, 0);

    // Oak Layer A (Meadow Green Puffs)
    const oakPuffsA: THREE.BufferGeometry[] = [
      createOrganicFoliagePuff(1.65, new THREE.Vector3(0.7, 3.8, 1.1), oakCanopyCenter, 1.1, 0.85, 1.05, 1.2),
      createOrganicFoliagePuff(1.60, new THREE.Vector3(-1.3, 3.8, -0.3), oakCanopyCenter, 1.05, 0.88, 1.1, 2.4),
      createOrganicFoliagePuff(1.50, new THREE.Vector3(1.3, 3.6, -0.6), oakCanopyCenter, 1.1, 0.85, 1.0, 3.1),
      createOrganicFoliagePuff(1.35, new THREE.Vector3(-0.1, 3.3, -1.3), oakCanopyCenter, 1.15, 0.82, 1.0, 4.0),
    ];
    const oakCanopyGeoA = this.trackGeo(mergeBufferGeometries(oakPuffsA));
    for (const g of oakPuffsA) g.dispose();

    // Oak Layer B (Emerald Sunlit Apex & Accent Puffs)
    const oakPuffsB: THREE.BufferGeometry[] = [
      createOrganicFoliagePuff(2.10, new THREE.Vector3(0.0, 4.6, 0.0), oakCanopyCenter, 1.1, 0.9, 1.1, 0.0),
      createOrganicFoliagePuff(1.40, new THREE.Vector3(-0.8, 3.5, 0.95), oakCanopyCenter, 1.05, 0.85, 1.05, 5.2),
    ];
    const oakCanopyGeoB = this.trackGeo(mergeBufferGeometries(oakPuffsB));
    for (const g of oakPuffsB) g.dispose();

    // B. Sakura Cherry Blossom Canopies
    const sakuraCanopyCenter = new THREE.Vector3(0.1, 4.5, 0.1);

    // Sakura Layer A (Vibrant Anime Pink #f472b6)
    const sakuraPuffsA: THREE.BufferGeometry[] = [
      createOrganicFoliagePuff(1.65, new THREE.Vector3(1.35, 3.9, 0.35), sakuraCanopyCenter, 1.15, 0.85, 1.05, 1.7),
      createOrganicFoliagePuff(1.55, new THREE.Vector3(-1.25, 3.7, -0.45), sakuraCanopyCenter, 1.1, 0.88, 1.1, 2.9),
      createOrganicFoliagePuff(1.30, new THREE.Vector3(-0.55, 3.5, -1.05), sakuraCanopyCenter, 1.15, 0.82, 1.05, 4.3),
    ];
    const sakuraCanopyGeoA = this.trackGeo(mergeBufferGeometries(sakuraPuffsA));
    for (const g of sakuraPuffsA) g.dispose();

    // Sakura Layer B (Soft Pale Blossom Crown #fbcfe8)
    const sakuraPuffsB: THREE.BufferGeometry[] = [
      createOrganicFoliagePuff(1.85, new THREE.Vector3(0.15, 4.65, 0.0), sakuraCanopyCenter, 1.1, 0.88, 1.1, 0.5),
      createOrganicFoliagePuff(1.40, new THREE.Vector3(0.35, 3.75, 1.25), sakuraCanopyCenter, 1.05, 0.85, 1.05, 3.6),
    ];
    const sakuraCanopyGeoB = this.trackGeo(mergeBufferGeometries(sakuraPuffsB));
    for (const g of sakuraPuffsB) g.dispose();

    // C. Alpine Pine Upturned Skirt Tiers (Dense overlapping Ghibli evergreen tiers)
    // Pine Layer A (Deep Lower Tiers)
    const pineTiersA: THREE.BufferGeometry[] = [
      createPineSkirtGeometry(2.55, 0.85, 2.0, 1.8, 0.32, 9, false), // Tier 1: Base skirt (y: 1.8 -> 3.8)
      createPineSkirtGeometry(2.10, 0.65, 1.8, 2.9, 0.28, 8, false), // Tier 2: Mid-lower skirt (y: 2.9 -> 4.7)
    ];
    const pineCanopyGeoA = this.trackGeo(mergeBufferGeometries(pineTiersA));
    for (const g of pineTiersA) g.dispose();

    // Pine Layer B (Sunlit Upper Tiers with closed pinnacle)
    const pineTiersB: THREE.BufferGeometry[] = [
      createPineSkirtGeometry(1.60, 0.45, 1.6, 3.9, 0.22, 7, false), // Tier 3: Mid-upper skirt (y: 3.9 -> 5.5)
      createPineSkirtGeometry(1.15, 0.02, 1.8, 4.9, 0.18, 6, true),  // Tier 4: Top spire with closed apex (y: 4.9 -> 7.08)
    ];
    const pineCanopyGeoB = this.trackGeo(mergeBufferGeometries(pineTiersB));
    for (const g of pineTiersB) g.dispose();

    // -------------------------------------------------------------
    // 4. INSTANTIATE 28 TREES ACROSS PARK WITH PRECISE ROOT COLLISIONS
    // -------------------------------------------------------------
    const treePlacements: [number, number][] = [
      // Quadrant 1 (North-East)
      [16, 16], [28, 12], [22, 26], [34, 30], [12, 34],
      // Quadrant 2 (North-West)
      [-16, 18], [-26, 14], [-20, 28], [-32, 26], [-14, 36],
      // Quadrant 3 (South-East)
      [18, -16], [26, -22], [14, -30], [30, -32], [36, -14],
      // Quadrant 4 (South-West)
      [-18, -18], [-28, -20], [-16, -32], [-32, -30], [-34, -14],
      // Outer perimeter groves
      [48, 7], [-48, 7], [7, 48], [-7, -48],
      [45, 45], [-45, 45], [45, -45], [-45, -45],
    ];

    for (let i = 0; i < treePlacements.length; i++) {
      const [x, z] = treePlacements[i];
      // Harmonious scale variance (0.86 to 1.16)
      const scale = 0.86 + (i % 6) * 0.06;
      // Rotational yaw variation for natural asymmetry
      const yaw = ((i * 137.5) * Math.PI) / 180; // Golden angle distribution

      // Cycle species: 0 = Pine, 1 = Summer Oak, 2 = Sakura Cherry Blossom
      const speciesIndex = i % 3;

      const treeGroup = new THREE.Group();
      treeGroup.position.set(x, 0, z);
      treeGroup.rotation.y = yaw;
      treeGroup.scale.set(scale, scale, scale);

      if (speciesIndex === 0) {
        // --- Alpine Pine ---
        const trunkMesh = new THREE.Mesh(pineTrunkGeo, woodMat);
        trunkMesh.castShadow = true;
        trunkMesh.receiveShadow = true;
        treeGroup.add(trunkMesh);

        const canopyAMesh = new THREE.Mesh(pineCanopyGeoA, pineDeepMat);
        canopyAMesh.castShadow = true;
        canopyAMesh.receiveShadow = true;
        treeGroup.add(canopyAMesh);

        const canopyBMesh = new THREE.Mesh(pineCanopyGeoB, pineLightMat);
        canopyBMesh.castShadow = true;
        canopyBMesh.receiveShadow = true;
        treeGroup.add(canopyBMesh);

        // Precise solid trunk collision at base only
        const collW = 0.72 * scale;
        const collH = 3.6 * scale;
        this.addCollisionInternal(x, 0, z, collW, collH, collW, onAddCollision);
      } else if (speciesIndex === 1) {
        // --- Summer Oak ---
        const trunkMesh = new THREE.Mesh(oakTrunkGeo, woodMat);
        trunkMesh.castShadow = true;
        trunkMesh.receiveShadow = true;
        treeGroup.add(trunkMesh);

        const canopyAMesh = new THREE.Mesh(oakCanopyGeoA, oakMeadowMat);
        canopyAMesh.castShadow = true;
        canopyAMesh.receiveShadow = true;
        treeGroup.add(canopyAMesh);

        const canopyBMesh = new THREE.Mesh(oakCanopyGeoB, oakEmeraldMat);
        canopyBMesh.castShadow = true;
        canopyBMesh.receiveShadow = true;
        treeGroup.add(canopyBMesh);

        // Solid trunk collision at base only
        const collW = 0.88 * scale;
        const collH = 3.2 * scale;
        this.addCollisionInternal(x, 0, z, collW, collH, collW, onAddCollision);
      } else {
        // --- Sakura Cherry Blossom ---
        const trunkMesh = new THREE.Mesh(sakuraTrunkGeo, woodMat);
        trunkMesh.castShadow = true;
        trunkMesh.receiveShadow = true;
        treeGroup.add(trunkMesh);

        const canopyAMesh = new THREE.Mesh(sakuraCanopyGeoA, sakuraPinkMat);
        canopyAMesh.castShadow = true;
        canopyAMesh.receiveShadow = true;
        treeGroup.add(canopyAMesh);

        const canopyBMesh = new THREE.Mesh(sakuraCanopyGeoB, sakuraHighlightMat);
        canopyBMesh.castShadow = true;
        canopyBMesh.receiveShadow = true;
        treeGroup.add(canopyBMesh);

        // Solid trunk collision at base only
        const collW = 0.78 * scale;
        const collH = 3.2 * scale;
        this.addCollisionInternal(x, 0, z, collW, collH, collW, onAddCollision);
      }

      this.group.add(treeGroup);
    }
  }

  private addCollisionInternal(
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    callback?: (x: number, y: number, z: number, w: number, h: number, d: number) => void
  ) {
    this.collisionBoxes.push({ x, y, z, width: w, height: h, depth: d });
    callback?.(x, y, z, w, h, d);
  }

  /**
   * Complete memory cleanup: disposes all master shared geometries and materials,
   * avoiding any WebGL buffer or texture leak.
   */
  public dispose() {
    for (const g of this.masterGeometries) {
      g.dispose();
    }
    this.masterGeometries = [];

    for (const m of this.masterMaterials) {
      m.dispose();
    }
    this.masterMaterials = [];

    while (this.group.children.length > 0) {
      const child = this.group.children[0];
      this.group.remove(child);
    }
  }
}
