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
 * Authentic Brawl Stars / Chibi Style "Verdinho" Leon Brawler Model
 * - Calibrated proportions: 1:3 chibi brawler ratio (balanced head, torso, and legs)
 * - Cozy chameleon hood with embedded turrets, sleepy/confident eyelids, and visor
 * - Seamless padded neck cowl eliminating 100% of air gaps between body and head
 * - Expressive anime hero face: determined cool gaze, cyan irises, blush, and candy lollipop
 * - Soft layered anime hair bangs peeking under the visor
 * - Kangaroo front pocket and zipper with teardrop pull tab (zero collision)
 * - Arms anchored to torso with smooth shoulders, blue cuffs, and cartoon brawl fists
 * - Prehensile chameleon tail curling UPWARDS in a cheerful spiral above the hips
 * - Chunky red brawler sneakers with rounded rubber shell toe resting flush on the ground (y = 0.00)
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
    this.modelRoot.position.y = 0; // Feet sit flush on ground plane at world y = 0.00
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
    // 1. CEL-SHADED ANIME TOON PALETTE
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
        side: THREE.DoubleSide,
      })
    );
    const hoodTrimDarkGreenMat = this.trackMat(
      createToonMaterial({
        color: 0x059669, // Rich forest green hood rim & visor trim
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
        color: 0x2563eb, // Royal Blue Kangaroo Pouch, Crest & Tail bands
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
    const whiteAccentMat = this.trackMat(
      createToonMaterial({
        color: 0xffffff,
        gradientBands: 3,
        rimColor: 0xffffff,
        rimPower: 2.5,
        rimIntensity: 0.70,
        shadowColor: 0x94a3b8,
        shadowIntensity: 0.40,
      })
    );

    // Eyes on Top of Hood (Chameleon Eye Turrets)
    const chamEyeYellowMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    const chamEyePupilMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    const chamEyeHighlightMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xffffff }));

    // Anime Face & Hair Materials
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
        opacity: 0.42,
      })
    );

    // ==========================================
    // 2. TORSO & HOODIE BODY
    // ==========================================
    // Torso centered at y = 0.78
    this.torsoGroup.position.set(0, 0.78, 0);
    this.modelRoot.add(this.torsoGroup);

    // LatheGeometry for torso with 32 segments (cozy rounded pear silhouette)
    const torsoPoints: THREE.Vector2[] = [
      new THREE.Vector2(0.01, -0.26),
      new THREE.Vector2(0.24, -0.26), // Hem
      new THREE.Vector2(0.26, -0.16), // Hip
      new THREE.Vector2(0.25, -0.05), // Waist
      new THREE.Vector2(0.28, 0.10),  // Chest expansion
      new THREE.Vector2(0.29, 0.18),  // Upper chest
      new THREE.Vector2(0.25, 0.23),  // Shoulder taper
      new THREE.Vector2(0.16, 0.25),  // Collar base
      new THREE.Vector2(0.01, 0.25),
    ];
    const torsoGeo = this.track(new THREE.LatheGeometry(torsoPoints, 32));
    torsoGeo.scale(1.0, 1.0, 0.92);
    const torsoMesh = new THREE.Mesh(torsoGeo, hoodieGreenMat);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    this.torsoGroup.add(torsoMesh);

    // PADDED HOODIE COWL / COLLAR ROLL (Bridging Torso seamlessly into the Head - ZERO GAPS)
    const cowlGeo = this.track(new THREE.TorusGeometry(0.17, 0.044, 16, 32));
    cowlGeo.scale(1.0, 0.85, 0.95);
    const cowlMesh = new THREE.Mesh(cowlGeo, hoodieGreenMat);
    cowlMesh.position.set(0, 0.25, 0.01);
    cowlMesh.rotation.x = Math.PI / 2 - 0.15;
    cowlMesh.castShadow = true;
    this.torsoGroup.add(cowlMesh);

    // Inner neck cylinder to guarantee zero hollow void
    const neckInnerGeo = this.track(new THREE.CylinderGeometry(0.14, 0.15, 0.16, 24));
    const neckInnerMesh = new THREE.Mesh(neckInnerGeo, hoodieGreenMat);
    neckInnerMesh.position.set(0, 0.28, 0.01);
    this.torsoGroup.add(neckInnerMesh);

    // Royal Blue Kangaroo Front Pouch Pocket (Curved shell)
    const pouchGeo = this.track(new THREE.CylinderGeometry(0.255, 0.270, 0.17, 24, 1, false, -0.80, 1.60));
    pouchGeo.scale(1.03, 1.0, 0.95);
    const pouchMesh = new THREE.Mesh(pouchGeo, pocketBlueMat);
    pouchMesh.position.set(0, -0.12, 0.03);
    pouchMesh.castShadow = true;
    this.torsoGroup.add(pouchMesh);

    // Golden Front Zipper Line (Stops precisely at top of pocket! Zero overlap!)
    const zipperGeo = this.track(new THREE.BoxGeometry(0.032, 0.26, 0.022));
    const zipperMesh = new THREE.Mesh(zipperGeo, zipperYellowMat);
    zipperMesh.position.set(0, 0.11, 0.26);
    zipperMesh.castShadow = true;
    this.torsoGroup.add(zipperMesh);

    // Golden Zipper Pull Tab
    const pullerGeo = this.track(new THREE.BoxGeometry(0.045, 0.060, 0.028));
    const pullerMesh = new THREE.Mesh(pullerGeo, zipperYellowMat);
    pullerMesh.position.set(0, 0.19, 0.275);
    this.torsoGroup.add(pullerMesh);

    // Cream Hoodie Drawstrings with Golden Tips
    for (const xSign of [-1, 1]) {
      const drawstringGroup = new THREE.Group();
      drawstringGroup.position.set(xSign * 0.075, 0.20, 0.24);
      drawstringGroup.rotation.z = xSign * -0.06;

      const stringLen = 0.15;
      const stringGeo = this.track(new THREE.CylinderGeometry(0.008, 0.008, stringLen, 10));
      const stringMesh = new THREE.Mesh(stringGeo, drawstringCreamMat);
      stringMesh.position.set(0, -stringLen / 2, 0);
      drawstringGroup.add(stringMesh);

      const tipLen = 0.032;
      const tipGeo = this.track(new THREE.CylinderGeometry(0.013, 0.013, tipLen, 10));
      const tipMesh = new THREE.Mesh(tipGeo, zipperYellowMat);
      tipMesh.position.set(0, -stringLen - tipLen / 2 + 0.003, 0);
      drawstringGroup.add(tipMesh);

      this.torsoGroup.add(drawstringGroup);
    }

    // ==========================================
    // 3. CHAMELEON SPIRAL TAIL (Curling Upwards)
    // ==========================================
    const tailRoot = new THREE.Group();
    tailRoot.position.set(0, -0.16, -0.22);
    this.torsoGroup.add(tailRoot);

    // 6 progressive nodes curving gracefully UPWARDS and forwards in a prehensile spiral
    const tailOffsets = [
      { pos: new THREE.Vector3(0, 0, 0), r: 0.085 },
      { pos: new THREE.Vector3(0, -0.01, -0.07), r: 0.075 },
      { pos: new THREE.Vector3(0, 0.03, -0.13), r: 0.065 },
      { pos: new THREE.Vector3(0, 0.09, -0.16), r: 0.055 },
      { pos: new THREE.Vector3(0, 0.16, -0.15), r: 0.045 },
      { pos: new THREE.Vector3(0, 0.21, -0.10), r: 0.035 },
    ];

    let prevTail = tailRoot;
    for (let t = 0; t < tailOffsets.length; t++) {
      const node = tailOffsets[t];
      const seg = new THREE.Group();
      if (t > 0) {
        const prevNode = tailOffsets[t - 1];
        seg.position.copy(node.pos).sub(prevNode.pos);
      } else {
        seg.position.copy(node.pos);
      }

      const segGeo = this.track(new THREE.SphereGeometry(node.r, 16, 14));
      segGeo.scale(1.0, 0.95, 1.15);
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
    // Head pivot at y = 1.25 (balanced chibi brawler proportion)
    this.headGroup.position.set(0, 1.25, 0);
    this.modelRoot.add(this.headGroup);

    // Outer Chameleon Hood (Smooth rounded dome open at front, 36x28 segments)
    const hoodGeo = this.track(
      new THREE.SphereGeometry(
        0.28,
        36,
        28,
        Math.PI * 0.85,
        Math.PI * 1.30,
        0,
        Math.PI
      )
    );
    hoodGeo.scale(1.02, 1.04, 1.02);
    const hoodMesh = new THREE.Mesh(hoodGeo, hoodieGreenMat);
    hoodMesh.position.set(0, 0.01, -0.01);
    hoodMesh.castShadow = true;
    hoodMesh.receiveShadow = true;
    this.headGroup.add(hoodMesh);

    // 3 Cute Chameleon Ridge Spikes along Back of Hood
    for (let r = 0; r < 3; r++) {
      const spikeGeo = this.track(new THREE.ConeGeometry(0.038, 0.075, 10));
      spikeGeo.rotateX(Math.PI / 2);
      const spike = new THREE.Mesh(spikeGeo, pocketBlueMat);
      spike.position.set(0, 0.22 - r * 0.085, -0.22 - r * 0.05);
      spike.rotation.x = -0.35 - r * 0.25;
      spike.castShadow = true;
      this.headGroup.add(spike);
    }

    // Peach Head Sphere (Natural curved 3D face base)
    const headBaseGeo = this.track(new THREE.SphereGeometry(0.22, 28, 24));
    headBaseGeo.scale(1.0, 1.02, 0.90);
    const headBase = new THREE.Mesh(headBaseGeo, skinToneMat);
    headBase.position.set(0, -0.01, 0.02);
    headBase.castShadow = true;
    this.headGroup.add(headBase);

    // Dark Green Chameleon Hood Face Rim (Framing the opening)
    const hoodRimGeo = this.track(new THREE.TorusGeometry(0.20, 0.030, 18, 36));
    hoodRimGeo.scale(1.0, 1.08, 0.70);
    const hoodRim = new THREE.Mesh(hoodRimGeo, hoodTrimDarkGreenMat);
    hoodRim.position.set(0, 0.00, 0.14);
    hoodRim.castShadow = true;
    this.headGroup.add(hoodRim);

    // Curved Hood Visor / Brim over the forehead
    const visorShape = new THREE.Shape();
    visorShape.moveTo(-0.20, 0);
    visorShape.quadraticCurveTo(0, 0.13, 0.20, 0);
    visorShape.quadraticCurveTo(0, 0.06, -0.20, 0);

    const visorGeo = this.track(
      new THREE.ExtrudeGeometry(visorShape, {
        depth: 0.024,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.010,
        bevelThickness: 0.010,
      })
    );
    visorGeo.center();
    const visorMesh = new THREE.Mesh(visorGeo, hoodTrimDarkGreenMat);
    visorMesh.position.set(0, 0.13, 0.19);
    visorMesh.rotation.set(0.16, 0, 0);
    visorMesh.castShadow = true;
    this.headGroup.add(visorMesh);

    // Leon's Signature Soft Anime Hair Bangs peeking from under the visor
    const bangsGroup = new THREE.Group();
    bangsGroup.position.set(0, 0.10, 0.185);

    // 3 Natural stylized hair bangs
    const bangConfigs = [
      { x: 0.01, y: 0.00, z: 0.02, r: 0.038, len: 0.11, rotZ: 0.08, rotX: 0.24 },
      { x: -0.060, y: 0.01, z: 0.015, r: 0.032, len: 0.095, rotZ: 0.30, rotX: 0.20 },
      { x: 0.070, y: 0.01, z: 0.015, r: 0.034, len: 0.100, rotZ: -0.24, rotX: 0.22 },
    ];

    for (const b of bangConfigs) {
      const bGeo = this.track(new THREE.ConeGeometry(b.r, b.len, 14));
      bGeo.rotateZ(b.rotZ);
      bGeo.rotateX(b.rotX);
      const bMesh = new THREE.Mesh(bGeo, hairTealMat);
      bMesh.position.set(b.x, b.y, b.z);
      bMesh.castShadow = true;
      bangsGroup.add(bMesh);
    }
    this.headGroup.add(bangsGroup);

    // Expressive Cool Anime Hero Eyes (Brawl Stars confident brawler look)
    const buildExpressiveHeroEye = (xSign: number) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xSign * 0.090, 0.015, 0.206);
      eyeGroup.rotation.z = xSign * -0.08; // Confident slant

      // Crisp White Sclera
      const scleraGeo = this.track(new THREE.SphereGeometry(0.046, 20, 16));
      scleraGeo.scale(1.20, 1.05, 0.25);
      const sclera = new THREE.Mesh(scleraGeo, eyeScleraWhiteMat);
      eyeGroup.add(sclera);

      // Glowing Cyan Anime Iris
      const irisGeo = this.track(new THREE.SphereGeometry(0.032, 20, 16));
      irisGeo.scale(1.0, 1.05, 0.18);
      const iris = new THREE.Mesh(irisGeo, eyeIrisCyanMat);
      iris.position.set(xSign * -0.003, -0.002, 0.012);
      eyeGroup.add(iris);

      // Deep Midnight Pupil
      const pupilGeo = this.track(new THREE.SphereGeometry(0.019, 14, 12));
      pupilGeo.scale(1.0, 1.15, 0.18);
      const pupil = new THREE.Mesh(pupilGeo, eyePupilBlackMat);
      pupil.position.set(xSign * -0.003, -0.002, 0.016);
      eyeGroup.add(pupil);

      // Main Glossy Specular Sparkle
      const sparkleMainGeo = this.track(new THREE.CircleGeometry(0.011, 12));
      const sparkleMain = new THREE.Mesh(sparkleMainGeo, eyeHighlightWhiteMat);
      sparkleMain.position.set(xSign * 0.007, 0.012, 0.022);
      eyeGroup.add(sparkleMain);

      // Secondary Small Sparkle
      const sparkleSubGeo = this.track(new THREE.CircleGeometry(0.005, 10));
      const sparkleSub = new THREE.Mesh(sparkleSubGeo, eyeHighlightWhiteMat);
      sparkleSub.position.set(xSign * -0.008, -0.008, 0.022);
      eyeGroup.add(sparkleSub);

      // Top Eyelash / Eyelid Arc
      const lashGeo = this.track(new THREE.TorusGeometry(0.048, 0.008, 8, 16, Math.PI * 0.72));
      lashGeo.rotateZ(Math.PI * 0.14);
      const lash = new THREE.Mesh(lashGeo, eyeBrowBlackMat);
      lash.position.set(0, 0.024, 0.018);
      eyeGroup.add(lash);

      // Determined Hero Eyebrow above eye
      const browGeo = this.track(new THREE.BoxGeometry(0.062, 0.014, 0.014));
      const brow = new THREE.Mesh(browGeo, eyeBrowBlackMat);
      brow.position.set(xSign * 0.004, 0.056, 0.011);
      brow.rotation.z = xSign * 0.20;
      eyeGroup.add(brow);

      return eyeGroup;
    };

    this.headGroup.add(buildExpressiveHeroEye(-1));
    this.headGroup.add(buildExpressiveHeroEye(1));

    // Cute Anime Cheek Blush
    for (const xSign of [-1, 1]) {
      const blushGeo = this.track(new THREE.SphereGeometry(0.042, 14, 10));
      blushGeo.scale(1.25, 0.65, 0.15);
      const blush = new THREE.Mesh(blushGeo, blushPeachMat);
      blush.position.set(xSign * 0.130, -0.050, 0.198);
      this.headGroup.add(blush);
    }

    // Confident Anime Smirk Mouth
    const mouthGeo = this.track(new THREE.TorusGeometry(0.032, 0.007, 6, 14, Math.PI * 0.65));
    mouthGeo.rotateZ(Math.PI * 0.18);
    const mouth = new THREE.Mesh(mouthGeo, eyeBrowBlackMat);
    mouth.position.set(0.008, -0.075, 0.210);
    this.headGroup.add(mouth);

    // Iconic Round Candy Lollipop (Leon's Signature Chupa-Chups)
    const lollipopGroup = new THREE.Group();
    lollipopGroup.position.set(0.050, -0.070, 0.215);
    lollipopGroup.rotation.set(0.12, 0.20, -0.28);

    // Glossy Cherry Round Lollipop Sphere
    const candyGeo = this.track(new THREE.SphereGeometry(0.040, 20, 16));
    candyGeo.scale(1.0, 1.0, 0.85);
    const candyMesh = new THREE.Mesh(candyGeo, lollipopCherryMat);
    candyMesh.castShadow = true;
    lollipopGroup.add(candyMesh);

    // Lollipop Candy Swirl Accent
    const swirlGeo = this.track(new THREE.TorusGeometry(0.022, 0.005, 8, 16));
    const swirlMesh = new THREE.Mesh(swirlGeo, whiteAccentMat);
    swirlMesh.position.set(0, 0, 0.031);
    lollipopGroup.add(swirlMesh);

    // Clean White Lollipop Stick
    const stickGeo = this.track(new THREE.CylinderGeometry(0.006, 0.006, 0.11, 10));
    stickGeo.rotateZ(Math.PI / 2);
    const stickMesh = new THREE.Mesh(stickGeo, whiteAccentMat);
    stickMesh.position.set(-0.058, -0.003, 0);
    lollipopGroup.add(stickMesh);

    this.headGroup.add(lollipopGroup);

    // LARGE CHAMELEON EYES ON TOP OF HOOD (Compact, Cute, Embedded)
    const buildChamEyeTurret = (xSign: number) => {
      const turretRoot = new THREE.Group();
      turretRoot.position.set(xSign * 0.16, 0.22, 0.06);
      turretRoot.rotation.set(-0.16, xSign * 0.28, xSign * 0.18);

      // Green Turret Socket Base
      const turretGeo = this.track(new THREE.SphereGeometry(0.090, 24, 18));
      const turret = new THREE.Mesh(turretGeo, hoodieGreenMat);
      turret.castShadow = true;
      turretRoot.add(turret);

      // Vibrant Yellow Eyeball
      const eyeballGeo = this.track(new THREE.SphereGeometry(0.075, 24, 18));
      eyeballGeo.scale(1.0, 1.0, 0.70);
      const eyeball = new THREE.Mesh(eyeballGeo, chamEyeYellowMat);
      eyeball.position.set(0, 0, 0.045);
      turretRoot.add(eyeball);

      // Black Slit Pupil
      const pupilGeo = this.track(new THREE.CapsuleGeometry(0.018, 0.040, 6, 10));
      const pupil = new THREE.Mesh(pupilGeo, chamEyePupilMat);
      pupil.position.set(0, 0, 0.095);
      turretRoot.add(pupil);

      // Glossy Specular Catchlight
      const hlGeo = this.track(new THREE.SphereGeometry(0.018, 10, 10));
      const hl = new THREE.Mesh(hlGeo, chamEyeHighlightMat);
      hl.position.set(xSign * 0.018, 0.018, 0.105);
      turretRoot.add(hl);

      // Upper Sleepy / Confident Eyelid
      const lidGeo = this.track(new THREE.SphereGeometry(0.078, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.38));
      const lid = new THREE.Mesh(lidGeo, hoodieGreenMat);
      lid.position.set(0, 0, 0.045);
      lid.rotation.x = -0.22;
      turretRoot.add(lid);

      return turretRoot;
    };

    this.headGroup.add(buildChamEyeTurret(-1));
    this.headGroup.add(buildChamEyeTurret(1));

    // ==========================================
    // 5. ARMS & CARTOON HANDS (Anchored to Torso)
    // ==========================================
    const buildLeonArm = (xSign: number, pivot: THREE.Group) => {
      // Natural shoulder attachment anchored to torsoGroup!
      pivot.position.set(xSign * 0.25, 0.16, 0.00);
      this.torsoGroup.add(pivot);

      // Smooth Rounded Shoulder
      const shoulderGeo = this.track(new THREE.SphereGeometry(0.115, 24, 18));
      const shoulder = new THREE.Mesh(shoulderGeo, hoodieGreenMat);
      shoulder.castShadow = true;
      pivot.add(shoulder);

      // Upper Arm (Green hoodie sleeve)
      const upperArmGeo = this.track(new THREE.CylinderGeometry(0.100, 0.085, 0.20, 24));
      upperArmGeo.translate(0, -0.12, 0);
      const upperArm = new THREE.Mesh(upperArmGeo, hoodieGreenMat);
      upperArm.castShadow = true;
      pivot.add(upperArm);

      // Blue Sleeve Cuff
      const cuffGeo = this.track(new THREE.TorusGeometry(0.090, 0.025, 12, 24));
      cuffGeo.rotateX(Math.PI / 2);
      const cuff = new THREE.Mesh(cuffGeo, pocketBlueMat);
      cuff.position.set(0, -0.21, 0);
      cuff.castShadow = true;
      pivot.add(cuff);

      // Solid Peach Forearm / Wrist
      const wristGeo = this.track(new THREE.CylinderGeometry(0.065, 0.060, 0.13, 20));
      wristGeo.translate(0, -0.25, 0.01);
      const wrist = new THREE.Mesh(wristGeo, skinToneMat);
      wrist.castShadow = true;
      pivot.add(wrist);

      // Cartoon Hand / Fist attached directly at end of wrist
      const handGroup = new THREE.Group();
      handGroup.position.set(0, -0.32, 0.015);
      pivot.add(handGroup);

      // Rounded Cartoon Fist / Palm
      const palmGeo = this.track(new THREE.SphereGeometry(0.075, 24, 18));
      palmGeo.scale(1.0, 0.92, 0.90);
      const palm = new THREE.Mesh(palmGeo, skinToneMat);
      palm.castShadow = true;
      handGroup.add(palm);

      // Knuckle ridges for cartoon brawl glove/fist
      for (let k = 0; k < 3; k++) {
        const knuckleGeo = this.track(new THREE.CapsuleGeometry(0.018, 0.034, 6, 10));
        knuckleGeo.rotateZ(Math.PI / 2);
        const knuckle = new THREE.Mesh(knuckleGeo, skinToneMat);
        knuckle.position.set((k - 1) * 0.030, -0.028, 0.046);
        knuckle.castShadow = true;
        handGroup.add(knuckle);
      }

      // Articulated Thumb
      const thumbGeo = this.track(new THREE.CapsuleGeometry(0.028, 0.052, 6, 10));
      const thumb = new THREE.Mesh(thumbGeo, skinToneMat);
      thumb.position.set(xSign * -0.046, 0.008, 0.032);
      thumb.rotation.set(-0.25, 0, xSign * -0.55);
      thumb.castShadow = true;
      handGroup.add(thumb);
    };

    buildLeonArm(-1, this.leftArmPivot);
    buildLeonArm(1, this.rightArmPivot);

    // ==========================================
    // 6. SHORTS, LEGS & CHUNKY BRAWLER SNEAKERS
    // ==========================================
    const buildLeonLeg = (xSign: number, pivot: THREE.Group) => {
      // Hip joint anchored to modelRoot at y = 0.52
      pivot.position.set(xSign * 0.12, 0.52, 0);
      this.modelRoot.add(pivot);

      // Dark Indigo Shorts
      const shortGeo = this.track(new THREE.CylinderGeometry(0.125, 0.115, 0.16, 24));
      shortGeo.translate(0, -0.08, 0);
      const shorts = new THREE.Mesh(shortGeo, shortsIndigoMat);
      shorts.castShadow = true;
      pivot.add(shorts);

      // Exposed Peach Leg
      const legGeo = this.track(new THREE.CylinderGeometry(0.078, 0.072, 0.16, 24));
      legGeo.translate(0, -0.19, 0);
      const leg = new THREE.Mesh(legGeo, skinToneMat);
      leg.castShadow = true;
      pivot.add(leg);

      // CHUNKY BRAWL SNEAKER
      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(0, -0.27, 0.02);
      pivot.add(shoeGroup);

      // Thick White Molded Rubber Sole (Height 0.05, resting flush at world y = 0.00!)
      // Pivot at y = 0.52, shoeGroup at y = -0.27 -> local y = 0.25.
      // Sole bottom at y = -0.25 -> world y = 0.00!
      const soleGeo = this.track(new THREE.BoxGeometry(0.18, 0.05, 0.26));
      soleGeo.translate(0, -0.225, 0.03);
      const sole = new THREE.Mesh(soleGeo, sneakerWhiteMat);
      sole.castShadow = true;
      shoeGroup.add(sole);

      // Sole Dark Stripe
      const stripeGeo = this.track(new THREE.BoxGeometry(0.185, 0.012, 0.24));
      stripeGeo.translate(0, -0.225, 0.03);
      const stripe = new THREE.Mesh(stripeGeo, sneakerStripeMat);
      shoeGroup.add(stripe);

      // Crimson Red Sneaker Body
      const upperGeo = this.track(new THREE.CapsuleGeometry(0.085, 0.13, 10, 24));
      upperGeo.rotateX(Math.PI / 2);
      upperGeo.translate(0, -0.15, 0.03);
      const upper = new THREE.Mesh(upperGeo, sneakerRedMat);
      upper.castShadow = true;
      shoeGroup.add(upper);

      // Rounded White Rubber Shell-Toe
      const toeCapGeo = this.track(new THREE.SphereGeometry(0.095, 24, 14, 0, Math.PI, 0, Math.PI * 0.55));
      toeCapGeo.rotateX(Math.PI / 2);
      const toeCap = new THREE.Mesh(toeCapGeo, sneakerWhiteMat);
      toeCap.position.set(0, -0.17, 0.12);
      toeCap.scale.set(0.95, 0.72, 0.85);
      toeCap.castShadow = true;
      shoeGroup.add(toeCap);

      // Sneaker Tongue & Laces
      const tongueGeo = this.track(new THREE.BoxGeometry(0.08, 0.10, 0.028));
      const tongue = new THREE.Mesh(tongueGeo, sneakerWhiteMat);
      tongue.position.set(0, -0.09, 0.10);
      tongue.rotation.x = -0.32;
      shoeGroup.add(tongue);

      for (let l = 0; l < 3; l++) {
        const laceGeo = this.track(new THREE.BoxGeometry(0.09, 0.014, 0.028));
        const lace = new THREE.Mesh(laceGeo, sneakerWhiteMat);
        lace.position.set(0, -0.12 + l * 0.030, 0.06 + l * 0.016);
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
    // 1. SOLID PROPORTION SCALE
    // ==========================================
    let targetScaleY = 1.0;
    if (isGrounded && jumpSquash > 0) {
      targetScaleY = Math.max(0.94, 1.0 - jumpSquash * 0.25);
    }
    this.modelRoot.scale.set(1.0, targetScaleY, 1.0);

    // ==========================================
    // 2. DYNAMIC BANKING & LEAN
    // ==========================================
    const targetBank = THREE.MathUtils.clamp(-turnRate * 0.065, -0.34, 0.34);
    this.currentBankAngle += (targetBank - this.currentBankAngle) * Math.min(1, 16 * dt);
    this.modelRoot.rotation.z = this.currentBankAngle;

    const targetLean = isGrounded ? Math.min(0.32, speed * 0.032) : 0.08;
    this.currentForwardLean += (targetLean - this.currentForwardLean) * Math.min(1, 14 * dt);
    this.modelRoot.rotation.x = this.currentForwardLean;

    // ==========================================
    // 3. ANIMATION STATES (Airborne Jump, Run Stride, Idle)
    // ==========================================
    if (!isGrounded) {
      // Airborne Jump Pose
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

      this.torsoGroup.position.y = 0.78;
      this.headGroup.position.y = 1.25;
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

      const bounce = Math.abs(cosStride) * 0.05;
      this.torsoGroup.position.y = 0.78 + bounce;
      this.headGroup.position.y = 1.25 + bounce;
      this.torsoGroup.rotation.y = sinStride * 0.12;
      this.headGroup.rotation.y = -sinStride * 0.04;
    } else {
      // Idle Breathing Pose
      this.walkCycleTime = 0;

      const breathe = Math.sin(this.idleTime * 2.8) * 0.015;
      this.torsoGroup.position.y = 0.78 + breathe;
      this.headGroup.position.y = 1.25 + breathe;

      this.leftLegPivot.rotation.x *= Math.max(0, 1 - 16 * dt);
      this.rightLegPivot.rotation.x *= Math.max(0, 1 - 16 * dt);
      this.leftArmPivot.rotation.x *= Math.max(0, 1 - 16 * dt);
      this.rightArmPivot.rotation.x *= Math.max(0, 1 - 16 * dt);
      this.leftArmPivot.rotation.z = -0.10 + breathe * 0.5;
      this.rightArmPivot.rotation.z = 0.10 - breathe * 0.5;
      this.torsoGroup.rotation.y *= Math.max(0, 1 - 16 * dt);
      this.headGroup.rotation.y *= Math.max(0, 1 - 16 * dt);
    }

    // ==========================================
    // 4. CHAMELEON TAIL PHYSICS
    // ==========================================
    const tailSpeed = Math.min(1.0, speed * 0.12);
    const tailWave = Math.sin(this.idleTime * 3.0 + speed * 2.0) * (0.06 + speed * 0.04);

    for (let s = 0; s < this.tailSegments.length; s++) {
      const seg = this.tailSegments[s];
      const targetRotX = THREE.MathUtils.clamp(-0.1 + tailSpeed * 0.2 + tailWave * 0.5, -0.3, 0.4);
      seg.rotation.x += (targetRotX - seg.rotation.x) * Math.min(1, 14 * dt);

      const targetRotY = -this.currentBankAngle * (s + 1) * 0.25;
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
