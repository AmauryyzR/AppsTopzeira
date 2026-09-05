import * as THREE from 'three';
import { createDinoChibi } from '../../models/models/dino/DinoChibi';

export interface CharacterAnimState {
  speed: number;
  isGrounded: boolean;
  verticalVelocity: number;
  jumpSquash: number;
  turnRate: number;
  dt: number;
}

/**
 * PlayerCharacter - Chibi Dinosaur Character with Procedural 30-Bone Skeleton Animation
 * 
 * Replaces the previous primitive Leon model with the rigged, high-definition Chibi Dinosaur
 * costume model from /models. Adapts all existing gameplay kinematic animations:
 * - Dynamic Locomotion (Walk / Sprint gait with knee flexion, ankle roll & counter arm pump)
 * - Triumphant Jump Ascent (Athletic hurdle leap with raised arms and tucked knee)
 * - Aerodynamic Jump Descent (Glider pose with wide arms, poised legs & wind-lifted tail)
 * - Impact Landing Shock Absorption (Knee flexion, torso tilt, tail whip & volume squash)
 * - Idle Breathing & Head Glance (Rhythmic chest breathing and lazy tail sway)
 * - Dynamic Turn Banking & Forward Lean (Centrifugal tilt and air-resistance lean)
 * - 4-Segment Secondary Tail Physics (Locomotion wave, wind drag, banking counter-sway)
 * - Volume Preservation Squash & Stretch (Elastic vertical deformation)
 */
export class PlayerCharacter {
  public readonly group = new THREE.Group();

  // Root container for squash & stretch, banking and forward lean
  public readonly modelRoot: THREE.Group;

  // Cached bones of the 30-bone Dino rig
  private hipsBone!: THREE.Bone;
  private spineBone!: THREE.Bone;
  private chestBone!: THREE.Bone;
  private neckBone!: THREE.Bone;
  private headBone!: THREE.Bone;
  private jawBone!: THREE.Bone;

  private upperArmL!: THREE.Bone;
  private forearmL!: THREE.Bone;
  private handL!: THREE.Bone;

  private upperArmR!: THREE.Bone;
  private forearmR!: THREE.Bone;
  private handR!: THREE.Bone;

  private thighL!: THREE.Bone;
  private shinL!: THREE.Bone;
  private footL!: THREE.Bone;
  private toeL!: THREE.Bone;

  private thighR!: THREE.Bone;
  private shinR!: THREE.Bone;
  private footR!: THREE.Bone;
  private toeR!: THREE.Bone;

  private tailBones: THREE.Bone[] = [];

  // Rest reference transform
  private restHipsY = 0.91;

  // Animation Timers & Smoothing
  private walkCycleTime = 0;
  private idleTime = 0;
  private currentYaw = 0;
  private targetYaw = 0;
  private currentBankAngle = 0;
  private currentForwardLean = 0;

  // Current interpolated rotations for silky 60fps transitions
  private currentThighL = { x: 0, z: 0 };
  private currentThighR = { x: 0, z: 0 };
  private currentShinL = 0;
  private currentShinR = 0;
  private currentFootL = 0;
  private currentFootR = 0;

  private currentUpperArmL = { x: 0, z: 0 };
  private currentUpperArmR = { x: 0, z: 0 };
  private currentForearmL = 0;
  private currentForearmR = 0;

  private currentHipsY = 0.91;
  private currentSpine = { pitch: 0, yaw: 0 };
  private currentChest = { pitch: 0, yaw: 0 };
  private currentHead = { pitch: 0, yaw: 0, roll: 0 };

  private currentTail: { pitch: number; yaw: number }[] = [
    { pitch: 0, yaw: 0 },
    { pitch: 0, yaw: 0 },
    { pitch: 0, yaw: 0 },
    { pitch: 0, yaw: 0 },
  ];

  private currentScaleY = 1.0;
  private currentScaleXZ = 1.0;

  constructor() {
    this.group.name = 'PlayerCharacter_Dino_Chibi';

    // Build the procedural Chibi Dinosaur model with its 30-bone skeleton
    this.modelRoot = createDinoChibi();
    this.group.add(this.modelRoot);

    this.cacheBones();
  }

  private cacheBones() {
    const getBone = (name: string): THREE.Bone => {
      const bone = this.modelRoot.getObjectByName(name);
      if (!bone || !(bone as THREE.Bone).isBone) {
        throw new Error(`Bone "${name}" not found in DinoChibi rig`);
      }
      return bone as THREE.Bone;
    };

    this.hipsBone = getBone('Hips');
    this.spineBone = getBone('Spine');
    this.chestBone = getBone('Chest');
    this.neckBone = getBone('Neck');
    this.headBone = getBone('Head');
    this.jawBone = getBone('Jaw');

    this.upperArmL = getBone('UpperArm.L');
    this.forearmL = getBone('Forearm.L');
    this.handL = getBone('Hand.L');

    this.upperArmR = getBone('UpperArm.R');
    this.forearmR = getBone('Forearm.R');
    this.handR = getBone('Hand.R');

    this.thighL = getBone('Thigh.L');
    this.shinL = getBone('Shin.L');
    this.footL = getBone('Foot.L');
    this.toeL = getBone('Toe.L');

    this.thighR = getBone('Thigh.R');
    this.shinR = getBone('Shin.R');
    this.footR = getBone('Foot.R');
    this.toeR = getBone('Toe.R');

    this.tailBones = [
      getBone('Tail.01'),
      getBone('Tail.02'),
      getBone('Tail.03'),
      getBone('Tail.04'),
    ];

    this.restHipsY = this.hipsBone.position.y;
    this.currentHipsY = this.restHipsY;
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

    // =========================================================================
    // 1. DYNAMIC CENTRIFUGAL BANKING & SPEED LEAN
    // =========================================================================
    const targetBank = THREE.MathUtils.clamp(-turnRate * 0.065, -0.34, 0.34);
    this.currentBankAngle += (targetBank - this.currentBankAngle) * Math.min(1, 16 * dt);
    this.modelRoot.rotation.z = this.currentBankAngle;

    const baseLean = isGrounded ? Math.min(0.32, speed * 0.032) : 0.04;
    this.currentForwardLean += (baseLean - this.currentForwardLean) * Math.min(1, 14 * dt);
    this.modelRoot.rotation.x = this.currentForwardLean;

    // =========================================================================
    // 2. KINEMATICS TARGET REGISTERS
    // =========================================================================
    let targetThighLX = 0;
    let targetThighLZ = 0.05;
    let targetThighRX = 0;
    let targetThighRZ = -0.05;

    let targetShinLX = 0;
    let targetShinRX = 0;
    let targetFootLX = 0;
    let targetFootRX = 0;

    let targetUpperArmLX = 0;
    let targetUpperArmLZ = 0.10;
    let targetUpperArmRX = 0;
    let targetUpperArmRZ = -0.10;

    let targetForearmLX = 0.20;
    let targetForearmRX = 0.20;

    let targetHipsY = this.restHipsY;
    let targetSpinePitch = 0;
    let targetSpineYaw = 0;
    let targetChestPitch = 0;
    let targetChestYaw = 0;

    let targetHeadPitch = 0;
    let targetHeadYaw = 0;
    let targetHeadRoll = 0;

    const targetTailPitch = [0, 0, 0, 0];
    const targetTailYaw = [0, 0, 0, 0];

    let targetScaleY = 1.0;

    // =========================================================================
    // 3. STATE MACHINE: AERIAL VS GROUNDED
    // =========================================================================
    if (!isGrounded) {
      this.walkCycleTime = 0;

      const riseFactor = THREE.MathUtils.clamp(verticalVelocity / 11.2, 0, 1);
      const fallFactor = THREE.MathUtils.clamp(-verticalVelocity / 22.0, 0, 1);

      if (verticalVelocity >= 0) {
        // --- ASCENT / TRIUMPHANT ATHLETIC BRAWLER LEAP ---
        // Arms: Raised high in celebratory jump!
        targetUpperArmLZ = 1.65 * riseFactor + 0.15 * (1 - riseFactor);
        targetUpperArmRZ = -1.65 * riseFactor - 0.15 * (1 - riseFactor);
        targetUpperArmLX = -0.32 * riseFactor;
        targetUpperArmRX = -0.32 * riseFactor;
        targetForearmLX = 0.60 * riseFactor;
        targetForearmRX = 0.60 * riseFactor;

        // Legs: Dynamic athletic hurdle leap (Left knee tucked high, right leg trailing back)
        targetThighLX = 0.75 * riseFactor + 0.10 * (1 - riseFactor);
        targetShinLX = 0.70 * riseFactor;
        targetFootLX = -0.15 * riseFactor;

        targetThighRX = -0.50 * riseFactor + 0.05 * (1 - riseFactor);
        targetShinRX = 0.30 * riseFactor;
        targetFootRX = 0.15 * riseFactor;

        // Head looking up at jump apex
        targetHeadPitch = -0.26 * riseFactor;
        targetSpinePitch = -0.12 * riseFactor;
        targetChestPitch = -0.10 * riseFactor;

        // Upward speed-line stretch
        targetScaleY = 1.0 + 0.15 * riseFactor;

        // Tail dragged down by upward rush of air
        targetTailPitch[0] = -0.35 * riseFactor;
        targetTailPitch[1] = -0.45 * riseFactor;
        targetTailPitch[2] = -0.40 * riseFactor;
        targetTailPitch[3] = -0.35 * riseFactor;
      } else {
        // --- DESCENT / FAST AERODYNAMIC FALL ---
        // Arms: Spread wide like glider wings for aerodynamic balance in rushing air
        targetUpperArmLZ = 0.92 * fallFactor + 0.20 * (1 - fallFactor);
        targetUpperArmRZ = -0.92 * fallFactor - 0.20 * (1 - fallFactor);
        targetUpperArmLX = 0.22 * fallFactor;
        targetUpperArmRX = 0.22 * fallFactor;
        targetForearmLX = 0.35 * fallFactor;
        targetForearmRX = 0.35 * fallFactor;

        // Legs: Reaching downward, poised to absorb touchdown
        targetThighLX = 0.20 * fallFactor;
        targetShinLX = 0.25 * fallFactor;
        targetThighRX = 0.15 * fallFactor;
        targetShinRX = 0.25 * fallFactor;

        // Head looking directly down at landing zone
        targetHeadPitch = 0.28 * fallFactor;
        targetSpinePitch = 0.16 * fallFactor;
        targetChestPitch = 0.14 * fallFactor;

        // Subtle aerodynamic elongation
        targetScaleY = 1.0 + 0.06 * fallFactor;

        // Wind pushes tail straight up towards the sky
        targetTailPitch[0] = 0.45 * fallFactor;
        targetTailPitch[1] = 0.60 * fallFactor;
        targetTailPitch[2] = 0.55 * fallFactor;
        targetTailPitch[3] = 0.50 * fallFactor;
      }
    } else {
      // --- GROUNDED STATES ---
      const squashFactor = THREE.MathUtils.clamp(jumpSquash * 0.75, 0, 0.24);

      if (squashFactor > 0.01) {
        // --- CRISP NATURAL IMPACT LANDING (NO COLLAPSE) ---
        targetScaleY = Math.max(0.80, 1.0 - squashFactor);
        targetHipsY = this.restHipsY - squashFactor * 0.35;

        // Knees bend naturally forward & flex outward to absorb shock
        targetThighLX = squashFactor * 0.90;
        targetThighRX = squashFactor * 0.90;
        targetThighLZ = 0.05 + squashFactor * 0.15;
        targetThighRZ = -0.05 - squashFactor * 0.15;
        targetShinLX = squashFactor * 1.10;
        targetShinRX = squashFactor * 1.10;

        // Arms drop naturally to sides
        targetUpperArmLX = squashFactor * 0.45;
        targetUpperArmRX = squashFactor * 0.45;
        targetUpperArmLZ = 0.10 + squashFactor * 0.30;
        targetUpperArmRZ = -0.10 - squashFactor * 0.30;
        targetForearmLX = 0.25 + squashFactor * 0.35;
        targetForearmRX = 0.25 + squashFactor * 0.35;

        // Torso tilts slightly forward on impact
        targetSpinePitch = squashFactor * 0.24;
        targetChestPitch = squashFactor * 0.20;
        targetHeadPitch = -squashFactor * 0.12;

        // Tail whips down on floor contact
        targetTailPitch[0] = -squashFactor * 0.55;
        targetTailPitch[1] = -squashFactor * 0.65;
        targetTailPitch[2] = -squashFactor * 0.60;
        targetTailPitch[3] = -squashFactor * 0.50;
      } else if (speed > 0.20) {
        // --- RUNNING / SPRINTING LOCOMOTION ---
        const strideCadence = Math.min(18, 6.5 + speed * 1.6);
        this.walkCycleTime += dt * strideCadence;

        const sinStride = Math.sin(this.walkCycleTime);
        const cosStride = Math.cos(this.walkCycleTime);
        const runFactor = THREE.MathUtils.clamp(speed / 6.0, 0.4, 1.35);

        // Legs: Pitch forward and back with springy knee flexion on recovery
        targetThighLX = sinStride * (0.48 * runFactor);
        targetThighRX = -sinStride * (0.48 * runFactor);

        targetShinLX = Math.max(0, -sinStride) * (0.75 * runFactor) + Math.max(0, cosStride * 0.2) * runFactor;
        targetShinRX = Math.max(0, sinStride) * (0.75 * runFactor) + Math.max(0, -cosStride * 0.2) * runFactor;

        targetFootLX = cosStride * (-0.18 * runFactor);
        targetFootRX = -cosStride * (-0.18 * runFactor);

        // Arms: Energetic counter-pump with natural elbow bend
        targetUpperArmLX = -sinStride * (0.42 * runFactor);
        targetUpperArmRX = sinStride * (0.42 * runFactor);
        targetUpperArmLZ = 0.14 + Math.abs(cosStride) * 0.08 * runFactor;
        targetUpperArmRZ = -0.14 - Math.abs(cosStride) * 0.08 * runFactor;

        targetForearmLX = 0.30 + Math.max(0, sinStride) * (0.35 * runFactor);
        targetForearmRX = 0.30 + Math.max(0, -sinStride) * (0.35 * runFactor);

        // Pelvic bounce and torso counter-twist
        const bounce = Math.abs(cosStride) * (0.045 * runFactor);
        targetHipsY = this.restHipsY + bounce;
        targetSpineYaw = sinStride * (0.12 * runFactor);
        targetChestYaw = sinStride * (0.06 * runFactor);
        targetChestPitch = 0.08 * runFactor;

        targetHeadYaw = -sinStride * (0.05 * runFactor);
        targetHeadPitch = -0.04 * runFactor;

        // Tail: Rhythmic side-to-side wagging following the hips
        targetTailYaw[0] = sinStride * (0.20 * runFactor);
        targetTailYaw[1] = Math.sin(this.walkCycleTime - 0.3) * (0.28 * runFactor);
        targetTailYaw[2] = Math.sin(this.walkCycleTime - 0.6) * (0.35 * runFactor);
        targetTailYaw[3] = Math.sin(this.walkCycleTime - 0.9) * (0.42 * runFactor);
        targetTailPitch[0] = bounce * 1.5;
        targetTailPitch[1] = bounce * 2.0;
      } else {
        // --- IDLE WITH GENTLE BREATHING ---
        this.walkCycleTime = 0;

        const breathe = Math.sin(this.idleTime * 2.6);

        targetChestPitch = 0.025 + breathe * 0.03;
        targetSpinePitch = 0.01 + breathe * 0.015;
        targetHipsY = this.restHipsY + breathe * 0.012;

        targetUpperArmLX = 0.05;
        targetUpperArmLZ = 0.08 + breathe * 0.025;
        targetUpperArmRX = 0.05;
        targetUpperArmRZ = -0.08 - breathe * 0.025;
        targetForearmLX = 0.18;
        targetForearmRX = 0.18;

        targetHeadPitch = -breathe * 0.02 + Math.sin(this.idleTime * 0.9) * 0.035;
        targetHeadYaw = Math.sin(this.idleTime * 0.7) * 0.05;
        targetHeadRoll = Math.sin(this.idleTime * 0.8) * 0.025;

        // Tail: Gentle, lazy hypnotic sway
        targetTailYaw[0] = Math.sin(this.idleTime * 1.5) * 0.08;
        targetTailYaw[1] = Math.sin(this.idleTime * 1.5 - 0.4) * 0.14;
        targetTailYaw[2] = Math.sin(this.idleTime * 1.5 - 0.8) * 0.18;
        targetTailYaw[3] = Math.sin(this.idleTime * 1.5 - 1.2) * 0.22;
        targetTailPitch[0] = Math.sin(this.idleTime * 2.2) * 0.03;
        targetTailPitch[1] = Math.sin(this.idleTime * 2.2 - 0.3) * 0.05;
      }
    }

    // Centrifugal banking counter-sway on the tail
    targetTailYaw[0] += -this.currentBankAngle * 0.35;
    targetTailYaw[1] += -this.currentBankAngle * 0.55;
    targetTailYaw[2] += -this.currentBankAngle * 0.70;
    targetTailYaw[3] += -this.currentBankAngle * 0.85;

    // =========================================================================
    // 4. VOLUME PRESERVATION (SQUASH & STRETCH)
    // =========================================================================
    const targetScaleXZ = 1.0 / Math.sqrt(Math.max(0.2, targetScaleY));
    const smoothRate = Math.min(1, 20 * dt);

    this.currentScaleY += (targetScaleY - this.currentScaleY) * smoothRate;
    this.currentScaleXZ += (targetScaleXZ - this.currentScaleXZ) * smoothRate;
    this.modelRoot.scale.set(
      0.35 * this.currentScaleXZ,
      0.35 * this.currentScaleY,
      0.35 * this.currentScaleXZ
    );

    // =========================================================================
    // 5. SMOOTH INTERPOLATION ACROSS ALL BONES (ZERO JITTER / POPPING)
    // =========================================================================
    const legLerpRate = Math.min(1, 24 * dt);
    this.currentThighL.x += (targetThighLX - this.currentThighL.x) * legLerpRate;
    this.currentThighL.z += (targetThighLZ - this.currentThighL.z) * legLerpRate;
    this.currentThighR.x += (targetThighRX - this.currentThighR.x) * legLerpRate;
    this.currentThighR.z += (targetThighRZ - this.currentThighR.z) * legLerpRate;

    this.currentShinL += (targetShinLX - this.currentShinL) * legLerpRate;
    this.currentShinR += (targetShinRX - this.currentShinR) * legLerpRate;
    this.currentFootL += (targetFootLX - this.currentFootL) * legLerpRate;
    this.currentFootR += (targetFootRX - this.currentFootR) * legLerpRate;

    const armLerpRate = Math.min(1, 24 * dt);
    this.currentUpperArmL.x += (targetUpperArmLX - this.currentUpperArmL.x) * armLerpRate;
    this.currentUpperArmL.z += (targetUpperArmLZ - this.currentUpperArmL.z) * armLerpRate;
    this.currentUpperArmR.x += (targetUpperArmRX - this.currentUpperArmR.x) * armLerpRate;
    this.currentUpperArmR.z += (targetUpperArmRZ - this.currentUpperArmR.z) * armLerpRate;
    this.currentForearmL += (targetForearmLX - this.currentForearmL) * armLerpRate;
    this.currentForearmR += (targetForearmRX - this.currentForearmR) * armLerpRate;

    const spineLerpRate = Math.min(1, 18 * dt);
    this.currentHipsY += (targetHipsY - this.currentHipsY) * Math.min(1, 22 * dt);
    this.currentSpine.pitch += (targetSpinePitch - this.currentSpine.pitch) * spineLerpRate;
    this.currentSpine.yaw += (targetSpineYaw - this.currentSpine.yaw) * spineLerpRate;
    this.currentChest.pitch += (targetChestPitch - this.currentChest.pitch) * spineLerpRate;
    this.currentChest.yaw += (targetChestYaw - this.currentChest.yaw) * spineLerpRate;

    const headLerpRate = Math.min(1, 16 * dt);
    this.currentHead.pitch += (targetHeadPitch - this.currentHead.pitch) * headLerpRate;
    this.currentHead.yaw += (targetHeadYaw - this.currentHead.yaw) * headLerpRate;
    this.currentHead.roll += (targetHeadRoll - this.currentHead.roll) * headLerpRate;

    const tailLerpRate = Math.min(1, 14 * dt);
    for (let i = 0; i < 4; i++) {
      this.currentTail[i].pitch += (targetTailPitch[i] - this.currentTail[i].pitch) * tailLerpRate;
      this.currentTail[i].yaw += (targetTailYaw[i] - this.currentTail[i].yaw) * tailLerpRate;
    }

    // =========================================================================
    // 6. APPLY TO DINOSAUR SKELETON
    // =========================================================================
    this.hipsBone.position.y = this.currentHipsY;

    this.thighL.rotation.set(this.currentThighL.x, 0, this.currentThighL.z);
    this.thighR.rotation.set(this.currentThighR.x, 0, this.currentThighR.z);
    this.shinL.rotation.set(this.currentShinL, 0, 0);
    this.shinR.rotation.set(this.currentShinR, 0, 0);
    this.footL.rotation.set(this.currentFootL, 0, 0);
    this.footR.rotation.set(this.currentFootR, 0, 0);

    this.upperArmL.rotation.set(this.currentUpperArmL.x, 0, this.currentUpperArmL.z);
    this.upperArmR.rotation.set(this.currentUpperArmR.x, 0, this.currentUpperArmR.z);
    this.forearmL.rotation.set(this.currentForearmL, 0, 0.15);
    this.forearmR.rotation.set(this.currentForearmR, 0, -0.15);

    this.spineBone.rotation.set(this.currentSpine.pitch, this.currentSpine.yaw, 0);
    this.chestBone.rotation.set(this.currentChest.pitch, this.currentChest.yaw, 0);
    this.headBone.rotation.set(this.currentHead.pitch, this.currentHead.yaw, this.currentHead.roll);

    for (let i = 0; i < 4; i++) {
      this.tailBones[i].rotation.set(this.currentTail[i].pitch, this.currentTail[i].yaw, 0);
    }
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
