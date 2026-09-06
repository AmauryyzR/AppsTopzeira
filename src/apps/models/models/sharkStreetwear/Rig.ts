import * as THREE from 'three';

export function createStreetwearRig() {
  const bones: THREE.Bone[] = [], index: Record<string, number> = {}, world: Record<string, THREE.Vector3> = {};
  const add = (name: string, parent: string | null, x: number, y: number, z: number) => {
    const bone = new THREE.Bone(); bone.name = name;
    world[name] = new THREE.Vector3(x, y, z); bone.position.copy(world[name]);
    if (parent) {bone.position.sub(world[parent]); bones[index[parent]].add(bone);}
    index[name] = bones.length; bones.push(bone);
  };
  add('Root', null, 0, 0, 0); add('Hips', 'Root', 0, .67, 0);
  add('Spine', 'Hips', 0, .82, 0); add('Chest', 'Spine', 0, .99, 0);
  add('Neck', 'Chest', 0, 1.075, .015); add('Head', 'Neck', 0, 1.29, .045);
  for (const [side, sign] of [['L', 1], ['R', -1]] as const) {
    add(`Clavicle_${side}`, 'Chest', sign * .11, .995, 0);
    add(`UpperArm_${side}`, `Clavicle_${side}`, sign * .183, .98, 0);
    add(`Forearm_${side}`, `UpperArm_${side}`, sign * .245, .81, .012);
    add(`Hand_${side}`, `Forearm_${side}`, sign * .285, .66, .023);
    add(`GripSocket_${side}`, `Hand_${side}`, sign * .289, .613, .04);
    add(`Thigh_${side}`, 'Hips', sign * .090, .65, 0);
    add(`Shin_${side}`, `Thigh_${side}`, sign * .105, .415, .009);
    add(`Foot_${side}`, `Shin_${side}`, sign * .118, .12, .007);
    add(`Toe_${side}`, `Foot_${side}`, sign * .118, .055, .11);
    for (let finger = 0; finger < 4; finger++) {
      const x = sign * (.26 + finger * .018);
      add(`Finger${finger + 1}_${side}`, `Hand_${side}`, x, .602, .033);
      add(`Finger${finger + 1}Tip_${side}`, `Finger${finger + 1}_${side}`, x, .576 - Math.sin(finger / 3 * Math.PI) * .010, .046);
    }
    add(`Thumb_${side}`, `Hand_${side}`, sign * .252, .630, .036);
    add(`ThumbTip_${side}`, `Thumb_${side}`, sign * .240, .606, .059);
  }
  add('BackFin', 'Hips', 0, .75, -.105);
  add('HeadSocket', 'Head', 0, 1.59, 0);
  bones[0].updateMatrixWorld(true);
  return {bones, index, world, skeleton: new THREE.Skeleton(bones)};
}
export type StreetwearRig = ReturnType<typeof createStreetwearRig>;
export function chain(rig: StreetwearRig, names: string[], point: THREE.Vector3): [number, number][] {
  let best = Infinity, result: [number, number][] = [[rig.index[names[0]], 1]];
  for (let i = 0; i < names.length - 1; i++) {
    const a = rig.world[names[i]], d = rig.world[names[i + 1]].clone().sub(a);
    const t = THREE.MathUtils.clamp(point.clone().sub(a).dot(d) / d.lengthSq(), 0, 1);
    const distance = a.clone().addScaledVector(d, t).distanceToSquared(point);
    if (distance < best) {best = distance; const w = THREE.MathUtils.smoothstep(t, .46, .97); result = [[rig.index[names[i]], 1 - w], [rig.index[names[i + 1]], w]];}
  }
  return result;
}
const track = (bone: string, times: number[], angles: number[][]) => new THREE.QuaternionKeyframeTrack(`${bone}.quaternion`, times,
  angles.flatMap(([x,y,z]) => new THREE.Quaternion().setFromEuler(new THREE.Euler(x,y,z)).toArray()));
export function streetwearAnimations() {
  return [new THREE.AnimationClip('Idle', 4, [
    track('Chest', [0,2,4], [[0,0,-.012],[.025,0,.012],[0,0,-.012]]),
    track('Head', [0,2,4], [[0,-.035,0],[.008,.035,0],[0,-.035,0]]),
  ]), new THREE.AnimationClip('Walk', 1, ['L','R'].flatMap((side,i) => {
    const s = i === 0 ? 1 : -1;
    return [track(`Thigh_${side}`, [0,.5,1], [[s*.30,0,0],[-s*.30,0,0],[s*.30,0,0]]),
      track(`Shin_${side}`, [0,.25,.5,.75,1], [[.08,0,0],[i?.03:.35,0,0],[.08,0,0],[i?.35:.03,0,0],[.08,0,0]]),
      track(`UpperArm_${side}`, [0,.5,1], [[-s*.15,0,0],[s*.15,0,0],[-s*.15,0,0]])];
  })), new THREE.AnimationClip('Wave', 3, [
    track('UpperArm_R', [0,.7,2.2,3], [[0,0,0],[0,0,-1.35],[0,0,-1.35],[0,0,0]]),
    track('Forearm_R', [0,.7,1.1,1.5,1.9,2.2,3], [[0,0,0],[0,0,-.8],[0,0,-.5],[0,0,-.8],[0,0,-.5],[0,0,-.8],[0,0,0]]),
  ])];
}
