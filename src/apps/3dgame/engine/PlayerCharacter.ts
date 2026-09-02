import * as THREE from 'three';

export interface CharacterAnimState {
  speed: number;
  isGrounded: boolean;
  verticalVelocity: number;
  jumpSquash: number;
  turnRate: number;
  dt: number;
}

export class PlayerCharacter {
  public readonly group = new THREE.Group();

  // Root Deformation Container (for squash & stretch without messing with world transforms)
  private modelRoot = new THREE.Group();

  // Articulated Skeleton Hierarchy
  private headGroup = new THREE.Group();
  private torsoGroup = new THREE.Group();
  private leftArmPivot = new THREE.Group();
  private rightArmPivot = new THREE.Group();
  private leftLegPivot = new THREE.Group();
  private rightLegPivot = new THREE.Group();

  // Dynamic Cape / Scarf Tail Bones (Cloth Physics)
  private scarfSegmentsLeft: THREE.Group[] = [];
  private scarfSegmentsRight: THREE.Group[] = [];

  // Ground Contact Shadow Disc
  private shadowDisc!: THREE.Mesh;

  // Animation Timers & Smoothing
  private walkCycleTime = 0;
  private idleTime = 0;
  private currentYaw = 0;
  private targetYaw = 0;
  private currentBankAngle = 0;
  private currentForwardLean = 0;

  // Tracked Geometries & Materials for Clean Cleanup
  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];

  constructor() {
    this.group.name = 'PlayerCharacter_AAA';
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
    // ==========================================
    // 1. AAA Stylized PBR Material Palette
    // ==========================================
    const skinMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffd3b0, // Soft warm peach
        roughness: 0.45,
        metalness: 0.05,
      })
    );
    const hairMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x451a03, // Dark amber brown
        roughness: 0.75,
        metalness: 0.08,
      })
    );
    const cowlMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e3a8a, // Deep royal indigo hood
        roughness: 0.6,
      })
    );
    const armorPlateMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x2563eb, // Royal sapphire hero armor
        roughness: 0.4,
        metalness: 0.35,
      })
    );
    const goldTrimMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b, // Polished amber gold
        roughness: 0.22,
        metalness: 0.88,
      })
    );
    const leatherMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x78350f, // Warm rich leather
        roughness: 0.65,
        metalness: 0.1,
      })
    );
    const darkPantsMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b, // Dark midnight slate
        roughness: 0.75,
      })
    );
    const bootsLeatherMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x3f1d0b, // Sturdy dark leather
        roughness: 0.55,
      })
    );
    const soleMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc, // Off-white rubber combat sole
        roughness: 0.35,
      })
    );
    const capeCrimsonMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xef4444, // Vibrant hero scarlet
        roughness: 0.62,
        side: THREE.DoubleSide,
      })
    );
    const rubyGemMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xff2222,
        emissive: 0x880000,
        emissiveIntensity: 0.6,
        roughness: 0.15,
        metalness: 0.2,
      })
    );

    // Expressive Anime Eye Materials
    const eyeWhiteMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const eyeIrisMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0x06b6d4 })); // Vibrant cyan
    const eyePupilMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0x020617 })); // Pitch black
    const eyeHighlightMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xffffff }));

    // ==========================================
    // 2. Torso & Armor
    // ==========================================
    this.torsoGroup.position.set(0, 0.95, 0);
    this.modelRoot.add(this.torsoGroup);

    // Stylized Tapered Upper Body
    const chestGeo = this.track(new THREE.CylinderGeometry(0.38, 0.32, 0.72, 16));
    const chestMesh = new THREE.Mesh(chestGeo, armorPlateMat);
    chestMesh.castShadow = true;
    chestMesh.receiveShadow = true;
    this.torsoGroup.add(chestMesh);

    // Golden Chest Emblem / Breastplate Trim
    const chestTrimGeo = this.track(new THREE.TorusGeometry(0.24, 0.04, 12, 24, Math.PI));
    chestTrimGeo.rotateZ(Math.PI);
    const chestTrimMesh = new THREE.Mesh(chestTrimGeo, goldTrimMat);
    chestTrimMesh.position.set(0, 0.08, 0.28);
    chestTrimMesh.castShadow = true;
    this.torsoGroup.add(chestTrimMesh);

    // Adventurer Leather Belt
    const beltGeo = this.track(new THREE.CylinderGeometry(0.35, 0.35, 0.14, 16));
    const beltMesh = new THREE.Mesh(beltGeo, leatherMat);
    beltMesh.position.set(0, -0.28, 0);
    beltMesh.castShadow = true;
    this.torsoGroup.add(beltMesh);

    // Glowing Golden Ruby Belt Buckle
    const buckleGeo = this.track(new THREE.BoxGeometry(0.18, 0.16, 0.08));
    const buckleMesh = new THREE.Mesh(buckleGeo, goldTrimMat);
    buckleMesh.position.set(0, -0.28, 0.34);
    this.torsoGroup.add(buckleMesh);

    const rubyGeo = this.track(new THREE.DodecahedronGeometry(0.06, 0));
    const rubyMesh = new THREE.Mesh(rubyGeo, rubyGemMat);
    rubyMesh.position.set(0, -0.28, 0.38);
    this.torsoGroup.add(rubyMesh);

    // ==========================================
    // 3. Dynamic Cape / Scarf Tails (Cloth Physics)
    // ==========================================
    const createScarfTail = (xOffset: number): THREE.Group[] => {
      const segments: THREE.Group[] = [];
      let parent: THREE.Group = this.torsoGroup;

      for (let s = 0; s < 3; s++) {
        const segGroup = new THREE.Group();
        if (s === 0) {
          segGroup.position.set(xOffset, 0.32, -0.32);
        } else {
          segGroup.position.set(0, -0.26, 0);
        }

        const width = 0.18 - s * 0.02;
        const length = 0.28;
        const clothGeo = this.track(new THREE.PlaneGeometry(width, length));
        clothGeo.translate(0, -length / 2, 0);
        const clothMesh = new THREE.Mesh(clothGeo, capeCrimsonMat);
        clothMesh.castShadow = true;
        segGroup.add(clothMesh);

        parent.add(segGroup);
        segments.push(segGroup);
        parent = segGroup;
      }
      return segments;
    };

    this.scarfSegmentsLeft = createScarfTail(-0.12);
    this.scarfSegmentsRight = createScarfTail(0.12);

    // ==========================================
    // 4. Head, Hood & Expressive Hero Face
    // ==========================================
    this.headGroup.position.set(0, 1.58, 0);
    this.modelRoot.add(this.headGroup);

    // Stylized Rounded Head
    const headGeo = this.track(new THREE.SphereGeometry(0.35, 20, 20));
    headGeo.scale(1.0, 1.05, 1.0);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // Hero Cowl / Adventurer Hood
    const cowlGeo = this.track(new THREE.SphereGeometry(0.39, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.65));
    const cowlMesh = new THREE.Mesh(cowlGeo, cowlMat);
    cowlMesh.position.set(0, 0.04, -0.04);
    cowlMesh.castShadow = true;
    this.headGroup.add(cowlMesh);

    // Front Hood Brim / Visor Trim
    const brimGeo = this.track(new THREE.TorusGeometry(0.38, 0.04, 10, 24, Math.PI * 0.9));
    brimGeo.rotateX(Math.PI * 0.35);
    const brimMesh = new THREE.Mesh(brimGeo, goldTrimMat);
    brimMesh.position.set(0, 0.18, 0.12);
    brimMesh.castShadow = true;
    this.headGroup.add(brimMesh);

    // Stylized Hair Tufts (Front Bangs)
    const hairTuft1 = new THREE.Mesh(this.track(new THREE.ConeGeometry(0.08, 0.22, 6)), hairMat);
    hairTuft1.rotation.set(-0.6, 0.2, -0.4);
    hairTuft1.position.set(-0.14, 0.2, 0.28);
    this.headGroup.add(hairTuft1);

    const hairTuft2 = new THREE.Mesh(this.track(new THREE.ConeGeometry(0.09, 0.25, 6)), hairMat);
    hairTuft2.rotation.set(-0.5, -0.1, 0.3);
    hairTuft2.position.set(0.06, 0.22, 0.29);
    this.headGroup.add(hairTuft2);

    // Expressive Hero Eyes (Archero 2 / Brawl Stars Style)
    const buildEye = (xSign: number) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xSign * 0.14, 0.04, 0.31);
      eyeGroup.rotation.y = xSign * 0.15;

      // White Sclera
      const whiteMesh = new THREE.Mesh(this.track(new THREE.CapsuleGeometry(0.055, 0.08, 8, 12)), eyeWhiteMat);
      whiteMesh.rotation.z = Math.PI / 2;
      eyeGroup.add(whiteMesh);

      // Cyan Iris
      const irisMesh = new THREE.Mesh(this.track(new THREE.CircleGeometry(0.052, 16)), eyeIrisMat);
      irisMesh.position.set(xSign * -0.01, 0, 0.056);
      eyeGroup.add(irisMesh);

      // Pupil
      const pupilMesh = new THREE.Mesh(this.track(new THREE.CircleGeometry(0.034, 16)), eyePupilMat);
      pupilMesh.position.set(xSign * -0.01, 0, 0.058);
      eyeGroup.add(pupilMesh);

      // Highlight Sparkle
      const highlightMesh = new THREE.Mesh(this.track(new THREE.CircleGeometry(0.018, 10)), eyeHighlightMat);
      highlightMesh.position.set(xSign * -0.01 + 0.018, 0.02, 0.06);
      eyeGroup.add(highlightMesh);

      // Hero Eyebrow
      const browGeo = this.track(new THREE.BoxGeometry(0.12, 0.03, 0.02));
      const browMesh = new THREE.Mesh(browGeo, hairMat);
      browMesh.position.set(0, 0.08, 0.04);
      browMesh.rotation.z = xSign * -0.22;
      eyeGroup.add(browMesh);

      return eyeGroup;
    };

    this.headGroup.add(buildEye(-1));
    this.headGroup.add(buildEye(1));

    // ==========================================
    // 5. Arms & Shoulders (Articulated with Pauldrons)
    // ==========================================
    const buildArm = (xSign: number, pivot: THREE.Group) => {
      pivot.position.set(xSign * 0.44, 1.25, 0);
      this.modelRoot.add(pivot);

      // Shoulder Pauldron Guard
      const pauldronGeo = this.track(new THREE.SphereGeometry(0.18, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.6));
      const pauldronMesh = new THREE.Mesh(pauldronGeo, goldTrimMat);
      pauldronMesh.position.set(xSign * 0.02, 0.04, 0);
      pauldronMesh.rotation.z = xSign * -0.3;
      pauldronMesh.castShadow = true;
      pivot.add(pauldronMesh);

      // Upper Arm
      const armGeo = this.track(new THREE.CapsuleGeometry(0.11, 0.28, 8, 12));
      armGeo.translate(0, -0.16, 0);
      const armMesh = new THREE.Mesh(armGeo, armorPlateMat);
      armMesh.castShadow = true;
      pivot.add(armMesh);

      // Leather Bracer / Gauntlet
      const bracerGeo = this.track(new THREE.CylinderGeometry(0.12, 0.10, 0.22, 12));
      bracerGeo.translate(0, -0.34, 0);
      const bracerMesh = new THREE.Mesh(bracerGeo, leatherMat);
      bracerMesh.castShadow = true;
      pivot.add(bracerMesh);

      // Stylized Clenched Hand / Fist
      const handGeo = this.track(new THREE.SphereGeometry(0.10, 10, 10));
      handGeo.translate(0, -0.48, 0.02);
      const handMesh = new THREE.Mesh(handGeo, skinMat);
      handMesh.castShadow = true;
      pivot.add(handMesh);
    };

    buildArm(-1, this.leftArmPivot);
    buildArm(1, this.rightArmPivot);

    // ==========================================
    // 6. Legs & Chunky Stylized Boots
    // ==========================================
    const buildLeg = (xSign: number, pivot: THREE.Group) => {
      pivot.position.set(xSign * 0.18, 0.65, 0);
      this.modelRoot.add(pivot);

      // Upper Leg / Pants
      const legGeo = this.track(new THREE.CapsuleGeometry(0.14, 0.32, 8, 12));
      legGeo.translate(0, -0.18, 0);
      const legMesh = new THREE.Mesh(legGeo, darkPantsMat);
      legMesh.castShadow = true;
      pivot.add(legMesh);

      // Chunky Boot Shaft
      const bootShaftGeo = this.track(new THREE.CylinderGeometry(0.16, 0.15, 0.28, 12));
      bootShaftGeo.translate(0, -0.42, 0.02);
      const bootShaftMesh = new THREE.Mesh(bootShaftGeo, bootsLeatherMat);
      bootShaftMesh.castShadow = true;
      pivot.add(bootShaftMesh);

      // Boot Gold Buckle
      const bootBuckleGeo = this.track(new THREE.BoxGeometry(0.06, 0.06, 0.04));
      const bootBuckleMesh = new THREE.Mesh(bootBuckleGeo, goldTrimMat);
      bootBuckleMesh.position.set(xSign * 0.14, -0.38, 0.02);
      pivot.add(bootBuckleMesh);

      // Chunky Rounded Boot Foot
      const footGeo = this.track(new THREE.BoxGeometry(0.24, 0.18, 0.38));
      footGeo.translate(0, -0.55, 0.10);
      const footMesh = new THREE.Mesh(footGeo, bootsLeatherMat);
      footMesh.castShadow = true;
      pivot.add(footMesh);

      // White Thick Combat Sole
      const soleGeo = this.track(new THREE.BoxGeometry(0.26, 0.06, 0.40));
      soleGeo.translate(0, -0.64, 0.10);
      const soleMesh = new THREE.Mesh(soleGeo, soleMat);
      soleMesh.castShadow = true;
      pivot.add(soleMesh);
    };

    buildLeg(-1, this.leftLegPivot);
    buildLeg(1, this.rightLegPivot);
  }

  private buildContactShadow() {
    // Dynamic soft blob shadow disc beneath player
    const shadowGeo = this.track(new THREE.CircleGeometry(0.58, 24));
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = this.trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x0a101d,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
      })
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

    this.currentYaw += diff * Math.min(1, 16 * dt);
    this.group.rotation.y = this.currentYaw;
  }

  public updateAnimation(state: CharacterAnimState) {
    const { speed, isGrounded, verticalVelocity, jumpSquash, turnRate, dt } = state;

    this.idleTime += dt;

    // ==========================================
    // 1. Squash & Stretch Deformation (Physics Driven)
    // ==========================================
    let targetScaleY = 1.0;

    if (!isGrounded) {
      if (verticalVelocity > 1.5) {
        // Leaping Stretch along upward trajectory
        targetScaleY = 1.0 + Math.min(0.24, verticalVelocity * 0.022);
      } else if (verticalVelocity < -2.0) {
        // Falling aerodynamic slight elongation
        targetScaleY = 1.0 + Math.max(-0.15, verticalVelocity * 0.008);
      }
    } else {
      // Grounded: apply impact landing squash or jump take-off anticipation
      targetScaleY = 1.0 - jumpSquash;
    }

    const scaleY = THREE.MathUtils.clamp(targetScaleY, 0.72, 1.30);
    // Volume conservation: (X * Z) = 1 / Y
    const scaleXZ = 1.0 / Math.sqrt(Math.max(0.5, scaleY));

    this.modelRoot.scale.set(scaleXZ, scaleY, scaleXZ);

    // ==========================================
    // 2. Dynamic Banking & Forward Lean
    // ==========================================
    // Bank into turns (-turnRate)
    const targetBank = THREE.MathUtils.clamp(-turnRate * 0.05, -0.32, 0.32);
    this.currentBankAngle += (targetBank - this.currentBankAngle) * Math.min(1, 14 * dt);
    this.modelRoot.rotation.z = this.currentBankAngle;

    // Forward athletic lean proportional to running speed
    const targetLean = isGrounded ? Math.min(0.28, speed * 0.028) : 0.08;
    this.currentForwardLean += (targetLean - this.currentForwardLean) * Math.min(1, 12 * dt);
    this.modelRoot.rotation.x = this.currentForwardLean;

    // ==========================================
    // 3. Contact Shadow Height Scaling
    // ==========================================
    // Position contact shadow on ground beneath player
    this.shadowDisc.position.y = -this.group.position.y + 0.02;
    const heightAboveGround = Math.max(0, this.group.position.y);
    const shadowFactor = Math.max(0.1, 1 - heightAboveGround * 0.25);
    this.shadowDisc.scale.set(shadowFactor, shadowFactor, shadowFactor);
    (this.shadowDisc.material as THREE.MeshBasicMaterial).opacity = 0.42 * shadowFactor;

    // ==========================================
    // 4. Locomotion & Limb Kinematics
    // ==========================================
    if (!isGrounded) {
      // ----------------------------------------
      // AIRBORNE JUMP POSE
      // ----------------------------------------
      this.walkCycleTime = 0;

      if (verticalVelocity > 0) {
        // Ascending Jump: Arms spread back, knees tucked
        this.leftArmPivot.rotation.x = -1.1;
        this.rightArmPivot.rotation.x = -1.1;
        this.leftArmPivot.rotation.z = -0.3;
        this.rightArmPivot.rotation.z = 0.3;

        this.leftLegPivot.rotation.x = 0.45;
        this.rightLegPivot.rotation.x = -0.35;
      } else {
        // Descending / Fall: Legs reaching down, arms stabilizing
        this.leftArmPivot.rotation.x = -0.6;
        this.rightArmPivot.rotation.x = -0.6;
        this.leftArmPivot.rotation.z = -0.4;
        this.rightArmPivot.rotation.z = 0.4;

        this.leftLegPivot.rotation.x = 0.2;
        this.rightLegPivot.rotation.x = -0.15;
      }

      this.torsoGroup.position.y = 0.96;
      this.headGroup.position.y = 1.60;
    } else if (speed > 0.25) {
      // ----------------------------------------
      // AAA RUN STRIDE (Fluid Natural Cadence)
      // ----------------------------------------
      const strideCadence = Math.min(16, 6.0 + speed * 1.6);
      this.walkCycleTime += dt * strideCadence;

      const sinStride = Math.sin(this.walkCycleTime);
      const cosStride = Math.cos(this.walkCycleTime);

      // Leg swing with natural knee lift
      this.leftLegPivot.rotation.x = sinStride * 0.85;
      this.rightLegPivot.rotation.x = -sinStride * 0.85;

      // Arm counter-swing with slight elbow tuck
      this.leftArmPivot.rotation.x = -sinStride * 0.82;
      this.rightArmPivot.rotation.x = sinStride * 0.82;
      this.leftArmPivot.rotation.z = -0.12 - Math.abs(cosStride) * 0.08;
      this.rightArmPivot.rotation.z = 0.12 + Math.abs(cosStride) * 0.08;

      // Bouncing cadence & hip sway
      const strideBounce = Math.abs(cosStride) * 0.07;
      this.torsoGroup.position.y = 0.95 + strideBounce;
      this.headGroup.position.y = 1.58 + strideBounce * 1.1;
      this.torsoGroup.rotation.y = sinStride * 0.10;
    } else {
      // ----------------------------------------
      // IDLE BREATHING POSE
      // ----------------------------------------
      this.walkCycleTime = 0;

      // Gentle organic breathing wave
      const breathe = Math.sin(this.idleTime * 2.4) * 0.025;
      this.torsoGroup.position.y = 0.95 + breathe;
      this.headGroup.position.y = 1.58 + breathe * 1.3;

      // Relax limbs smoothly to neutral rest
      this.leftLegPivot.rotation.x *= Math.max(0, 1 - 14 * dt);
      this.rightLegPivot.rotation.x *= Math.max(0, 1 - 14 * dt);
      this.leftArmPivot.rotation.x *= Math.max(0, 1 - 14 * dt);
      this.rightArmPivot.rotation.x *= Math.max(0, 1 - 14 * dt);
      this.leftArmPivot.rotation.z = -0.08 + breathe * 0.5;
      this.rightArmPivot.rotation.z = 0.08 - breathe * 0.5;
      this.torsoGroup.rotation.y *= Math.max(0, 1 - 14 * dt);
    }

    // ==========================================
    // 5. Cloth Physics: Cape & Scarf Lagging Flow
    // ==========================================
    // Scarf responds to forward speed, vertical jump velocity, and turn inertia
    const scarfSpeedBend = Math.min(1.2, speed * 0.12);
    const scarfAirBend = !isGrounded ? THREE.MathUtils.clamp(-verticalVelocity * 0.08, -0.8, 0.9) : 0;
    const scarfWave = Math.sin(this.idleTime * 4.0 + speed * 2.0) * (0.08 + speed * 0.04);

    const updateTail = (segments: THREE.Group[], sideSign: number) => {
      for (let s = 0; s < segments.length; s++) {
        const seg = segments[s];
        const linkMult = (s + 1) * 0.45;

        // Base backward flap
        const targetRotX = THREE.MathUtils.clamp(
          scarfSpeedBend * linkMult + scarfAirBend * linkMult + scarfWave * (s + 1),
          -0.5,
          1.4
        );
        seg.rotation.x += (targetRotX - seg.rotation.x) * Math.min(1, 18 * dt);

        // Lateral trail from turns
        const targetRotZ = sideSign * 0.06 - this.currentBankAngle * (s + 1) * 0.4;
        seg.rotation.z += (targetRotZ - seg.rotation.z) * Math.min(1, 14 * dt);
      }
    };

    updateTail(this.scarfSegmentsLeft, -1);
    updateTail(this.scarfSegmentsRight, 1);
  }

  public setPosition(x: number, y: number, z: number) {
    this.group.position.set(x, y, z);
  }

  public dispose() {
    for (const g of this.geometries) g.dispose();
    for (const m of this.materials) m.dispose();
    this.geometries = [];
    this.materials = [];
  }
}
