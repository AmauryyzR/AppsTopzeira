import * as THREE from 'three';
import { PlayerSnapshot } from '../types';
import { GeometryValidator } from './GeometryValidator';
import { MaterialPalette } from './MaterialPalette';
import { ResourceRegistry } from './ResourceRegistry';

export class PlayerView {
  public readonly group = new THREE.Group();
  private bodyGroup = new THREE.Group();
  private headGroup = new THREE.Group();
  private legL = new THREE.Group();
  private legR = new THREE.Group();
  private kneeL = new THREE.Group();
  private kneeR = new THREE.Group();
  private armL = new THREE.Group();
  private armR = new THREE.Group();
  private elbowL = new THREE.Group();
  private elbowR = new THREE.Group();
  private eyeGroups: THREE.Group[] = [];
  private leftEyebrow?: THREE.Mesh;
  private rightEyebrow?: THREE.Mesh;
  private backpack?: THREE.Group;

  private phase = 0;
  private currentYaw = 0;
  private targetYaw = 0;
  private squash = 1;
  private squashVel = 0;
  private blinkTimer = 2.8;
  private blinking = 0;
  private sitTransition = 0;

  constructor(private palette: MaterialPalette, private registry: ResourceRegistry) {
    this.build();
    this.group.add(this.bodyGroup);
  }

  private part(
    parent: THREE.Object3D,
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
    name = 'PlayerPart'
  ): THREE.Mesh {
    GeometryValidator.assertValid(geo, name);
    this.registry.trackGeometry(geo);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  }

  private build() {
    const pal = this.palette;

    // --- 1. TORSO & HOODIE ---
    const torso = this.part(
      this.bodyGroup,
      new THREE.CapsuleGeometry(0.32, 0.34, 8, 16),
      pal.hoodieRed,
      0,
      1.05,
      0,
      'Torso'
    );
    torso.scale.set(1.02, 1.0, 0.94);

    const hem = this.part(
      this.bodyGroup,
      new THREE.CylinderGeometry(0.33, 0.33, 0.09, 16),
      pal.hoodieDark,
      0,
      0.74,
      0,
      'Hem'
    );
    hem.scale.set(1.02, 1.0, 0.94);

    // Zipper
    this.part(this.bodyGroup, new THREE.BoxGeometry(0.024, 0.52, 0.015), pal.metal, 0, 1.05, 0.315, 'Zipper');
    const zipPuller = this.part(this.bodyGroup, new THREE.BoxGeometry(0.04, 0.07, 0.025), pal.metal, 0.01, 1.15, 0.33, 'ZipPuller');
    zipPuller.rotation.z = 0.1;

    // Pouch Pocket
    const pocket = this.part(this.bodyGroup, new THREE.BoxGeometry(0.28, 0.16, 0.05), pal.hoodieDark, 0, 0.82, 0.29, 'Pocket');
    pocket.rotation.x = -0.05;

    // Collar
    const collar = this.part(this.bodyGroup, new THREE.TorusGeometry(0.22, 0.065, 8, 16), pal.hoodieDark, 0, 1.42, -0.02, 'Collar');
    collar.rotation.x = Math.PI / 2 + 0.15;

    // Hood back bulge
    const hoodBack = this.part(this.bodyGroup, new THREE.SphereGeometry(0.18, 10, 8), pal.hoodieDark, 0, 1.34, -0.22, 'HoodBack');
    hoodBack.scale.set(1.2, 0.8, 0.9);

    // Drawstrings
    for (const side of [-1, 1]) {
      const cord = this.part(this.bodyGroup, new THREE.CylinderGeometry(0.012, 0.012, 0.18, 6), pal.cream, 0.08 * side, 1.3, 0.31, 'Cord');
      cord.rotation.z = -0.1 * side;
      this.part(this.bodyGroup, new THREE.CylinderGeometry(0.016, 0.016, 0.04, 6), pal.metal, 0.09 * side, 1.2, 0.315, 'Aglet');

      const strap = this.part(this.bodyGroup, new THREE.BoxGeometry(0.075, 0.42, 0.03), pal.packDark, 0.21 * side, 1.14, 0.25, 'Strap');
      strap.rotation.x = -0.08;
      this.part(this.bodyGroup, new THREE.BoxGeometry(0.055, 0.04, 0.04), pal.gold, 0.21 * side, 1.02, 0.27, 'Buckle');
    }

    // --- 2. BACKPACK ---
    this.backpack = new THREE.Group();
    this.backpack.position.set(0, 1.12, -0.36);
    this.bodyGroup.add(this.backpack);

    this.part(this.backpack, new THREE.BoxGeometry(0.46, 0.52, 0.22), pal.pack, 0, 0, 0, 'PackBody');
    const packFlap = this.part(this.backpack, new THREE.BoxGeometry(0.48, 0.18, 0.24), pal.packDark, 0, 0.22, 0.01, 'PackFlap');
    packFlap.rotation.x = -0.12;

    const roll = this.part(this.backpack, new THREE.CylinderGeometry(0.085, 0.085, 0.5, 10), pal.matRoll, 0, 0.35, -0.02, 'Roll');
    roll.rotation.z = Math.PI / 2;
    for (const side of [-1, 1]) {
      this.part(this.backpack, new THREE.TorusGeometry(0.09, 0.015, 6, 12), pal.packDark, 0.15 * side, 0.35, -0.02, 'RollStrap').rotation.y = Math.PI / 2;
    }
    this.part(this.backpack, new THREE.BoxGeometry(0.32, 0.22, 0.08), pal.packDark, 0, -0.08, -0.12, 'PackOuter');
    this.part(this.backpack, new THREE.BoxGeometry(0.06, 0.04, 0.09), pal.gold, 0, -0.06, -0.13, 'PackGold');

    // --- 3. HEAD & FACE ---
    this.headGroup.position.set(0, 1.84, 0);
    this.bodyGroup.add(this.headGroup);

    this.part(this.bodyGroup, new THREE.CylinderGeometry(0.1, 0.12, 0.18, 10), pal.skin, 0, 1.48, 0, 'Neck');

    const skull = this.part(this.headGroup, new THREE.SphereGeometry(0.35, 18, 14), pal.skin, 0, 0.01, 0.02, 'Skull');
    skull.scale.set(1.02, 0.98, 1.0);

    for (const side of [-1, 1]) {
      const ear = this.part(this.headGroup, new THREE.SphereGeometry(0.075, 10, 8), pal.skin, 0.355 * side, -0.01, 0.02, 'Ear');
      ear.scale.set(0.6, 1.0, 0.8);
      this.part(this.headGroup, new THREE.SphereGeometry(0.045, 8, 6), pal.skinDark, 0.365 * side, -0.01, 0.03, 'InnerEar').scale.set(0.5, 0.9, 0.7);
    }

    const hairBack = this.part(this.headGroup, new THREE.SphereGeometry(0.365, 16, 12), pal.hair, 0, 0.04, -0.06, 'HairBack');
    hairBack.scale.set(1.03, 0.98, 0.96);

    for (const side of [-1, 1]) {
      const sideLock = this.part(this.headGroup, new THREE.SphereGeometry(0.085, 8, 6), pal.hair, 0.31 * side, 0.05, 0.18, 'SideLock');
      sideLock.scale.set(0.8, 1.4, 0.9);
      sideLock.rotation.z = -0.2 * side;
    }

    for (const [bx, by, bz, rot] of [
      [-0.14, 0.13, 0.31, 0.15],
      [0.01, 0.14, 0.33, -0.08],
      [0.15, 0.13, 0.31, -0.18],
    ] as const) {
      const bang = this.part(this.headGroup, new THREE.ConeGeometry(0.075, 0.16, 6), pal.hair, bx, by, bz, 'Bang');
      bang.rotation.x = Math.PI + 0.3;
      bang.rotation.z = rot;
    }

    // --- 4. BASEBALL CAP ---
    const capDome = this.part(
      this.headGroup,
      new THREE.SphereGeometry(0.375, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.54),
      pal.capRed,
      0,
      0.07,
      0,
      'CapDome'
    );
    capDome.scale.set(1.02, 0.98, 1.05);

    const capBadge = this.part(this.headGroup, new THREE.CylinderGeometry(0.075, 0.075, 0.02, 12), pal.cream, 0, 0.22, 0.33, 'CapBadge');
    capBadge.rotation.x = Math.PI / 2 - 0.4;
    const starCenter = this.part(this.headGroup, new THREE.SphereGeometry(0.03, 8, 6), pal.gold, 0, 0.22, 0.345, 'StarCenter');
    starCenter.scale.set(1, 1, 0.5);

    this.part(this.headGroup, new THREE.SphereGeometry(0.045, 8, 6), pal.capDark, 0, 0.44, 0, 'CapButton');

    // Curved baseball visor
    const visorGroup = new THREE.Group();
    visorGroup.position.set(0, 0.08, 0.28);
    visorGroup.rotation.x = 0.18;
    this.headGroup.add(visorGroup);

    const visorMesh = this.part(
      visorGroup,
      new THREE.CylinderGeometry(0.32, 0.36, 0.025, 16, 1, false, -Math.PI * 0.35, Math.PI * 0.7),
      pal.capVisor,
      0,
      0,
      0.11,
      'Visor'
    );
    visorMesh.rotation.x = Math.PI / 2;
    visorMesh.scale.set(1.0, 0.75, 1.0);

    const visorUnder = this.part(
      visorGroup,
      new THREE.CylinderGeometry(0.31, 0.35, 0.016, 14, 1, false, -Math.PI * 0.35, Math.PI * 0.7),
      pal.capDark,
      0,
      -0.006,
      0.11,
      'VisorUnder'
    );
    visorUnder.rotation.x = Math.PI / 2;
    visorUnder.scale.set(1.0, 0.74, 1.0);

    // --- 5. EYES, EYEBROWS & MOUTH ---
    this.leftEyebrow = this.part(this.headGroup, new THREE.BoxGeometry(0.08, 0.02, 0.018), pal.hair, -0.12, 0.06, 0.33, 'LeftEyebrow');
    this.leftEyebrow.rotation.z = 0.12;
    this.rightEyebrow = this.part(this.headGroup, new THREE.BoxGeometry(0.08, 0.02, 0.018), pal.hair, 0.12, 0.06, 0.33, 'RightEyebrow');
    this.rightEyebrow.rotation.z = -0.12;

    for (const side of [-1, 1]) {
      const eyeG = new THREE.Group();
      eyeG.position.set(0.12 * side, -0.01, 0.29);
      eyeG.rotation.y = 0.18 * side;
      this.headGroup.add(eyeG);
      this.eyeGroups.push(eyeG);

      const sclera = this.part(eyeG, new THREE.SphereGeometry(0.075, 12, 10), pal.white, 0, 0, 0.02, 'Sclera');
      sclera.scale.set(1.0, 1.15, 0.4);

      const irisMesh = this.part(eyeG, new THREE.SphereGeometry(0.05, 10, 8), pal.eyeBrown, 0, 0, 0.045, 'Iris');
      irisMesh.scale.set(1.0, 1.1, 0.3);

      const pupil = this.part(eyeG, new THREE.SphereGeometry(0.03, 8, 6), pal.pupilBlack, 0, 0, 0.06, 'Pupil');
      pupil.scale.set(1.0, 1.0, 0.2);

      const sparkle1 = this.part(eyeG, new THREE.SphereGeometry(0.013, 6, 4), pal.white, 0.016 * side, 0.022, 0.07, 'Sparkle1');
      sparkle1.scale.set(1, 1, 0.3);
      const sparkle2 = this.part(eyeG, new THREE.SphereGeometry(0.007, 6, 4), pal.white, -0.014 * side, -0.016, 0.07, 'Sparkle2');
      sparkle2.scale.set(1, 1, 0.3);
    }

    this.part(this.headGroup, new THREE.SphereGeometry(0.026, 8, 6), pal.skinDark, 0, -0.045, 0.36, 'Nose');

    const mouth = this.part(this.headGroup, new THREE.TorusGeometry(0.048, 0.012, 6, 12, Math.PI), pal.mouth, 0, -0.11, 0.34, 'Mouth');
    mouth.rotation.x = Math.PI - 0.15;

    for (const side of [-1, 1]) {
      const blush = this.part(this.headGroup, new THREE.SphereGeometry(0.046, 8, 6), pal.blush, 0.21 * side, -0.065, 0.3, 'Blush');
      blush.scale.set(1.3, 0.6, 0.4);
      blush.rotation.z = -0.15 * side;
    }

    // --- 6. ARMS & HANDS ---
    for (const [arm, elbow, side] of [
      [this.armL, this.elbowL, -1],
      [this.armR, this.elbowR, 1],
    ] as const) {
      arm.position.set(0.38 * side, 1.35, 0);

      this.part(arm, new THREE.SphereGeometry(0.105, 10, 8), pal.hoodieRed, 0, 0, 0, 'Shoulder');
      this.part(arm, new THREE.CapsuleGeometry(0.085, 0.12, 6, 10), pal.hoodieRed, 0, -0.1, 0, 'UpperArm');

      elbow.position.set(0, -0.22, 0);
      this.part(elbow, new THREE.CapsuleGeometry(0.078, 0.11, 6, 10), pal.hoodieRed, 0, -0.07, 0, 'ForeArm');
      this.part(elbow, new THREE.CylinderGeometry(0.082, 0.082, 0.045, 10), pal.hoodieDark, 0, -0.15, 0, 'Cuff');

      const hand = this.part(elbow, new THREE.SphereGeometry(0.088, 10, 8), pal.skin, 0, -0.24, 0, 'Hand');
      hand.scale.set(0.9, 1.1, 0.85);
      const thumb = this.part(elbow, new THREE.SphereGeometry(0.038, 8, 6), pal.skin, 0.05 * side, -0.21, 0.04, 'Thumb');
      thumb.scale.set(1.0, 1.4, 0.8);
      thumb.rotation.z = 0.4 * side;

      arm.add(elbow);
      this.bodyGroup.add(arm);
    }

    // --- 7. LEGS & SNEAKERS ---
    for (const [leg, knee, side] of [
      [this.legL, this.kneeL, -1],
      [this.legR, this.kneeR, 1],
    ] as const) {
      leg.position.set(0.16 * side, 0.55, 0);

      this.part(leg, new THREE.SphereGeometry(0.12, 10, 8), pal.pants, 0, 0, 0, 'Hip');
      this.part(leg, new THREE.CapsuleGeometry(0.11, 0.12, 6, 10), pal.pants, 0, -0.12, 0, 'Thigh');

      knee.position.set(0, -0.26, 0);
      this.part(knee, new THREE.CapsuleGeometry(0.098, 0.12, 6, 10), pal.pants, 0, -0.08, 0, 'Calf');
      this.part(knee, new THREE.CylinderGeometry(0.104, 0.104, 0.035, 10), pal.pantsDark, 0, -0.16, 0, 'TrouserCuff');

      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(0, -0.22, 0.04);
      knee.add(shoeGroup);

      const sole = this.part(shoeGroup, new THREE.BoxGeometry(0.18, 0.06, 0.32), pal.white, 0, -0.03, 0, 'Sole');
      sole.scale.set(1.0, 1.0, 1.0);
      const canvas = this.part(shoeGroup, new THREE.BoxGeometry(0.165, 0.095, 0.27), pal.capRed, 0, 0.045, -0.01, 'ShoeCanvas');
      canvas.scale.set(1.0, 1.0, 1.0);
      const toeCap = this.part(shoeGroup, new THREE.SphereGeometry(0.085, 10, 8), pal.white, 0, 0.015, 0.11, 'ToeCap');
      toeCap.scale.set(0.96, 0.65, 0.95);
      this.part(shoeGroup, new THREE.BoxGeometry(0.08, 0.02, 0.12), pal.white, 0, 0.095, 0.04, 'Laces').rotation.x = -0.18;

      leg.add(knee);
      this.bodyGroup.add(leg);
    }
  }

  public render(previous: PlayerSnapshot, current: PlayerSnapshot, alpha: number, dt: number) {
    // 1. Interpolate position
    const px = previous.position[0] + (current.position[0] - previous.position[0]) * alpha;
    const py = previous.position[1] + (current.position[1] - previous.position[1]) * alpha;
    const pz = previous.position[2] + (current.position[2] - previous.position[2]) * alpha;
    this.group.position.set(px, py, pz);

    // 2. Interpolate yaw with shortest-arc angle unwrapping
    let diff = current.yaw - previous.yaw;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.currentYaw = previous.yaw + diff * alpha;
    this.group.rotation.y = this.currentYaw;

    const speedRatio = previous.speedRatio + (current.speedRatio - previous.speedRatio) * alpha;
    const airborne = !current.grounded;
    const vy = current.verticalVelocity;
    const t = current.animationTime;

    // 3. Squash & stretch
    if (airborne) {
      const target = Math.max(0.84, Math.min(1.2, 1 + vy * 0.018));
      this.squash += (target - this.squash) * (1 - Math.exp(-dt * 14));
      this.squashVel = 0;
    } else {
      this.squashVel += (1 - this.squash) * 150 * dt;
      this.squashVel *= Math.exp(-dt * 10);
      this.squash += this.squashVel * dt;
    }
    const ixz = 1 + (1 - this.squash) * 0.65;
    this.group.scale.set(0.88 * ixz, 0.88 * this.squash, 0.88 * ixz);

    // 4. Eye blinking
    if (this.blinking > 0) {
      this.blinking -= dt;
      const s = this.blinking > 0 ? 0.08 : 1;
      for (const eye of this.eyeGroups) eye.scale.y = s;
      if (this.blinking <= 0) {
        for (const eye of this.eyeGroups) eye.scale.y = 1;
      }
    } else {
      this.blinkTimer -= dt;
      if (this.blinkTimer <= 0) {
        this.blinking = 0.12;
        this.blinkTimer = 2.4 + Math.random() * 3.5;
      }
    }

    // 5. Sitting animation
    const sitTarget = current.isSitting ? 1 : 0;
    this.sitTransition += (sitTarget - this.sitTransition) * (1 - Math.exp(-dt * 8));

    if (this.sitTransition > 0.01) {
      const st = this.sitTransition;
      const k = 1 - Math.exp(-dt * 12);
      this.legL.rotation.x += (-Math.PI / 2 * st - this.legL.rotation.x) * k;
      this.legR.rotation.x += (-Math.PI / 2 * st - this.legR.rotation.x) * k;
      this.kneeL.rotation.x += (Math.PI / 2 * st - this.kneeL.rotation.x) * k;
      this.kneeR.rotation.x += (Math.PI / 2 * st - this.kneeR.rotation.x) * k;
      this.armL.rotation.x += (-0.4 * st - this.armL.rotation.x) * k;
      this.armR.rotation.x += (-0.4 * st - this.armR.rotation.x) * k;
      this.elbowL.rotation.x += (-0.5 * st - this.elbowL.rotation.x) * k;
      this.elbowR.rotation.x += (-0.5 * st - this.elbowR.rotation.x) * k;
      this.bodyGroup.position.y += (-0.18 * st - this.bodyGroup.position.y) * k;
      this.bodyGroup.rotation.x += (0.05 * st - this.bodyGroup.rotation.x) * k;
      this.headGroup.rotation.x = Math.sin(t * 1.5) * 0.04;
      this.headGroup.rotation.y = Math.sin(t * 0.8) * 0.08;
      return;
    }

    // 6. Locomotion / Jump / Idle
    if (airborne) {
      const k = 1 - Math.exp(-dt * 16);
      this.legL.rotation.x += (-0.65 - this.legL.rotation.x) * k;
      this.legR.rotation.x += (0.4 - this.legR.rotation.x) * k;
      this.kneeL.rotation.x += (1.2 - this.kneeL.rotation.x) * k;
      this.kneeR.rotation.x += (1.1 - this.kneeR.rotation.x) * k;
      this.armL.rotation.x += (-1.25 - this.armL.rotation.x) * k;
      this.armR.rotation.x += (-1.25 - this.armR.rotation.x) * k;
      this.elbowL.rotation.x += (-0.6 - this.elbowL.rotation.x) * k;
      this.elbowR.rotation.x += (-0.6 - this.elbowR.rotation.x) * k;
      this.bodyGroup.position.y += (0.06 - this.bodyGroup.position.y) * k;
      this.bodyGroup.rotation.x += (0.12 - this.bodyGroup.rotation.x) * k;
      this.bodyGroup.rotation.z += (0 - this.bodyGroup.rotation.z) * k;
      this.headGroup.rotation.x += (-0.15 - this.headGroup.rotation.x) * k;
      if (this.backpack) this.backpack.rotation.x = -0.15;
    } else if (speedRatio > 0.04) {
      this.phase += dt * (7 + speedRatio * 7.5);
      const amp = Math.min(speedRatio * 1.4, 1);
      const swingL = Math.sin(this.phase) * 0.85 * amp;
      const swingR = -swingL;

      this.legL.rotation.x = swingL;
      this.legR.rotation.x = swingR;
      this.kneeL.rotation.x = Math.max(0, Math.sin(this.phase - 0.95)) * 1.15 * amp;
      this.kneeR.rotation.x = Math.max(0, Math.sin(this.phase + Math.PI - 0.95)) * 1.15 * amp;

      this.armL.rotation.x = swingR * 0.75;
      this.armR.rotation.x = swingL * 0.75;
      this.elbowL.rotation.x = -0.35 - Math.abs(swingR) * 0.35;
      this.elbowR.rotation.x = -0.35 - Math.abs(swingL) * 0.35;

      this.bodyGroup.position.y = Math.abs(Math.sin(this.phase)) * 0.075 * amp;
      this.bodyGroup.rotation.x = 0.12 * amp;
      this.bodyGroup.rotation.z = Math.sin(this.phase) * 0.06 * amp;

      this.headGroup.rotation.x = -0.06 * amp;
      this.headGroup.rotation.y = Math.sin(this.phase) * 0.05 * amp;
      if (this.backpack) this.backpack.rotation.x = Math.sin(this.phase * 2) * 0.08 * amp;
    } else {
      const k = 1 - Math.exp(-dt * 10);
      const ease = (cur: number, target: number) => cur + (target - cur) * k;

      this.legL.rotation.x = ease(this.legL.rotation.x, 0);
      this.legR.rotation.x = ease(this.legR.rotation.x, 0);
      this.kneeL.rotation.x = ease(this.kneeL.rotation.x, 0.05);
      this.kneeR.rotation.x = ease(this.kneeR.rotation.x, 0.05);
      this.armL.rotation.x = ease(this.armL.rotation.x, 0);
      this.armR.rotation.x = ease(this.armR.rotation.x, 0);
      this.elbowL.rotation.x = ease(this.elbowL.rotation.x, -0.2);
      this.elbowR.rotation.x = ease(this.elbowR.rotation.x, -0.2);
      this.bodyGroup.position.y = ease(this.bodyGroup.position.y, 0);
      this.bodyGroup.rotation.x = ease(this.bodyGroup.rotation.x, 0);
      this.bodyGroup.rotation.z = ease(this.bodyGroup.rotation.z, Math.sin(t * 1.6) * 0.02);

      this.headGroup.rotation.x = ease(this.headGroup.rotation.x, Math.sin(t * 1.2) * 0.03);
      this.headGroup.rotation.y = ease(this.headGroup.rotation.y, Math.sin(t * 0.7) * 0.06);
      if (this.backpack) this.backpack.rotation.x = ease(this.backpack.rotation.x, 0);
    }

    const breath = 1 + Math.sin(t * 2.2) * 0.015;
    this.bodyGroup.scale.set(1, breath, 1);
  }

  public takeoff() {
    this.squashVel += 2.4;
  }

  public land(impact = 1) {
    this.squashVel -= 1.8 + impact * 3.0;
  }

  public dispose() {
    this.group.removeFromParent();
  }
}
