import * as THREE from 'three';
import { createToonMaterial, TOON_PRESETS } from '../shaders/ToonMaterial';

export type AddCollisionFn = (
  x: number,
  y: number,
  z: number,
  w: number,
  h: number,
  d: number
) => void;

/**
 * AAA-Grade Japanese Zen Rock Garden (Karesansui) & Stepping Stones (Tobi-Ishi) (Loop 10)
 * - Raked white sand ripples (Samon) with concentric wave reliefs.
 * - Sacred Zen Boulder Triad (Sanzon-seki) representing Heaven, Earth, and Humanity.
 * - Weathered moss caps and warm cel-shaded slate stone.
 * - Meandering river stepping stones (Tobi-ishi) with authentic physical collisions for parkour jumping.
 */
export class ZenRockGarden {
  public readonly group = new THREE.Group();

  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];

  constructor(
    private centerX = 22,
    private centerZ = 20,
    private width = 17.0,
    private depth = 11.0,
    private addCollision: AddCollisionFn
  ) {
    this.group.position.set(centerX, 0, centerZ);
    this.buildGardenBed();
    this.buildSacredBoulders();
    this.buildSteppingStones();
  }

  private trackGeo<T extends THREE.BufferGeometry>(geo: T): T {
    this.geometries.push(geo);
    return geo;
  }

  private trackMat<T extends THREE.Material>(mat: T): T {
    this.materials.push(mat);
    return mat;
  }

  // =========================================================================
  // 1. RAKED SAND BED & CURBED WOODEN BORDER (SAMON)
  // =========================================================================
  private buildGardenBed() {
    const width = this.width;
    const depth = this.depth;

    // Dark polished cypress wood curb enclosure
    const curbMat = this.trackMat(createToonMaterial(TOON_PRESETS.wood));
    const sandMat = this.trackMat(
      createToonMaterial({
        color: 0xdfd5be, // Natural warm raked quartz sand
        gradientBands: 4,
        rimColor: 0xffedd5,
        rimPower: 4.5,
        rimIntensity: 0.15,
        shadowColor: 0xb4a489,
        shadowIntensity: 0.40,
      })
    );

    // Raised Sand Platform with chamfered edge
    const sandGeo = this.trackGeo(new THREE.BoxGeometry(width - 0.4, 0.22, depth - 0.4));
    const sandMesh = new THREE.Mesh(sandGeo, sandMat);
    sandMesh.position.set(0, 0.11, 0);
    sandMesh.receiveShadow = true;
    this.group.add(sandMesh);

    // Wooden Border Curbs (North, South, East, West)
    const curbThick = 0.35;
    const curbHeight = 0.32;

    const northSouthGeo = this.trackGeo(new THREE.BoxGeometry(width + curbThick, curbHeight, curbThick));
    const eastWestGeo = this.trackGeo(new THREE.BoxGeometry(curbThick, curbHeight, depth + curbThick));

    const northCurb = new THREE.Mesh(northSouthGeo, curbMat);
    northCurb.position.set(0, curbHeight / 2, -(depth / 2));
    northCurb.castShadow = true;
    northCurb.receiveShadow = true;
    this.group.add(northCurb);

    const southCurb = new THREE.Mesh(northSouthGeo, curbMat);
    southCurb.position.set(0, curbHeight / 2, depth / 2);
    southCurb.castShadow = true;
    southCurb.receiveShadow = true;
    this.group.add(southCurb);

    const eastCurb = new THREE.Mesh(eastWestGeo, curbMat);
    eastCurb.position.set(width / 2, curbHeight / 2, 0);
    eastCurb.castShadow = true;
    eastCurb.receiveShadow = true;
    this.group.add(eastCurb);

    const westCurb = new THREE.Mesh(eastWestGeo, curbMat);
    westCurb.position.set(-(width / 2), curbHeight / 2, 0);
    westCurb.castShadow = true;
    westCurb.receiveShadow = true;
    this.group.add(westCurb);

    // Concentric Raked Sand Ripple Rings around Boulders
    const rippleMat = this.trackMat(
      createToonMaterial({
        color: 0xfef08a,
        gradientBands: 3,
        shadowColor: 0xeab308,
        shadowIntensity: 0.30,
      })
    );

    for (let r = 0; r < 3; r++) {
      const ringGeo = this.trackGeo(new THREE.TorusGeometry(1.6 + r * 0.75, 0.045, 6, 28));
      ringGeo.rotateX(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, rippleMat);
      ring.position.set(-1.8, 0.23, 0.5);
      ring.receiveShadow = true;
      this.group.add(ring);
    }

    // Register boundary collision
    this.addCollision(this.centerX, 0, this.centerZ, width + 0.4, 0.35, depth + 0.4);
  }

  // =========================================================================
  // 2. SACRED ZEN BOULDER TRIAD (SANZON-SEKI)
  // =========================================================================
  private buildSacredBoulders() {
    const rockMat = this.trackMat(createToonMaterial(TOON_PRESETS.stone));
    const mossMat = this.trackMat(
      createToonMaterial({
        color: 0x4d7c0f, // Deep rich velvety moss
        gradientBands: 3,
        rimColor: 0xa3e635,
        rimPower: 2.8,
        rimIntensity: 0.70,
        shadowColor: 0x365314,
        shadowIntensity: 0.45,
      })
    );

    // Boulder 1: The Heaven Stone (Tallest, majestic vertical monolith)
    const tallRockGeo = this.trackGeo(new THREE.DodecahedronGeometry(1.4, 1));
    tallRockGeo.scale(0.85, 1.85, 0.95);
    const tallRock = new THREE.Mesh(tallRockGeo, rockMat);
    tallRock.position.set(-1.8, 1.4, 0.5);
    tallRock.rotation.set(0.12, 0.45, -0.08);
    tallRock.castShadow = true;
    tallRock.receiveShadow = true;
    this.group.add(tallRock);

    // Moss cap on top of Heaven Stone
    const mossCap1Geo = this.trackGeo(new THREE.SphereGeometry(0.72, 10, 8));
    mossCap1Geo.scale(0.9, 0.35, 0.9);
    const mossCap1 = new THREE.Mesh(mossCap1Geo, mossMat);
    mossCap1.position.set(-1.8, 2.8, 0.5);
    this.group.add(mossCap1);

    this.addCollision(this.centerX - 1.8, 0, this.centerZ + 0.5, 1.8, 3.2, 1.8);

    // Boulder 2: The Humanity Stone (Medium angled guardian stone)
    const medRockGeo = this.trackGeo(new THREE.DodecahedronGeometry(1.15, 1));
    medRockGeo.scale(1.2, 1.1, 0.9);
    const medRock = new THREE.Mesh(medRockGeo, rockMat);
    medRock.position.set(0.2, 0.85, -1.2);
    medRock.rotation.set(-0.18, -0.32, 0.22);
    medRock.castShadow = true;
    medRock.receiveShadow = true;
    this.group.add(medRock);

    const mossCap2Geo = this.trackGeo(new THREE.SphereGeometry(0.65, 8, 6));
    mossCap2Geo.scale(1.0, 0.3, 0.85);
    const mossCap2 = new THREE.Mesh(mossCap2Geo, mossMat);
    mossCap2.position.set(0.2, 1.55, -1.2);
    this.group.add(mossCap2);

    this.addCollision(this.centerX + 0.2, 0, this.centerZ - 1.2, 1.9, 2.0, 1.6);

    // Boulder 3: The Earth Stone (Low horizontal resting stone)
    const lowRockGeo = this.trackGeo(new THREE.DodecahedronGeometry(1.0, 1));
    lowRockGeo.scale(1.45, 0.65, 1.15);
    const lowRock = new THREE.Mesh(lowRockGeo, rockMat);
    lowRock.position.set(2.4, 0.5, 1.4);
    lowRock.rotation.set(0.08, 0.75, 0.05);
    lowRock.castShadow = true;
    lowRock.receiveShadow = true;
    this.group.add(lowRock);

    this.addCollision(this.centerX + 2.4, 0, this.centerZ + 1.4, 2.0, 1.3, 1.7);
  }

  // =========================================================================
  // 3. MEANDERING STEPPING STONES (TOBI-ISHI)
  // =========================================================================
  private buildSteppingStones() {
    const stoneMat = this.trackMat(createToonMaterial(TOON_PRESETS.stone));

    // A natural curved trail of 8 flat river stepping stones leading towards the Zen garden
    const steps = [
      { x: -5.5, z: 4.2, r: 0.65, h: 0.22, rot: 0.3 },
      { x: -4.2, z: 5.8, r: 0.72, h: 0.25, rot: -0.5 },
      { x: -2.6, z: 6.9, r: 0.68, h: 0.20, rot: 0.8 },
      { x: -0.8, z: 7.5, r: 0.75, h: 0.24, rot: 0.1 },
      { x: 1.2, z: 7.8, r: 0.70, h: 0.22, rot: -0.4 },
      { x: 3.1, z: 7.2, r: 0.66, h: 0.23, rot: 0.6 },
      { x: 4.8, z: 6.0, r: 0.74, h: 0.26, rot: -0.2 },
      { x: 6.2, z: 4.4, r: 0.70, h: 0.22, rot: 0.5 },
    ];

    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      const stepGeo = this.trackGeo(new THREE.CylinderGeometry(s.r, s.r * 1.15, s.h, 10));
      stepGeo.scale(1.0, 1.0, 0.82); // Organic natural oval
      const stepMesh = new THREE.Mesh(stepGeo, stoneMat);
      stepMesh.position.set(s.x, s.h / 2, s.z);
      stepMesh.rotation.y = s.rot;
      stepMesh.castShadow = true;
      stepMesh.receiveShadow = true;
      this.group.add(stepMesh);

      // Add parkour stepping stone collision
      this.addCollision(
        this.centerX + s.x,
        0,
        this.centerZ + s.z,
        s.r * 1.8,
        s.h,
        s.r * 1.8
      );
    }
  }

  public dispose() {
    for (const g of this.geometries) g.dispose();
    for (const m of this.materials) m.dispose();
    this.geometries = [];
    this.materials = [];
  }
}
