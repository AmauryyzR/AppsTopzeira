import * as THREE from 'three';
import { createToonMaterial } from '../../../3dgame/engine/shaders/ToonMaterial';

/**
 * Creates an elegant, faceted 3D low-poly leaf inspired by Genshin Impact & Studio Ghibli.
 * Features:
 * - Curved central spine/midrib (vinco diedro) creating sharp 3D light & shadow separation
 * - Aerodynamic lanceolate blade with gentle natural downward droop at the tip
 * - Double-faceted flanks catching specular highlights and cel-shaded tones
 * - Base petiole/stem cleanly recessed so it connects seamlessly to twigs without clipping
 */
/** A single-sided indexed blade; DoubleSide supplies the underside without cancelling normals. */
export function createSingleLeafGeometry(length = 0.48, width = 0.24): THREE.BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  // Alternating shoulders give each leaf a soft, pointed, illustrated oak silhouette.
  const stations = [[0,0], [.16,.42], [.29,.78], [.37,.60], [.49,1], [.59,.73], [.69,.79], [.79,.43], [.88,.32], [1,0]];
  for (const [t,w] of stations) {
    const arch = Math.sin(t*Math.PI)*length*.13 - t*t*length*.16;
    positions.push(-w*width*.5,arch-length*.055*w,t*length);
    positions.push(0,arch+length*.035*w,t*length);
    positions.push(w*width*.5,arch-length*.055*w,t*length);
  }
  for(let i=0;i<stations.length-1;i++) {
    const k=i*3;
    indices.push(k,k+3,k+1,k+1,k+3,k+4,k+1,k+4,k+2,k+2,k+4,k+5);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geo.setIndex(indices);
  geo.setAttribute('color',new THREE.Float32BufferAttribute(new Float32Array(positions.length).fill(1),3));
  geo.computeVertexNormals();
  return geo;
}

export type LeafShadePalette = 'sunlit' | 'meadow' | 'jade';

/**
 * Creates AAA anime-grade Toon leaf material with:
 * - 3 discrete cel-shading bands
 * - Dual-lobe Subsurface Scattering (SSS): sunlight shining through foliage creates glowing chlorophyll emerald/lime
 * - Fine White Glow Rim (signature Genshin razor-thin silhouette contour)
 * - Deep anime jade/forest shadow (no dirty black shadows)
 * - Micro-specular sheen catching light on leaf facet ridges
 */
export function createLeafMaterial(
  shade: LeafShadePalette | number = 'meadow',
  enableWind = true
): THREE.MeshStandardMaterial {
  const palette = {sunlit: 0x9bbd29, meadow: 0x5f921f, jade: 0x305d21};
  const material = new THREE.MeshStandardMaterial({
    color: typeof shade === 'number' ? shade : palette[shade],
    roughness: .86, metalness: 0, side: THREE.DoubleSide, vertexColors: true,
    // A small green bounce keeps the deepest layers readable without a neon rim.
    emissive: 0x223809, emissiveIntensity: .08,
  });
  if (enableWind) {
    material.userData.enableWindSway = true;
    material.onBeforeCompile = shader => {
      shader.uniforms.uTime = {value: 0};
      shader.vertexShader = 'uniform float uTime;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
        #include <begin_vertex>
        float sway = smoothstep(2.0, 7.0, position.y) * 0.018;
        transformed.x += sin(uTime * 1.4 + position.y * 1.7 + position.z) * sway;
        transformed.z += cos(uTime * 1.1 + position.x * 1.6) * sway * 0.6;
      `);
      material.userData.shader = shader;
    };
    material.customProgramCacheKey = () => 'painted-oak-wind-v1';
  }
  return material;
}

/**
 * Creates an individual leaf Mesh for inspection in the 3D studio.
 */
export function createSingleLeafMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Single_LowPoly_Leaf_Genshin';

  // Leaf blade (magnified and beautifully posed)
  const leafGeo = createSingleLeafGeometry(1.6, 0.85);
  const leafMat = createLeafMaterial('sunlit', false);
  const leafMesh = new THREE.Mesh(leafGeo, leafMat);
  leafMesh.castShadow = true;
  leafMesh.receiveShadow = true;

  // Dynamic presentation angle showing 3D dihedral spine & rim
  leafMesh.position.set(0, 0.45, -0.6);
  leafMesh.rotation.x = -Math.PI / 4.5;
  leafMesh.rotation.y = 0.2;
  group.add(leafMesh);

  // Stylized wood petiole / stem
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.04, 0.22, -0.28),
    new THREE.Vector3(0, 0.45, -0.6),
  ]);
  const stemGeo = new THREE.TubeGeometry(stemCurve, 6, 0.025, 5, false);
  const stemMat = createToonMaterial({
    color: 0x855232,
    gradientBands: 3,
    rimColor: 0xfde68a,
    rimPower: 3.5,
    rimIntensity: 0.35,
    shadowColor: 0x482614,
  });
  const stemMesh = new THREE.Mesh(stemGeo, stemMat);
  stemMesh.castShadow = true;
  group.add(stemMesh);

  return group;
}

/**
 * Creates a dense, structured sprig of multiple leaves on a small branching twig.
 * The twig stem is strictly shorter than the leaf canopy so NO brown sticks poke out!
 */
export function createLeafSprig(
  leafCount = 16,
  scale = 0.68,
  shade: LeafShadePalette = 'meadow'
): { woodGeometry: THREE.BufferGeometry; leafGeometry: THREE.BufferGeometry } {
  const leafGeoBase = createSingleLeafGeometry(scale, scale * 0.50);
  const leafGeometries: THREE.BufferGeometry[] = [];
  const woodGeometries: THREE.BufferGeometry[] = [];

  // Short supporting stem that stays well within the leaf envelope
  const twigLength = scale * 0.72;
  const twigGeo = new THREE.CylinderGeometry(0.014 * scale, 0.028 * scale, twigLength, 6, 2);
  twigGeo.translate(0, twigLength / 2, 0);
  woodGeometries.push(twigGeo);

  // Distribute leaves in golden ratio phyllotaxis with natural outward curves
  const goldenAngle = 2.39996;
  for (let i = 0; i < leafCount; i++) {
    const t = (i + 1) / (leafCount + 1);
    const leafGeo = leafGeoBase.clone();

    // Natural scale curve: broader mature leaves in middle, younger leaves at tip
    const sizeBell = Math.sin(t * Math.PI) * 0.30 + 0.75;
    const leafScale = sizeBell * (0.90 + (i % 3) * 0.08);
    leafGeo.scale(leafScale, leafScale, leafScale);

    const angle = i * goldenAngle;
    const droop = 0.44 + (1.0 - t) * 0.38;

    leafGeo.rotateX(droop);
    leafGeo.rotateY(angle);
    leafGeo.rotateZ(i % 2 === 0 ? 0.14 : -0.14);

    const stemOffset = t * twigLength;
    leafGeo.translate(
      Math.sin(angle) * (0.035 * scale),
      stemOffset,
      Math.cos(angle) * (0.035 * scale)
    );

    leafGeometries.push(leafGeo);
  }

  // Apex crowning leaves at the tip that umbrella over the stem tip completely
  for (let a = 0; a < 4; a++) {
    const crownAngle = a * (Math.PI * 2 / 4) + 0.3;
    const crownGeo = leafGeoBase.clone();
    crownGeo.scale(0.85, 0.85, 0.85);
    crownGeo.rotateX(0.24);
    crownGeo.rotateY(crownAngle);
    crownGeo.translate(
      Math.sin(crownAngle) * 0.02 * scale,
      twigLength * 0.98,
      Math.cos(crownAngle) * 0.02 * scale
    );
    leafGeometries.push(crownGeo);
  }

  return {
    woodGeometry: mergeBufferGeometriesFast(woodGeometries),
    leafGeometry: mergeBufferGeometriesFast(leafGeometries),
  };
}

/**
 * Creates a lush, volumetric Foliage Cloud Dome (cumulus cluster) inspired by Genshin Impact.
 * Key enhancements:
 * - Completely eliminates protruding sticks: NO wood geometry extends above the bottom socket
 * - 360-degree lush leaf coverage: Upper dome, billowing equator, and downward soffit leaves
 * - Dense internal core to eliminate see-through holes
 * - Smooth overlapping leaves that catch cel-shading highlights like anime clouds
 */
export function createFoliageCloudCluster(
  radiusX = 1.70,
  radiusY = 1.30,
  radiusZ = 1.70,
  leafScale = 0.68
): { woodGeometry: THREE.BufferGeometry; leafGeometry: THREE.BufferGeometry } {
  const leafGeoBase = createSingleLeafGeometry(leafScale, leafScale * 0.48);
  const leafGeometries: THREE.BufferGeometry[] = [];
  const woodGeometries: THREE.BufferGeometry[] = [];

  // 1. UNDERSIDE SOFFIT (Seals the under-canopy so looking up reveals lush green leaves)
  const soffitCount = 14;
  for (let i = 0; i < soffitCount; i++) {
    const ang = i * (Math.PI * 2 / soffitCount);
    const leaf = leafGeoBase.clone();
    const sc = (0.85 + (i % 2) * 0.12) * 1.05;
    leaf.scale(sc, sc, sc);

    // Point downward and slightly inward
    leaf.rotateX(1.40);
    leaf.rotateY(ang + 0.2);
    leaf.rotateZ((i % 2 === 0 ? 0.2 : -0.2));
    leaf.translate(
      Math.cos(ang) * (radiusX * 0.58),
      radiusY * 0.08,
      Math.sin(ang) * (radiusZ * 0.58)
    );
    leafGeometries.push(leaf);
  }

  // 2. LOWER EQUATORIAL BILLOWING RIM
  const lowerCount = 18;
  for (let i = 0; i < lowerCount; i++) {
    const ang = i * (Math.PI * 2 / lowerCount) + 0.15;
    const leaf = leafGeoBase.clone();
    const sc = (0.92 + (i % 3) * 0.08) * 1.1;
    leaf.scale(sc, sc, sc);

    leaf.rotateX(0.68); // gentle outward droop
    leaf.rotateY(ang);
    leaf.rotateZ(i % 2 === 0 ? 0.15 : -0.15);
    leaf.translate(
      Math.cos(ang) * (radiusX * 0.90),
      radiusY * 0.32,
      Math.sin(ang) * (radiusZ * 0.90)
    );
    leafGeometries.push(leaf);
  }

  // 3. MID-CANOPY CONVEX SHOULDER TIER
  const midCount = 16;
  for (let i = 0; i < midCount; i++) {
    const ang = (i + 0.5) * (Math.PI * 2 / midCount);
    const leaf = leafGeoBase.clone();
    const sc = 0.90 + (i % 2) * 0.10;
    leaf.scale(sc, sc, sc);

    leaf.rotateX(0.38); // arching outward
    leaf.rotateY(ang);
    leaf.rotateZ((i % 3 - 1) * 0.16);
    leaf.translate(
      Math.cos(ang) * (radiusX * 0.72),
      radiusY * 0.65,
      Math.sin(ang) * (radiusZ * 0.72)
    );
    leafGeometries.push(leaf);
  }

  // 4. UPPER DOME RING (Sun-catching crown)
  const upperCount = 12;
  for (let i = 0; i < upperCount; i++) {
    const ang = i * (Math.PI * 2 / upperCount) + 0.25;
    const leaf = leafGeoBase.clone();
    const sc = 0.88 + (i % 2) * 0.08;
    leaf.scale(sc, sc, sc);

    leaf.rotateX(0.20); // pointing skyward
    leaf.rotateY(ang);
    leaf.rotateZ(i % 2 === 0 ? 0.12 : -0.12);
    leaf.translate(
      Math.cos(ang) * (radiusX * 0.42),
      radiusY * 0.92,
      Math.sin(ang) * (radiusZ * 0.42)
    );
    leafGeometries.push(leaf);
  }

  // 5. APEX CROWN (Zenith leaves fanning out over the top - zero brown sticks visible!)
  for (let i = 0; i < 5; i++) {
    const ang = i * (Math.PI * 2 / 5);
    const leaf = leafGeoBase.clone();
    leaf.scale(0.85, 0.85, 0.85);
    leaf.rotateX(0.08);
    leaf.rotateY(ang);
    leaf.translate(
      Math.cos(ang) * 0.14,
      radiusY * 1.05,
      Math.sin(ang) * 0.14
    );
    leafGeometries.push(leaf);
  }

  // 6. INTERNAL CORE FILL (Prevents see-through holes)
  for (let i = 0; i < 6; i++) {
    const ang = i * (Math.PI * 2 / 6) + 0.4;
    const leaf = leafGeoBase.clone();
    leaf.scale(0.80, 0.80, 0.80);
    leaf.rotateX(0.45);
    leaf.rotateY(ang);
    leaf.translate(
      Math.cos(ang) * (radiusX * 0.28),
      radiusY * 0.50,
      Math.sin(ang) * (radiusZ * 0.28)
    );
    leafGeometries.push(leaf);
  }

  return {
    woodGeometry: mergeBufferGeometriesFast(woodGeometries),
    leafGeometry: mergeBufferGeometriesFast(leafGeometries),
  };
}

export interface TieredFoliageData {
  sunlit: THREE.BufferGeometry;
  meadow: THREE.BufferGeometry;
  jade: THREE.BufferGeometry;
}

/**
 * Creates a multi-toned anime cel-shaded foliage cloud dome:
 * - Upper dome: sunlit golden lime (catches direct sunlight and rim highlight)
 * - Equator & shoulders: vibrant meadow emerald
 * - Underside soffit & core: deep jade (frames branches, eliminates dark holes)
 * - Zero wood geometry inside: 100% pure lush foliage cover
 */
export function createTieredFoliageCloudCluster(
  radiusX = 1.60,
  radiusY = 1.15,
  radiusZ = 1.60,
  leafScale = 0.68
): TieredFoliageData {
  const leafGeoBase = createSingleLeafGeometry(leafScale, leafScale * 0.48);
  const sunlitGeos: THREE.BufferGeometry[] = [];
  const meadowGeos: THREE.BufferGeometry[] = [];
  const jadeGeos: THREE.BufferGeometry[] = [];

  // 1. UNDERSIDE SOFFIT (Deep jade: seals under-canopy, eliminates black holes)
  const soffitCount = 14;
  for (let i = 0; i < soffitCount; i++) {
    const ang = i * (Math.PI * 2 / soffitCount);
    const leaf = leafGeoBase.clone();
    const sc = (0.85 + (i % 2) * 0.12) * 1.05;
    leaf.scale(sc, sc, sc);
    leaf.rotateX(1.40);
    leaf.rotateY(ang + 0.2);
    leaf.rotateZ((i % 2 === 0 ? 0.2 : -0.2));
    leaf.translate(
      Math.cos(ang) * (radiusX * 0.58),
      radiusY * 0.08,
      Math.sin(ang) * (radiusZ * 0.58)
    );
    jadeGeos.push(leaf);
  }

  // 2. INTERNAL CORE FILL (Jade / shadow depth)
  for (let i = 0; i < 6; i++) {
    const ang = i * (Math.PI * 2 / 6) + 0.4;
    const leaf = leafGeoBase.clone();
    leaf.scale(0.80, 0.80, 0.80);
    leaf.rotateX(0.45);
    leaf.rotateY(ang);
    leaf.translate(
      Math.cos(ang) * (radiusX * 0.28),
      radiusY * 0.50,
      Math.sin(ang) * (radiusZ * 0.28)
    );
    jadeGeos.push(leaf);
  }

  // 3. LOWER EQUATORIAL BILLOWING RIM (Meadow emerald)
  const lowerCount = 18;
  for (let i = 0; i < lowerCount; i++) {
    const ang = i * (Math.PI * 2 / lowerCount) + 0.15;
    const leaf = leafGeoBase.clone();
    const sc = (0.92 + (i % 3) * 0.08) * 1.1;
    leaf.scale(sc, sc, sc);
    leaf.rotateX(0.68);
    leaf.rotateY(ang);
    leaf.rotateZ(i % 2 === 0 ? 0.15 : -0.15);
    leaf.translate(
      Math.cos(ang) * (radiusX * 0.90),
      radiusY * 0.32,
      Math.sin(ang) * (radiusZ * 0.90)
    );
    meadowGeos.push(leaf);
  }

  // 4. MID-CANOPY CONVEX SHOULDER TIER (Meadow emerald)
  const midCount = 16;
  for (let i = 0; i < midCount; i++) {
    const ang = (i + 0.5) * (Math.PI * 2 / midCount);
    const leaf = leafGeoBase.clone();
    const sc = 0.90 + (i % 2) * 0.10;
    leaf.scale(sc, sc, sc);
    leaf.rotateX(0.38);
    leaf.rotateY(ang);
    leaf.rotateZ((i % 3 - 1) * 0.16);
    leaf.translate(
      Math.cos(ang) * (radiusX * 0.72),
      radiusY * 0.65,
      Math.sin(ang) * (radiusZ * 0.72)
    );
    meadowGeos.push(leaf);
  }

  // 5. UPPER DOME RING (Sunlit golden lime)
  const upperCount = 12;
  for (let i = 0; i < upperCount; i++) {
    const ang = i * (Math.PI * 2 / upperCount) + 0.25;
    const leaf = leafGeoBase.clone();
    const sc = 0.88 + (i % 2) * 0.08;
    leaf.scale(sc, sc, sc);
    leaf.rotateX(0.20);
    leaf.rotateY(ang);
    leaf.rotateZ(i % 2 === 0 ? 0.12 : -0.12);
    leaf.translate(
      Math.cos(ang) * (radiusX * 0.42),
      radiusY * 0.92,
      Math.sin(ang) * (radiusZ * 0.42)
    );
    sunlitGeos.push(leaf);
  }

  // 6. APEX CROWN (Sunlit golden lime - 100% covers stem tip, ZERO brown sticks)
  for (let i = 0; i < 6; i++) {
    const ang = i * (Math.PI * 2 / 6);
    const leaf = leafGeoBase.clone();
    leaf.scale(0.86, 0.86, 0.86);
    leaf.rotateX(0.08);
    leaf.rotateY(ang);
    leaf.translate(
      Math.cos(ang) * 0.16,
      radiusY * 1.05,
      Math.sin(ang) * 0.16
    );
    sunlitGeos.push(leaf);
  }

  return {
    sunlit: mergeBufferGeometriesFast(sunlitGeos),
    meadow: mergeBufferGeometriesFast(meadowGeos),
    jade: mergeBufferGeometriesFast(jadeGeos),
  };
}

export interface LeafBouquetData {
  woodGeo: THREE.BufferGeometry;
  sunlitGeo: THREE.BufferGeometry;
  meadowGeo: THREE.BufferGeometry;
  jadeGeo: THREE.BufferGeometry;
}

/**
 * Creates a dense, tightly overlapping anime leaf bouquet rooted directly on a supporting wooden twig.
 * - Every single leaf is physically attached to the twig stem (ZERO floating leaves).
 * - 24 closely-spaced leaves in golden phyllotaxis form a dense, lush volume (no see-through voids).
 * - 5 apex crown leaves umbrella directly over the twig tip (ZERO exposed sticks from above).
 * - 3 discrete cel-shading tiers: Sunlit (top), Meadow (body), Jade (underside soffit).
 */
export function createDenseLeafBouquet(
  twigLength = 0.65,
  leafCount = 28,
  leafScale = 0.56
): LeafBouquetData {
  const leafGeoBase = createSingleLeafGeometry(leafScale, leafScale * 0.50);
  const sunlitGeos: THREE.BufferGeometry[] = [];
  const meadowGeos: THREE.BufferGeometry[] = [];
  const jadeGeos: THREE.BufferGeometry[] = [];
  const woodGeos: THREE.BufferGeometry[] = [];

  // Supporting wooden twig (tapers from base to tip, stops at 84% so leaves umbrella over it)
  const woodLength = twigLength * 0.84;
  const twigRadiusBase = 0.026;
  const twigRadiusTip = 0.010;
  const twigGeo = new THREE.CylinderGeometry(twigRadiusTip, twigRadiusBase, woodLength, 6, 2);
  twigGeo.translate(0, woodLength * 0.5, 0);
  woodGeos.push(twigGeo);

  // Distribute tightly overlapping leaves in golden spiral
  const goldenAngle = 2.399963;
  for (let i = 0; i < leafCount; i++) {
    const t = 0.10 + (i / (leafCount - 1)) * 0.84;
    const leaf = leafGeoBase.clone();

    // Natural scale: mature in middle, younger at tip
    const bellScale = Math.sin(t * Math.PI) * 0.35 + 0.85;
    leaf.scale(bellScale, bellScale, bellScale);

    const angle = i * goldenAngle;
    const twigR = twigRadiusBase * (1.0 - t) + twigRadiusTip * t;

    // Natural droop: lower leaves droop downward (soffit), upper leaves fan outward
    const droop = 0.40 + (1.0 - t) * 0.48;
    const roll = (i % 2 === 0 ? 0.18 : -0.18);

    leaf.rotateX(droop);
    leaf.rotateY(angle);
    leaf.rotateZ(roll);

    const yPos = t * woodLength;
    leaf.translate(
      Math.cos(angle) * (twigR * 0.90),
      yPos,
      Math.sin(angle) * (twigR * 0.90)
    );

    // Tier distribution based on position and droop
    if (t < 0.32 || droop > 0.70) {
      jadeGeos.push(leaf); // Under-canopy soffit
    } else if (t > 0.62) {
      sunlitGeos.push(leaf); // Top crown
    } else {
      meadowGeos.push(leaf); // Mid body
    }
  }

  // 6 Apex Crown Leaves (100% umbrella over the wood tip, ZERO exposed cut wood)
  const apexCount = 6;
  for (let a = 0; a < apexCount; a++) {
    const ang = a * (Math.PI * 2 / apexCount) + 0.20;
    const crownLeaf = leafGeoBase.clone();
    crownLeaf.scale(0.88, 0.88, 0.88);

    crownLeaf.rotateX(0.20);
    crownLeaf.rotateY(ang);
    crownLeaf.rotateZ(a % 2 === 0 ? 0.12 : -0.12);

    crownLeaf.translate(
      Math.cos(ang) * 0.035,
      woodLength * 0.96,
      Math.sin(ang) * 0.035
    );
    sunlitGeos.push(crownLeaf);
  }

  return {
    woodGeo: mergeBufferGeometriesFast(woodGeos),
    sunlitGeo: mergeBufferGeometriesFast(sunlitGeos),
    meadowGeo: mergeBufferGeometriesFast(meadowGeos),
    jadeGeo: mergeBufferGeometriesFast(jadeGeos),
  };
}

/**
 * Creates a Leaf Sprig Showcase Mesh ready for inspection in /models.
 */
export function createLeafSprigMesh(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'Leaf_Sprig_Modular_Genshin';

  const { woodGeometry, leafGeometry } = createLeafSprig(16, 0.85, 'meadow');

  const woodMat = createToonMaterial({
    color: 0x855232,
    gradientBands: 3,
    rimColor: 0xfde68a,
    rimPower: 3.5,
    rimIntensity: 0.35,
    shadowColor: 0x482614,
  });
  const woodMesh = new THREE.Mesh(woodGeometry, woodMat);
  woodMesh.castShadow = true;
  group.add(woodMesh);

  const leafMat = createLeafMaterial('meadow', false);
  const leafMesh = new THREE.Mesh(leafGeometry, leafMat);
  leafMesh.castShadow = true;
  leafMesh.receiveShadow = true;
  group.add(leafMesh);

  return group;
}

/** Merge attributes with aligned defaults, including painted leaf colors. */
export function mergeBufferGeometriesFast(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  if (!geometries.length) return new THREE.BufferGeometry();
  if (geometries.length === 1) return geometries[0];
  const prepared = geometries.map(g => g.index ? g.toNonIndexed() : g);
  const count = prepared.reduce((sum,g)=>sum+g.getAttribute('position').count,0);
  const result = new THREE.BufferGeometry();
  for(const [name, size] of [['position',3],['normal',3],['uv',2],['color',3]] as const) {
    if(name !== 'position' && !prepared.some(g=>g.hasAttribute(name))) continue;
    const data = new Float32Array(count*size);
    if(name === 'color') data.fill(1);
    let offset=0;
    for(const g of prepared) {
      const attr=g.getAttribute(name);
      if(attr) data.set(attr.array,offset*size);
      offset+=g.getAttribute('position').count;
    }
    result.setAttribute(name,new THREE.BufferAttribute(data,size));
  }
  if(!result.hasAttribute('normal')) result.computeVertexNormals();
  for(let i=0;i<prepared.length;i++) if(prepared[i]!==geometries[i]) prepared[i].dispose();
  result.computeBoundingBox();
  result.computeBoundingSphere();
  return result;
}
