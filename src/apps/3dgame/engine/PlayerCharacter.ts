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
 * AAA-Quality "Verdinho" Leon Brawler Model (Brawl Stars / Chibi Style)
 * - Sculpted Emerald Chameleon Hoodie with iconic embedded chameleon eye turrets on top
 * - Seamless padded cowl / collar roll bridging torso to head with ZERO gaps
 * - Expressive anime hero face filling the hood aperture cleanly (large cyan eyes, twin catchlights, determined brows, cute blush)
 * - Clean curved cap visor (NO jagged teeth!) with layered teal bangs peeking underneath
 * - Iconic sweet strawberry-red lollipop protruding naturally from his smirk
 * - Smooth, high-subdivision geometries (32-48 segments) for perfectly rounded silhouettes without faceting
 * - Oversized royal blue kangaroo pouch, golden zipper with puller tab (zero collision/overlap)
 * - Arms attached directly to torso so shoulders never detach or tear
 * - Prehensile chameleon tail curling UPWARDS in a cute spiral behind him
 * - Chunky red brawler sneakers with rounded shell toe and white rubber soles resting flush on the ground
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
    this.modelRoot.position.y = 0; // Feet sit flush on ground at world y = 0
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
    // Torso centered at y = 0.86
    this.torsoGroup.position.set(0, 0.86, 0);
    this.modelRoot.add(this.torsoGroup);

    // LatheGeometry for torso with 36 segments (buttery smooth and round)
    const torsoPoints: THREE.Vector2[] = [
      new THREE.Vector2(0.01, -0.32),
      new THREE.Vector2(0.30, -0.32), // Hem
      new THREE.Vector2(0.32, -0.20), // Hip
      new THREE.Vector2(0.31, -0.06), // Waist
      new THREE.Vector2(0.35, 0.12),  // Chest expansion
      new THREE.Vector2(0.37, 0.22),  // Upper chest
      new THREE.Vector2(0.31, 0.32),  // Shoulder taper
      new THREE.Vector2(0.19, 0.36),  // Collar base
      new THREE.Vector2(0.01, 0.36),
    ];
    const torsoGeo = this.track(new THREE.LatheGeometry(torsoPoints, 36));
    torsoGeo.scale(1.0, 1.0, 0.92);
    const torsoMesh = new THREE.Mesh(torsoGeo, hoodieGreenMat);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    this.torsoGroup.add(torsoMesh);

    // PADDED HOODIE COWL / COLLAR ROLL (Bridging Torso seamlessly into the Head - ZERO GAPS)
    const cowlGeo = this.track(new THREE.TorusGeometry(0.21, 0.055, 20, 36));
    cowlGeo.scale(1.0, 0.85, 0.95);
    const cowlMesh = new THREE.Mesh(cowlGeo, hoodieGreenMat);
    cowlMesh.position.set(0, 0.35, 0.02);
    cowlMesh.rotation.x = Math.PI / 2 - 0.15;
    cowlMesh.castShadow = true;
    this.torsoGroup.add(cowlMesh);

    // Inner neck cylinder to prevent any hollow hole
    const neckInnerGeo = this.track(new THREE.CylinderGeometry(0.17, 0.18, 0.20, 32));
    const neckInnerMesh = new THREE.Mesh(neckInnerGeo, hoodieGreenMat);
    neckInnerMesh.position.set(0, 0.40, 0.01);
    this.torsoGroup.add(neckInnerMesh);

    // Royal Blue Kangaroo Front Pouch Pocket (Smooth curved shell)
    const pouchGeo = this.track(new THREE.CylinderGeometry(0.315, 0.335, 0.22, 28, 1, false, -0.80, 1.60));
    pouchGeo.scale(1.03, 1.0, 0.95);
    const pouchMesh = new THREE.Mesh(pouchGeo, pocketBlueMat);
    pouchMesh.position.set(0, -0.16, 0.035);
    pouchMesh.castShadow = true;
    this.torsoGroup.add(pouchMesh);

    // Golden Front Zipper Line (Stops precisely at top of pocket! Zero overlap!)
    const zipperGeo = this.track(new THREE.BoxGeometry(0.040, 0.38, 0.025));
    const zipperMesh = new THREE.Mesh(zipperGeo, zipperYellowMat);
    zipperMesh.position.set(0, 0.15, 0.32);
    zipperMesh.castShadow = true;
    this.torsoGroup.add(zipperMesh);

    // Golden Zipper Pull Tab
    const pullerGeo = this.track(new THREE.BoxGeometry(0.055, 0.075, 0.035));
    const pullerMesh = new THREE.Mesh(pullerGeo, zipperYellowMat);
    pullerMesh.position.set(0, 0.28, 0.335);
    this.torsoGroup.add(pullerMesh);

    // Cream Hoodie Drawstrings with Golden Tips (accurately connected)
    for (const xSign of [-1, 1]) {
      const drawstringGroup = new THREE.Group();
      drawstringGroup.position.set(xSign * 0.095, 0.27, 0.30);
      drawstringGroup.rotation.z = xSign * -0.06;

      const stringLen = 0.18;
      const stringGeo = this.track(new THREE.CylinderGeometry(0.010, 0.010, stringLen, 12));
      const stringMesh = new THREE.Mesh(stringGeo, drawstringCreamMat);
      stringMesh.position.set(0, -stringLen / 2, 0);
      drawstringGroup.add(stringMesh);

      const tipLen = 0.040;
      const tipGeo = this.track(new THREE.CylinderGeometry(0.016, 0.016, tipLen, 12));
      const tipMesh = new THREE.Mesh(tipGeo, zipperYellowMat);
      tipMesh.position.set(0, -stringLen - tipLen / 2 + 0.003, 0);
      drawstringGroup.add(tipMesh);

      this.torsoGroup.add(drawstringGroup);
    }

    // ==========================================
    // 3. CHAMELEON SPIRAL TAIL (Curling Upwards)
    // ==========================================
    const tailRoot = new THREE.Group();
    tailRoot.position.set(0, -0.20, -0.28);
    this.torsoGroup.add(tailRoot);

    // 6 progressive nodes curving gracefully UPWARDS and forwards in a prehensile spiral
    const tailOffsets = [
      { pos: new THREE.Vector3(0, 0, 0), r: 0.11 },
      { pos: new THREE.Vector3(0, -0.02, -0.10), r: 0.095 },
      { pos: new THREE.Vector3(0, 0.03, -0.18), r: 0.082 },
      { pos: new THREE.Vector3(0, 0.11, -0.23), r: 0.070 },
      { pos: new THREE.Vector3(0, 0.20, -0.22), r: 0.058 },
      { pos: new THREE.Vector3(0, 0.26, -0.15), r: 0.046 },
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

      const segGeo = this.track(new THREE.SphereGeometry(node.r, 20, 16));
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
    // Head pivot at y = 1.36 (enveloping the cowl at y = 1.21 cleanly with zero gaps)
    this.headGroup.position.set(0, 1.36, 0);
    this.modelRoot.add(this.headGroup);

    // Outer Chameleon Hood (Smooth rounded dome open at front, 48x36 segments)
    const hoodGeo = this.track(
      new THREE.SphereGeometry(
        0.40,
        48,
        36,
        Math.PI * 0.85,
        Math.PI * 1.30,
        0,
        Math.PI
      )
    );
    hoodGeo.scale(1.04, 1.00, 1.06);
    const hoodMesh = new THREE.Mesh(hoodGeo, hoodieGreenMat);
    hoodMesh.position.set(0, 0.02, -0.02);
    hoodMesh.castShadow = true;
    hoodMesh.receiveShadow = true;
    this.headGroup.add(hoodMesh);

    // 3 Cute Chameleon Ridge Spikes along Back of Hood
    for (let r = 0; r < 3; r++) {
      const spikeGeo = this.track(new THREE.ConeGeometry(0.048, 0.10, 12));
      spikeGeo.rotateX(Math.PI / 2);
      const spike = new THREE.Mesh(spikeGeo, pocketBlueMat);
      spike.position.set(0, 0.32 - r * 0.12, -0.30 - r * 0.07);
      spike.rotation.x = -0.35 - r * 0.25;
      spike.castShadow = true;
      this.headGroup.add(spike);
    }

    // Peach Head Sphere
    const headBaseGeo = this.track(new THREE.SphereGeometry(0.28, 36, 30));
    headBaseGeo.scale(1.0, 1.02, 0.95);
    const headBase = new THREE.Mesh(headBaseGeo, skinToneMat);
    headBase.position.set(0, -0.02, 0.02);
    headBase.castShadow = true;
    this.headGroup.add(headBase);

    // Dark Green Chameleon Hood Face Rim (Framing the opening)
    const hoodRimGeo = this.track(new THREE.TorusGeometry(0.27, 0.040, 24, 48));
    hoodRimGeo.scale(1.0, 1.05, 0.65);
    const hoodRim = new THREE.Mesh(hoodRimGeo, hoodTrimDarkGreenMat);
    hoodRim.position.set(0, 0.01, 0.19);
    hoodRim.castShadow = true;
    this.headGroup.add(hoodRim);

    // Curved Hood Visor / Brim over the forehead (NO SHARK TEETH!)
    const visorShape = new THREE.Shape();
    visorShape.moveTo(-0.25, 0);
    visorShape.quadraticCurveTo(0, 0.16, 0.25, 0);
    visorShape.quadraticCurveTo(0, 0.08, -0.25, 0);

    const visorGeo = this.track(
      new THREE.ExtrudeGeometry(visorShape, {
        depth: 0.030,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.012,
        bevelThickness: 0.012,
      })
    );
    visorGeo.center();
    const visorMesh = new THREE.Mesh(visorGeo, hoodTrimDarkGreenMat);
    visorMesh.position.set(0, 0.18, 0.26);
    visorMesh.rotation.set(0.18, 0, 0);
    visorMesh.castShadow = true;
    this.headGroup.add(visorMesh);

    // Leon's Signature Vibrant Anime Hair Bangs peeking from under the visor
    const bangsGroup = new THREE.Group();
    bangsGroup.position.set(0, 0.13, 0.25);

    // 5 Layered stylized hair clumps (curved, soft, natural)
    const bangConfigs = [
      { x: 0.01, y: 0.00, z: 0.03, r: 0.042, len: 0.13, rotZ: 0.10, rotX: 0.25 },
      { x: -0.070, y: 0.01, z: 0.02, r: 0.036, len: 0.11, rotZ: 0.32, rotX: 0.20 },
      { x: 0.080, y: 0.01, z: 0.02, r: 0.038, len: 0.115, rotZ: -0.24, rotX: 0.22 },
      { x: -0.135, y: 0.02, z: 0.01, r: 0.030, len: 0.09, rotZ: 0.48, rotX: 0.15 },
      { x: 0.140, y: 0.02, z: 0.01, r: 0.030, len: 0.09, rotZ: -0.42, rotX: 0.16 },
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

    // Expressive Anime Hero Eyes (Large, vibrant, friendly)
    const buildExpressiveHeroEye = (xSign: number) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xSign * 0.11, 0.025, 0.275);
      eyeGroup.rotation.z = xSign * -0.08;

      // Crisp White Sclera
      const scleraGeo = this.track(new THREE.SphereGeometry(0.055, 24, 20));
      scleraGeo.scale(1.15, 0.95, 0.25);
      const sclera = new THREE.Mesh(scleraGeo, eyeScleraWhiteMat);
      eyeGroup.add(sclera);

      // Glowing Cyan Anime Iris
      const irisGeo = this.track(new THREE.SphereGeometry(0.038, 24, 20));
      irisGeo.scale(1.0, 1.05, 0.18);
      const iris = new THREE.Mesh(irisGeo, eyeIrisCyanMat);
      iris.position.set(xSign * -0.004, -0.002, 0.014);
      eyeGroup.add(iris);

      // Deep Midnight Pupil
      const pupilGeo = this.track(new THREE.SphereGeometry(0.022, 16, 14));
      pupilGeo.scale(1.0, 1.15, 0.18);
      const pupil = new THREE.Mesh(pupilGeo, eyePupilBlackMat);
      pupil.position.set(xSign * -0.004, -0.002, 0.019);
      eyeGroup.add(pupil);

      // Main Glossy Specular Sparkle
      const sparkleMainGeo = this.track(new THREE.CircleGeometry(0.012, 14));
      const sparkleMain = new THREE.Mesh(sparkleMainGeo, eyeHighlightWhiteMat);
      sparkleMain.position.set(xSign * 0.008, 0.014, 0.025);
      eyeGroup.add(sparkleMain);

      // Secondary Sparkle
      const sparkleSubGeo = this.track(new THREE.CircleGeometry(0.006, 10));
      const sparkleSub = new THREE.Mesh(sparkleSubGeo, eyeHighlightWhiteMat);
      sparkleSub.position.set(xSign * -0.010, -0.010, 0.025);
      eyeGroup.add(sparkleSub);

      // Top Eyelash / Eyelid Arc with anime flick
      const lashGeo = this.track(new THREE.TorusGeometry(0.055, 0.009, 10, 20, Math.PI * 0.75));
      lashGeo.rotateZ(Math.PI * 0.12);
      const lash = new THREE.Mesh(lashGeo, eyeBrowBlackMat);
      lash.position.set(0, 0.028, 0.020);
      eyeGroup.add(lash);

      // Determined Hero Eyebrow above eye
      const browGeo = this.track(new THREE.BoxGeometry(0.075, 0.016, 0.016));
      const brow = new THREE.Mesh(browGeo, eyeBrowBlackMat);
      brow.position.set(xSign * 0.005, 0.068, 0.012);
      brow.rotation.z = xSign * 0.20;
      eyeGroup.add(brow);

      return eyeGroup;
    };

    this.headGroup.add(buildExpressiveHeroEye(-1));
    this.headGroup.add(buildExpressiveHeroEye(1));

    // Cute Anime Cheek Blush
    for (const xSign of [-1, 1]) {
      const blushGeo = this.track(new THREE.SphereGeometry(0.048, 16, 12));
      blushGeo.scale(1.25, 0.65, 0.15);
      const blush = new THREE.Mesh(blushGeo, blushPeachMat);
      blush.position.set(xSign * 0.16, -0.065, 0.265);
      this.headGroup.add(blush);
    }

    // Confident Anime Smirk Mouth
    const mouthGeo = this.track(new THREE.TorusGeometry(0.038, 0.007, 8, 16, Math.PI * 0.65));
    mouthGeo.rotateZ(Math.PI * 0.18);
    const mouth = new THREE.Mesh(mouthGeo, eyeBrowBlackMat);
    mouth.position.set(0.01, -0.095, 0.280);
    this.headGroup.add(mouth);

    // Iconic Round Candy Lollipop (Leon's Signature Chupa-Chups)
    const lollipopGroup = new THREE.Group();
    lollipopGroup.position.set(0.060, -0.090, 0.285);
    lollipopGroup.rotation.set(0.12, 0.20, -0.28);

    // Glossy Cherry Round Lollipop Sphere (Smooth 24x20 segments)
    const candyGeo = this.track(new THREE.SphereGeometry(0.042, 24, 20));
    candyGeo.scale(1.0, 1.0, 0.85);
    const candyMesh = new THREE.Mesh(candyGeo, lollipopCherryMat);
    candyMesh.castShadow = true;
    lollipopGroup.add(candyMesh);

    // Lollipop Candy Swirl Accent
    const swirlGeo = this.track(new THREE.TorusGeometry(0.024, 0.005, 10, 20));
    const swirlMesh = new THREE.Mesh(swirlGeo, whiteAccentMat);
    swirlMesh.position.set(0, 0, 0.032);
    lollipopGroup.add(swirlMesh);

    // Clean White Lollipop Stick
    const stickGeo = this.track(new THREE.CylinderGeometry(0.006, 0.006, 0.13, 12));
    stickGeo.rotateZ(Math.PI / 2);
    const stickMesh = new THREE.Mesh(stickGeo, whiteAccentMat);
    stickMesh.position.set(-0.065, -0.004, 0);
    lollipopGroup.add(stickMesh);

    this.headGroup.add(lollipopGroup);

    // LARGE CHAMELEON EYES ON TOP OF HOOD (Compact, Smooth, Embedded)
    const buildChamEyeTurret = (xSign: number) => {
      const turretRoot = new THREE.Group();
      turretRoot.position.set(xSign * 0.22, 0.28, 0.10);
      turretRoot.rotation.set(-0.16, xSign * 0.28, xSign * 0.18);

      // Green Turret Socket Base (Smooth 32 segments)
      const turretGeo = this.track(new THREE.SphereGeometry(0.125, 32, 24));
      const turret = new THREE.Mesh(turretGeo, hoodieGreenMat);
      turret.castShadow = true;
      turretRoot.add(turret);

      // Vibrant Yellow Eyeball (Smooth 32 segments)
      const eyeballGeo = this.track(new THREE.SphereGeometry(0.105, 32, 24));
      eyeballGeo.scale(1.0, 1.0, 0.70);
      const eyeball = new THREE.Mesh(eyeballGeo, chamEyeYellowMat);
      eyeball.position.set(0, 0, 0.065);
      turretRoot.add(eyeball);

      // Black Slit Pupil
      const pupilGeo = this.track(new THREE.CapsuleGeometry(0.024, 0.055, 8, 12));
      const pupil = new THREE.Mesh(pupilGeo, chamEyePupilMat);
      pupil.position.set(0, 0, 0.135);
      turretRoot.add(pupil);

      // Glossy Specular Catchlight
      const hlGeo = this.track(new THREE.SphereGeometry(0.024, 14, 14));
      const hl = new THREE.Mesh(hlGeo, chamEyeHighlightMat);
      hl.position.set(xSign * 0.025, 0.025, 0.145);
      turretRoot.add(hl);

      // Upper Sleepy / Confident Eyelid (covers top 35% of eyeball)
      const lidGeo = this.track(new THREE.SphereGeometry(0.108, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.38));
      const lid = new THREE.Mesh(lidGeo, hoodieGreenMat);
      lid.position.set(0, 0, 0.065);
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
      pivot.position.set(xSign * 0.31, 0.22, 0.00);
      this.torsoGroup.add(pivot);

      // Smooth Rounded Shoulder (32 segments)
      const shoulderGeo = this.track(new THREE.SphereGeometry(0.145, 32, 24));
      const shoulder = new THREE.Mesh(shoulderGeo, hoodieGreenMat);
      shoulder.castShadow = true;
      pivot.add(shoulder);

      // Upper Arm (Green hoodie sleeve, 32 segments)
      const upperArmGeo = this.track(new THREE.CylinderGeometry(0.130, 0.110, 0.25, 32));
      upperArmGeo.translate(0, -0.15, 0);
      const upperArm = new THREE.Mesh(upperArmGeo, hoodieGreenMat);
      upperArm.castShadow = true;
      pivot.add(upperArm);

      // Blue Sleeve Cuff (24 segments)
      const cuffGeo = this.track(new THREE.TorusGeometry(0.115, 0.032, 16, 28));
      cuffGeo.rotateX(Math.PI / 2);
      const cuff = new THREE.Mesh(cuffGeo, pocketBlueMat);
      cuff.position.set(0, -0.27, 0);
      cuff.castShadow = true;
      pivot.add(cuff);

      // Solid Peach Forearm / Wrist (bridges sleeve cuff directly into hand with zero gap)
      const wristGeo = this.track(new THREE.CylinderGeometry(0.082, 0.075, 0.16, 24));
      wristGeo.translate(0, -0.32, 0.01);
      const wrist = new THREE.Mesh(wristGeo, skinToneMat);
      wrist.castShadow = true;
      pivot.add(wrist);

      // Cartoon Hand / Fist attached directly at end of wrist
      const handGroup = new THREE.Group();
      handGroup.position.set(0, -0.40, 0.015);
      pivot.add(handGroup);

      // Rounded Cartoon Fist / Palm (32 segments)
      const palmGeo = this.track(new THREE.SphereGeometry(0.095, 32, 24));
      palmGeo.scale(1.0, 0.92, 0.90);
      const palm = new THREE.Mesh(palmGeo, skinToneMat);
      palm.castShadow = true;
      handGroup.add(palm);

      // Knuckle ridges for cartoon brawl glove/fist
      for (let k = 0; k < 3; k++) {
        const knuckleGeo = this.track(new THREE.CapsuleGeometry(0.022, 0.042, 8, 12));
        knuckleGeo.rotateZ(Math.PI / 2);
        const knuckle = new THREE.Mesh(knuckleGeo, skinToneMat);
        knuckle.position.set((k - 1) * 0.038, -0.035, 0.058);
        knuckle.castShadow = true;
        handGroup.add(knuckle);
      }

      // Articulated Thumb
      const thumbGeo = this.track(new THREE.CapsuleGeometry(0.034, 0.065, 8, 12));
      const thumb = new THREE.Mesh(thumbGeo, skinToneMat);
      thumb.position.set(xSign * -0.058, 0.010, 0.040);
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
      // Hip joint anchored to modelRoot at y = 0.58
      pivot.position.set(xSign * 0.15, 0.58, 0);
      this.modelRoot.add(pivot);

      // Dark Indigo Shorts (32 segments)
      const shortGeo = this.track(new THREE.CylinderGeometry(0.155, 0.140, 0.20, 32));
      shortGeo.translate(0, -0.10, 0);
      const shorts = new THREE.Mesh(shortGeo, shortsIndigoMat);
      shorts.castShadow = true;
      pivot.add(shorts);

      // Exposed Peach Leg (32 segments)
      const legGeo = this.track(new THREE.CylinderGeometry(0.098, 0.090, 0.18, 32));
      legGeo.translate(0, -0.24, 0);
      const leg = new THREE.Mesh(legGeo, skinToneMat);
      leg.castShadow = true;
      pivot.add(leg);

      // CHUNKY BRAWL SNEAKER
      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(0, -0.34, 0.03);
      pivot.add(shoeGroup);

      // Thick White Molded Rubber Sole (Height 0.06, sitting flush at world y = 0.00!)
      const soleGeo = this.track(new THREE.BoxGeometry(0.22, 0.06, 0.32));
      soleGeo.translate(0, -0.21, 0.04);
      const sole = new THREE.Mesh(soleGeo, sneakerWhiteMat);
      sole.castShadow = true;
      shoeGroup.add(sole);

      // Sole Dark Stripe
      const stripeGeo = this.track(new THREE.BoxGeometry(0.225, 0.014, 0.30));
      stripeGeo.translate(0, -0.21, 0.04);
      const stripe = new THREE.Mesh(stripeGeo, sneakerStripeMat);
      shoeGroup.add(stripe);

      // Crimson Red Sneaker Body (Rounded capsule, 32 segments)
      const upperGeo = this.track(new THREE.CapsuleGeometry(0.105, 0.16, 12, 32));
      upperGeo.rotateX(Math.PI / 2);
      upperGeo.translate(0, -0.12, 0.04);
      const upper = new THREE.Mesh(upperGeo, sneakerRedMat);
      upper.castShadow = true;
      shoeGroup.add(upper);

      // Rounded White Rubber Toe Cap (Smooth 32 segments)
      const toeCapGeo = this.track(new THREE.SphereGeometry(0.115, 32, 16, 0, Math.PI, 0, Math.PI * 0.55));
      toeCapGeo.rotateX(Math.PI / 2);
      const toeCap = new THREE.Mesh(toeCapGeo, sneakerWhiteMat);
      toeCap.position.set(0, -0.14, 0.15);
      toeCap.scale.set(0.95, 0.72, 0.85);
      toeCap.castShadow = true;
      shoeGroup.add(toeCap);

      // Sneaker Tongue & Laces
      const tongueGeo = this.track(new THREE.BoxGeometry(0.10, 0.12, 0.035));
      const tongue = new THREE.Mesh(tongueGeo, sneakerWhiteMat);
      tongue.position.set(0, -0.05, 0.12);
      tongue.rotation.x = -0.32;
      shoeGroup.add(tongue);

      for (let l = 0; l < 3; l++) {
        const laceGeo = this.track(new THREE.BoxGeometry(0.11, 0.018, 0.035));
        const lace = new THREE.Mesh(laceGeo, sneakerWhiteMat);
        lace.position.set(0, -0.08 + l * 0.038, 0.08 + l * 0.020);
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
    // 3. ANIMATION STATES (Airborne Jump, Run Stride, Idle)
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
      this.headGroup.position.y = 1.36;
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

      const bounce = Math.abs(cosStride) * 0.06;
      this.torsoGroup.position.y = 0.86 + bounce;
      this.headGroup.position.y = 1.36 + bounce;
      this.torsoGroup.rotation.y = sinStride * 0.12;
      this.headGroup.rotation.y = -sinStride * 0.04;
    } else {
      // Idle Breathing Pose
      this.walkCycleTime = 0;

      const breathe = Math.sin(this.idleTime * 2.8) * 0.018;
      this.torsoGroup.position.y = 0.86 + breathe;
      this.headGroup.position.y = 1.36 + breathe;

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
    // 4. CHAMELEON TAIL PHYSICS (Gentle organic upward sway)
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
