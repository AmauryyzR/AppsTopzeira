import * as THREE from 'three';
import { createToonMaterial, TOON_PRESETS } from '../shaders/ToonMaterial';

export interface PagodaGazeboOptions {
  position?: THREE.Vector3;
  rotationY?: number;
  scale?: number;
}

/**
 * AAA-Grade Zen Pavilion / Pagoda Gazebo of Contemplation (Genshin / Zelda: BotW style).
 * Features:
 * - Raised octagonal wooden platform with accessible 3-tier stepped entrance.
 * - 8 treated hinoki/cedar columns with stone plinths (soseki).
 * - Multi-tiered pagoda roof with upswept curved eaves (sori) and exposed eave rafters.
 * - 8 Hanging emissive Japanese paper lanterns (chōchin) casting warm anime amber radiance.
 * - Traditional Japanese kumiran balustrades with polished wood finish.
 * - Gilded flaming jewel pinnacle spire (hōju).
 * - Detailed interior with polished wood floor and central contemplation setting.
 * - Precise stepped and column collisions for effortless navigation and contemplation.
 * - Zero-leak memory management.
 */
export class PagodaGazebo {
  public readonly group = new THREE.Group();

  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];

  constructor(
    options: PagodaGazeboOptions = {},
    onAddCollision?: (x: number, y: number, z: number, w: number, h: number, d: number) => void
  ) {
    const pos = options.position ?? new THREE.Vector3(36, 0, 0);
    const rotY = options.rotationY ?? 0;
    const scale = options.scale ?? 1.0;

    this.group.position.copy(pos);
    this.group.rotation.y = rotY;
    this.group.scale.set(scale, scale, scale);

    this.buildPagodaGazebo(pos, rotY, scale, onAddCollision);
  }

  private trackGeo<T extends THREE.BufferGeometry>(geo: T): T {
    this.geometries.push(geo);
    return geo;
  }

  private trackMat<T extends THREE.Material>(mat: T): T {
    this.materials.push(mat);
    return mat;
  }

  private buildPagodaGazebo(
    rootPos: THREE.Vector3,
    rotY: number,
    scale: number,
    onAddCollision?: (x: number, y: number, z: number, w: number, h: number, d: number) => void
  ) {
    // -------------------------------------------------------------
    // 1. MASTER CEL-SHADED ANIME MATERIALS
    // -------------------------------------------------------------
    // Rich Warm Cedar / Cypress Deck Wood
    const deckWoodMat = this.trackMat(
      createToonMaterial({
        color: 0x9a5a32,
        gradientBands: 4,
        rimColor: 0xfde68a,
        rimPower: 3.0,
        rimIntensity: 0.50,
        shadowColor: 0x542611,
        shadowIntensity: 0.55,
      })
    );

    // Deep Chestnut Structural Columns & Rafters
    const columnWoodMat = this.trackMat(
      createToonMaterial({
        color: 0x7c3a1e,
        gradientBands: 4,
        rimColor: 0xfbcfe8,
        rimPower: 2.8,
        rimIntensity: 0.55,
        shadowColor: 0x431407,
        shadowIntensity: 0.60,
      })
    );

    // Vermilion Railings & Trim Accent (#b91c1c / #dc2626)
    const vermilionMat = this.trackMat(
      createToonMaterial({
        color: 0xbe123c,
        gradientBands: 4,
        rimColor: 0xfef08a,
        rimPower: 2.6,
        rimIntensity: 0.65,
        shadowColor: 0x881337,
        shadowIntensity: 0.50,
      })
    );

    // Slate Verdigris Ceramic Roof Tiles (Kawara)
    const roofTileMat = this.trackMat(
      createToonMaterial({
        color: 0x334155, // Traditional Japanese slate-verdigris tile
        gradientBands: 4,
        rimColor: 0x94a3b8, // Crisp morning sky highlight rim
        rimPower: 2.4,
        rimIntensity: 0.75,
        shadowColor: 0x0f172a, // Deep charcoal shadow
        shadowIntensity: 0.65,
        side: THREE.DoubleSide,
      })
    );

    // Under-eave Cedar Rafter Wood
    const rafterMat = this.trackMat(
      createToonMaterial({
        color: 0x854d0e,
        gradientBands: 3,
        rimColor: 0xfef08a,
        shadowColor: 0x451a03,
      })
    );

    // Granite Stone Foundation & Soseki Plinths
    const stoneMat = this.trackMat(
      createToonMaterial({
        color: 0x94a3b8,
        gradientBands: 4,
        rimColor: 0xffffff,
        rimPower: 2.8,
        rimIntensity: 0.65,
        shadowColor: 0x475569,
        shadowIntensity: 0.50,
      })
    );

    // Burnished Gold / Bronze Finial (Hōju)
    const goldMat = this.trackMat(
      createToonMaterial({
        color: 0xf59e0b,
        gradientBands: 3,
        rimColor: 0xfef08a,
        rimPower: 2.2,
        rimIntensity: 0.90,
        shadowColor: 0xb45309,
        shadowIntensity: 0.40,
        emissive: 0xd97706,
        emissiveIntensity: 0.30,
      })
    );

    // Warm Emissive Lantern Shade (Chōchin)
    const lanternMat = this.trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xfff3b0,
      })
    );

    const darkIronMat = this.trackMat(createToonMaterial(TOON_PRESETS.iron));

    // -------------------------------------------------------------
    // 2. FOUNDATION & OCTAGONAL PLATFORM
    // -------------------------------------------------------------
    const octRadius = 3.9;
    const deckHeight = 0.48;

    // Stone Sub-Plinth Foundation (Octagonal prism, y = 0 to 0.20)
    const stoneBaseGeo = this.trackGeo(new THREE.CylinderGeometry(octRadius + 0.55, octRadius + 0.75, 0.20, 8));
    const stoneBase = new THREE.Mesh(stoneBaseGeo, stoneMat);
    stoneBase.position.set(0, 0.10, 0);
    stoneBase.rotation.y = Math.PI / 8;
    stoneBase.receiveShadow = true;
    this.group.add(stoneBase);

    // Raised Octagonal Wooden Deck (y = 0.20 to 0.48)
    const deckBaseGeo = this.trackGeo(new THREE.CylinderGeometry(octRadius, octRadius + 0.12, 0.28, 8));
    const deckBase = new THREE.Mesh(deckBaseGeo, columnWoodMat);
    deckBase.position.set(0, 0.34, 0);
    deckBase.rotation.y = Math.PI / 8;
    deckBase.castShadow = true;
    deckBase.receiveShadow = true;
    this.group.add(deckBase);

    // Octagonal Polished Floor Planks Top Plate
    const deckPlankGeo = this.trackGeo(new THREE.CylinderGeometry(octRadius - 0.05, octRadius - 0.05, 0.04, 8));
    const deckPlank = new THREE.Mesh(deckPlankGeo, deckWoodMat);
    deckPlank.position.set(0, deckHeight, 0);
    deckPlank.rotation.y = Math.PI / 8;
    deckPlank.receiveShadow = true;
    this.group.add(deckPlank);

    // Decorative Sandstone Inlay Medallion in Deck Center
    const inlayGeo = this.trackGeo(new THREE.RingGeometry(0.8, 1.4, 8));
    inlayGeo.rotateX(-Math.PI / 2);
    const inlay = new THREE.Mesh(inlayGeo, rafterMat);
    inlay.position.set(0, deckHeight + 0.005, 0);
    inlay.rotation.y = Math.PI / 8;
    this.group.add(inlay);

    // -------------------------------------------------------------
    // 3. ACCESSIBLE 3-TIER ENTRANCE STAIRS (Facing West: -X)
    // -------------------------------------------------------------
    const stairWidth = 2.4;
    const stepDepth = 0.45;
    const stepConfigs = [
      { stepX: -(octRadius + 0.65), y: 0.16, h: 0.16 }, // Step 1: Ground to 0.16m
      { stepX: -(octRadius + 0.25), y: 0.32, h: 0.32 }, // Step 2: 0.16m to 0.32m
    ];

    const stepGeo1 = this.trackGeo(new THREE.BoxGeometry(stepDepth, 0.16, stairWidth));
    const step1 = new THREE.Mesh(stepGeo1, stoneMat);
    step1.position.set(stepConfigs[0].stepX, 0.08, 0);
    step1.castShadow = true;
    step1.receiveShadow = true;
    this.group.add(step1);

    const stepGeo2 = this.trackGeo(new THREE.BoxGeometry(stepDepth, 0.32, stairWidth));
    const step2 = new THREE.Mesh(stepGeo2, stoneMat);
    step2.position.set(stepConfigs[1].stepX, 0.16, 0);
    step2.castShadow = true;
    step2.receiveShadow = true;
    this.group.add(step2);

    // Wooden tread caps for steps
    const treadGeo = this.trackGeo(new THREE.BoxGeometry(stepDepth + 0.04, 0.04, stairWidth + 0.06));
    const tread1 = new THREE.Mesh(treadGeo, deckWoodMat);
    tread1.position.set(stepConfigs[0].stepX, 0.18, 0);
    tread1.receiveShadow = true;
    this.group.add(tread1);

    const tread2 = new THREE.Mesh(treadGeo, deckWoodMat);
    tread2.position.set(stepConfigs[1].stepX, 0.34, 0);
    tread2.receiveShadow = true;
    this.group.add(tread2);

    // Stair cheek walls (stone side parapets)
    const cheekGeo = this.trackGeo(new THREE.BoxGeometry(stepDepth * 2 + 0.2, 0.42, 0.18));
    for (const sideZ of [-stairWidth / 2 - 0.09, stairWidth / 2 + 0.09]) {
      const cheek = new THREE.Mesh(cheekGeo, stoneMat);
      cheek.position.set(-(octRadius + 0.45), 0.21, sideZ);
      cheek.castShadow = true;
      this.group.add(cheek);
    }

    // -------------------------------------------------------------
    // 4. 8 CYLINDRICAL COLUMNS (HASHIRA) WITH STONE SOSEKI BASES
    // -------------------------------------------------------------
    const columnRadius = 3.25;
    const colHeight = 3.35;
    const colBaseY = deckHeight;

    const sosekiGeo = this.trackGeo(new THREE.CylinderGeometry(0.24, 0.28, 0.12, 12));
    const columnGeo = this.trackGeo(new THREE.CylinderGeometry(0.14, 0.16, colHeight, 16));
    const capitalGeo = this.trackGeo(new THREE.CylinderGeometry(0.22, 0.15, 0.14, 12));
    const goldCollarGeo = this.trackGeo(new THREE.CylinderGeometry(0.17, 0.17, 0.05, 16));

    const columnCoords: { x: number; z: number; angle: number }[] = [];

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const cx = Math.cos(angle) * columnRadius;
      const cz = Math.sin(angle) * columnRadius;
      columnCoords.push({ x: cx, z: cz, angle });

      // Stone Plinth (Soseki) on deck
      const soseki = new THREE.Mesh(sosekiGeo, stoneMat);
      soseki.position.set(cx, colBaseY + 0.06, cz);
      soseki.castShadow = true;
      this.group.add(soseki);

      // Main Column Shaft
      const col = new THREE.Mesh(columnGeo, columnWoodMat);
      col.position.set(cx, colBaseY + 0.12 + colHeight / 2, cz);
      col.castShadow = true;
      col.receiveShadow = true;
      this.group.add(col);

      // Capital Bracket Block
      const cap = new THREE.Mesh(capitalGeo, columnWoodMat);
      cap.position.set(cx, colBaseY + 0.12 + colHeight + 0.07, cz);
      cap.castShadow = true;
      this.group.add(cap);

      // Ornamental Gold Trim Rings on Column
      const ringTop = new THREE.Mesh(goldCollarGeo, goldMat);
      ringTop.position.set(cx, colBaseY + 0.12 + colHeight - 0.15, cz);
      this.group.add(ringTop);

      const ringBot = new THREE.Mesh(goldCollarGeo, goldMat);
      ringBot.position.set(cx, colBaseY + 0.24, cz);
      this.group.add(ringBot);
    }

    // -------------------------------------------------------------
    // 5. TRADITIONAL BALUSTRADES (KUMIRAN) ON 7 OF 8 EDGES
    // -------------------------------------------------------------
    // The west side (i = 3 & 4 or where x < -2.5) is open for the stairs
    const railHeight = 0.82;
    const chordLen = 2 * columnRadius * Math.sin(Math.PI / 8);

    const topRailGeo = this.trackGeo(new THREE.BoxGeometry(chordLen * 0.95, 0.09, 0.12));
    const botRailGeo = this.trackGeo(new THREE.BoxGeometry(chordLen * 0.95, 0.07, 0.09));
    const balusterGeo = this.trackGeo(new THREE.CylinderGeometry(0.035, 0.035, railHeight - 0.16, 8));

    for (let i = 0; i < 8; i++) {
      const c1 = columnCoords[i];
      const c2 = columnCoords[(i + 1) % 8];
      const midX = (c1.x + c2.x) / 2;
      const midZ = (c1.z + c2.z) / 2;
      // In Three.js, rotation around Y rotates local +X towards -Z; negate dz to match heading
      const wallAngle = Math.atan2(-(c2.z - c1.z), c2.x - c1.x);

      // Skip West entrance where stairs connect (midX < -2.8)
      if (midX < -2.6 && Math.abs(midZ) < 1.4) {
        continue;
      }

      const railGroup = new THREE.Group();
      railGroup.position.set(midX, deckHeight, midZ);
      railGroup.rotation.y = wallAngle;

      // Top handrail (Kasagi-rankan)
      const topRail = new THREE.Mesh(topRailGeo, vermilionMat);
      topRail.position.set(0, railHeight, 0);
      topRail.castShadow = true;
      railGroup.add(topRail);

      // Bottom rail
      const botRail = new THREE.Mesh(botRailGeo, columnWoodMat);
      botRail.position.set(0, 0.12, 0);
      railGroup.add(botRail);

      // Vertical decorative spindles / balusters
      const balusterCount = 5;
      const balusterSpacing = (chordLen * 0.80) / (balusterCount - 1);
      for (let b = 0; b < balusterCount; b++) {
        const bx = -chordLen * 0.40 + b * balusterSpacing;
        const baluster = new THREE.Mesh(balusterGeo, columnWoodMat);
        baluster.position.set(bx, 0.12 + (railHeight - 0.16) / 2, 0);
        baluster.castShadow = true;
        railGroup.add(baluster);
      }

      this.group.add(railGroup);

      // Collision for railing
      this.addWorldCollision(
        midX,
        deckHeight,
        midZ,
        chordLen * 0.95,
        railHeight + 0.35,
        0.35,
        rootPos,
        rotY,
        onAddCollision
      );
    }

    // -------------------------------------------------------------
    // 6. RING BEAMS (CHANGAN) & EXPOSED RAFTERS (TARUKI)
    // -------------------------------------------------------------
    const eaveBeamY = colBaseY + 0.12 + colHeight + 0.08;
    const architraveGeo = this.trackGeo(new THREE.BoxGeometry(chordLen * 1.02, 0.22, 0.20));

    for (let i = 0; i < 8; i++) {
      const c1 = columnCoords[i];
      const c2 = columnCoords[(i + 1) % 8];
      const midX = (c1.x + c2.x) / 2;
      const midZ = (c1.z + c2.z) / 2;
      const wallAngle = Math.atan2(-(c2.z - c1.z), c2.x - c1.x);

      const beam = new THREE.Mesh(architraveGeo, vermilionMat);
      beam.position.set(midX, eaveBeamY, midZ);
      beam.rotation.y = wallAngle;
      beam.castShadow = true;
      this.group.add(beam);
    }

    // Radiating ceiling rafters under eave
    const rafterGeo = this.trackGeo(new THREE.BoxGeometry(0.08, 0.10, 4.6));
    for (let r = 0; r < 24; r++) {
      const rAngle = (r / 24) * Math.PI * 2;
      const rafter = new THREE.Mesh(rafterGeo, rafterMat);
      rafter.position.set(0, eaveBeamY + 0.18, 0);
      rafter.rotation.y = rAngle;
      rafter.rotation.x = -0.15; // Slope upwards toward apex
      this.group.add(rafter);
    }

    // -------------------------------------------------------------
    // 7. DOUBLE-TIER PAGODA ROOF WITH SORI (CURVED EAVES)
    // -------------------------------------------------------------
    // Tier 1: Lower Expansive Eaves (Sweep outward to radius 5.35m)
    const roof1Y = eaveBeamY + 0.22;
    const roof1Radius = 5.35;
    const roof1TopRadius = 2.45;
    const roof1Height = 1.35;

    // Polished Hinoki/Cedar Under-Eave Ceiling Board
    const ceilingGeo = this.trackGeo(new THREE.CylinderGeometry(roof1Radius * 0.94, roof1Radius * 0.94, 0.05, 8));
    const ceiling = new THREE.Mesh(ceilingGeo, deckWoodMat);
    ceiling.position.set(0, eaveBeamY + 0.16, 0);
    ceiling.rotation.y = Math.PI / 8;
    ceiling.receiveShadow = true;
    this.group.add(ceiling);

    // Build flared octagonal lower roof cone with authentic cel-shaded facets
    const roof1Geo = this.trackGeo(
      new THREE.CylinderGeometry(roof1TopRadius, roof1Radius, roof1Height, 8, 4, true)
    );
    // Deform vertices for sori (concave upward flare at perimeter)
    const posAttr1 = roof1Geo.getAttribute('position');
    for (let p = 0; p < posAttr1.count; p++) {
      const vy = posAttr1.getY(p);
      const vx = posAttr1.getX(p);
      const vz = posAttr1.getZ(p);
      const r = Math.hypot(vx, vz);
      // Subtle upward concave curl near eave edge
      const edgeFactor = Math.max(0, (r - roof1TopRadius) / (roof1Radius - roof1TopRadius));
      const soriOffset = Math.pow(edgeFactor, 2.5) * 0.32;
      posAttr1.setY(p, vy + soriOffset);
    }
    roof1Geo.computeVertexNormals();

    const roof1 = new THREE.Mesh(roof1Geo, roofTileMat);
    roof1.position.set(0, roof1Y + roof1Height / 2, 0);
    roof1.rotation.y = Math.PI / 8;
    roof1.castShadow = true;
    roof1.receiveShadow = true;
    this.group.add(roof1);

    // Eave fascia rim ring (curved dark copper trim)
    const eaveRimGeo = this.trackGeo(new THREE.CylinderGeometry(roof1Radius + 0.05, roof1Radius + 0.08, 0.12, 8));
    const eaveRim = new THREE.Mesh(eaveRimGeo, darkIronMat);
    eaveRim.position.set(0, roof1Y + 0.18, 0);
    eaveRim.rotation.y = Math.PI / 8;
    this.group.add(eaveRim);

    // Tier 2: Mid Clerestory / Drum
    const drumY = roof1Y + roof1Height;
    const drumGeo = this.trackGeo(new THREE.CylinderGeometry(2.35, 2.35, 0.55, 8));
    const drum = new THREE.Mesh(drumGeo, vermilionMat);
    drum.position.set(0, drumY + 0.275, 0);
    drum.rotation.y = Math.PI / 8;
    drum.castShadow = true;
    this.group.add(drum);

    // Tier 3: Upper Pagoda Roof Cupola (Apex Spire Cap)
    const roof2Y = drumY + 0.55;
    const roof2Radius = 2.85;
    const roof2Height = 1.45;

    const roof2Geo = this.trackGeo(
      new THREE.ConeGeometry(roof2Radius, roof2Height, 8, 4, true)
    );
    // Deform for sori
    const posAttr2 = roof2Geo.getAttribute('position');
    for (let p = 0; p < posAttr2.count; p++) {
      const vy = posAttr2.getY(p);
      const vx = posAttr2.getX(p);
      const vz = posAttr2.getZ(p);
      const r = Math.hypot(vx, vz);
      const edgeFactor = r / roof2Radius;
      const soriOffset = Math.pow(edgeFactor, 2.4) * 0.26;
      posAttr2.setY(p, vy + soriOffset);
    }
    roof2Geo.computeVertexNormals();

    const roof2 = new THREE.Mesh(roof2Geo, roofTileMat);
    roof2.position.set(0, roof2Y + roof2Height / 2, 0);
    roof2.rotation.y = Math.PI / 8;
    roof2.castShadow = true;
    roof2.receiveShadow = true;
    this.group.add(roof2);

    // 8 Hip Ridge Tiles (Sumimune) with Flared End Terminals (Onigawara)
    const ridgeTileGeo = this.trackGeo(new THREE.BoxGeometry(0.14, 0.12, 3.2));
    const onigawaraGeo = this.trackGeo(new THREE.BoxGeometry(0.24, 0.22, 0.28));

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const ridgeGroup = new THREE.Group();
      ridgeGroup.position.set(0, roof1Y + roof1Height, 0);
      ridgeGroup.rotation.y = angle;

      const ridge = new THREE.Mesh(ridgeTileGeo, darkIronMat);
      ridge.position.set(0, -roof1Height / 2 + 0.1, roof1Radius / 2);
      ridge.rotation.x = 0.42;
      ridge.castShadow = true;
      ridgeGroup.add(ridge);

      // Flared upturned demon-tile / horn at corner eave tip
      const oni = new THREE.Mesh(onigawaraGeo, darkIronMat);
      oni.position.set(0, -roof1Height + 0.35, roof1Radius + 0.1);
      oni.rotation.x = -0.35; // Upturned flourish
      ridgeGroup.add(oni);

      this.group.add(ridgeGroup);
    }

    // -------------------------------------------------------------
    // 8. SACRED JEWEL PINNACLE SPIRE (HŌJU)
    // -------------------------------------------------------------
    const spireApexY = roof2Y + roof2Height;
    const spireGroup = new THREE.Group();
    spireGroup.position.set(0, spireApexY, 0);

    // Lotus base bowl (Roban)
    const robanGeo = this.trackGeo(new THREE.CylinderGeometry(0.38, 0.28, 0.22, 8));
    const roban = new THREE.Mesh(robanGeo, goldMat);
    roban.position.set(0, 0.11, 0);
    spireGroup.add(roban);

    // Spire column with 5 sacred rings (Kurin)
    const kurinMastGeo = this.trackGeo(new THREE.CylinderGeometry(0.08, 0.10, 1.25, 12));
    const kurinMast = new THREE.Mesh(kurinMastGeo, goldMat);
    kurinMast.position.set(0, 0.72, 0);
    spireGroup.add(kurinMast);

    const ringGeo = this.trackGeo(new THREE.TorusGeometry(0.22, 0.045, 8, 16));
    for (let r = 0; r < 5; r++) {
      const ring = new THREE.Mesh(ringGeo, goldMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, 0.38 + r * 0.16, 0);
      spireGroup.add(ring);
    }

    // Teardrop Flaming Jewel Pearl (Hōju)
    const hojuGeo = this.trackGeo(new THREE.SphereGeometry(0.22, 12, 12));
    const hoju = new THREE.Mesh(hojuGeo, goldMat);
    hoju.position.set(0, 1.42, 0);
    hoju.scale.set(1.0, 1.35, 1.0);
    spireGroup.add(hoju);

    const flameCapGeo = this.trackGeo(new THREE.ConeGeometry(0.12, 0.32, 8));
    const flameCap = new THREE.Mesh(flameCapGeo, goldMat);
    flameCap.position.set(0, 1.68, 0);
    spireGroup.add(flameCap);

    this.group.add(spireGroup);

    // -------------------------------------------------------------
    // 9. 8 HANGING EMISSIVE JAPANESE LANTERNS (CHŌCHIN)
    // -------------------------------------------------------------
    const lanternBodyGeo = this.trackGeo(new THREE.CylinderGeometry(0.24, 0.20, 0.44, 12));
    const lanternCapGeo = this.trackGeo(new THREE.CylinderGeometry(0.27, 0.22, 0.08, 12));
    const chainGeo = this.trackGeo(new THREE.CylinderGeometry(0.015, 0.015, 0.55, 6));
    const tasselGeo = this.trackGeo(new THREE.ConeGeometry(0.07, 0.22, 8));

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const lx = Math.cos(angle) * (roof1Radius + 0.05);
      const lz = Math.sin(angle) * (roof1Radius + 0.05);
      const ly = roof1Y + 0.15;

      const lantern = new THREE.Group();
      lantern.position.set(lx, ly, lz);

      // Suspension bronze chain
      const chain = new THREE.Mesh(chainGeo, darkIronMat);
      chain.position.set(0, -0.27, 0);
      lantern.add(chain);

      // Top cap
      const topCap = new THREE.Mesh(lanternCapGeo, darkIronMat);
      topCap.position.set(0, -0.55, 0);
      lantern.add(topCap);

      // Emissive paper body
      const body = new THREE.Mesh(lanternBodyGeo, lanternMat);
      body.position.set(0, -0.77, 0);
      lantern.add(body);

      // Bottom cap
      const botCap = new THREE.Mesh(lanternCapGeo, darkIronMat);
      botCap.position.set(0, -0.99, 0);
      lantern.add(botCap);

      // Vermilion dangling tassel
      const tassel = new THREE.Mesh(tasselGeo, vermilionMat);
      tassel.position.set(0, -1.14, 0);
      tassel.rotation.x = Math.PI;
      lantern.add(tassel);

      this.group.add(lantern);
    }

    // -------------------------------------------------------------
    // 10. INTERIOR CONTEMPLATION ZEN BENCH & TABLE
    // -------------------------------------------------------------
    // Low circular meditation table in center
    const tableTopGeo = this.trackGeo(new THREE.CylinderGeometry(0.85, 0.85, 0.08, 16));
    const tableLegGeo = this.trackGeo(new THREE.CylinderGeometry(0.24, 0.38, 0.32, 12));
    const tableTop = new THREE.Mesh(tableTopGeo, columnWoodMat);
    tableTop.position.set(0, deckHeight + 0.34, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    this.group.add(tableTop);

    const tableLeg = new THREE.Mesh(tableLegGeo, columnWoodMat);
    tableLeg.position.set(0, deckHeight + 0.16, 0);
    this.group.add(tableLeg);

    // Contemplation benches along east/rear perimeter
    const benchGeo = this.trackGeo(new THREE.BoxGeometry(1.6, 0.08, 0.42));
    const bench1 = new THREE.Mesh(benchGeo, deckWoodMat);
    bench1.position.set(2.4, deckHeight + 0.28, 0.9);
    bench1.rotation.y = -Math.PI / 4;
    bench1.castShadow = true;
    this.group.add(bench1);

    const bench2 = new THREE.Mesh(benchGeo, deckWoodMat);
    bench2.position.set(2.4, deckHeight + 0.28, -0.9);
    bench2.rotation.y = Math.PI / 4;
    bench2.castShadow = true;
    this.group.add(bench2);

    // -------------------------------------------------------------
    // 11. PHYSICAL COLLISIONS (Effortless Stepped Walkway & Pillars)
    // -------------------------------------------------------------
    // Step 1: y = 0.16m
    this.addWorldCollision(
      stepConfigs[0].stepX,
      0,
      0,
      stepDepth,
      0.16,
      stairWidth,
      rootPos,
      rotY,
      onAddCollision
    );

    // Step 2: y = 0.32m
    this.addWorldCollision(
      stepConfigs[1].stepX,
      0,
      0,
      stepDepth,
      0.32,
      stairWidth,
      rootPos,
      rotY,
      onAddCollision
    );

    // Main Platform Deck at y = 0.48m (cross configuration covering octagonal deck)
    this.addWorldCollision(
      0,
      0,
      0,
      octRadius * 1.85 * scale,
      deckHeight * scale,
      octRadius * 1.35 * scale,
      rootPos,
      rotY,
      onAddCollision
    );
    this.addWorldCollision(
      0,
      0,
      0,
      octRadius * 1.35 * scale,
      deckHeight * scale,
      octRadius * 1.85 * scale,
      rootPos,
      rotY,
      onAddCollision
    );

    // 8 Columns Collisions
    for (const c of columnCoords) {
      this.addWorldCollision(
        c.x,
        deckHeight,
        c.z,
        0.42 * scale,
        colHeight * scale,
        0.42 * scale,
        rootPos,
        rotY,
        onAddCollision
      );
    }
  }

  private addWorldCollision(
    localX: number,
    localY: number,
    localZ: number,
    width: number,
    height: number,
    depth: number,
    rootPos: THREE.Vector3,
    rotY: number,
    onAddCollision?: (x: number, y: number, z: number, w: number, h: number, d: number) => void
  ) {
    if (!onAddCollision) return;

    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const worldX = rootPos.x + localX * cosY + localZ * sinY;
    const worldY = rootPos.y + localY;
    const worldZ = rootPos.z - localX * sinY + localZ * cosY;

    const worldW = Math.abs(width * cosY) + Math.abs(depth * sinY);
    const worldD = Math.abs(width * sinY) + Math.abs(depth * cosY);

    onAddCollision(worldX, worldY, worldZ, worldW, height, worldD);
  }

  public dispose() {
    for (const g of this.geometries) g.dispose();
    for (const m of this.materials) m.dispose();
    this.geometries = [];
    this.materials = [];
  }
}
