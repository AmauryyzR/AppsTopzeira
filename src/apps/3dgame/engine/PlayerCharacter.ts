import * as THREE from 'three';
import { createToonMaterial } from './shaders/ToonMaterial';
import {
  createFabricTexture,
  createDenimTexture,
  createLeatherTexture,
  createRubberSoleTexture,
  createLeonFaceTexture,
} from './textures/ProceduralTextures';

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
class CandySpiralCurve extends THREE.Curve<THREE.Vector3> {
  private sphereR: number;
  private maxTurns: number;

  constructor(sphereR: number, maxTurns = 2.4) {
    super();
    this.sphereR = sphereR;
    this.maxTurns = maxTurns;
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()): THREE.Vector3 {
    const angle = t * Math.PI * 2 * this.maxTurns;
    const r = 0.006 + t * (this.sphereR * 0.88);
    const z = Math.sqrt(Math.max(0, this.sphereR * this.sphereR - r * r));
    return optionalTarget.set(Math.cos(angle) * r, Math.sin(angle) * r, z);
  }
}

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

  // Secondary Dynamic Inertia Physics Elements (Loop 5)
  private drawstringPivots: { group: THREE.Group; baseRotZ: number; side: number }[] = [];
  private zipperPullerPivot = new THREE.Group();
  private sneakerAgletPivots: { pivot: THREE.Group; baseRotX: number; baseRotZ: number; isLeftShoe: boolean; side: number }[] = [];

  // Tracked Geometries, Materials & Textures for Clean Cleanup (Zero Leaks)
  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];
  private textures: THREE.Texture[] = [];

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

  private trackTex<T extends THREE.Texture>(tex: T): T {
    this.textures.push(tex);
    return tex;
  }

  private buildCharacterModel() {
    // ==========================================
    // 1. CEL-SHADED ANIME TOON PALETTE & PROCEDURAL TEXTURES (Genshin / BotW)
    // ==========================================
    const fabricTex = this.trackTex(createFabricTexture({ repeatX: 8, repeatY: 8 }));
    const denimTex = this.trackTex(createDenimTexture({ repeatX: 6, repeatY: 6 }));
    const leatherSneakerTex = this.trackTex(createLeatherTexture({ repeatX: 4, repeatY: 4 }));
    const leatherGloveTex = this.trackTex(createLeatherTexture({ repeatX: 3, repeatY: 3 }));
    const rubberSoleTex = this.trackTex(createRubberSoleTexture({ repeatX: 5, repeatY: 5 }));

    const hoodieGreenMat = this.trackMat(
      createToonMaterial({
        color: 0x10b981, // Vibrant Emerald Chameleon Green
        gradientBands: 4,
        map: fabricTex,
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
        map: fabricTex,
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
    const faceTex = this.trackTex(createLeonFaceTexture());
    const faceSkinMat = this.trackMat(
      createToonMaterial({
        color: 0xffffff,
        map: faceTex,
        gradientBands: 4,
        transparent: true,
        rimColor: 0xffedd5,
        rimPower: 3.5,
        rimIntensity: 0.20,
        shadowColor: 0x9a3412,
        shadowIntensity: 0.25,
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
        map: denimTex,
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
        map: leatherSneakerTex,
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
        map: rubberSoleTex,
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

    // Eyes on Top of Hood (Chameleon Eye Turrets with Heavy Volumetric Eyelids)
    const chamEyeYellowMat = this.trackMat(
      createToonMaterial({
        color: 0xfacc15, // Vibrant chameleon amber-yellow
        gradientBands: 3,
        rimColor: 0xfef08a,
        rimPower: 2.2,
        rimIntensity: 0.70,
        shadowColor: 0xd97706,
        shadowIntensity: 0.45,
      })
    );
    const chamEyePupilMat = this.trackMat(
      createToonMaterial({
        color: 0x090d16,
        gradientBands: 3,
        rimColor: 0x1e293b,
        rimPower: 3.5,
        rimIntensity: 0.35,
        shadowColor: 0x020617,
        shadowIntensity: 0.70,
      })
    );
    const chamEyePupilBorderMat = this.trackMat(
      createToonMaterial({
        color: 0xf59e0b,
        gradientBands: 3,
        rimColor: 0xfef08a,
        rimPower: 2.6,
        rimIntensity: 0.65,
        shadowColor: 0xb45309,
        shadowIntensity: 0.50,
      })
    );
    const chamEyeHighlightMat = this.trackMat(
      createToonMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.50,
        gradientBands: 3,
        rimColor: 0xffffff,
        rimPower: 1.8,
        rimIntensity: 0.90,
        shadowColor: 0xdbeafe,
        shadowIntensity: 0.20,
      })
    );
    const chamLidShadowMat = this.trackMat(
      createToonMaterial({
        color: 0x022c22,
        gradientBands: 2,
        rimColor: 0x064e3b,
        rimPower: 3.2,
        rimIntensity: 0.30,
        shadowColor: 0x011a14,
        shadowIntensity: 0.75,
      })
    );

    // Anime Face & Multi-Layer Hair Materials (Leon's Signature Brawler Face)
    const hairTealMat = this.trackMat(
      createToonMaterial({
        color: 0x0284c7, // Vibrant cyan-teal anime hair
        gradientBands: 4,
        rimColor: 0x38bdf8,
        rimPower: 2.4,
        rimIntensity: 0.75,
        shadowColor: 0x075985,
        shadowIntensity: 0.50,
      })
    );
    const hairShadowTealMat = this.trackMat(
      createToonMaterial({
        color: 0x0c4a6e, // Deep petrol teal depth/ambient-occlusion hair layer
        gradientBands: 3,
        rimColor: 0x0369a1,
        rimPower: 2.8,
        rimIntensity: 0.50,
        shadowColor: 0x082f49,
        shadowIntensity: 0.60,
      })
    );
    const hairHighlightCyanMat = this.trackMat(
      createToonMaterial({
        color: 0x38bdf8, // Luminous sky-cyan anime highlight crest
        gradientBands: 3,
        rimColor: 0xbae6fd,
        rimPower: 2.2,
        rimIntensity: 0.85,
        shadowColor: 0x0284c7,
        shadowIntensity: 0.40,
      })
    );

    // Heroic Expressive Face Eyes Materials
    const eyeScleraWhiteMat = this.trackMat(
      createToonMaterial({
        color: 0xffffff,
        gradientBands: 3,
        rimColor: 0xe0f2fe,
        rimPower: 2.8,
        rimIntensity: 0.60,
        shadowColor: 0xcfd8dc,
        shadowIntensity: 0.45,
      })
    );
    const eyeScleraShadowMat = this.trackMat(
      createToonMaterial({
        color: 0xcfd8dc,
        gradientBands: 3,
        rimColor: 0x94a3b8,
        rimPower: 3.2,
        rimIntensity: 0.40,
        shadowColor: 0x64748b,
        shadowIntensity: 0.55,
      })
    );
    const eyeLimbalRingMat = this.trackMat(
      createToonMaterial({
        color: 0x034f75,
        gradientBands: 3,
        rimColor: 0x0ea5e9,
        rimPower: 2.6,
        rimIntensity: 0.55,
        shadowColor: 0x082f49,
        shadowIntensity: 0.60,
      })
    );
    const eyeIrisCyanMat = this.trackMat(
      createToonMaterial({
        color: 0x0284c7,
        gradientBands: 4,
        rimColor: 0x38bdf8,
        rimPower: 2.4,
        rimIntensity: 0.75,
        shadowColor: 0x075985,
        shadowIntensity: 0.50,
      })
    );
    const eyeIrisGlowMat = this.trackMat(
      createToonMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.35,
        gradientBands: 3,
        rimColor: 0xbae6fd,
        rimPower: 2.2,
        rimIntensity: 0.85,
        shadowColor: 0x0284c7,
        shadowIntensity: 0.35,
      })
    );
    const eyePupilBlackMat = this.trackMat(
      createToonMaterial({
        color: 0x090d16,
        gradientBands: 3,
        rimColor: 0x1e293b,
        rimPower: 3.5,
        rimIntensity: 0.30,
        shadowColor: 0x020617,
        shadowIntensity: 0.70,
      })
    );
    const eyeHighlightWhiteMat = this.trackMat(
      createToonMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.55,
        gradientBands: 3,
        rimColor: 0xffffff,
        rimPower: 1.8,
        rimIntensity: 0.95,
        shadowColor: 0xdbeafe,
        shadowIntensity: 0.20,
      })
    );
    const eyeLashBlackMat = this.trackMat(
      createToonMaterial({
        color: 0x090d16,
        gradientBands: 3,
        rimColor: 0x334155,
        rimPower: 2.8,
        rimIntensity: 0.45,
        shadowColor: 0x020617,
        shadowIntensity: 0.65,
      })
    );
    const eyeBrowBlackMat = this.trackMat(
      createToonMaterial({
        color: 0x090d16,
        gradientBands: 3,
        rimColor: 0x334155,
        rimPower: 2.8,
        rimIntensity: 0.45,
        shadowColor: 0x020617,
        shadowIntensity: 0.65,
      })
    );
    const blushPeachMat = this.trackMat(
      createToonMaterial({
        color: 0xf43f5e,
        gradientBands: 2,
        transparent: true,
        opacity: 0.38,
      })
    );

    // Detailed Candy Lollipop Materials (Translucent Glaze, Cream Swirl, Cellophane Knot & Tie)
    const lollipopCandyMat = this.trackMat(
      createToonMaterial({
        color: 0xf43f5e, // Glossy caramel-strawberry candy tone
        gradientBands: 4,
        rimColor: 0xfecdd3,
        rimPower: 2.0,
        rimIntensity: 0.95,
        shadowColor: 0x9f1239,
        shadowIntensity: 0.55,
      })
    );
    const lollipopGlossMat = this.trackMat(
      createToonMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.45,
        gradientBands: 3,
        rimColor: 0xffffff,
        rimPower: 1.8,
        rimIntensity: 0.95,
        shadowColor: 0xfecdd3,
        shadowIntensity: 0.20,
      })
    );
    const lollipopSwirlWhiteMat = this.trackMat(
      createToonMaterial({
        color: 0xfffbeb, // Sweet vanilla cream candy swirl
        gradientBands: 3,
        rimColor: 0xffffff,
        rimPower: 2.6,
        rimIntensity: 0.70,
        shadowColor: 0xfde68a,
        shadowIntensity: 0.40,
      })
    );
    const lollipopStickMat = this.trackMat(
      createToonMaterial({
        color: 0xf8fafc,
        gradientBands: 3,
        rimColor: 0xffffff,
        rimPower: 3.0,
        rimIntensity: 0.55,
        shadowColor: 0xcbd5e1,
        shadowIntensity: 0.45,
      })
    );
    const cellophaneMat = this.trackMat(
      createToonMaterial({
        color: 0xffffff,
        gradientBands: 3,
        rimColor: 0x93c5fd,
        rimPower: 2.2,
        rimIntensity: 0.90,
        transparent: true,
        opacity: 0.68,
        shadowColor: 0xcbd5e1,
        shadowIntensity: 0.35,
      })
    );
    const twistTieGoldMat = this.trackMat(
      createToonMaterial({
        color: 0xf59e0b, // Golden foil wrapper tie
        gradientBands: 3,
        rimColor: 0xfef08a,
        rimPower: 2.2,
        rimIntensity: 0.85,
        shadowColor: 0xb45309,
        shadowIntensity: 0.45,
      })
    );

    // Anatomical Structural Materials (Loop 1: Waistband, Cuffs, Socks, Sneaker Collar)
    const denimStitchMat = this.trackMat(
      createToonMaterial({
        color: 0xf59e0b, // Warm golden-amber denim contrast stitching
        gradientBands: 3,
        rimColor: 0xfef3c7,
        rimPower: 2.6,
        rimIntensity: 0.65,
        shadowColor: 0x78350f,
        shadowIntensity: 0.50,
      })
    );
    const cuffRibbedBlueMat = this.trackMat(
      createToonMaterial({
        color: 0x1d4ed8, // Deep royal blue ribbed knit texture for hoodie cuffs
        gradientBands: 4,
        rimColor: 0x60a5fa,
        rimPower: 2.8,
        rimIntensity: 0.65,
        shadowColor: 0x172554,
        shadowIntensity: 0.55,
      })
    );
    const hemRibbedGreenMat = this.trackMat(
      createToonMaterial({
        color: 0x0f766e, // Deep emerald teal ribbed band tone
        gradientBands: 4,
        rimColor: 0x5eead4,
        rimPower: 2.8,
        rimIntensity: 0.65,
        shadowColor: 0x042f2e,
        shadowIntensity: 0.55,
      })
    );
    const sockWhiteMat = this.trackMat(
      createToonMaterial({
        color: 0xf8fafc, // Crisp clean athletic white crew sock
        gradientBands: 4,
        rimColor: 0xffffff,
        rimPower: 3.0,
        rimIntensity: 0.70,
        shadowColor: 0x94a3b8,
        shadowIntensity: 0.45,
      })
    );
    const sockStripeBlueMat = this.trackMat(
      createToonMaterial({
        color: 0x2563eb, // Retro athletic blue sock stripe
        gradientBands: 3,
        rimColor: 0x93c5fd,
        rimPower: 2.8,
        rimIntensity: 0.60,
        shadowColor: 0x1e3a8a,
        shadowIntensity: 0.50,
      })
    );
    const sneakerCollarMat = this.trackMat(
      createToonMaterial({
        color: 0xffffff, // Padded white ankle collar rim for skate sneaker
        gradientBands: 4,
        rimColor: 0xffffff,
        rimPower: 2.6,
        rimIntensity: 0.75,
        shadowColor: 0x94a3b8,
        shadowIntensity: 0.45,
      })
    );

    // ==========================================
    // LOOP 4: COMBAT BRAWLER GLOVES & CHUNKY SNEAKER MATERIALS
    // ==========================================
    const gloveMainMat = this.trackMat(
      createToonMaterial({
        color: 0x1e293b, // Dark charcoal slate brawler glove leather
        gradientBands: 4,
        map: leatherGloveTex,
        rimColor: 0x475569,
        rimPower: 2.8,
        rimIntensity: 0.65,
        shadowColor: 0x0f172a,
        shadowIntensity: 0.60,
      })
    );
    const gloveTrimMat = this.trackMat(
      createToonMaterial({
        color: 0x2563eb, // Royal blue piping / contrast debrum (matching Leon's crest & pouch)
        gradientBands: 3,
        rimColor: 0x60a5fa,
        rimPower: 2.6,
        rimIntensity: 0.70,
        shadowColor: 0x1d4ed8,
        shadowIntensity: 0.50,
      })
    );
    const glovePadMat = this.trackMat(
      createToonMaterial({
        color: 0x0f172a, // High-density shock absorption palm grip pads & knuckle base
        gradientBands: 3,
        rimColor: 0x334155,
        rimPower: 3.0,
        rimIntensity: 0.50,
        shadowColor: 0x020617,
        shadowIntensity: 0.65,
      })
    );
    const gloveKnuckleArmorMat = this.trackMat(
      createToonMaterial({
        color: 0x3b82f6, // Reinforced combat knuckle strike plates (luminous cobalt armor)
        gradientBands: 4,
        rimColor: 0x93c5fd,
        rimPower: 2.3,
        rimIntensity: 0.85,
        shadowColor: 0x1e3a8a,
        shadowIntensity: 0.55,
      })
    );
    const gloveStrapMat = this.trackMat(
      createToonMaterial({
        color: 0x1e293b, // Padded wrist strap
        gradientBands: 3,
        rimColor: 0x64748b,
        rimPower: 2.8,
        rimIntensity: 0.60,
        shadowColor: 0x0f172a,
        shadowIntensity: 0.55,
      })
    );
    const gloveBuckleGoldMat = this.trackMat(
      createToonMaterial({
        color: 0xf59e0b, // Golden metallic buckle & strap accents
        gradientBands: 3,
        rimColor: 0xfef08a,
        rimPower: 2.2,
        rimIntensity: 0.90,
        shadowColor: 0xb45309,
        shadowIntensity: 0.45,
      })
    );
    const sneakerDarkRedMat = this.trackMat(
      createToonMaterial({
        color: 0x991b1b, // Deep crimson leather heel-counter & quarter overlay
        gradientBands: 4,
        map: leatherSneakerTex,
        rimColor: 0xef4444,
        rimPower: 2.8,
        rimIntensity: 0.55,
        shadowColor: 0x450a0a,
        shadowIntensity: 0.60,
      })
    );
    const sneakerLaceWhiteMat = this.trackMat(
      createToonMaterial({
        color: 0xf8fafc, // Crisp athletic woven 3D shoelaces & tied bow
        gradientBands: 4,
        rimColor: 0xffffff,
        rimPower: 2.6,
        rimIntensity: 0.80,
        shadowColor: 0xcbd5e1,
        shadowIntensity: 0.45,
      })
    );
    const sneakerEyeletGoldMat = this.trackMat(
      createToonMaterial({
        color: 0xfbbf24, // Metallic golden lace eyelet rings & aglet tips
        gradientBands: 3,
        rimColor: 0xfef08a,
        rimPower: 2.2,
        rimIntensity: 0.90,
        shadowColor: 0xb45309,
        shadowIntensity: 0.45,
      })
    );
    const sneakerTongueTagMat = this.trackMat(
      createToonMaterial({
        color: 0x2563eb, // Royal blue woven athletic tongue patch
        gradientBands: 3,
        rimColor: 0x93c5fd,
        rimPower: 2.6,
        rimIntensity: 0.70,
        shadowColor: 0x1e3a8a,
        shadowIntensity: 0.50,
      })
    );
    const sneakerTreadBlackMat = this.trackMat(
      createToonMaterial({
        color: 0x090d16, // Heavy-duty rugged rubber outsole & grip lugs
        gradientBands: 3,
        map: rubberSoleTex,
        rimColor: 0x334155,
        rimPower: 3.2,
        rimIntensity: 0.40,
        shadowColor: 0x020617,
        shadowIntensity: 0.70,
      })
    );
    const sneakerStitchWhiteMat = this.trackMat(
      createToonMaterial({
        color: 0xffffff,
        gradientBands: 3,
        rimColor: 0xffffff,
        rimPower: 2.5,
        rimIntensity: 0.70,
        shadowColor: 0xcfd8dc,
        shadowIntensity: 0.40,
      })
    );
    const sneakerShellGrooveMat = this.trackMat(
      createToonMaterial({
        color: 0x94a3b8,
        gradientBands: 3,
        rimColor: 0xcbd5e1,
        rimPower: 3.0,
        rimIntensity: 0.50,
        shadowColor: 0x475569,
        shadowIntensity: 0.60,
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
    const torsoGeo = this.track(new THREE.LatheGeometry(torsoPoints, 36));
    torsoGeo.scale(1.0, 1.0, 0.90);
    const torsoMesh = new THREE.Mesh(torsoGeo, hoodieGreenMat);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    this.torsoGroup.add(torsoMesh);

    // --- 1. PADDED HOODIE COWL / COLLAR ROLL (Seamless Neck-to-Torso Transition) ---
    // Thick curved padded collar roll wrapping the neck aperture
    const collarCowlGeo = this.track(new THREE.TorusGeometry(0.24, 0.056, 24, 48));
    collarCowlGeo.scale(1.08, 0.86, 1.16);
    const collarCowl = new THREE.Mesh(collarCowlGeo, hoodieGreenMat);
    collarCowl.position.set(0, 0.335, 0.04);
    collarCowl.rotation.x = 0.18; // Tilted forward to rest naturally over the upper chest
    collarCowl.castShadow = true;
    collarCowl.receiveShadow = true;
    this.torsoGroup.add(collarCowl);

    // Dark green decorative collar accent trim rim
    const collarRimGeo = this.track(new THREE.TorusGeometry(0.26, 0.032, 20, 48));
    collarRimGeo.scale(1.08, 0.82, 1.18);
    const collarRim = new THREE.Mesh(collarRimGeo, hoodTrimDarkGreenMat);
    collarRim.position.set(0, 0.320, 0.04);
    collarRim.rotation.x = 0.16;
    collarRim.castShadow = true;
    this.torsoGroup.add(collarRim);

    // Solid inner neck plug bridging torso interior directly to hood cavity (zero voids)
    const neckPlugGeo = this.track(new THREE.CylinderGeometry(0.21, 0.19, 0.20, 32));
    const neckPlug = new THREE.Mesh(neckPlugGeo, hoodieGreenMat);
    neckPlug.position.set(0, 0.36, 0.01);
    this.torsoGroup.add(neckPlug);

    // --- 4. PELVIS & ANATOMICAL SHORTS WAISTBAND ---
    // Solid denim crotch saddle connecting hip sockets smoothly
    const crotchGussetGeo = this.track(new THREE.SphereGeometry(0.18, 24, 20));
    crotchGussetGeo.scale(1.04, 0.70, 0.88);
    const crotchGusset = new THREE.Mesh(crotchGussetGeo, shortsIndigoMat);
    crotchGusset.position.set(0, -0.32, 0.01);
    crotchGusset.castShadow = true;
    this.torsoGroup.add(crotchGusset);

    // Chunky anatomical waistband (cós com espessura real)
    const waistbandGeo = this.track(new THREE.TorusGeometry(0.305, 0.034, 14, 28));
    waistbandGeo.scale(1.02, 0.82, 0.88);
    const waistband = new THREE.Mesh(waistbandGeo, shortsIndigoMat);
    waistband.position.set(0, -0.27, 0.01);
    waistband.castShadow = true;
    this.torsoGroup.add(waistband);

    // Golden-amber contrast denim stitching along waistband (upper and lower seams)
    const topStitchGeo = this.track(new THREE.TorusGeometry(0.312, 0.006, 6, 28));
    topStitchGeo.scale(1.02, 0.82, 0.88);
    const topStitch = new THREE.Mesh(topStitchGeo, denimStitchMat);
    topStitch.position.set(0, -0.25, 0.01);
    this.torsoGroup.add(topStitch);

    const botStitchGeo = this.track(new THREE.TorusGeometry(0.312, 0.006, 6, 28));
    botStitchGeo.scale(1.02, 0.82, 0.88);
    const botStitch = new THREE.Mesh(botStitchGeo, denimStitchMat);
    botStitch.position.set(0, -0.29, 0.01);
    this.torsoGroup.add(botStitch);

    // Denim belt loops (passadeiras) around the waistband
    const loopAngles = [-1.15, -0.42, 0.42, 1.15, Math.PI];
    for (const ang of loopAngles) {
      const loopGeo = this.track(new THREE.BoxGeometry(0.024, 0.065, 0.02));
      const loopMesh = new THREE.Mesh(loopGeo, shortsIndigoMat);
      const lx = Math.sin(ang) * 0.315 * 1.02;
      const lz = Math.cos(ang) * 0.315 * 0.88;
      loopMesh.position.set(lx, -0.27, lz + 0.01);
      loopMesh.rotation.y = ang;
      loopMesh.castShadow = true;
      this.torsoGroup.add(loopMesh);
    }

    // Front denim fly (braguilha) with golden J-stitch
    const flySeamGeo = this.track(new THREE.BoxGeometry(0.014, 0.10, 0.015));
    const flySeam = new THREE.Mesh(flySeamGeo, denimStitchMat);
    flySeam.position.set(0.01, -0.33, 0.28);
    this.torsoGroup.add(flySeam);

    const jStitchGeo = this.track(new THREE.TorusGeometry(0.028, 0.006, 6, 12, Math.PI * 0.5));
    jStitchGeo.rotateZ(Math.PI * 0.5);
    const jStitch = new THREE.Mesh(jStitchGeo, denimStitchMat);
    jStitch.position.set(0.022, -0.38, 0.28);
    this.torsoGroup.add(jStitch);

    // Front waistband brass button / buckle
    const buttonGeo = this.track(new THREE.CylinderGeometry(0.030, 0.030, 0.016, 14));
    buttonGeo.rotateX(Math.PI / 2);
    const buttonMesh = new THREE.Mesh(buttonGeo, zipperYellowMat);
    buttonMesh.position.set(0, -0.27, 0.29);
    buttonMesh.castShadow = true;
    this.torsoGroup.add(buttonMesh);

    // --- 5. HOODIE HEM RIB (Thick Ribbed Elastic Knit Hem hugging the shorts) ---
    const hemGroup = new THREE.Group();
    hemGroup.position.set(0, -0.275, 0.01);

    // Thick padded toroidal elastic hem band
    const hemRibGeo = this.track(new THREE.TorusGeometry(0.324, 0.040, 16, 32));
    hemRibGeo.scale(1.03, 0.84, 0.90);
    const hemRib = new THREE.Mesh(hemRibGeo, hemRibbedGreenMat);
    hemRib.castShadow = true;
    hemRib.receiveShadow = true;
    hemGroup.add(hemRib);

    // Solid inner elastic cylinder seal
    const hemBandGeo = this.track(new THREE.CylinderGeometry(0.330, 0.322, 0.075, 24));
    hemBandGeo.scale(1.02, 1.0, 0.89);
    const hemBand = new THREE.Mesh(hemBandGeo, hemRibbedGreenMat);
    hemGroup.add(hemBand);

    // Horizontal compression trim rings
    const ringTopGeo = this.track(new THREE.TorusGeometry(0.332, 0.008, 8, 32));
    ringTopGeo.scale(1.03, 0.84, 0.90);
    const ringTop = new THREE.Mesh(ringTopGeo, hoodTrimDarkGreenMat);
    ringTop.position.set(0, 0.026, 0);
    hemGroup.add(ringTop);

    const ringBotGeo = this.track(new THREE.TorusGeometry(0.328, 0.008, 8, 32));
    ringBotGeo.scale(1.03, 0.84, 0.90);
    const ringBot = new THREE.Mesh(ringBotGeo, hoodTrimDarkGreenMat);
    ringBot.position.set(0, -0.026, 0);
    hemGroup.add(ringBot);

    // Ribbed knit vertical micro-ribs around the hem circumference
    const ribBarGeo = this.track(new THREE.BoxGeometry(0.014, 0.060, 0.016));
    for (let a = 0; a < 24; a++) {
      const ang = (a / 24) * Math.PI * 2;
      const rx = Math.sin(ang) * 0.331 * 1.03;
      const rz = Math.cos(ang) * 0.331 * 0.90;
      const ribMesh = new THREE.Mesh(ribBarGeo, hoodTrimDarkGreenMat);
      ribMesh.position.set(rx, 0, rz);
      ribMesh.rotation.y = ang;
      hemGroup.add(ribMesh);
    }
    this.torsoGroup.add(hemGroup);

    // --- 6. ROYAL BLUE KANGAROO POUCH POCKET WITH WELTED ENTRIES & DOUBLE STITCHING ---
    const kangarooPocketGroup = new THREE.Group();

    // Curved volumetric pouch shell wrapped across the lower abdomen
    const pouchGeo = this.track(new THREE.CylinderGeometry(0.330, 0.352, 0.22, 20, 1, false, -0.75, 1.50));
    pouchGeo.scale(1.03, 1.0, 0.94);
    const pouchMesh = new THREE.Mesh(pouchGeo, pocketBlueMat);
    pouchMesh.position.set(0, -0.165, 0.035);
    pouchMesh.castShadow = true;
    pouchMesh.receiveShadow = true;
    kangarooPocketGroup.add(pouchMesh);

    // Padded curved upper pocket hem roll
    const pocketTopRimGeo = this.track(new THREE.TorusGeometry(0.328, 0.016, 8, 24, 1.42));
    pocketTopRimGeo.rotateZ(Math.PI * 0.5 - 0.71);
    pocketTopRimGeo.scale(1.03, 0.94, 1.0);
    pocketTopRimGeo.rotateX(Math.PI / 2);
    const pocketTopRim = new THREE.Mesh(pocketTopRimGeo, pocketBlueMat);
    pocketTopRim.position.set(0, -0.055, 0.035);
    pocketTopRim.castShadow = true;
    kangarooPocketGroup.add(pocketTopRim);

    // Double top-stitching along the upper rim
    for (let s = 0; s < 2; s++) {
      const topStitchGeo = this.track(new THREE.TorusGeometry(0.330, 0.0035, 4, 24, 1.38));
      topStitchGeo.rotateZ(Math.PI * 0.5 - 0.69);
      topStitchGeo.scale(1.03, 0.94, 1.0);
      topStitchGeo.rotateX(Math.PI / 2);
      const topStitch = new THREE.Mesh(topStitchGeo, denimStitchMat);
      topStitch.position.set(0, -0.062 - s * 0.012, 0.036);
      kangarooPocketGroup.add(topStitch);
    }

    // Inclined hand entry slits with padded blue welts and double edge stitching
    for (const xSign of [-1, 1]) {
      // Padded ribbed welt rim (debrum acolchoado)
      const weltGeo = this.track(new THREE.CapsuleGeometry(0.018, 0.18, 8, 12));
      const weltMesh = new THREE.Mesh(weltGeo, cuffRibbedBlueMat);
      weltMesh.position.set(xSign * 0.252, -0.155, 0.245);
      weltMesh.rotation.set(-0.12, xSign * 0.48, xSign * -0.65);
      weltMesh.castShadow = true;
      kangarooPocketGroup.add(weltMesh);

      // Deep interior shadow cavity for the hand opening
      const slitGeo = this.track(new THREE.CapsuleGeometry(0.012, 0.16, 6, 8));
      const slitMesh = new THREE.Mesh(slitGeo, faceShadowMat);
      slitMesh.position.set(xSign * 0.246, -0.155, 0.238);
      slitMesh.rotation.set(-0.12, xSign * 0.48, xSign * -0.65);
      kangarooPocketGroup.add(slitMesh);

      // Double top-stitching alongside the welt opening
      for (let s = 0; s < 2; s++) {
        const offset = 0.014 + s * 0.010;
        const weltStitchGeo = this.track(new THREE.CapsuleGeometry(0.0035, 0.18, 4, 8));
        const weltStitch = new THREE.Mesh(weltStitchGeo, denimStitchMat);
        weltStitch.position.set(
          xSign * (0.252 - offset * 0.65),
          -0.155 + offset * 0.35,
          0.245 + offset * 0.20
        );
        weltStitch.rotation.set(-0.12, xSign * 0.48, xSign * -0.65);
        kangarooPocketGroup.add(weltStitch);
      }
    }
    this.torsoGroup.add(kangarooPocketGroup);

    // --- 7. FRONT ZIPPER TRACK WITH 3D INTERLOCKING TEETH & HOLLOW TEARDROP PULLER ---
    // Dark green textile zipper tape base (starts cleanly above kangaroo pocket at y = -0.05 up to collar at y = 0.315)
    const zipperTrackLen = 0.365;
    const zipperTrackCenterY = 0.132;
    const zipperTapeGeo = this.track(new THREE.BoxGeometry(0.052, zipperTrackLen, 0.012));
    const zipperTape = new THREE.Mesh(zipperTapeGeo, hoodTrimDarkGreenMat);
    zipperTape.position.set(0, zipperTrackCenterY, 0.324);
    zipperTape.receiveShadow = true;
    this.torsoGroup.add(zipperTape);

    // 3D Interlocking metallic golden zipper teeth
    const numTeeth = 18;
    const toothGeo = this.track(new THREE.BoxGeometry(0.016, 0.012, 0.014));
    for (let i = 0; i < numTeeth; i++) {
      const ty = -0.045 + (i / (numTeeth - 1)) * (zipperTrackLen - 0.02);
      const toothX = i % 2 === 0 ? -0.009 : 0.009;
      const toothMesh = new THREE.Mesh(toothGeo, zipperYellowMat);
      toothMesh.position.set(toothX, ty, 0.328);
      toothMesh.castShadow = true;
      this.torsoGroup.add(toothMesh);
    }

    // Central continuous golden zipper guide rail
    const zipperRailGeo = this.track(new THREE.BoxGeometry(0.010, zipperTrackLen, 0.016));
    const zipperRail = new THREE.Mesh(zipperRailGeo, zipperYellowMat);
    zipperRail.position.set(0, zipperTrackCenterY, 0.328);
    this.torsoGroup.add(zipperRail);

    // Golden Top Stopper at collar notch
    const zipperStopperGeo = this.track(new THREE.BoxGeometry(0.050, 0.028, 0.034));
    const zipperStopper = new THREE.Mesh(zipperStopperGeo, zipperYellowMat);
    zipperStopper.position.set(0, 0.315, 0.328);
    zipperStopper.castShadow = true;
    this.torsoGroup.add(zipperStopper);

    // Golden Bottom Stopper at pocket top notch
    const zipperBotStopperGeo = this.track(new THREE.BoxGeometry(0.046, 0.022, 0.028));
    const zipperBotStopper = new THREE.Mesh(zipperBotStopperGeo, zipperYellowMat);
    zipperBotStopper.position.set(0, -0.050, 0.330);
    zipperBotStopper.castShadow = true;
    this.torsoGroup.add(zipperBotStopper);

    // Zipper Slider Assembly (Body, guide slots, bridge crown, and teardrop hollow puller)
    const sliderGroup = new THREE.Group();
    sliderGroup.position.set(0, 0.24, 0.345);

    // Slider wedge body
    const sliderBodyGeo = this.track(new THREE.BoxGeometry(0.065, 0.075, 0.042));
    const sliderBody = new THREE.Mesh(sliderBodyGeo, zipperYellowMat);
    sliderBody.castShadow = true;
    sliderGroup.add(sliderBody);

    // Side guide slots
    const slotGeo = this.track(new THREE.BoxGeometry(0.012, 0.065, 0.030));
    for (const xSign of [-1, 1]) {
      const slotMesh = new THREE.Mesh(slotGeo, hoodTrimDarkGreenMat);
      slotMesh.position.set(xSign * 0.030, 0, 0);
      sliderGroup.add(slotMesh);
    }

    // Slider bridge crown loop
    const bridgeGeo = this.track(new THREE.TorusGeometry(0.015, 0.005, 8, 14, Math.PI));
    bridgeGeo.rotateZ(Math.PI * 0.5);
    const bridgeMesh = new THREE.Mesh(bridgeGeo, zipperYellowMat);
    bridgeMesh.position.set(0, 0.01, 0.022);
    sliderGroup.add(bridgeMesh);

    // Teardrop Puller Tab with realistic hollow engagement ring and decorative teardrop hole
    const pullerShape = new THREE.Shape();
    pullerShape.moveTo(-0.022, 0.038);
    pullerShape.quadraticCurveTo(-0.022, 0.060, 0, 0.060);
    pullerShape.quadraticCurveTo(0.022, 0.060, 0.022, 0.038);
    pullerShape.quadraticCurveTo(0.028, 0.010, 0.025, -0.035);
    pullerShape.quadraticCurveTo(0.018, -0.068, 0, -0.068);
    pullerShape.quadraticCurveTo(-0.018, -0.068, -0.025, -0.035);
    pullerShape.quadraticCurveTo(-0.028, 0.010, -0.022, 0.038);

    // Top hollow hinge ring (where puller engages with the slider bridge)
    const ringHole = new THREE.Path();
    ringHole.absarc(0, 0.040, 0.009, 0, Math.PI * 2, true);
    pullerShape.holes.push(ringHole);

    // Stylized hollow teardrop cutout
    const teardropHole = new THREE.Path();
    teardropHole.moveTo(0, -0.012);
    teardropHole.quadraticCurveTo(0.011, -0.025, 0.010, -0.046);
    teardropHole.quadraticCurveTo(0, -0.054, -0.010, -0.046);
    teardropHole.quadraticCurveTo(-0.011, -0.025, 0, -0.012);
    pullerShape.holes.push(teardropHole);

    const pullerGeo = this.track(
      new THREE.ExtrudeGeometry(pullerShape, {
        depth: 0.010,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.003,
        bevelThickness: 0.003,
      })
    );
    pullerGeo.center();
    this.zipperPullerPivot.clear();
    this.zipperPullerPivot.position.set(0, 0.010, 0.026);
    this.zipperPullerPivot.rotation.set(0, 0, 0);
    sliderGroup.add(this.zipperPullerPivot);

    const pullerMesh = new THREE.Mesh(pullerGeo, zipperYellowMat);
    pullerMesh.position.set(0, -0.048, 0.002);
    pullerMesh.rotation.x = 0.12; // natural hanging dangle
    pullerMesh.castShadow = true;
    this.zipperPullerPivot.add(pullerMesh);

    this.torsoGroup.add(sliderGroup);

    // Cream Hoodie Drawstrings with Golden Tips (accurately connected)
    this.drawstringPivots = [];
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
      this.drawstringPivots.push({ group: drawstringGroup, baseRotZ: xSign * -0.07, side: xSign });
    }

    // --- 8. DORSAL BACK SPIKES (Continuing the hood crest line down to the tail root) ---
    const backSpikesData = [
      { y: 0.20, z: -0.345, rotX: -0.38, r: 0.054, h: 0.11 },
      { y: 0.04, z: -0.340, rotX: -0.26, r: 0.050, h: 0.10 },
      { y: -0.12, z: -0.315, rotX: -0.16, r: 0.046, h: 0.09 },
    ];
    for (const cfg of backSpikesData) {
      const spikeGeo = this.track(new THREE.ConeGeometry(cfg.r, cfg.h, 6));
      spikeGeo.rotateX(Math.PI / 2);
      const spike = new THREE.Mesh(spikeGeo, pocketBlueMat);
      spike.position.set(0, cfg.y, cfg.z);
      spike.rotation.x = cfg.rotX;
      spike.castShadow = true;
      this.torsoGroup.add(spike);
    }

    // ==========================================
    // 3. PREHENSILE SPIRAL CHAMELEON TAIL (7 progressive curled segments)
    // ==========================================
    const tailRoot = new THREE.Group();
    tailRoot.position.set(0, -0.26, -0.29);
    this.torsoGroup.add(tailRoot);

    const numTailSegs = 7;
    let prevTail = tailRoot;

    for (let t = 0; t < numTailSegs; t++) {
      const seg = new THREE.Group();
      const r = 0.115 - t * 0.012; // 0.115 down to 0.043

      if (t === 0) {
        seg.position.set(0, 0, 0);
      } else {
        const prevR = 0.115 - (t - 1) * 0.012;
        const stepDist = (prevR + r) * 0.76;
        seg.position.set(0, stepDist * 0.20, -stepDist * 0.95);
      }

      // Smooth overlapping node body with alternating emerald green & cobalt blue bands
      const segGeo = this.track(new THREE.SphereGeometry(r, 14, 12));
      segGeo.scale(1.0, 0.92, 1.22);
      const isBlue = t % 2 === 1;
      const segMesh = new THREE.Mesh(segGeo, isBlue ? pocketBlueMat : hoodieGreenMat);
      segMesh.position.set(0, 0, -r * 0.35);
      segMesh.castShadow = true;
      seg.add(segMesh);

      // Dorsal ridge spikes along the tail (tailDorsalSpikes) connecting with hood and back crests
      if (t < 6) {
        const spikeH = r * 0.85;
        const spikeR = r * 0.36;
        const spikeGeo = this.track(new THREE.ConeGeometry(spikeR, spikeH, 5));
        spikeGeo.rotateX(Math.PI * 0.5);
        const spikeMesh = new THREE.Mesh(spikeGeo, pocketBlueMat);
        spikeMesh.position.set(0, r * 0.88, -r * 0.35);
        spikeMesh.rotation.x = -0.25;
        spikeMesh.castShadow = true;
        seg.add(spikeMesh);
      }

      prevTail.add(seg);
      prevTail = seg;
      this.tailSegments.push(seg);
    }

    // ==========================================
    const hoodShellMat = this.trackMat(
      createToonMaterial({
        color: 0x22c55e,
        map: fabricTex,
        gradientBands: 4,
        rimColor: 0x86efac,
        rimPower: 3.2,
        rimIntensity: 0.45,
        shadowColor: 0x14532d,
        shadowIntensity: 0.50,
        side: THREE.DoubleSide,
      })
    );

    // ==========================================
    // 4. THE CHAMELEON HOOD & EXPRESSIVE HERO FACE
    // ==========================================
    // Head pivot at y = 1.48
    this.headGroup.position.set(0, 1.48, 0);
    this.modelRoot.add(this.headGroup);

    // --- 1. LEON'S BOY HEAD (Warm glowing peach skin base) ---
    const headBaseGeo = this.track(new THREE.SphereGeometry(0.25, 36, 30));
    headBaseGeo.scale(1.0, 1.05, 1.02);
    const headBase = new THREE.Mesh(headBaseGeo, skinToneMat);
    headBase.position.set(0, 0, 0);
    headBase.castShadow = true;
    this.headGroup.add(headBase);

    // --- 2. HIGH-RES CEL-SHADED ANIME FACE (Clearly Visible, Bright, Antialiased) ---
    // Curved face dish matching the head surface, placed PROUDLY on the front
    const faceGeo = this.track(new THREE.PlaneGeometry(0.44, 0.42, 24, 24));
    const facePos = faceGeo.attributes.position;
    for (let i = 0; i < facePos.count; i++) {
      const px = facePos.getX(i);
      const py = facePos.getY(i);
      // Dish curvature matching head radius 0.25
      const r2 = (px / 0.22) * (px / 0.22) + (py / 0.21) * (py / 0.21);
      const pz = -Math.max(0, r2) * 0.055;
      facePos.setZ(i, pz);
    }
    faceGeo.computeVertexNormals();
    const faceMesh = new THREE.Mesh(faceGeo, faceSkinMat);
    faceMesh.position.set(0, -0.015, 0.258);
    faceMesh.castShadow = true;
    this.headGroup.add(faceMesh);

    // --- 3. CHAMELEON HOODIE SHELL (Enveloping head from sides, back and top) ---
    // phi = 0.85*PI to 2.15*PI covers Right -> Back (-Z) -> Left, leaving Front (+Z) 100% wide open for face!
    const hoodGeo = this.track(
      new THREE.SphereGeometry(0.325, 48, 36, Math.PI * 0.85, Math.PI * 1.30, 0, Math.PI)
    );
    hoodGeo.scale(1.04, 1.06, 1.08);
    const hoodMesh = new THREE.Mesh(hoodGeo, hoodShellMat);
    hoodMesh.position.set(0, 0.01, -0.04);
    hoodMesh.castShadow = true;
    hoodMesh.receiveShadow = true;
    this.headGroup.add(hoodMesh);

    // Padded lower cowl hem on hood base that nests continuously into the torso collar roll
    const hoodCowlBaseGeo = this.track(new THREE.TorusGeometry(0.245, 0.044, 24, 48));
    hoodCowlBaseGeo.scale(1.05, 0.82, 1.10);
    const hoodCowlBase = new THREE.Mesh(hoodCowlBaseGeo, hoodieGreenMat);
    hoodCowlBase.position.set(0, -0.28, 0.01);
    hoodCowlBase.rotation.x = 0.14;
    hoodCowlBase.castShadow = true;
    this.headGroup.add(hoodCowlBase);

    // Dark Green Chameleon Hood Face Rim (Frames the boy's face opening seamlessly)
    const hoodRimGeo = this.track(new THREE.TorusGeometry(0.245, 0.030, 24, 48));
    hoodRimGeo.scale(1.02, 1.10, 0.50);
    const hoodRim = new THREE.Mesh(hoodRimGeo, hoodTrimDarkGreenMat);
    hoodRim.position.set(0, 0.01, 0.160);
    hoodRim.castShadow = true;
    this.headGroup.add(hoodRim);

    // Curved Hood Visor / Brim over the forehead (Stylized upward cap visor)
    const visorShape = new THREE.Shape();
    visorShape.moveTo(-0.20, 0);
    visorShape.quadraticCurveTo(0, 0.10, 0.20, 0);
    visorShape.quadraticCurveTo(0, 0.04, -0.20, 0);

    const visorGeo = this.track(
      new THREE.ExtrudeGeometry(visorShape, {
        depth: 0.028,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.010,
        bevelThickness: 0.010,
      })
    );
    visorGeo.center();
    const visorMesh = new THREE.Mesh(visorGeo, hoodTrimDarkGreenMat);
    visorMesh.position.set(0, 0.22, 0.19);
    visorMesh.rotation.set(0.35, 0, 0);
    visorMesh.castShadow = true;
    this.headGroup.add(visorMesh);

    // Helper to sculpt curved 3D anime hair strands with smooth 16-segment cross-section
    const createCurvedHairStrand = (
      widthRoot: number,
      widthMid: number,
      thickness: number,
      length: number,
      archZ: number,      // Forward bulge/arch away from forehead
      sweepX: number,     // Lateral curve/sweep
      tipCurlZ: number,   // Sharp forward/inward tip curl
      fraySplit: number = 0 // Optional feathered/split tip angle
    ): THREE.BufferGeometry => {
      // 16 radial segments create a smooth, rounded anime spine
      // 16 height segments provide buttery-smooth curvature
      const geo = this.track(new THREE.CylinderGeometry(0.002, widthRoot, length, 16, 16, true));
      geo.translate(0, -length / 2, 0);

      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const yVal = pos.getY(i);
        const t = THREE.MathUtils.clamp(-yVal / length, 0, 1); // 0 at root, 1 at tip

        // Swell width to widthMid at t ~ 0.35, then smoothly taper to sharp blade tip
        const widthScale = t < 0.35
          ? THREE.MathUtils.lerp(1.0, widthMid / Math.max(0.001, widthRoot), t / 0.35)
          : THREE.MathUtils.lerp(widthMid / Math.max(0.001, widthRoot), 0.06, (t - 0.35) / 0.65);

        let x = pos.getX(i) * widthScale;
        let z = pos.getZ(i) * (thickness / Math.max(0.001, widthRoot)) * widthScale;

        // Dynamic 3D bending:
        z += Math.sin(t * Math.PI * 0.85) * archZ + (t * t) * tipCurlZ;
        x += Math.pow(t, 1.35) * sweepX;

        if (t > 0.70 && fraySplit !== 0) {
          const frayT = (t - 0.70) / 0.30;
          x += frayT * fraySplit;
        }

        pos.setXYZ(i, x, yVal, z);
      }

      geo.computeVertexNormals();
      return geo;
    };

    // ==========================================
    // 4.1. LEON'S 8-STRAND LAYERED ANIME HAIR BANGS
    // ==========================================
    const bangsGroup = new THREE.Group();
    bangsGroup.position.set(0, 0.14, 0.245);

    // --- LAYER 1: 2 DEEP SHADOW STRANDS IN PETROL TEAL (Ambient Occlusion Depth) ---
    const s7Geo = createCurvedHairStrand(0.034, 0.042, 0.022, 0.120, 0.014, -0.028, 0.008);
    const s7Mesh = new THREE.Mesh(s7Geo, hairShadowTealMat);
    s7Mesh.position.set(-0.040, 0.010, -0.010);
    s7Mesh.rotation.set(0.12, 0, 0.05);
    bangsGroup.add(s7Mesh);

    const s8Geo = createCurvedHairStrand(0.036, 0.044, 0.022, 0.125, 0.014, 0.030, 0.008);
    const s8Mesh = new THREE.Mesh(s8Geo, hairShadowTealMat);
    s8Mesh.position.set(0.045, 0.010, -0.010);
    s8Mesh.rotation.set(0.12, 0, -0.05);
    bangsGroup.add(s8Mesh);

    // --- LAYER 2: 2 VOLUMINOUS CENTRAL LOCKS (Forward Curvature & Frayed Tips) ---
    const s1Geo = createCurvedHairStrand(0.048, 0.062, 0.034, 0.150, 0.032, 0.024, 0.018, 0.012);
    const s1Mesh = new THREE.Mesh(s1Geo, hairTealMat);
    s1Mesh.position.set(-0.012, 0.015, 0.014);
    s1Mesh.rotation.set(0.16, -0.05, 0.04);
    s1Mesh.castShadow = true;
    bangsGroup.add(s1Mesh);

    const s1FrayGeo = createCurvedHairStrand(0.020, 0.026, 0.016, 0.068, 0.018, -0.016, 0.014);
    const s1FrayMesh = new THREE.Mesh(s1FrayGeo, hairTealMat);
    s1FrayMesh.position.set(-0.006, -0.060, 0.024);
    s1FrayMesh.rotation.set(0.18, 0, -0.15);
    s1FrayMesh.castShadow = true;
    bangsGroup.add(s1FrayMesh);

    const s1HlGeo = createCurvedHairStrand(0.024, 0.028, 0.012, 0.090, 0.034, 0.016, 0.010);
    const s1HlMesh = new THREE.Mesh(s1HlGeo, hairHighlightCyanMat);
    s1HlMesh.position.set(-0.012, 0.015, 0.022);
    s1HlMesh.rotation.set(0.16, -0.05, 0.04);
    bangsGroup.add(s1HlMesh);

    const s2Geo = createCurvedHairStrand(0.044, 0.056, 0.032, 0.138, 0.030, -0.026, 0.018, -0.010);
    const s2Mesh = new THREE.Mesh(s2Geo, hairTealMat);
    s2Mesh.position.set(0.020, 0.012, 0.010);
    s2Mesh.rotation.set(0.15, 0.04, -0.06);
    s2Mesh.castShadow = true;
    bangsGroup.add(s2Mesh);

    const s2FrayGeo = createCurvedHairStrand(0.018, 0.024, 0.014, 0.062, 0.016, 0.014, 0.012);
    const s2FrayMesh = new THREE.Mesh(s2FrayGeo, hairTealMat);
    s2FrayMesh.position.set(0.010, -0.055, 0.020);
    s2FrayMesh.rotation.set(0.16, 0, 0.14);
    s2FrayMesh.castShadow = true;
    bangsGroup.add(s2FrayMesh);

    const s2HlGeo = createCurvedHairStrand(0.022, 0.026, 0.012, 0.082, 0.032, -0.016, 0.010);
    const s2HlMesh = new THREE.Mesh(s2HlGeo, hairHighlightCyanMat);
    s2HlMesh.position.set(0.020, 0.012, 0.018);
    s2HlMesh.rotation.set(0.15, 0.04, -0.06);
    bangsGroup.add(s2HlMesh);

    // --- LAYER 3: 2 AERODYNAMIC LATERAL LOCKS (Framing Temples) ---
    const s3Geo = createCurvedHairStrand(0.040, 0.048, 0.026, 0.130, 0.024, -0.050, 0.016);
    const s3Mesh = new THREE.Mesh(s3Geo, hairTealMat);
    s3Mesh.position.set(-0.075, 0.008, 0.004);
    s3Mesh.rotation.set(0.14, -0.10, 0.28);
    s3Mesh.castShadow = true;
    bangsGroup.add(s3Mesh);

    const s4Geo = createCurvedHairStrand(0.040, 0.050, 0.026, 0.132, 0.024, 0.048, 0.016);
    const s4Mesh = new THREE.Mesh(s4Geo, hairTealMat);
    s4Mesh.position.set(0.078, 0.008, 0.004);
    s4Mesh.rotation.set(0.14, 0.10, -0.28);
    s4Mesh.castShadow = true;
    bangsGroup.add(s4Mesh);

    // --- LAYER 4: 2 WISPY ACCENT TIPS ---
    const s5Geo = createCurvedHairStrand(0.024, 0.028, 0.016, 0.105, 0.020, -0.020, 0.022);
    const s5Mesh = new THREE.Mesh(s5Geo, hairTealMat);
    s5Mesh.position.set(-0.045, 0.005, 0.016);
    s5Mesh.rotation.set(0.18, -0.06, 0.12);
    s5Mesh.castShadow = true;
    bangsGroup.add(s5Mesh);

    const s6Geo = createCurvedHairStrand(0.026, 0.030, 0.016, 0.110, 0.022, 0.018, 0.024);
    const s6Mesh = new THREE.Mesh(s6Geo, hairTealMat);
    s6Mesh.position.set(0.050, 0.006, 0.016);
    s6Mesh.rotation.set(0.18, 0.06, -0.10);
    s6Mesh.castShadow = true;
    bangsGroup.add(s6Mesh);

    this.headGroup.add(bangsGroup);

    // ==========================================
    // 4.2. ICONIC 3D CARTOON CANDY LOLLIPOP
    // ==========================================
    const lollipopGroup = new THREE.Group();
    // Clean, visible placement protruding from the right corner of Leon's confident smirk
    lollipopGroup.position.set(0.046, -0.088, 0.256);
    lollipopGroup.rotation.set(0.14, 0.32, -0.28);

    // Clean white plastic stick
    const stickLen = 0.13;
    const stickGeo = this.track(new THREE.CylinderGeometry(0.0055, 0.0055, stickLen, 16));
    stickGeo.rotateZ(Math.PI / 2);
    const stickMesh = new THREE.Mesh(stickGeo, lollipopStickMat);
    stickMesh.position.set(stickLen * 0.42, 0, 0);
    stickMesh.castShadow = true;
    lollipopGroup.add(stickMesh);

    // Round glossy strawberry pink candy sphere (32x24 segments)
    const candyGeo = this.track(new THREE.SphereGeometry(0.044, 32, 24));
    const candyMesh = new THREE.Mesh(candyGeo, lollipopCandyMat);
    candyMesh.position.set(stickLen + 0.015, 0, 0);
    candyMesh.castShadow = true;
    lollipopGroup.add(candyMesh);

    // Sweet vanilla candy swirl ring
    const candySwirlGeo = this.track(new THREE.TorusGeometry(0.038, 0.004, 12, 32));
    candySwirlGeo.rotateY(Math.PI / 2);
    candySwirlGeo.rotateX(0.35);
    const candySwirl = new THREE.Mesh(candySwirlGeo, lollipopSwirlWhiteMat);
    candySwirl.position.set(stickLen + 0.015, 0, 0);
    lollipopGroup.add(candySwirl);

    // Specular gloss reflection dot
    const candyGlossGeo = this.track(new THREE.SphereGeometry(0.011, 12, 12));
    candyGlossGeo.scale(1.0, 0.6, 0.3);
    const candyGloss = new THREE.Mesh(candyGlossGeo, lollipopGlossMat);
    candyGloss.position.set(stickLen + 0.015, 0.018, 0.035);
    candyGloss.rotation.set(0.2, -0.2, 0.3);
    lollipopGroup.add(candyGloss);

    this.headGroup.add(lollipopGroup);

    // ==========================================
    // 5. CHAMELEON EYES ON TOP OF HOOD (Cute, Rounded, Proportionate)
    // ==========================================
    const buildChamEyeTurret = (xSign: number) => {
      const turretRoot = new THREE.Group();
      turretRoot.position.set(xSign * 0.17, 0.28, 0.03);
      turretRoot.rotation.set(-0.12, xSign * 0.22, xSign * 0.16);

      // 1. Smooth Base Transition Collar
      const baseCollarGeo = this.track(new THREE.TorusGeometry(0.100, 0.018, 16, 32));
      baseCollarGeo.scale(1.04, 0.85, 1.04);
      const baseCollar = new THREE.Mesh(baseCollarGeo, hoodieGreenMat);
      baseCollar.position.set(0, 0, -0.01);
      turretRoot.add(baseCollar);

      // 2. Green Eyeball Turret Dome (Buttery Smooth 36x30 segments)
      const turretDomeGeo = this.track(new THREE.SphereGeometry(0.108, 36, 30));
      turretDomeGeo.scale(1.02, 0.98, 1.04);
      const turretDome = new THREE.Mesh(turretDomeGeo, hoodieGreenMat);
      turretDome.castShadow = true;
      turretDome.receiveShadow = true;
      turretRoot.add(turretDome);

      // 3. Nested Vibrant Amber Eyeball (Smooth 36x30 segments)
      const eyeballGeo = this.track(new THREE.SphereGeometry(0.096, 36, 30));
      eyeballGeo.scale(1.0, 1.0, 0.76);
      const eyeball = new THREE.Mesh(eyeballGeo, chamEyeYellowMat);
      eyeball.position.set(0, 0, 0.040);
      turretRoot.add(eyeball);

      // 4. Vertical Slit Pupil with Soft Amber Halo
      const pupilHaloGeo = this.track(new THREE.CapsuleGeometry(0.018, 0.052, 12, 16));
      pupilHaloGeo.scale(1.15, 1.05, 0.35);
      const pupilHalo = new THREE.Mesh(pupilHaloGeo, chamEyePupilBorderMat);
      pupilHalo.position.set(0, 0, 0.104);
      turretRoot.add(pupilHalo);

      const pupilGeo = this.track(new THREE.CapsuleGeometry(0.014, 0.048, 12, 16));
      pupilGeo.scale(1.0, 1.0, 0.35);
      const pupil = new THREE.Mesh(pupilGeo, chamEyePupilMat);
      pupil.position.set(0, 0, 0.108);
      turretRoot.add(pupil);

      // 5. Specular Catchlights
      const hlMainGeo = this.track(new THREE.SphereGeometry(0.015, 16, 16));
      hlMainGeo.scale(1.0, 1.0, 0.4);
      const hlMain = new THREE.Mesh(hlMainGeo, chamEyeHighlightMat);
      hlMain.position.set(xSign * 0.022, 0.026, 0.112);
      turretRoot.add(hlMain);

      // 6. Smooth Curved Upper Eyelid (Sleepy/Confident Chameleon Squint)
      const upperLidGeo = this.track(new THREE.SphereGeometry(0.110, 36, 24, 0, Math.PI, 0, Math.PI * 0.54));
      upperLidGeo.rotateX(Math.PI * 0.54);
      upperLidGeo.rotateZ(xSign * 0.16);
      const upperLid = new THREE.Mesh(upperLidGeo, hoodieGreenMat);
      upperLid.position.set(0, 0.016, 0.032);
      upperLid.castShadow = true;
      turretRoot.add(upperLid);

      // Smooth Eyelid Edge Rim
      const upperRimGeo = this.track(new THREE.TorusGeometry(0.102, 0.014, 14, 32, Math.PI * 0.88));
      upperRimGeo.rotateZ(Math.PI * 0.06 + xSign * 0.16);
      const upperRim = new THREE.Mesh(upperRimGeo, hoodTrimDarkGreenMat);
      upperRim.position.set(0, 0.020, 0.064);
      upperRim.rotation.x = -0.16;
      upperRim.castShadow = true;
      turretRoot.add(upperRim);

      return turretRoot;
    };

    this.headGroup.add(buildChamEyeTurret(-1));
    this.headGroup.add(buildChamEyeTurret(1));

    // Chameleon Ridge Spikes along Back of Hood (16 segments)
    for (let r = 0; r < 4; r++) {
      const spikeGeo = this.track(new THREE.ConeGeometry(0.045, 0.09, 16));
      spikeGeo.rotateX(Math.PI / 2);
      const spike = new THREE.Mesh(spikeGeo, pocketBlueMat);
      spike.position.set(0, 0.28 - r * 0.10, -0.24 - r * 0.05);
      spike.rotation.x = -0.3 - r * 0.2;
      spike.castShadow = true;
      this.headGroup.add(spike);
    }

    // ==========================================
    // 6. ARMS & CARTOON HANDS
    // ==========================================
    const buildLeonArm = (xSign: number, pivot: THREE.Group) => {
      // Natural anatomical shoulder attachment connected to torsoGroup (moves seamlessly with torso bounce)
      pivot.position.set(xSign * 0.29, 0.24, 0);
      this.torsoGroup.add(pivot);

      // --- 2. VOLUMINOUS HOODIE DELTOID SHOULDER & NATURAL DRAPE ---
      // Voluminous deltoid shoulder cap with puffy fabric fullness (36x30 segments)
      const shoulderGeo = this.track(new THREE.SphereGeometry(0.155, 36, 30));
      shoulderGeo.scale(1.05, 0.98, 1.05);
      const shoulder = new THREE.Mesh(shoulderGeo, hoodieGreenMat);
      shoulder.castShadow = true;
      pivot.add(shoulder);

      // Raglan hoodie shoulder seam ridge
      const raglanGeo = this.track(new THREE.TorusGeometry(0.148, 0.018, 16, 32));
      raglanGeo.rotateZ(xSign * 0.25);
      const raglan = new THREE.Mesh(raglanGeo, hoodTrimDarkGreenMat);
      raglan.castShadow = true;
      pivot.add(raglan);

      // Upper sleeve with loose fabric drape (32 segments)
      const upperArmGeo = this.track(new THREE.CylinderGeometry(0.148, 0.126, 0.24, 32));
      upperArmGeo.translate(0, -0.14, 0);
      const upperArm = new THREE.Mesh(upperArmGeo, hoodieGreenMat);
      upperArm.castShadow = true;
      pivot.add(upperArm);

      // Elbow fabric gathering fold (natural oversized hoodie fold - 20x32 segments)
      const elbowFoldGeo = this.track(new THREE.TorusGeometry(0.130, 0.024, 20, 32));
      elbowFoldGeo.scale(1.04, 0.92, 1.04);
      const elbowFold = new THREE.Mesh(elbowFoldGeo, hoodieGreenMat);
      elbowFold.position.set(0, -0.22, 0);
      elbowFold.castShadow = true;
      pivot.add(elbowFold);

      // Lower sleeve section entering cuff (32 segments)
      const lowerArmGeo = this.track(new THREE.CylinderGeometry(0.128, 0.118, 0.12, 32));
      lowerArmGeo.translate(0, -0.28, 0);
      const lowerArm = new THREE.Mesh(lowerArmGeo, hoodieGreenMat);
      lowerArm.castShadow = true;
      pivot.add(lowerArm);

      // --- 3. BLUE RIBBED CUFF & ANATOMICALLY TAPERED FOREARM TRANSITION ---
      // Thick royal blue ribbed sleeve cuff cylinder (32 segments)
      const cuffCylGeo = this.track(new THREE.CylinderGeometry(0.124, 0.118, 0.075, 32));
      cuffCylGeo.translate(0, -0.32, 0);
      const cuffCyl = new THREE.Mesh(cuffCylGeo, pocketBlueMat);
      cuffCyl.castShadow = true;
      pivot.add(cuffCyl);

      // Beveled outer cuff rim with rich ribbed toon shader (16x32 segments)
      const cuffRimGeo = this.track(new THREE.TorusGeometry(0.120, 0.028, 16, 32));
      cuffRimGeo.rotateX(Math.PI / 2);
      const cuffRim = new THREE.Mesh(cuffRimGeo, cuffRibbedBlueMat);
      cuffRim.position.set(0, -0.34, 0);
      cuffRim.castShadow = true;
      pivot.add(cuffRim);

      // Dark interior shadow liner sealing the sleeve cuff opening
      const cuffLinerGeo = this.track(new THREE.CylinderGeometry(0.095, 0.095, 0.04, 24));
      cuffLinerGeo.translate(0, -0.31, 0);
      const cuffLiner = new THREE.Mesh(cuffLinerGeo, faceShadowMat);
      pivot.add(cuffLiner);

      // Anatomically tapered peach forearm emerging from deep inside sleeve cuff (28 segments)
      const forearmGeo = this.track(new THREE.CylinderGeometry(0.082, 0.065, 0.19, 28));
      forearmGeo.scale(1.04, 1.0, 0.94);
      forearmGeo.translate(0, -0.355, 0.008);
      const forearm = new THREE.Mesh(forearmGeo, skinToneMat);
      forearm.castShadow = true;
      pivot.add(forearm);

      // Subtle carpal wrist styloid process ring right before meeting hand
      const wristHeadGeo = this.track(new THREE.TorusGeometry(0.068, 0.010, 12, 28));
      wristHeadGeo.rotateX(Math.PI / 2);
      const wristHead = new THREE.Mesh(wristHeadGeo, skinToneMat);
      wristHead.position.set(0, -0.425, 0.010);
      pivot.add(wristHead);

      // ==========================================
      // LOOP 4: COMBAT BRAWLER GLOVE & 4 ARTICULATED FINGERS
      // ==========================================
      const handGroup = new THREE.Group();
      handGroup.position.set(0, -0.44, 0.015);
      pivot.add(handGroup);

      // --- 1. PADDED WRIST STRAP, CONTRAST PIPING & CLOSURE TAB ---
      // Wrist cuff cylinder wrapped around carpal joint
      const wristCuffGeo = this.track(new THREE.CylinderGeometry(0.076, 0.072, 0.046, 18));
      wristCuffGeo.translate(0, 0.008, 0);
      const wristCuff = new THREE.Mesh(wristCuffGeo, gloveStrapMat);
      wristCuff.castShadow = true;
      handGroup.add(wristCuff);

      // Upper & lower contrast royal blue debrum / piping rims
      const wristTrimTopGeo = this.track(new THREE.TorusGeometry(0.074, 0.007, 8, 20));
      wristTrimTopGeo.rotateX(Math.PI / 2);
      const wristTrimTop = new THREE.Mesh(wristTrimTopGeo, gloveTrimMat);
      wristTrimTop.position.set(0, 0.028, 0);
      wristTrimTop.castShadow = true;
      handGroup.add(wristTrimTop);

      const wristTrimBotGeo = this.track(new THREE.TorusGeometry(0.073, 0.007, 8, 20));
      wristTrimBotGeo.rotateX(Math.PI / 2);
      const wristTrimBot = new THREE.Mesh(wristTrimBotGeo, gloveTrimMat);
      wristTrimBot.position.set(0, -0.012, 0);
      wristTrimBot.castShadow = true;
      handGroup.add(wristTrimBot);

      // Lateral wrist velcro strap tab with golden clasp / buckle
      const strapTabGeo = this.track(new THREE.BoxGeometry(0.018, 0.034, 0.042));
      const strapTab = new THREE.Mesh(strapTabGeo, gloveMainMat);
      strapTab.position.set(xSign * 0.072, 0.008, 0.012);
      strapTab.castShadow = true;
      handGroup.add(strapTab);

      const strapBuckleGeo = this.track(new THREE.BoxGeometry(0.020, 0.022, 0.016));
      const strapBuckle = new THREE.Mesh(strapBuckleGeo, gloveBuckleGoldMat);
      strapBuckle.position.set(xSign * 0.074, 0.008, 0.022);
      handGroup.add(strapBuckle);

      // Dark interior wrist liner sealing forearm to glove (zero visual voids)
      const wristLinerGeo = this.track(new THREE.CylinderGeometry(0.065, 0.065, 0.03, 14));
      wristLinerGeo.translate(0, 0.020, 0);
      const wristLiner = new THREE.Mesh(wristLinerGeo, faceShadowMat);
      handGroup.add(wristLiner);

      // --- 2. SCULPTED GLOVE PALM CHASSIS & DORSAL IMPACT PLATE ---
      // Sculpted glove palm sphere
      const palmGeo = this.track(new THREE.SphereGeometry(0.096, 16, 14));
      palmGeo.scale(1.12, 0.90, 0.94);
      const palm = new THREE.Mesh(palmGeo, gloveMainMat);
      palm.position.set(0, -0.040, 0.005);
      palm.castShadow = true;
      handGroup.add(palm);

      // Dorsal hand padded armor shield plate (placa dorsal acolchoada da luva)
      const dorsalPlateGeo = this.track(new THREE.BoxGeometry(0.126, 0.066, 0.026));
      const dorsalPlate = new THREE.Mesh(dorsalPlateGeo, gloveMainMat);
      dorsalPlate.position.set(0, -0.036, 0.052);
      dorsalPlate.rotation.x = -0.15;
      dorsalPlate.castShadow = true;
      handGroup.add(dorsalPlate);

      // Piping accent framing dorsal armor plate
      const dorsalTrimTopGeo = this.track(new THREE.CapsuleGeometry(0.006, 0.108, 4, 8));
      dorsalTrimTopGeo.rotateZ(Math.PI / 2);
      const dorsalTrimTop = new THREE.Mesh(dorsalTrimTopGeo, gloveTrimMat);
      dorsalTrimTop.position.set(0, -0.012, 0.056);
      handGroup.add(dorsalTrimTop);

      // --- 3. 3D ERGONOMIC PALM GRIP PADS (High-Friction Grip Pads) ---
      // Thenar eminence grip pad (almofada tenar, base do polegar no lado medial)
      const thenarPadGeo = this.track(new THREE.SphereGeometry(0.036, 10, 8));
      thenarPadGeo.scale(1.0, 1.35, 0.50);
      const thenarPad = new THREE.Mesh(thenarPadGeo, glovePadMat);
      thenarPad.position.set(-xSign * 0.042, -0.044, -0.050);
      thenarPad.castShadow = true;
      handGroup.add(thenarPad);

      // Hypothenar grip pad (almofada hipotenar no lado lateral)
      const hypoPadGeo = this.track(new THREE.SphereGeometry(0.032, 10, 8));
      hypoPadGeo.scale(0.90, 1.40, 0.50);
      const hypoPad = new THREE.Mesh(hypoPadGeo, glovePadMat);
      hypoPad.position.set(xSign * 0.042, -0.044, -0.050);
      hypoPad.castShadow = true;
      handGroup.add(hypoPad);

      // Transverse palm grip bar across metacarpal heads (barra transversal de pegada)
      const palmGripBarGeo = this.track(new THREE.CapsuleGeometry(0.015, 0.072, 6, 10));
      palmGripBarGeo.rotateZ(Math.PI / 2);
      const palmGripBar = new THREE.Mesh(palmGripBarGeo, glovePadMat);
      palmGripBar.position.set(0, -0.068, -0.046);
      palmGripBar.castShadow = true;
      handGroup.add(palmGripBar);

      // --- 4. 3D REINFORCED KNUCKLE ARMOR (Nós dos Dedos em Relevo) ---
      // Transverse knuckle bridge ridge
      const knuckleBridgeGeo = this.track(new THREE.BoxGeometry(0.138, 0.028, 0.024));
      const knuckleBridge = new THREE.Mesh(knuckleBridgeGeo, gloveMainMat);
      knuckleBridge.position.set(0, -0.060, 0.062);
      knuckleBridge.rotation.x = 0.15;
      knuckleBridge.castShadow = true;
      handGroup.add(knuckleBridge);

      // 3 Raised 3D knuckle cushions (Index, Middle, Pinky)
      // Index knuckle cushion (medial)
      const indexKnuckleGeo = this.track(new THREE.CapsuleGeometry(0.016, 0.024, 6, 8));
      indexKnuckleGeo.rotateZ(Math.PI / 2);
      const indexKnuckle = new THREE.Mesh(indexKnuckleGeo, gloveKnuckleArmorMat);
      indexKnuckle.position.set(-xSign * 0.044, -0.060, 0.070);
      indexKnuckle.castShadow = true;
      handGroup.add(indexKnuckle);

      // Middle knuckle cushion (prominent apex of strike fist)
      const midKnuckleGeo = this.track(new THREE.CapsuleGeometry(0.019, 0.028, 6, 8));
      midKnuckleGeo.rotateZ(Math.PI / 2);
      const midKnuckle = new THREE.Mesh(midKnuckleGeo, gloveKnuckleArmorMat);
      midKnuckle.position.set(0.0, -0.064, 0.076);
      midKnuckle.castShadow = true;
      handGroup.add(midKnuckle);

      // Pinky knuckle cushion (lateral)
      const pinkyKnuckleGeo = this.track(new THREE.CapsuleGeometry(0.015, 0.022, 6, 8));
      pinkyKnuckleGeo.rotateZ(Math.PI / 2);
      const pinkyKnuckle = new THREE.Mesh(pinkyKnuckleGeo, gloveKnuckleArmorMat);
      pinkyKnuckle.position.set(xSign * 0.044, -0.060, 0.068);
      pinkyKnuckle.castShadow = true;
      handGroup.add(pinkyKnuckle);

      // Metallic impact rivets on each knuckle cushion
      const knucklePositions = [
        new THREE.Vector3(-xSign * 0.044, -0.060, 0.078),
        new THREE.Vector3(0.0, -0.064, 0.084),
        new THREE.Vector3(xSign * 0.044, -0.060, 0.076),
      ];
      for (const pos of knucklePositions) {
        const rivetGeo = this.track(new THREE.SphereGeometry(0.005, 6, 6));
        const rivet = new THREE.Mesh(rivetGeo, gloveBuckleGoldMat);
        rivet.position.copy(pos);
        handGroup.add(rivet);
      }

      // --- 5. 4 ARTICULATED CARTOON BRAWLER FINGERS IN ATHLETIC COMBAT GRIP ---
      // 1) POLEGAR OPOSITOR VOLUMOSO (Voluminous Opposable Thumb with multi-phalanx articulation)
      const thumbRoot = new THREE.Group();
      thumbRoot.position.set(-xSign * 0.064, -0.018, 0.032);
      thumbRoot.rotation.set(-0.24, -xSign * 0.48, -xSign * 0.62);
      handGroup.add(thumbRoot);

      // Voluminous thenar glove sleeve
      const thumbSleeveGeo = this.track(new THREE.CylinderGeometry(0.035, 0.031, 0.042, 10));
      thumbSleeveGeo.translate(0, -0.014, 0);
      const thumbSleeve = new THREE.Mesh(thumbSleeveGeo, gloveMainMat);
      thumbSleeve.castShadow = true;
      thumbRoot.add(thumbSleeve);

      // Thumb sleeve contrast debrum ring
      const thumbTrimGeo = this.track(new THREE.TorusGeometry(0.033, 0.005, 6, 12));
      thumbTrimGeo.rotateX(Math.PI / 2);
      const thumbTrim = new THREE.Mesh(thumbTrimGeo, gloveTrimMat);
      thumbTrim.position.set(0, -0.020, 0);
      thumbRoot.add(thumbTrim);

      // Proximal phalanx (falange proximal)
      const thumbProxGeo = this.track(new THREE.CapsuleGeometry(0.027, 0.036, 8, 10));
      thumbProxGeo.translate(0, -0.034, 0);
      const thumbProx = new THREE.Mesh(thumbProxGeo, gloveMainMat);
      thumbProx.castShadow = true;
      thumbRoot.add(thumbProx);

      // Interphalangeal joint cushion (nó articulado do polegar)
      const thumbJointGeo = this.track(new THREE.SphereGeometry(0.026, 8, 8));
      const thumbJoint = new THREE.Mesh(thumbJointGeo, gloveKnuckleArmorMat);
      thumbJoint.position.set(0, -0.048, 0.008);
      thumbJoint.castShadow = true;
      thumbRoot.add(thumbJoint);

      // Distal phalanx group curving naturally inward across fist into combat lock
      const thumbDistGroup = new THREE.Group();
      thumbDistGroup.position.set(0, -0.048, 0);
      thumbDistGroup.rotation.set(-0.52, 0, -xSign * 0.22);
      thumbRoot.add(thumbDistGroup);

      const thumbDistGeo = this.track(new THREE.CapsuleGeometry(0.024, 0.034, 8, 10));
      thumbDistGeo.translate(0, -0.018, 0);
      const thumbDist = new THREE.Mesh(thumbDistGeo, skinToneMat);
      thumbDist.castShadow = true;
      thumbDistGroup.add(thumbDist);

      // Sculpted thumb pad (almofada carnosa do polegar)
      const thumbPadGeo = this.track(new THREE.SphereGeometry(0.018, 8, 6));
      thumbPadGeo.scale(1.0, 1.2, 0.6);
      const thumbPad = new THREE.Mesh(thumbPadGeo, skinToneMat);
      thumbPad.position.set(0, -0.024, -0.012);
      thumbDistGroup.add(thumbPad);

      // 2) DEDO INDICADOR (Index Finger with proximal/distal phalanges in athletic semi-closed curl)
      const indexRoot = new THREE.Group();
      indexRoot.position.set(-xSign * 0.044, -0.074, 0.050);
      handGroup.add(indexRoot);

      const indexTrimGeo = this.track(new THREE.TorusGeometry(0.023, 0.005, 6, 12));
      indexTrimGeo.rotateX(Math.PI / 2);
      const indexTrim = new THREE.Mesh(indexTrimGeo, gloveTrimMat);
      indexRoot.add(indexTrim);

      const indexProxGroup = new THREE.Group();
      indexProxGroup.rotation.set(-0.72, 0, -xSign * 0.08);
      indexRoot.add(indexProxGroup);

      const indexProxGeo = this.track(new THREE.CapsuleGeometry(0.023, 0.038, 8, 10));
      indexProxGeo.translate(0, -0.020, 0);
      const indexProx = new THREE.Mesh(indexProxGeo, gloveMainMat);
      indexProx.castShadow = true;
      indexProxGroup.add(indexProx);

      const indexPipGeo = this.track(new THREE.SphereGeometry(0.022, 8, 8));
      const indexPip = new THREE.Mesh(indexPipGeo, glovePadMat);
      indexPip.position.set(0, -0.040, 0);
      indexProxGroup.add(indexPip);

      const indexDistGroup = new THREE.Group();
      indexDistGroup.position.set(0, -0.040, 0);
      indexDistGroup.rotation.set(-0.75, 0, 0);
      indexProxGroup.add(indexDistGroup);

      const indexDistGeo = this.track(new THREE.CapsuleGeometry(0.020, 0.032, 8, 10));
      indexDistGeo.translate(0, -0.016, 0);
      const indexDist = new THREE.Mesh(indexDistGeo, skinToneMat);
      indexDist.castShadow = true;
      indexDistGroup.add(indexDist);

      const indexPadGeo = this.track(new THREE.SphereGeometry(0.016, 8, 6));
      indexPadGeo.scale(1.0, 1.1, 0.6);
      const indexPad = new THREE.Mesh(indexPadGeo, skinToneMat);
      indexPad.position.set(0, -0.022, -0.010);
      indexDistGroup.add(indexPad);

      // 3) DEDO MÉDIO (Middle Finger - Longest, most powerful central knuckle)
      const midRoot = new THREE.Group();
      midRoot.position.set(0.0, -0.080, 0.056);
      handGroup.add(midRoot);

      const midTrimGeo = this.track(new THREE.TorusGeometry(0.025, 0.005, 6, 12));
      midTrimGeo.rotateX(Math.PI / 2);
      const midTrim = new THREE.Mesh(midTrimGeo, gloveTrimMat);
      midRoot.add(midTrim);

      const midProxGroup = new THREE.Group();
      midProxGroup.rotation.set(-0.78, 0, 0);
      midRoot.add(midProxGroup);

      const midProxGeo = this.track(new THREE.CapsuleGeometry(0.025, 0.044, 8, 10));
      midProxGeo.translate(0, -0.022, 0);
      const midProx = new THREE.Mesh(midProxGeo, gloveMainMat);
      midProx.castShadow = true;
      midProxGroup.add(midProx);

      const midPipGeo = this.track(new THREE.SphereGeometry(0.024, 8, 8));
      const midPip = new THREE.Mesh(midPipGeo, glovePadMat);
      midPip.position.set(0, -0.044, 0);
      midProxGroup.add(midPip);

      const midDistGroup = new THREE.Group();
      midDistGroup.position.set(0, -0.044, 0);
      midDistGroup.rotation.set(-0.80, 0, 0);
      midProxGroup.add(midDistGroup);

      const midDistGeo = this.track(new THREE.CapsuleGeometry(0.022, 0.036, 8, 10));
      midDistGeo.translate(0, -0.018, 0);
      const midDist = new THREE.Mesh(midDistGeo, skinToneMat);
      midDist.castShadow = true;
      midDistGroup.add(midDist);

      const midPadGeo = this.track(new THREE.SphereGeometry(0.017, 8, 6));
      midPadGeo.scale(1.0, 1.1, 0.6);
      const midPad = new THREE.Mesh(midPadGeo, skinToneMat);
      midPad.position.set(0, -0.024, -0.010);
      midDistGroup.add(midPad);

      // 4) DEDO MÍNIMO (Pinky Finger - Compact athletic lateral curl)
      const pinkyRoot = new THREE.Group();
      pinkyRoot.position.set(xSign * 0.044, -0.074, 0.046);
      handGroup.add(pinkyRoot);

      const pinkyTrimGeo = this.track(new THREE.TorusGeometry(0.021, 0.005, 6, 12));
      pinkyTrimGeo.rotateX(Math.PI / 2);
      const pinkyTrim = new THREE.Mesh(pinkyTrimGeo, gloveTrimMat);
      pinkyRoot.add(pinkyTrim);

      const pinkyProxGroup = new THREE.Group();
      pinkyProxGroup.rotation.set(-0.72, 0, xSign * 0.10);
      pinkyRoot.add(pinkyProxGroup);

      const pinkyProxGeo = this.track(new THREE.CapsuleGeometry(0.021, 0.034, 8, 10));
      pinkyProxGeo.translate(0, -0.018, 0);
      const pinkyProx = new THREE.Mesh(pinkyProxGeo, gloveMainMat);
      pinkyProx.castShadow = true;
      pinkyProxGroup.add(pinkyProx);

      const pinkyPipGeo = this.track(new THREE.SphereGeometry(0.020, 8, 8));
      const pinkyPip = new THREE.Mesh(pinkyPipGeo, glovePadMat);
      pinkyPip.position.set(0, -0.036, 0);
      pinkyProxGroup.add(pinkyPip);

      const pinkyDistGroup = new THREE.Group();
      pinkyDistGroup.position.set(0, -0.036, 0);
      pinkyDistGroup.rotation.set(-0.82, 0, 0);
      pinkyProxGroup.add(pinkyDistGroup);

      const pinkyDistGeo = this.track(new THREE.CapsuleGeometry(0.019, 0.030, 8, 10));
      pinkyDistGeo.translate(0, -0.015, 0);
      const pinkyDist = new THREE.Mesh(pinkyDistGeo, skinToneMat);
      pinkyDist.castShadow = true;
      pinkyDistGroup.add(pinkyDist);

      const pinkyPadGeo = this.track(new THREE.SphereGeometry(0.015, 8, 6));
      pinkyPadGeo.scale(1.0, 1.1, 0.6);
      const pinkyPad = new THREE.Mesh(pinkyPadGeo, skinToneMat);
      pinkyPad.position.set(0, -0.020, -0.009);
      pinkyDistGroup.add(pinkyPad);
    };

    buildLeonArm(-1, this.leftArmPivot);
    buildLeonArm(1, this.rightArmPivot);

    // ==========================================
    // 7. LEGS & CHUNKY BRAWLER SNEAKERS
    // ==========================================
    const buildLeonLeg = (xSign: number, pivot: THREE.Group) => {
      // Hip joint pivot on modelRoot
      pivot.position.set(xSign * 0.17, 0.60, 0);
      this.modelRoot.add(pivot);

      // --- 4. SHORTS LEG & EXPOSED LEG WITH SUBTLE KNEE ---
      // Hip socket dome sealing the leg top into pelvis (28x22 segments)
      const hipCapGeo = this.track(new THREE.SphereGeometry(0.18, 28, 22));
      const hipCap = new THREE.Mesh(hipCapGeo, shortsIndigoMat);
      hipCap.position.set(0, 0.02, 0);
      hipCap.castShadow = true;
      pivot.add(hipCap);

      // Chunky Dark Indigo Denim Shorts Leg (32 segments)
      const shortGeo = this.track(new THREE.CylinderGeometry(0.182, 0.168, 0.23, 32));
      shortGeo.translate(0, -0.11, 0);
      const shorts = new THREE.Mesh(shortGeo, shortsIndigoMat);
      shorts.castShadow = true;
      pivot.add(shorts);

      // Thick folded denim hem cuff (bainha dobrada da bermuda - 16x32 segments)
      const cuffGeo = this.track(new THREE.TorusGeometry(0.168, 0.026, 16, 32));
      cuffGeo.rotateX(Math.PI / 2);
      const cuff = new THREE.Mesh(cuffGeo, shortsIndigoMat);
      cuff.position.set(0, -0.21, 0);
      cuff.castShadow = true;
      pivot.add(cuff);

      // Golden denim hem stitch line (32 segments)
      const hemStitchGeo = this.track(new THREE.TorusGeometry(0.171, 0.006, 8, 32));
      hemStitchGeo.rotateX(Math.PI / 2);
      const hemStitch = new THREE.Mesh(hemStitchGeo, denimStitchMat);
      hemStitch.position.set(0, -0.20, 0);
      pivot.add(hemStitch);

      // Dark interior cavity shadow liner inside shorts hem
      const legLinerGeo = this.track(new THREE.CylinderGeometry(0.145, 0.145, 0.05, 24));
      legLinerGeo.translate(0, -0.20, 0);
      const legLiner = new THREE.Mesh(legLinerGeo, faceShadowMat);
      pivot.add(legLiner);

      // Upper thigh starting deep inside shorts (-0.05) to ensure zero skin gaps (28 segments)
      const thighGeo = this.track(new THREE.CylinderGeometry(0.125, 0.115, 0.18, 28));
      thighGeo.translate(0, -0.14, 0);
      const thigh = new THREE.Mesh(thighGeo, skinToneMat);
      thigh.castShadow = true;
      pivot.add(thigh);

      // Knee joint with subtle anatomical contour (28 segments)
      const kneeGeo = this.track(new THREE.CylinderGeometry(0.115, 0.108, 0.10, 28));
      kneeGeo.translate(0, -0.24, 0);
      const knee = new THREE.Mesh(kneeGeo, skinToneMat);
      knee.castShadow = true;
      pivot.add(knee);

      // Subtle Patella / Knee Cap curvature (18x16 segments)
      const patellaGeo = this.track(new THREE.SphereGeometry(0.048, 18, 16));
      patellaGeo.scale(1.1, 1.2, 0.6);
      const patella = new THREE.Mesh(patellaGeo, skinToneMat);
      patella.position.set(0, -0.235, 0.098);
      patella.castShadow = true;
      pivot.add(patella);

      // Smooth anatomical calf tapering towards ankle (28 segments)
      const calfGeo = this.track(new THREE.CylinderGeometry(0.106, 0.088, 0.16, 28));
      calfGeo.translate(0, -0.32, 0.008);
      const calf = new THREE.Mesh(calfGeo, skinToneMat);
      calf.castShadow = true;
      pivot.add(calf);

      // --- 5. ATHLETIC ANKLE SOCK & PADDED SNEAKER COLLAR RIM ---
      // White athletic crew sock body entering deep into the shoe collar (28 segments)
      const sockGeo = this.track(new THREE.CylinderGeometry(0.094, 0.090, 0.12, 28));
      sockGeo.translate(0, -0.38, 0.02);
      const sock = new THREE.Mesh(sockGeo, sockWhiteMat);
      sock.castShadow = true;
      pivot.add(sock);

      // Padded ribbed sock cuff at top of sock (16x32 segments)
      const sockCuffGeo = this.track(new THREE.TorusGeometry(0.096, 0.020, 16, 32));
      sockCuffGeo.rotateX(Math.PI / 2);
      const sockCuff = new THREE.Mesh(sockCuffGeo, sockWhiteMat);
      sockCuff.position.set(0, -0.34, 0.015);
      sockCuff.castShadow = true;
      pivot.add(sockCuff);

      // Retro athletic blue sock stripe (32 segments)
      const sockStripeGeo = this.track(new THREE.TorusGeometry(0.098, 0.007, 8, 32));
      sockStripeGeo.rotateX(Math.PI / 2);
      const sockStripe = new THREE.Mesh(sockStripeGeo, sockStripeBlueMat);
      sockStripe.position.set(0, -0.345, 0.015);
      pivot.add(sockStripe);

      // ==========================================
      // LOOP 4: DETAILED CHUNKY BRAWLER SNEAKER
      // ==========================================
      const shoeGroup = new THREE.Group();
      shoeGroup.position.set(0, -0.36, 0.04);
      pivot.add(shoeGroup);

      // --- 1. PADDED SNEAKER COLLAR, ACHILLES TAB & INTERIOR CAVITY ---
      // Padded white sneaker collar / opening rim (gola acolchoada do cano do tênis)
      const shoeCollarGeo = this.track(new THREE.TorusGeometry(0.122, 0.038, 12, 24));
      shoeCollarGeo.scale(0.96, 0.88, 1.15);
      const shoeCollar = new THREE.Mesh(shoeCollarGeo, sneakerCollarMat);
      shoeCollar.position.set(0, -0.045, 0.08);
      shoeCollar.rotation.x = 0.16;
      shoeCollar.castShadow = true;
      shoeGroup.add(shoeCollar);

      // Padded Achilles heel cushion / collar tab at rear of sneaker opening
      const heelTabGeo = this.track(new THREE.BoxGeometry(0.13, 0.065, 0.04));
      const heelTab = new THREE.Mesh(heelTabGeo, sneakerCollarMat);
      heelTab.position.set(0, -0.025, -0.045);
      heelTab.rotation.x = -0.15;
      heelTab.castShadow = true;
      shoeGroup.add(heelTab);

      // Dark interior cavity shadow sealing the shoe collar around the sock
      const shoeSocketGeo = this.track(new THREE.CylinderGeometry(0.092, 0.092, 0.06, 14));
      shoeSocketGeo.translate(0, -0.065, 0.08);
      const shoeSocket = new THREE.Mesh(shoeSocketGeo, faceShadowMat);
      shoeGroup.add(shoeSocket);

      // --- 2. MULTI-PANEL LEATHER UPPER WITH DOUBLE TOPSTITCHING SEAMS ---
      // Crimson Red Sneaker Body (base do cabedal)
      const upperGeo = this.track(new THREE.CapsuleGeometry(0.132, 0.22, 10, 16));
      upperGeo.rotateX(Math.PI / 2);
      upperGeo.translate(0, -0.12, 0.08);
      const upper = new THREE.Mesh(upperGeo, sneakerRedMat);
      upper.castShadow = true;
      shoeGroup.add(upper);

      // Deep Crimson Heel Counter Panel (painel de reforço traseiro do calcanhar)
      const heelCounterGeo = this.track(new THREE.CylinderGeometry(0.138, 0.140, 0.12, 16, 1, false, Math.PI * 0.5, Math.PI));
      const heelCounter = new THREE.Mesh(heelCounterGeo, sneakerDarkRedMat);
      heelCounter.position.set(0, -0.12, -0.02);
      heelCounter.castShadow = true;
      shoeGroup.add(heelCounter);

      // Deep Crimson Quarter Flank Panels (painéis laterais dinâmicos esportivos)
      const leftQuarterGeo = this.track(new THREE.BoxGeometry(0.018, 0.082, 0.22));
      const leftQuarter = new THREE.Mesh(leftQuarterGeo, sneakerDarkRedMat);
      leftQuarter.position.set(-0.134, -0.12, 0.08);
      leftQuarter.castShadow = true;
      shoeGroup.add(leftQuarter);

      const rightQuarterGeo = this.track(new THREE.BoxGeometry(0.018, 0.082, 0.22));
      const rightQuarter = new THREE.Mesh(rightQuarterGeo, sneakerDarkRedMat);
      rightQuarter.position.set(0.134, -0.12, 0.08);
      rightQuarter.castShadow = true;
      shoeGroup.add(rightQuarter);

      // Eyestay Reinforcement Leather Panels (reforço onde passam os cadarços)
      const leftEyestayGeo = this.track(new THREE.BoxGeometry(0.026, 0.155, 0.020));
      const leftEyestay = new THREE.Mesh(leftEyestayGeo, sneakerDarkRedMat);
      leftEyestay.position.set(-0.062, -0.045, 0.170);
      leftEyestay.rotation.x = -0.34;
      leftEyestay.castShadow = true;
      shoeGroup.add(leftEyestay);

      const rightEyestayGeo = this.track(new THREE.BoxGeometry(0.026, 0.155, 0.020));
      const rightEyestay = new THREE.Mesh(rightEyestayGeo, sneakerDarkRedMat);
      rightEyestay.position.set(0.062, -0.045, 0.170);
      rightEyestay.rotation.x = -0.34;
      rightEyestay.castShadow = true;
      shoeGroup.add(rightEyestay);

      // Costuras Esportivas Pespontadas (Double-stitched white topseams)
      // Heel counter upper stitch seam
      const heelStitchGeo = this.track(new THREE.TorusGeometry(0.140, 0.004, 6, 18, Math.PI));
      heelStitchGeo.rotateX(Math.PI / 2);
      const heelStitch = new THREE.Mesh(heelStitchGeo, sneakerStitchWhiteMat);
      heelStitch.position.set(0, -0.062, -0.02);
      shoeGroup.add(heelStitch);

      // Eyestay lateral stitch lines
      const leftEyestayStitchGeo = this.track(new THREE.CapsuleGeometry(0.004, 0.148, 4, 6));
      const leftEyestayStitch = new THREE.Mesh(leftEyestayStitchGeo, sneakerStitchWhiteMat);
      leftEyestayStitch.position.set(-0.076, -0.045, 0.172);
      leftEyestayStitch.rotation.x = -0.34;
      shoeGroup.add(leftEyestayStitch);

      const rightEyestayStitchGeo = this.track(new THREE.CapsuleGeometry(0.004, 0.148, 4, 6));
      const rightEyestayStitch = new THREE.Mesh(rightEyestayStitchGeo, sneakerStitchWhiteMat);
      rightEyestayStitch.position.set(0.076, -0.045, 0.172);
      rightEyestayStitch.rotation.x = -0.34;
      shoeGroup.add(rightEyestayStitch);

      // Flank swoosh accent stitch lines
      const leftFlankStitchGeo = this.track(new THREE.CapsuleGeometry(0.004, 0.18, 4, 6));
      const leftFlankStitch = new THREE.Mesh(leftFlankStitchGeo, sneakerStitchWhiteMat);
      leftFlankStitch.position.set(-0.136, -0.11, 0.08);
      leftFlankStitch.rotation.set(0.15, 0, 0.05);
      shoeGroup.add(leftFlankStitch);

      const rightFlankStitchGeo = this.track(new THREE.CapsuleGeometry(0.004, 0.18, 4, 6));
      const rightFlankStitch = new THREE.Mesh(rightFlankStitchGeo, sneakerStitchWhiteMat);
      rightFlankStitch.position.set(0.136, -0.11, 0.08);
      rightFlankStitch.rotation.set(0.15, 0, -0.05);
      shoeGroup.add(rightFlankStitch);

      // --- 3. PADDED TONGUE ELEVATED BEFORE SHIN WITH WOVEN ATHLETIC TAG ---
      // Padded sneaker tongue rising high in front of the shin/sock
      const tongueGeo = this.track(new THREE.BoxGeometry(0.126, 0.185, 0.042));
      const tongue = new THREE.Mesh(tongueGeo, sneakerWhiteMat);
      tongue.position.set(0, -0.025, 0.180);
      tongue.rotation.x = -0.34;
      tongue.castShadow = true;
      shoeGroup.add(tongue);

      // Rolled cushioned top lip of the tongue
      const tongueLipGeo = this.track(new THREE.CylinderGeometry(0.021, 0.021, 0.124, 12));
      tongueLipGeo.rotateZ(Math.PI / 2);
      const tongueLip = new THREE.Mesh(tongueLipGeo, sneakerCollarMat);
      tongueLip.position.set(0, 0.050, 0.208);
      tongueLip.castShadow = true;
      shoeGroup.add(tongueLip);

      // Woven Athletic Logo Tag / Patch on upper tongue
      const tagPatchGeo = this.track(new THREE.BoxGeometry(0.066, 0.056, 0.010));
      const tagPatch = new THREE.Mesh(tagPatchGeo, sneakerTongueTagMat);
      tagPatch.position.set(0, 0.024, 0.222);
      tagPatch.rotation.x = -0.34;
      shoeGroup.add(tagPatch);

      // White stitched border framing the tag
      const tagBorderGeo = this.track(new THREE.BoxGeometry(0.070, 0.060, 0.004));
      const tagBorder = new THREE.Mesh(tagBorderGeo, sneakerStitchWhiteMat);
      tagBorder.position.set(0, 0.024, 0.219);
      tagBorder.rotation.x = -0.34;
      shoeGroup.add(tagBorder);

      // Golden Brawler star / emblem centered on the tag
      const tagStarGeo = this.track(new THREE.SphereGeometry(0.012, 8, 6));
      tagStarGeo.scale(1.2, 1.2, 0.5);
      const tagStar = new THREE.Mesh(tagStarGeo, sneakerEyeletGoldMat);
      tagStar.position.set(0, 0.025, 0.229);
      tagStar.rotation.x = -0.34;
      shoeGroup.add(tagStar);

      // --- 4. 3D CROSSED LACES WITH TIED BOW OVER THE INSTEP ---
      // 3 Pairs of Golden Metallic Eyelets
      const eyeletCoords = [
        { x: -0.058, y: -0.088, z: 0.155 },
        { x:  0.058, y: -0.088, z: 0.155 },
        { x: -0.058, y: -0.042, z: 0.176 },
        { x:  0.058, y: -0.042, z: 0.176 },
        { x: -0.058, y:  0.008, z: 0.198 },
        { x:  0.058, y:  0.008, z: 0.198 },
      ];
      for (const ec of eyeletCoords) {
        const eyeletGeo = this.track(new THREE.TorusGeometry(0.011, 0.0035, 6, 12));
        eyeletGeo.rotateY(Math.PI / 2);
        const eyelet = new THREE.Mesh(eyeletGeo, sneakerEyeletGoldMat);
        eyelet.position.set(ec.x, ec.y, ec.z);
        eyelet.rotation.x = -0.34;
        shoeGroup.add(eyelet);
      }

      // Bottom straight horizontal lace bar
      const botLaceGeo = this.track(new THREE.CylinderGeometry(0.007, 0.007, 0.106, 8));
      botLaceGeo.rotateZ(Math.PI / 2);
      const botLace = new THREE.Mesh(botLaceGeo, sneakerLaceWhiteMat);
      botLace.position.set(0, -0.088, 0.160);
      botLace.castShadow = true;
      shoeGroup.add(botLace);

      // Lower 3D Crossed Laces (X1)
      const crossLaceA_Geo = this.track(new THREE.CylinderGeometry(0.0065, 0.0065, 0.126, 8));
      const crossLaceA = new THREE.Mesh(crossLaceA_Geo, sneakerLaceWhiteMat);
      crossLaceA.position.set(0, -0.065, 0.172);
      crossLaceA.rotation.set(-0.34, 0, 0.40);
      crossLaceA.castShadow = true;
      shoeGroup.add(crossLaceA);

      const crossLaceB_Geo = this.track(new THREE.CylinderGeometry(0.0065, 0.0065, 0.126, 8));
      const crossLaceB = new THREE.Mesh(crossLaceB_Geo, sneakerLaceWhiteMat);
      crossLaceB.position.set(0, -0.065, 0.178);
      crossLaceB.rotation.set(-0.34, 0, -0.40);
      crossLaceB.castShadow = true;
      shoeGroup.add(crossLaceB);

      // Upper 3D Crossed Laces (X2)
      const crossLaceC_Geo = this.track(new THREE.CylinderGeometry(0.0065, 0.0065, 0.126, 8));
      const crossLaceC = new THREE.Mesh(crossLaceC_Geo, sneakerLaceWhiteMat);
      crossLaceC.position.set(0, -0.017, 0.194);
      crossLaceC.rotation.set(-0.34, 0, 0.40);
      crossLaceC.castShadow = true;
      shoeGroup.add(crossLaceC);

      const crossLaceD_Geo = this.track(new THREE.CylinderGeometry(0.0065, 0.0065, 0.126, 8));
      const crossLaceD = new THREE.Mesh(crossLaceD_Geo, sneakerLaceWhiteMat);
      crossLaceD.position.set(0, -0.017, 0.200);
      crossLaceD.rotation.set(-0.34, 0, -0.40);
      crossLaceD.castShadow = true;
      shoeGroup.add(crossLaceD);

      // Tied Shoelace Bow (Laço Superior Modelado Sobre o Peito do Pé)
      const bowKnotGeo = this.track(new THREE.SphereGeometry(0.016, 8, 8));
      bowKnotGeo.scale(1.2, 0.9, 0.9);
      const bowKnot = new THREE.Mesh(bowKnotGeo, sneakerLaceWhiteMat);
      bowKnot.position.set(0, 0.018, 0.216);
      bowKnot.castShadow = true;
      shoeGroup.add(bowKnot);

      // Left Bow Loop
      const bowLoopLeftGeo = this.track(new THREE.TorusGeometry(0.024, 0.0065, 8, 16, Math.PI * 1.6));
      const bowLoopLeft = new THREE.Mesh(bowLoopLeftGeo, sneakerLaceWhiteMat);
      bowLoopLeft.position.set(-0.026, 0.030, 0.224);
      bowLoopLeft.rotation.set(0.35, -0.45, 0.70);
      bowLoopLeft.castShadow = true;
      shoeGroup.add(bowLoopLeft);

      // Right Bow Loop
      const bowLoopRightGeo = this.track(new THREE.TorusGeometry(0.024, 0.0065, 8, 16, Math.PI * 1.6));
      const bowLoopRight = new THREE.Mesh(bowLoopRightGeo, sneakerLaceWhiteMat);
      bowLoopRight.position.set(0.026, 0.030, 0.224);
      bowLoopRight.rotation.set(0.35, 0.45, -0.70);
      bowLoopRight.castShadow = true;
      shoeGroup.add(bowLoopRight);

      // Drooping Lace Aglet Tails with dynamic jiggle pivots
      const agletLeftPivot = new THREE.Group();
      agletLeftPivot.position.set(-0.020, 0.012, 0.222);
      agletLeftPivot.rotation.set(0.20, 0, 0.40);

      const agletLeftLen = 0.055;
      const agletLeftGeo = this.track(new THREE.CylinderGeometry(0.0055, 0.0055, agletLeftLen, 6));
      const agletLeft = new THREE.Mesh(agletLeftGeo, sneakerLaceWhiteMat);
      agletLeft.position.set(0, -agletLeftLen / 2, 0);
      agletLeft.castShadow = true;
      agletLeftPivot.add(agletLeft);

      const agletTipLeftLen = 0.014;
      const agletTipLeftGeo = this.track(new THREE.CylinderGeometry(0.006, 0.006, agletTipLeftLen, 6));
      const agletTipLeft = new THREE.Mesh(agletTipLeftGeo, sneakerEyeletGoldMat);
      agletTipLeft.position.set(0, -agletLeftLen - agletTipLeftLen / 2 + 0.002, 0);
      agletLeftPivot.add(agletTipLeft);

      shoeGroup.add(agletLeftPivot);
      this.sneakerAgletPivots.push({ pivot: agletLeftPivot, baseRotX: 0.20, baseRotZ: 0.40, isLeftShoe: xSign < 0, side: -1 });

      const agletRightPivot = new THREE.Group();
      agletRightPivot.position.set(0.020, 0.012, 0.222);
      agletRightPivot.rotation.set(0.20, 0, -0.40);

      const agletRightLen = 0.055;
      const agletRightGeo = this.track(new THREE.CylinderGeometry(0.0055, 0.0055, agletRightLen, 6));
      const agletRight = new THREE.Mesh(agletRightGeo, sneakerLaceWhiteMat);
      agletRight.position.set(0, -agletRightLen / 2, 0);
      agletRight.castShadow = true;
      agletRightPivot.add(agletRight);

      const agletTipRightLen = 0.014;
      const agletTipRightGeo = this.track(new THREE.CylinderGeometry(0.006, 0.006, agletTipRightLen, 6));
      const agletTipRight = new THREE.Mesh(agletTipRightGeo, sneakerEyeletGoldMat);
      agletTipRight.position.set(0, -agletRightLen - agletTipRightLen / 2 + 0.002, 0);
      agletRightPivot.add(agletTipRight);

      shoeGroup.add(agletRightPivot);
      this.sneakerAgletPivots.push({ pivot: agletRightPivot, baseRotX: 0.20, baseRotZ: -0.40, isLeftShoe: xSign < 0, side: 1 });

      // --- 5. SHELL-TOE WITH 3D RADIAL GROOVES (Biqueira de Concha com Frisos Estriados - 36x24 segments) ---
      // Sculpted rubber dome shell cap (smooth 36x24 segments)
      const toeCapGeo = this.track(new THREE.SphereGeometry(0.144, 36, 24, 0, Math.PI, 0, Math.PI * 0.58));
      toeCapGeo.rotateX(Math.PI / 2);
      const toeCap = new THREE.Mesh(toeCapGeo, sneakerWhiteMat);
      toeCap.position.set(0, -0.14, 0.25);
      toeCap.scale.set(0.98, 0.74, 0.84);
      toeCap.castShadow = true;
      shoeGroup.add(toeCap);

      // 5 Molded 3D Radial Frisos Estriados radiating from top of shell-toe to sole (16 segments)
      // Center Rib
      const ribCenterGeo = this.track(new THREE.CylinderGeometry(0.007, 0.009, 0.115, 16));
      const ribCenter = new THREE.Mesh(ribCenterGeo, sneakerWhiteMat);
      ribCenter.position.set(0, -0.138, 0.288);
      ribCenter.rotation.x = 0.52;
      ribCenter.castShadow = true;
      shoeGroup.add(ribCenter);

      // Left Medial Rib
      const ribLeftMedGeo = this.track(new THREE.CylinderGeometry(0.0065, 0.0085, 0.110, 16));
      const ribLeftMed = new THREE.Mesh(ribLeftMedGeo, sneakerWhiteMat);
      ribLeftMed.position.set(-0.036, -0.139, 0.282);
      ribLeftMed.rotation.set(0.50, 0, 0.20);
      ribLeftMed.castShadow = true;
      shoeGroup.add(ribLeftMed);

      // Right Medial Rib
      const ribRightMedGeo = this.track(new THREE.CylinderGeometry(0.0065, 0.0085, 0.110, 16));
      const ribRightMed = new THREE.Mesh(ribRightMedGeo, sneakerWhiteMat);
      ribRightMed.position.set(0.036, -0.139, 0.282);
      ribRightMed.rotation.set(0.50, 0, -0.20);
      ribRightMed.castShadow = true;
      shoeGroup.add(ribRightMed);

      // Left Outer Rib
      const ribLeftOutGeo = this.track(new THREE.CylinderGeometry(0.006, 0.008, 0.100, 16));
      const ribLeftOut = new THREE.Mesh(ribLeftOutGeo, sneakerWhiteMat);
      ribLeftOut.position.set(-0.068, -0.142, 0.266);
      ribLeftOut.rotation.set(0.46, 0, 0.40);
      ribLeftOut.castShadow = true;
      shoeGroup.add(ribLeftOut);

      // Right Outer Rib
      const ribRightOutGeo = this.track(new THREE.CylinderGeometry(0.006, 0.008, 0.100, 16));
      const ribRightOut = new THREE.Mesh(ribRightOutGeo, sneakerWhiteMat);
      ribRightOut.position.set(0.068, -0.142, 0.266);
      ribRightOut.rotation.set(0.46, 0, -0.40);
      ribRightOut.castShadow = true;
      shoeGroup.add(ribRightOut);

      // Shaded groove lines flanking ribs for crisp graphic definition
      const grooveOffsets = [-0.052, -0.018, 0.018, 0.052];
      for (const gx of grooveOffsets) {
        const grooveGeo = this.track(new THREE.CapsuleGeometry(0.003, 0.095, 4, 6));
        const groove = new THREE.Mesh(grooveGeo, sneakerShellGrooveMat);
        groove.position.set(gx, -0.140, 0.278);
        groove.rotation.set(0.50, 0, gx * -1.8);
        shoeGroup.add(groove);
      }

      // --- 6. CHUNKY FLANGED SOLE, RIBBED SIDEWALLS & 3D TRACTION OUTSOLE ---
      // Thick White Molded Rubber Sole (Midsole platform)
      const soleGeo = this.track(new THREE.BoxGeometry(0.292, 0.088, 0.490));
      soleGeo.translate(0, -0.218, 0.09);
      const sole = new THREE.Mesh(soleGeo, sneakerWhiteMat);
      sole.castShadow = true;
      shoeGroup.add(sole);

      // Sole Dark Racing Groove Stripe
      const stripeGeo = this.track(new THREE.BoxGeometry(0.296, 0.016, 0.470));
      stripeGeo.translate(0, -0.218, 0.09);
      const stripe = new THREE.Mesh(stripeGeo, sneakerStripeMat);
      shoeGroup.add(stripe);

      // Lateral Estriada: Front Toe Bumper Wrap
      const toeBumperGeo = this.track(new THREE.BoxGeometry(0.245, 0.066, 0.035));
      const toeBumper = new THREE.Mesh(toeBumperGeo, sneakerWhiteMat);
      toeBumper.position.set(0, -0.218, 0.330);
      toeBumper.castShadow = true;
      shoeGroup.add(toeBumper);

      // 7 Vertical embossed rubber ribs on front toe bumper
      for (let i = -3; i <= 3; i++) {
        const bRibGeo = this.track(new THREE.BoxGeometry(0.013, 0.062, 0.015));
        const bRib = new THREE.Mesh(bRibGeo, sneakerWhiteMat);
        bRib.position.set(i * 0.032, -0.218, 0.345);
        bRib.castShadow = true;
        shoeGroup.add(bRib);
      }

      // Lateral Estriada: Heel Bumper Guard Wrap
      const heelBumperGeo = this.track(new THREE.BoxGeometry(0.230, 0.066, 0.035));
      const heelBumper = new THREE.Mesh(heelBumperGeo, sneakerWhiteMat);
      heelBumper.position.set(0, -0.218, -0.150);
      heelBumper.castShadow = true;
      shoeGroup.add(heelBumper);

      // 5 Vertical embossed rubber ribs on rear heel bumper
      for (let j = -2; j <= 2; j++) {
        const hRibGeo = this.track(new THREE.BoxGeometry(0.013, 0.062, 0.015));
        const hRib = new THREE.Mesh(hRibGeo, sneakerWhiteMat);
        hRib.position.set(j * 0.038, -0.218, -0.165);
        hRib.castShadow = true;
        shoeGroup.add(hRib);
      }

      // Outsole Rugged Rubber Base Plate
      const outsoleGeo = this.track(new THREE.BoxGeometry(0.296, 0.024, 0.496));
      outsoleGeo.translate(0, -0.262, 0.09);
      const outsole = new THREE.Mesh(outsoleGeo, sneakerTreadBlackMat);
      outsole.receiveShadow = true;
      shoeGroup.add(outsole);

      // --- 7. PISO E RANHURAS DE TRAÇÃO 3D EMBAIXO DA SOLA ---
      // A) Forefoot flex grooves (4 ranhuras de tração transversais na planta do pé)
      const flexZ = [0.16, 0.21, 0.26, 0.30];
      for (const fz of flexZ) {
        const flexCleatGeo = this.track(new THREE.BoxGeometry(0.24, 0.010, 0.026));
        const flexCleat = new THREE.Mesh(flexCleatGeo, sneakerWhiteMat);
        flexCleat.position.set(0, -0.274, fz);
        shoeGroup.add(flexCleat);
      }

      // B) Chevron / Herringbone traction pattern (dentes de tração em espinha de peixe no mediopé)
      const chevZ = [0.06, 0.01];
      for (const cz of chevZ) {
        const chevL_Geo = this.track(new THREE.BoxGeometry(0.09, 0.010, 0.020));
        const chevL = new THREE.Mesh(chevL_Geo, sneakerWhiteMat);
        chevL.position.set(-0.050, -0.274, cz);
        chevL.rotation.y = 0.45;
        shoeGroup.add(chevL);

        const chevR_Geo = this.track(new THREE.BoxGeometry(0.09, 0.010, 0.020));
        const chevR = new THREE.Mesh(chevR_Geo, sneakerWhiteMat);
        chevR.position.set(0.050, -0.274, cz);
        chevR.rotation.y = -0.45;
        shoeGroup.add(chevR);
      }

      // C) Heel Circular Pivot Ring & Center Plug (disco de giro com anel concêntrico)
      const pivotRingGeo = this.track(new THREE.TorusGeometry(0.048, 0.009, 6, 18));
      pivotRingGeo.rotateX(Math.PI / 2);
      const pivotRing = new THREE.Mesh(pivotRingGeo, sneakerWhiteMat);
      pivotRing.position.set(0, -0.273, -0.065);
      shoeGroup.add(pivotRing);

      const pivotPlugGeo = this.track(new THREE.CylinderGeometry(0.020, 0.020, 0.010, 12));
      const pivotPlug = new THREE.Mesh(pivotPlugGeo, sneakerTreadBlackMat);
      pivotPlug.position.set(0, -0.273, -0.065);
      shoeGroup.add(pivotPlug);

      // D) Outer Perimeter Traction Lugs (bordas laterais de aderência)
      const lugLeftGeo = this.track(new THREE.BoxGeometry(0.022, 0.010, 0.44));
      const lugLeft = new THREE.Mesh(lugLeftGeo, sneakerWhiteMat);
      lugLeft.position.set(-0.125, -0.274, 0.09);
      shoeGroup.add(lugLeft);

      const lugRightGeo = this.track(new THREE.BoxGeometry(0.022, 0.010, 0.44));
      const lugRight = new THREE.Mesh(lugRightGeo, sneakerWhiteMat);
      lugRight.position.set(0.125, -0.274, 0.09);
      shoeGroup.add(lugRight);
    };

    this.sneakerAgletPivots = [];
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
    // 5. CHAMELEON PREHENSILE SPIRAL TAIL PHYSICS
    // ==========================================
    // Base prehensile spiral curling angles (coiling gracefully up and forward in snail spiral)
    const baseCurl = [-0.16, 0.14, 0.34, 0.46, 0.52, 0.50, 0.46];

    const tailSpeed = Math.min(1.2, speed * 0.14);
    const tailWave = Math.sin(this.idleTime * 3.2 + speed * 2.2) * (0.06 + speed * 0.04);
    const tailSideWave = Math.cos(this.idleTime * 2.6 + speed * 1.8) * (0.05 + speed * 0.04);

    for (let s = 0; s < this.tailSegments.length; s++) {
      const seg = this.tailSegments[s];
      const curl = baseCurl[s] ?? 0.45;

      // Vertical spring physics: velocity drag + harmonic run bounce
      const dynamicPitch = -tailSpeed * 0.06 + tailWave * (1.0 + s * 0.16);
      const targetRotX = THREE.MathUtils.clamp(curl + dynamicPitch, -0.1, 1.4);
      seg.rotation.x += (targetRotX - seg.rotation.x) * Math.min(1, 16 * dt);

      // Lateral physics: banking lean compensation + reactive stride sway
      const targetRotY = -this.currentBankAngle * (s + 1) * 0.28 + tailSideWave * (s * 0.22);
      seg.rotation.y += (targetRotY - seg.rotation.y) * Math.min(1, 14 * dt);

      // Subtle organic reptilian roll / twist
      const targetRotZ = (s % 2 === 0 ? 1 : -1) * tailSideWave * 0.12;
      seg.rotation.z += (targetRotZ - seg.rotation.z) * Math.min(1, 12 * dt);
    }

    // ==========================================
    // 6. SECONDARY INERTIA PHYSICS (Loop 5)
    // Drawstrings Elastic Swing, Zipper Teardrop Puller Dangle, & Sneaker Aglet Micro-Jiggle
    // ==========================================

    // A. Cream Hoodie Drawstrings (Elastic aerodynamic & stride pendulum)
    const speedWind = Math.min(0.25, speed * 0.038);
    for (const ds of this.drawstringPivots) {
      let targetRotX = ds.group.rotation.x;
      let targetRotZ = ds.baseRotZ;

      if (!isGrounded) {
        // Airborne: lift on rise, float on fall, whip on landing
        const airLift = verticalVelocity > 0
          ? -verticalVelocity * 0.035
          : Math.min(0.32, -verticalVelocity * 0.040);
        targetRotX = 0.06 + airLift;
        targetRotZ = ds.baseRotZ + (ds.side * 0.05);
      } else if (speed > 0.20) {
        // Running stride harmonic pendulum swing with stride cadence
        const stridePhase = this.walkCycleTime + (ds.side > 0 ? 0.35 : -0.35);
        const swingX = Math.sin(stridePhase) * 0.22 + speedWind;
        const swayZ = Math.cos(stridePhase * 0.5) * 0.10 * ds.side;
        targetRotX = 0.08 + swingX;
        targetRotZ = ds.baseRotZ + swayZ - this.currentBankAngle * 0.35;
      } else {
        // Idle breathing micro-flutter
        const breatheFlutter = Math.sin(this.idleTime * 2.8 + ds.side * 0.8) * 0.035;
        targetRotX = 0.04 + breatheFlutter;
        targetRotZ = ds.baseRotZ + Math.cos(this.idleTime * 1.5) * 0.015 * ds.side;
      }

      if (jumpSquash > 0) {
        targetRotX += jumpSquash * 0.35;
      }

      ds.group.rotation.x += (targetRotX - ds.group.rotation.x) * Math.min(1, 14 * dt);
      ds.group.rotation.z += (targetRotZ - ds.group.rotation.z) * Math.min(1, 14 * dt);
    }

    // B. Golden Zipper Puller Pendulum Dangle & Cadence Bounce
    let targetPullerRotX = 0.12;
    let targetPullerRotZ = -this.currentBankAngle * 0.45;

    if (!isGrounded) {
      if (verticalVelocity > 0) {
        targetPullerRotX = -0.10; // Dragged back on jump ascendance
      } else {
        targetPullerRotX = Math.min(0.38, 0.12 - verticalVelocity * 0.04); // Floats upward on descent
      }
    } else if (speed > 0.20) {
      // Vigorous double-cadence bounce on running steps
      const bounceFreq = this.walkCycleTime * 2.0;
      const bounceJiggle = Math.sin(bounceFreq) * (0.18 + Math.min(0.12, speed * 0.02));
      const speedDrag = Math.min(0.22, speed * 0.03);
      targetPullerRotX = 0.12 + bounceJiggle + speedDrag;
      targetPullerRotZ += Math.cos(this.walkCycleTime) * 0.10;
    } else {
      // Subtle idle chest breathing heave
      targetPullerRotX = 0.12 + Math.sin(this.idleTime * 2.8) * 0.025;
    }

    if (jumpSquash > 0) {
      targetPullerRotX += jumpSquash * 0.45;
    }

    this.zipperPullerPivot.rotation.x += (targetPullerRotX - this.zipperPullerPivot.rotation.x) * Math.min(1, 22 * dt);
    this.zipperPullerPivot.rotation.z += (targetPullerRotZ - this.zipperPullerPivot.rotation.z) * Math.min(1, 18 * dt);

    // C. Sneaker Shoelace Aglets Micro-Jiggle
    for (const aglet of this.sneakerAgletPivots) {
      let targetAgletX = aglet.baseRotX;
      let targetAgletZ = aglet.baseRotZ;

      if (!isGrounded) {
        // Airborne trail
        targetAgletX = aglet.baseRotX + (verticalVelocity > 0 ? -0.14 : 0.18);
      } else if (speed > 0.20) {
        // Leg swing phase offset with sharp ground strike impact
        const legPhase = this.walkCycleTime + (aglet.isLeftShoe ? 0 : Math.PI);
        const footStrikeJiggle = Math.sin(legPhase * 2.0) * (0.16 + speed * 0.025);
        const lateralFling = Math.cos(legPhase * 2.0) * 0.10 * aglet.side;

        targetAgletX = aglet.baseRotX + footStrikeJiggle;
        targetAgletZ = aglet.baseRotZ + lateralFling;
      } else {
        // Settled idle state with tiny micro-tremor
        targetAgletX = aglet.baseRotX + Math.sin(this.idleTime * 2.0 + (aglet.isLeftShoe ? 0 : 1)) * 0.015;
      }

      if (jumpSquash > 0) {
        targetAgletX += jumpSquash * 0.30;
      }

      aglet.pivot.rotation.x += (targetAgletX - aglet.pivot.rotation.x) * Math.min(1, 26 * dt);
      aglet.pivot.rotation.z += (targetAgletZ - aglet.pivot.rotation.z) * Math.min(1, 22 * dt);
    }
  }

  public setPosition(x: number, y: number, z: number) {
    this.group.position.set(x, y, z);
  }

  public dispose() {
    for (const g of this.geometries) g.dispose();
    for (const m of this.materials) m.dispose();
    for (const t of this.textures) t.dispose();
    this.geometries = [];
    this.materials = [];
    this.textures = [];
    this.drawstringPivots = [];
    this.sneakerAgletPivots = [];
  }
}
