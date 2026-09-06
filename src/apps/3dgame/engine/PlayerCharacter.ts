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
  private restHipsY = 0.35;

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
    leftZ: 0.12,
    rightX: 0,
    rightZ: -0.12,
    forearmLX: 0.25,
    forearmRX: 0.25,
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
  private currentHipsY = 0.35;

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
    // 1. World positions derived from vertex-weight centroids for all 41 bones
    const WORLD_POS: Record<string, [number, number, number]> = {
      Root: [0, 0, 0],
      Armature: [0, 0, 0],
      Hip: [0, 0.35, 0.07],
      Pelvis: [0, 0.35, 0.07],
      Waist: [-0.01, 0.37, 0.07],
      Spine01: [-0.01, 0.44, 0.05],
      Spine02: [-0.01, 0.53, 0.11],
      NeckTwist01: [-0.019, 0.618, 0.101],
      NeckTwist02: [-0.008, 0.630, 0.044],
      Head: [-0.033, 0.720, 0.088],

      L_Clavicle: [0.050, 0.621, 0.083],
      L_Upperarm: [0.085, 0.534, 0.090],
      L_UpperarmTwist01: [0.070, 0.582, 0.082],
      L_UpperarmTwist02: [0.098, 0.486, 0.098],
      L_Forearm: [0.116, 0.426, 0.130],
      L_ForearmTwist01: [0.116, 0.444, 0.113],
      L_ForearmTwist02: [0.117, 0.408, 0.148],
      L_Hand: [0.107, 0.323, 0.171],

      R_Clavicle: [-0.077, 0.610, 0.080],
      R_Upperarm: [-0.121, 0.556, 0.055],
      R_UpperarmTwist01: [-0.115, 0.611, 0.055],
      R_UpperarmTwist02: [-0.127, 0.501, 0.054],
      R_Forearm: [-0.158, 0.438, 0.077],
      R_ForearmTwist01: [-0.150, 0.462, 0.061],
      R_ForearmTwist02: [-0.167, 0.415, 0.093],
      R_Hand: [-0.162, 0.335, 0.124],

      L_Thigh: [0.055, 0.330, 0.080],
      L_ThighTwist01: [0.043, 0.347, 0.070],
      L_ThighTwist02: [0.070, 0.226, 0.119],
      L_Calf: [0.098, 0.155, 0.124],
      L_CalfTwist01: [0.098, 0.155, 0.124],
      L_CalfTwist02: [0.117, 0.086, 0.127],
      L_Foot: [0.143, 0.043, 0.145],
      L_ToeBase: [0.167, 0.035, 0.196],

      R_Thigh: [-0.080, 0.330, 0.080],
      R_ThighTwist01: [-0.091, 0.357, 0.109],
      R_ThighTwist02: [-0.085, 0.227, 0.077],
      R_Calf: [-0.094, 0.155, 0.068],
      R_CalfTwist01: [-0.094, 0.145, 0.068],
      R_CalfTwist02: [-0.078, 0.082, 0.056],
      R_Foot: [-0.094, 0.045, 0.067],
      R_ToeBase: [-0.107, 0.037, 0.122],
    };

    // 2. Recursively set local positions from rest centroids
    const setBoneLocalPositions = (bone: THREE.Object3D) => {
      const wp = WORLD_POS[bone.name] || [0, 0, 0];
      let parentWp: [number, number, number] = [0, 0, 0];
      if (bone.parent && WORLD_POS[bone.parent.name]) {
        parentWp = WORLD_POS[bone.parent.name];
      }
      bone.position.set(wp[0] - parentWp[0], wp[1] - parentWp[1], wp[2] - parentWp[2]);
      bone.rotation.set(0, 0, 0);
      bone.scale.set(1, 1, 1);
      bone.children.forEach((c) => {
        if ((c as THREE.Bone).isBone) setBoneLocalPositions(c);
      });
    };

    const rootBone = scene.getObjectByName('Root') as THREE.Bone;
    if (rootBone) setBoneLocalPositions(rootBone);

    // 3. Bind runtime animated bone pointers to the armature joints
    const getBone = (name: string): THREE.Bone => {
      const found = scene.getObjectByName(name);
      return (found as THREE.Bone) || this.hipsBone;
    };

    if (rootBone) this.rootBone = rootBone;
    const hip = scene.getObjectByName('Hip') as THREE.Bone;
    if (hip) {
      this.hipsBone = hip;
      this.restHipsY = hip.position.y;
      this.currentHipsY = this.restHipsY;
    }

    const spine1 = scene.getObjectByName('Spine01') as THREE.Bone;
    if (spine1) this.spineBone = spine1;

    const spine2 = scene.getObjectByName('Spine02') as THREE.Bone;
    if (spine2) this.chestBone = spine2;

    const neck = (scene.getObjectByName('NeckTwist02') || scene.getObjectByName('NeckTwist01')) as THREE.Bone;
    if (neck) this.neckBone = neck;

    const head = scene.getObjectByName('Head') as THREE.Bone;
    if (head) this.headBone = head;

    // Arms
    const uArmL = scene.getObjectByName('L_Upperarm') as THREE.Bone;
    if (uArmL) this.upperArmL = uArmL;
    const fArmL = scene.getObjectByName('L_Forearm') as THREE.Bone;
    if (fArmL) this.forearmL = fArmL;
    const handL = scene.getObjectByName('L_Hand') as THREE.Bone;
    if (handL) this.handL = handL;

    const uArmR = scene.getObjectByName('R_Upperarm') as THREE.Bone;
    if (uArmR) this.upperArmR = uArmR;
    const fArmR = scene.getObjectByName('R_Forearm') as THREE.Bone;
    if (fArmR) this.forearmR = fArmR;
    const handR = scene.getObjectByName('R_Hand') as THREE.Bone;
    if (handR) this.handR = handR;

    // Legs
    const thighL = scene.getObjectByName('L_Thigh') as THREE.Bone;
    if (thighL) this.thighL = thighL;
    const calfL = scene.getObjectByName('L_Calf') as THREE.Bone;
    if (calfL) this.shinL = calfL;
    const footL = scene.getObjectByName('L_Foot') as THREE.Bone;
    if (footL) this.footL = footL;

    const thighR = scene.getObjectByName('R_Thigh') as THREE.Bone;
    if (thighR) this.thighR = thighR;
    const calfR = scene.getObjectByName('R_Calf') as THREE.Bone;
    if (calfR) this.shinR = calfR;
    const footR = scene.getObjectByName('R_Foot') as THREE.Bone;
    if (footR) this.footR = footR;

    // 4. Update matrices and calculate exact inverse bind matrices
    scene.updateMatrixWorld(true);
    skinnedMesh.skeleton.calculateInverses();

    // 5. Calibrate material colors, roughness and shadows specifically for shark chibi
    skinnedMesh.castShadow = true;
    skinnedMesh.receiveShadow = true;
    skinnedMesh.frustumCulled = false;

    if (skinnedMesh.material) {
      const mats = Array.isArray(skinnedMesh.material) ? skinnedMesh.material : [skinnedMesh.material];
      mats.forEach((m) => {
        if ((m as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
          const stdMat = m as THREE.MeshStandardMaterial;
          // Compensate for 0.80 baseColorFactor to make colors vibrant and clean
          stdMat.color.setRGB(1.08, 1.08, 1.08);
          stdMat.roughness = 0.46;
          stdMat.metalness = 0.0;
          stdMat.shadowSide = THREE.DoubleSide;
        }
      });
    }

    // 6. Add loaded scene directly to modelRoot
    this.modelRoot.add(scene);
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
    let targetLeftArmX = 0;
    let targetLeftArmZ = 0.12;
    let targetRightArmX = 0;
    let targetRightArmZ = -0.12;
    let targetForearmLX = 0.25;
    let targetForearmRX = 0.25;

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
        // Arms: Celebratory victory leap raised high
        targetLeftArmZ = 2.65 * riseFactor + 0.35 * (1 - riseFactor);
        targetRightArmZ = -2.65 * riseFactor - 0.35 * (1 - riseFactor);
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
        targetLeftArmZ = 0.95 * fallFactor + 0.50 * (1 - fallFactor);
        targetRightArmZ = -0.95 * fallFactor - 0.50 * (1 - fallFactor);
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
        targetLeftArmZ = 0.24 + squashFactor * 0.35;
        targetRightArmZ = -0.24 - squashFactor * 0.35;
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
        targetLeftArmZ = 0.18 + Math.abs(cosStride) * 0.10;
        targetRightArmZ = -0.18 - Math.abs(cosStride) * 0.10;
        targetForearmLX = 0.35 + Math.max(0, sinStride) * 0.48;
        targetForearmRX = 0.35 + Math.max(0, -sinStride) * 0.48;

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

        targetLeftArmZ = 0.12 - breathe * 0.4;
        targetRightArmZ = -0.12 + breathe * 0.4;

        targetTorsoRotX = breathe * 0.8;
        targetHeadRotX = -breathe * 0.5;
        targetForearmLX = 0.25;
        targetForearmRX = 0.25;

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

