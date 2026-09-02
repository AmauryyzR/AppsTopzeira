import * as THREE from 'three';

export interface CharacterAnimState {
  speed: number;
  isGrounded: boolean;
  verticalVelocity: number;
  jumpSquash: number;
  turnRate: number;
  dt: number;
}

/**
 * Backup do modelo procedural Chameleon / Leon (Brawl Stars style) em Three.js puro.
 * Preservado para referência ou fallback caso necessário.
 */
export class PlayerCharacterLeon {
  public readonly group = new THREE.Group();
  private modelRoot = new THREE.Group();

  private headGroup = new THREE.Group();
  private torsoGroup = new THREE.Group();
  private leftArmPivot = new THREE.Group();
  private rightArmPivot = new THREE.Group();
  private leftLegPivot = new THREE.Group();
  private rightLegPivot = new THREE.Group();
  private tailSegments: THREE.Group[] = [];
  private shadowDisc!: THREE.Mesh;

  private walkCycleTime = 0;
  private idleTime = 0;
  private currentYaw = 0;
  private targetYaw = 0;
  private currentBankAngle = 0;
  private currentForwardLean = 0;

  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];

  constructor() {
    this.group.name = 'PlayerCharacter_Leon_Backup';
    this.group.add(this.modelRoot);
    this.buildCharacterModel();
    this.buildContactShadow();
  }

  private track<T extends THREE.BufferGeometry>(geo: T): T {
    this.geometries.push(geo);
    return geo;
  }

  private trackMat<T extends THREE.Material>(mat: T): T {
    this.materials.push(mat);
    return mat;
  }

  private buildCharacterModel() {
    const hoodieGreenMat = this.trackMat(new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.58 }));
    const hoodieDarkGreenMat = this.trackMat(new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.65 }));
    const pocketBlueMat = this.trackMat(new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.60 }));
    const zipperYellowMat = this.trackMat(new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.35, metalness: 0.50 }));
    const teethWhiteMat = this.trackMat(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.40 }));
    const lollipopPinkMat = this.trackMat(new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.45 }));
    const skinToneMat = this.trackMat(new THREE.MeshStandardMaterial({ color: 0xffdfc2, roughness: 0.60 }));
    const faceShadowMat = this.trackMat(new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.85 }));
    const shortsIndigoMat = this.trackMat(new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.75 }));
    const sneakerRedMat = this.trackMat(new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.50 }));
    const sneakerWhiteMat = this.trackMat(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 }));
    const sneakerStripeMat = this.trackMat(new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.60 }));

    const chamEyeYellowMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    const chamEyePupilMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    const chamEyeHighlightMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const heroEyeCyanMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));

    this.torsoGroup.position.set(0, 0.86, 0);
    this.modelRoot.add(this.torsoGroup);

    const torsoPoints: THREE.Vector2[] = [
      new THREE.Vector2(0.01, -0.34),
      new THREE.Vector2(0.31, -0.34),
      new THREE.Vector2(0.33, -0.22),
      new THREE.Vector2(0.32, -0.06),
      new THREE.Vector2(0.36, 0.12),
      new THREE.Vector2(0.38, 0.24),
      new THREE.Vector2(0.32, 0.33),
      new THREE.Vector2(0.18, 0.35),
      new THREE.Vector2(0.01, 0.35),
    ];
    const torsoGeo = this.track(new THREE.LatheGeometry(torsoPoints, 24));
    torsoGeo.scale(1.0, 1.0, 0.90);
    const torsoMesh = new THREE.Mesh(torsoGeo, hoodieGreenMat);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    this.torsoGroup.add(torsoMesh);

    const pouchGeo = this.track(new THREE.CylinderGeometry(0.31, 0.33, 0.26, 16, 1, false, -0.85, 1.70));
    pouchGeo.scale(1.03, 1.0, 0.94);
    const pouchMesh = new THREE.Mesh(pouchGeo, pocketBlueMat);
    pouchMesh.position.set(0, -0.16, 0.03);
    pouchMesh.castShadow = true;
    this.torsoGroup.add(pouchMesh);

    const zipperGeo = this.track(new THREE.BoxGeometry(0.045, 0.56, 0.03));
    const zipperMesh = new THREE.Mesh(zipperGeo, zipperYellowMat);
    zipperMesh.position.set(0, 0.04, 0.32);
    this.torsoGroup.add(zipperMesh);

    const tailRoot = new THREE.Group();
    tailRoot.position.set(0, -0.28, -0.30);
    this.torsoGroup.add(tailRoot);

    let prevTail = tailRoot;
    for (let t = 0; t < 4; t++) {
      const seg = new THREE.Group();
      if (t > 0) seg.position.set(0, -0.16, -0.10);
      const r = 0.12 - t * 0.022;
      const segGeo = this.track(new THREE.SphereGeometry(r, 12, 10));
      segGeo.scale(1.0, 0.85, 1.3);
      const segMesh = new THREE.Mesh(segGeo, t % 2 === 0 ? hoodieGreenMat : pocketBlueMat);
      segMesh.castShadow = true;
      seg.add(segMesh);
      prevTail.add(seg);
      prevTail = seg;
      this.tailSegments.push(seg);
    }

    this.headGroup.position.set(0, 1.48, 0);
    this.modelRoot.add(this.headGroup);

    const hoodGeo = this.track(new THREE.SphereGeometry(0.44, 28, 22));
    hoodGeo.scale(1.06, 1.02, 1.10);
    const hoodMesh = new THREE.Mesh(hoodGeo, hoodieGreenMat);
    hoodMesh.castShadow = true;
    this.headGroup.add(hoodMesh);

    const faceCavityGeo = this.track(new THREE.SphereGeometry(0.40, 24, 18, -1.1, 2.2, 0.9, 1.6));
    const faceCavity = new THREE.Mesh(faceCavityGeo, faceShadowMat);
    faceCavity.position.set(0, -0.04, 0.06);
    this.headGroup.add(faceCavity);

    for (let i = -3; i <= 3; i++) {
      const toothGeo = this.track(new THREE.ConeGeometry(0.032, 0.065, 4));
      toothGeo.rotateX(Math.PI);
      const tooth = new THREE.Mesh(toothGeo, teethWhiteMat);
      const angle = (i / 3) * 0.45;
      tooth.position.set(Math.sin(angle) * 0.26, 0.12 - Math.abs(i) * 0.01, Math.cos(angle) * 0.42);
      tooth.rotation.set(0.3, 0, -i * 0.12);
      this.headGroup.add(tooth);
    }

    const tongueGroup = new THREE.Group();
    tongueGroup.position.set(0.04, -0.18, 0.36);
    tongueGroup.rotation.set(0.25, 0.2, -0.15);
    const tongueGeo = this.track(new THREE.CapsuleGeometry(0.038, 0.14, 8, 12));
    tongueGeo.rotateZ(Math.PI / 2);
    const tongueMesh = new THREE.Mesh(tongueGeo, lollipopPinkMat);
    tongueGroup.add(tongueMesh);
    this.headGroup.add(tongueGroup);

    const buildGlowingEye = (xSign: number) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xSign * 0.14, -0.04, 0.38);
      const eyeGeo = this.track(new THREE.CapsuleGeometry(0.038, 0.06, 8, 12));
      eyeGeo.rotateZ(Math.PI / 2);
      const eyeMesh = new THREE.Mesh(eyeGeo, heroEyeCyanMat);
      eyeGroup.add(eyeMesh);
      return eyeGroup;
    };
    this.headGroup.add(buildGlowingEye(-1));
    this.headGroup.add(buildGlowingEye(1));

    const buildChamEyeTurret = (xSign: number) => {
      const turretRoot = new THREE.Group();
      turretRoot.position.set(xSign * 0.28, 0.34, 0.18);
      turretRoot.rotation.set(-0.2, xSign * 0.35, xSign * 0.25);
      const turretGeo = this.track(new THREE.SphereGeometry(0.16, 18, 16));
      const turret = new THREE.Mesh(turretGeo, hoodieGreenMat);
      turretRoot.add(turret);

      const eyeballGeo = this.track(new THREE.SphereGeometry(0.13, 18, 16));
      eyeballGeo.scale(1.0, 1.0, 0.65);
      const eyeball = new THREE.Mesh(eyeballGeo, chamEyeYellowMat);
      eyeball.position.set(0, 0, 0.08);
      turretRoot.add(eyeball);

      const pupilGeo = this.track(new THREE.CapsuleGeometry(0.03, 0.07, 6, 8));
      const pupil = new THREE.Mesh(pupilGeo, chamEyePupilMat);
      pupil.position.set(0, 0, 0.16);
      turretRoot.add(pupil);
      return turretRoot;
    };
    this.headGroup.add(buildChamEyeTurret(-1));
    this.headGroup.add(buildChamEyeTurret(1));

    const buildLeonArm = (xSign: number, pivot: THREE.Group) => {
      pivot.position.set(xSign * 0.38, 1.14, 0);
      this.modelRoot.add(pivot);
      const shoulderGeo = this.track(new THREE.SphereGeometry(0.16, 16, 16));
      const shoulder = new THREE.Mesh(shoulderGeo, hoodieGreenMat);
      pivot.add(shoulder);

      const upperArmGeo = this.track(new THREE.CylinderGeometry(0.14, 0.12, 0.30, 16));
      upperArmGeo.translate(0, -0.17, 0);
      const upperArm = new THREE.Mesh(upperArmGeo, hoodieGreenMat);
      pivot.add(upperArm);

      const cuffGeo = this.track(new THREE.TorusGeometry(0.13, 0.03, 8, 16));
      cuffGeo.rotateX(Math.PI / 2);
      const cuff = new THREE.Mesh(cuffGeo, pocketBlueMat);
      cuff.position.set(0, -0.30, 0);
      pivot.add(cuff);

      const palmGeo = this.track(new THREE.SphereGeometry(0.11, 14, 14));
      const palm = new THREE.Mesh(palmGeo, skinToneMat);
      palm.position.set(0, -0.46, 0.02);
      pivot.add(palm);
    };
    buildLeonArm(-1, this.leftArmPivot);
    buildLeonArm(1, this.rightArmPivot);

    const buildLeonLeg = (xSign: number, pivot: THREE.Group) => {
      pivot.position.set(xSign * 0.17, 0.60, 0);
      this.modelRoot.add(pivot);

      const shortGeo = this.track(new THREE.CylinderGeometry(0.17, 0.15, 0.24, 16));
      shortGeo.translate(0, -0.12, 0);
      const shorts = new THREE.Mesh(shortGeo, shortsIndigoMat);
      pivot.add(shorts);

      const legGeo = this.track(new THREE.CylinderGeometry(0.11, 0.10, 0.18, 14));
      legGeo.translate(0, -0.28, 0);
      const leg = new THREE.Mesh(legGeo, skinToneMat);
      pivot.add(leg);

      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(0, -0.36, 0.04);
      pivot.add(shoeGroup);

      const soleGeo = this.track(new THREE.BoxGeometry(0.28, 0.09, 0.48));
      soleGeo.translate(0, -0.22, 0.09);
      const sole = new THREE.Mesh(soleGeo, sneakerWhiteMat);
      shoeGroup.add(sole);

      const upperGeo = this.track(new THREE.CapsuleGeometry(0.13, 0.22, 10, 16));
      upperGeo.rotateX(Math.PI / 2);
      upperGeo.translate(0, -0.12, 0.08);
      const upper = new THREE.Mesh(upperGeo, sneakerRedMat);
      shoeGroup.add(upper);

      const toeCapGeo = this.track(new THREE.SphereGeometry(0.14, 16, 12, 0, Math.PI, 0, Math.PI * 0.55));
      toeCapGeo.rotateX(Math.PI / 2);
      const toeCap = new THREE.Mesh(toeCapGeo, sneakerWhiteMat);
      toeCap.position.set(0, -0.14, 0.25);
      shoeGroup.add(toeCap);
    };
    buildLeonLeg(-1, this.leftLegPivot);
    buildLeonLeg(1, this.rightLegPivot);
  }

  private buildContactShadow() {
    const shadowGeo = this.track(new THREE.CircleGeometry(0.70, 32));
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = this.trackMat(
      new THREE.MeshBasicMaterial({ color: 0x050811, transparent: true, opacity: 0.48, depthWrite: false })
    );
    this.shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowDisc.position.set(0, 0.02, 0);
    this.group.add(this.shadowDisc);
  }

  public setFacingAngle(targetAngle: number, dt: number) {
    this.targetYaw = targetAngle;
    let diff = this.targetYaw - this.currentYaw;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    this.currentYaw += diff * Math.min(1, 18 * dt);
    this.group.rotation.y = this.currentYaw;
  }

  public updateAnimation(state: CharacterAnimState) {
    const { speed, isGrounded, verticalVelocity, jumpSquash, turnRate, dt } = state;
    this.idleTime += dt;

    let targetScaleY = isGrounded ? 1.0 - jumpSquash : 1.0 + (verticalVelocity > 0 ? 0.2 : -0.1);
    const scaleY = THREE.MathUtils.clamp(targetScaleY, 0.68, 1.34);
    const scaleXZ = 1.0 / Math.sqrt(Math.max(0.4, scaleY));
    this.modelRoot.scale.set(scaleXZ, scaleY, scaleXZ);

    this.currentBankAngle += (-turnRate * 0.065 - this.currentBankAngle) * Math.min(1, 16 * dt);
    this.modelRoot.rotation.z = this.currentBankAngle;

    const targetLean = isGrounded ? Math.min(0.32, speed * 0.032) : 0.08;
    this.currentForwardLean += (targetLean - this.currentForwardLean) * Math.min(1, 14 * dt);
    this.modelRoot.rotation.x = this.currentForwardLean;

    if (!isGrounded) {
      this.walkCycleTime = 0;
      this.leftArmPivot.rotation.x = -1.1;
      this.rightArmPivot.rotation.x = -1.1;
      this.leftLegPivot.rotation.x = 0.45;
      this.rightLegPivot.rotation.x = -0.35;
    } else if (speed > 0.20) {
      this.walkCycleTime += dt * Math.min(18, 6.5 + speed * 1.5);
      const sinStride = Math.sin(this.walkCycleTime);
      const cosStride = Math.cos(this.walkCycleTime);
      this.leftLegPivot.rotation.x = sinStride * 0.95;
      this.rightLegPivot.rotation.x = -sinStride * 0.95;
      this.leftArmPivot.rotation.x = -sinStride * 0.92;
      this.rightArmPivot.rotation.x = sinStride * 0.92;
      const bounce = Math.abs(cosStride) * 0.08;
      this.torsoGroup.position.y = 0.86 + bounce;
      this.headGroup.position.y = 1.48 + bounce * 1.2;
    } else {
      this.walkCycleTime = 0;
      const breathe = Math.sin(this.idleTime * 2.8) * 0.024;
      this.torsoGroup.position.y = 0.86 + breathe;
      this.headGroup.position.y = 1.48 + breathe * 1.4;
      this.leftLegPivot.rotation.x *= Math.max(0, 1 - 16 * dt);
      this.rightLegPivot.rotation.x *= Math.max(0, 1 - 16 * dt);
      this.leftArmPivot.rotation.x *= Math.max(0, 1 - 16 * dt);
      this.rightArmPivot.rotation.x *= Math.max(0, 1 - 16 * dt);
    }
  }

  public setPosition(x: number, y: number, z: number) {
    this.group.position.set(x, y, z);
  }

  public dispose() {
    for (const g of this.geometries) g.dispose();
    for (const m of this.materials) m.dispose();
  }
}
