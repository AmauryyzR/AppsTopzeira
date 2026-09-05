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
 * PlayerCharacter - Chibi Dinosaur Character
 * 
 * Scaled 50% larger (base scale 0.525 instead of 0.35) for prominent presence on the park map.
 * Recreates the exact high-energy kinematics of the original character (triumphant athletic
 * brawler leap, glider fall, punchy running stride, landing impact squash, banking, and
 * 4-segment tail wave aerodynamics) precisely mapped onto the 30-bone dinosaur skeleton.
 */
export class PlayerCharacter {
  public readonly group = new THREE.Group();

  // Root container for squash & stretch, banking and forward lean
  // Scaled 50% larger on the game map (0.35 * 1.5 = 0.525)
  public readonly modelRoot: THREE.Group;
  private readonly baseScale = 0.525;

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

  // Smooth aerial, stride and landing kinematics
  private currentArmRot = {
    leftX: 0,
    leftZ: 0.10,
    rightX: 0,
    rightZ: -0.10,
    forearmLX: 0.20,
    forearmRX: 0.20,
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
  private currentHipsY = 0.91;

  private currentTailRotX = [0, 0, 0, 0];
  private currentTailRotY = [0, 0, 0, 0];

  constructor() {
    this.group.name = 'PlayerCharacter_GemniDINO';

    // Build the procedural Chibi Dinosaur model with its 30-bone skeleton
    this.modelRoot = createDinoChibi();
    this.modelRoot.scale.setScalar(this.baseScale);
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
    while (this.currentYaw < -Math.PI) this.currentYaw -= 2 * Math.PI;

    this.group.rotation.y = this.currentYaw;
  }

  public updateAnimation(state: CharacterAnimState) {
    const { speed, isGrounded, verticalVelocity, jumpSquash, turnRate, dt } = state;

    this.idleTime += dt;

    // 1. Dynamic Banking (turns) & Forward Lean (Exact original character formulation)
    const targetBank = THREE.MathUtils.clamp(-turnRate * 0.065, -0.34, 0.34);
    this.currentBankAngle += (targetBank - this.currentBankAngle) * Math.min(1, 16 * dt);
    this.modelRoot.rotation.z = this.currentBankAngle;

    const baseLean = isGrounded ? Math.min(0.32, speed * 0.032) : 0.04;
    this.currentForwardLean += (baseLean - this.currentForwardLean) * Math.min(1, 14 * dt);
    this.modelRoot.rotation.x = this.currentForwardLean;

    // Kinematics Target Registers
    let targetLeftArmX = 0;
    let targetLeftArmZ = 0.10;
    let targetRightArmX = 0;
    let targetRightArmZ = -0.10;
    let targetForearmLX = 0.20;
    let targetForearmRX = 0.20;

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
    let tailVerticalOffset = 0;

    // 2. State Machine: Aerial (Jump/Fall) vs Grounded (Impact/Run/Idle)
    if (!isGrounded) {
      this.walkCycleTime = 0;

      const riseFactor = THREE.MathUtils.clamp(verticalVelocity / 11.2, 0, 1);
      const fallFactor = THREE.MathUtils.clamp(-verticalVelocity / 22.0, 0, 1);

      if (verticalVelocity >= 0) {
        // --- ASCENT / TRIUMPHANT ATHLETIC BRAWLER LEAP ---
        // Arms: Raised high above the head in an iconic celebratory/athletic jump!
        targetLeftArmZ = 2.70 * riseFactor + 0.35 * (1 - riseFactor);
        targetRightArmZ = -2.70 * riseFactor - 0.35 * (1 - riseFactor);
        targetLeftArmX = -0.20 * riseFactor;
        targetRightArmX = -0.20 * riseFactor;
        targetForearmLX = 0.45 * riseFactor;
        targetForearmRX = 0.45 * riseFactor;

        // Legs: Dynamic athletic hurdle leap (Left knee tucked high, right leg kicking back)
        targetLeftLegX = 0.95 * riseFactor + 0.20 * (1 - riseFactor);
        targetLeftLegZ = 0.18 * riseFactor;
        targetShinLX = 0.90 * riseFactor;
        targetFootLX = -0.20 * riseFactor;

        targetRightLegX = -0.65 * riseFactor + 0.10 * (1 - riseFactor);
        targetRightLegZ = -0.16 * riseFactor;
        targetShinRX = 0.45 * riseFactor;
        targetFootRX = 0.20 * riseFactor;

        // Head looking up at jump apex
        targetHeadRotX = -0.28 * riseFactor;
        targetTorsoRotX = -0.14 * riseFactor;

        // Upward speed-line stretch
        targetScaleY = 1.0 + 0.15 * riseFactor;

        // Tail dragged down by upward rush of air
        tailVerticalOffset = -0.45 * riseFactor;
      } else {
        // --- DESCENT / FAST AERODYNAMIC FALL ---
        // Arms: Spread wide like wings for aerodynamic balance in rushing air
        targetLeftArmZ = 0.95 * fallFactor + 0.50 * (1 - fallFactor);
        targetRightArmZ = -0.95 * fallFactor - 0.50 * (1 - fallFactor);
        targetLeftArmX = 0.25 * fallFactor;
        targetRightArmX = 0.25 * fallFactor;
        targetForearmLX = 0.35 * fallFactor;
        targetForearmRX = 0.35 * fallFactor;

        // Legs: Reaching downward, poised to absorb touchdown
        targetLeftLegX = 0.25 * fallFactor + 0.10 * (1 - fallFactor);
        targetLeftLegZ = 0.08 * fallFactor;
        targetShinLX = 0.30 * fallFactor;

        targetRightLegX = 0.15 * fallFactor + 0.08 * (1 - fallFactor);
        targetRightLegZ = -0.08 * fallFactor;
        targetShinRX = 0.30 * fallFactor;

        // Head looking directly down at the landing zone
        targetHeadRotX = 0.28 * fallFactor;
        targetTorsoRotX = 0.20 * fallFactor;

        // Subtle aerodynamic elongation
        targetScaleY = 1.0 + 0.06 * fallFactor;

        // Wind pushes tail straight up towards the sky
        tailVerticalOffset = 0.70 * fallFactor;
      }
    } else {
      // --- GROUNDED STATES ---
      const squashFactor = THREE.MathUtils.clamp(jumpSquash * 0.75, 0, 0.22);

      if (squashFactor > 0.01) {
        // --- CRISP NATURAL IMPACT LANDING (NO COLLAPSE) ---
        targetScaleY = Math.max(0.82, 1.0 - squashFactor); // Gentle, responsive cartoon squash
        targetHipsY = this.restHipsY - squashFactor * 0.35;

        // Knees bend naturally forward to absorb touchdown shock
        targetLeftLegX = squashFactor * 0.85;
        targetRightLegX = squashFactor * 0.85;
        targetLeftLegZ = squashFactor * 0.12;
        targetRightLegZ = -squashFactor * 0.12;
        targetShinLX = squashFactor * 1.35;
        targetShinRX = squashFactor * 1.35;
        targetFootLX = -squashFactor * 0.30;
        targetFootRX = -squashFactor * 0.30;

        // Arms drop naturally to sides
        targetLeftArmX = squashFactor * 0.60;
        targetRightArmX = squashFactor * 0.60;
        targetLeftArmZ = 0.22 + squashFactor * 0.35;
        targetRightArmZ = -0.22 - squashFactor * 0.35;
        targetForearmLX = 0.25 + squashFactor * 0.40;
        targetForearmRX = 0.25 + squashFactor * 0.40;

        // Torso tilts slightly forward on impact
        targetTorsoRotX = squashFactor * 0.22;
        targetHeadRotX = -squashFactor * 0.10;

        // Tail whips down on floor contact
        tailVerticalOffset = -squashFactor * 0.50;
      } else if (speed > 0.20) {
        // --- RUNNING / SPRINTING (Exact original cartoon stride amplitude) ---
        const strideCadence = Math.min(18, 6.5 + speed * 1.5);
        this.walkCycleTime += dt * strideCadence;

        const sinStride = Math.sin(this.walkCycleTime);
        const cosStride = Math.cos(this.walkCycleTime);

        // Legs: Full 0.95 radian stride swing with springy knee flexion on recovery
        targetLeftLegX = sinStride * 0.95;
        targetRightLegX = -sinStride * 0.95;
        targetShinLX = Math.max(0, -sinStride) * 1.15;
        targetShinRX = Math.max(0, sinStride) * 1.15;
        targetFootLX = -cosStride * 0.35;
        targetFootRX = cosStride * 0.35;

        // Arms: Full 0.92 radian punchy counter-pump
        targetLeftArmX = -sinStride * 0.92;
        targetRightArmX = sinStride * 0.92;
        targetLeftArmZ = 0.18 + Math.abs(cosStride) * 0.10;
        targetRightArmZ = -0.18 - Math.abs(cosStride) * 0.10;
        targetForearmLX = 0.35 + Math.max(0, sinStride) * 0.50;
        targetForearmRX = 0.35 + Math.max(0, -sinStride) * 0.50;

        const bounce = Math.abs(cosStride) * 0.055;
        targetHipsY = this.restHipsY + bounce;
        targetTorsoRotY = sinStride * 0.12;
        targetHeadRotY = -sinStride * 0.04;
      } else {
        // --- IDLE WITH GENTLE BREATHING ---
        this.walkCycleTime = 0;

        const breathe = Math.sin(this.idleTime * 2.8) * 0.012;
        targetHipsY = this.restHipsY + breathe * 1.5;

        targetLeftArmZ = 0.10 - breathe * 0.5;
        targetRightArmZ = -0.10 + breathe * 0.5;

        targetTorsoRotX = breathe * 1.0;
        targetHeadRotX = -breathe * 0.6;
        targetForearmLX = 0.20;
        targetForearmRX = 0.20;
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

    // 4. Smoothly Interpolate Skeleton Joints (Zero Snapping / Zero Popping)
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

    // 5. Tail Secondary Physics (Exact original formula across 4 dinosaur joints)
    const tailSpeed = Math.min(1.0, speed * 0.12);
    const tailWave = Math.sin(this.idleTime * 3.0 + speed * 2.0) * (0.06 + speed * 0.04);
    const walkWag = speed > 0.20 ? Math.sin(this.walkCycleTime) * 0.26 : 0;

    for (let s = 0; s < this.tailBones.length; s++) {
      const seg = this.tailBones[s];
      const targetRotX = THREE.MathUtils.clamp(
        -0.1 + tailSpeed * 0.2 + tailWave * 0.5 + tailVerticalOffset * (s + 1) * 0.25,
        -0.55,
        0.65
      );
      this.currentTailRotX[s] += (targetRotX - this.currentTailRotX[s]) * Math.min(1, 14 * dt);
      seg.rotation.x = this.currentTailRotX[s];

      const lag = Math.sin(this.walkCycleTime - s * 0.35) * (walkWag !== 0 ? 0.32 : 0);
      const targetRotY = -this.currentBankAngle * (s + 1) * 0.25 + lag;
      this.currentTailRotY[s] += (targetRotY - this.currentTailRotY[s]) * Math.min(1, 14 * dt);
      seg.rotation.y = this.currentTailRotY[s];
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
