import * as THREE from 'three';
import { PlayerCharacter } from '../PlayerCharacter';

interface GhostInstance {
  root: THREE.Group;
  materials: THREE.MeshBasicMaterial[];
  age: number;
  lifetime: number;
  active: boolean;
}

interface ParticleState {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  active: boolean;
  baseSize: number;
  colorIdx: number; // 0: cyan, 1: emerald, 2: white
}

/**
 * AAA-Grade Genshin Impact Dash & Sprint Trail VFX
 * Features:
 * 1. Ghost After-Images: 6 pre-allocated clones reproducing character pose with cel-shaded additive glow
 * 2. Wind Streamers: Aerodynamic speed lines trailing from shoulders and feet
 * 3. Anemo Particle Bursts: Swirling elemental wind sparks and burst shockwave
 * 4. Ground Dash Shockwave: Expanding anime ring on dash initiation
 * 5. Zero-GC hot loop with static buffers and pre-allocated object pools
 */
export class GenshinDashTrailVFX {
  public readonly group = new THREE.Group();

  // 1. Ghost After-Images Pool
  private ghosts: GhostInstance[] = [];
  private readonly ghostCount = 6;
  private ghostSpawnTimer = 0;
  private readonly ghostInterval = 0.065; // Spawn a ghost every ~65ms at high speed
  private nextGhostIdx = 0;

  // 2. Wind Streamers (Speed Lines)
  private streamerLines!: THREE.LineSegments;
  private streamerPositions!: Float32Array;
  private streamerOpacities!: Float32Array;
  private readonly streamerCount = 6; // 2 from shoulders, 2 from hips, 2 from feet
  private streamerAnchors: THREE.Vector3[] = [];
  private streamerTails: THREE.Vector3[] = [];
  private streamerMaterial!: THREE.LineBasicMaterial;

  // 3. Anemo Particle System
  private readonly maxParticles = 96;
  private particles: ParticleState[] = [];
  private particlePoints!: THREE.Points;
  private particleGeo!: THREE.BufferGeometry;
  private particlePosAttr!: THREE.BufferAttribute;
  private particleColorAttr!: THREE.BufferAttribute;
  private particlePositions!: Float32Array;
  private particleColors!: Float32Array;

  // 4. Ground Shockwave Ring
  private shockwaveRing!: THREE.Mesh;
  private shockwaveMat!: THREE.MeshBasicMaterial;
  private shockwaveActive = false;
  private shockwaveTimer = 0;
  private readonly shockwaveDuration = 0.26;

  // Tracked disposables
  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];

  constructor(playerCharacter: PlayerCharacter) {
    this.group.name = 'GenshinDashTrailVFX';

    this.initGhostPool(playerCharacter);
    this.initStreamers();
    this.initParticles();
    this.initShockwaveRing();
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
  // 1. GHOST AFTER-IMAGES
  // =========================================================================
  private initGhostPool(playerCharacter: PlayerCharacter) {
    const ghostColors = [
      0x38bdf8, // Anemo Cyan
      0x34d399, // Emerald Jade
      0xa7f3d0, // Soft Mint
      0x38bdf8, // Anemo Cyan
      0x67e8f9, // Luminous Light Cyan
      0xffffff, // Flash White
    ];

    for (let i = 0; i < this.ghostCount; i++) {
      const clonedRoot = playerCharacter.group.clone(true);
      clonedRoot.visible = false;
      this.group.add(clonedRoot);

      const mats: THREE.MeshBasicMaterial[] = [];
      const tint = ghostColors[i % ghostColors.length];

      clonedRoot.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const ghostMat = this.trackMat(
            new THREE.MeshBasicMaterial({
              color: tint,
              transparent: true,
              opacity: 0,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
              side: THREE.DoubleSide,
            })
          );
          mesh.material = ghostMat;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
          mats.push(ghostMat);
        }
      });

      this.ghosts.push({
        root: clonedRoot,
        materials: mats,
        age: 0,
        lifetime: 0.32,
        active: false,
      });
    }
  }

  private copyNodeTransforms(source: THREE.Object3D, target: THREE.Object3D) {
    target.position.copy(source.position);
    target.quaternion.copy(source.quaternion);
    target.scale.copy(source.scale);

    const len = Math.min(source.children.length, target.children.length);
    for (let i = 0; i < len; i++) {
      this.copyNodeTransforms(source.children[i], target.children[i]);
    }
  }

  public emitGhost(playerCharacter: PlayerCharacter) {
    const ghost = this.ghosts[this.nextGhostIdx];
    this.nextGhostIdx = (this.nextGhostIdx + 1) % this.ghostCount;

    // Synchronize full skeleton and pose without allocations
    this.copyNodeTransforms(playerCharacter.group, ghost.root);

    ghost.age = 0;
    ghost.lifetime = 0.34;
    ghost.active = true;
    ghost.root.visible = true;

    for (const mat of ghost.materials) {
      mat.opacity = 0.65;
    }
  }

  // =========================================================================
  // 2. WIND STREAMERS
  // =========================================================================
  private initStreamers() {
    this.streamerPositions = new Float32Array(this.streamerCount * 6); // 2 vertices per line, 3 coords
    this.streamerOpacities = new Float32Array(this.streamerCount);

    const geo = this.trackGeo(new THREE.BufferGeometry());
    geo.setAttribute('position', new THREE.BufferAttribute(this.streamerPositions, 3));

    this.streamerMaterial = this.trackMat(
      new THREE.LineBasicMaterial({
        color: 0x67e8f9,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        linewidth: 2,
      })
    );

    this.streamerLines = new THREE.LineSegments(geo, this.streamerMaterial);
    this.streamerLines.frustumCulled = false;
    this.group.add(this.streamerLines);

    for (let i = 0; i < this.streamerCount; i++) {
      this.streamerAnchors.push(new THREE.Vector3());
      this.streamerTails.push(new THREE.Vector3());
    }
  }

  // =========================================================================
  // 3. ANEMO PARTICLES
  // =========================================================================
  private initParticles() {
    this.particlePositions = new Float32Array(this.maxParticles * 3);
    this.particleColors = new Float32Array(this.maxParticles * 3);

    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: 0,
        y: -100,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        maxLife: 1,
        active: false,
        baseSize: 1,
        colorIdx: 0,
      });
    }

    this.particleGeo = this.trackGeo(new THREE.BufferGeometry());
    this.particlePosAttr = new THREE.BufferAttribute(this.particlePositions, 3);
    this.particleColorAttr = new THREE.BufferAttribute(this.particleColors, 3);

    this.particleGeo.setAttribute('position', this.particlePosAttr);
    this.particleGeo.setAttribute('color', this.particleColorAttr);

    // Soft procedural circular particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, 'rgba(103, 232, 249, 0.9)');
    grad.addColorStop(0.7, 'rgba(16, 185, 129, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();

    const spriteTexture = new THREE.CanvasTexture(canvas);

    const mat = this.trackMat(
      new THREE.PointsMaterial({
        size: 0.38,
        vertexColors: true,
        transparent: true,
        opacity: 0.90,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        map: spriteTexture,
      })
    );

    this.particlePoints = new THREE.Points(this.particleGeo, mat);
    this.particlePoints.frustumCulled = false;
    this.group.add(this.particlePoints);
  }

  // =========================================================================
  // 4. GROUND SHOCKWAVE RING
  // =========================================================================
  private initShockwaveRing() {
    const geo = this.trackGeo(new THREE.RingGeometry(0.15, 0.65, 36));
    this.shockwaveMat = this.trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      })
    );

    this.shockwaveRing = new THREE.Mesh(geo, this.shockwaveMat);
    this.shockwaveRing.rotation.x = -Math.PI / 2;
    this.shockwaveRing.visible = false;
    this.group.add(this.shockwaveRing);
  }

  // =========================================================================
  // TRIGGERS
  // =========================================================================
  /**
   * Trigger explosive dash shockwave and radial wind burst
   */
  public triggerDashBurst(position: THREE.Vector3, velocity: THREE.Vector3) {
    // 1. Ground Shockwave Ring
    this.shockwaveRing.position.set(position.x, position.y + 0.04, position.z);
    this.shockwaveRing.scale.set(0.5, 0.5, 0.5);
    this.shockwaveRing.visible = true;
    this.shockwaveActive = true;
    this.shockwaveTimer = 0;

    // 2. Radial Anemo Wind Burst Particles
    const burstCount = 28;
    for (let i = 0; i < burstCount; i++) {
      const p = this.findFreeParticle();
      if (!p) break;

      const angle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 4.5 + Math.random() * 5.0;

      p.active = true;
      p.x = position.x + (Math.random() - 0.5) * 0.3;
      p.y = position.y + 0.15 + Math.random() * 0.4;
      p.z = position.z + (Math.random() - 0.5) * 0.3;

      // Expand outward with forward bias along character velocity
      p.vx = Math.cos(angle) * speed + velocity.x * 0.25;
      p.vy = 0.6 + Math.random() * 2.2;
      p.vz = Math.sin(angle) * speed + velocity.z * 0.25;

      p.life = 0;
      p.maxLife = 0.24 + Math.random() * 0.18;
      p.baseSize = 0.3 + Math.random() * 0.3;
      p.colorIdx = i % 3;
    }
  }

  private findFreeParticle(): ParticleState | null {
    for (let i = 0; i < this.maxParticles; i++) {
      if (!this.particles[i].active) return this.particles[i];
    }
    return null;
  }

  // =========================================================================
  // MAIN UPDATE LOOP
  // =========================================================================
  public update(
    dt: number,
    playerCharacter: PlayerCharacter,
    playerPos: THREE.Vector3,
    playerVel: THREE.Vector3,
    speed: number,
    isSprinting: boolean,
    isGrounded: boolean
  ) {
    const isBoosting = isSprinting && speed > 5.5;

    // 1. Ghost After-Images Update & Spawning
    if (isBoosting) {
      this.ghostSpawnTimer += dt;
      if (this.ghostSpawnTimer >= this.ghostInterval) {
        this.ghostSpawnTimer = 0;
        this.emitGhost(playerCharacter);
      }
    } else {
      this.ghostSpawnTimer = this.ghostInterval * 0.5;
    }

    for (const ghost of this.ghosts) {
      if (!ghost.active) continue;

      ghost.age += dt;
      const progress = ghost.age / ghost.lifetime;

      if (progress >= 1.0) {
        ghost.active = false;
        ghost.root.visible = false;
      } else {
        // Smooth exponential fade out
        const alpha = Math.pow(1.0 - progress, 1.3) * 0.65;
        for (const mat of ghost.materials) {
          mat.opacity = alpha;
        }
        // Subtle expansion
        ghost.root.scale.multiplyScalar(1.0 + 0.12 * dt);
      }
    }

    // 2. Ground Shockwave Ring Update
    if (this.shockwaveActive) {
      this.shockwaveTimer += dt;
      const progress = this.shockwaveTimer / this.shockwaveDuration;

      if (progress >= 1.0) {
        this.shockwaveActive = false;
        this.shockwaveRing.visible = false;
      } else {
        const ringScale = 0.5 + Math.pow(progress, 0.65) * 3.8;
        this.shockwaveRing.scale.set(ringScale, ringScale, ringScale);
        this.shockwaveMat.opacity = Math.pow(1.0 - progress, 1.2) * 0.85;
      }
    }

    // 3. Wind Streamers (Speed Lines) Update
    const streamerTargetOpacity = isBoosting ? 0.75 : 0.0;
    this.streamerMaterial.opacity += (streamerTargetOpacity - this.streamerMaterial.opacity) * Math.min(1, 14 * dt);
    this.streamerLines.visible = this.streamerMaterial.opacity > 0.02;

    if (this.streamerLines.visible) {
      const offsets = [
        [-0.32, 0.95, 0.0],  // Left shoulder
        [0.32, 0.95, 0.0],   // Right shoulder
        [-0.26, 0.55, -0.1], // Left hip
        [0.26, 0.55, -0.1],  // Right hip
        [-0.18, 0.15, -0.1], // Left foot
        [0.18, 0.15, -0.1],  // Right foot
      ];

      const facingYaw = playerCharacter.group.rotation.y;
      const cosY = Math.cos(facingYaw);
      const sinY = Math.sin(facingYaw);

      let posIdx = 0;
      for (let i = 0; i < this.streamerCount; i++) {
        const [ox, oy, oz] = offsets[i];
        // Rotate offset into character world orientation
        const rx = ox * cosY + oz * sinY;
        const rz = -ox * sinY + oz * cosY;

        const headX = playerPos.x + rx;
        const headY = playerPos.y + oy;
        const headZ = playerPos.z + rz;

        // Tail drags behind according to velocity with high-speed lag
        const tailX = headX - playerVel.x * 0.11;
        const tailY = headY - playerVel.y * 0.06;
        const tailZ = headZ - playerVel.z * 0.11;

        this.streamerPositions[posIdx++] = headX;
        this.streamerPositions[posIdx++] = headY;
        this.streamerPositions[posIdx++] = headZ;

        this.streamerPositions[posIdx++] = tailX;
        this.streamerPositions[posIdx++] = tailY;
        this.streamerPositions[posIdx++] = tailZ;
      }

      (this.streamerLines.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }

    // 4. Continuous Anemo Wind Particles During Sprint
    if (isBoosting && isGrounded) {
      const emitCount = Math.random() < 0.85 ? 2 : 1;
      for (let i = 0; i < emitCount; i++) {
        const p = this.findFreeParticle();
        if (p) {
          p.active = true;
          p.x = playerPos.x + (Math.random() - 0.5) * 0.5;
          p.y = playerPos.y + 0.08 + Math.random() * 0.25;
          p.z = playerPos.z + (Math.random() - 0.5) * 0.5;

          // Drag back opposite to velocity with upward draft
          p.vx = -playerVel.x * 0.25 + (Math.random() - 0.5) * 1.5;
          p.vy = 0.5 + Math.random() * 1.5;
          p.vz = -playerVel.z * 0.25 + (Math.random() - 0.5) * 1.5;

          p.life = 0;
          p.maxLife = 0.28 + Math.random() * 0.16;
          p.baseSize = 0.25 + Math.random() * 0.2;
          p.colorIdx = Math.floor(Math.random() * 3);
        }
      }
    }

    // Update active particles
    let activeParticlesCount = 0;
    let pIdx = 0;
    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.particles[i];
      if (!p.active) {
        this.particlePositions[pIdx] = 0;
        this.particlePositions[pIdx + 1] = -100;
        this.particlePositions[pIdx + 2] = 0;
        pIdx += 3;
        continue;
      }

      activeParticlesCount++;
      p.life += dt;
      const progress = p.life / p.maxLife;

      if (progress >= 1.0) {
        p.active = false;
        this.particlePositions[pIdx] = 0;
        this.particlePositions[pIdx + 1] = -100;
        this.particlePositions[pIdx + 2] = 0;
        pIdx += 3;
      } else {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;

        p.vx *= 0.94;
        p.vy *= 0.94;
        p.vz *= 0.94;

        this.particlePositions[pIdx] = p.x;
        this.particlePositions[pIdx + 1] = p.y;
        this.particlePositions[pIdx + 2] = p.z;

        const alpha = (1.0 - progress);
        if (p.colorIdx === 0) {
          // Cyan
          this.particleColors[pIdx] = 0.22 * alpha;
          this.particleColors[pIdx + 1] = 0.74 * alpha;
          this.particleColors[pIdx + 2] = 0.97 * alpha;
        } else if (p.colorIdx === 1) {
          // Emerald
          this.particleColors[pIdx] = 0.20 * alpha;
          this.particleColors[pIdx + 1] = 0.83 * alpha;
          this.particleColors[pIdx + 2] = 0.60 * alpha;
        } else {
          // White
          this.particleColors[pIdx] = 0.95 * alpha;
          this.particleColors[pIdx + 1] = 0.98 * alpha;
          this.particleColors[pIdx + 2] = 1.00 * alpha;
        }

        pIdx += 3;
      }
    }

    if (activeParticlesCount > 0) {
      this.particlePosAttr.needsUpdate = true;
      this.particleColorAttr.needsUpdate = true;
      this.particlePoints.visible = true;
    } else {
      this.particlePoints.visible = false;
    }
  }

  public dispose() {
    for (const geo of this.geometries) {
      geo.dispose();
    }
    for (const mat of this.materials) {
      mat.dispose();
    }
    this.geometries = [];
    this.materials = [];
    this.ghosts = [];
    this.particles = [];
  }
}
