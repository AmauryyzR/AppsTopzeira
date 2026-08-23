import * as THREE from 'three';

export class Player {
  readonly group = new THREE.Group();
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
  private yaw = 0;
  private squash = 1;
  private squashVel = 0;
  private blinkTimer = 2.8;
  private blinking = 0;
  private isSitting = false;
  private sitTransition = 0;
  private materials: THREE.Material[] = [];

  constructor() {
    this.build();
    this.group.add(this.bodyGroup);
  }

  private mat(color: number, roughness = 0.6, metalness = 0.05): THREE.MeshStandardMaterial {
    const m = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    this.materials.push(m);
    return m;
  }

  private part(parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0): THREE.Mesh {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    parent.add(mesh);
    return mesh;
  }

  private build() {
    // Stylized AAA Color Palette
    const skinMat = this.mat(0xffd4a8, 0.65, 0.0);
    const skinDarkMat = this.mat(0xf2ba87, 0.7, 0.0);
    const hoodieRed = this.mat(0xe53935, 0.75, 0.02);
    const hoodieDark = this.mat(0xc62828, 0.8, 0.02);
    const capRed = this.mat(0xdb3434, 0.68, 0.02);
    const capDark = this.mat(0x9e1e1e, 0.75, 0.02);
    const capVisorMat = this.mat(0xd32f2f, 0.6, 0.05);
    const whiteMat = this.mat(0xffffff, 0.35, 0.1);
    const creamMat = this.mat(0xfaf0e4, 0.75, 0.0);
    const hairMat = this.mat(0x3e2723, 0.85, 0.0);
    const eyeBrown = this.mat(0x4a2810, 0.3, 0.1);
    const pupilBlack = this.mat(0x111318, 0.2, 0.3);
    const pantsMat = this.mat(0x283863, 0.8, 0.02);
    const packMat = this.mat(0xa66c38, 0.75, 0.05);
    const packDarkMat = this.mat(0x7c4e22, 0.8, 0.05);
    const matRollMat = this.mat(0x26a69a, 0.65, 0.05);
    const goldMat = this.mat(0xffc107, 0.35, 0.6);
    const metalMat = this.mat(0xdfe6e9, 0.25, 0.8);
    const blushMat = new THREE.MeshStandardMaterial({
      color: 0xff8a80,
      roughness: 0.9,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    this.materials.push(blushMat);

    // --- 1. TORSO & HOODIE ---
    // Smooth main torso
    const torso = this.part(this.bodyGroup, new THREE.CapsuleGeometry(0.32, 0.34, 10, 22), hoodieRed, 0, 1.05, 0);
    torso.scale.set(1.02, 1.0, 0.94);

    // Hoodie bottom waistband / ribbed hem
    const hem = this.part(this.bodyGroup, new THREE.CylinderGeometry(0.33, 0.33, 0.09, 22), hoodieDark, 0, 0.74, 0);
    hem.scale.set(1.02, 1.0, 0.94);

    // Zipper track & metal puller
    this.part(this.bodyGroup, new THREE.BoxGeometry(0.024, 0.52, 0.015), metalMat, 0, 1.05, 0.315);
    const zipPuller = this.part(this.bodyGroup, new THREE.BoxGeometry(0.04, 0.07, 0.025), metalMat, 0.01, 1.15, 0.33);
    zipPuller.rotation.z = 0.1;

    // Kangaroo front pouch pocket with depth
    const pocket = this.part(this.bodyGroup, new THREE.BoxGeometry(0.28, 0.16, 0.05), hoodieDark, 0, 0.82, 0.29);
    pocket.rotation.x = -0.05;

    // Hoodie collar / folded hood ring around neck
    const collar = this.part(this.bodyGroup, new THREE.TorusGeometry(0.22, 0.065, 12, 24), hoodieDark, 0, 1.42, -0.02);
    collar.rotation.x = Math.PI / 2 + 0.15;

    // Hood back bulge
    const hoodBack = this.part(this.bodyGroup, new THREE.SphereGeometry(0.18, 14, 12), hoodieDark, 0, 1.34, -0.22);
    hoodBack.scale.set(1.2, 0.8, 0.9);

    // Drawstrings with silver aglet tips
    for (const side of [-1, 1]) {
      const cord = this.part(this.bodyGroup, new THREE.CylinderGeometry(0.012, 0.012, 0.18, 8), creamMat, 0.08 * side, 1.3, 0.31);
      cord.rotation.z = -0.1 * side;
      this.part(this.bodyGroup, new THREE.CylinderGeometry(0.016, 0.016, 0.04, 8), metalMat, 0.09 * side, 1.2, 0.315);

      // Backpack front straps
      const strap = this.part(this.bodyGroup, new THREE.BoxGeometry(0.075, 0.42, 0.03), packDarkMat, 0.21 * side, 1.14, 0.25);
      strap.rotation.x = -0.08;
      this.part(this.bodyGroup, new THREE.BoxGeometry(0.055, 0.04, 0.04), goldMat, 0.21 * side, 1.02, 0.27);
    }

    // --- 2. BACKPACK ---
    this.backpack = new THREE.Group();
    this.backpack.position.set(0, 1.12, -0.36);
    this.bodyGroup.add(this.backpack);

    // Main pack bag
    const packBody = this.part(this.backpack, new THREE.BoxGeometry(0.46, 0.52, 0.22), packMat, 0, 0, 0);
    packBody.scale.set(1, 1, 1);
    // Top cover flap
    const packFlap = this.part(this.backpack, new THREE.BoxGeometry(0.48, 0.18, 0.24), packDarkMat, 0, 0.22, 0.01);
    packFlap.rotation.x = -0.12;
    // Rolled sleeping mat on top
    const roll = this.part(this.backpack, new THREE.CylinderGeometry(0.085, 0.085, 0.5, 14), matRollMat, 0, 0.35, -0.02);
    roll.rotation.z = Math.PI / 2;
    for (const side of [-1, 1]) {
      this.part(this.backpack, new THREE.TorusGeometry(0.09, 0.015, 8, 16), packDarkMat, 0.15 * side, 0.35, -0.02).rotation.y = Math.PI / 2;
    }
    // Outer pocket
    this.part(this.backpack, new THREE.BoxGeometry(0.32, 0.22, 0.08), packDarkMat, 0, -0.08, -0.12);
    this.part(this.backpack, new THREE.BoxGeometry(0.06, 0.04, 0.09), goldMat, 0, -0.06, -0.13);

    // --- 3. HEAD & EXPRESSIVE FACE ---
    this.headGroup.position.set(0, 1.84, 0);
    this.bodyGroup.add(this.headGroup);

    // Neck
    this.part(this.bodyGroup, new THREE.CylinderGeometry(0.1, 0.12, 0.18, 14), skinMat, 0, 1.48, 0);

    // Head base (smooth chibi sphere)
    const skull = this.part(this.headGroup, new THREE.SphereGeometry(0.35, 28, 22), skinMat, 0, 0.01, 0.02);
    skull.scale.set(1.02, 0.98, 1.0);

    // Cute ears with inner ear detail
    for (const side of [-1, 1]) {
      const ear = this.part(this.headGroup, new THREE.SphereGeometry(0.075, 12, 10), skinMat, 0.355 * side, -0.01, 0.02);
      ear.scale.set(0.6, 1.0, 0.8);
      this.part(this.headGroup, new THREE.SphereGeometry(0.045, 10, 8), skinDarkMat, 0.365 * side, -0.01, 0.03).scale.set(0.5, 0.9, 0.7);
    }

    // Hair layers (Back & Sides)
    const hairBack = this.part(this.headGroup, new THREE.SphereGeometry(0.365, 22, 16), hairMat, 0, 0.04, -0.06);
    hairBack.scale.set(1.03, 0.98, 0.96);
    // Side hair locks framing face
    for (const side of [-1, 1]) {
      const sideLock = this.part(this.headGroup, new THREE.SphereGeometry(0.085, 10, 8), hairMat, 0.31 * side, 0.05, 0.18);
      sideLock.scale.set(0.8, 1.4, 0.9);
      sideLock.rotation.z = -0.2 * side;
    }
    // Front bangs under cap
    for (const [bx, by, bz, rot] of [
      [-0.14, 0.13, 0.31, 0.15],
      [0.01, 0.14, 0.33, -0.08],
      [0.15, 0.13, 0.31, -0.18],
    ] as const) {
      const bang = this.part(this.headGroup, new THREE.ConeGeometry(0.075, 0.16, 6), hairMat, bx, by, bz);
      bang.rotation.x = Math.PI + 0.3;
      bang.rotation.z = rot;
    }

    // --- 4. BASEBALL CAP (Polished & Seamless) ---
    const capDome = this.part(this.headGroup, new THREE.SphereGeometry(0.375, 26, 16, 0, Math.PI * 2, 0, Math.PI * 0.54), capRed, 0, 0.07, 0);
    capDome.scale.set(1.02, 0.98, 1.05);

    // Stitched front panel emblem / badge (Star button)
    const capBadge = this.part(this.headGroup, new THREE.CylinderGeometry(0.075, 0.075, 0.02, 18), creamMat, 0, 0.22, 0.33);
    capBadge.rotation.x = Math.PI / 2 - 0.4;
    const starCenter = this.part(this.headGroup, new THREE.SphereGeometry(0.03, 10, 8), goldMat, 0, 0.22, 0.345);
    starCenter.scale.set(1, 1, 0.5);

    // Top cap button
    this.part(this.headGroup, new THREE.SphereGeometry(0.045, 12, 10), capDark, 0, 0.44, 0);

    // Curved baseball visor / brim (Projecting forward horizontally from cap rim)
    const visorGroup = new THREE.Group();
    visorGroup.position.set(0, 0.08, 0.28);
    visorGroup.rotation.x = 0.18;
    this.headGroup.add(visorGroup);

    // Visor top surface (rotated Math.PI/2 to lay horizontally)
    const visorMesh = this.part(
      visorGroup,
      new THREE.CylinderGeometry(0.32, 0.36, 0.025, 22, 1, false, -Math.PI * 0.35, Math.PI * 0.7),
      capVisorMat,
      0, 0, 0.11
    );
    visorMesh.rotation.x = Math.PI / 2;
    visorMesh.scale.set(1.0, 0.75, 1.0);

    // Dark underside fabric
    const visorUnder = this.part(
      visorGroup,
      new THREE.CylinderGeometry(0.31, 0.35, 0.016, 20, 1, false, -Math.PI * 0.35, Math.PI * 0.7),
      capDark,
      0, -0.006, 0.11
    );
    visorUnder.rotation.x = Math.PI / 2;
    visorUnder.scale.set(1.0, 0.74, 1.0);

    // --- 5. EYES, EYEBROWS & MOUTH ---
    // Eyebrows
    this.leftEyebrow = this.part(this.headGroup, new THREE.BoxGeometry(0.08, 0.02, 0.018), hairMat, -0.12, 0.06, 0.33);
    this.leftEyebrow.rotation.z = 0.12;
    this.rightEyebrow = this.part(this.headGroup, new THREE.BoxGeometry(0.08, 0.02, 0.018), hairMat, 0.12, 0.06, 0.33);
    this.rightEyebrow.rotation.z = -0.12;

    // Expressive Eyes
    for (const side of [-1, 1]) {
      const eyeG = new THREE.Group();
      eyeG.position.set(0.12 * side, -0.01, 0.29);
      eyeG.rotation.y = 0.18 * side;
      this.headGroup.add(eyeG);
      this.eyeGroups.push(eyeG);

      // Sclera (White)
      const sclera = this.part(eyeG, new THREE.SphereGeometry(0.075, 16, 14), whiteMat, 0, 0, 0.02);
      sclera.scale.set(1.0, 1.15, 0.4);

      // Iris (Warm Cocoa Brown)
      const irisMesh = this.part(eyeG, new THREE.SphereGeometry(0.05, 14, 12), eyeBrown, 0, 0, 0.045);
      irisMesh.scale.set(1.0, 1.1, 0.3);

      // Pupil (Deep Black)
      const pupil = this.part(eyeG, new THREE.SphereGeometry(0.03, 12, 10), pupilBlack, 0, 0, 0.06);
      pupil.scale.set(1.0, 1.0, 0.2);

      // Specular Star / Sparkle Highlights
      const sparkle1 = this.part(eyeG, new THREE.SphereGeometry(0.013, 8, 6), whiteMat, 0.016 * side, 0.022, 0.07);
      sparkle1.scale.set(1, 1, 0.3);
      const sparkle2 = this.part(eyeG, new THREE.SphereGeometry(0.007, 8, 6), whiteMat, -0.014 * side, -0.016, 0.07);
      sparkle2.scale.set(1, 1, 0.3);
    }

    // Cute button nose
    this.part(this.headGroup, new THREE.SphereGeometry(0.026, 10, 8), skinDarkMat, 0, -0.045, 0.36);

    // Warm friendly smile
    const mouth = this.part(this.headGroup, new THREE.TorusGeometry(0.048, 0.012, 8, 16, Math.PI), this.mat(0x9c3826, 0.6), 0, -0.11, 0.34);
    mouth.rotation.x = Math.PI - 0.15;

    // Rosy Blush Cheeks
    for (const side of [-1, 1]) {
      const blush = this.part(this.headGroup, new THREE.SphereGeometry(0.046, 12, 8), blushMat, 0.21 * side, -0.065, 0.3);
      blush.scale.set(1.3, 0.6, 0.4);
      blush.rotation.z = -0.15 * side;
    }

    // --- 6. ARMS & HANDS ---
    for (const [arm, elbow, side] of [
      [this.armL, this.elbowL, -1],
      [this.armR, this.elbowR, 1],
    ] as const) {
      arm.position.set(0.38 * side, 1.35, 0);

      // Shoulder ball
      this.part(arm, new THREE.SphereGeometry(0.105, 14, 12), hoodieRed, 0, 0, 0);
      // Upper arm
      this.part(arm, new THREE.CapsuleGeometry(0.085, 0.12, 8, 14), hoodieRed, 0, -0.1, 0);

      elbow.position.set(0, -0.22, 0);
      // Forearm with cuff
      this.part(elbow, new THREE.CapsuleGeometry(0.078, 0.11, 8, 14), hoodieRed, 0, -0.07, 0);
      this.part(elbow, new THREE.CylinderGeometry(0.082, 0.082, 0.045, 14), hoodieDark, 0, -0.15, 0);

      // Stylized Chibi Hand & Thumb
      const hand = this.part(elbow, new THREE.SphereGeometry(0.088, 14, 12), skinMat, 0, -0.24, 0);
      hand.scale.set(0.9, 1.1, 0.85);
      const thumb = this.part(elbow, new THREE.SphereGeometry(0.038, 10, 8), skinMat, 0.05 * side, -0.21, 0.04);
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

      // Thigh & Hip
      this.part(leg, new THREE.SphereGeometry(0.12, 14, 12), pantsMat, 0, 0, 0);
      this.part(leg, new THREE.CapsuleGeometry(0.11, 0.12, 8, 14), pantsMat, 0, -0.12, 0);

      knee.position.set(0, -0.26, 0);
      // Calf
      this.part(knee, new THREE.CapsuleGeometry(0.098, 0.12, 8, 14), pantsMat, 0, -0.08, 0);
      // Trouser cuff
      this.part(knee, new THREE.CylinderGeometry(0.104, 0.104, 0.035, 14), this.mat(0x1e284a, 0.8), 0, -0.16, 0);

      // Modern Chunky Sneaker
      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(0, -0.22, 0.04);
      knee.add(shoeGroup);

      // White Rubber Sole
      const sole = this.part(shoeGroup, new THREE.BoxGeometry(0.18, 0.06, 0.32), whiteMat, 0, -0.03, 0);
      sole.scale.set(1.0, 1.0, 1.0);
      // Red Canvas Upper
      const canvas = this.part(shoeGroup, new THREE.BoxGeometry(0.165, 0.095, 0.27), capRed, 0, 0.045, -0.01);
      canvas.scale.set(1.0, 1.0, 1.0);
      // White Toe Cap
      const toeCap = this.part(shoeGroup, new THREE.SphereGeometry(0.085, 14, 10), whiteMat, 0, 0.015, 0.11);
      toeCap.scale.set(0.96, 0.65, 0.95);
      // White Laces Strip
      this.part(shoeGroup, new THREE.BoxGeometry(0.08, 0.02, 0.12), whiteMat, 0, 0.095, 0.04).rotation.x = -0.18;

      leg.add(knee);
      this.bodyGroup.add(leg);
    }
  }

  turnTowards(target: number, dt: number) {
    let diff = target - this.yaw;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.yaw += diff * (1 - Math.exp(-dt * 14));
    this.group.rotation.y = this.yaw;
  }

  setYaw(yaw: number) {
    this.yaw = yaw;
    this.group.rotation.y = this.yaw;
  }

  takeoff() {
    this.squashVel += 2.4;
  }

  land(impact: number) {
    this.squashVel -= 1.8 + impact * 3.0;
  }

  setSitting(sitting: boolean) {
    this.isSitting = sitting;
  }

  getIsSitting(): boolean {
    return this.isSitting;
  }

  update(dt: number, speedRatio: number, t: number, airborne = false, vy = 0) {
    // 1. Squash & Stretch dynamics
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

    // 2. Natural eye blinking
    if (this.blinking > 0) {
      this.blinking -= dt;
      const s = this.blinking > 0 ? 0.08 : 1;
      for (const eye of this.eyeGroups) eye.scale.y = s;
      if (this.blinking <= 0) for (const eye of this.eyeGroups) eye.scale.y = 1;
    } else {
      this.blinkTimer -= dt;
      if (this.blinkTimer <= 0) {
        this.blinking = 0.12;
        this.blinkTimer = 2.4 + Math.random() * 3.5;
      }
    }

    // 3. Sitting animation interpolation
    const sitTarget = this.isSitting ? 1 : 0;
    this.sitTransition += (sitTarget - this.sitTransition) * (1 - Math.exp(-dt * 8));

    if (this.sitTransition > 0.01) {
      // Sitting Pose
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

    // 4. Locomotion / Jump / Idle animation state machine
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
      // Dynamic Running with body lean, foot swing and hair sway
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
      this.bodyGroup.rotation.x = 0.12 * amp; // Forward athletic lean
      this.bodyGroup.rotation.z = Math.sin(this.phase) * 0.06 * amp; // Hip sway

      this.headGroup.rotation.x = -0.06 * amp;
      this.headGroup.rotation.y = Math.sin(this.phase) * 0.05 * amp;
      if (this.backpack) this.backpack.rotation.x = Math.sin(this.phase * 2) * 0.08 * amp;
    } else {
      // Relaxed Idle with Breathing
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

  dispose() {
    this.group.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
    });
    for (const m of this.materials) m.dispose();
    this.materials.length = 0;
  }
}
