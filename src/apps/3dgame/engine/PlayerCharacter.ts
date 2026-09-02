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
 * AAA-Quality "Verdinho" Leon Brawler Model (Brawl Stars Style)
 * - Sculpted Emerald Chameleon Hoodie with iconic chameleon eye turrets on top
 * - Blue ridge crest along the back of the hood and wagging chameleon tail
 * - Framed face with hoodie shadow, bright glowing hero eyes, and sweet pink lollipop
 * - Vibrant green hoodie torso with royal blue kangaroo pouch and yellow zipper
 * - Chunky denim shorts with peach legs
 * - Iconic chunky Brawl Stars red & white sneakers with thick soles and shell toe-caps
 * - Volume-preserving squash & stretch, running bounce, and banking physics
 */
export class PlayerCharacter {
  public readonly group = new THREE.Group();

  // Root deformation container for squash & stretch
  private modelRoot = new THREE.Group();

  // Skeleton hierarchy
  private headGroup = new THREE.Group();
  private torsoGroup = new THREE.Group();
  private leftArmPivot = new THREE.Group();
  private rightArmPivot = new THREE.Group();
  private leftLegPivot = new THREE.Group();
  private rightLegPivot = new THREE.Group();

  // Chameleon Tail at back (Animated spring/cloth physics)
  private tailSegments: THREE.Group[] = [];

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
    this.group.name = 'PlayerCharacter_Verdinho_Leon';
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
    // 1. VIBRANT MATTE PBR PALETTE (Brawl Stars Vinyl)
    // ==========================================
    const hoodieGreenMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x10b981, // Vibrant Emerald Chameleon Green
        roughness: 0.55,
        metalness: 0.04,
      })
    );
    const hoodTrimDarkGreenMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x059669, // Rich forest green hood rim
        roughness: 0.60,
      })
    );
    const pocketBlueMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x2563eb, // Royal Blue Kangaroo Pouch & Crest
        roughness: 0.58,
        metalness: 0.05,
      })
    );
    const zipperYellowMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfbbf24, // Bright Golden Yellow Zipper & Drawstring Tips
        roughness: 0.32,
        metalness: 0.60,
      })
    );
    const drawstringCreamMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc, // Cream-white drawstrings
        roughness: 0.70,
      })
    );
    const teethWhiteMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff, // Crisp white teeth trim
        roughness: 0.35,
      })
    );
    const lollipopPinkMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xf43f5e, // Hot Pink Chameleon Tongue / Lollipop
        roughness: 0.40,
        metalness: 0.10,
      })
    );
    const skinToneMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffdfc2, // Warm glowing peach skin
        roughness: 0.60,
      })
    );
    const faceShadowMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x022c22, // Deep shaded interior of hood
        roughness: 0.85,
      })
    );
    const shortsIndigoMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e293b, // Dark indigo slate denim
        roughness: 0.75,
      })
    );
    const sneakerRedMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xef4444, // Crimson Brawler Sneaker Upper
        roughness: 0.48,
      })
    );
    const sneakerWhiteMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff, // Thick White Sole & Rubber Shell-Toe
        roughness: 0.32,
      })
    );
    const sneakerStripeMat = this.trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f172a, // Sole racing groove
        roughness: 0.60,
      })
    );

    // Eyes on Top of Hood (Chameleon Eye Turrets)
    const chamEyeYellowMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    const chamEyePupilMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    const chamEyeHighlightMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xffffff }));

    // Glowing Hero Anime Eyes Peering From Hood
    const heroEyeCyanMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));

    // ==========================================
    // 2. TORSO & HOODIE BODY
    // ==========================================
    // Torso centered at y = 0.86
    this.torsoGroup.position.set(0, 0.86, 0);
    this.modelRoot.add(this.torsoGroup);

    // Athletic curved hoodie torso using LatheGeometry (seamless silhouette)
    const torsoPoints: THREE.Vector2[] = [
      new THREE.Vector2(0.01, -0.34),
      new THREE.Vector2(0.31, -0.34), // Hem
      new THREE.Vector2(0.33, -0.22), // Hip
      new THREE.Vector2(0.32, -0.06), // Waist
      new THREE.Vector2(0.36, 0.12),  // Chest expansion
      new THREE.Vector2(0.38, 0.24),  // Upper chest
      new THREE.Vector2(0.32, 0.33),  // Shoulder taper
      new THREE.Vector2(0.18, 0.35),  // Collar base
      new THREE.Vector2(0.01, 0.35),
    ];
    const torsoGeo = this.track(new THREE.LatheGeometry(torsoPoints, 24));
    torsoGeo.scale(1.0, 1.0, 0.90);
    const torsoMesh = new THREE.Mesh(torsoGeo, hoodieGreenMat);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    this.torsoGroup.add(torsoMesh);

    // Royal Blue Kangaroo Front Pouch Pocket
    const pouchGeo = this.track(new THREE.CylinderGeometry(0.315, 0.335, 0.26, 16, 1, false, -0.85, 1.70));
    pouchGeo.scale(1.03, 1.0, 0.93);
    const pouchMesh = new THREE.Mesh(pouchGeo, pocketBlueMat);
    pouchMesh.position.set(0, -0.16, 0.03);
    pouchMesh.castShadow = true;
    this.torsoGroup.add(pouchMesh);

    // Golden Front Zipper Line
    const zipperGeo = this.track(new THREE.BoxGeometry(0.045, 0.54, 0.03));
    const zipperMesh = new THREE.Mesh(zipperGeo, zipperYellowMat);
    zipperMesh.position.set(0, 0.04, 0.32);
    zipperMesh.castShadow = true;
    this.torsoGroup.add(zipperMesh);

    // Golden Zipper Pull Tab
    const pullerGeo = this.track(new THREE.BoxGeometry(0.06, 0.08, 0.04));
    const pullerMesh = new THREE.Mesh(pullerGeo, zipperYellowMat);
    pullerMesh.position.set(0, 0.26, 0.34);
    this.torsoGroup.add(pullerMesh);

    // Cream Hoodie Drawstrings with Golden Tips
    for (const xSign of [-1, 1]) {
      const stringGeo = this.track(new THREE.CylinderGeometry(0.012, 0.012, 0.22, 8));
      const stringMesh = new THREE.Mesh(stringGeo, drawstringCreamMat);
      stringMesh.position.set(xSign * 0.10, 0.12, 0.31);
      stringMesh.rotation.z = xSign * -0.12;
      this.torsoGroup.add(stringMesh);

      const tipGeo = this.track(new THREE.CylinderGeometry(0.02, 0.02, 0.04, 8));
      const tipMesh = new THREE.Mesh(tipGeo, zipperYellowMat);
      tipMesh.position.set(xSign * 0.12, 0.01, 0.32);
      this.torsoGroup.add(tipMesh);
    }

    // ==========================================
    // 3. CHAMELEON TAIL (Attached at back of hips)
    // ==========================================
    const tailRoot = new THREE.Group();
    tailRoot.position.set(0, -0.28, -0.30);
    this.torsoGroup.add(tailRoot);

    let prevTail = tailRoot;
    for (let t = 0; t < 4; t++) {
      const seg = new THREE.Group();
      if (t > 0) seg.position.set(0, -0.14, -0.09);

      const r = 0.12 - t * 0.022;
      const segGeo = this.track(new THREE.SphereGeometry(r, 12, 10));
      segGeo.scale(1.0, 0.85, 1.25);
      const segMesh = new THREE.Mesh(segGeo, t % 2 === 0 ? hoodieGreenMat : pocketBlueMat);
      segMesh.castShadow = true;
      seg.add(segMesh);

      prevTail.add(seg);
      prevTail = seg;
      this.tailSegments.push(seg);
    }

    // ==========================================
    // 4. THE CHAMELEON HOOD & FACE
    // ==========================================
    // Head pivot at y = 1.48
    this.headGroup.position.set(0, 1.48, 0);
    this.modelRoot.add(this.headGroup);

    // Outer Chameleon Hood (Smooth rounded dome)
    const hoodGeo = this.track(new THREE.SphereGeometry(0.44, 28, 22));
    hoodGeo.scale(1.05, 1.02, 1.08);
    const hoodMesh = new THREE.Mesh(hoodGeo, hoodieGreenMat);
    hoodMesh.castShadow = true;
    hoodMesh.receiveShadow = true;
    this.headGroup.add(hoodMesh);

    // Shaded Face Opening / Mask on front of hood
    const faceMaskGeo = this.track(new THREE.CapsuleGeometry(0.22, 0.16, 12, 16));
    faceMaskGeo.rotateZ(Math.PI / 2);
    const faceMask = new THREE.Mesh(faceMaskGeo, faceShadowMat);
    faceMask.position.set(0, -0.04, 0.38);
    faceMask.scale.set(1.0, 0.9, 0.35);
    this.headGroup.add(faceMask);

    // Warm Peach Skin Face peeking inside the mask
    const faceSkinGeo = this.track(new THREE.CapsuleGeometry(0.18, 0.12, 12, 16));
    faceSkinGeo.rotateZ(Math.PI / 2);
    const faceSkin = new THREE.Mesh(faceSkinGeo, skinToneMat);
    faceSkin.position.set(0, -0.06, 0.41);
    faceSkin.scale.set(1.0, 0.85, 0.35);
    this.headGroup.add(faceSkin);

    // Curved Hood Visor / Brim over the forehead
    const visorShape = new THREE.Shape();
    visorShape.moveTo(-0.28, 0);
    visorShape.quadraticCurveTo(0, 0.20, 0.28, 0);
    visorShape.quadraticCurveTo(0, 0.12, -0.28, 0);

    const visorGeo = this.track(
      new THREE.ExtrudeGeometry(visorShape, {
        depth: 0.035,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.012,
        bevelThickness: 0.012,
      })
    );
    visorGeo.center();
    const visorMesh = new THREE.Mesh(visorGeo, hoodTrimDarkGreenMat);
    visorMesh.position.set(0, 0.08, 0.44);
    visorMesh.rotation.set(0.25, 0, 0);
    visorMesh.castShadow = true;
    this.headGroup.add(visorMesh);

    // Cute Zig-Zag Teeth along the Hood Visor
    for (let i = -3; i <= 3; i++) {
      const toothGeo = this.track(new THREE.ConeGeometry(0.026, 0.052, 4));
      toothGeo.rotateX(Math.PI);
      const tooth = new THREE.Mesh(toothGeo, teethWhiteMat);
      const angle = (i / 3) * 0.42;
      tooth.position.set(Math.sin(angle) * 0.24, 0.06 - Math.abs(i) * 0.012, Math.cos(angle) * 0.44);
      tooth.rotation.set(0.26, 0, -i * 0.10);
      tooth.castShadow = true;
      this.headGroup.add(tooth);
    }

    // Iconic Pink Lollipop / Chameleon Tongue sticking out
    const tongueGroup = new THREE.Group();
    tongueGroup.position.set(0.05, -0.14, 0.44);
    tongueGroup.rotation.set(0.22, 0.18, -0.12);

    const tongueGeo = this.track(new THREE.CapsuleGeometry(0.035, 0.12, 8, 12));
    tongueGeo.rotateZ(Math.PI / 2);
    const tongueMesh = new THREE.Mesh(tongueGeo, lollipopPinkMat);
    tongueMesh.castShadow = true;
    tongueGroup.add(tongueMesh);

    // White lollipop stick
    const stickGeo = this.track(new THREE.CylinderGeometry(0.010, 0.010, 0.12, 8));
    stickGeo.rotateZ(Math.PI / 2);
    const stickMesh = new THREE.Mesh(stickGeo, teethWhiteMat);
    stickMesh.position.set(-0.07, 0, 0);
    tongueGroup.add(stickMesh);

    this.headGroup.add(tongueGroup);

    // Glowing Hero Eyes inside the Hood
    const buildGlowingEye = (xSign: number) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xSign * 0.12, -0.02, 0.44);

      const eyeGeo = this.track(new THREE.CapsuleGeometry(0.035, 0.065, 8, 12));
      eyeGeo.rotateZ(Math.PI / 2);
      const eyeMesh = new THREE.Mesh(eyeGeo, heroEyeCyanMat);
      eyeMesh.rotation.z = xSign * -0.16; // Focused, determined hero gaze
      eyeGroup.add(eyeMesh);

      // White Catchlight Sparkle
      const sparkleGeo = this.track(new THREE.CircleGeometry(0.014, 10));
      const sparkle = new THREE.Mesh(sparkleGeo, chamEyeHighlightMat);
      sparkle.position.set(xSign * 0.01, 0.012, 0.020);
      eyeGroup.add(sparkle);

      return eyeGroup;
    };

    this.headGroup.add(buildGlowingEye(-1));
    this.headGroup.add(buildGlowingEye(1));

    // ==========================================
    // 5. LARGE CHAMELEON EYES ON TOP OF HOOD (Leon's Signature)
    // ==========================================
    const buildChamEyeTurret = (xSign: number) => {
      const turretRoot = new THREE.Group();
      turretRoot.position.set(xSign * 0.27, 0.33, 0.16);
      turretRoot.rotation.set(-0.18, xSign * 0.32, xSign * 0.22);

      // Green Eyeball Turret Socket
      const turretGeo = this.track(new THREE.SphereGeometry(0.15, 18, 16));
      const turret = new THREE.Mesh(turretGeo, hoodieGreenMat);
      turret.castShadow = true;
      turretRoot.add(turret);

      // Big Vibrant Yellow Eyeball
      const eyeballGeo = this.track(new THREE.SphereGeometry(0.125, 18, 16));
      eyeballGeo.scale(1.0, 1.0, 0.65);
      const eyeball = new THREE.Mesh(eyeballGeo, chamEyeYellowMat);
      eyeball.position.set(0, 0, 0.075);
      turretRoot.add(eyeball);

      // Black Slit Pupil
      const pupilGeo = this.track(new THREE.CapsuleGeometry(0.028, 0.065, 6, 8));
      const pupil = new THREE.Mesh(pupilGeo, chamEyePupilMat);
      pupil.position.set(0, 0, 0.15);
      turretRoot.add(pupil);

      // Glossy Specular Catchlight
      const hlGeo = this.track(new THREE.SphereGeometry(0.028, 10, 10));
      const hl = new THREE.Mesh(hlGeo, chamEyeHighlightMat);
      hl.position.set(xSign * 0.03, 0.03, 0.16);
      turretRoot.add(hl);

      return turretRoot;
    };

    this.headGroup.add(buildChamEyeTurret(-1));
    this.headGroup.add(buildChamEyeTurret(1));

    // Chameleon Ridge Spikes along Back of Hood
    for (let r = 0; r < 4; r++) {
      const spikeGeo = this.track(new THREE.ConeGeometry(0.055, 0.11, 6));
      spikeGeo.rotateX(Math.PI / 2);
      const spike = new THREE.Mesh(spikeGeo, pocketBlueMat);
      spike.position.set(0, 0.37 - r * 0.11, -0.31 - r * 0.06);
      spike.rotation.x = -0.3 - r * 0.2;
      spike.castShadow = true;
      this.headGroup.add(spike);
    }

    // ==========================================
    // 6. ARMS & CARTOON HANDS
    // ==========================================
    const buildLeonArm = (xSign: number, pivot: THREE.Group) => {
      // Natural shoulder attachment
      pivot.position.set(xSign * 0.38, 1.14, 0);
      this.modelRoot.add(pivot);

      // Smooth Rounded Shoulder
      const shoulderGeo = this.track(new THREE.SphereGeometry(0.16, 16, 16));
      const shoulder = new THREE.Mesh(shoulderGeo, hoodieGreenMat);
      shoulder.castShadow = true;
      pivot.add(shoulder);

      // Upper Arm (Green hoodie sleeve)
      const upperArmGeo = this.track(new THREE.CylinderGeometry(0.14, 0.12, 0.30, 16));
      upperArmGeo.translate(0, -0.17, 0);
      const upperArm = new THREE.Mesh(upperArmGeo, hoodieGreenMat);
      upperArm.castShadow = true;
      pivot.add(upperArm);

      // Blue Sleeve Cuff
      const cuffGeo = this.track(new THREE.TorusGeometry(0.13, 0.03, 8, 16));
      cuffGeo.rotateX(Math.PI / 2);
      const cuff = new THREE.Mesh(cuffGeo, pocketBlueMat);
      cuff.position.set(0, -0.30, 0);
      cuff.castShadow = true;
      pivot.add(cuff);

      // Forearm / Cartoon Hand
      const handGroup = new THREE.Group();
      handGroup.position.set(0, -0.46, 0.02);
      pivot.add(handGroup);

      // Rounded Cartoon Fist / Palm
      const palmGeo = this.track(new THREE.SphereGeometry(0.11, 14, 14));
      palmGeo.scale(1.0, 0.9, 0.85);
      const palm = new THREE.Mesh(palmGeo, skinToneMat);
      palm.castShadow = true;
      handGroup.add(palm);

      // Articulated Thumb
      const thumbGeo = this.track(new THREE.CapsuleGeometry(0.04, 0.08, 6, 8));
      const thumb = new THREE.Mesh(thumbGeo, skinToneMat);
      thumb.position.set(xSign * -0.065, 0.015, 0.055);
      thumb.rotation.set(-0.25, 0, xSign * -0.55);
      thumb.castShadow = true;
      handGroup.add(thumb);
    };

    buildLeonArm(-1, this.leftArmPivot);
    buildLeonArm(1, this.rightArmPivot);

    // ==========================================
    // 7. LEGS & CHUNKY BRAWLER SNEAKERS
    // ==========================================
    const buildLeonLeg = (xSign: number, pivot: THREE.Group) => {
      // Hip joint
      pivot.position.set(xSign * 0.17, 0.60, 0);
      this.modelRoot.add(pivot);

      // Dark Indigo Shorts
      const shortGeo = this.track(new THREE.CylinderGeometry(0.17, 0.15, 0.24, 16));
      shortGeo.translate(0, -0.12, 0);
      const shorts = new THREE.Mesh(shortGeo, shortsIndigoMat);
      shorts.castShadow = true;
      pivot.add(shorts);

      // Exposed Peach Leg
      const legGeo = this.track(new THREE.CylinderGeometry(0.11, 0.10, 0.18, 14));
      legGeo.translate(0, -0.28, 0);
      const leg = new THREE.Mesh(legGeo, skinToneMat);
      leg.castShadow = true;
      pivot.add(leg);

      // CHUNKY BRAWL SNEAKER
      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(0, -0.36, 0.04);
      pivot.add(shoeGroup);

      // Thick White Molded Rubber Sole
      const soleGeo = this.track(new THREE.BoxGeometry(0.28, 0.09, 0.48));
      soleGeo.translate(0, -0.22, 0.09);
      const sole = new THREE.Mesh(soleGeo, sneakerWhiteMat);
      sole.castShadow = true;
      shoeGroup.add(sole);

      // Sole Dark Stripe
      const stripeGeo = this.track(new THREE.BoxGeometry(0.285, 0.018, 0.46));
      stripeGeo.translate(0, -0.22, 0.09);
      const stripe = new THREE.Mesh(stripeGeo, sneakerStripeMat);
      shoeGroup.add(stripe);

      // Crimson Red Sneaker Body
      const upperGeo = this.track(new THREE.CapsuleGeometry(0.13, 0.22, 10, 16));
      upperGeo.rotateX(Math.PI / 2);
      upperGeo.translate(0, -0.12, 0.08);
      const upper = new THREE.Mesh(upperGeo, sneakerRedMat);
      upper.castShadow = true;
      shoeGroup.add(upper);

      // Rounded White Rubber Toe Cap
      const toeCapGeo = this.track(new THREE.SphereGeometry(0.14, 16, 12, 0, Math.PI, 0, Math.PI * 0.55));
      toeCapGeo.rotateX(Math.PI / 2);
      const toeCap = new THREE.Mesh(toeCapGeo, sneakerWhiteMat);
      toeCap.position.set(0, -0.14, 0.25);
      toeCap.scale.set(0.98, 0.72, 0.82);
      toeCap.castShadow = true;
      shoeGroup.add(toeCap);

      // Sneaker Tongue & Laces
      const tongueGeo = this.track(new THREE.BoxGeometry(0.12, 0.14, 0.04));
      const tongue = new THREE.Mesh(tongueGeo, sneakerWhiteMat);
      tongue.position.set(0, -0.04, 0.19);
      tongue.rotation.x = -0.32;
      shoeGroup.add(tongue);

      for (let l = 0; l < 3; l++) {
        const laceGeo = this.track(new THREE.BoxGeometry(0.13, 0.02, 0.04));
        const lace = new THREE.Mesh(laceGeo, sneakerWhiteMat);
        lace.position.set(0, -0.08 + l * 0.045, 0.15 + l * 0.022);
        lace.castShadow = true;
        shoeGroup.add(lace);
      }
    };

    buildLeonLeg(-1, this.leftLegPivot);
    buildLeonLeg(1, this.rightLegPivot);
  }

  private buildContactShadow() {
    // Soft ambient occlusion blob shadow disc beneath feet
    const shadowGeo = this.track(new THREE.CircleGeometry(0.70, 32));
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = this.trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x050811,
        transparent: true,
        opacity: 0.48,
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

    this.currentYaw += diff * Math.min(1, 18 * dt);
    this.group.rotation.y = this.currentYaw;
  }

  public updateAnimation(state: CharacterAnimState) {
    const { speed, isGrounded, verticalVelocity, jumpSquash, turnRate, dt } = state;

    this.idleTime += dt;

    // ==========================================
    // 1. SQUASH & STRETCH (Volume Preserving Cartoon Physics)
    // ==========================================
    let targetScaleY = 1.0;

    if (!isGrounded) {
      if (verticalVelocity > 1.8) {
        targetScaleY = 1.0 + Math.min(0.28, verticalVelocity * 0.024);
      } else if (verticalVelocity < -2.5) {
        targetScaleY = 1.0 + Math.max(-0.16, verticalVelocity * 0.010);
      }
    } else {
      targetScaleY = 1.0 - jumpSquash;
    }

    const scaleY = THREE.MathUtils.clamp(targetScaleY, 0.68, 1.34);
    const scaleXZ = 1.0 / Math.sqrt(Math.max(0.4, scaleY));
    this.modelRoot.scale.set(scaleXZ, scaleY, scaleXZ);

    // ==========================================
    // 2. DYNAMIC BANKING & LEAN (Athletic Weight Transfer)
    // ==========================================
    const targetBank = THREE.MathUtils.clamp(-turnRate * 0.065, -0.34, 0.34);
    this.currentBankAngle += (targetBank - this.currentBankAngle) * Math.min(1, 16 * dt);
    this.modelRoot.rotation.z = this.currentBankAngle;

    const targetLean = isGrounded ? Math.min(0.32, speed * 0.032) : 0.08;
    this.currentForwardLean += (targetLean - this.currentForwardLean) * Math.min(1, 14 * dt);
    this.modelRoot.rotation.x = this.currentForwardLean;

    // ==========================================
    // 3. GROUND CONTACT SHADOW
    // ==========================================
    this.shadowDisc.position.y = -this.group.position.y + 0.02;
    const heightAboveGround = Math.max(0, this.group.position.y);
    const shadowFactor = Math.max(0.08, 1 - heightAboveGround * 0.22);
    this.shadowDisc.scale.set(shadowFactor, shadowFactor, shadowFactor);
    (this.shadowDisc.material as THREE.MeshBasicMaterial).opacity = 0.48 * shadowFactor;

    // ==========================================
    // 4. ANIMATION STATES (Airborne Jump, Run Stride, Idle)
    // ==========================================
    if (!isGrounded) {
      // Airborne Jump Pose
      this.walkCycleTime = 0;

      if (verticalVelocity > 0) {
        this.leftArmPivot.rotation.x = -1.2;
        this.rightArmPivot.rotation.x = -1.2;
        this.leftArmPivot.rotation.z = -0.38;
        this.rightArmPivot.rotation.z = 0.38;

        this.leftLegPivot.rotation.x = 0.48;
        this.rightLegPivot.rotation.x = -0.38;
      } else {
        this.leftArmPivot.rotation.x = -0.65;
        this.rightArmPivot.rotation.x = -0.65;
        this.leftArmPivot.rotation.z = -0.45;
        this.rightArmPivot.rotation.z = 0.45;

        this.leftLegPivot.rotation.x = 0.18;
        this.rightLegPivot.rotation.x = -0.12;
      }

      this.torsoGroup.position.y = 0.86;
      this.headGroup.position.y = 1.48;
    } else if (speed > 0.20) {
      // Brawl Stars Run Stride
      const strideCadence = Math.min(18, 6.5 + speed * 1.5);
      this.walkCycleTime += dt * strideCadence;

      const sinStride = Math.sin(this.walkCycleTime);
      const cosStride = Math.cos(this.walkCycleTime);

      this.leftLegPivot.rotation.x = sinStride * 0.95;
      this.rightLegPivot.rotation.x = -sinStride * 0.95;

      this.leftArmPivot.rotation.x = -sinStride * 0.92;
      this.rightArmPivot.rotation.x = sinStride * 0.92;
      this.leftArmPivot.rotation.z = -0.18 - Math.abs(cosStride) * 0.10;
      this.rightArmPivot.rotation.z = 0.18 + Math.abs(cosStride) * 0.10;

      const bounce = Math.abs(cosStride) * 0.08;
      this.torsoGroup.position.y = 0.86 + bounce;
      this.headGroup.position.y = 1.48 + bounce * 1.2;
      this.torsoGroup.rotation.y = sinStride * 0.14;
      this.headGroup.rotation.y = -sinStride * 0.05;
    } else {
      // Idle Breathing Pose
      this.walkCycleTime = 0;

      const breathe = Math.sin(this.idleTime * 2.8) * 0.024;
      this.torsoGroup.position.y = 0.86 + breathe;
      this.headGroup.position.y = 1.48 + breathe * 1.4;

      this.leftLegPivot.rotation.x *= Math.max(0, 1 - 16 * dt);
      this.rightLegPivot.rotation.x *= Math.max(0, 1 - 16 * dt);
      this.leftArmPivot.rotation.x *= Math.max(0, 1 - 16 * dt);
      this.rightArmPivot.rotation.x *= Math.max(0, 1 - 16 * dt);
      this.leftArmPivot.rotation.z = -0.10 + breathe * 0.6;
      this.rightArmPivot.rotation.z = 0.10 - breathe * 0.6;
      this.torsoGroup.rotation.y *= Math.max(0, 1 - 16 * dt);
      this.headGroup.rotation.y *= Math.max(0, 1 - 16 * dt);
    }

    // ==========================================
    // 5. CHAMELEON TAIL PHYSICS
    // ==========================================
    const tailSpeed = Math.min(1.2, speed * 0.14);
    const tailWave = Math.sin(this.idleTime * 3.5 + speed * 2.0) * (0.08 + speed * 0.05);

    for (let s = 0; s < this.tailSegments.length; s++) {
      const seg = this.tailSegments[s];
      const link = (s + 1) * 0.35;
      const targetRotX = THREE.MathUtils.clamp(-0.2 + tailSpeed * link + tailWave * (s + 1), -0.6, 1.2);
      seg.rotation.x += (targetRotX - seg.rotation.x) * Math.min(1, 16 * dt);

      const targetRotY = -this.currentBankAngle * (s + 1) * 0.4;
      seg.rotation.y += (targetRotY - seg.rotation.y) * Math.min(1, 14 * dt);
    }
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
