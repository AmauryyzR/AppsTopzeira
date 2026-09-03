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
 * Authentic Professional Leon Character Model (Brawl Stars Chibi Aesthetic)
 * 
 * MATHEMATICAL RIGGING & CONNECTION SPECIFICATION:
 * - World Ground Plane: Y = 0.000
 * - Feet & Shoes: Sits from Y = 0.000 to Y = 0.155 (Sole: Y = 0.000 to 0.045, Upper: Y = 0.045 to 0.155)
 * - Leg Insertion: Leg cylinder spans Y = 0.105 to Y = 0.380. Enters 5.0cm INSIDE the shoe collar (Y = 0.155). ZERO GAP.
 * - Bermuda Shorts: Spans Y = 0.270 to Y = 0.490. Overlaps leg by 11.0cm. Pelvis at Y = 0.490.
 * - Torso: Spans Y = 0.470 to Y = 0.990. Hem at Y = 0.470 overlaps shorts by 2.0cm.
 * - Padded Collar / Cowl: Torus centered at Y = 0.990, spans Y = 0.940 to Y = 1.060, reaches Z = +0.250.
 * - Head & Hood: Pivot at Y = 1.160. Hood base reaches Y = 0.900 (penetrates 9.0cm inside torso collar). ZERO GAP.
 * - Drawstrings: Rooted at eyelets (Y = 0.950, Z = 0.180), draped forward at Z = 0.270 over chest (Z_chest = 0.245). NEVER penetrates chest.
 * - Arms: Anchored to torso at Y = 0.910. Sleeves end at blue cuffs. Forearms emerge from inside cuffs.
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

  // Chameleon Tail at back
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
    this.modelRoot.position.y = 0; // Feet sit flush on ground plane at world y = 0.000
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
        color: 0x059669, // Forest green hood rim & visor trim
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
        color: 0x2563eb, // Royal Blue Kangaroo Pouch & Cuffs
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
        color: 0xffdfc2, // Warm peach skin
        gradientBands: 4,
        rimColor: 0xffedd5,
        rimPower: 3.2,
        rimIntensity: 0.50,
        shadowColor: 0xc2785c,
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
        color: 0xffffff, // White Sole & Rubber Shell-Toe
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
        color: 0xe11d48, // Glossy cherry red lollipop
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

    // Eye Turret Materials
    const chamEyeYellowMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
    const chamEyePupilMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    const chamEyeHighlightMat = this.trackMat(new THREE.MeshBasicMaterial({ color: 0xffffff }));

    // Face Materials
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
    // 2. TORSO & HOODIE BODY (World Y = 0.470 to Y = 0.990)
    // ==========================================
    // Torso centered at y = 0.730
    this.torsoGroup.position.set(0, 0.730, 0);
    this.modelRoot.add(this.torsoGroup);

    // Torso LatheGeometry: spans local y = -0.260 to y = +0.260 (World Y: 0.470 to 0.990)
    const torsoPoints: THREE.Vector2[] = [
      new THREE.Vector2(0.01, -0.26),
      new THREE.Vector2(0.23, -0.26), // Hem (overlaps shorts)
      new THREE.Vector2(0.25, -0.16), // Hip
      new THREE.Vector2(0.24, -0.05), // Waist
      new THREE.Vector2(0.27, 0.10),  // Chest expansion (z_max ~ 0.25)
      new THREE.Vector2(0.28, 0.18),  // Upper chest
      new THREE.Vector2(0.24, 0.23),  // Shoulder taper
      new THREE.Vector2(0.16, 0.26),  // Collar base
      new THREE.Vector2(0.01, 0.26),
    ];
    const torsoGeo = this.track(new THREE.LatheGeometry(torsoPoints, 48));
    torsoGeo.scale(1.0, 1.0, 0.92);
    const torsoMesh = new THREE.Mesh(torsoGeo, hoodieGreenMat);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    this.torsoGroup.add(torsoMesh);

    // PADDED HOODIE COWL / COLLAR ROLL (Bridging Torso seamlessly into Head in 360°)
    // Local y = 0.260 (World Y = 0.990). Torus radius 0.170, tube 0.048.
    // Extends from local y = 0.210 to 0.310 (World Y = 0.940 to 1.040).
    // Extends forward in Z to +0.225, wrapping directly under the chin!
    const cowlGeo = this.track(new THREE.TorusGeometry(0.170, 0.048, 24, 48));
    cowlGeo.scale(1.0, 0.85, 1.05);
    const cowlMesh = new THREE.Mesh(cowlGeo, hoodieGreenMat);
    cowlMesh.position.set(0, 0.260, 0.025);
    cowlMesh.rotation.x = Math.PI / 2 - 0.14;
    cowlMesh.castShadow = true;
    this.torsoGroup.add(cowlMesh);

    // Inner neck cylinder to guarantee zero hollow void
    const neckInnerGeo = this.track(new THREE.CylinderGeometry(0.145, 0.155, 0.20, 28));
    const neckInnerMesh = new THREE.Mesh(neckInnerGeo, hoodieGreenMat);
    neckInnerMesh.position.set(0, 0.280, 0.015);
    this.torsoGroup.add(neckInnerMesh);

    // Royal Blue Kangaroo Front Pouch Pocket
    const pouchGeo = this.track(new THREE.CylinderGeometry(0.245, 0.260, 0.16, 24, 1, false, -0.80, 1.60));
    pouchGeo.scale(1.03, 1.0, 0.95);
    const pouchMesh = new THREE.Mesh(pouchGeo, pocketBlueMat);
    pouchMesh.position.set(0, -0.12, 0.03);
    pouchMesh.castShadow = true;
    this.torsoGroup.add(pouchMesh);

    // Golden Front Zipper Line (Starts strictly at top of pocket at y = -0.04 up to collar at y = 0.25)
    const zipperGeo = this.track(new THREE.BoxGeometry(0.030, 0.28, 0.020));
    const zipperMesh = new THREE.Mesh(zipperGeo, zipperYellowMat);
    zipperMesh.position.set(0, 0.11, 0.255);
    zipperMesh.castShadow = true;
    this.torsoGroup.add(zipperMesh);

    // Golden Zipper Pull Tab
    const pullerGeo = this.track(new THREE.BoxGeometry(0.042, 0.055, 0.025));
    const pullerMesh = new THREE.Mesh(pullerGeo, zipperYellowMat);
    pullerMesh.position.set(0, 0.19, 0.270);
    this.torsoGroup.add(pullerMesh);

    // Cream Hoodie Drawstrings (Engineered with positive Z clearance: NEVER penetrates torso!)
    for (const xSign of [-1, 1]) {
      const drawstringGroup = new THREE.Group();
      // Eyelet at collar
      drawstringGroup.position.set(xSign * 0.075, 0.230, 0.185);

      // Angled upper string curving forward over chest
      const upperStrLen = 0.140;
      const upperStrGeo = this.track(new THREE.CylinderGeometry(0.007, 0.007, upperStrLen, 10));
      upperStrGeo.rotateX(-0.55); // Angles forward in +Z as it goes down
      const upperStrMesh = new THREE.Mesh(upperStrGeo, drawstringCreamMat);
      upperStrMesh.position.set(0, -upperStrLen * 0.42, upperStrLen * 0.28);
      drawstringGroup.add(upperStrMesh);

      // Hanging lower string with golden aglet tip (Drapes freely at Z = 0.080 in local coords -> Z_world = 0.265 > Z_torso = 0.240)
      const lowerStrLen = 0.070;
      const lowerStrGeo = this.track(new THREE.CylinderGeometry(0.007, 0.007, lowerStrLen, 10));
      const lowerStrMesh = new THREE.Mesh(lowerStrGeo, drawstringCreamMat);
      lowerStrMesh.position.set(xSign * 0.005, -upperStrLen * 0.85 - lowerStrLen * 0.5, upperStrLen * 0.56);
      drawstringGroup.add(lowerStrMesh);

      // Golden Aglet Tip
      const tipLen = 0.030;
      const tipGeo = this.track(new THREE.CylinderGeometry(0.012, 0.012, tipLen, 10));
      const tipMesh = new THREE.Mesh(tipGeo, zipperYellowMat);
      tipMesh.position.set(xSign * 0.005, -upperStrLen * 0.85 - lowerStrLen - tipLen * 0.5, upperStrLen * 0.56);
      drawstringGroup.add(tipMesh);

      this.torsoGroup.add(drawstringGroup);
    }

    // Chameleon Tail at back (curling UPWARDS)
    const tailRoot = new THREE.Group();
    tailRoot.position.set(0, -0.16, -0.22);
    this.torsoGroup.add(tailRoot);

    const tailOffsets = [
      { pos: new THREE.Vector3(0, 0, 0), r: 0.080 },
      { pos: new THREE.Vector3(0, -0.01, -0.07), r: 0.070 },
      { pos: new THREE.Vector3(0, 0.03, -0.13), r: 0.060 },
      { pos: new THREE.Vector3(0, 0.09, -0.16), r: 0.050 },
      { pos: new THREE.Vector3(0, 0.16, -0.15), r: 0.040 },
      { pos: new THREE.Vector3(0, 0.21, -0.10), r: 0.032 },
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
    // 3. THE CHAMELEON HOOD & EXPRESSIVE HERO FACE
    // ==========================================
    // Head pivot at y = 1.160 (Overlaps torso cowl at y = 0.990 by 9.0cm - ZERO GAPS)
    this.headGroup.position.set(0, 1.160, 0.015);
    this.modelRoot.add(this.headGroup);

    // Outer Chameleon Hood (Seamless spherical dome: 100% solid top, back, and sides)
    // Using thetaLength = 0.68*PI rotated -PI/2 around X axis.
    // The pole is at -Z (back of skull). Sphere wraps continuously across top, nape, and sides,
    // terminating cleanly in a smooth circular face opening in front (+Z). ZERO HOLES ON TOP!
    const hoodGeo = this.track(
      new THREE.SphereGeometry(
        0.270,
        48,
        36,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.68
      )
    );
    hoodGeo.rotateX(-Math.PI / 2);
    hoodGeo.scale(1.02, 1.04, 1.02);
    const hoodMesh = new THREE.Mesh(hoodGeo, hoodieGreenMat);
    hoodMesh.position.set(0, 0.01, -0.01);
    hoodMesh.castShadow = true;
    hoodMesh.receiveShadow = true;
    this.headGroup.add(hoodMesh);

    // 3 Chameleon Ridge Spikes along Back of Hood
    for (let r = 0; r < 3; r++) {
      const spikeGeo = this.track(new THREE.ConeGeometry(0.035, 0.070, 10));
      spikeGeo.rotateX(Math.PI / 2);
      const spike = new THREE.Mesh(spikeGeo, pocketBlueMat);
      spike.position.set(0, 0.20 - r * 0.080, -0.21 - r * 0.05);
      spike.rotation.x = -0.35 - r * 0.25;
      spike.castShadow = true;
      this.headGroup.add(spike);
    }

    // Peach Face Front Dome (Convex cap STRICTLY confined inside the hood rim: ZERO skin leaks on sides/temples/top)
    const faceCapGeo = this.track(new THREE.SphereGeometry(0.190, 36, 28, 0, Math.PI * 2, 0, Math.PI * 0.44));
    faceCapGeo.rotateX(Math.PI / 2);
    faceCapGeo.scale(1.0, 1.06, 0.60);
    const faceMesh = new THREE.Mesh(faceCapGeo, skinToneMat);
    faceMesh.position.set(0, -0.005, 0.095);
    faceMesh.castShadow = true;
    this.headGroup.add(faceMesh);

    // Dark Green Hood Face Rim (Thick padded bezel framing the face opening)
    // Sits flush at z = 0.140, completely overlapping the boundary of the face cap and hood opening
    const hoodRimGeo = this.track(new THREE.TorusGeometry(0.205, 0.036, 24, 48));
    hoodRimGeo.scale(1.0, 1.06, 0.70);
    const hoodRim = new THREE.Mesh(hoodRimGeo, hoodTrimDarkGreenMat);
    hoodRim.position.set(0, 0.00, 0.140);
    hoodRim.castShadow = true;
    this.headGroup.add(hoodRim);

    // Curved Hood Visor / Brim over the forehead
    const visorShape = new THREE.Shape();
    visorShape.moveTo(-0.20, 0);
    visorShape.quadraticCurveTo(0, 0.13, 0.20, 0);
    visorShape.quadraticCurveTo(0, 0.05, -0.20, 0);

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
    visorMesh.position.set(0, 0.140, 0.165);
    visorMesh.rotation.set(0.18, 0, 0);
    visorMesh.castShadow = true;
    this.headGroup.add(visorMesh);

    // ==========================================
    // SCULPTED VOLUMETRIC ANIME HAIR LOCKS
    // ==========================================
    const hairGroup = new THREE.Group();
    hairGroup.position.set(0, 0.120, 0.155);

    const createHairLockShape = (width: number, length: number, curveX: number) => {
      const s = new THREE.Shape();
      s.moveTo(-width / 2, 0);
      s.quadraticCurveTo(curveX * 0.4, -length * 0.45, -width * 0.15 + curveX, -length);
      s.quadraticCurveTo(curveX * 0.7 + width * 0.15, -length * 0.50, width / 2, 0);
      s.closePath();
      return s;
    };

    const lockExtrudeSettings = {
      depth: 0.015,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.006,
      bevelThickness: 0.006,
    };

    const hairLocksConfig = [
      // 1. Center Hero Lock (Graceful sweep to right)
      { width: 0.062, len: 0.115, curveX: 0.025, x: 0.010, y: -0.015, z: 0.025, rx: 0.24, rz: 0.06 },
      // 2. Left Framing Lock (Swoop left framing the brow)
      { width: 0.052, len: 0.095, curveX: -0.030, x: -0.055, y: -0.010, z: 0.018, rx: 0.20, rz: 0.25 },
      // 3. Right Framing Lock (Swoop right framing the brow)
      { width: 0.054, len: 0.100, curveX: 0.028, x: 0.065, y: -0.010, z: 0.020, rx: 0.22, rz: -0.22 },
      // 4. Dimensional Top-Volume Lock (Layered above center)
      { width: 0.044, len: 0.075, curveX: 0.018, x: 0.005, y: 0.005, z: 0.034, rx: 0.28, rz: 0.04 },
      // 5. Left Temple Tendril
      { width: 0.035, len: 0.070, curveX: -0.020, x: -0.100, y: -0.030, z: 0.008, rx: 0.14, rz: 0.40 },
      // 6. Right Temple Tendril
      { width: 0.035, len: 0.070, curveX: 0.020, x: 0.105, y: -0.030, z: 0.010, rx: 0.15, rz: -0.38 },
    ];

    for (const h of hairLocksConfig) {
      const lockShape = createHairLockShape(h.width, h.len, h.curveX);
      const lockGeo = this.track(new THREE.ExtrudeGeometry(lockShape, lockExtrudeSettings));
      lockGeo.center();
      const lockMesh = new THREE.Mesh(lockGeo, hairTealMat);
      lockMesh.position.set(h.x, h.y, h.z);
      lockMesh.rotation.set(h.rx, 0, h.rz);
      lockMesh.castShadow = true;
      hairGroup.add(lockMesh);
    }
    this.headGroup.add(hairGroup);

    // Expressive Hero Eyes
    const buildExpressiveHeroEye = (xSign: number) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xSign * 0.085, 0.015, 0.198);
      eyeGroup.rotation.z = xSign * -0.08;

      const scleraGeo = this.track(new THREE.SphereGeometry(0.044, 20, 16));
      scleraGeo.scale(1.20, 1.05, 0.25);
      const sclera = new THREE.Mesh(scleraGeo, eyeScleraWhiteMat);
      eyeGroup.add(sclera);

      const irisGeo = this.track(new THREE.SphereGeometry(0.030, 20, 16));
      irisGeo.scale(1.0, 1.05, 0.18);
      const iris = new THREE.Mesh(irisGeo, eyeIrisCyanMat);
      iris.position.set(xSign * -0.003, -0.002, 0.012);
      eyeGroup.add(iris);

      const pupilGeo = this.track(new THREE.SphereGeometry(0.018, 14, 12));
      pupilGeo.scale(1.0, 1.15, 0.18);
      const pupil = new THREE.Mesh(pupilGeo, eyePupilBlackMat);
      pupil.position.set(xSign * -0.003, -0.002, 0.016);
      eyeGroup.add(pupil);

      const sparkleMainGeo = this.track(new THREE.CircleGeometry(0.010, 12));
      const sparkleMain = new THREE.Mesh(sparkleMainGeo, eyeHighlightWhiteMat);
      sparkleMain.position.set(xSign * 0.007, 0.011, 0.021);
      eyeGroup.add(sparkleMain);

      const sparkleSubGeo = this.track(new THREE.CircleGeometry(0.005, 10));
      const sparkleSub = new THREE.Mesh(sparkleSubGeo, eyeHighlightWhiteMat);
      sparkleSub.position.set(xSign * -0.007, -0.007, 0.021);
      eyeGroup.add(sparkleSub);

      const lashGeo = this.track(new THREE.TorusGeometry(0.046, 0.008, 8, 16, Math.PI * 0.72));
      lashGeo.rotateZ(Math.PI * 0.14);
      const lash = new THREE.Mesh(lashGeo, eyeBrowBlackMat);
      lash.position.set(0, 0.023, 0.017);
      eyeGroup.add(lash);

      const browGeo = this.track(new THREE.BoxGeometry(0.058, 0.013, 0.013));
      const brow = new THREE.Mesh(browGeo, eyeBrowBlackMat);
      brow.position.set(xSign * 0.004, 0.053, 0.011);
      brow.rotation.z = xSign * 0.20;
      eyeGroup.add(brow);

      return eyeGroup;
    };

    this.headGroup.add(buildExpressiveHeroEye(-1));
    this.headGroup.add(buildExpressiveHeroEye(1));

    // Cheek Blush
    for (const xSign of [-1, 1]) {
      const blushGeo = this.track(new THREE.SphereGeometry(0.040, 14, 10));
      blushGeo.scale(1.25, 0.65, 0.15);
      const blush = new THREE.Mesh(blushGeo, blushPeachMat);
      blush.position.set(xSign * 0.125, -0.048, 0.190);
      this.headGroup.add(blush);
    }

    // Smirk Mouth
    const mouthGeo = this.track(new THREE.TorusGeometry(0.030, 0.006, 6, 14, Math.PI * 0.65));
    mouthGeo.rotateZ(Math.PI * 0.18);
    const mouth = new THREE.Mesh(mouthGeo, eyeBrowBlackMat);
    mouth.position.set(0.008, -0.072, 0.202);
    this.headGroup.add(mouth);

    // Iconic Round Candy Lollipop
    const lollipopGroup = new THREE.Group();
    lollipopGroup.position.set(0.048, -0.068, 0.206);
    lollipopGroup.rotation.set(0.12, 0.20, -0.28);

    const candyGeo = this.track(new THREE.SphereGeometry(0.038, 20, 16));
    candyGeo.scale(1.0, 1.0, 0.85);
    const candyMesh = new THREE.Mesh(candyGeo, lollipopCherryMat);
    candyMesh.castShadow = true;
    lollipopGroup.add(candyMesh);

    const swirlGeo = this.track(new THREE.TorusGeometry(0.021, 0.004, 8, 16));
    const swirlMesh = new THREE.Mesh(swirlGeo, whiteAccentMat);
    swirlMesh.position.set(0, 0, 0.030);
    lollipopGroup.add(swirlMesh);

    const stickGeo = this.track(new THREE.CylinderGeometry(0.005, 0.005, 0.10, 10));
    stickGeo.rotateZ(Math.PI / 2);
    const stickMesh = new THREE.Mesh(stickGeo, whiteAccentMat);
    stickMesh.position.set(-0.055, -0.003, 0);
    lollipopGroup.add(stickMesh);

    this.headGroup.add(lollipopGroup);

    // Chameleon Eye Turrets on Top of Hood
    const buildChamEyeTurret = (xSign: number) => {
      const turretRoot = new THREE.Group();
      turretRoot.position.set(xSign * 0.15, 0.21, 0.05);
      turretRoot.rotation.set(-0.16, xSign * 0.28, xSign * 0.18);

      const turretGeo = this.track(new THREE.SphereGeometry(0.085, 24, 18));
      const turret = new THREE.Mesh(turretGeo, hoodieGreenMat);
      turret.castShadow = true;
      turretRoot.add(turret);

      const eyeballGeo = this.track(new THREE.SphereGeometry(0.070, 24, 18));
      eyeballGeo.scale(1.0, 1.0, 0.70);
      const eyeball = new THREE.Mesh(eyeballGeo, chamEyeYellowMat);
      eyeball.position.set(0, 0, 0.042);
      turretRoot.add(eyeball);

      const pupilGeo = this.track(new THREE.CapsuleGeometry(0.016, 0.036, 6, 10));
      const pupil = new THREE.Mesh(pupilGeo, chamEyePupilMat);
      pupil.position.set(0, 0, 0.090);
      turretRoot.add(pupil);

      const hlGeo = this.track(new THREE.SphereGeometry(0.016, 10, 10));
      const hl = new THREE.Mesh(hlGeo, chamEyeHighlightMat);
      hl.position.set(xSign * 0.016, 0.016, 0.098);
      turretRoot.add(hl);

      const lidGeo = this.track(new THREE.SphereGeometry(0.073, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.38));
      const lid = new THREE.Mesh(lidGeo, hoodieGreenMat);
      lid.position.set(0, 0, 0.042);
      lid.rotation.x = -0.22;
      turretRoot.add(lid);

      return turretRoot;
    };

    this.headGroup.add(buildChamEyeTurret(-1));
    this.headGroup.add(buildChamEyeTurret(1));

    // ==========================================
    // 4. ARMS & CARTOON HANDS (Anchored to Torso)
    // ==========================================
    const buildLeonArm = (xSign: number, pivot: THREE.Group) => {
      // Anchored to torsoGroup at local y = 0.160 (World Y = 0.890)
      pivot.position.set(xSign * 0.24, 0.160, 0.00);
      this.torsoGroup.add(pivot);

      // Smooth Rounded Shoulder
      const shoulderGeo = this.track(new THREE.SphereGeometry(0.110, 32, 24));
      const shoulder = new THREE.Mesh(shoulderGeo, hoodieGreenMat);
      shoulder.castShadow = true;
      pivot.add(shoulder);

      // Upper Arm (Green hoodie sleeve)
      const upperArmGeo = this.track(new THREE.CylinderGeometry(0.095, 0.080, 0.19, 32));
      upperArmGeo.translate(0, -0.11, 0);
      const upperArm = new THREE.Mesh(upperArmGeo, hoodieGreenMat);
      upperArm.castShadow = true;
      pivot.add(upperArm);

      // Blue Sleeve Cuff
      const cuffGeo = this.track(new THREE.TorusGeometry(0.085, 0.024, 16, 32));
      cuffGeo.rotateX(Math.PI / 2);
      const cuff = new THREE.Mesh(cuffGeo, pocketBlueMat);
      cuff.position.set(0, -0.20, 0);
      cuff.castShadow = true;
      pivot.add(cuff);

      // Solid Peach Forearm / Wrist emerging from inside cuff
      const wristGeo = this.track(new THREE.CylinderGeometry(0.060, 0.055, 0.12, 24));
      wristGeo.translate(0, -0.24, 0.01);
      const wrist = new THREE.Mesh(wristGeo, skinToneMat);
      wrist.castShadow = true;
      pivot.add(wrist);

      // Cartoon Brawl Fist
      const handGroup = new THREE.Group();
      handGroup.position.set(0, -0.30, 0.015);
      pivot.add(handGroup);

      const palmGeo = this.track(new THREE.SphereGeometry(0.070, 28, 20));
      palmGeo.scale(1.0, 0.92, 0.90);
      const palm = new THREE.Mesh(palmGeo, skinToneMat);
      palm.castShadow = true;
      handGroup.add(palm);

      for (let k = 0; k < 3; k++) {
        const knuckleGeo = this.track(new THREE.CapsuleGeometry(0.016, 0.032, 8, 12));
        knuckleGeo.rotateZ(Math.PI / 2);
        const knuckle = new THREE.Mesh(knuckleGeo, skinToneMat);
        knuckle.position.set((k - 1) * 0.028, -0.026, 0.042);
        knuckle.castShadow = true;
        handGroup.add(knuckle);
      }

      const thumbGeo = this.track(new THREE.CapsuleGeometry(0.026, 0.048, 8, 12));
      const thumb = new THREE.Mesh(thumbGeo, skinToneMat);
      thumb.position.set(xSign * -0.042, 0.006, 0.030);
      thumb.rotation.set(-0.25, 0, xSign * -0.55);
      thumb.castShadow = true;
      handGroup.add(thumb);
    };

    buildLeonArm(-1, this.leftArmPivot);
    buildLeonArm(1, this.rightArmPivot);

    // ==========================================
    // 5. SHORTS, LEGS & SNEAKERS (ENGINEERED ZERO-GAP ANATOMY)
    // ==========================================
    // Hip joint anchored to modelRoot at Y = 0.460
    // Floor is at Y = 0.000 (Local y = -0.460)
    const buildLeonLeg = (xSign: number, pivot: THREE.Group) => {
      pivot.position.set(xSign * 0.12, 0.460, 0);
      this.modelRoot.add(pivot);

      // Dark Indigo Bermuda Shorts: spans local y = 0.020 to y = -0.170 (Height 0.190)
      const shortGeo = this.track(new THREE.CylinderGeometry(0.120, 0.128, 0.190, 32));
      shortGeo.translate(0, -0.075, 0);
      const shorts = new THREE.Mesh(shortGeo, shortsIndigoMat);
      shorts.castShadow = true;
      pivot.add(shorts);

      // Peach Skin Leg Cylinder:
      // Starts DEEP inside the shorts at local y = -0.060
      // Extends down to local y = -0.390 (penetrating 5.0cm INSIDE the shoe collar!)
      // Total length: 0.330m. Centered at y = -0.225.
      const legGeo = this.track(new THREE.CylinderGeometry(0.065, 0.060, 0.330, 32));
      legGeo.translate(0, -0.225, 0);
      const leg = new THREE.Mesh(legGeo, skinToneMat);
      leg.castShadow = true;
      pivot.add(leg);

      // CHUNKY BRAWL SNEAKER:
      // Floor contact: local y = -0.460 (World Y = 0.000)
      // Top of shoe collar: local y = -0.340 (World Y = 0.120)
      // Since leg extends to local y = -0.390, the leg is 5.0cm INSIDE the shoe! ZERO GAP!
      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(0, 0, 0.020);
      pivot.add(shoeGroup);

      // White Molded Rubber Sole:
      // Bottom at local y = -0.460, top at local y = -0.415 (Height 0.045, width 0.170, length 0.250)
      const soleGeo = this.track(new THREE.BoxGeometry(0.170, 0.045, 0.250));
      soleGeo.translate(0, -0.4375, 0.020);
      const sole = new THREE.Mesh(soleGeo, sneakerWhiteMat);
      sole.castShadow = true;
      shoeGroup.add(sole);

      // Sole Dark Stripe
      const stripeGeo = this.track(new THREE.BoxGeometry(0.175, 0.010, 0.230));
      stripeGeo.translate(0, -0.4375, 0.020);
      const stripe = new THREE.Mesh(stripeGeo, sneakerStripeMat);
      shoeGroup.add(stripe);

      // Crimson Red Sneaker Upper:
      // Sits on top of sole: from local y = -0.415 up to local y = -0.340
      const upperGeo = this.track(new THREE.CapsuleGeometry(0.075, 0.120, 10, 24));
      upperGeo.rotateX(Math.PI / 2);
      upperGeo.translate(0, -0.365, 0.025);
      const upper = new THREE.Mesh(upperGeo, sneakerRedMat);
      upper.castShadow = true;
      shoeGroup.add(upper);

      // Rounded White Rubber Shell-Toe Cap
      const toeCapGeo = this.track(new THREE.SphereGeometry(0.085, 24, 14, 0, Math.PI, 0, Math.PI * 0.55));
      toeCapGeo.rotateX(Math.PI / 2);
      const toeCap = new THREE.Mesh(toeCapGeo, sneakerWhiteMat);
      toeCap.position.set(0, -0.395, 0.105);
      toeCap.scale.set(0.95, 0.72, 0.85);
      toeCap.castShadow = true;
      shoeGroup.add(toeCap);

      // Padded Sneaker Ankle Collar (Where the leg enters the shoe - Hermetic visual seal)
      const collarTorusGeo = this.track(new THREE.TorusGeometry(0.068, 0.016, 12, 24));
      collarTorusGeo.rotateX(Math.PI / 2);
      const collarTorus = new THREE.Mesh(collarTorusGeo, sneakerWhiteMat);
      collarTorus.position.set(0, -0.340, 0.005);
      collarTorus.castShadow = true;
      shoeGroup.add(collarTorus);

      // Sneaker Tongue & Laces
      const tongueGeo = this.track(new THREE.BoxGeometry(0.075, 0.090, 0.025));
      const tongue = new THREE.Mesh(tongueGeo, sneakerWhiteMat);
      tongue.position.set(0, -0.320, 0.080);
      tongue.rotation.x = -0.32;
      shoeGroup.add(tongue);

      for (let l = 0; l < 3; l++) {
        const laceGeo = this.track(new THREE.BoxGeometry(0.080, 0.012, 0.025));
        const lace = new THREE.Mesh(laceGeo, sneakerWhiteMat);
        lace.position.set(0, -0.355 + l * 0.026, 0.045 + l * 0.014);
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

    const maxAngularSpeed = 12.0;
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

    // Solid proportion scale
    let targetScaleY = 1.0;
    if (isGrounded && jumpSquash > 0) {
      targetScaleY = Math.max(0.94, 1.0 - jumpSquash * 0.25);
    }
    this.modelRoot.scale.set(1.0, targetScaleY, 1.0);

    // Dynamic banking & lean
    const targetBank = THREE.MathUtils.clamp(-turnRate * 0.065, -0.34, 0.34);
    this.currentBankAngle += (targetBank - this.currentBankAngle) * Math.min(1, 16 * dt);
    this.modelRoot.rotation.z = this.currentBankAngle;

    const targetLean = isGrounded ? Math.min(0.32, speed * 0.032) : 0.08;
    this.currentForwardLean += (targetLean - this.currentForwardLean) * Math.min(1, 14 * dt);
    this.modelRoot.rotation.x = this.currentForwardLean;

    // Animation States
    if (!isGrounded) {
      // Airborne pose
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

      this.torsoGroup.position.y = 0.730;
      this.headGroup.position.y = 1.160;
    } else if (speed > 0.20) {
      // Running pose
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

      const bounce = Math.abs(cosStride) * 0.04;
      this.torsoGroup.position.y = 0.730 + bounce;
      this.headGroup.position.y = 1.160 + bounce;
      this.torsoGroup.rotation.y = sinStride * 0.12;
      this.headGroup.rotation.y = -sinStride * 0.04;
    } else {
      // Idle pose
      this.walkCycleTime = 0;

      const breathe = Math.sin(this.idleTime * 2.8) * 0.012;
      this.torsoGroup.position.y = 0.730 + breathe;
      this.headGroup.position.y = 1.160 + breathe;

      this.leftLegPivot.rotation.x *= Math.max(0, 1 - 16 * dt);
      this.rightLegPivot.rotation.x *= Math.max(0, 1 - 16 * dt);
      this.leftArmPivot.rotation.x *= Math.max(0, 1 - 16 * dt);
      this.rightArmPivot.rotation.x *= Math.max(0, 1 - 16 * dt);
      this.leftArmPivot.rotation.z = -0.10 + breathe * 0.5;
      this.rightArmPivot.rotation.z = 0.10 - breathe * 0.5;
      this.torsoGroup.rotation.y *= Math.max(0, 1 - 16 * dt);
      this.headGroup.rotation.y *= Math.max(0, 1 - 16 * dt);
    }

    // Chameleon Tail Physics
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
