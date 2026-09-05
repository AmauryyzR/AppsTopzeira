import * as THREE from 'three';

export function createDinoRig() {
  const bones: THREE.Bone[] = [];
  const index: Record<string, number> = {};
  const world: Record<string, THREE.Vector3> = {};
  const add = (name: string, parent: string | null, position: number[]) => {
    const bone = new THREE.Bone();
    bone.name = name;
    world[name] = new THREE.Vector3().fromArray(position);
    bone.position.copy(world[name]);
    if (parent) {
      bone.position.sub(world[parent]);
      bones[index[parent]].add(bone);
    }
    index[name] = bones.length;
    bones.push(bone);
  };
  add('Root', null, [0, 0, 0]);
  add('Hips', 'Root', [0, .91, 0]);
  add('Spine', 'Hips', [0, 1.35, 0]);
  add('Chest', 'Spine', [0, 1.77, 0]);
  add('Neck', 'Chest', [0, 2.04, 0]);
  add('Head', 'Neck', [0, 2.58, .08]);
  add('Jaw', 'Head', [0, 2.31, .40]);
  for (const [side, sign] of [['L', 1], ['R', -1]] as const) {
    add(`Clavicle.${side}`, 'Chest', [sign * .24, 1.85, 0]);
    add(`UpperArm.${side}`, `Clavicle.${side}`, [sign * .44, 1.82, 0]);
    add(`Forearm.${side}`, `UpperArm.${side}`, [sign * .72, 1.51, .03]);
    add(`Hand.${side}`, `Forearm.${side}`, [sign * .91, 1.21, .12]);
    add(`GripSocket.${side}`, `Hand.${side}`, [sign * .95, 1.18, .31]);
    add(`Thigh.${side}`, 'Hips', [sign * .255, .92, 0]);
    add(`Shin.${side}`, `Thigh.${side}`, [sign * .28, .56, .025]);
    add(`Foot.${side}`, `Shin.${side}`, [sign * .30, .20, .02]);
    add(`Toe.${side}`, `Foot.${side}`, [sign * .30, .13, .27]);
  }
  add('Tail.01', 'Hips', [0, 1.02, -.27]);
  add('Tail.02', 'Tail.01', [.20, .86, -.65]);
  add('Tail.03', 'Tail.02', [.52, .83, -.98]);
  add('Tail.04', 'Tail.03', [.83, 1.02, -1.20]);
  add('HeadSocket', 'Head', [0, 3.70, 0]);
  bones[0].updateMatrixWorld(true);
  return {bones, index, world, skeleton: new THREE.Skeleton(bones)};
}

export type DinoRig = ReturnType<typeof createDinoRig>;

/** Bind-space chain weights. Adjacent bones blend across the elbow, knee or tail joints. */
export function chainWeights(rig: DinoRig, names: string[], position: THREE.Vector3): [number, number][] {
  let bestDistance = Infinity;
  let best: [number, number][] = [[rig.index[names[0]], 1]];
  for (let i = 0; i < names.length - 1; i++) {
    const start = rig.world[names[i]];
    const end = rig.world[names[i + 1]];
    const direction = end.clone().sub(start);
    const t = THREE.MathUtils.clamp(position.clone().sub(start).dot(direction) / direction.lengthSq(), 0, 1);
    const closest = start.clone().addScaledVector(direction, t);
    const distance = closest.distanceToSquared(position);
    if (distance < bestDistance) {
      bestDistance = distance;
      const blend = THREE.MathUtils.smoothstep(t, .40, .95);
      best = [[rig.index[names[i]], 1 - blend], [rig.index[names[i + 1]], blend]];
    }
  }
  return best;
}

function rotationTrack(name: string, times: number[], eulers: number[][]) {
  const values = eulers.flatMap(([x, y, z]) => new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z)).toArray());
  return new THREE.QuaternionKeyframeTrack(`${name}.quaternion`, times, values);
}

export function createDinoAnimations(): THREE.AnimationClip[] {
  const idle = new THREE.AnimationClip('Idle', 3, [
    rotationTrack('Chest', [0, 1.5, 3], [[0, 0, -.018], [.025, 0, .018], [0, 0, -.018]]),
    rotationTrack('Head', [0, 1.5, 3], [[0, -.035, .018], [-.015, .035, -.018], [0, -.035, .018]]),
    rotationTrack('Tail.02', [0, 1.5, 3], [[0, -.10, 0], [0, .10, 0], [0, -.10, 0]]),
  ]);
  const walkTracks: THREE.KeyframeTrack[] = [];
  for (const [side, sign] of [['L', 1], ['R', -1]] as const) {
    walkTracks.push(rotationTrack(`Thigh.${side}`, [0, .4, .8], [[.40 * sign, 0, 0], [-.40 * sign, 0, 0], [.40 * sign, 0, 0]]));
    walkTracks.push(rotationTrack(`Shin.${side}`, [0, .2, .4, .6, .8], side === 'L'
      ? [[0, 0, 0], [.58, 0, 0], [.12, 0, 0], [0, 0, 0], [0, 0, 0]]
      : [[.12, 0, 0], [0, 0, 0], [0, 0, 0], [.58, 0, 0], [.12, 0, 0]]));
    walkTracks.push(rotationTrack(`UpperArm.${side}`, [0, .4, .8], [[-.28 * sign, 0, 0], [.28 * sign, 0, 0], [-.28 * sign, 0, 0]]));
    walkTracks.push(rotationTrack(`Foot.${side}`, [0, .4, .8], [[-.10 * sign, 0, 0], [.10 * sign, 0, 0], [-.10 * sign, 0, 0]]));
  }
  walkTracks.push(rotationTrack('Tail.01', [0, .4, .8], [[0, -.12, 0], [0, .12, 0], [0, -.12, 0]]));
  const walk = new THREE.AnimationClip('Walk', .8, walkTracks);
  const wave = new THREE.AnimationClip('Wave', 2.4, [
    rotationTrack('UpperArm.R', [0, .5, 1.9, 2.4], [[0, 0, 0], [0, 0, -1.55], [0, 0, -1.55], [0, 0, 0]]),
    rotationTrack('Forearm.R', [0, .5, .85, 1.2, 1.55, 1.9, 2.4], [[0, 0, 0], [0, 0, -.65], [0, 0, -.30], [0, 0, -.75], [0, 0, -.30], [0, 0, -.65], [0, 0, 0]]),
    rotationTrack('Head', [0, .6, 1.8, 2.4], [[0, 0, 0], [0, 0, .08], [0, 0, .08], [0, 0, 0]]),
  ]);
  return [idle, walk, wave];
}
