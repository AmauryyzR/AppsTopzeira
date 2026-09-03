import * as THREE from 'three';
import { createToonMaterial, TOON_PRESETS } from './shaders/ToonMaterial';
import { GrassField } from './shaders/GrassFieldShader';
import { SculptedTreesManager } from './world/SculptedTrees';
import { StylizedWater } from './shaders/StylizedWaterShader';
import { ToriiGate } from './world/ToriiGate';
import { PagodaGazebo } from './world/PagodaGazebo';
import { ArchedBridge } from './world/ArchedBridge';

export interface CollisionBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

/**
 * AAA-Grade Cel-Shaded Anime Park World (Genshin Impact & Zelda: Breath of the Wild style).
 * - Full ToonMaterial shading pipeline with discrete cel bands, warm/lavender shadows, and crisp Fresnel rims.
 * - Instanced living GrassField with real-time procedural wind and player-push physics.
 * - SculptedTreesManager with organic curved trunks and cloud-like volumetric foliage canopies.
 * - StylizedWater with Trochoidal waves, Voronoi caustics, shoreline foam rim, and fountain cascades/jets.
 * - Architectural Triad: Monumental Torii Gate (South), Pagoda Gazebo (East), and Taiko Bashi Arched Bridge (West).
 * - Architectural chamfering on stone plazas, curbs, benches, fountain basins, and parkour platforms.
 * - Comprehensive geometry & material tracking for strict zero-leak disposal.
 */
export class ParkWorld {
  public readonly group = new THREE.Group();
  public readonly collisionBoxes: CollisionBox[] = [];
  public readonly grassField: GrassField;
  public readonly treesManager: SculptedTreesManager;
  public readonly water: StylizedWater;
  public readonly toriiGate: ToriiGate;
  public readonly pagodaGazebo: PagodaGazebo;
  public readonly archedBridge: ArchedBridge;

  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];

  constructor() {
    this.buildGroundAndPaths();
    this.grassField = new GrassField();
    this.group.add(this.grassField.mesh);

    this.treesManager = new SculptedTreesManager((x, y, z, w, h, d) => {
      this.addCollision(x, y, z, w, h, d);
    });
    this.group.add(this.treesManager.group);

    this.water = new StylizedWater();
    this.group.add(this.water.group);

    this.buildBenches();
    this.buildStreetLamps();
    this.buildCentralFountain();
    this.buildObstacleCourse();
    this.buildBoundaryFence();

    // -------------------------------------------------------------
    // ARCHITECTURAL TRIAD (Loop 6): Torii Gate, Pagoda Gazebo, Taiko Bashi
    // -------------------------------------------------------------
    // 1. Monumental Torii Gate at South Entrance (z = 42m)
    this.toriiGate = new ToriiGate(
      { position: new THREE.Vector3(0, 0, 42) },
      (x, y, z, w, h, d) => this.addCollision(x, y, z, w, h, d)
    );
    this.group.add(this.toriiGate.group);

    // 2. Zen Pagoda Gazebo of Contemplation at East Plaza (x = 36m)
    this.pagodaGazebo = new PagodaGazebo(
      { position: new THREE.Vector3(36, 0, 0) },
      (x, y, z, w, h, d) => this.addCollision(x, y, z, w, h, d)
    );
    this.group.add(this.pagodaGazebo.group);

    // 3. Traditional Taiko Bashi / Arched Moon Bridge at West Canal (x = -34m)
    this.archedBridge = new ArchedBridge(
      { position: new THREE.Vector3(-34, 0, 0) },
      (x, y, z, w, h, d) => this.addCollision(x, y, z, w, h, d)
    );
    this.group.add(this.archedBridge.group);
  }

  private track<T extends THREE.BufferGeometry>(geo: T): T {
    this.geometries.push(geo);
    return geo;
  }

  private trackMat<T extends THREE.Material>(mat: T): T {
    this.materials.push(mat);
    return mat;
  }

  private addCollision(x: number, y: number, z: number, width: number, height: number, depth: number) {
    const halfW = width / 2;
    const halfD = depth / 2;
    this.collisionBoxes.push({
      min: new THREE.Vector3(x - halfW, y, z - halfD),
      max: new THREE.Vector3(x + halfW, y + height, z + halfD),
    });
  }

  private buildGroundAndPaths() {
    // 1. Lush Green Grass Lawn (Cel-Shaded Zelda BotW Emerald Green)
    const lawnGeo = this.track(new THREE.PlaneGeometry(160, 160, 32, 32));
    lawnGeo.rotateX(-Math.PI / 2);
    const lawnMat = this.trackMat(createToonMaterial(TOON_PRESETS.grass));
    const lawnMesh = new THREE.Mesh(lawnGeo, lawnMat);
    lawnMesh.receiveShadow = true;
    this.group.add(lawnMesh);

    // 2. Stone Plaza with Chamfered Steps & Decorative Inlay
    const stoneMat = this.trackMat(createToonMaterial(TOON_PRESETS.stone));
    const sandstoneMat = this.trackMat(createToonMaterial(TOON_PRESETS.sandstone));

    // Lower chamfered rim step
    const plazaBaseGeo = this.track(new THREE.CylinderGeometry(14.4, 14.8, 0.04, 48));
    const plazaBase = new THREE.Mesh(plazaBaseGeo, stoneMat);
    plazaBase.position.set(0, 0.02, 0);
    plazaBase.receiveShadow = true;
    this.group.add(plazaBase);

    // Main elevated stone plaza
    const plazaMainGeo = this.track(new THREE.CylinderGeometry(14.0, 14.4, 0.05, 48));
    const plazaMain = new THREE.Mesh(plazaMainGeo, stoneMat);
    plazaMain.position.set(0, 0.065, 0);
    plazaMain.receiveShadow = true;
    this.group.add(plazaMain);

    // Plaza decorative central compass/sunburst inlay
    const inlayGeo = this.track(new THREE.RingGeometry(5.2, 5.8, 48));
    inlayGeo.rotateX(-Math.PI / 2);
    const inlayMesh = new THREE.Mesh(inlayGeo, sandstoneMat);
    inlayMesh.position.set(0, 0.092, 0);
    inlayMesh.receiveShadow = true;
    this.group.add(inlayMesh);

    // 3. Sandstone Walking Paths with Polished Stone Curb Chamfers
    // North-South Path
    const nsPathGeo = this.track(new THREE.BoxGeometry(4.4, 0.05, 120));
    const nsPath = new THREE.Mesh(nsPathGeo, sandstoneMat);
    nsPath.position.set(0, 0.035, 0);
    nsPath.receiveShadow = true;
    this.group.add(nsPath);

    // North-South Curbs (chamfered stone edges for cel-shading rim highlights)
    const curbW = 0.22;
    const curbH = 0.07;
    const nsCurbL = new THREE.Mesh(this.track(new THREE.BoxGeometry(curbW, curbH, 120)), stoneMat);
    nsCurbL.position.set(-2.31, 0.04, 0);
    nsCurbL.receiveShadow = true;
    this.group.add(nsCurbL);

    const nsCurbR = new THREE.Mesh(this.track(new THREE.BoxGeometry(curbW, curbH, 120)), stoneMat);
    nsCurbR.position.set(2.31, 0.04, 0);
    nsCurbR.receiveShadow = true;
    this.group.add(nsCurbR);

    // East-West Path
    const ewPathGeo = this.track(new THREE.BoxGeometry(120, 0.05, 4.4));
    const ewPath = new THREE.Mesh(ewPathGeo, sandstoneMat);
    ewPath.position.set(0, 0.035, 0);
    ewPath.receiveShadow = true;
    this.group.add(ewPath);

    // East-West Curbs
    const ewCurbT = new THREE.Mesh(this.track(new THREE.BoxGeometry(120, curbH, curbW)), stoneMat);
    ewCurbT.position.set(0, 0.04, -2.31);
    ewCurbT.receiveShadow = true;
    this.group.add(ewCurbT);

    const ewCurbB = new THREE.Mesh(this.track(new THREE.BoxGeometry(120, curbH, curbW)), stoneMat);
    ewCurbB.position.set(0, 0.04, 2.31);
    ewCurbB.receiveShadow = true;
    this.group.add(ewCurbB);

    // Outer Circular Jogging Ring
    const ringGeo = this.track(new THREE.RingGeometry(38, 43, 64));
    ringGeo.rotateX(-Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, sandstoneMat);
    ringMesh.position.set(0, 0.04, 0);
    ringMesh.receiveShadow = true;
    this.group.add(ringMesh);
  }

  private buildBenches() {
    const woodMat = this.trackMat(createToonMaterial(TOON_PRESETS.wood));
    const ironMat = this.trackMat(createToonMaterial(TOON_PRESETS.iron));

    // Shared bench geometries across all benches
    const seatPlankGeo = this.track(new THREE.BoxGeometry(2.2, 0.08, 0.17));
    const backPlankGeo = this.track(new THREE.BoxGeometry(2.2, 0.19, 0.07));
    const legGeo = this.track(new THREE.BoxGeometry(0.09, 0.44, 0.62));
    const backUprightGeo = this.track(new THREE.BoxGeometry(0.08, 0.52, 0.08));
    const armrestGeo = this.track(new THREE.BoxGeometry(0.08, 0.06, 0.48));

    const benchConfigs = [
      { x: 10, z: 5, rot: -Math.PI / 4 },
      { x: -10, z: 5, rot: Math.PI / 4 },
      { x: 10, z: -5, rot: -3 * Math.PI / 4 },
      { x: -10, z: -5, rot: 3 * Math.PI / 4 },
      { x: 0, z: 22, rot: Math.PI },
      { x: 0, z: -22, rot: 0 },
      { x: 22, z: 0, rot: -Math.PI / 2 },
      { x: -22, z: 0, rot: Math.PI / 2 },
    ];

    for (const b of benchConfigs) {
      const benchGroup = new THREE.Group();
      benchGroup.position.set(b.x, 0, b.z);
      benchGroup.rotation.y = b.rot;

      // Triple Chamfered Wood Planks for Seat (visible anime wood seams)
      for (let s = 0; s < 3; s++) {
        const plank = new THREE.Mesh(seatPlankGeo, woodMat);
        plank.position.set(0, 0.45, -0.19 + s * 0.19);
        plank.castShadow = true;
        plank.receiveShadow = true;
        benchGroup.add(plank);
      }

      // Dual Chamfered Wood Planks for Backrest
      for (let br = 0; br < 2; br++) {
        const backPlank = new THREE.Mesh(backPlankGeo, woodMat);
        backPlank.position.set(0, 0.72 + br * 0.22, -0.28);
        backPlank.castShadow = true;
        benchGroup.add(backPlank);
      }

      // Sculpted Wrought-Iron Side Supports & Armrests with Silver Rim
      for (const sideX of [-0.95, 0.95]) {
        // Leg riser
        const leg = new THREE.Mesh(legGeo, ironMat);
        leg.position.set(sideX, 0.22, 0);
        leg.castShadow = true;
        benchGroup.add(leg);

        // Back upright
        const backUpright = new THREE.Mesh(backUprightGeo, ironMat);
        backUpright.position.set(sideX, 0.70, -0.26);
        backUpright.castShadow = true;
        benchGroup.add(backUpright);

        // Armrest loop
        const armrest = new THREE.Mesh(armrestGeo, ironMat);
        armrest.position.set(sideX, 0.60, 0.02);
        armrest.castShadow = true;
        benchGroup.add(armrest);
      }

      this.group.add(benchGroup);
      this.addCollision(b.x, 0, b.z, 2.4, 1.0, 0.9);
    }
  }

  private buildStreetLamps() {
    const ironMat = this.trackMat(createToonMaterial(TOON_PRESETS.iron));
    const glowMat = this.trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xfff3b0,
      })
    );

    // Shared lamp geometries across all 8 street lamps
    const basePedestalGeo = this.track(new THREE.CylinderGeometry(0.26, 0.38, 0.45, 8));
    const poleGeo = this.track(new THREE.CylinderGeometry(0.10, 0.15, 3.8, 8));
    const collarGeo = this.track(new THREE.CylinderGeometry(0.20, 0.16, 0.15, 8));
    const lanternHeadGeo = this.track(new THREE.CylinderGeometry(0.42, 0.22, 0.55, 6));
    const bulbGeo = this.track(new THREE.SphereGeometry(0.26, 12, 12));

    const lampPositions = [
      [8, 8], [-8, 8], [8, -8], [-8, -8],
      [2.4, 28], [-2.4, -28], [26, 2.4], [-24, 2.4],
    ];

    for (const [x, z] of lampPositions) {
      const lamp = new THREE.Group();
      lamp.position.set(x, 0, z);

      // Chamfered Base Pedestal
      const basePedestal = new THREE.Mesh(basePedestalGeo, ironMat);
      basePedestal.position.set(0, 0.225, 0);
      basePedestal.castShadow = true;
      lamp.add(basePedestal);

      // Main Pole Column
      const pole = new THREE.Mesh(poleGeo, ironMat);
      pole.position.set(0, 2.15, 0);
      pole.castShadow = true;
      lamp.add(pole);

      // Ornamental Collar Ring
      const collar = new THREE.Mesh(collarGeo, ironMat);
      collar.position.set(0, 4.0, 0);
      lamp.add(collar);

      // Chamfered Hexagonal Lantern Hood
      const head = new THREE.Mesh(lanternHeadGeo, ironMat);
      head.position.set(0, 4.4, 0);
      lamp.add(head);

      // Glowing Warm Amber/Yellow Bulb
      const bulb = new THREE.Mesh(bulbGeo, glowMat);
      bulb.position.set(0, 4.12, 0);
      lamp.add(bulb);

      this.group.add(lamp);
      this.addCollision(x, 0, z, 0.5, 4.6, 0.5);
    }
  }

  private buildCentralFountain() {
    const stoneMat = this.trackMat(createToonMaterial(TOON_PRESETS.stone));

    const sandstoneMat = this.trackMat(createToonMaterial(TOON_PRESETS.sandstone));

    // Multi-Tier Chamfered Basin
    // Lower Outer Footing
    const footing = new THREE.Mesh(
      this.track(new THREE.CylinderGeometry(4.7, 5.0, 0.25, 32)),
      stoneMat
    );
    footing.position.set(0, 0.125, 0);
    footing.castShadow = true;
    footing.receiveShadow = true;
    this.group.add(footing);

    // Main Outer Basin Wall (Open-ended hollow ring, allowing water to fill the interior)
    const basin = new THREE.Mesh(
      this.track(new THREE.CylinderGeometry(4.2, 4.6, 0.85, 32, 1, true)),
      stoneMat
    );
    basin.position.set(0, 0.55, 0);
    basin.castShadow = true;
    basin.receiveShadow = true;
    this.group.add(basin);

    // Basin Interior Sandstone Floor (visible beneath the translucent stylized water)
    const basinFloor = new THREE.Mesh(
      this.track(new THREE.CylinderGeometry(4.15, 4.15, 0.10, 32)),
      sandstoneMat
    );
    basinFloor.position.set(0, 0.48, 0);
    basinFloor.receiveShadow = true;
    this.group.add(basinFloor);

    // Smooth Chamfered Basin Coping Rim (Torus radius 4.25, tube 0.20, apex y=0.98)
    const coping = new THREE.Mesh(
      this.track(new THREE.TorusGeometry(4.25, 0.20, 10, 36)),
      stoneMat
    );
    coping.rotation.x = Math.PI / 2;
    coping.position.set(0, 0.98, 0);
    coping.castShadow = true;
    coping.receiveShadow = true;
    this.group.add(coping);

    // Center Molded Pedestal Column
    const pedestalBase = new THREE.Mesh(
      this.track(new THREE.CylinderGeometry(1.2, 1.5, 0.4, 16)),
      stoneMat
    );
    pedestalBase.position.set(0, 1.0, 0);
    pedestalBase.castShadow = true;
    pedestalBase.receiveShadow = true;
    this.group.add(pedestalBase);

    const pedestalShaft = new THREE.Mesh(
      this.track(new THREE.CylinderGeometry(0.85, 1.05, 1.6, 16)),
      stoneMat
    );
    pedestalShaft.position.set(0, 1.8, 0);
    pedestalShaft.castShadow = true;
    pedestalShaft.receiveShadow = true;
    this.group.add(pedestalShaft);

    // Elevated Upper Cascading Water Bowl (Open-ended bowl with interior sandstone floor)
    const topBowl = new THREE.Mesh(
      this.track(new THREE.CylinderGeometry(1.9, 0.9, 0.55, 24, 1, true)),
      stoneMat
    );
    topBowl.position.set(0, 2.7, 0);
    topBowl.castShadow = true;
    topBowl.receiveShadow = true;
    this.group.add(topBowl);

    const topBowlFloor = new THREE.Mesh(
      this.track(new THREE.CylinderGeometry(1.55, 1.55, 0.08, 24)),
      sandstoneMat
    );
    topBowlFloor.position.set(0, 2.62, 0);
    topBowlFloor.receiveShadow = true;
    this.group.add(topBowlFloor);

    // -----------------------------------------------------------------
    // REFINED FOUNTAIN COLLISIONS (Zero Invisible Air Walls):
    // 1. Central Pedestal Column Collision (width 2.2m, height 2.4m)
    // 2. 8-Segment Octagonal Approximation along the Stone Ring (height 0.98m)
    //    Allows player to jump up, balance and walk on top of the rim,
    //    and jump directly into the water pool or onto the pedestal!
    // -----------------------------------------------------------------
    // 1. Central Pedestal Column Collision (width 2.2m, height 2.4m)
    this.addCollision(0, 0, 0, 2.2, 2.4, 2.2);

    // 2. Basin Interior Floor (y = 0.48m) - allowing knee-deep wading in the translucent water
    this.addCollision(0, 0, 0, 7.6, 0.48, 7.6);

    // 3. 8-Segment Octagonal Approximation along the Stone Ring (~1.1m narrow rim thickness):
    // Cardinal Ring Collisions
    this.addCollision(4.25, 0, 0, 1.1, 0.98, 3.6);     // East
    this.addCollision(-4.25, 0, 0, 1.1, 0.98, 3.6);    // West
    this.addCollision(0, 0, -4.25, 3.6, 0.98, 1.1);    // North
    this.addCollision(0, 0, 4.25, 3.6, 0.98, 1.1);     // South

    // Diagonal Ring Collisions (~1.1m thickness, eliminating invisible air platforms inside the pool)
    this.addCollision(3.1, 0, -3.1, 1.1, 0.98, 1.1);   // North-East
    this.addCollision(-3.1, 0, -3.1, 1.1, 0.98, 1.1);  // North-West
    this.addCollision(3.1, 0, 3.1, 1.1, 0.98, 1.1);    // South-East
    this.addCollision(-3.1, 0, 3.1, 1.1, 0.98, 1.1);   // South-West
  }

  private buildObstacleCourse() {
    const amberMat = this.trackMat(createToonMaterial(TOON_PRESETS.amber));
    const woodMat = this.trackMat(createToonMaterial(TOON_PRESETS.wood));
    const stoneMat = this.trackMat(createToonMaterial(TOON_PRESETS.stone));

    // 1. Chamfered Parkour Stepping Pillars in North-East Playground Area
    const platforms = [
      { x: 18, y: 0.35, z: 18, w: 2.2, h: 0.7, d: 2.2 },
      { x: 22, y: 0.70, z: 18, w: 2.2, h: 1.4, d: 2.2 },
      { x: 26, y: 1.10, z: 18, w: 2.2, h: 2.2, d: 2.2 },
      { x: 26, y: 1.10, z: 22, w: 2.2, h: 2.2, d: 2.2 },
      { x: 22, y: 1.50, z: 22, w: 2.2, h: 3.0, d: 2.2 },
      { x: 18, y: 1.80, z: 22, w: 2.2, h: 3.6, d: 2.2 },
    ];

    for (const p of platforms) {
      // Main pillar body
      const mesh = new THREE.Mesh(
        this.track(new THREE.BoxGeometry(p.w, p.h, p.d)),
        amberMat
      );
      mesh.position.set(p.x, p.y, p.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.group.add(mesh);

      // Chamfered cap plate on top for crisp cel-shading bevel rim
      const capTop = new THREE.Mesh(
        this.track(new THREE.BoxGeometry(p.w + 0.15, 0.08, p.d + 0.15)),
        stoneMat
      );
      capTop.position.set(p.x, p.y + p.h / 2 + 0.04, p.z);
      capTop.castShadow = true;
      capTop.receiveShadow = true;
      this.group.add(capTop);

      this.addCollision(p.x, 0, p.z, p.w + 0.15, p.h + 0.08, p.d + 0.15);
    }

    // 2. Elevated Cedar Wood Walkway Bridge in South-West Playground Area
    const bridgeY = 1.25;
    const bridgeWidth = 3.2;
    const bridgeLength = 14.0;

    // Longitudinal support beams
    for (const bx of [-1.35, 1.35]) {
      const beam = new THREE.Mesh(
        this.track(new THREE.BoxGeometry(0.24, 0.35, bridgeLength)),
        woodMat
      );
      beam.position.set(-24 + bx, bridgeY - 0.12, -24);
      beam.castShadow = true;
      this.group.add(beam);
    }

    // Individual Chamfered Wooden Deck Planks (reusing single BoxGeometry)
    const plankCount = 28;
    const plankSpacing = bridgeLength / plankCount;
    const deckPlankGeo = this.track(new THREE.BoxGeometry(bridgeWidth, 0.12, plankSpacing * 0.85));
    for (let i = 0; i < plankCount; i++) {
      const pz = -24 - bridgeLength / 2 + (i + 0.5) * plankSpacing;
      const deckPlank = new THREE.Mesh(deckPlankGeo, woodMat);
      deckPlank.position.set(-24, bridgeY + 0.06, pz);
      deckPlank.castShadow = true;
      deckPlank.receiveShadow = true;
      this.group.add(deckPlank);
    }

    this.addCollision(-24, 0, -24, bridgeWidth, bridgeY + 0.20, bridgeLength);

    // Bridge Chamfered Support Pillars with Footing (shared geometries)
    const bridgePostGeo = this.track(new THREE.BoxGeometry(0.32, bridgeY, 0.32));
    const bridgeFootingGeo = this.track(new THREE.BoxGeometry(0.50, 0.25, 0.50));

    for (const pz of [-30, -24, -18]) {
      for (const px of [-25.4, -22.6]) {
        // Vertical post
        const post = new THREE.Mesh(bridgePostGeo, woodMat);
        post.position.set(px, bridgeY / 2, pz);
        post.castShadow = true;
        this.group.add(post);

        // Stone footing block
        const footing = new THREE.Mesh(bridgeFootingGeo, stoneMat);
        footing.position.set(px, 0.125, pz);
        footing.castShadow = true;
        this.group.add(footing);
      }
    }
  }

  private buildBoundaryFence() {
    const fenceMat = this.trackMat(
      createToonMaterial({
        color: 0xf1f5f9, // Crisp porcelain white anime fence
        gradientBands: 4,
        rimColor: 0xffffff,
        rimPower: 2.8,
        rimIntensity: 0.65,
        shadowColor: 0x94a3b8, // Soft lavender-slate anime shadow
        shadowIntensity: 0.50,
      })
    );
    const postMat = this.trackMat(
      createToonMaterial({
        color: 0xe2e8f0,
        gradientBands: 4,
        rimColor: 0xffffff,
        rimPower: 2.6,
        rimIntensity: 0.70,
        shadowColor: 0x64748b,
        shadowIntensity: 0.55,
      })
    );

    const parkRadius = 70;
    // Boundary collision walls around perimeter
    this.addCollision(0, 0, parkRadius, 160, 4.0, 2.0);
    this.addCollision(0, 0, -parkRadius, 160, 4.0, 2.0);
    this.addCollision(parkRadius, 0, 0, 2.0, 4.0, 160);
    this.addCollision(-parkRadius, 0, 0, 2.0, 4.0, 160);

    // Shared Post & Rail Geometries
    const postCount = 36;
    const postShaftGeo = this.track(new THREE.BoxGeometry(0.36, 1.25, 0.36));
    const postCapGeo = this.track(new THREE.ConeGeometry(0.28, 0.28, 4));
    const span = 2 * parkRadius * Math.sin(Math.PI / postCount);
    const fenceRailGeo = this.track(new THREE.BoxGeometry(0.12, 0.16, span));

    // Decorative White Chamfered Posts with Diamond Tops around border
    for (let i = 0; i < postCount; i++) {
      const angle = (i / postCount) * Math.PI * 2;
      const x = Math.cos(angle) * parkRadius;
      const z = Math.sin(angle) * parkRadius;

      const postGroup = new THREE.Group();
      postGroup.position.set(x, 0, z);
      postGroup.rotation.y = -angle;

      // Vertical Post Shaft
      const shaft = new THREE.Mesh(postShaftGeo, postMat);
      shaft.position.set(0, 0.625, 0);
      shaft.castShadow = true;
      postGroup.add(shaft);

      // Chamfered Pyramid / Diamond Cap
      const cap = new THREE.Mesh(postCapGeo, postMat);
      cap.position.set(0, 1.39, 0);
      cap.rotation.y = Math.PI / 4;
      cap.castShadow = true;
      postGroup.add(cap);

      // Dual Horizontal Rails Connecting Posts
      for (const railY of [0.45, 0.92]) {
        const rail = new THREE.Mesh(fenceRailGeo, fenceMat);
        rail.position.set(0, railY, span / 2);
        rail.castShadow = true;
        postGroup.add(rail);
      }

      this.group.add(postGroup);
    }
  }

  public update(dt: number, sunDir?: THREE.Vector3) {
    this.water.update(dt, sunDir);
  }

  public dispose() {
    this.toriiGate.dispose();
    this.pagodaGazebo.dispose();
    this.archedBridge.dispose();
    this.grassField.dispose();
    this.treesManager.dispose();
    this.water.dispose();
    for (const g of this.geometries) g.dispose();
    for (const m of this.materials) m.dispose();
    this.geometries = [];
    this.materials = [];
  }
}
