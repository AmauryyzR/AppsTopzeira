import * as THREE from 'three';

export interface CollisionBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

export class ParkWorld {
  public readonly group = new THREE.Group();
  public readonly collisionBoxes: CollisionBox[] = [];

  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];

  constructor() {
    this.buildGroundAndPaths();
    this.buildTrees();
    this.buildBenches();
    this.buildStreetLamps();
    this.buildCentralFountain();
    this.buildObstacleCourse();
    this.buildBoundaryFence();
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
    // 1. Lush Green Grass Lawn
    const lawnGeo = this.track(new THREE.PlaneGeometry(160, 160, 32, 32));
    lawnGeo.rotateX(-Math.PI / 2);
    const lawnMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x48a834,
        roughness: 0.85,
        metalness: 0.05,
      })
    );
    const lawnMesh = new THREE.Mesh(lawnGeo, lawnMat);
    lawnMesh.receiveShadow = true;
    this.group.add(lawnMesh);

    // 2. Central Stone Plaza
    const plazaGeo = this.track(new THREE.CylinderGeometry(14, 14, 0.08, 32));
    const plazaMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd1d5db,
        roughness: 0.65,
        metalness: 0.1,
      })
    );
    const plazaMesh = new THREE.Mesh(plazaGeo, plazaMat);
    plazaMesh.position.set(0, 0.04, 0);
    plazaMesh.receiveShadow = true;
    this.group.add(plazaMesh);

    // 3. Cross Walking Paths (Paved Stone)
    const pathMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xdeb887, // Burlywood / light sandstone
        roughness: 0.8,
        metalness: 0.05,
      })
    );

    // North-South Path
    const nsPathGeo = this.track(new THREE.BoxGeometry(4.5, 0.06, 120));
    const nsPath = new THREE.Mesh(nsPathGeo, pathMat);
    nsPath.position.set(0, 0.03, 0);
    nsPath.receiveShadow = true;
    this.group.add(nsPath);

    // East-West Path
    const ewPathGeo = this.track(new THREE.BoxGeometry(120, 0.06, 4.5));
    const ewPath = new THREE.Mesh(ewPathGeo, pathMat);
    ewPath.position.set(0, 0.03, 0);
    ewPath.receiveShadow = true;
    this.group.add(ewPath);

    // Outer Circular Jogging Ring
    const ringGeo = this.track(new THREE.RingGeometry(38, 43, 48));
    ringGeo.rotateX(-Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, pathMat);
    ringMesh.position.set(0, 0.035, 0);
    ringMesh.receiveShadow = true;
    this.group.add(ringMesh);
  }

  private buildTrees() {
    const trunkMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x5c4033,
        roughness: 0.9,
      })
    );
    const foliageMatA = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x2e8b57, // Sea green
        roughness: 0.7,
        flatShading: true,
      })
    );
    const foliageMatB = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x228b22, // Forest green
        roughness: 0.65,
        flatShading: true,
      })
    );

    const treePositions = [
      // Quadrant 1 (North-East)
      [16, 16], [28, 12], [22, 26], [34, 30], [12, 34],
      // Quadrant 2 (North-West)
      [-16, 18], [-26, 14], [-20, 28], [-32, 26], [-14, 36],
      // Quadrant 3 (South-East)
      [18, -16], [26, -22], [14, -30], [30, -32], [36, -14],
      // Quadrant 4 (South-West)
      [-18, -18], [-28, -20], [-16, -32], [-32, -30], [-34, -14],
      // Outer perimeter groves
      [48, 0], [-48, 0], [0, 48], [0, -48],
      [45, 45], [-45, 45], [45, -45], [-45, -45],
    ];

    for (let i = 0; i < treePositions.length; i++) {
      const [x, z] = treePositions[i];
      const scale = 0.85 + (i % 5) * 0.12;
      const isPine = i % 2 === 0;

      // Tree Trunk
      const trunkHeight = 2.4 * scale;
      const trunkGeo = this.track(new THREE.CylinderGeometry(0.28 * scale, 0.4 * scale, trunkHeight, 8));
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.set(x, trunkHeight / 2, z);
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      this.group.add(trunk);

      // Solid Trunk Collision
      this.addCollision(x, 0, z, 0.8 * scale, 3.0, 0.8 * scale);

      if (isPine) {
        // Pine Tree Cones in 3 tiers
        const tier1 = new THREE.Mesh(
          this.track(new THREE.ConeGeometry(2.2 * scale, 2.5 * scale, 7)),
          foliageMatA
        );
        tier1.position.set(x, trunkHeight + 0.8 * scale, z);
        tier1.castShadow = true;
        this.group.add(tier1);

        const tier2 = new THREE.Mesh(
          this.track(new THREE.ConeGeometry(1.6 * scale, 2.2 * scale, 7)),
          foliageMatA
        );
        tier2.position.set(x, trunkHeight + 2.0 * scale, z);
        tier2.castShadow = true;
        this.group.add(tier2);

        const tier3 = new THREE.Mesh(
          this.track(new THREE.ConeGeometry(1.0 * scale, 1.8 * scale, 7)),
          foliageMatA
        );
        tier3.position.set(x, trunkHeight + 3.0 * scale, z);
        tier3.castShadow = true;
        this.group.add(tier3);
      } else {
        // Round Oak Foliage Canopy
        const canopy = new THREE.Mesh(
          this.track(new THREE.DodecahedronGeometry(2.4 * scale, 1)),
          foliageMatB
        );
        canopy.position.set(x, trunkHeight + 1.8 * scale, z);
        canopy.castShadow = true;
        this.group.add(canopy);
      }
    }
  }

  private buildBenches() {
    const woodMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x8b5a2b,
        roughness: 0.7,
      })
    );
    const metalMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x262626,
        metalness: 0.85,
        roughness: 0.3,
      })
    );

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

      // Seat Planks
      const seat = new THREE.Mesh(this.track(new THREE.BoxGeometry(2.2, 0.1, 0.6)), woodMat);
      seat.position.set(0, 0.45, 0);
      seat.castShadow = true;
      seat.receiveShadow = true;
      benchGroup.add(seat);

      // Backrest
      const back = new THREE.Mesh(this.track(new THREE.BoxGeometry(2.2, 0.45, 0.08)), woodMat);
      back.position.set(0, 0.82, -0.26);
      back.castShadow = true;
      benchGroup.add(back);

      // Metal Legs
      const legL = new THREE.Mesh(this.track(new THREE.BoxGeometry(0.1, 0.45, 0.6)), metalMat);
      legL.position.set(-0.9, 0.225, 0);
      legL.castShadow = true;
      benchGroup.add(legL);

      const legR = new THREE.Mesh(this.track(new THREE.BoxGeometry(0.1, 0.45, 0.6)), metalMat);
      legR.position.set(0.9, 0.225, 0);
      legR.castShadow = true;
      benchGroup.add(legR);

      this.group.add(benchGroup);
      this.addCollision(b.x, 0, b.z, 2.3, 0.9, 0.8);
    }
  }

  private buildStreetLamps() {
    const postMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1f2937,
        metalness: 0.85,
        roughness: 0.35,
      })
    );
    const glowMat = this.trackMat(
      new THREE.MeshBasicMaterial({
        color: 0xfff3b0,
      })
    );

    const lampPositions = [
      [8, 8], [-8, 8], [8, -8], [-8, -8],
      [0, 30], [0, -30], [30, 0], [-30, 0],
    ];

    for (const [x, z] of lampPositions) {
      const lamp = new THREE.Group();
      lamp.position.set(x, 0, z);

      // Post Pole
      const pole = new THREE.Mesh(this.track(new THREE.CylinderGeometry(0.1, 0.14, 4.0, 8)), postMat);
      pole.position.set(0, 2.0, 0);
      pole.castShadow = true;
      lamp.add(pole);

      // Lamp Head
      const head = new THREE.Mesh(this.track(new THREE.CylinderGeometry(0.35, 0.18, 0.5, 6)), postMat);
      head.position.set(0, 4.2, 0);
      lamp.add(head);

      // Glowing Bulb Glass
      const bulb = new THREE.Mesh(this.track(new THREE.SphereGeometry(0.24, 8, 8)), glowMat);
      bulb.position.set(0, 3.95, 0);
      lamp.add(bulb);

      this.group.add(lamp);
      this.addCollision(x, 0, z, 0.4, 4.5, 0.4);
    }
  }

  private buildCentralFountain() {
    const stoneMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x9ca3af,
        roughness: 0.6,
        metalness: 0.15,
      })
    );
    const waterMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.85,
      })
    );

    // Outer Stone Basin Ring
    const basin = new THREE.Mesh(
      this.track(new THREE.CylinderGeometry(4.2, 4.5, 0.9, 24)),
      stoneMat
    );
    basin.position.set(0, 0.45, 0);
    basin.castShadow = true;
    basin.receiveShadow = true;
    this.group.add(basin);

    // Water Surface
    const water = new THREE.Mesh(
      this.track(new THREE.CylinderGeometry(3.9, 3.9, 0.1, 24)),
      waterMat
    );
    water.position.set(0, 0.82, 0);
    this.group.add(water);

    // Center Pedestal & Spout
    const pedestal = new THREE.Mesh(
      this.track(new THREE.CylinderGeometry(0.9, 1.2, 2.0, 16)),
      stoneMat
    );
    pedestal.position.set(0, 1.0, 0);
    pedestal.castShadow = true;
    this.group.add(pedestal);

    const topBowl = new THREE.Mesh(
      this.track(new THREE.CylinderGeometry(1.8, 0.8, 0.5, 16)),
      stoneMat
    );
    topBowl.position.set(0, 2.1, 0);
    topBowl.castShadow = true;
    this.group.add(topBowl);

    this.addCollision(0, 0, 0, 8.8, 2.5, 8.8);
  }

  private buildObstacleCourse() {
    const boxMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b, // Amber
        roughness: 0.5,
      })
    );
    const woodMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xa16207,
        roughness: 0.75,
      })
    );

    // Fun Parkour Playground Platforms in North-East Area
    const platforms = [
      { x: 18, y: 0.35, z: 18, w: 2.2, h: 0.7, d: 2.2 },
      { x: 22, y: 0.7, z: 18, w: 2.2, h: 1.4, d: 2.2 },
      { x: 26, y: 1.1, z: 18, w: 2.2, h: 2.2, d: 2.2 },
      { x: 26, y: 1.1, z: 22, w: 2.2, h: 2.2, d: 2.2 },
      { x: 22, y: 1.5, z: 22, w: 2.2, h: 3.0, d: 2.2 },
      { x: 18, y: 1.8, z: 22, w: 2.2, h: 3.6, d: 2.2 },
    ];

    for (const p of platforms) {
      const mesh = new THREE.Mesh(
        this.track(new THREE.BoxGeometry(p.w, p.h, p.d)),
        boxMat
      );
      mesh.position.set(p.x, p.y, p.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.group.add(mesh);

      this.addCollision(p.x, 0, p.z, p.w, p.h, p.d);
    }

    // Wooden Bridge / Elevated Walkway in South-West Area
    const bridgeY = 1.2;
    const bridgeMesh = new THREE.Mesh(
      this.track(new THREE.BoxGeometry(3.0, 0.25, 14.0)),
      woodMat
    );
    bridgeMesh.position.set(-24, bridgeY, -24);
    bridgeMesh.castShadow = true;
    bridgeMesh.receiveShadow = true;
    this.group.add(bridgeMesh);
    this.addCollision(-24, 0, -24, 3.0, bridgeY + 0.25, 14.0);

    // Bridge Support Pillars
    const pillarMat = this.trackMat(new THREE.MeshStandardMaterial({ color: 0x5c4033 }));
    for (const pz of [-30, -24, -18]) {
      const pL = new THREE.Mesh(this.track(new THREE.BoxGeometry(0.3, bridgeY, 0.3)), pillarMat);
      pL.position.set(-25.3, bridgeY / 2, pz);
      pL.castShadow = true;
      this.group.add(pL);

      const pR = new THREE.Mesh(this.track(new THREE.BoxGeometry(0.3, bridgeY, 0.3)), pillarMat);
      pR.position.set(-22.7, bridgeY / 2, pz);
      pR.castShadow = true;
      this.group.add(pR);
    }
  }

  private buildBoundaryFence() {
    const fenceMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.6,
      })
    );

    const parkRadius = 70;
    // Boundary collision walls around perimeter
    this.addCollision(0, 0, parkRadius, 160, 4.0, 2.0);
    this.addCollision(0, 0, -parkRadius, 160, 4.0, 2.0);
    this.addCollision(parkRadius, 0, 0, 2.0, 4.0, 160);
    this.addCollision(-parkRadius, 0, 0, 2.0, 4.0, 160);

    // Decorative White Fence Posts around border
    const postCount = 36;
    for (let i = 0; i < postCount; i++) {
      const angle = (i / postCount) * Math.PI * 2;
      const x = Math.cos(angle) * parkRadius;
      const z = Math.sin(angle) * parkRadius;

      const post = new THREE.Mesh(
        this.track(new THREE.BoxGeometry(0.35, 1.2, 0.35)),
        fenceMat
      );
      post.position.set(x, 0.6, z);
      post.castShadow = true;
      this.group.add(post);
    }
  }

  public dispose() {
    for (const g of this.geometries) g.dispose();
    for (const m of this.materials) m.dispose();
    this.geometries = [];
    this.materials = [];
  }
}
