import * as THREE from 'three';
import { createToonMaterial, TOON_PRESETS } from '../shaders/ToonMaterial';

export interface ToriiGateOptions {
  position?: THREE.Vector3;
  rotationY?: number;
  scale?: number;
}

/**
 * AAA-Grade Monumental Cel-Shaded Torii Gate (Genshin Impact Inazuma / Zelda: BotW Inari style).
 * Features:
 * - Dual monumental cylindrical pillars (hashira) with classic inward tilt (uchikorobi).
 * - Multi-tier chamfered stone foundation pedestals (kamebara / daiishi).
 * - Protective black lacquered lower sleeves (nemaki).
 * - Horizontal tie-beam (nuki) with beveled cantilever ends and wedge keys (kusabi).
 * - Vertical central plaque strut (gakuzuka) with gilded anime shrine tablet.
 * - Dual-layer lintel: lower lintel (shimaki) and monumental upward-curving kasagi beam with chamfered tips.
 * - Obsidian lacquered black copper ridge cap with upturned ends.
 * - Flanking authentic stone lanterns (tōrō) with warm emissive fireboxes.
 * - Zero-leak memory management with strict disposal of all geometries and materials.
 */
export class ToriiGate {
  public readonly group = new THREE.Group();

  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];

  constructor(
    options: ToriiGateOptions = {},
    onAddCollision?: (x: number, y: number, z: number, w: number, h: number, d: number) => void
  ) {
    const pos = options.position ?? new THREE.Vector3(0, 0, 42);
    const rotY = options.rotationY ?? 0;
    const scale = options.scale ?? 1.0;

    this.group.position.copy(pos);
    this.group.rotation.y = rotY;
    this.group.scale.set(scale, scale, scale);

    this.buildToriiGate(pos, rotY, scale, onAddCollision);
  }

  private trackGeo<T extends THREE.BufferGeometry>(geo: T): T {
    this.geometries.push(geo);
    return geo;
  }

  private trackMat<T extends THREE.Material>(mat: T): T {
    this.materials.push(mat);
    return mat;
  }

  private buildToriiGate(
    rootPos: THREE.Vector3,
    rotY: number,
    scale: number,
    onAddCollision?: (x: number, y: number, z: number, w: number, h: number, d: number) => void
  ) {
    // -------------------------------------------------------------
    // 1. CURATED CEL-SHADED ANIME MATERIALS
    // -------------------------------------------------------------
    // Vibrant Cinnabar Vermilion (#dc2626 / #b91c1c with warm golden rim)
    const vermilionMat = this.trackMat(
      createToonMaterial({
        color: 0xdc2626,
        gradientBands: 4,
        rimColor: 0xfde047, // Golden anime rim sheen
        rimPower: 2.8,
        rimIntensity: 0.65,
        shadowColor: 0x7f1d1d, // Deep crimson-carmine shadow
        shadowIntensity: 0.55,
      })
    );

    // Deep Lacquered Black Kuro-Urushi (#18181b with silver anime rim)
    const lacquerBlackMat = this.trackMat(
      createToonMaterial({
        color: 0x18181b,
        gradientBands: 4,
        rimColor: 0xf1f5f9, // Crisp silver-white highlight rim
        rimPower: 2.2,
        rimIntensity: 0.95,
        shadowColor: 0x09090b,
        shadowIntensity: 0.70,
      })
    );

    // Granite Stone Sapatas & Lanterns
    const stoneMat = this.trackMat(
      createToonMaterial({
        color: 0x94a3b8,
        gradientBands: 4,
        rimColor: 0xffffff,
        rimPower: 3.0,
        rimIntensity: 0.60,
        shadowColor: 0x475569,
        shadowIntensity: 0.50,
      })
    );

    // Burnished Gold Leaf Accents (#f59e0b)
    const goldMat = this.trackMat(
      createToonMaterial({
        color: 0xf59e0b,
        gradientBands: 3,
        rimColor: 0xfef08a,
        rimPower: 2.5,
        rimIntensity: 0.85,
        shadowColor: 0xb45309,
        shadowIntensity: 0.45,
        emissive: 0x78350f,
        emissiveIntensity: 0.25,
      })
    );

    // Warm Emissive Lantern Light
    const lanternGlowMat = this.trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xffe082,
      })
    );

    // Paved Stone Apron Sandstone
    const sandstoneMat = this.trackMat(createToonMaterial(TOON_PRESETS.sandstone));

    // -------------------------------------------------------------
    // 2. DIMENSIONS & STRUCTURAL PARAMETERS
    // -------------------------------------------------------------
    const pillarSpacingX = 2.85; // Distance from center to each pillar (total span 5.7m)
    const pillarHeight = 5.0;    // Precise column shaft height
    const pillarRadiusBase = 0.36;
    const pillarRadiusTop = 0.31;
    const tiltAngle = 0.038;     // ~2.2 degrees inward tilt (uchikorobi)

    const yBase = 0.66;          // Top of stone plinth drum where column begins
    const capHeight = 0.18;      // Height of capital (Daiwa)
    const cosTilt = Math.cos(tiltAngle);
    const sinTilt = Math.sin(tiltAngle);

    // Precise vertical elevations
    const yPillarTop = yBase + pillarHeight * cosTilt;                 // 5.656m
    const yCapTop = yPillarTop + capHeight * cosTilt;                   // 5.836m
    const shimakiHeight = 0.36;
    const yShimaki = yCapTop + shimakiHeight / 2;                       // 6.016m
    const kasagiHeight = 0.54;
    const yKasagi = yShimaki + shimakiHeight / 2 + kasagiHeight / 2;    // 6.466m

    // -------------------------------------------------------------
    // 3. STONE THRESHOLD APRON
    // -------------------------------------------------------------
    const thresholdGeo = this.trackGeo(new THREE.BoxGeometry(7.2, 0.08, 3.6));
    const threshold = new THREE.Mesh(thresholdGeo, sandstoneMat);
    threshold.position.set(0, 0.04, 0);
    threshold.receiveShadow = true;
    this.group.add(threshold);

    // Stone border chamfer curbs
    const curbGeo = this.trackGeo(new THREE.BoxGeometry(7.4, 0.12, 0.24));
    const curbFront = new THREE.Mesh(curbGeo, stoneMat);
    curbFront.position.set(0, 0.06, 1.8);
    curbFront.receiveShadow = true;
    this.group.add(curbFront);

    const curbBack = new THREE.Mesh(curbGeo, stoneMat);
    curbBack.position.set(0, 0.06, -1.8);
    curbBack.receiveShadow = true;
    this.group.add(curbBack);

    // -------------------------------------------------------------
    // 4. DUAL MONUMENTAL PILLARS (HASHIRA) WITH STONE BASES (KAMEBARA)
    // -------------------------------------------------------------
    // Shared geometries
    const plinthSquareGeo = this.trackGeo(new THREE.BoxGeometry(1.25, 0.22, 1.25));
    const plinthDrumGeo = this.trackGeo(new THREE.CylinderGeometry(0.52, 0.58, 0.44, 20));
    const nemakiHeight = 0.72;
    const nemakiGeo = this.trackGeo(new THREE.CylinderGeometry(0.38, 0.39, nemakiHeight, 20));
    const pillarGeo = this.trackGeo(
      new THREE.CylinderGeometry(pillarRadiusTop, pillarRadiusBase, pillarHeight, 20)
    );
    const daiwaCapitalGeo = this.trackGeo(new THREE.CylinderGeometry(0.44, 0.36, capHeight, 20));

    for (const side of [-1, 1]) {
      const px = side * pillarSpacingX;
      // In Three.js, rotation around Z by (side * tiltAngle) tilts the top inward towards X = 0
      const pillarRotZ = side * tiltAngle;

      // Stone Plinth Level 1: Square chamfered base slab
      const plinthSquare = new THREE.Mesh(plinthSquareGeo, stoneMat);
      plinthSquare.position.set(px, 0.11, 0);
      plinthSquare.castShadow = true;
      plinthSquare.receiveShadow = true;
      this.group.add(plinthSquare);

      // Stone Plinth Level 2: Molded cylindrical drum (Kamebara)
      const plinthDrum = new THREE.Mesh(plinthDrumGeo, stoneMat);
      plinthDrum.position.set(px, 0.44, 0);
      plinthDrum.castShadow = true;
      plinthDrum.receiveShadow = true;
      this.group.add(plinthDrum);

      // Protective Lacquered Black Sleeve (Nemaki) - concentric with column base
      const nemakiMidX = px - side * (nemakiHeight / 2) * sinTilt;
      const nemakiMidY = yBase + (nemakiHeight / 2) * cosTilt;
      const nemaki = new THREE.Mesh(nemakiGeo, lacquerBlackMat);
      nemaki.position.set(nemakiMidX, nemakiMidY, 0);
      nemaki.rotation.z = pillarRotZ;
      nemaki.castShadow = true;
      nemaki.receiveShadow = true;
      this.group.add(nemaki);

      // Main Cinnabar Vermilion Column Shaft - starts exactly at plinth center (px, yBase)
      const pillarMidX = px - side * (pillarHeight / 2) * sinTilt;
      const pillarMidY = yBase + (pillarHeight / 2) * cosTilt;
      const pillar = new THREE.Mesh(pillarGeo, vermilionMat);
      pillar.position.set(pillarMidX, pillarMidY, 0);
      pillar.rotation.z = pillarRotZ;
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      this.group.add(pillar);

      // Pillar Top Capital Ring (Daiwa) - sits flush at top of column
      const capMidX = px - side * (pillarHeight + capHeight / 2) * sinTilt;
      const capMidY = yBase + (pillarHeight + capHeight / 2) * cosTilt;
      const capital = new THREE.Mesh(daiwaCapitalGeo, lacquerBlackMat);
      capital.position.set(capMidX, capMidY, 0);
      capital.rotation.z = pillarRotZ;
      capital.castShadow = true;
      this.group.add(capital);

      // Gilded ornamental band around capital
      const goldRingGeo = this.trackGeo(new THREE.CylinderGeometry(0.45, 0.45, 0.05, 20));
      const goldRing = new THREE.Mesh(goldRingGeo, goldMat);
      goldRing.position.set(capMidX, capMidY, 0);
      goldRing.rotation.z = pillarRotZ;
      this.group.add(goldRing);
    }

    // -------------------------------------------------------------
    // 5. SECONDARY TIE-BEAM (NUKI) & WEDGES (KUSABI)
    // -------------------------------------------------------------
    const nukiY = 4.25;
    const nukiLength = 8.6;
    const nukiBeamGeo = this.trackGeo(new THREE.BoxGeometry(nukiLength, 0.38, 0.28));
    const nukiBeam = new THREE.Mesh(nukiBeamGeo, vermilionMat);
    nukiBeam.position.set(0, nukiY, 0);
    nukiBeam.castShadow = true;
    nukiBeam.receiveShadow = true;
    this.group.add(nukiBeam);

    // Beveled end caps on Nuki
    const nukiEndGeo = this.trackGeo(new THREE.BoxGeometry(0.18, 0.40, 0.30));
    for (const side of [-1, 1]) {
      const nukiEnd = new THREE.Mesh(nukiEndGeo, lacquerBlackMat);
      nukiEnd.position.set(side * (nukiLength / 2 - 0.08), nukiY, 0);
      nukiEnd.castShadow = true;
      this.group.add(nukiEnd);

      // Wedge pegs (Kusabi) protruding through beam adjacent to pillar
      const colAtNukiX = side * (pillarSpacingX - (nukiY - yBase) * Math.tan(tiltAngle));
      for (const f of [-1, 1]) {
        const wedgeGeo = this.trackGeo(new THREE.BoxGeometry(0.10, 0.54, 0.08));
        const wedge = new THREE.Mesh(wedgeGeo, lacquerBlackMat);
        wedge.position.set(colAtNukiX - side * 0.42, nukiY, f * 0.16);
        this.group.add(wedge);
      }
    }

    // -------------------------------------------------------------
    // 6. CENTRAL PLAQUE STRUT (GAKUZUKA) & SHRINE TABLETS (DUAL-FACED)
    // -------------------------------------------------------------
    const nukiTopY = nukiY + 0.19;
    const shimakiBotY = yShimaki - shimakiHeight / 2;
    const strutH = shimakiBotY - nukiTopY;
    const strutMidY = nukiTopY + strutH / 2;
    const strutGeo = this.trackGeo(new THREE.BoxGeometry(0.52, strutH, 0.26));
    const strut = new THREE.Mesh(strutGeo, vermilionMat);
    strut.position.set(0, strutMidY, 0);
    strut.castShadow = true;
    strut.receiveShadow = true;
    this.group.add(strut);

    // Dual-Faced Framed Shrine Tablet (Authentic Shinto Gakuzuka on both North & South approach)
    for (const f of [-1, 1]) {
      const tabletZ = f * 0.16;

      // Lacquered Black Tablet Board
      const tabletBoardGeo = this.trackGeo(new THREE.BoxGeometry(0.96, 1.10, 0.05));
      const tabletBoard = new THREE.Mesh(tabletBoardGeo, lacquerBlackMat);
      tabletBoard.position.set(0, strutMidY, tabletZ);
      tabletBoard.castShadow = true;
      tabletBoard.receiveShadow = true;
      this.group.add(tabletBoard);

      // Gold frame bezel around tablet
      const frameGeo = this.trackGeo(new THREE.BoxGeometry(1.04, 1.18, 0.03));
      const frame = new THREE.Mesh(frameGeo, goldMat);
      frame.position.set(0, strutMidY, tabletZ - f * 0.015);
      this.group.add(frame);

      // Gold emblem / Kanji medallion
      const emblemGeo = this.trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.05, 16));
      emblemGeo.rotateX(Math.PI / 2);
      const emblem = new THREE.Mesh(emblemGeo, goldMat);
      emblem.position.set(0, strutMidY, tabletZ + f * 0.032);
      this.group.add(emblem);
    }

    // -------------------------------------------------------------
    // 7. DUAL-TIER CURVED LINTEL (SHIMAKI & KASAGI WITH SORI)
    // -------------------------------------------------------------
    // Lower Shimaki beam resting directly on capitals
    const shimakiLength = 8.6;
    const kasagiWidth = 0.62;
    const shimakiGeo = this.trackGeo(new THREE.BoxGeometry(shimakiLength, shimakiHeight, kasagiWidth * 0.88));
    const shimaki = new THREE.Mesh(shimakiGeo, vermilionMat);
    shimaki.position.set(0, yShimaki, 0);
    shimaki.castShadow = true;
    shimaki.receiveShadow = true;
    this.group.add(shimaki);

    // Build parametric upward-curving Kasagi resting on Shimaki
    const kasagiSegments = 24;
    const kasagiSpan = 9.8;
    const soriApexRise = 0.42; // Upward sweep at the tips

    const kasagiGroup = new THREE.Group();
    kasagiGroup.position.set(0, yKasagi, 0);

    const segmentSpan = kasagiSpan / kasagiSegments;
    const segmentGeo = this.trackGeo(
      new THREE.BoxGeometry(segmentSpan * 1.02, kasagiHeight, kasagiWidth)
    );
    const roofCapGeo = this.trackGeo(
      new THREE.BoxGeometry(segmentSpan * 1.03, 0.10, kasagiWidth + 0.14)
    );

    for (let i = 0; i < kasagiSegments; i++) {
      const segX = -kasagiSpan / 2 + (i + 0.5) * segmentSpan;
      const u = segX / (kasagiSpan / 2);
      const curveY = Math.pow(Math.abs(u), 2.2) * soriApexRise;
      const slope = (segX > 0 ? 1 : -1) * 2.2 * Math.pow(Math.abs(u), 1.2) * (soriApexRise / (kasagiSpan / 2));
      const rotZ = Math.atan(slope);

      // Vermilion main kasagi core
      const segMesh = new THREE.Mesh(segmentGeo, vermilionMat);
      segMesh.position.set(segX, curveY, 0);
      segMesh.rotation.z = rotZ;
      segMesh.castShadow = true;
      segMesh.receiveShadow = true;
      kasagiGroup.add(segMesh);

      // Obsidian lacquered black roof ridge cap
      const capMesh = new THREE.Mesh(roofCapGeo, lacquerBlackMat);
      capMesh.position.set(segX, curveY + kasagiHeight / 2 + 0.04, 0);
      capMesh.rotation.z = rotZ;
      capMesh.castShadow = true;
      kasagiGroup.add(capMesh);
    }

    // Chamfered / Angled Kasagi Finial Prow Ends (Hashizori)
    for (const side of [-1, 1]) {
      const prowEndGeo = this.trackGeo(new THREE.BoxGeometry(0.35, kasagiHeight + 0.08, kasagiWidth + 0.08));
      const prowEnd = new THREE.Mesh(prowEndGeo, lacquerBlackMat);
      const endX = side * (kasagiSpan / 2 + 0.12);
      const endY = soriApexRise + 0.04;
      prowEnd.position.set(endX, endY, 0);
      prowEnd.rotation.z = side * 0.35;
      prowEnd.castShadow = true;
      kasagiGroup.add(prowEnd);

      // Gold end-tip trim
      const goldProwGeo = this.trackGeo(new THREE.BoxGeometry(0.12, kasagiHeight + 0.12, kasagiWidth + 0.12));
      const goldProw = new THREE.Mesh(goldProwGeo, goldMat);
      goldProw.position.set(side * (kasagiSpan / 2 + 0.24), endY + 0.02, 0);
      goldProw.rotation.z = side * 0.35;
      kasagiGroup.add(goldProw);
    }

    this.group.add(kasagiGroup);

    // -------------------------------------------------------------
    // 8. FLANKING TRADITIONAL STONE LANTERNS (TŌRŌ)
    // -------------------------------------------------------------
    const lanternBaseGeo = this.trackGeo(new THREE.CylinderGeometry(0.48, 0.62, 0.35, 6));
    const lanternShaftGeo = this.trackGeo(new THREE.CylinderGeometry(0.24, 0.30, 0.95, 6));
    const lanternMiddleGeo = this.trackGeo(new THREE.CylinderGeometry(0.55, 0.38, 0.25, 6));
    const lanternBoxGeo = this.trackGeo(new THREE.CylinderGeometry(0.44, 0.44, 0.52, 6));
    const lanternRoofGeo = this.trackGeo(new THREE.ConeGeometry(0.72, 0.42, 6));
    const lanternJewelGeo = this.trackGeo(new THREE.SphereGeometry(0.12, 8, 8));
    const lightGlowGeo = this.trackGeo(new THREE.CylinderGeometry(0.38, 0.38, 0.42, 6));

    for (const side of [-1, 1]) {
      const lx = side * 4.3;
      const lz = 0.0;

      const lanternGroup = new THREE.Group();
      lanternGroup.position.set(lx, 0, lz);

      // Base pedestal
      const lBase = new THREE.Mesh(lanternBaseGeo, stoneMat);
      lBase.position.set(0, 0.175, 0);
      lBase.castShadow = true;
      lanternGroup.add(lBase);

      // Shaft
      const lShaft = new THREE.Mesh(lanternShaftGeo, stoneMat);
      lShaft.position.set(0, 0.82, 0);
      lShaft.castShadow = true;
      lanternGroup.add(lShaft);

      // Mid platform (chūdai)
      const lMid = new THREE.Mesh(lanternMiddleGeo, stoneMat);
      lMid.position.set(0, 1.42, 0);
      lMid.castShadow = true;
      lanternGroup.add(lMid);

      // Firebox window lattice (hibukuro)
      const lBox = new THREE.Mesh(lanternBoxGeo, lacquerBlackMat);
      lBox.position.set(0, 1.80, 0);
      lanternGroup.add(lBox);

      // Glowing warm interior
      const lGlow = new THREE.Mesh(lightGlowGeo, lanternGlowMat);
      lGlow.position.set(0, 1.80, 0);
      lanternGroup.add(lGlow);

      // Flared hexagonal roof (kasa)
      const lRoof = new THREE.Mesh(lanternRoofGeo, stoneMat);
      lRoof.position.set(0, 2.25, 0);
      lRoof.castShadow = true;
      lanternGroup.add(lRoof);

      // Jewel finial (hōju)
      const lJewel = new THREE.Mesh(lanternJewelGeo, goldMat);
      lJewel.position.set(0, 2.52, 0);
      lanternGroup.add(lJewel);

      this.group.add(lanternGroup);

      // Collision for stone lantern
      this.addWorldCollision(
        lx,
        0,
        lz,
        0.9 * scale,
        2.6 * scale,
        0.9 * scale,
        rootPos,
        rotY,
        onAddCollision
      );
    }

    // -------------------------------------------------------------
    // 9. SOLID PILLAR COLLISIONS (Allowing Free Walkway in Center)
    // -------------------------------------------------------------
    for (const side of [-1, 1]) {
      const px = side * pillarSpacingX;
      this.addWorldCollision(
        px,
        0,
        0,
        1.35 * scale,
        pillarHeight * scale,
        1.35 * scale,
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
