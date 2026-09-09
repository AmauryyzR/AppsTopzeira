import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface CharacterAnimState {
  speed: number;
  isGrounded: boolean;
  verticalVelocity: number;
  jumpSquash: number;
  turnRate: number;
  dt: number;
}

/**
 * PlayerCharacter - Shark Hoodie Chibi Character
 * 
 * Scaled to 1.85m to perfectly match the AAA physics capsule and world interaction.
 * Articulates the 36-part segmented GLB model onto a complete humanoid skeleton hierarchy
 * with secondary hydrodynamics/aerodynamics (shark tail wave, dual hoodie drawstrings pendulum,
 * impact squash & stretch with volume preservation, banking and forward lean).
 */
export class PlayerCharacter {
  public readonly group = new THREE.Group();

  // Root container for squash & stretch, banking and forward lean
  public readonly modelRoot = new THREE.Group();
  public readonly baseScale = 1.85;

  // Skeleton bones
  public rootBone!: THREE.Bone;
  public hipsBone!: THREE.Bone;
  public spineBone!: THREE.Bone;
  public chestBone!: THREE.Bone;
  public neckBone!: THREE.Bone;
  public headBone!: THREE.Bone;

  public upperArmL!: THREE.Bone;
  public forearmL!: THREE.Bone;
  public handL!: THREE.Bone;

  public upperArmR!: THREE.Bone;
  public forearmR!: THREE.Bone;
  public handR!: THREE.Bone;

  public thighL!: THREE.Bone;
  public shinL!: THREE.Bone;
  public footL!: THREE.Bone;

  public thighR!: THREE.Bone;
  public shinR!: THREE.Bone;
  public footR!: THREE.Bone;

  // Secondary physics bones
  public tailBone!: THREE.Bone;
  public cordLBone!: THREE.Bone;
  public cordRBone!: THREE.Bone;

  // Rest reference transform
  private restHipsY = 0.36;

  // Async load readiness
  public isLoaded = false;
  public readonly ready: Promise<void>;
  private resolveReady!: () => void;

  // Animation Timers & Smoothing
  private walkCycleTime = 0;
  private idleTime = 0;
  private currentYaw = 0;
  private targetYaw = 0;
  private currentBankAngle = 0;
  private currentForwardLean = 0;

  // Smooth aerial, stride and landing kinematics
  private currentArmRot = {
    leftX: 0,
    leftZ: -1.35,
    rightX: 0,
    rightZ: 1.35,
    forearmLX: 0.22,
    forearmRX: 0.22,
  };
  private currentLegRot = {
    leftX: 0,
    leftZ: 0,
    rightX: 0,
    rightZ: 0,
    shinLX: 0,
    shinRX: 0,
    footLX: 0,
    footRX: 0,
  };
  private currentHeadRotX = 0;
  private currentHeadRotY = 0;
  private currentTorsoRotX = 0;
  private currentTorsoRotY = 0;
  private currentScaleY = 1.0;
  private currentScaleXZ = 1.0;
  private currentHipsY = 0.36;

  // Secondary physics states
  private currentTailRotX = 0;
  private currentTailRotY = 0;
  private tailVelX = 0;
  private tailVelY = 0;

  private currentCordLX = 0;
  private currentCordLZ = 0;
  private cordLVelX = 0;
  private cordLVelZ = 0;

  private currentCordRX = 0;
  private currentCordRZ = 0;
  private cordRVelX = 0;
  private cordRVelZ = 0;

  constructor() {
    this.group.name = 'PlayerCharacter_SharkHoodie';

    this.ready = new Promise<void>((resolve) => {
      this.resolveReady = resolve;
    });

    // 1. Build the articulated skeleton hierarchy
    this.buildSkeleton();

    this.modelRoot.scale.setScalar(this.baseScale);
    this.group.add(this.modelRoot);

    // 2. Load and attach the 36-part Shark GLB model
    this.loadSharkModel();
  }

  private buildSkeleton() {
    this.rootBone = new THREE.Bone();
    this.rootBone.name = 'Root';
    this.modelRoot.add(this.rootBone);

    this.hipsBone = new THREE.Bone();
    this.hipsBone.name = 'Hips';
    this.hipsBone.position.set(0, 0.35, 0);
    this.rootBone.add(this.hipsBone);

    this.restHipsY = this.hipsBone.position.y;
    this.currentHipsY = this.restHipsY;

    this.spineBone = new THREE.Bone();
    this.spineBone.name = 'Spine';
    this.spineBone.position.set(0, 0.10, 0.04);
    this.hipsBone.add(this.spineBone);

    this.chestBone = new THREE.Bone();
    this.chestBone.name = 'Chest';
    this.chestBone.position.set(0, 0.09, 0.02);
    this.spineBone.add(this.chestBone);

    this.neckBone = new THREE.Bone();
    this.neckBone.name = 'Neck';
    this.neckBone.position.set(0, 0.08, 0.00);
    this.chestBone.add(this.neckBone);

    this.headBone = new THREE.Bone();
    this.headBone.name = 'Head';
    this.headBone.position.set(0, 0.03, -0.01); // World position: [0.00, 0.65, 0.05]
    this.neckBone.add(this.headBone);

    // Secondary physics bones:
    // Shark dorsal/caudal fin at lower back
    this.tailBone = new THREE.Bone();
    this.tailBone.name = 'Tail';
    this.tailBone.position.set(0.01, -0.03, -0.09); // World position: [0.01, 0.42, -0.05]
    this.spineBone.add(this.tailBone);

    // Left and right hoodie cords
    this.cordLBone = new THREE.Bone();
    this.cordLBone.name = 'Cord.L';
    this.cordLBone.position.set(-0.06, 0.06, 0.07); // World position: [-0.06, 0.60, 0.13]
    this.chestBone.add(this.cordLBone);

    this.cordRBone = new THREE.Bone();
    this.cordRBone.name = 'Cord.R';
    this.cordRBone.position.set(0.01, 0.06, 0.08); // World position: [0.01, 0.60, 0.14]
    this.chestBone.add(this.cordRBone);

    // Left Arm
    this.upperArmL = new THREE.Bone();
    this.upperArmL.name = 'UpperArm.L';
    this.upperArmL.position.set(-0.14, 0.00, -0.04); // World position: [-0.14, 0.54, 0.02]
    this.chestBone.add(this.upperArmL);

    this.forearmL = new THREE.Bone();
    this.forearmL.name = 'Forearm.L';
    this.forearmL.position.set(-0.02, -0.10, 0.02); // World position: [-0.16, 0.44, 0.04]
    this.upperArmL.add(this.forearmL);

    this.handL = new THREE.Bone();
    this.handL.name = 'Hand.L';
    this.handL.position.set(-0.02, -0.09, 0.04); // World position: [-0.18, 0.35, 0.08]
    this.forearmL.add(this.handL);

    // Right Arm
    this.upperArmR = new THREE.Bone();
    this.upperArmR.name = 'UpperArm.R';
    this.upperArmR.position.set(0.10, -0.02, 0.04); // World position: [0.10, 0.52, 0.10]
    this.chestBone.add(this.upperArmR);

    this.forearmR = new THREE.Bone();
    this.forearmR.name = 'Forearm.R';
    this.forearmR.position.set(0.01, -0.10, 0.02); // World position: [0.11, 0.42, 0.12]
    this.upperArmR.add(this.forearmR);

    this.handR = new THREE.Bone();
    this.handR.name = 'Hand.R';
    this.handR.position.set(-0.01, -0.08, 0.06); // World position: [0.10, 0.34, 0.18]
    this.forearmR.add(this.handR);

    // Left Leg
    this.thighL = new THREE.Bone();
    this.thighL.name = 'Thigh.L';
    this.thighL.position.set(-0.09, -0.03, 0.07); // World position: [-0.09, 0.32, 0.07]
    this.hipsBone.add(this.thighL);

    this.shinL = new THREE.Bone();
    this.shinL.name = 'Shin.L';
    this.shinL.position.set(0, -0.14, 0); // World position: [-0.09, 0.18, 0.07]
    this.thighL.add(this.shinL);

    this.footL = new THREE.Bone();
    this.footL.name = 'Foot.L';
    this.footL.position.set(-0.02, -0.10, 0); // World position: [-0.11, 0.08, 0.07]
    this.shinL.add(this.footL);

    // Right Leg
    this.thighR = new THREE.Bone();
    this.thighR.name = 'Thigh.R';
    this.thighR.position.set(0.07, -0.03, 0.11); // World position: [0.07, 0.32, 0.11]
    this.hipsBone.add(this.thighR);

    this.shinR = new THREE.Bone();
    this.shinR.name = 'Shin.R';
    this.shinR.position.set(0, -0.14, 0); // World position: [0.07, 0.18, 0.11]
    this.thighR.add(this.shinR);

    this.footR = new THREE.Bone();
    this.footR.name = 'Foot.R';
    this.footR.position.set(0.08, -0.10, 0.04); // World position: [0.15, 0.08, 0.15]
    this.shinR.add(this.footR);

    this.modelRoot.updateMatrixWorld(true);
  }

  private loadSharkModel() {
    const loader = new GLTFLoader();

    const tryLoad = (url: string) => {
      loader.load(
        url,
        (gltf) => {
          console.log('[PlayerCharacter] GLTF loaded, attaching parts...');
          try {
            this.attachSharkParts(gltf.scene);
            this.isLoaded = true;
            console.log('[PlayerCharacter] Character successfully loaded and ready!');
            this.resolveReady();
          } catch (e) {
            console.error('[PlayerCharacter] Error in attachSharkParts:', e);
            this.resolveReady();
          }
        },
        undefined,
        (err) => {
          if (url !== '/3dgame/character.glb') {
            console.warn(`Could not load ${url}, falling back to /3dgame/character.glb:`, err);
            tryLoad('/3dgame/character.glb');
          } else {
            console.error('Critical: Failed to load character GLB:', err);
            this.resolveReady();
          }
        }
      );
    };

    tryLoad('/3dgame/shark_character.glb');
  }

  private attachSharkParts(scene: THREE.Group) {
    // Check if the loaded scene contains a SkinnedMesh (e.g. shark hoodie 3dplus_animation.glb)
    let skinnedMesh: THREE.SkinnedMesh | null = null;
    scene.traverse((child) => {
      if ((child as THREE.SkinnedMesh).isSkinnedMesh && !skinnedMesh) {
        skinnedMesh = child as THREE.SkinnedMesh;
      }
    });

    if (skinnedMesh) {
      this.setupSkinnedSharkMesh(scene, skinnedMesh);
    } else {
      this.attachSegmentedParts(scene);
    }

    this.modelRoot.updateMatrixWorld(true);
  }

  private setupSkinnedSharkMesh(scene: THREE.Group, skinnedMesh: THREE.SkinnedMesh) {
    // 1. Prepare Geometry: clear old degenerate joint weights from Tripo
    const geom = skinnedMesh.geometry;
    geom.deleteAttribute('skinIndex');
    geom.deleteAttribute('skinWeight');

    const pos = geom.attributes.position;
    const count = pos.count;

    // 2. Define Clean Bone Hierarchy and Rest Positions in Model Space (Height = 1.0m, T-Pose)
    const BONE_SPECS = [
      { name: 'Root', parent: null, pos: [0, 0, 0] },
      { name: 'Hips', parent: 'Root', pos: [0, 0.36, 0.10] },
      { name: 'Spine', parent: 'Hips', pos: [0, 0.44, 0.11] },
      { name: 'Chest', parent: 'Spine', pos: [0, 0.53, 0.11] },
      { name: 'Neck', parent: 'Chest', pos: [0, 0.60, 0.10] },
      { name: 'Head', parent: 'Neck', pos: [0, 0.76, 0.11] },
      { name: 'Tail', parent: 'Hips', pos: [0, 0.44, -0.11] },

      // Left Arm (T-pose extending +X)
      { name: 'Clavicle.L', parent: 'Chest', pos: [0.06, 0.58, 0.10] },
      { name: 'UpperArm.L', parent: 'Clavicle.L', pos: [0.13, 0.62, 0.09] },
      { name: 'Forearm.L', parent: 'UpperArm.L', pos: [0.22, 0.62, 0.10] },
      { name: 'Hand.L', parent: 'Forearm.L', pos: [0.31, 0.62, 0.11] },

      // Right Arm (T-pose extending -X)
      { name: 'Clavicle.R', parent: 'Chest', pos: [-0.06, 0.58, 0.10] },
      { name: 'UpperArm.R', parent: 'Clavicle.R', pos: [-0.13, 0.62, 0.09] },
      { name: 'Forearm.R', parent: 'UpperArm.R', pos: [-0.22, 0.62, 0.10] },
      { name: 'Hand.R', parent: 'Forearm.R', pos: [-0.31, 0.62, 0.11] },

      // Left Leg
      { name: 'Thigh.L', parent: 'Hips', pos: [0.08, 0.34, 0.10] },
      { name: 'Shin.L', parent: 'Thigh.L', pos: [0.09, 0.22, 0.10] },
      { name: 'Foot.L', parent: 'Shin.L', pos: [0.11, 0.09, 0.12] },
      { name: 'Toe.L', parent: 'Foot.L', pos: [0.12, 0.03, 0.18] },

      // Right Leg
      { name: 'Thigh.R', parent: 'Hips', pos: [-0.08, 0.34, 0.10] },
      { name: 'Shin.R', parent: 'Thigh.R', pos: [-0.09, 0.22, 0.10] },
      { name: 'Foot.R', parent: 'Shin.R', pos: [-0.11, 0.09, 0.12] },
      { name: 'Toe.R', parent: 'Foot.R', pos: [-0.12, 0.03, 0.18] },

      // Hoodie Cords
      { name: 'Cord.L', parent: 'Chest', pos: [0.03, 0.52, 0.19] },
      { name: 'Cord.R', parent: 'Chest', pos: [-0.03, 0.52, 0.19] },
    ];

    const boneMap = new Map<string, THREE.Bone>();
    const bones: THREE.Bone[] = [];
    const boneWorldPos = new Map<string, THREE.Vector3>();
    const boneIndices = new Map<string, number>();

    BONE_SPECS.forEach((spec, idx) => {
      const bone = new THREE.Bone();
      bone.name = spec.name;
      boneMap.set(spec.name, bone);
      bones.push(bone);
      boneIndices.set(spec.name, idx);
      boneWorldPos.set(spec.name, new THREE.Vector3(spec.pos[0], spec.pos[1], spec.pos[2]));
    });

    BONE_SPECS.forEach((spec) => {
      const bone = boneMap.get(spec.name)!;
      if (!spec.parent) {
        bone.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
      } else {
        const parentBone = boneMap.get(spec.parent)!;
        parentBone.add(bone);
        const pPos = boneWorldPos.get(spec.parent)!;
        bone.position.set(spec.pos[0] - pPos.x, spec.pos[1] - pPos.y, spec.pos[2] - pPos.z);
      }
    });

    const rootBone = boneMap.get('Root')!;
    rootBone.updateWorldMatrix(true, true);

    const skeleton = new THREE.Skeleton(bones);
    skeleton.calculateInverses();

    // 3. Anatomical Skin Weights
    const P = Object.fromEntries(boneWorldPos.entries()) as Record<string, THREE.Vector3>;
    P.HandTipL = new THREE.Vector3(0.39, 0.62, 0.11);
    P.HandTipR = new THREE.Vector3(-0.39, 0.62, 0.11);

    const distToSeg = (pt: THREE.Vector3, A: THREE.Vector3, B: THREE.Vector3) => {
      const v = new THREE.Vector3().subVectors(B, A);
      const lenSq = v.lengthSq();
      if (lenSq < 1e-6) return pt.distanceTo(A);
      const toPt = new THREE.Vector3().subVectors(pt, A);
      const t = THREE.MathUtils.clamp(toPt.dot(v) / lenSq, 0, 1);
      const proj = new THREE.Vector3().copy(A).addScaledVector(v, t);
      return pt.distanceTo(proj);
    };

    const skinIndices = new Uint16Array(count * 4);
    const skinWeights = new Float32Array(count * 4);

    for (let i = 0; i < count; i++) {
      const pt = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      const rawWeights = new Map<string, number>();

      // A. Head & Neck
      if (pt.y > 0.56) {
        if (pt.y > 0.64) {
          const dHead = pt.distanceTo(P.Head);
          rawWeights.set('Head', 1.0 / (dHead * dHead + 0.008));
        } else {
          const t = (pt.y - 0.56) / (0.64 - 0.56);
          rawWeights.set('Head', t * 2.0);
          rawWeights.set('Neck', (1 - t) * 2.0);
        }
      }

      // B. Tail Fin Fluke (Rear lower back)
      if (pt.z < -0.05 && pt.y >= 0.32 && pt.y <= 0.54) {
        const dTail = pt.distanceTo(P.Tail);
        rawWeights.set('Tail', 1.5 / (dTail * dTail + 0.004));
      }

      // C. Hoodie Cords (Front chest drawstrings)
      if (pt.z > 0.17 && pt.y >= 0.42 && pt.y <= 0.58 && Math.abs(pt.x) < 0.08) {
        if (pt.x > 0.01) rawWeights.set('Cord.L', 3.0);
        else if (pt.x < -0.01) rawWeights.set('Cord.R', 3.0);
      }

      // D. Left Arm
      if (pt.x > 0.11 && pt.y >= 0.46 && pt.y <= 0.74 && pt.z > -0.05) {
        const dClav = distToSeg(pt, P['Clavicle.L'], P['UpperArm.L']);
        const dUA = distToSeg(pt, P['UpperArm.L'], P['Forearm.L']);
        const dFA = distToSeg(pt, P['Forearm.L'], P['Hand.L']);
        const dH = distToSeg(pt, P['Hand.L'], P.HandTipL);
        if (pt.x < 0.14) rawWeights.set('Clavicle.L', 1.0 / (dClav * dClav + 0.003));
        rawWeights.set('UpperArm.L', 1.0 / (dUA * dUA + 0.002));
        rawWeights.set('Forearm.L', 1.0 / (dFA * dFA + 0.002));
        rawWeights.set('Hand.L', 1.0 / (dH * dH + 0.002));
      }

      // E. Right Arm
      if (pt.x < -0.11 && pt.y >= 0.46 && pt.y <= 0.74 && pt.z > -0.05) {
        const dClav = distToSeg(pt, P['Clavicle.R'], P['UpperArm.R']);
        const dUA = distToSeg(pt, P['UpperArm.R'], P['Forearm.R']);
        const dFA = distToSeg(pt, P['Forearm.R'], P['Hand.R']);
        const dH = distToSeg(pt, P['Hand.R'], P.HandTipR);
        if (pt.x > -0.14) rawWeights.set('Clavicle.R', 1.0 / (dClav * dClav + 0.003));
        rawWeights.set('UpperArm.R', 1.0 / (dUA * dUA + 0.002));
        rawWeights.set('Forearm.R', 1.0 / (dFA * dFA + 0.002));
        rawWeights.set('Hand.R', 1.0 / (dH * dH + 0.002));
      }

      // F. Left Leg
      if (pt.x > 0.01 && pt.y < 0.35) {
        const dTh = distToSeg(pt, P['Thigh.L'], P['Shin.L']);
        const dSh = distToSeg(pt, P['Shin.L'], P['Foot.L']);
        const dFt = distToSeg(pt, P['Foot.L'], P['Toe.L']);
        rawWeights.set('Thigh.L', 1.0 / (dTh * dTh + 0.004));
        rawWeights.set('Shin.L', 1.0 / (dSh * dSh + 0.004));
        rawWeights.set('Foot.L', 1.0 / (dFt * dFt + 0.003));
        if (pt.y < 0.05 && pt.z > 0.14) {
          rawWeights.set('Toe.L', 1.0 / (pt.distanceTo(P['Toe.L']) * pt.distanceTo(P['Toe.L']) + 0.002));
        }
      }

      // G. Right Leg
      if (pt.x < -0.01 && pt.y < 0.35) {
        const dTh = distToSeg(pt, P['Thigh.R'], P['Shin.R']);
        const dSh = distToSeg(pt, P['Shin.R'], P['Foot.R']);
        const dFt = distToSeg(pt, P['Foot.R'], P['Toe.R']);
        rawWeights.set('Thigh.R', 1.0 / (dTh * dTh + 0.004));
        rawWeights.set('Shin.R', 1.0 / (dSh * dSh + 0.004));
        rawWeights.set('Foot.R', 1.0 / (dFt * dFt + 0.003));
        if (pt.y < 0.05 && pt.z > 0.14) {
          rawWeights.set('Toe.R', 1.0 / (pt.distanceTo(P['Toe.R']) * pt.distanceTo(P['Toe.R']) + 0.002));
        }
      }

      // H. Torso
      if (pt.y >= 0.30 && pt.y <= 0.62 && Math.abs(pt.x) < 0.18 && pt.z >= -0.05) {
        const dHips = distToSeg(pt, P.Hips, P.Spine);
        const dSpine = distToSeg(pt, P.Spine, P.Chest);
        const dChest = distToSeg(pt, P.Chest, P.Neck);
        rawWeights.set('Hips', 1.0 / (dHips * dHips + 0.008));
        rawWeights.set('Spine', 1.0 / (dSpine * dSpine + 0.008));
        rawWeights.set('Chest', 1.0 / (dChest * dChest + 0.008));
      }

      // Safety fallback
      if (rawWeights.size === 0) {
        if (pt.y > 0.60) rawWeights.set('Head', 1.0);
        else if (pt.y < 0.35) rawWeights.set(pt.x > 0 ? 'Foot.L' : 'Foot.R', 1.0);
        else rawWeights.set('Chest', 1.0);
      }

      // Normalize top 4 weights
      const sorted = Array.from(rawWeights.entries()).sort((a, b) => b[1] - a[1]).slice(0, 4);
      let sum = sorted.reduce((acc, curr) => acc + curr[1], 0);
      if (sum === 0) sum = 1;

      for (let k = 0; k < 4; k++) {
        if (k < sorted.length) {
          const bName = sorted[k][0];
          const bIdx = boneIndices.get(bName)!;
          skinIndices[i * 4 + k] = bIdx;
          skinWeights[i * 4 + k] = sorted[k][1] / sum;
        } else {
          skinIndices[i * 4 + k] = 0;
          skinWeights[i * 4 + k] = 0;
        }
      }
    }

    geom.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
    geom.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

    // 4. Bind SkinnedMesh to Skeleton
    skinnedMesh.bind(skeleton);

    // 5. Connect runtime animated bone pointers
    this.rootBone = rootBone;
    this.hipsBone = boneMap.get('Hips')!;
    this.spineBone = boneMap.get('Spine')!;
    this.chestBone = boneMap.get('Chest')!;
    this.neckBone = boneMap.get('Neck')!;
    this.headBone = boneMap.get('Head')!;
    this.tailBone = boneMap.get('Tail')!;

    this.upperArmL = boneMap.get('UpperArm.L')!;
    this.forearmL = boneMap.get('Forearm.L')!;
    this.handL = boneMap.get('Hand.L')!;

    this.upperArmR = boneMap.get('UpperArm.R')!;
    this.forearmR = boneMap.get('Forearm.R')!;
    this.handR = boneMap.get('Hand.R')!;

    this.thighL = boneMap.get('Thigh.L')!;
    this.shinL = boneMap.get('Shin.L')!;
    this.footL = boneMap.get('Foot.L')!;

    this.thighR = boneMap.get('Thigh.R')!;
    this.shinR = boneMap.get('Shin.R')!;
    this.footR = boneMap.get('Foot.R')!;

    this.cordLBone = boneMap.get('Cord.L')!;
    this.cordRBone = boneMap.get('Cord.R')!;

    this.restHipsY = this.hipsBone.position.y;
    this.currentHipsY = this.restHipsY;

    // 6. Calibrate material colors, roughness and shadows for shanimationreal
    skinnedMesh.castShadow = true;
    skinnedMesh.receiveShadow = true;
    skinnedMesh.frustumCulled = false;

    if (skinnedMesh.material) {
      const mats = Array.isArray(skinnedMesh.material) ? skinnedMesh.material : [skinnedMesh.material];
      mats.forEach((m) => {
        if ((m as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
          const stdMat = m as THREE.MeshStandardMaterial;
          stdMat.color.setRGB(1.0, 1.0, 1.0);
          stdMat.roughness = 0.48;
          stdMat.metalness = 0.0;
          stdMat.side = THREE.DoubleSide;
          stdMat.shadowSide = THREE.DoubleSide;
          if (stdMat.map) {
            stdMat.map.colorSpace = THREE.SRGBColorSpace;
            stdMat.map.needsUpdate = true;
          }
        }
      });
    }

    // 7. Add root bone and skinned mesh to modelRoot
    this.modelRoot.add(rootBone);
    this.modelRoot.add(skinnedMesh);
  }

  private attachSegmentedParts(scene: THREE.Group) {
    const PIVOTS = {
      head: { bone: this.headBone, pivot: [0.00, 0.65, 0.05] as [number, number, number] },
      chest: { bone: this.chestBone, pivot: [0.00, 0.54, 0.06] as [number, number, number] },
      tail: { bone: this.tailBone, pivot: [0.01, 0.42, -0.05] as [number, number, number] },
      cordL: { bone: this.cordLBone, pivot: [-0.06, 0.60, 0.13] as [number, number, number] },
      cordR: { bone: this.cordRBone, pivot: [0.01, 0.60, 0.14] as [number, number, number] },
      upperArmL: { bone: this.upperArmL, pivot: [-0.14, 0.54, 0.02] as [number, number, number] },
      forearmL: { bone: this.forearmL, pivot: [-0.16, 0.44, 0.04] as [number, number, number] },
      handL: { bone: this.handL, pivot: [-0.18, 0.35, 0.08] as [number, number, number] },
      upperArmR: { bone: this.upperArmR, pivot: [0.10, 0.52, 0.10] as [number, number, number] },
      forearmR: { bone: this.forearmR, pivot: [0.11, 0.42, 0.12] as [number, number, number] },
      handR: { bone: this.handR, pivot: [0.10, 0.34, 0.18] as [number, number, number] },
      thighL: { bone: this.thighL, pivot: [-0.09, 0.32, 0.07] as [number, number, number] },
      footL: { bone: this.footL, pivot: [-0.11, 0.08, 0.07] as [number, number, number] },
      thighR: { bone: this.thighR, pivot: [0.07, 0.32, 0.11] as [number, number, number] },
      footR: { bone: this.footR, pivot: [0.15, 0.08, 0.15] as [number, number, number] },
    };

    const partMapping: Record<string, { bone: THREE.Bone; pivot: [number, number, number] }> = {
      tripo_part_0: PIVOTS.head,
      tripo_part_4: PIVOTS.head,
      tripo_part_2: PIVOTS.head,
      tripo_part_8: PIVOTS.head,
      tripo_part_14: PIVOTS.head,
      tripo_part_24: PIVOTS.head,
      tripo_part_25: PIVOTS.head,
      tripo_part_33: PIVOTS.head,
      tripo_part_35: PIVOTS.head,
      tripo_part_5: PIVOTS.chest,
      tripo_part_13: PIVOTS.tail,
      tripo_part_18: PIVOTS.cordL,
      tripo_part_19: PIVOTS.cordR,
      tripo_part_16: PIVOTS.upperArmL,
      tripo_part_11: PIVOTS.forearmL,
      tripo_part_9: PIVOTS.handL,
      tripo_part_15: PIVOTS.upperArmR,
      tripo_part_12: PIVOTS.forearmR,
      tripo_part_10: PIVOTS.handR,
      tripo_part_6: PIVOTS.thighL,
      tripo_part_1: PIVOTS.footL,
      tripo_part_17: PIVOTS.footL,
      tripo_part_21: PIVOTS.footL,
      tripo_part_23: PIVOTS.footL,
      tripo_part_26: PIVOTS.footL,
      tripo_part_28: PIVOTS.footL,
      tripo_part_30: PIVOTS.footL,
      tripo_part_36: PIVOTS.footL,
      tripo_part_7: PIVOTS.thighR,
      tripo_part_3: PIVOTS.footR,
      tripo_part_20: PIVOTS.footR,
      tripo_part_27: PIVOTS.footR,
      tripo_part_29: PIVOTS.footR,
      tripo_part_31: PIVOTS.footR,
      tripo_part_32: PIVOTS.footR,
      tripo_part_34: PIVOTS.footR,
    };

    const meshes: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes.push(child as THREE.Mesh);
      }
    });

    for (const mesh of meshes) {
      const target = partMapping[mesh.name];
      if (target) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;

        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            if ((m as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
              const stdMat = m as THREE.MeshStandardMaterial;
              stdMat.roughness = 0.55;
              stdMat.metalness = 0.0;
              stdMat.shadowSide = THREE.DoubleSide;
            }
          });
        }

        mesh.position.set(-target.pivot[0], -target.pivot[1], -target.pivot[2]);
        mesh.rotation.set(0, 0, 0);
        mesh.scale.set(1, 1, 1);
        target.bone.add(mesh);
      }
    }
    this.modelRoot.updateMatrixWorld(true);
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
    while (this.currentYaw < -Math.PI) this.currentYaw -= 2 * Math.PI;

    this.group.rotation.y = this.currentYaw;
  }

  public updateAnimation(state: CharacterAnimState) {
    const { speed, isGrounded, verticalVelocity, jumpSquash, turnRate, dt } = state;

    this.idleTime += dt;

    // 1. Dynamic Banking (turns) & Forward Lean
    const targetBank = THREE.MathUtils.clamp(-turnRate * 0.065, -0.34, 0.34);
    this.currentBankAngle += (targetBank - this.currentBankAngle) * Math.min(1, 16 * dt);
    this.modelRoot.rotation.z = this.currentBankAngle;

    const baseLean = isGrounded ? Math.min(0.32, speed * 0.032) : 0.04;
    this.currentForwardLean += (baseLean - this.currentForwardLean) * Math.min(1, 14 * dt);
    this.modelRoot.rotation.x = this.currentForwardLean;

    // Kinematics Target Registers
    const ARM_REST_Z_L = -1.35;
    const ARM_REST_Z_R = 1.35;

    let targetLeftArmX = 0;
    let targetLeftArmZ = ARM_REST_Z_L;
    let targetRightArmX = 0;
    let targetRightArmZ = ARM_REST_Z_R;
    let targetForearmLX = 0.22;
    let targetForearmRX = 0.22;

    let targetLeftLegX = 0;
    let targetLeftLegZ = 0;
    let targetRightLegX = 0;
    let targetRightLegZ = 0;
    let targetShinLX = 0;
    let targetShinRX = 0;
    let targetFootLX = 0;
    let targetFootRX = 0;

    let targetHipsY = this.restHipsY;
    let targetTorsoRotX = 0;
    let targetHeadRotX = 0;
    let targetTorsoRotY = 0;
    let targetHeadRotY = 0;

    let targetScaleY = 1.0;
    let tailPitchTarget = 0;
    let tailYawTarget = 0;

    let cordPitchTarget = 0;
    let cordRollTarget = 0;

    // 2. State Machine: Aerial vs Grounded
    if (!isGrounded) {
      this.walkCycleTime = 0;

      const riseFactor = THREE.MathUtils.clamp(verticalVelocity / 11.2, 0, 1);
      const fallFactor = THREE.MathUtils.clamp(-verticalVelocity / 22.0, 0, 1);

      if (verticalVelocity >= 0) {
        // --- ASCENT / TRIUMPHANT ATHLETIC BRAWLER LEAP ---
        // Arms: Raised upward from sides
        targetLeftArmZ = ARM_REST_Z_L + 1.25 * riseFactor;
        targetRightArmZ = ARM_REST_Z_R - 1.25 * riseFactor;
        targetLeftArmX = -0.22 * riseFactor;
        targetRightArmX = -0.22 * riseFactor;
        targetForearmLX = 0.45 * riseFactor;
        targetForearmRX = 0.45 * riseFactor;

        // Legs: Athletic hurdle leap (Left knee high, right leg back)
        targetLeftLegX = 0.92 * riseFactor + 0.20 * (1 - riseFactor);
        targetLeftLegZ = 0.16 * riseFactor;
        targetShinLX = 0.85 * riseFactor;
        targetFootLX = -0.22 * riseFactor;

        targetRightLegX = -0.62 * riseFactor + 0.10 * (1 - riseFactor);
        targetRightLegZ = -0.15 * riseFactor;
        targetShinRX = 0.40 * riseFactor;
        targetFootRX = 0.20 * riseFactor;

        // Head looking up towards apex
        targetHeadRotX = -0.28 * riseFactor;
        targetTorsoRotX = -0.14 * riseFactor;

        // Vertical speed-line stretch
        targetScaleY = 1.0 + 0.15 * riseFactor;

        // Shark tail dragged down by air flow
        tailPitchTarget = -0.48 * riseFactor;
        cordPitchTarget = -0.35 * riseFactor;
      } else {
        // --- DESCENT / FAST AERODYNAMIC GLIDE ---
        // Arms: Spread wide like glider fins for aerodynamic stabilization
        targetLeftArmZ = ARM_REST_Z_L + 0.65 * fallFactor;
        targetRightArmZ = ARM_REST_Z_R - 0.65 * fallFactor;
        targetLeftArmX = 0.24 * fallFactor;
        targetRightArmX = 0.24 * fallFactor;
        targetForearmLX = 0.32 * fallFactor;
        targetForearmRX = 0.32 * fallFactor;

        // Legs: Poised downward to absorb touchdown impact
        targetLeftLegX = 0.25 * fallFactor + 0.10 * (1 - fallFactor);
        targetLeftLegZ = 0.08 * fallFactor;
        targetShinLX = 0.30 * fallFactor;

        targetRightLegX = 0.15 * fallFactor + 0.08 * (1 - fallFactor);
        targetRightLegZ = -0.08 * fallFactor;
        targetShinRX = 0.30 * fallFactor;

        // Head looking straight at landing target
        targetHeadRotX = 0.28 * fallFactor;
        targetTorsoRotX = 0.20 * fallFactor;

        // Slight aerodynamic elongation
        targetScaleY = 1.0 + 0.06 * fallFactor;

        // Wind pushes shark tail straight up
        tailPitchTarget = 0.65 * fallFactor;
        cordPitchTarget = 0.50 * fallFactor;
      }
    } else {
      // --- GROUNDED STATES ---
      const squashFactor = THREE.MathUtils.clamp(jumpSquash * 0.75, 0, 0.24);

      if (squashFactor > 0.01) {
        // --- CRISP NATURAL IMPACT LANDING (NO COLLAPSE) ---
        targetScaleY = Math.max(0.80, 1.0 - squashFactor);
        targetHipsY = this.restHipsY - squashFactor * 0.25;

        // Knees flex naturally forward to cushion landing
        targetLeftLegX = squashFactor * 0.85;
        targetRightLegX = squashFactor * 0.85;
        targetLeftLegZ = squashFactor * 0.12;
        targetRightLegZ = -squashFactor * 0.12;
        targetShinLX = squashFactor * 1.35;
        targetShinRX = squashFactor * 1.35;
        targetFootLX = -squashFactor * 0.30;
        targetFootRX = -squashFactor * 0.30;

        // Arms drop to sides
        targetLeftArmX = squashFactor * 0.55;
        targetRightArmX = squashFactor * 0.55;
        targetLeftArmZ = ARM_REST_Z_L - squashFactor * 0.25;
        targetRightArmZ = ARM_REST_Z_R + squashFactor * 0.25;
        targetForearmLX = 0.25 + squashFactor * 0.40;
        targetForearmRX = 0.25 + squashFactor * 0.40;

        // Torso tilts slightly forward on impact
        targetTorsoRotX = squashFactor * 0.22;
        targetHeadRotX = -squashFactor * 0.10;

        // Shark tail whips down on floor contact
        tailPitchTarget = -squashFactor * 0.65;
        cordPitchTarget = squashFactor * 0.60;
      } else if (speed > 0.20) {
        // --- RUNNING / SPRINTING CADENCE ---
        const strideCadence = Math.min(18, 6.5 + speed * 1.5);
        this.walkCycleTime += dt * strideCadence;

        const sinStride = Math.sin(this.walkCycleTime);
        const cosStride = Math.cos(this.walkCycleTime);

        // Legs: Punchy cartoon stride amplitude with knee recovery
        targetLeftLegX = sinStride * 0.92;
        targetRightLegX = -sinStride * 0.92;
        targetShinLX = Math.max(0, -sinStride) * 1.12;
        targetShinRX = Math.max(0, sinStride) * 1.12;
        targetFootLX = -cosStride * 0.32;
        targetFootRX = cosStride * 0.32;

        // Arms: Punchy counter-pump
        targetLeftArmX = -sinStride * 0.88;
        targetRightArmX = sinStride * 0.88;
        targetLeftArmZ = ARM_REST_Z_L - Math.abs(cosStride) * 0.08;
        targetRightArmZ = ARM_REST_Z_R + Math.abs(cosStride) * 0.08;
        targetForearmLX = 0.32 + Math.max(0, sinStride) * 0.45;
        targetForearmRX = 0.32 + Math.max(0, -sinStride) * 0.45;

        const bounce = Math.abs(cosStride) * 0.035;
        targetHipsY = this.restHipsY + bounce;
        targetTorsoRotY = sinStride * 0.12;
        targetHeadRotY = -sinStride * 0.04;

        // Shark tail rhythmic hydrodynamic wag with phase lag
        tailYawTarget = Math.sin(this.walkCycleTime - 0.38) * 0.36 - this.currentBankAngle * 0.45;
        tailPitchTarget = -0.12 + Math.cos(this.walkCycleTime * 2) * 0.08;

        // Cord swinging with running strides
        cordPitchTarget = sinStride * 0.22;
        cordRollTarget = -cosStride * 0.15;
      } else {
        // --- IDLE WITH GENTLE BREATHING & OCEAN SWAY ---
        this.walkCycleTime = 0;

        const breathe = Math.sin(this.idleTime * 2.8) * 0.012;
        targetHipsY = this.restHipsY + breathe * 1.2;

        targetLeftArmZ = ARM_REST_Z_L - breathe * 0.3;
        targetRightArmZ = ARM_REST_Z_R + breathe * 0.3;

        targetTorsoRotX = breathe * 0.8;
        targetHeadRotX = -breathe * 0.5;
        targetForearmLX = 0.22;
        targetForearmRX = 0.22;

        // Gentle hydrodynamic tail sway
        tailYawTarget = Math.sin(this.idleTime * 2.5) * 0.12;
        tailPitchTarget = -0.05 + Math.sin(this.idleTime * 2.0) * 0.06;

        cordPitchTarget = Math.sin(this.idleTime * 2.2) * 0.05;
        cordRollTarget = Math.cos(this.idleTime * 1.8) * 0.04;
      }
    }

    // 3. Volume Preservation for Squash & Stretch
    const targetScaleXZ = 1.0 / Math.sqrt(Math.max(0.2, targetScaleY));
    const smoothRate = Math.min(1, 20 * dt);

    this.currentScaleY += (targetScaleY - this.currentScaleY) * smoothRate;
    this.currentScaleXZ += (targetScaleXZ - this.currentScaleXZ) * smoothRate;
    this.modelRoot.scale.set(
      this.baseScale * this.currentScaleXZ,
      this.baseScale * this.currentScaleY,
      this.baseScale * this.currentScaleXZ
    );

    // 4. Smoothly Interpolate Skeleton Joints
    const armLerpRate = Math.min(1, 24 * dt);
    this.currentArmRot.leftX += (targetLeftArmX - this.currentArmRot.leftX) * armLerpRate;
    this.currentArmRot.leftZ += (targetLeftArmZ - this.currentArmRot.leftZ) * armLerpRate;
    this.currentArmRot.rightX += (targetRightArmX - this.currentArmRot.rightX) * armLerpRate;
    this.currentArmRot.rightZ += (targetRightArmZ - this.currentArmRot.rightZ) * armLerpRate;
    this.currentArmRot.forearmLX += (targetForearmLX - this.currentArmRot.forearmLX) * armLerpRate;
    this.currentArmRot.forearmRX += (targetForearmRX - this.currentArmRot.forearmRX) * armLerpRate;

    this.upperArmL.rotation.x = this.currentArmRot.leftX;
    this.upperArmL.rotation.z = this.currentArmRot.leftZ;
    this.upperArmR.rotation.x = this.currentArmRot.rightX;
    this.upperArmR.rotation.z = this.currentArmRot.rightZ;
    this.forearmL.rotation.x = this.currentArmRot.forearmLX;
    this.forearmR.rotation.x = this.currentArmRot.forearmRX;

    const legLerpRate = Math.min(1, 24 * dt);
    this.currentLegRot.leftX += (targetLeftLegX - this.currentLegRot.leftX) * legLerpRate;
    this.currentLegRot.leftZ += (targetLeftLegZ - this.currentLegRot.leftZ) * legLerpRate;
    this.currentLegRot.rightX += (targetRightLegX - this.currentLegRot.rightX) * legLerpRate;
    this.currentLegRot.rightZ += (targetRightLegZ - this.currentLegRot.rightZ) * legLerpRate;
    this.currentLegRot.shinLX += (targetShinLX - this.currentLegRot.shinLX) * legLerpRate;
    this.currentLegRot.shinRX += (targetShinRX - this.currentLegRot.shinRX) * legLerpRate;
    this.currentLegRot.footLX += (targetFootLX - this.currentLegRot.footLX) * legLerpRate;
    this.currentLegRot.footRX += (targetFootRX - this.currentLegRot.footRX) * legLerpRate;

    this.thighL.rotation.x = this.currentLegRot.leftX;
    this.thighL.rotation.z = this.currentLegRot.leftZ;
    this.thighR.rotation.x = this.currentLegRot.rightX;
    this.thighR.rotation.z = this.currentLegRot.rightZ;
    this.shinL.rotation.x = this.currentLegRot.shinLX;
    this.shinR.rotation.x = this.currentLegRot.shinRX;
    this.footL.rotation.x = this.currentLegRot.footLX;
    this.footR.rotation.x = this.currentLegRot.footRX;

    this.currentHeadRotX += (targetHeadRotX - this.currentHeadRotX) * Math.min(1, 16 * dt);
    this.headBone.rotation.x = this.currentHeadRotX;
    this.currentHeadRotY += (targetHeadRotY - this.currentHeadRotY) * Math.min(1, 16 * dt);
    this.headBone.rotation.y = this.currentHeadRotY;

    this.currentTorsoRotX += (targetTorsoRotX - this.currentTorsoRotX) * Math.min(1, 16 * dt);
    this.chestBone.rotation.x = this.currentTorsoRotX * 0.7;
    this.spineBone.rotation.x = this.currentTorsoRotX * 0.3;

    this.currentTorsoRotY += (targetTorsoRotY - this.currentTorsoRotY) * Math.min(1, 16 * dt);
    this.chestBone.rotation.y = this.currentTorsoRotY * 0.6;
    this.spineBone.rotation.y = this.currentTorsoRotY * 0.4;

    this.currentHipsY += (targetHipsY - this.currentHipsY) * Math.min(1, 22 * dt);
    this.hipsBone.position.y = this.currentHipsY;

    // 5. Secondary Physics: Shark Tail Fluke (Spring-Damper Euler Integrator)
    const tailSpringK = 38.0;
    const tailDamping = 8.5;
    this.tailVelX += (tailPitchTarget - this.currentTailRotX) * tailSpringK * dt;
    this.tailVelX -= this.tailVelX * tailDamping * dt;
    this.currentTailRotX += this.tailVelX * dt;
    this.tailBone.rotation.x = THREE.MathUtils.clamp(this.currentTailRotX, -0.65, 0.75);

    this.tailVelY += (tailYawTarget - this.currentTailRotY) * tailSpringK * dt;
    this.tailVelY -= this.tailVelY * tailDamping * dt;
    this.currentTailRotY += this.tailVelY * dt;
    this.tailBone.rotation.y = THREE.MathUtils.clamp(this.currentTailRotY, -0.75, 0.75);

    // 6. Secondary Physics: Dual Hoodie Drawstrings (Dual Spring Pendulums)
    const cordSpringK = 48.0;
    const cordDamping = 9.0;

    // Left Cord
    this.cordLVelX += (cordPitchTarget - this.currentCordLX) * cordSpringK * dt;
    this.cordLVelX -= this.cordLVelX * cordDamping * dt;
    this.currentCordLX += this.cordLVelX * dt;
    this.cordLBone.rotation.x = this.currentCordLX;

    this.cordLVelZ += (cordRollTarget - this.currentCordLZ) * cordSpringK * dt;
    this.cordLVelZ -= this.cordLVelZ * cordDamping * dt;
    this.currentCordLZ += this.cordLVelZ * dt;
    this.cordLBone.rotation.z = this.currentCordLZ;

    // Right Cord (Phase shifted for natural asymmetrical cloth behavior)
    const cordRPitch = cordPitchTarget * 0.95 + Math.sin(this.idleTime * 2.7) * 0.02;
    const cordRRoll = cordRollTarget * 0.95 - Math.cos(this.idleTime * 2.1) * 0.02;

    this.cordRVelX += (cordRPitch - this.currentCordRX) * cordSpringK * dt;
    this.cordRVelX -= this.cordRVelX * cordDamping * dt;
    this.currentCordRX += this.cordRVelX * dt;
    this.cordRBone.rotation.x = this.currentCordRX;

    this.cordRVelZ += (cordRRoll - this.currentCordRZ) * cordSpringK * dt;
    this.cordRVelZ -= this.cordRVelZ * cordDamping * dt;
    this.currentCordRZ += this.cordRVelZ * dt;
    this.cordRBone.rotation.z = this.currentCordRZ;
  }

  public setPosition(x: number, y: number, z: number) {
    this.group.position.set(x, y, z);
  }

  public dispose() {
    this.modelRoot.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else if (mesh.material) {
          mesh.material.dispose();
        }
      }
    });
  }
}

