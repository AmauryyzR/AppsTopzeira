import * as THREE from 'three';
import { createToonMaterial } from './shaders/ToonMaterial';

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
    this.modelRoot.position.y = 0.055; // Elevate model root so sneaker soles rest cleanly on the ground plane
    this.buildCharacterModel();
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
    // 1. CEL-SHADED ANIME TOON PALETTE (Genshin / BotW)
    // ==========================================
    const hoodieGreenMat = this.trackMat(
      createToonMaterial({
        color: 0x10b981, // Vibrant Emerald Chameleon Green
        gradientBands: 4,
        rimColor: 0x86efac,
        rimPower: 2.8,
        rimIntensity: 0.65,
        shadowColor: 0x064e3b,
        shadowIntensity: 0.50,
      })
    );
    const hoodTrimDarkGreenMat = this.trackMat(
      createToonMaterial({
        color: 0x059669, // Rich forest green hood rim
        gradientBands: 4,
        rimColor: 0xa7f3d0,
        rimPower: 3.0,
        rimIntensity: 0.55,
        shadowColor: 0x022c22,
        shadowIntensity: 0.55,
      })
    );
    const pocketBlueMat = this.trackMat(
      createToonMaterial({
        color: 0x2563eb, // Royal Blue Kangaroo Pouch & Crest
        gradientBands: 4,
        rimColor: 0x93c5fd,
        rimPower: 2.9,
        rimIntensity: 0.60,
        shadowColor: 0x1e3a8a,
        shadowIntensity: 0.52,
      })
    );
    const zipperYellowMat = this.trackMat(
      createToonMaterial({
        color: 0xfbbf24, // Bright Golden Yellow Zipper & Drawstring Tips
        gradientBands: 3,
        rimColor: 0xfef08a,
        rimPower: 2.5,
        rimIntensity: 0.75,
        shadowColor: 0x854d0e,
        shadowIntensity: 0.45,
      })
    );
    const drawstringCreamMat = this.trackMat(
      createToonMaterial({
        color: 0xf8fafc, // Cream-white drawstrings
        gradientBands: 4,
        rimColor: 0xffffff,
        rimPower: 3.0,
        rimIntensity: 0.65,
        shadowColor: 0x94a3b8,
        shadowIntensity: 0.50,
      })
    );
    const teethWhiteMat = this.trackMat(
      createToonMaterial({
        color: 0xffffff, // Crisp white teeth trim
        gradientBands: 3,
        rimColor: 0xffffff,
        rimPower: 2.8,
        rimIntensity: 0.70,
        shadowColor: 0x94a3b8,
        shadowIntensity: 0.45,
      })
    );
    const lollipopPinkMat = this.trackMat(
      createToonMaterial({
        color: 0xf43f5e, // Hot Pink Chameleon Tongue / Lollipop
        gradientBands: 4,
        rimColor: 0xfecdd3,
        rimPower: 2.6,
        rimIntensity: 0.70,
        shadowColor: 0x9f1239,
        shadowIntensity: 0.50,
      })
    );
    const skinToneMat = this.trackMat(
      createToonMaterial({
        color: 0xffdfc2, // Warm glowing peach skin
        gradientBands: 4,
        rimColor: 0xffedd5,
        rimPower: 3.2,
        rimIntensity: 0.50,
        shadowColor: 0xc2785c, // Warm peach-caramel shadow
        shadowIntensity: 0.45,
      })
    );
    const faceShadowMat = this.trackMat(
      createToonMaterial({
        color: 0x022c22, // Deep shaded interior of hood
        gradientBands: 3,
        rimColor: 0x047857,
        rimPower: 4.0,
        rimIntensity: 0.30,
        shadowColor: 0x01140f,
        shadowIntensity: 0.60,
      })
    );
    const shortsIndigoMat = this.trackMat(
      createToonMaterial({
        color: 0x1e293b, // Dark indigo slate denim
        gradientBands: 4,
        rimColor: 0x94a3b8,
        rimPower: 2.8,
        rimIntensity: 0.60,
        shadowColor: 0x0f172a,
        shadowIntensity: 0.55,
      })
    );
    const sneakerRedMat = this.trackMat(
      createToonMaterial({
        color: 0xef4444, // Crimson Brawler Sneaker Upper
        gradientBands: 4,
        rimColor: 0xfca5a5,
        rimPower: 2.7,
        rimIntensity: 0.65,
        shadowColor: 0x991b1b,
        shadowIntensity: 0.52,
      })
    );
    const sneakerWhiteMat = this.trackMat(
      createToonMaterial({
        color: 0xffffff, // Thick White Sole & Rubber Shell-Toe
        gradientBands: 4,
        rimColor: 0xffffff,
        rimPower: 2.6,
        rimIntensity: 0.75,
        shadowColor: 0x94a3b8,
        shadowIntensity: 0.50,
      })
    );
    const sneakerStripeMat = this.trackMat(
      createToonMaterial({
        color: 0x0f172a, // Sole racing groove
        gradientBands: 3,
        rimColor: 0x64748b,
        rimPower: 3.0,
        rimIntensity: 0.45,
        shadowColor: 0x020617,
        shadowIntensity: 0.60,
      })
    );

    // Eyes on Top of Hood (Chameleon Eye Turrets)
    const chamEyeYellowMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    const chamEyePupilMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    const chamEyeHighlightMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xffffff }));

    // Anime Face & Hair Materials (Leon's Signature Brawler Face)
    const hairTealMat = this.trackMat(
      createToonMaterial({
        color: 0x0284c7, // Vibrant cyan-teal anime hair
        gradientBands: 3,
        rimColor: 0x38bdf8,
        rimPower: 2.5,
        rimIntensity: 0.70,
        shadowColor: 0x075985,
        shadowIntensity: 0.50,
      })
    );
    const eyeScleraWhiteMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const eyeIrisCyanMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
    const eyePupilBlackMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0x090d16 }));
    const eyeHighlightWhiteMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const eyeBrowBlackMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0x090d16 }));
    const blushPeachMat = this.trackMat(
      createToonMaterial({
        color: 0xf43f5e,
        gradientBands: 2,
        transparent: true,
        opacity: 0.38,
      })
    );
    const lollipopCherryMat = this.trackMat(
      createToonMaterial({
        color: 0xe11d48, // Vibrant glossy red lollipop
        gradientBands: 4,
        rimColor: 0xfecdd3,
        rimPower: 2.2,
        rimIntensity: 0.85,
        shadowColor: 0x881337,
        shadowIntensity: 0.55,
      })
    );

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

    // Cream Hoodie Drawstrings with Golden Tips (accurately connected)
    for (const xSign of [-1, 1]) {
      const drawstringGroup = new THREE.Group();
      drawstringGroup.position.set(xSign * 0.095, 0.22, 0.31);
      drawstringGroup.rotation.z = xSign * -0.07;

      const stringLen = 0.20;
      const stringGeo = this.track(new THREE.CylinderGeometry(0.012, 0.012, stringLen, 8));
      const stringMesh = new THREE.Mesh(stringGeo, drawstringCreamMat);
      stringMesh.position.set(0, -stringLen / 2, 0);
      drawstringGroup.add(stringMesh);

      const tipLen = 0.042;
      const tipGeo = this.track(new THREE.CylinderGeometry(0.02, 0.02, tipLen, 8));
      const tipMesh = new THREE.Mesh(tipGeo, zipperYellowMat);
      tipMesh.position.set(0, -stringLen - tipLen / 2 + 0.004, 0);
      drawstringGroup.add(tipMesh);

      this.torsoGroup.add(drawstringGroup);
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
    // 4. THE CHAMELEON HOOD & EXPRESSIVE HERO FACE
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

    // Shaded Inner Cavity of Hood (Deep dark recess framing face)
    const cavityGeo = this.track(new THREE.SphereGeometry(0.42, 24, 18));
    cavityGeo.scale(1.0, 0.95, 0.98);
    const cavityMesh = new THREE.Mesh(cavityGeo, faceShadowMat);
    cavityMesh.position.set(0, -0.02, 0.05);
    this.headGroup.add(cavityMesh);

    // Smooth Peach Face Surface nestled cleanly inside the hood
    const faceBaseGeo = this.track(new THREE.SphereGeometry(0.255, 24, 20));
    faceBaseGeo.scale(1.0, 0.88, 0.42);
    const faceBase = new THREE.Mesh(faceBaseGeo, skinToneMat);
    faceBase.position.set(0, -0.045, 0.37);
    faceBase.castShadow = true;
    this.headGroup.add(faceBase);

    // Dark Green Chameleon Hood Face Rim (Sleek smooth bezel framing the face opening)
    const hoodRimGeo = this.track(new THREE.TorusGeometry(0.235, 0.038, 12, 28));
    hoodRimGeo.scale(1.0, 0.88, 0.60);
    const hoodRim = new THREE.Mesh(hoodRimGeo, hoodTrimDarkGreenMat);
    hoodRim.position.set(0, -0.045, 0.43);
    hoodRim.castShadow = true;
    this.headGroup.add(hoodRim);

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
    visorMesh.position.set(0, 0.09, 0.45);
    visorMesh.rotation.set(0.22, 0, 0);
    visorMesh.castShadow = true;
    this.headGroup.add(visorMesh);

    // Cute Zig-Zag Teeth along the Hood Visor
    for (let i = -3; i <= 3; i++) {
      const toothGeo = this.track(new THREE.ConeGeometry(0.024, 0.048, 4));
      toothGeo.rotateX(Math.PI);
      const tooth = new THREE.Mesh(toothGeo, teethWhiteMat);
      const angle = (i / 3) * 0.40;
      tooth.position.set(Math.sin(angle) * 0.23, 0.06 - Math.abs(i) * 0.012, Math.cos(angle) * 0.44);
      tooth.rotation.set(0.26, 0, -i * 0.10);
      tooth.castShadow = true;
      this.headGroup.add(tooth);
    }

    // Leon's Signature Vibrant Anime Hair Bangs peeking from under the visor
    const bangsGroup = new THREE.Group();
    bangsGroup.position.set(0, 0.04, 0.42);

    // Central sweeping anime hair spike
    const centerBangGeo = this.track(new THREE.ConeGeometry(0.042, 0.13, 6));
    centerBangGeo.rotateZ(0.12);
    centerBangGeo.rotateX(0.25);
    const centerBang = new THREE.Mesh(centerBangGeo, hairTealMat);
    centerBang.position.set(0.01, -0.01, 0.02);
    centerBang.castShadow = true;
    bangsGroup.add(centerBang);

    // Left sweeping hair spike
    const leftBangGeo = this.track(new THREE.ConeGeometry(0.036, 0.10, 6));
    leftBangGeo.rotateZ(0.35);
    leftBangGeo.rotateX(0.20);
    const leftBang = new THREE.Mesh(leftBangGeo, hairTealMat);
    leftBang.position.set(-0.075, 0.01, 0.01);
    leftBang.castShadow = true;
    bangsGroup.add(leftBang);

    // Right sweeping hair spike
    const rightBangGeo = this.track(new THREE.ConeGeometry(0.038, 0.11, 6));
    rightBangGeo.rotateZ(-0.25);
    rightBangGeo.rotateX(0.22);
    const rightBang = new THREE.Mesh(rightBangGeo, hairTealMat);
    rightBang.position.set(0.08, 0.01, 0.01);
    rightBang.castShadow = true;
    bangsGroup.add(rightBang);

    this.headGroup.add(bangsGroup);

    // Expressive Anime Hero Eyes (White Sclera + Glowing Cyan Iris + Pupil + Catchlight + Eyelash + Brow)
    const buildExpressiveHeroEye = (xSign: number) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xSign * 0.115, -0.02, 0.44);
      eyeGroup.rotation.z = xSign * -0.10; // Heroic determined slant

      // Crisp White Sclera
      const scleraGeo = this.track(new THREE.SphereGeometry(0.044, 16, 14));
      scleraGeo.scale(1.15, 0.95, 0.25);
      const sclera = new THREE.Mesh(scleraGeo, eyeScleraWhiteMat);
      eyeGroup.add(sclera);

      // Glowing Cyan Anime Iris
      const irisGeo = this.track(new THREE.SphereGeometry(0.032, 16, 14));
      irisGeo.scale(1.0, 1.05, 0.15);
      const iris = new THREE.Mesh(irisGeo, eyeIrisCyanMat);
      iris.position.set(xSign * -0.005, -0.002, 0.012);
      eyeGroup.add(iris);

      // Deep Midnight Pupil
      const pupilGeo = this.track(new THREE.SphereGeometry(0.018, 12, 10));
      pupilGeo.scale(1.0, 1.15, 0.15);
      const pupil = new THREE.Mesh(pupilGeo, eyePupilBlackMat);
      pupil.position.set(xSign * -0.005, -0.002, 0.016);
      eyeGroup.add(pupil);

      // Main Glossy Specular Sparkle
      const sparkleMainGeo = this.track(new THREE.CircleGeometry(0.010, 10));
      const sparkleMain = new THREE.Mesh(sparkleMainGeo, eyeHighlightWhiteMat);
      sparkleMain.position.set(xSign * 0.008, 0.012, 0.022);
      eyeGroup.add(sparkleMain);

      // Secondary Subtle Sparkle
      const sparkleSubGeo = this.track(new THREE.CircleGeometry(0.005, 8));
      const sparkleSub = new THREE.Mesh(sparkleSubGeo, eyeHighlightWhiteMat);
      sparkleSub.position.set(xSign * -0.010, -0.010, 0.022);
      eyeGroup.add(sparkleSub);

      // Sharp Top Eyelash / Eyelid Arc
      const lashGeo = this.track(new THREE.TorusGeometry(0.046, 0.008, 6, 14, Math.PI * 0.72));
      lashGeo.rotateZ(Math.PI * 0.14);
      const lash = new THREE.Mesh(lashGeo, eyeBrowBlackMat);
      lash.position.set(0, 0.024, 0.018);
      eyeGroup.add(lash);

      // Determined Hero Eyebrow above eye
      const browGeo = this.track(new THREE.BoxGeometry(0.065, 0.014, 0.015));
      const brow = new THREE.Mesh(browGeo, eyeBrowBlackMat);
      brow.position.set(xSign * 0.005, 0.055, 0.010);
      brow.rotation.z = xSign * 0.22; // Inward tilt for fierce determination
      eyeGroup.add(brow);

      return eyeGroup;
    };

    this.headGroup.add(buildExpressiveHeroEye(-1));
    this.headGroup.add(buildExpressiveHeroEye(1));

    // Cute Anime Cheek Blush
    for (const xSign of [-1, 1]) {
      const blushGeo = this.track(new THREE.SphereGeometry(0.045, 12, 10));
      blushGeo.scale(1.2, 0.65, 0.15);
      const blush = new THREE.Mesh(blushGeo, blushPeachMat);
      blush.position.set(xSign * 0.17, -0.09, 0.42);
      this.headGroup.add(blush);
    }

    // Cute Anime Mouth & Smirk
    const mouthGeo = this.track(new THREE.TorusGeometry(0.038, 0.007, 6, 12, Math.PI * 0.65));
    mouthGeo.rotateZ(Math.PI * 0.18);
    const mouth = new THREE.Mesh(mouthGeo, eyeBrowBlackMat);
    mouth.position.set(0.01, -0.12, 0.435);
    this.headGroup.add(mouth);

    // Iconic Round Candy Lollipop (Leon's Signature Chupa-Chups)
    const lollipopGroup = new THREE.Group();
    lollipopGroup.position.set(0.065, -0.115, 0.45);
    lollipopGroup.rotation.set(0.15, 0.22, -0.32);

    // Glossy Red Round Lollipop Sphere
    const candyGeo = this.track(new THREE.SphereGeometry(0.042, 16, 14));
    candyGeo.scale(1.0, 1.0, 0.82);
    const candyMesh = new THREE.Mesh(candyGeo, lollipopCherryMat);
    candyMesh.castShadow = true;
    lollipopGroup.add(candyMesh);

    // Lollipop Candy Swirl Accent
    const swirlGeo = this.track(new THREE.TorusGeometry(0.024, 0.005, 6, 14));
    const swirlMesh = new THREE.Mesh(swirlGeo, teethWhiteMat);
    swirlMesh.position.set(0, 0, 0.032);
    lollipopGroup.add(swirlMesh);

    // Clean White Lollipop Stick
    const stickGeo = this.track(new THREE.CylinderGeometry(0.007, 0.007, 0.13, 8));
    stickGeo.rotateZ(Math.PI / 2);
    const stickMesh = new THREE.Mesh(stickGeo, teethWhiteMat);
    stickMesh.position.set(-0.065, -0.005, 0);
    lollipopGroup.add(stickMesh);

    this.headGroup.add(lollipopGroup);

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
      const cuffGeo = this.track(new THREE.TorusGeometry(0.125, 0.035, 10, 20));
      cuffGeo.rotateX(Math.PI / 2);
      const cuff = new THREE.Mesh(cuffGeo, pocketBlueMat);
      cuff.position.set(0, -0.30, 0);
      cuff.castShadow = true;
      pivot.add(cuff);

      // Solid Peach Forearm / Wrist (bridges sleeve cuff directly into hand with zero gap)
      const wristGeo = this.track(new THREE.CylinderGeometry(0.090, 0.082, 0.18, 14));
      wristGeo.translate(0, -0.36, 0.01);
      const wrist = new THREE.Mesh(wristGeo, skinToneMat);
      wrist.castShadow = true;
      pivot.add(wrist);

      // Cartoon Hand / Fist attached directly at end of wrist
      const handGroup = new THREE.Group();
      handGroup.position.set(0, -0.44, 0.015);
      pivot.add(handGroup);

      // Rounded Cartoon Fist / Palm
      const palmGeo = this.track(new THREE.SphereGeometry(0.105, 16, 14));
      palmGeo.scale(1.0, 0.92, 0.90);
      const palm = new THREE.Mesh(palmGeo, skinToneMat);
      palm.castShadow = true;
      handGroup.add(palm);

      // Knuckle ridges for cartoon brawl glove/fist
      for (let k = 0; k < 3; k++) {
        const knuckleGeo = this.track(new THREE.CapsuleGeometry(0.024, 0.048, 6, 8));
        knuckleGeo.rotateZ(Math.PI / 2);
        const knuckle = new THREE.Mesh(knuckleGeo, skinToneMat);
        knuckle.position.set((k - 1) * 0.042, -0.040, 0.065);
        knuckle.castShadow = true;
        handGroup.add(knuckle);
      }

      // Articulated Thumb
      const thumbGeo = this.track(new THREE.CapsuleGeometry(0.038, 0.075, 6, 8));
      const thumb = new THREE.Mesh(thumbGeo, skinToneMat);
      thumb.position.set(xSign * -0.065, 0.012, 0.045);
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

  public setFacingAngle(targetAngle: number, dt: number) {
    this.targetYaw = targetAngle;
    let diff = this.targetYaw - this.currentYaw;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;

    // Smooth bounded angular interpolation (Genshin Impact / BotW style turn easing)
    // Ensures smooth turning curve without instantaneous jumps or angle teleporting
    const maxAngularSpeed = 12.0; // rad/s (~680 deg/s max turn rate)
    const responsiveness = 14.0;
    const step = diff * (1 - Math.exp(-responsiveness * dt));
    const maxStep = maxAngularSpeed * dt;
    const clampedStep = THREE.MathUtils.clamp(step, -maxStep, maxStep);

    this.currentYaw += clampedStep;
    while (this.currentYaw > Math.PI) this.currentYaw -= 2 * Math.PI;
    while (this.currentYaw < -Math.PI) this.currentYaw += 2 * Math.PI;

    this.group.rotation.y = this.currentYaw;
  }

  public updateAnimation(state: CharacterAnimState) {
    const { speed, isGrounded, verticalVelocity, jumpSquash, turnRate, dt } = state;

    this.idleTime += dt;

    // ==========================================
    // 1. SOLID PROPORTION SCALE (No vertical shrinking on jump)
    // ==========================================
    let targetScaleY = 1.0;
    if (isGrounded && jumpSquash > 0) {
      targetScaleY = Math.max(0.94, 1.0 - jumpSquash * 0.25);
    }
    this.modelRoot.scale.set(1.0, targetScaleY, 1.0);

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
    // 4. ANIMATION STATES (Airborne Jump, Run Stride, Idle)
    // ==========================================
    if (!isGrounded) {
      // Airborne Jump Pose (Natural athletic jump, preserves vertical silhouette)
      this.walkCycleTime = 0;

      if (verticalVelocity > 0) {
        this.leftArmPivot.rotation.x = -0.65;
        this.rightArmPivot.rotation.x = -0.65;
        this.leftArmPivot.rotation.z = -0.25;
        this.rightArmPivot.rotation.z = 0.25;

        this.leftLegPivot.rotation.x = 0.10;
        this.rightLegPivot.rotation.x = -0.06;
      } else {
        this.leftArmPivot.rotation.x = -0.35;
        this.rightArmPivot.rotation.x = -0.35;
        this.leftArmPivot.rotation.z = -0.30;
        this.rightArmPivot.rotation.z = 0.30;

        this.leftLegPivot.rotation.x = 0.05;
        this.rightLegPivot.rotation.x = -0.04;
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
