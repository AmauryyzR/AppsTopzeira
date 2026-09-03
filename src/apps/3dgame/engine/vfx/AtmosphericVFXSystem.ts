import * as THREE from 'three';
import { createToonMaterial } from '../shaders/ToonMaterial';

/**
 * AAA-Grade Dynamic Cel-Shaded VFX System for Anime Park World (Loop 7)
 * Implements:
 * 1. Swirling Sakura Petal Storm (Instanced Mesh with aerodynamic flutter & wind drift)
 * 2. Fountain Water Splash & Cascade Foam Mist (Stylized cartoon water droplets)
 * 3. Enchanted Golden-Green Fireflies / Spirit Motes (Hotaru around lanterns & trees)
 * 4. Player Footstep Dust Poofs & Impact Landing Shockwaves
 */
export class AtmosphericVFXSystem {
  public readonly group = new THREE.Group();

  // 1. Sakura Petal Storm
  private sakuraCount = 450;
  private sakuraMesh!: THREE.InstancedMesh;
  private sakuraData: Array<{
    pos: THREE.Vector3;
    vel: THREE.Vector3;
    rot: THREE.Euler;
    rotSpeed: THREE.Vector3;
    swayPhase: number;
    swaySpeed: number;
    scale: number;
  }> = [];
  private dummyMatrix = new THREE.Matrix4();
  private dummyQuat = new THREE.Quaternion();

  // 2. Firefly Swarm (Hotaru)
  private fireflyCount = 90;
  private fireflyPoints!: THREE.Points;
  private fireflyGeo!: THREE.BufferGeometry;
  private fireflyPositions!: Float32Array;
  private fireflyPhases!: Float32Array;
  private fireflyBaseAnchors!: THREE.Vector3[];

  // 3. Fountain Splash & Mist System
  private splashParticleCount = 80;
  private splashMesh!: THREE.InstancedMesh;
  private splashData: Array<{
    pos: THREE.Vector3;
    vel: THREE.Vector3;
    life: number;
    maxLife: number;
    baseScale: number;
    active: boolean;
  }> = [];

  // 4. Footstep & Landing Dust Poof Pool
  private dustPoolSize = 32;
  private dustMesh!: THREE.InstancedMesh;
  private dustData: Array<{
    pos: THREE.Vector3;
    vel: THREE.Vector3;
    life: number;
    maxLife: number;
    maxScale: number;
    active: boolean;
  }> = [];
  private dustSpawnTimer = 0;
  private wasGroundedLastFrame = true;

  // Trackers for clean disposal
  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];

  constructor() {
    this.initSakuraPetals();
    this.initFireflies();
    this.initFountainSplashes();
    this.initDustPoofs();
  }

  // =========================================================================
  // 1. SAKURA PETAL STORM
  // =========================================================================
  private initSakuraPetals() {
    // Sculpted organic curved petal geometry with notched tip
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, -0.06);
    petalShape.bezierCurveTo(0.045, -0.02, 0.055, 0.05, 0.02, 0.09);
    petalShape.lineTo(0, 0.075); // Small tip notch
    petalShape.lineTo(-0.02, 0.09);
    petalShape.bezierCurveTo(-0.055, 0.05, -0.045, -0.02, 0, -0.06);

    const petalGeo = new THREE.ExtrudeGeometry(petalShape, {
      depth: 0.003,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: 0.002,
      bevelThickness: 0.002,
    });
    petalGeo.center();
    this.geometries.push(petalGeo);

    // Vibrant anime sakura pink toon material
    const petalMat = createToonMaterial({
      color: 0xffb7c5, // Cherry Blossom Pink
      gradientBands: 3,
      rimColor: 0xfff1f2,
      rimPower: 2.2,
      rimIntensity: 0.85,
      shadowColor: 0xf472b6,
      shadowIntensity: 0.45,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    });
    this.materials.push(petalMat);

    this.sakuraMesh = new THREE.InstancedMesh(petalGeo, petalMat, this.sakuraCount);
    this.sakuraMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.sakuraMesh.castShadow = false;
    this.sakuraMesh.receiveShadow = false;

    // Distribute petals in an atmospheric volume across the park
    for (let i = 0; i < this.sakuraCount; i++) {
      const radius = 2.0 + Math.random() * 45.0;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 0.5 + Math.random() * 14.0;

      this.sakuraData.push({
        pos: new THREE.Vector3(x, y, z),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          -(0.6 + Math.random() * 0.7),
          (Math.random() - 0.5) * 0.4
        ),
        rot: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 2.5,
          (Math.random() - 0.5) * 3.5,
          (Math.random() - 0.5) * 2.0
        ),
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 1.8 + Math.random() * 2.2,
        scale: 0.85 + Math.random() * 0.65,
      });
    }

    this.group.add(this.sakuraMesh);
  }

  // =========================================================================
  // 2. ENCHANTED FIREFLIES / SPIRIT MOTES (HOTARU)
  // =========================================================================
  private initFireflies() {
    this.fireflyPositions = new Float32Array(this.fireflyCount * 3);
    this.fireflyPhases = new Float32Array(this.fireflyCount);
    this.fireflyBaseAnchors = [];

    // Anchor fireflies around Japanese landmarks, pagoda gazebo, Torii gate, and trees
    const landmarkSpots: THREE.Vector3[] = [
      new THREE.Vector3(0, 3.2, 42),     // Torii Gate Crossbeam
      new THREE.Vector3(-3.2, 1.2, 42),  // Torii Left Base
      new THREE.Vector3(3.2, 1.2, 42),   // Torii Right Base
      new THREE.Vector3(34, 1.8, 0),     // Pagoda Gazebo Platform
      new THREE.Vector3(34, 4.5, 0),     // Pagoda Gazebo Eaves
      new THREE.Vector3(-34, 1.5, 0),    // Taiko Bashi Bridge Creek
      new THREE.Vector3(-34, 2.8, 0),    // Bridge Crest
      new THREE.Vector3(0, 1.6, 0),      // Central Fountain
    ];

    for (let i = 0; i < this.fireflyCount; i++) {
      let anchor: THREE.Vector3;
      if (i < landmarkSpots.length * 6) {
        const spot = landmarkSpots[i % landmarkSpots.length];
        anchor = new THREE.Vector3(
          spot.x + (Math.random() - 0.5) * 6.5,
          spot.y + (Math.random() - 0.5) * 2.5,
          spot.z + (Math.random() - 0.5) * 6.5
        );
      } else {
        // Ambient woodland distribution
        const r = 10 + Math.random() * 32;
        const a = Math.random() * Math.PI * 2;
        anchor = new THREE.Vector3(
          Math.cos(a) * r,
          1.0 + Math.random() * 3.5,
          Math.sin(a) * r
        );
      }
      this.fireflyBaseAnchors.push(anchor);

      this.fireflyPositions[i * 3 + 0] = anchor.x;
      this.fireflyPositions[i * 3 + 1] = anchor.y;
      this.fireflyPositions[i * 3 + 2] = anchor.z;

      this.fireflyPhases[i] = Math.random() * Math.PI * 2;
    }

    this.fireflyGeo = new THREE.BufferGeometry();
    this.fireflyGeo.setAttribute('position', new THREE.BufferAttribute(this.fireflyPositions, 3));
    this.geometries.push(this.fireflyGeo);

    // Glowing sprite canvas texture with soft circular falloff
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 230, 1.0)');
    grad.addColorStop(0.35, 'rgba(234, 250, 100, 0.85)');
    grad.addColorStop(0.70, 'rgba(110, 231, 183, 0.40)');
    grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();

    const fireflyTex = new THREE.CanvasTexture(canvas);
    const fireflyMat = new THREE.PointsMaterial({
      size: 0.55,
      map: fireflyTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xfef08a,
    });
    this.materials.push(fireflyMat);

    this.fireflyPoints = new THREE.Points(this.fireflyGeo, fireflyMat);
    this.group.add(this.fireflyPoints);
  }

  // =========================================================================
  // 3. FOUNTAIN SPLASHES & CASCADE MIST
  // =========================================================================
  private initFountainSplashes() {
    // Chunky stylized water drop sphere
    const dropGeo = new THREE.SphereGeometry(0.09, 8, 8);
    this.geometries.push(dropGeo);

    const dropMat = createToonMaterial({
      color: 0xbae6fd, // Soft aquatic cyan
      gradientBands: 3,
      rimColor: 0xffffff,
      rimPower: 1.8,
      rimIntensity: 0.9,
      transparent: true,
      opacity: 0.80,
    });
    this.materials.push(dropMat);

    this.splashMesh = new THREE.InstancedMesh(dropGeo, dropMat, this.splashParticleCount);
    this.splashMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    for (let i = 0; i < this.splashParticleCount; i++) {
      this.splashData.push({
        pos: new THREE.Vector3(0, -999, 0),
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4,
        baseScale: 0.7 + Math.random() * 0.6,
        active: false,
      });
      this.dummyMatrix.makeTranslation(0, -999, 0);
      this.splashMesh.setMatrixAt(i, this.dummyMatrix);
    }

    this.group.add(this.splashMesh);
  }

  // =========================================================================
  // 4. FOOTSTEP & LANDING DUST POOFS
  // =========================================================================
  private initDustPoofs() {
    const dustGeo = new THREE.SphereGeometry(0.12, 10, 8);
    dustGeo.scale(1.2, 0.75, 1.2);
    this.geometries.push(dustGeo);

    const dustMat = createToonMaterial({
      color: 0xf1f5f9, // Soft chalky white cartoon smoke
      gradientBands: 3,
      rimColor: 0xffffff,
      rimPower: 2.2,
      rimIntensity: 0.7,
      transparent: true,
      opacity: 0.75,
    });
    this.materials.push(dustMat);

    this.dustMesh = new THREE.InstancedMesh(dustGeo, dustMat, this.dustPoolSize);
    this.dustMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    for (let i = 0; i < this.dustPoolSize; i++) {
      this.dustData.push({
        pos: new THREE.Vector3(0, -999, 0),
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 0.45,
        maxScale: 0.8 + Math.random() * 0.4,
        active: false,
      });
      this.dummyMatrix.makeTranslation(0, -999, 0);
      this.dustMesh.setMatrixAt(i, this.dummyMatrix);
    }

    this.group.add(this.dustMesh);
  }

  // =========================================================================
  // DUST SPAWNING LOGIC (Called from engine update)
  // =========================================================================
  public spawnFootstepDust(playerPos: THREE.Vector3, isMoving: boolean) {
    if (!isMoving) return;
    const dust = this.dustData.find((d) => !d.active);
    if (!dust) return;

    dust.active = true;
    dust.life = 0;
    dust.maxLife = 0.35 + Math.random() * 0.15;
    dust.pos.set(
      playerPos.x + (Math.random() - 0.5) * 0.25,
      0.08,
      playerPos.z + (Math.random() - 0.5) * 0.25
    );
    dust.vel.set(
      (Math.random() - 0.5) * 0.35,
      0.45 + Math.random() * 0.35,
      (Math.random() - 0.5) * 0.35
    );
  }

  public spawnLandingShockwave(playerPos: THREE.Vector3) {
    // Burst 6-8 cartoon smoke puffs expanding radially outward
    const count = 6;
    for (let i = 0; i < count; i++) {
      const dust = this.dustData.find((d) => !d.active);
      if (!dust) break;

      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = 1.2 + Math.random() * 0.8;

      dust.active = true;
      dust.life = 0;
      dust.maxLife = 0.42 + Math.random() * 0.12;
      dust.pos.set(playerPos.x, 0.08, playerPos.z);
      dust.vel.set(
        Math.cos(angle) * speed,
        0.35 + Math.random() * 0.25,
        Math.sin(angle) * speed
      );
    }
  }

  // =========================================================================
  // REAL-TIME UPDATE LOOP
  // =========================================================================
  public update(dt: number, playerPos: THREE.Vector3, isGrounded: boolean, speed: number) {
    // -------------------------------------------------------------
    // 1. Update Sakura Petal Storm
    // -------------------------------------------------------------
    const windX = Math.sin(performance.now() * 0.001) * 0.75 + 0.35;
    const windZ = Math.cos(performance.now() * 0.0008) * 0.45;

    for (let i = 0; i < this.sakuraCount; i++) {
      const petal = this.sakuraData[i];

      // Aerodynamic drift
      petal.swayPhase += petal.swaySpeed * dt;
      const swayX = Math.sin(petal.swayPhase) * 0.45;
      const swayZ = Math.cos(petal.swayPhase * 0.8) * 0.35;

      petal.pos.x += (petal.vel.x + windX + swayX) * dt;
      petal.pos.y += petal.vel.y * dt;
      petal.pos.z += (petal.vel.z + windZ + swayZ) * dt;

      // Tumbling rotation
      petal.rot.x += petal.rotSpeed.x * dt;
      petal.rot.y += petal.rotSpeed.y * dt;
      petal.rot.z += petal.rotSpeed.z * dt;

      // Atmospheric envelope around player (respawn if too far or on ground)
      const dx = petal.pos.x - playerPos.x;
      const dz = petal.pos.z - playerPos.z;
      const distSq = dx * dx + dz * dz;

      if (petal.pos.y < 0.08 || distSq > 50 * 50) {
        // Respawn upwind around player
        const spawnAngle = Math.random() * Math.PI * 2;
        const spawnDist = 5.0 + Math.random() * 35.0;
        petal.pos.x = playerPos.x + Math.cos(spawnAngle) * spawnDist - windX * 8.0;
        petal.pos.y = 8.0 + Math.random() * 6.0;
        petal.pos.z = playerPos.z + Math.sin(spawnAngle) * spawnDist - windZ * 8.0;
      }

      this.dummyQuat.setFromEuler(petal.rot);
      this.dummyMatrix.compose(
        petal.pos,
        this.dummyQuat,
        new THREE.Vector3(petal.scale, petal.scale, petal.scale)
      );
      this.sakuraMesh.setMatrixAt(i, this.dummyMatrix);
    }
    this.sakuraMesh.instanceMatrix.needsUpdate = true;

    // -------------------------------------------------------------
    // 2. Update Enchanted Fireflies (Hotaru)
    // -------------------------------------------------------------
    const time = performance.now() * 0.001;
    for (let i = 0; i < this.fireflyCount; i++) {
      const anchor = this.fireflyBaseAnchors[i];
      const phase = this.fireflyPhases[i];

      // Organic wandering Lissajous curves
      const ox = Math.sin(time * 0.8 + phase) * 0.75 + Math.cos(time * 1.5 + phase * 2.0) * 0.35;
      const oy = Math.sin(time * 1.2 + phase * 1.5) * 0.55;
      const oz = Math.cos(time * 0.9 + phase) * 0.75 + Math.sin(time * 1.3 + phase * 2.0) * 0.35;

      this.fireflyPositions[i * 3 + 0] = anchor.x + ox;
      this.fireflyPositions[i * 3 + 1] = Math.max(0.4, anchor.y + oy);
      this.fireflyPositions[i * 3 + 2] = anchor.z + oz;
    }
    this.fireflyGeo.attributes.position.needsUpdate = true;

    // -------------------------------------------------------------
    // 3. Update Fountain Splashes
    // -------------------------------------------------------------
    for (let i = 0; i < this.splashParticleCount; i++) {
      const sp = this.splashData[i];

      if (!sp.active) {
        // Spawn around fountain cascades (center at 0, 0, 0, basin radius ~4m)
        const angle = Math.random() * Math.PI * 2;
        const radius = 3.6 + Math.random() * 0.8;
        sp.pos.set(Math.cos(angle) * radius, 0.95, Math.sin(angle) * radius);
        sp.vel.set(
          Math.cos(angle) * (0.8 + Math.random() * 0.9),
          1.8 + Math.random() * 1.2,
          Math.sin(angle) * (0.8 + Math.random() * 0.9)
        );
        sp.life = 0;
        sp.active = true;
      }

      sp.life += dt;
      if (sp.life >= sp.maxLife) {
        sp.active = false;
        this.dummyMatrix.makeTranslation(0, -999, 0);
      } else {
        // Gravity on splash
        sp.vel.y -= 9.8 * dt;
        sp.pos.addScaledVector(sp.vel, dt);

        const progress = sp.life / sp.maxLife;
        const scale = sp.baseScale * (1.0 - progress * 0.65);
        this.dummyMatrix.makeScale(scale, scale, scale);
        this.dummyMatrix.setPosition(sp.pos);
      }
      this.splashMesh.setMatrixAt(i, this.dummyMatrix);
    }
    this.splashMesh.instanceMatrix.needsUpdate = true;

    // -------------------------------------------------------------
    // 4. Update Footstep & Landing Dust Poofs
    // -------------------------------------------------------------
    // Detect landing impact shockwave
    if (!this.wasGroundedLastFrame && isGrounded) {
      this.spawnLandingShockwave(playerPos);
    }
    this.wasGroundedLastFrame = isGrounded;

    // Emit footstep poof while moving on ground
    if (isGrounded && speed > 2.0) {
      this.dustSpawnTimer += dt;
      if (this.dustSpawnTimer > 0.16) {
        this.dustSpawnTimer = 0;
        this.spawnFootstepDust(playerPos, true);
      }
    }

    // Step active dust particles
    for (let i = 0; i < this.dustPoolSize; i++) {
      const d = this.dustData[i];
      if (!d.active) continue;

      d.life += dt;
      if (d.life >= d.maxLife) {
        d.active = false;
        this.dummyMatrix.makeTranslation(0, -999, 0);
      } else {
        d.pos.addScaledVector(d.vel, dt);
        d.vel.multiplyScalar(0.92); // Drag

        const progress = d.life / d.maxLife;
        // Cartoon pop: expand fast, then fade out
        const scale = d.maxScale * Math.sin(progress * Math.PI);
        this.dummyMatrix.makeScale(scale, scale, scale);
        this.dummyMatrix.setPosition(d.pos);
      }
      this.dustMesh.setMatrixAt(i, this.dummyMatrix);
    }
    this.dustMesh.instanceMatrix.needsUpdate = true;
  }

  public dispose() {
    this.fireflyPoints.geometry.dispose();
    (this.fireflyPoints.material as THREE.PointsMaterial).dispose();
    this.sakuraMesh.geometry.dispose();
    (this.sakuraMesh.material as THREE.Material).dispose();
    this.splashMesh.geometry.dispose();
    (this.splashMesh.material as THREE.Material).dispose();
    this.dustMesh.geometry.dispose();
    (this.dustMesh.material as THREE.Material).dispose();
    for (const g of this.geometries) g.dispose();
    for (const m of this.materials) m.dispose();
    this.geometries = [];
    this.materials = [];
  }
}
