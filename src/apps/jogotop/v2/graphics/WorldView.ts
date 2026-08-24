import * as THREE from 'three';
import { GraphicsProfileConfig, WorldDefinitionData } from '../types';
import { GeometryCatalog } from './GeometryCatalog';
import { GeometryValidator } from './GeometryValidator';
import { MaterialPalette } from './MaterialPalette';
import { ResourceRegistry } from './ResourceRegistry';

export class WorldView {
  public readonly group = new THREE.Group();
  private updaters: ((t: number, dt: number) => void)[] = [];
  private animatedMeshes: {
    jet?: THREE.Mesh;
    lilyPads: { mesh: THREE.Group; phase: number }[];
    butterflies: { group: THREE.Group; wingL: THREE.Mesh; wingR: THREE.Mesh; ax: number; az: number; s: number; px: number; pz: number }[];
  } = {
    lilyPads: [],
    butterflies: [],
  };

  constructor(
    private world: WorldDefinitionData,
    private palette: MaterialPalette,
    private catalog: GeometryCatalog,
    private registry: ResourceRegistry,
    private profile: GraphicsProfileConfig
  ) {
    this.buildGround();
    this.buildPathways();
    this.buildPlazaAndFountain();
    this.buildPond();
    this.buildBridge();
    this.buildFence();
    this.buildLamps();
    this.buildProps();
    this.buildButterflies();
  }

  // 1. GROUND (Safe Inner Circle r=64 + Outer Ring r=64..140)
  private buildGround() {
    const innerGeo = this.registry.trackGeometry(new THREE.CircleGeometry(64, 48).rotateX(-Math.PI / 2));
    GeometryValidator.assertValid(innerGeo, 'GroundInner', 140);
    const innerMesh = new THREE.Mesh(innerGeo, this.palette.grassInner);
    innerMesh.matrixAutoUpdate = false;
    innerMesh.updateMatrix();
    this.group.add(innerMesh);

    const outerGeo = this.registry.trackGeometry(new THREE.RingGeometry(64, 140, 48).rotateX(-Math.PI / 2));
    GeometryValidator.assertValid(outerGeo, 'GroundOuter', 140);
    const outerMesh = new THREE.Mesh(outerGeo, this.palette.grassOuter);
    outerMesh.position.y = -0.06;
    outerMesh.matrixAutoUpdate = false;
    outerMesh.updateMatrix();
    this.group.add(outerMesh);
  }

  // 2. CONTINUOUS PATHWAY RIBBON
  private buildPathways() {
    const N = 64;
    const pathWidth = 2.1;
    const pts = this.world.pathPoints.slice(0, N);
    const positions: number[] = [];
    const indices: number[] = [];
    const colors: number[] = [];
    const sandColor = new THREE.Color(0xf3cd8a);

    for (let i = 0; i < N; i++) {
      const p = pts[i];
      const prev = pts[(i - 1 + N) % N];
      const next = pts[(i + 1) % N];
      const tx = next[0] - prev[0];
      const tz = next[1] - prev[1];
      const len = Math.hypot(tx, tz) || 1;
      const nx = -tz / len;
      const nz = tx / len;

      positions.push(p[0] - nx * pathWidth, 0.014, p[1] - nz * pathWidth);
      positions.push(p[0] + nx * pathWidth, 0.014, p[1] + nz * pathWidth);

      colors.push(sandColor.r, sandColor.g, sandColor.b);
      colors.push(sandColor.r, sandColor.g, sandColor.b);

      const i0 = i * 2;
      const i1 = i * 2 + 1;
      const i2 = ((i + 1) % N) * 2;
      const i3 = ((i + 1) % N) * 2 + 1;

      indices.push(i0, i1, i2);
      indices.push(i1, i3, i2);
    }

    // Branch 1: Center Plaza connector (6 segments)
    const b1Offset = positions.length / 3;
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      const pz = -4.5 * t;
      positions.push(-1.9, 0.014, pz);
      positions.push(1.9, 0.014, pz);
      colors.push(sandColor.r, sandColor.g, sandColor.b);
      colors.push(sandColor.r, sandColor.g, sandColor.b);

      if (i < 6) {
        const idx = b1Offset + i * 2;
        indices.push(idx, idx + 1, idx + 2, idx + 1, idx + 3, idx + 2);
      }
    }

    // Branch 2: Pond connector (8 segments)
    const b2Offset = positions.length / 3;
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const px = -15 - 8.5 * t;
      const pz = 3 - 18 * t;
      positions.push(px - 1.8 * 0.8, 0.014, pz - 1.8 * 0.6);
      positions.push(px + 1.8 * 0.8, 0.014, pz + 1.8 * 0.6);
      colors.push(sandColor.r, sandColor.g, sandColor.b);
      colors.push(sandColor.r, sandColor.g, sandColor.b);

      if (i < 8) {
        const idx = b2Offset + i * 2;
        indices.push(idx, idx + 1, idx + 2, idx + 1, idx + 3, idx + 2);
      }
    }

    const pathGeo = new THREE.BufferGeometry();
    pathGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    pathGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    pathGeo.setIndex(indices);
    pathGeo.computeVertexNormals();

    GeometryValidator.assertValid(pathGeo, 'PathwayRibbon', 140);
    this.registry.trackGeometry(pathGeo);

    const pathMesh = new THREE.Mesh(pathGeo, this.palette.vertexColorBasic);
    pathMesh.matrixAutoUpdate = false;
    pathMesh.updateMatrix();
    this.group.add(pathMesh);
  }

  // 3. CENTRAL PLAZA & FOUNTAIN
  private buildPlazaAndFountain() {
    const plaza = this.world.plaza;

    // Sand Disk Base
    const sandBase = new THREE.Mesh(
      this.catalog.applyVertexShading(new THREE.CylinderGeometry(6.6, 6.6, 0.04, 32), 0xf6dfab),
      this.palette.vertexColorBasic
    );
    sandBase.position.set(plaza.x, 0.02, plaza.z);
    this.group.add(sandBase);

    // Plaza Outer Ring
    const plazaRing = new THREE.Mesh(
      this.catalog.applyVertexShading(new THREE.TorusGeometry(6.6, 0.12, 6, 32).rotateX(Math.PI / 2), 0xdba256),
      this.palette.vertexColorBasic
    );
    plazaRing.position.set(plaza.x, 0.06, plaza.z);
    this.group.add(plazaRing);

    // Inner Ring
    const innerRing = new THREE.Mesh(
      this.catalog.applyVertexShading(new THREE.TorusGeometry(3.6, 0.08, 6, 24).rotateX(Math.PI / 2), 0xe5bd7d),
      this.palette.vertexColorBasic
    );
    innerRing.position.set(plaza.x, 0.05, plaza.z);
    this.group.add(innerRing);

    // Stone Basin Base
    const basinBase = new THREE.Mesh(
      this.catalog.applyVertexShading(new THREE.CylinderGeometry(2.5, 2.5, 0.12, 24), 0xd4cdc0),
      this.palette.vertexColorBasic
    );
    basinBase.position.set(plaza.x, 0.06, plaza.z);
    this.group.add(basinBase);

    // Basin Rim
    const basinRim = new THREE.Mesh(
      this.catalog.applyVertexShading(new THREE.TorusGeometry(2.35, 0.14, 6, 24).rotateX(Math.PI / 2), 0xe8e2d5),
      this.palette.vertexColorBasic
    );
    basinRim.position.set(plaza.x, 0.38, plaza.z);
    this.group.add(basinRim);

    // Central Column
    const centerCol = new THREE.Mesh(
      this.catalog.applyVertexShading(new THREE.CylinderGeometry(0.36, 0.36, 0.85, 14), 0xdcd6cb),
      this.palette.vertexColorBasic
    );
    centerCol.position.set(plaza.x, 0.55, plaza.z);
    this.group.add(centerCol);

    // Middle Tier Rim & Base
    const midRim = new THREE.Mesh(
      this.catalog.applyVertexShading(new THREE.TorusGeometry(0.95, 0.09, 6, 18).rotateX(Math.PI / 2), 0xe8e2d5),
      this.palette.vertexColorBasic
    );
    midRim.position.set(plaza.x, 1.05, plaza.z);
    this.group.add(midRim);

    const midBase = new THREE.Mesh(
      this.catalog.applyVertexShading(new THREE.CylinderGeometry(0.95, 0.95, 0.08, 18), 0xd4cdc0),
      this.palette.vertexColorBasic
    );
    midBase.position.set(plaza.x, 0.98, plaza.z);
    this.group.add(midBase);

    const topCol = new THREE.Mesh(
      this.catalog.applyVertexShading(new THREE.CylinderGeometry(0.22, 0.22, 0.45, 12), 0xdcd6cb),
      this.palette.vertexColorBasic
    );
    topCol.position.set(plaza.x, 1.3, plaza.z);
    this.group.add(topCol);

    // Water Layers
    const botWaterGeo = this.registry.trackGeometry(new THREE.CircleGeometry(2.26, 24).rotateX(-Math.PI / 2));
    GeometryValidator.assertValid(botWaterGeo, 'BottomWater', 140);
    const botWater = new THREE.Mesh(botWaterGeo, this.palette.waterFountain);
    botWater.position.set(plaza.x, 0.28, plaza.z);
    this.group.add(botWater);

    const midWaterGeo = this.registry.trackGeometry(new THREE.CircleGeometry(0.9, 16).rotateX(-Math.PI / 2));
    GeometryValidator.assertValid(midWaterGeo, 'MidWater', 140);
    const midWater = new THREE.Mesh(midWaterGeo, this.palette.waterFountain);
    midWater.position.set(plaza.x, 1.01, plaza.z);
    this.group.add(midWater);

    const jetGeo = this.registry.trackGeometry(new THREE.ConeGeometry(0.14, 0.75, 8));
    GeometryValidator.assertValid(jetGeo, 'FountainJet', 140);
    const jet = new THREE.Mesh(jetGeo, this.palette.fountainJet);
    jet.position.set(plaza.x, 1.7, plaza.z);
    this.group.add(jet);
    this.animatedMeshes.jet = jet;

    this.updaters.push((t) => {
      if (this.animatedMeshes.jet) {
        this.animatedMeshes.jet.scale.y = 1 + Math.sin(t * 5) * 0.15;
        this.animatedMeshes.jet.position.y = 1.7 + Math.sin(t * 5) * 0.02;
      }
    });
  }

  // 4. EXCAVATED POND & LILY PADS
  private buildPond() {
    const pond = this.world.pond;

    // Shore Ring
    const shoreRing = new THREE.Mesh(
      this.catalog.applyVertexShading(new THREE.RingGeometry(8.6, 10.4, 32).rotateX(-Math.PI / 2), 0xe2c68e),
      this.palette.vertexColorBasic
    );
    shoreRing.position.set(pond.x, 0.02, pond.z);
    this.group.add(shoreRing);

    // Pond Basin
    const pondBasin = new THREE.Mesh(
      this.catalog.applyVertexShading(new THREE.CylinderGeometry(8.8, 8.8, 0.1, 32), 0x2e6b72),
      this.palette.vertexColorBasic
    );
    pondBasin.position.set(pond.x, -0.35, pond.z);
    this.group.add(pondBasin);

    // Pond Water Surface
    const pondWaterGeo = this.registry.trackGeometry(new THREE.CircleGeometry(8.62, 36).rotateX(-Math.PI / 2));
    GeometryValidator.assertValid(pondWaterGeo, 'PondWater', 140);
    const pondMesh = new THREE.Mesh(pondWaterGeo, this.palette.waterPond);
    pondMesh.position.set(pond.x, 0.04, pond.z);
    this.group.add(pondMesh);

    // Foam Ring
    const foamRing = new THREE.Mesh(
      this.catalog.applyVertexShading(new THREE.TorusGeometry(8.6, 0.07, 4, 36).rotateX(Math.PI / 2), 0xffffff),
      this.palette.vertexColorBasic
    );
    foamRing.position.set(pond.x, 0.048, pond.z);
    this.group.add(foamRing);

    // Shore Rocks
    for (const r of this.world.shoreRocks) {
      const rockMesh = new THREE.Mesh(
        this.catalog.applyVertexShading(this.catalog.unitDodecahedron, r.color),
        this.palette.vertexColorBasic
      );
      rockMesh.position.set(r.x, 0.15 * r.scale, r.z);
      rockMesh.scale.set(r.scale * 0.8, r.scale * 0.6, r.scale * 0.8);
      rockMesh.rotation.set(r.rx, r.ry, 0);
      this.group.add(rockMesh);
    }

    // Lily Pads
    for (const lp of this.world.lilyPads) {
      const padGroup = new THREE.Group();
      padGroup.position.set(lp.x, 0.048, lp.z);

      const padGeo = this.registry.trackGeometry(
        new THREE.CylinderGeometry(lp.scale, lp.scale, 0.015, 12, 1, false, 0, Math.PI * 1.8)
      );
      GeometryValidator.assertValid(padGeo, 'LilyPad', 140);
      const padMesh = new THREE.Mesh(
        this.catalog.applyVertexShading(padGeo, 0x2e9b48),
        this.palette.vertexColorBasic
      );
      padGroup.add(padMesh);

      if (lp.hasFlower && lp.flowerColor) {
        const petalGeo = this.registry.trackGeometry(new THREE.ConeGeometry(0.05, 0.12, 4));
        const petalMat = this.palette.getSolidBasic(lp.flowerColor, this.registry);
        for (let p = 0; p < 5; p++) {
          const pa = (p / 5) * Math.PI * 2;
          const petal = new THREE.Mesh(petalGeo, petalMat);
          petal.position.set(Math.cos(pa) * 0.06, 0.05, Math.sin(pa) * 0.06);
          petal.rotation.z = Math.PI / 4;
          petal.rotation.y = pa;
          padGroup.add(petal);
        }
        const coreGeo = this.registry.trackGeometry(new THREE.SphereGeometry(0.04, 6, 4));
        const core = new THREE.Mesh(coreGeo, this.palette.gold);
        core.position.y = 0.04;
        padGroup.add(core);
      }

      this.group.add(padGroup);
      this.animatedMeshes.lilyPads.push({ mesh: padGroup, phase: lp.phase });
    }

    this.updaters.push((t) => {
      for (const lp of this.animatedMeshes.lilyPads) {
        lp.mesh.position.y = 0.048 + Math.sin(t * 1.5 + lp.phase) * 0.003;
      }
    });

    // Reeds
    for (const rd of this.world.reeds) {
      const stemMesh = new THREE.Mesh(
        this.catalog.applyVertexShading(this.catalog.unitCylinder, 0x388e3c),
        this.palette.vertexColorBasic
      );
      stemMesh.position.set(rd.x, rd.height / 2, rd.z);
      stemMesh.scale.set(0.024, rd.height, 0.024);
      stemMesh.rotation.z = rd.rz;
      this.group.add(stemMesh);

      if (rd.hasHead) {
        const headMesh = new THREE.Mesh(
          this.catalog.applyVertexShading(this.catalog.unitCylinder, 0x6d4c41),
          this.palette.vertexColorBasic
        );
        headMesh.position.set(rd.x, rd.height + 0.1, rd.z);
        headMesh.scale.set(0.05, 0.24, 0.05);
        this.group.add(headMesh);
      }
    }
  }

  // 5. WOODEN BRIDGE
  private buildBridge() {
    const bridge = this.world.bridge;
    for (let i = 0; i < 10; i++) {
      const t = i / 9;
      const archH = 0.25 + Math.sin(t * Math.PI) * 0.35;
      const bx = bridge.x + (t - 0.5) * 4.8 * Math.cos(bridge.yaw);
      const bz = bridge.z + (t - 0.5) * 4.8 * Math.sin(bridge.yaw);

      const plank = new THREE.Mesh(
        this.catalog.applyVertexShading(this.catalog.unitBox, 0x945f30),
        this.palette.vertexColorBasic
      );
      plank.position.set(bx, archH, bz);
      plank.scale.set(1.4, 0.06, 0.4);
      plank.rotation.y = bridge.yaw;
      this.group.add(plank);

      if (i === 0 || i === 4 || i === 9) {
        for (const side of [-0.65, 0.65]) {
          const px = bx + side * Math.sin(bridge.yaw);
          const pz = bz - side * Math.cos(bridge.yaw);
          const post = new THREE.Mesh(
            this.catalog.applyVertexShading(this.catalog.unitBox, 0x73431d),
            this.palette.vertexColorBasic
          );
          post.position.set(px, archH + 0.4, pz);
          post.scale.set(0.08, 0.8, 0.08);
          this.group.add(post);
        }
      }
    }
  }

  // 6. PERIMETER FENCE
  private buildFence() {
    const fence = this.world.fence;
    for (let i = 0; i < fence.postCount; i++) {
      const a = (i / fence.postCount) * Math.PI * 2;
      const fx = Math.cos(a) * fence.radius;
      const fz = Math.sin(a) * fence.radius;

      const post = new THREE.Mesh(
        this.catalog.applyVertexShading(this.catalog.unitBox, 0x945f30),
        this.palette.vertexColorBasic
      );
      post.position.set(fx, 0.55, fz);
      post.scale.set(0.22, 1.15, 0.22);
      this.group.add(post);
    }

    for (const ry of [0.48, 0.94]) {
      const railGeo = this.registry.trackGeometry(
        new THREE.TorusGeometry(fence.radius, 0.055, 4, 64).rotateX(Math.PI / 2)
      );
      GeometryValidator.assertValid(railGeo, 'FenceRail', 140);
      const rail = new THREE.Mesh(
        this.catalog.applyVertexShading(railGeo, 0xa5764a),
        this.palette.vertexColorBasic
      );
      rail.position.y = ry;
      this.group.add(rail);
    }
  }

  // 7. STREET LAMPS
  private buildLamps() {
    for (const l of this.world.lamps) {
      const base1 = new THREE.Mesh(
        this.catalog.applyVertexShading(this.catalog.unitCylinder, 0x242e36),
        this.palette.vertexColorBasic
      );
      base1.position.set(l.x, 0.08, l.z);
      base1.scale.set(0.3, 0.16, 0.3);
      this.group.add(base1);

      const base2 = new THREE.Mesh(
        this.catalog.applyVertexShading(this.catalog.unitCylinder, 0x242e36),
        this.palette.vertexColorBasic
      );
      base2.position.set(l.x, 0.22, l.z);
      base2.scale.set(0.22, 0.14, 0.22);
      this.group.add(base2);

      const pole = new THREE.Mesh(
        this.catalog.applyVertexShading(this.catalog.unitCylinder, 0x1f272e),
        this.palette.vertexColorBasic
      );
      pole.position.set(l.x, 1.6, l.z);
      pole.scale.set(0.065, 2.7, 0.065);
      this.group.add(pole);

      const cap = new THREE.Mesh(
        this.catalog.applyVertexShading(this.catalog.unitCone, 0x182026),
        this.palette.vertexColorBasic
      );
      cap.position.set(l.x, 3.25, l.z);
      cap.scale.set(0.38, 0.28, 0.38);
      this.group.add(cap);

      const bulb = new THREE.Mesh(this.catalog.unitSphere, this.palette.lampBulb);
      bulb.position.set(l.x, 2.96, l.z);
      bulb.scale.setScalar(0.2);
      this.group.add(bulb);
    }
  }

  // 8. PROPS (Trees, Bushes, Rocks, Benches, Flowers, Grass Tufts)
  private buildProps() {
    // 8.1 Trees
    for (const t of this.world.trees) {
      const s = t.scale;
      const ry = t.yaw;

      const trunkLow = new THREE.Mesh(
        this.catalog.applyVertexShading(this.catalog.unitCone, t.trunkColor),
        this.palette.vertexColorBasic
      );
      trunkLow.position.set(t.x, 0.4 * s, t.z);
      trunkLow.scale.set(0.5 * s, 0.8 * s, 0.5 * s);
      trunkLow.rotation.y = ry;
      this.group.add(trunkLow);

      const trunkMid = new THREE.Mesh(
        this.catalog.applyVertexShading(this.catalog.unitCylinder8, t.trunkColor),
        this.palette.vertexColorBasic
      );
      trunkMid.position.set(t.x, 1.4 * s, t.z);
      trunkMid.scale.set(0.26 * s, 1.8 * s, 0.26 * s);
      trunkMid.rotation.y = ry;
      this.group.add(trunkMid);

      const crownY = 3.0 * s;
      const mainCrown = new THREE.Mesh(
        this.catalog.applyVertexShading(this.catalog.unitIcosahedron, t.mainLeafColor),
        this.palette.vertexColorBasic
      );
      mainCrown.position.set(t.x, crownY, t.z);
      mainCrown.scale.set(1.6 * s, 1.4 * s, 1.6 * s);
      mainCrown.rotation.y = ry;
      this.group.add(mainCrown);

      const topCrown = new THREE.Mesh(
        this.catalog.applyVertexShading(this.catalog.unitIcosahedron, t.secLeafColor),
        this.palette.vertexColorBasic
      );
      topCrown.position.set(t.x, crownY + 0.65 * s, t.z);
      topCrown.scale.set(1.15 * s, 0.95 * s, 1.15 * s);
      topCrown.rotation.y = ry + 1.0;
      this.group.add(topCrown);

      for (const [pa, pDist, pSize] of [
        [ry + 0.8, 0.85 * s, 0.9 * s],
        [ry + 3.2, 0.85 * s, 0.85 * s],
      ] as const) {
        const puff = new THREE.Mesh(
          this.catalog.applyVertexShading(this.catalog.unitIcosahedron, t.mainLeafColor),
          this.palette.vertexColorBasic
        );
        puff.position.set(t.x + Math.cos(pa) * pDist, crownY - 0.15 * s, t.z + Math.sin(pa) * pDist);
        puff.scale.set(pSize, pSize * 0.85, pSize);
        puff.rotation.y = pa;
        this.group.add(puff);
      }

      if (t.hasFruit && t.fruitColor) {
        const fruitMat = this.palette.getSolidBasic(t.fruitColor, this.registry);
        for (let i = 0; i < 3; i++) {
          const fa = ry + (i / 3) * Math.PI * 2 + 0.3;
          const fx = t.x + Math.cos(fa) * 1.35 * s;
          const fy = crownY - 0.25 * s;
          const fz = t.z + Math.sin(fa) * 1.35 * s;
          const fSize = 0.12 * s;

          const fruit = new THREE.Mesh(this.catalog.unitSphere, fruitMat);
          fruit.position.set(fx, fy, fz);
          fruit.scale.setScalar(fSize);
          this.group.add(fruit);
        }
      }
    }

    // 8.2 Bushes
    for (const b of this.world.bushes) {
      const s = b.scale;
      const bushMesh1 = new THREE.Mesh(
        this.catalog.applyVertexShading(this.catalog.unitIcosahedron, b.color),
        this.palette.vertexColorBasic
      );
      bushMesh1.position.set(b.x, 0.45 * s, b.z);
      bushMesh1.scale.set(1.2 * s, 0.8 * s, 1.2 * s);
      bushMesh1.rotation.y = b.yaw;
      this.group.add(bushMesh1);

      const bushMesh2 = new THREE.Mesh(
        this.catalog.applyVertexShading(this.catalog.unitIcosahedron, b.color),
        this.palette.vertexColorBasic
      );
      bushMesh2.position.set(b.x + 0.45 * s, 0.35 * s, b.z + 0.2 * s);
      bushMesh2.scale.set(0.75 * s, 0.6 * s, 0.75 * s);
      bushMesh2.rotation.y = b.yaw;
      this.group.add(bushMesh2);
    }

    // 8.3 Rocks
    for (const r of this.world.rocks) {
      const s = r.scale;
      const rock1 = new THREE.Mesh(
        this.catalog.applyVertexShading(this.catalog.unitDodecahedron, r.color),
        this.palette.vertexColorBasic
      );
      rock1.position.set(r.x, 0.3 * s, r.z);
      rock1.scale.set(s, s * 0.75, s * 0.9);
      rock1.rotation.set(r.rx, r.ry, r.rz);
      this.group.add(rock1);

      const rock2 = new THREE.Mesh(
        this.catalog.applyVertexShading(this.catalog.unitDodecahedron, r.color),
        this.palette.vertexColorBasic
      );
      rock2.position.set(r.x + s * 0.75, 0.2 * s, r.z + s * 0.25);
      rock2.scale.set(s * 0.5, s * 0.4, s * 0.5);
      rock2.rotation.set(r.rx, r.ry, 0);
      this.group.add(rock2);
    }

    // 8.4 Park Benches
    for (const b of this.world.benches) {
      const benchGroup = new THREE.Group();
      benchGroup.position.set(b.x, 0, b.z);
      benchGroup.rotation.y = b.yaw;

      const woodMat = this.palette.getSolidBasic(0x9e5f2e, this.registry);
      const ironMat = this.palette.getSolidBasic(0x222a30, this.registry);

      for (const lz of [-0.16, 0.0, 0.16]) {
        const plank = new THREE.Mesh(this.catalog.unitBox, woodMat);
        plank.position.set(0, 0.48, lz);
        plank.scale.set(1.8, 0.045, 0.13);
        benchGroup.add(plank);
      }

      for (const [ly, lz] of [
        [0.76, -0.22],
        [0.92, -0.26],
      ] as const) {
        const backPlank = new THREE.Mesh(this.catalog.unitBox, woodMat);
        backPlank.position.set(0, ly, lz);
        backPlank.scale.set(1.8, 0.12, 0.045);
        backPlank.rotation.x = -0.2;
        benchGroup.add(backPlank);
      }

      for (const side of [-1, 1]) {
        const leg = new THREE.Mesh(this.catalog.unitBox, ironMat);
        leg.position.set(0.75 * side, 0.24, 0);
        leg.scale.set(0.06, 0.48, 0.36);
        benchGroup.add(leg);
      }

      this.group.add(benchGroup);
    }

    // 8.5 Spatial Chunks for Flowers and Grass Tufts (Decision D8: max 128 instances per chunk)
    this.buildChunkedInstancing();
  }

  private buildChunkedInstancing() {
    const CHUNK_SIZE = 16;
    const MAX_PER_CHUNK = 128;

    // Filter by profile count limit
    const flowerList = this.world.flowers.slice(0, this.profile.flowerCount);
    const tuftList = this.world.tufts.slice(0, this.profile.tuftCount);

    const m4 = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const rot = new THREE.Euler();
    const quat = new THREE.Quaternion();
    const sca = new THREE.Vector3();
    const col = new THREE.Color();

    // Group flowers by chunk (cx, cz)
    const flowerChunks = new Map<string, typeof flowerList>();
    for (const f of flowerList) {
      const cx = Math.floor(f.x / CHUNK_SIZE);
      const cz = Math.floor(f.z / CHUNK_SIZE);
      const key = `${cx},${cz}`;
      let arr = flowerChunks.get(key);
      if (!arr) {
        arr = [];
        flowerChunks.set(key, arr);
      }
      arr.push(f);
    }

    const headGeo = this.registry.trackGeometry(new THREE.IcosahedronGeometry(0.11, 0));
    const stemGeo = this.registry.trackGeometry(new THREE.CylinderGeometry(0.016, 0.022, 0.32, 5));
    const stemMat = this.palette.getSolidBasic(0x388e3c, this.registry);
    const headMat = this.palette.getSolidBasic(0xffffff, this.registry);

    for (const items of flowerChunks.values()) {
      const count = Math.min(items.length, MAX_PER_CHUNK);
      if (count === 0) continue;

      const heads = new THREE.InstancedMesh(headGeo, headMat, count);
      const stems = new THREE.InstancedMesh(stemGeo, stemMat, count);

      for (let i = 0; i < count; i++) {
        const f = items[i];
        rot.set(f.rx, f.ry, f.rz);
        quat.setFromEuler(rot);

        // Stem
        pos.set(f.x, f.height / 2, f.z);
        sca.set(1, 1, 1);
        m4.compose(pos, quat, sca);
        stems.setMatrixAt(i, m4);

        // Head
        pos.set(f.x, f.height + 0.05, f.z);
        sca.set(f.scale, f.scale, f.scale);
        m4.compose(pos, quat, sca);
        heads.setMatrixAt(i, m4);
        col.set(f.color);
        heads.setColorAt(i, col);
      }

      heads.count = count;
      stems.count = count;
      heads.instanceMatrix.needsUpdate = true;
      stems.instanceMatrix.needsUpdate = true;
      if (heads.instanceColor) heads.instanceColor.needsUpdate = true;

      GeometryValidator.assertValid(headGeo, 'FlowerHeadGeo', 140);
      GeometryValidator.assertValid(stemGeo, 'FlowerStemGeo', 140);

      this.registry.trackMesh(heads);
      this.registry.trackMesh(stems);
      this.group.add(stems, heads);
    }

    // Group tufts by chunk (cx, cz)
    const tuftChunks = new Map<string, typeof tuftList>();
    for (const t of tuftList) {
      const cx = Math.floor(t.x / CHUNK_SIZE);
      const cz = Math.floor(t.z / CHUNK_SIZE);
      const key = `${cx},${cz}`;
      let arr = tuftChunks.get(key);
      if (!arr) {
        arr = [];
        tuftChunks.set(key, arr);
      }
      arr.push(t);
    }

    const tuftGeo = this.registry.trackGeometry(new THREE.ConeGeometry(0.065, 0.45, 4));
    const tuftMat = this.palette.getSolidBasic(0xffffff, this.registry);

    for (const items of tuftChunks.values()) {
      const count = Math.min(items.length, MAX_PER_CHUNK);
      if (count === 0) continue;

      const tufts = new THREE.InstancedMesh(tuftGeo, tuftMat, count);
      for (let i = 0; i < count; i++) {
        const t = items[i];
        rot.set(t.rx, t.ry, t.rz);
        quat.setFromEuler(rot);
        pos.set(t.x, 0.18 * t.scale, t.z);
        sca.set(t.scale, t.scale, t.scale);
        m4.compose(pos, quat, sca);
        tufts.setMatrixAt(i, m4);
        col.set(t.color);
        tufts.setColorAt(i, col);
      }

      tufts.count = count;
      tufts.instanceMatrix.needsUpdate = true;
      if (tufts.instanceColor) tufts.instanceColor.needsUpdate = true;

      GeometryValidator.assertValid(tuftGeo, 'TuftGeo', 140);
      this.registry.trackMesh(tufts);
      this.group.add(tufts);
    }
  }

  // 9. ANIMATED BUTTERFLIES
  private buildButterflies() {
    const butterflyList = this.world.butterflies.slice(0, this.profile.butterflyCount);
    if (butterflyList.length === 0) return;

    const wingGeoL = this.registry.trackGeometry(
      new THREE.PlaneGeometry(0.24, 0.18).rotateX(-Math.PI / 2).translate(-0.12, 0, 0)
    );
    const wingGeoR = this.registry.trackGeometry(
      new THREE.PlaneGeometry(0.24, 0.18).rotateX(-Math.PI / 2).translate(0.12, 0, 0)
    );
    const bodyMat = this.palette.getSolidBasic(0x212121, this.registry);

    for (let i = 0; i < butterflyList.length; i++) {
      const b = butterflyList[i];
      const g = new THREE.Group();
      const wingMat = this.palette.getSolidBasic(b.color, this.registry);
      wingMat.side = THREE.DoubleSide;

      const wl = new THREE.Mesh(wingGeoL, wingMat);
      const wr = new THREE.Mesh(wingGeoR, wingMat);
      const body = new THREE.Mesh(this.catalog.unitBox, bodyMat);
      body.scale.set(0.04, 0.04, 0.18);

      g.add(wl, wr, body);
      this.group.add(g);

      this.animatedMeshes.butterflies.push({
        group: g,
        wingL: wl,
        wingR: wr,
        ax: b.startX,
        az: b.startZ,
        s: b.speed,
        px: b.startX,
        pz: b.startZ,
      });
    }

    this.updaters.push((t) => {
      for (const b of this.animatedMeshes.butterflies) {
        const nx = b.ax + Math.sin(t * 0.38 + b.s) * 6;
        const nz = b.az + Math.cos(t * 0.32 + b.s * 1.2) * 6;
        const ny = 1.3 + Math.sin(t * 1.8 + b.s) * 0.45;
        b.group.position.set(nx, ny, nz);
        b.group.rotation.y = Math.atan2(nx - b.px, nz - b.pz);
        b.px = nx;
        b.pz = nz;
        const f = 0.18 + Math.abs(Math.sin(t * 15 + b.s)) * 1.15;
        b.wingL.rotation.z = -f;
        b.wingR.rotation.z = f;
      }
    });
  }

  public update(elapsed: number, dt: number) {
    for (const u of this.updaters) {
      u(elapsed, dt);
    }
  }

  public dispose() {
    this.group.removeFromParent();
    this.updaters.length = 0;
    this.animatedMeshes.lilyPads.length = 0;
    this.animatedMeshes.butterflies.length = 0;
  }
}
