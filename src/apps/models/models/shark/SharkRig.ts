import * as THREE from 'three';

export interface SharkRigInfo {
  bones: THREE.Bone[];
  skeleton: THREE.Skeleton;
  rootBone: THREE.Bone;
  boneMap: Map<string, THREE.Bone>;
  boneIndices: Map<string, number>;
  bonePositions: Map<string, THREE.Vector3>;
}

export const BONE_DEFINITIONS: Array<{
  name: string;
  parent: string | null;
  pos: [number, number, number];
  isSocket?: boolean;
}> = [
  { name: 'Root', parent: null, pos: [0, 0, 0] },
  { name: 'Hips', parent: 'Root', pos: [0, 0.68, 0] },
  { name: 'Spine', parent: 'Hips', pos: [0, 0.88, 0.01] },
  { name: 'Chest', parent: 'Spine', pos: [0, 1.05, 0.02] },
  { name: 'Neck', parent: 'Chest', pos: [0, 1.16, 0.03] },
  { name: 'Head', parent: 'Neck', pos: [0, 1.28, 0.04] },
  { name: 'Jaw', parent: 'Head', pos: [0, 1.18, 0.14] },
  { name: 'HeadSocket', parent: 'Head', pos: [0, 1.82, 0.05], isSocket: true },

  // Left Arm
  { name: 'Clavicle.L', parent: 'Chest', pos: [0.10, 1.06, 0.01] },
  { name: 'UpperArm.L', parent: 'Clavicle.L', pos: [0.26, 1.02, 0.0] },
  { name: 'Forearm.L', parent: 'UpperArm.L', pos: [0.34, 0.78, 0.04] },
  { name: 'Hand.L', parent: 'Forearm.L', pos: [0.38, 0.54, 0.08] },
  { name: 'GripSocket.L', parent: 'Hand.L', pos: [0.39, 0.44, 0.10], isSocket: true },

  // Right Arm
  { name: 'Clavicle.R', parent: 'Chest', pos: [-0.10, 1.06, 0.01] },
  { name: 'UpperArm.R', parent: 'Clavicle.R', pos: [-0.26, 1.02, 0.0] },
  { name: 'Forearm.R', parent: 'UpperArm.R', pos: [-0.34, 0.78, 0.04] },
  { name: 'Hand.R', parent: 'Forearm.R', pos: [-0.38, 0.54, 0.08] },
  { name: 'GripSocket.R', parent: 'Hand.R', pos: [-0.39, 0.44, 0.10], isSocket: true },

  // Left Leg
  { name: 'Thigh.L', parent: 'Hips', pos: [0.12, 0.66, 0.0] },
  { name: 'Shin.L', parent: 'Thigh.L', pos: [0.13, 0.38, 0.01] },
  { name: 'Foot.L', parent: 'Shin.L', pos: [0.14, 0.14, -0.02] },
  { name: 'Toe.L', parent: 'Foot.L', pos: [0.14, 0.03, 0.12] },

  // Right Leg
  { name: 'Thigh.R', parent: 'Hips', pos: [-0.12, 0.66, 0.0] },
  { name: 'Shin.R', parent: 'Thigh.R', pos: [-0.13, 0.38, 0.01] },
  { name: 'Foot.R', parent: 'Shin.R', pos: [-0.14, 0.14, -0.02] },
  { name: 'Toe.R', parent: 'Foot.R', pos: [-0.14, 0.03, 0.12] },

  // 4-Joint Hoodie Rear Shark Tail Fin Fluke Chain (parented to Hips)
  { name: 'TailFin.01', parent: 'Hips', pos: [0, 0.72, -0.16] },
  { name: 'TailFin.02', parent: 'TailFin.01', pos: [0, 0.65, -0.18] },
  { name: 'TailFin.03', parent: 'TailFin.02', pos: [0, 0.57, -0.20] },
  { name: 'TailFin.04', parent: 'TailFin.03', pos: [0, 0.48, -0.21] },
];

export function createSharkRig(): SharkRigInfo {
  const bones: THREE.Bone[] = [];
  const boneMap = new Map<string, THREE.Bone>();
  const boneIndices = new Map<string, number>();
  const bonePositions = new Map<string, THREE.Vector3>();

  BONE_DEFINITIONS.forEach((def, index) => {
    const bone = new THREE.Bone();
    bone.name = def.name;
    bones.push(bone);
    boneMap.set(def.name, bone);
    boneIndices.set(def.name, index);
    bonePositions.set(def.name, new THREE.Vector3(...def.pos));
  });

  BONE_DEFINITIONS.forEach(def => {
    const bone = boneMap.get(def.name)!;
    if (def.parent === null) {
      bone.position.set(...def.pos);
    } else {
      const parentBone = boneMap.get(def.parent)!;
      parentBone.add(bone);
      const parentPos = bonePositions.get(def.parent)!;
      bone.position.set(
        def.pos[0] - parentPos.x,
        def.pos[1] - parentPos.y,
        def.pos[2] - parentPos.z
      );
    }
  });

  const rootBone = boneMap.get('Root')!;
  rootBone.updateWorldMatrix(true, true);

  const skeleton = new THREE.Skeleton(bones);

  return {
    bones,
    skeleton,
    rootBone,
    boneMap,
    boneIndices,
    bonePositions,
  };
}

/**
 * Computes smooth normalized weights along a chain of bones using C1 Hermite curves.
 */
export function chainWeights(
  rig: SharkRigInfo,
  chainBoneNames: string[],
  pos: THREE.Vector3
): { indices: [number, number, number, number]; weights: [number, number, number, number] } {
  if (chainBoneNames.length === 1) {
    const idx = rig.boneIndices.get(chainBoneNames[0]) ?? 0;
    return { indices: [idx, 0, 0, 0], weights: [1, 0, 0, 0] };
  }

  let bestDist = Infinity;
  let bestSeg = 0;
  let bestT = 0;

  for (let i = 0; i < chainBoneNames.length - 1; i++) {
    const pA = rig.bonePositions.get(chainBoneNames[i])!;
    const pB = rig.bonePositions.get(chainBoneNames[i + 1])!;
    const dir = new THREE.Vector3().subVectors(pB, pA);
    const lenSq = dir.lengthSq();

    let t = 0;
    if (lenSq > 1e-6) {
      const toPt = new THREE.Vector3().subVectors(pos, pA);
      t = THREE.MathUtils.clamp(toPt.dot(dir) / lenSq, 0, 1);
    }

    const proj = new THREE.Vector3().copy(pA).addScaledVector(dir, t);
    const d = proj.distanceTo(pos);

    if (d < bestDist) {
      bestDist = d;
      bestSeg = i;
      bestT = t;
    }
  }

  const idxA = rig.boneIndices.get(chainBoneNames[bestSeg]) ?? 0;
  const idxB = rig.boneIndices.get(chainBoneNames[bestSeg + 1]) ?? 0;

  // C1 Hermite smoothstep transition
  const tau = THREE.MathUtils.clamp((bestT - 0.2) / 0.6, 0, 1);
  const blend = 3 * tau * tau - 2 * tau * tau * tau;
  const wB = blend;
  const wA = 1 - blend;

  return {
    indices: [idxA, idxB, 0, 0],
    weights: [wA, wB, 0, 0],
  };
}

/**
 * Builds humanoid metadata for engine retargeting (Mecanim, Unreal, Godot).
 */
export function buildSharkHumanoidMeta() {
  return {
    humanoid: {
      hips: 'Hips',
      spine: 'Spine',
      chest: 'Chest',
      neck: 'Neck',
      head: 'Head',
      jaw: 'Jaw',
      leftShoulder: 'Clavicle.L',
      leftUpperArm: 'UpperArm.L',
      leftLowerArm: 'Forearm.L',
      leftHand: 'Hand.L',
      rightShoulder: 'Clavicle.R',
      rightUpperArm: 'UpperArm.R',
      rightLowerArm: 'Forearm.R',
      rightHand: 'Hand.R',
      leftUpperLeg: 'Thigh.L',
      leftLowerLeg: 'Shin.L',
      leftFoot: 'Foot.L',
      leftToes: 'Toe.L',
      rightUpperLeg: 'Thigh.R',
      rightLowerLeg: 'Shin.R',
      rightFoot: 'Foot.R',
      rightToes: 'Toe.R',
    },
    sockets: {
      gripLeft: 'GripSocket.L',
      gripRight: 'GripSocket.R',
      head: 'HeadSocket',
    },
    tailChain: ['TailFin.01', 'TailFin.02', 'TailFin.03', 'TailFin.04'],
    units: 'meters',
    characterHeight: 1.344,
  };
}

/**
 * Creates 3 distinct game-ready animation clips:
 * 1. Idle (3.2s) - Chest breathing + undulating harmonic wave along 4 tail fin bones.
 * 2. Walk (0.8s) - Confident streetwear bipedal stride with arm swing & synchronized tail lag.
 * 3. AnimePose (2.8s) - Stylized heroic guard stance with flexed forearms and wind in the tail.
 */
export function createSharkAnimations(rig?: SharkRigInfo): THREE.AnimationClip[] {
  const tracks: { [name: string]: THREE.KeyframeTrack[] } = {
    Idle: [],
    Walk: [],
    AnimePose: [],
  };

  const makeRotationTrack = (boneName: string, times: number[], quats: THREE.Quaternion[]) => {
    const values: number[] = [];
    quats.forEach(q => values.push(q.x, q.y, q.z, q.w));
    return new THREE.QuaternionKeyframeTrack(`${boneName}.quaternion`, times, values);
  };

  // 1. IDLE (T = 3.2s)
  {
    const times = [0, 0.8, 1.6, 2.4, 3.2];

    // Chest breathing
    const chestQuats = times.map(t => {
      const p = Math.sin((t / 3.2) * Math.PI * 2) * 0.03;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(p, 0, 0));
    });
    tracks.Idle.push(makeRotationTrack('Chest', times, chestQuats));

    // Tail fin 4-joint wave lag
    ['TailFin.01', 'TailFin.02', 'TailFin.03', 'TailFin.04'].forEach((boneName, k) => {
      const quats = times.map(t => {
        const yaw = Math.sin((t / 3.2) * Math.PI * 2 - k * 0.40) * (0.06 + k * 0.02);
        return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0));
      });
      tracks.Idle.push(makeRotationTrack(boneName, times, quats));
    });

    // Subtle arm sway
    const armLQuats = times.map(t => {
      const r = Math.sin((t / 3.2) * Math.PI * 2) * 0.015;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, r));
    });
    tracks.Idle.push(makeRotationTrack('UpperArm.L', times, armLQuats));
  }

  // 2. WALK (T = 0.8s)
  {
    const times = [0, 0.2, 0.4, 0.6, 0.8];

    // Thighs alternating
    const thighLQuats = times.map(t => {
      const p = Math.sin((t / 0.8) * Math.PI * 2) * 0.38;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(p, 0, 0));
    });
    tracks.Walk.push(makeRotationTrack('Thigh.L', times, thighLQuats));

    const thighRQuats = times.map(t => {
      const p = -Math.sin((t / 0.8) * Math.PI * 2) * 0.38;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(p, 0, 0));
    });
    tracks.Walk.push(makeRotationTrack('Thigh.R', times, thighRQuats));

    // Shins flexion
    const shinLQuats = times.map(t => {
      const p = Math.max(0, -Math.sin((t / 0.8) * Math.PI * 2)) * 0.55;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(p, 0, 0));
    });
    tracks.Walk.push(makeRotationTrack('Shin.L', times, shinLQuats));

    const shinRQuats = times.map(t => {
      const p = Math.max(0, Math.sin((t / 0.8) * Math.PI * 2)) * 0.55;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(p, 0, 0));
    });
    tracks.Walk.push(makeRotationTrack('Shin.R', times, shinRQuats));

    // Arms counter-swing
    const armLQuats = times.map(t => {
      const p = -Math.sin((t / 0.8) * Math.PI * 2) * 0.28;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(p, 0, 0));
    });
    tracks.Walk.push(makeRotationTrack('UpperArm.L', times, armLQuats));

    const armRQuats = times.map(t => {
      const p = Math.sin((t / 0.8) * Math.PI * 2) * 0.28;
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(p, 0, 0));
    });
    tracks.Walk.push(makeRotationTrack('UpperArm.R', times, armRQuats));

    // Tail fin dynamic stride oscillation
    ['TailFin.01', 'TailFin.02', 'TailFin.03', 'TailFin.04'].forEach((boneName, k) => {
      const quats = times.map(t => {
        const yaw = Math.sin((t / 0.8) * Math.PI * 2 - k * 0.50) * (0.10 + k * 0.04);
        return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0));
      });
      tracks.Walk.push(makeRotationTrack(boneName, times, quats));
    });
  }

  // 3. ANIME POSE (T = 2.8s)
  {
    const times = [0, 1.4, 2.8];

    // Head tilted
    const headQuats = times.map(() => {
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(0.04, -0.08, -0.05));
    });
    tracks.AnimePose.push(makeRotationTrack('Head', times, headQuats));

    // Arms guarded / ready
    const foreLQuats = times.map(() => {
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(0.28, 0, 0.20));
    });
    tracks.AnimePose.push(makeRotationTrack('Forearm.L', times, foreLQuats));

    const foreRQuats = times.map(() => {
      return new THREE.Quaternion().setFromEuler(new THREE.Euler(0.20, 0, -0.15));
    });
    tracks.AnimePose.push(makeRotationTrack('Forearm.R', times, foreRQuats));

    // Tail gentle breeze flutter
    ['TailFin.01', 'TailFin.02', 'TailFin.03', 'TailFin.04'].forEach((boneName, k) => {
      const quats = times.map(t => {
        const yaw = Math.sin((t / 2.8) * Math.PI * 2 - k * 0.4) * (0.05 + k * 0.02);
        return new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, 0.02 * k));
      });
      tracks.AnimePose.push(makeRotationTrack(boneName, times, quats));
    });
  }

  return [
    new THREE.AnimationClip('Idle', 3.2, tracks.Idle),
    new THREE.AnimationClip('Walk', 0.8, tracks.Walk),
    new THREE.AnimationClip('AnimePose', 2.8, tracks.AnimePose),
  ];
}
